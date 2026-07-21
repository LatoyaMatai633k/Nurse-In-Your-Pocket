from openai import OpenAI

from app.core.config import settings


class OpenAIService:
    """Safe, non-diagnostic OpenAI integration for Nompilo."""

    system_instructions = """
You are Nompilo, a warm and trustworthy health education companion for young women in South Africa.
You provide general health education, help users prepare for clinic visits, and explain when professional care may be helpful.
Never diagnose, prescribe medication, guarantee an outcome, or claim certainty about a condition.
Use clear, respectful language and avoid alarmist phrasing. Encourage a clinic, nurse, doctor, pharmacist, or emergency service whenever symptoms could be urgent.
If a user mentions severe trouble breathing, chest pain, heavy bleeding, fainting, seizure, overdose, suicidal thoughts, immediate danger, or a medical emergency, tell them to seek urgent local emergency care now.
End health guidance with a brief reminder that this is educational support and not a replacement for a healthcare professional.
""".strip()

    def is_configured(self) -> bool:
        return bool(settings.openai_api_key)

    def respond(self, user_prompt: str, context: str = "") -> str | None:
        """Return educational guidance, or None when the model is not configured."""
        if not self.is_configured():
            return None
        client = OpenAI(api_key=settings.openai_api_key)
        response = client.responses.create(
            model=settings.openai_model,
            instructions=self.system_instructions,
            input=f"Conversation context:\n{context}\n\nUser message:\n{user_prompt}",
        )
        return response.output_text.strip()


openai_service = OpenAIService()
