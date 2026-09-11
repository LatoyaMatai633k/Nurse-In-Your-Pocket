import logging
from supabase import Client, create_client
from app.core.config import settings

logger = logging.getLogger(__name__)


class DatabaseService:
    """Service boundary for Supabase PostgreSQL and access-token verification."""

    _client: Client | None = None

    def is_configured(self) -> bool:
        return bool(settings.supabase_url and settings.supabase_service_role_key)

    def client(self) -> Client:
        if not self.is_configured():
            raise RuntimeError("Supabase server credentials (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) are not configured.")
        if self._client is None:
            self._client = create_client(settings.supabase_url or "", settings.supabase_service_role_key or "")
        return self._client

    def user_for_access_token(self, token: str):
        """Verify a Supabase access token and return its authenticated user."""
        try:
            response = self.client().auth.get_user(jwt=token)
            if not response or not response.user:
                raise ValueError("Invalid authentication token.")
            return response.user
        except Exception as err:
            logger.error(f"Error authenticating user token: {err}")
            raise


database_service = DatabaseService()
