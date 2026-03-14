import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.schemas.chat import Citation
from app.services import vector_store_service
from app.services.llm_service import get_llm_service
from app.services.query_classifier import get_query_classifier

logger = logging.getLogger(__name__)

OFF_TOPIC_RESPONSES = {
    "en": (
        "I'm NITI-SATHI, an AI assistant for Nepali law and governance. "
        "I can help you with questions about the Constitution of Nepal, various Acts, "
        "legal rights, and governance procedures. Your question appears to be outside "
        "my area of expertise. Could you please ask a question related to Nepali law?"
    ),
    "ne": (
        "म नीति-साथी हुँ, नेपाली कानून र शासनको लागि एआई सहायक। "
        "म तपाईंलाई नेपालको संविधान, विभिन्न ऐनहरू, कानूनी अधिकारहरू, "
        "र शासन प्रक्रियाहरूको बारेमा प्रश्नहरूमा सहयोग गर्न सक्छु। "
        "तपाईंको प्रश्न मेरो विशेषज्ञता क्षेत्र बाहिर देखिन्छ। "
        "कृपया नेपाली कानूनसँग सम्बन्धित प्रश्न सोध्नुहोस्।"
    ),
}

NO_DOCS_RESPONSES = {
    "en": (
        "I couldn't find relevant information in my legal database for your question. "
        "This may be because the relevant legal document hasn't been uploaded yet, "
        "or your question may need to be more specific. "
        "Please consult a qualified lawyer for authoritative guidance."
    ),
    "ne": (
        "तपाईंको प्रश्नको लागि मेरो कानूनी डाटाबेसमा सान्दर्भिक जानकारी फेला परेन। "
        "यो सम्बन्धित कानूनी कागजात अपलोड नभएको वा तपाईंको प्रश्न अझ विशिष्ट हुनुपर्ने "
        "कारणले हुन सक्छ। कृपया आधिकारिक मार्गदर्शनको लागि योग्य वकिलसँग परामर्श गर्नुहोस्।"
    ),
}

DISCLAIMER = {
    "en": "\n\n---\n*This is AI-generated legal information, not legal advice. Please consult a qualified lawyer for specific legal matters.*",
    "ne": "\n\n---\n*यो एआई-द्वारा उत्पन्न कानूनी जानकारी हो, कानूनी सल्लाह होइन। कृपया विशिष्ट कानूनी मामिलाहरूको लागि योग्य वकिलसँग परामर्श गर्नुहोस्।*",
}


class RAGService:
    """Orchestrates the full RAG pipeline: classify → hybrid search → rerank → generate."""

    async def answer(
        self,
        query: str,
        chat_history: list[dict],
        language: str = "en",
        db: AsyncSession | None = None,
    ) -> tuple[str, list[Citation]]:
        """Process a query through the RAG pipeline and return response + citations."""

        # 1. Classify query
        classifier = get_query_classifier()
        classification = await classifier.classify(query)

        if classification == "off_topic":
            return OFF_TOPIC_RESPONSES.get(language, OFF_TOPIC_RESPONSES["en"]), []

        if db is None:
            return NO_DOCS_RESPONSES.get(language, NO_DOCS_RESPONSES["en"]), []

        # 2. Hybrid search: retrieve top-k candidates (BM25 + vector)
        search_results = await vector_store_service.hybrid_search(
            db=db,
            query=query,
            k=settings.RETRIEVAL_INITIAL_K,
        )

        if not search_results:
            return NO_DOCS_RESPONSES.get(language, NO_DOCS_RESPONSES["en"]), []

        # 3. Rerank: narrow down to top-n most relevant
        reranked = await vector_store_service.rerank(
            query=query,
            search_results=search_results,
            top_k=settings.RERANK_TOP_K,
        )

        if not reranked:
            return NO_DOCS_RESPONSES.get(language, NO_DOCS_RESPONSES["en"]), []

        # 4. Format context
        context = self._format_context(reranked)

        # 5. Generate response
        llm_service = get_llm_service()
        response = await llm_service.generate(
            query=query,
            context=context,
            chat_history=chat_history,
            language=language,
        )

        # 6. Add disclaimer
        response += DISCLAIMER.get(language, DISCLAIMER["en"])

        # 7. Extract citations
        citations = self._build_citations(reranked)

        return response, citations

    async def answer_stream(
        self,
        query: str,
        chat_history: list[dict],
        language: str = "en",
        db: AsyncSession | None = None,
    ) -> AsyncGenerator[dict, None]:
        """Stream response tokens, then yield citations at the end."""

        # 1. Classify
        classifier = get_query_classifier()
        classification = await classifier.classify(query)

        if classification == "off_topic":
            yield {"type": "token", "data": OFF_TOPIC_RESPONSES.get(language, OFF_TOPIC_RESPONSES["en"])}
            yield {"type": "citations", "data": []}
            yield {"type": "done"}
            return

        if db is None:
            yield {"type": "token", "data": NO_DOCS_RESPONSES.get(language, NO_DOCS_RESPONSES["en"])}
            yield {"type": "citations", "data": []}
            yield {"type": "done"}
            return

        # 2. Hybrid search
        search_results = await vector_store_service.hybrid_search(
            db=db,
            query=query,
            k=settings.RETRIEVAL_INITIAL_K,
        )

        if not search_results:
            yield {"type": "token", "data": NO_DOCS_RESPONSES.get(language, NO_DOCS_RESPONSES["en"])}
            yield {"type": "citations", "data": []}
            yield {"type": "done"}
            return

        # 3. Rerank
        reranked = await vector_store_service.rerank(
            query=query,
            search_results=search_results,
            top_k=settings.RERANK_TOP_K,
        )

        if not reranked:
            yield {"type": "token", "data": NO_DOCS_RESPONSES.get(language, NO_DOCS_RESPONSES["en"])}
            yield {"type": "citations", "data": []}
            yield {"type": "done"}
            return

        # 4. Format context and stream
        context = self._format_context(reranked)
        llm_service = get_llm_service()

        async for token in llm_service.generate_stream(
            query=query,
            context=context,
            chat_history=chat_history,
            language=language,
        ):
            yield {"type": "token", "data": token}

        # Add disclaimer
        yield {"type": "token", "data": DISCLAIMER.get(language, DISCLAIMER["en"])}

        # 5. Yield citations
        citations = self._build_citations(reranked)
        yield {"type": "citations", "data": [c.model_dump() for c in citations]}
        yield {"type": "done"}

    def _format_context(self, results: list[dict]) -> str:
        """Format reranked results into context string."""
        context_parts = []
        for i, result in enumerate(results):
            header = result.get("chunk_header", "")
            page = result.get("page_number", 0)
            source = header if header else f"Source {i + 1}"
            page_info = f", Page {page}" if page else ""
            context_parts.append(f"[{source}{page_info}]\n{result['chunk_text']}")
        return "\n\n---\n\n".join(context_parts)

    def _build_citations(self, results: list[dict]) -> list[Citation]:
        """Build Citation objects from reranked results."""
        citations = []
        for result in results:
            score = result.get("relevance_score", result.get("combined_score", 0))
            citations.append(
                Citation(
                    document_name=result.get("chunk_header", "Unknown Document"),
                    chunk_text=result["chunk_text"][:500],
                    page_number=result.get("page_number"),
                    relevance_score=round(float(score), 3),
                )
            )
        return citations


# Singleton
_rag_service: RAGService | None = None


def get_rag_service() -> RAGService:
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service
