from fastapi import APIRouter

from app.schemas.health import HealthStatus

router = APIRouter()


@router.get("", response_model=HealthStatus, summary="Service health check")
async def health_check() -> HealthStatus:
    """Return a minimal status response used by deployments and clients."""
    return HealthStatus(status="ok", service="nurse-in-your-pocket-api")
