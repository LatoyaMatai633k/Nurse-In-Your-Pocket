from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed configuration loaded from the runtime environment."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Nurse in Your Pocket API"
    environment: str = "development"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"
    
    # Comma-separated allowed frontend origins or "*"
    frontend_origins: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://nurse-in-your-pocket.vercel.app"
    
    # Google Gemini Configuration
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-2.5-flash"
    
    # Supabase Configuration
    supabase_url: str | None = None
    supabase_service_role_key: str | None = None
    supabase_anon_key: str | None = None

    @property
    def frontend_origins_list(self) -> list[str]:
        if not self.frontend_origins:
            return ["*"]
        origins = [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]
        return origins if origins else ["*"]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
