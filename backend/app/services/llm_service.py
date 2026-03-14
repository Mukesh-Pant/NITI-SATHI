import logging
from typing import AsyncGenerator
from google import genai
from google.genai import types
from app.config import settings
from app.prompts.legal_qa import LEGAL_QA_TEMPLATE, LEGAL_QA_SYSTEM_PROMPT

logger = logging.getLogger(__name__)

_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GOOGLE_API_KEY)
    return _client


class LLMService:
    def __init__(self):
        self.model = settings.LLM_MODEL

    async def generate(
        self,
        query: str,
        context: str,
        chat_history: list[dict],
        language: str = "en",
    ) -> str:
        """Generate a response using Google Gemini with RAG context."""
        language_name = "English" if language == "en" else "Nepali (नेपाली)"

        prompt = LEGAL_QA_TEMPLATE.format(
            language=language_name,
            context=context,
            chat_history=self._format_chat_history(chat_history),
            query=query,
        )

        client = _get_client()
        response = await client.aio.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=LEGAL_QA_SYSTEM_PROMPT,
                temperature=0.1,
                max_output_tokens=2048,
            ),
        )

        return response.text

    async def generate_stream(
        self,
        query: str,
        context: str,
        chat_history: list[dict],
        language: str = "en",
    ) -> AsyncGenerator[str, None]:
        """Stream response tokens from Google Gemini."""
        language_name = "English" if language == "en" else "Nepali (नेपाली)"

        prompt = LEGAL_QA_TEMPLATE.format(
            language=language_name,
            context=context,
            chat_history=self._format_chat_history(chat_history),
            query=query,
        )

        client = _get_client()
        async for chunk in client.aio.models.generate_content_stream(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=LEGAL_QA_SYSTEM_PROMPT,
                temperature=0.1,
                max_output_tokens=2048,
            ),
        ):
            if chunk.text:
                yield chunk.text

    async def classify_text(self, prompt: str) -> str:
        """Simple text generation for classification tasks."""
        client = _get_client()
        response = await client.aio.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0,
                max_output_tokens=10,
            ),
        )
        return response.text.strip()

    def _format_chat_history(self, history: list[dict]) -> str:
        """Format chat history for the prompt."""
        if not history:
            return "No previous conversation."

        formatted = []
        for msg in history[-6:]:  # Last 6 messages
            role = "User" if msg["role"] == "user" else "NITI-SATHI"
            formatted.append(f"{role}: {msg['content']}")
        return "\n".join(formatted)


# Singleton
_llm_service: LLMService | None = None


def get_llm_service() -> LLMService:
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
