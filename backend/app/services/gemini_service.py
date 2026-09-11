import logging
from typing import Optional
import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


class GeminiService:
    """Safe, non-diagnostic Google Gemini integration for Nompilo AI and Symptom Assessment."""

    system_instructions = (
        "You are Nompilo, a warm, knowledgeable, empathetic health education companion for young women in South Africa. "
        "You provide general health education, help users understand their symptoms and menstrual cycles, prepare for clinic visits, and explain when professional medical care is necessary. "
        "Strict safety rules: "
        "1. Never diagnose, prescribe medication, or give guaranteed medical conclusions. "
        "2. Use respectful, clear, culturally sensitive language. If the user greets or asks in South African languages (isiZulu, Sesotho, isiXhosa), respond warmly in that language or English as appropriate. "
        "3. If a user mentions severe symptoms (severe chest pain, difficulty breathing, heavy uncontrolled bleeding, sudden fainting, seizures, suicidal thoughts, overdose, or immediate danger), clearly tell them to seek urgent local emergency medical care immediately. "
        "4. Always conclude with a gentle reminder that your guidance is educational and does not replace consulting a nurse or doctor."
    )

    def is_configured(self) -> bool:
        return bool(settings.gemini_api_key)

    def respond(self, user_prompt: str, context: str = "") -> Optional[str]:
        """Generate educational guidance from Google Gemini."""
        if not self.is_configured():
            logger.warning("Gemini API key is not configured in backend environment.")
            return None

        api_key = settings.gemini_api_key
        model = settings.gemini_model or "gemini-2.5-flash"

        # Combine context with prompt
        full_prompt = (
            f"Context:\n{context}\n\n"
            f"User Inquiry:\n{user_prompt}"
            if context
            else user_prompt
        )

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        
        payload = {
            "system_instruction": {
                "parts": [{"text": self.system_instructions}]
            },
            "contents": [
                {
                    "parts": [{"text": full_prompt}]
                }
            ],
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 1000,
            }
        }

        try:
            with httpx.Client(timeout=25.0) as client:
                response = client.post(url, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            return parts[0].get("text", "").strip()
                else:
                    logger.error(f"Gemini API error ({response.status_code}): {response.text}")
                    # Try fallback to gemini-1.5-flash if 2.5 is unavailable or model error
                    if model != "gemini-1.5-flash":
                        fallback_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
                        fallback_resp = client.post(fallback_url, json=payload)
                        if fallback_resp.status_code == 200:
                            data = fallback_resp.json()
                            candidates = data.get("candidates", [])
                            if candidates:
                                parts = candidates[0].get("content", {}).get("parts", [])
                                if parts:
                                    return parts[0].get("text", "").strip()
        except Exception as error:
            logger.error(f"Failed to communicate with Gemini API: {error}", exc_info=True)
            return None

        return None


gemini_service = GeminiService()
