import logging
from app.services.llm_service import get_llm_service
from app.prompts.query_classification import QUERY_CLASSIFICATION_PROMPT

logger = logging.getLogger(__name__)


class QueryClassifier:
    async def classify(self, query: str) -> str:
        """Classify a query as 'legal' or 'off_topic'."""
        prompt = QUERY_CLASSIFICATION_PROMPT.format(query=query)
        llm = get_llm_service()
        result = await llm.classify_text(prompt)
        classification = result.lower()

        if classification not in ("legal", "off_topic"):
            logger.warning(f"Unexpected classification: {classification}, defaulting to 'legal'")
            return "legal"

        return classification


# Singleton
_classifier: QueryClassifier | None = None


def get_query_classifier() -> QueryClassifier:
    global _classifier
    if _classifier is None:
        _classifier = QueryClassifier()
    return _classifier
