import logging
from openai import AsyncOpenAI
from sqlalchemy import text, select, delete, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.models.document_chunk import DocumentChunk

logger = logging.getLogger(__name__)

_openai_client: AsyncOpenAI | None = None


def _get_openai_client() -> AsyncOpenAI:
    global _openai_client
    if _openai_client is None:
        _openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    return _openai_client


async def generate_embedding(text_input: str) -> list[float]:
    """Generate an embedding vector for the given text using OpenAI."""
    client = _get_openai_client()
    response = await client.embeddings.create(
        input=text_input,
        model=settings.EMBEDDING_MODEL,
        dimensions=settings.EMBEDDING_DIMENSIONS,
    )
    return response.data[0].embedding


async def generate_embeddings_batch(texts: list[str]) -> list[list[float]]:
    """Generate embeddings for a batch of texts."""
    client = _get_openai_client()
    # OpenAI supports batches up to ~2048 inputs
    batch_size = 100
    all_embeddings = []

    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        response = await client.embeddings.create(
            input=batch,
            model=settings.EMBEDDING_MODEL,
            dimensions=settings.EMBEDDING_DIMENSIONS,
        )
        all_embeddings.extend([d.embedding for d in response.data])

    return all_embeddings


async def add_documents(
    db: AsyncSession,
    texts: list[str],
    headers: list[str],
    metadatas: list[dict],
    ids: list[str],
) -> None:
    """Embed and store document chunks in PostgreSQL via pgvector."""
    # Generate embeddings for the full text (header + chunk)
    texts_with_headers = [f"{h}\n\n{t}" for h, t in zip(headers, texts)]
    embeddings = await generate_embeddings_batch(texts_with_headers)

    for chunk_id, txt, header, meta, emb in zip(ids, texts, headers, metadatas, embeddings):
        chunk = DocumentChunk(
            id=chunk_id,
            document_id=meta["document_id"],
            chunk_index=meta["chunk_index"],
            chunk_text=txt,
            chunk_header=header,
            embedding=emb,
            page_number=meta.get("page_number", 0),
        )
        db.add(chunk)

    await db.flush()
    logger.info(f"Stored {len(texts)} chunks in PostgreSQL")


async def hybrid_search(
    db: AsyncSession,
    query: str,
    k: int | None = None,
) -> list[dict]:
    """Hybrid search combining BM25 full-text search with pgvector cosine similarity.

    Returns top-k results ranked by weighted combination of BM25 and vector scores.
    """
    k = k or settings.RETRIEVAL_INITIAL_K

    # Generate query embedding
    query_embedding = await generate_embedding(query)

    # Hybrid search query:
    # - Vector similarity: 1 - (embedding <=> query_vector) gives cosine similarity [0,1]
    # - BM25: ts_rank on tsvector of chunk_text
    # - Final score: weighted combination
    sql = text("""
        WITH vector_scores AS (
            SELECT
                id,
                document_id,
                chunk_index,
                chunk_text,
                chunk_header,
                page_number,
                1 - (embedding <=> :query_embedding::vector) AS vector_score
            FROM document_chunks
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> :query_embedding::vector
            LIMIT :k_limit
        ),
        bm25_scores AS (
            SELECT
                id,
                ts_rank(
                    to_tsvector('english', chunk_text),
                    plainto_tsquery('english', :query)
                ) AS bm25_score
            FROM document_chunks
        )
        SELECT
            v.id,
            v.document_id,
            v.chunk_index,
            v.chunk_text,
            v.chunk_header,
            v.page_number,
            v.vector_score,
            COALESCE(b.bm25_score, 0) AS bm25_score,
            (v.vector_score * :vector_weight + COALESCE(b.bm25_score, 0) * :bm25_weight) AS combined_score
        FROM vector_scores v
        LEFT JOIN bm25_scores b ON v.id = b.id
        ORDER BY combined_score DESC
        LIMIT :k_limit
    """)

    result = await db.execute(
        sql,
        {
            "query_embedding": str(query_embedding),
            "query": query,
            "vector_weight": settings.VECTOR_WEIGHT,
            "bm25_weight": settings.BM25_WEIGHT,
            "k_limit": k,
        },
    )

    rows = result.fetchall()
    return [
        {
            "id": row.id,
            "document_id": row.document_id,
            "chunk_index": row.chunk_index,
            "chunk_text": row.chunk_text,
            "chunk_header": row.chunk_header,
            "page_number": row.page_number,
            "vector_score": float(row.vector_score),
            "bm25_score": float(row.bm25_score),
            "combined_score": float(row.combined_score),
        }
        for row in rows
    ]


async def rerank(
    query: str,
    search_results: list[dict],
    top_k: int | None = None,
) -> list[dict]:
    """Rerank search results using Cohere rerank API."""
    top_k = top_k or settings.RERANK_TOP_K

    if not search_results:
        return []

    if not settings.COHERE_API_KEY:
        # Fallback: just return top-k by combined_score (already sorted)
        return search_results[:top_k]

    import cohere

    co = cohere.ClientV2(api_key=settings.COHERE_API_KEY)
    documents = [r["chunk_text"] for r in search_results]

    rerank_response = co.rerank(
        model="rerank-v3.5",
        query=query,
        documents=documents,
        top_n=top_k,
    )

    reranked = []
    for result in rerank_response.results:
        original = search_results[result.index]
        original["relevance_score"] = result.relevance_score
        reranked.append(original)

    return reranked


async def delete_by_document_id(db: AsyncSession, document_id: str) -> None:
    """Delete all chunks belonging to a specific document."""
    await db.execute(
        delete(DocumentChunk).where(DocumentChunk.document_id == document_id)
    )
    await db.flush()


async def get_collection_stats(db: AsyncSession) -> dict:
    """Get stats about the document chunks stored."""
    result = await db.execute(
        select(func.count(DocumentChunk.id))
    )
    count = result.scalar() or 0
    return {
        "name": "document_chunks (pgvector)",
        "count": count,
    }
