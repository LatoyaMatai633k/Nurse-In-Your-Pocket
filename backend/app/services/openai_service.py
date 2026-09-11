import logging
from typing import Optional
from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)


class OpenAIService:
    """Compatibility adapter pointing to the Google Gemini AI Service."""

    def is_configured(self) -> bool:
        return gemini_service.is_configured()

    def respond(self, user_prompt: str, context: str = "") -> Optional[str]:
        return gemini_service.respond(user_prompt, context)


openai_service = OpenAIService()
