from functools import lru_cache

from supabase import Client, create_client

from app.core.config import settings


class DatabaseService:
    """Service boundary for Supabase PostgreSQL and access-token verification."""

    def is_configured(self) -> bool:
        return bool(settings.supabase_url and settings.supabase_service_role_key)

    @lru_cache
    def client(self) -> Client:
        if not self.is_configured():
            raise RuntimeError("Supabase server credentials are not configured.")
        return create_client(settings.supabase_url or "", settings.supabase_service_role_key or "")

    def user_for_access_token(self, token: str):
        """Verify a Supabase access token and return its authenticated user."""
        response = self.client().auth.get_user(token)
        if not response.user:
            raise ValueError("Invalid authentication token.")
        return response.user


database_service = DatabaseService()
