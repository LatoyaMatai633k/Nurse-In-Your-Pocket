import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import CurrentUser, get_current_user
from app.schemas.mvp import (
    Appointment,
    AppointmentCreate,
    ChatMessage,
    ChatMessageCreate,
    ChatReply,
    HealthProfile,
    PeriodRecord,
    PeriodRecordCreate,
    SymptomAssessmentRequest,
    SymptomAssessmentResponse,
)
from app.services.database_service import database_service
from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)
router = APIRouter()


def _record(record: dict) -> dict:
    """Ensure data is ready for Pydantic validation."""
    return record


@router.get("/profile", response_model=HealthProfile)
async def get_profile(user: CurrentUser = Depends(get_current_user)) -> HealthProfile:
    try:
        result = (
            database_service.client()
            .table("health_profiles")
            .select("*")
            .eq("user_id", user.id)
            .maybe_single()
            .execute()
        )
        row = result.data or {
            "name": None,
            "age": None,
            "emergency_contact": None,
            "blood_group": None,
            "allergies": [],
            "medications": [],
            "chronic_conditions": [],
            "contraceptive_method": None,
            "preferred_language": "English",
        }
        return HealthProfile.model_validate(row)
    except Exception as exc:
        logger.error(f"Error fetching profile for user {user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to load health profile. Please check your database connection.",
        ) from exc


@router.put("/profile", response_model=HealthProfile)
async def save_profile(
    profile: HealthProfile, user: CurrentUser = Depends(get_current_user)
) -> HealthProfile:
    try:
        payload = profile.model_dump()
        payload["user_id"] = user.id
        payload["updated_at"] = datetime.now(timezone.utc).isoformat()
        result = (
            database_service.client()
            .table("health_profiles")
            .upsert(payload, on_conflict="user_id")
            .execute()
        )
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save health profile record.",
            )
        return HealthProfile.model_validate(result.data[0])
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error saving profile for user {user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to save health profile. Please verify database table setup.",
        ) from exc


@router.get("/periods", response_model=list[PeriodRecord])
async def list_periods(user: CurrentUser = Depends(get_current_user)) -> list[PeriodRecord]:
    try:
        result = (
            database_service.client()
            .table("period_records")
            .select("*")
            .eq("user_id", user.id)
            .order("start_date", desc=True)
            .execute()
        )
        return [PeriodRecord.model_validate(_record(row)) for row in result.data or []]
    except Exception as exc:
        logger.error(f"Error listing period records for user {user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to load period records.",
        ) from exc


@router.post("/periods", response_model=PeriodRecord, status_code=status.HTTP_201_CREATED)
async def create_period(
    record: PeriodRecordCreate, user: CurrentUser = Depends(get_current_user)
) -> PeriodRecord:
    try:
        payload = record.model_dump(mode="json") | {"user_id": user.id}
        result = database_service.client().table("period_records").insert(payload).execute()
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not create period record.",
            )
        return PeriodRecord.model_validate(_record(result.data[0]))
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error creating period record for user {user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to save period record.",
        ) from exc


@router.delete("/periods/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_period(record_id: str, user: CurrentUser = Depends(get_current_user)) -> None:
    try:
        database_service.client().table("period_records").delete().eq("id", record_id).eq(
            "user_id", user.id
        ).execute()
    except Exception as exc:
        logger.error(f"Error deleting period record {record_id} for user {user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to delete period record.",
        ) from exc


@router.get("/appointments", response_model=list[Appointment])
async def list_appointments(user: CurrentUser = Depends(get_current_user)) -> list[Appointment]:
    try:
        result = (
            database_service.client()
            .table("appointments")
            .select("*")
            .eq("user_id", user.id)
            .order("appointment_at")
            .execute()
        )
        return [Appointment.model_validate(_record(row)) for row in result.data or []]
    except Exception as exc:
        logger.error(f"Error listing appointments for user {user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to load appointments.",
        ) from exc


@router.post("/appointments", response_model=Appointment, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    appointment: AppointmentCreate, user: CurrentUser = Depends(get_current_user)
) -> Appointment:
    try:
        payload = appointment.model_dump(mode="json") | {"user_id": user.id}
        result = database_service.client().table("appointments").insert(payload).execute()
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not create appointment.",
            )
        return Appointment.model_validate(_record(result.data[0]))
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error creating appointment for user {user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to save appointment.",
        ) from exc


@router.put("/appointments/{appointment_id}", response_model=Appointment)
async def update_appointment(
    appointment_id: str,
    appointment: AppointmentCreate,
    user: CurrentUser = Depends(get_current_user),
) -> Appointment:
    try:
        result = (
            database_service.client()
            .table("appointments")
            .update(appointment.model_dump(mode="json"))
            .eq("id", appointment_id)
            .eq("user_id", user.id)
            .execute()
        )
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found."
            )
        return Appointment.model_validate(_record(result.data[0]))
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error updating appointment {appointment_id} for user {user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update appointment.",
        ) from exc


@router.delete("/appointments/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(
    appointment_id: str, user: CurrentUser = Depends(get_current_user)
) -> None:
    try:
        database_service.client().table("appointments").delete().eq("id", appointment_id).eq(
            "user_id", user.id
        ).execute()
    except Exception as exc:
        logger.error(f"Error deleting appointment {appointment_id} for user {user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to delete appointment.",
        ) from exc


@router.get("/chat/messages", response_model=list[ChatMessage])
async def list_chat_messages(user: CurrentUser = Depends(get_current_user)) -> list[ChatMessage]:
    try:
        result = (
            database_service.client()
            .table("chat_messages")
            .select("id,role,content,created_at")
            .eq("user_id", user.id)
            .order("created_at")
            .limit(100)
            .execute()
        )
        return [ChatMessage.model_validate(_record(row)) for row in result.data or []]
    except Exception as exc:
        logger.error(f"Error fetching chat messages for user {user.id}: {exc}")
        return []


@router.post("/chat/messages", response_model=ChatReply)
async def send_chat_message(
    message: ChatMessageCreate, user: CurrentUser = Depends(get_current_user)
) -> ChatReply:
    client = database_service.client()
    try:
        # Save user message
        user_row = (
            client.table("chat_messages")
            .insert({"user_id": user.id, "role": "user", "content": message.content})
            .execute()
            .data[0]
        )
        
        # Retrieve recent history for contextual response
        history = (
            client.table("chat_messages")
            .select("role,content")
            .eq("user_id", user.id)
            .order("created_at", desc=True)
            .limit(8)
            .execute()
            .data
            or []
        )
        context = "\n".join(f"{item['role']}: {item['content']}" for item in reversed(history))

        # Query Google Gemini
        guidance = gemini_service.respond(message.content, context)
        if not guidance:
            guidance = (
                "Hello, I am Nompilo. I am here to share health education and help you prepare for clinic visits. "
                "If you are feeling unwell or have specific health questions, consulting a nurse or doctor at your local clinic is always recommended. "
                "(Note: Set GEMINI_API_KEY in backend environment to enable live AI responses.)"
            )

        # Save assistant message
        assistant_row = (
            client.table("chat_messages")
            .insert({"user_id": user.id, "role": "assistant", "content": guidance})
            .execute()
            .data[0]
        )
        return ChatReply(
            user_message=ChatMessage.model_validate(user_row),
            assistant_message=ChatMessage.model_validate(assistant_row),
        )
    except Exception as exc:
        logger.error(f"Error processing chat message for user {user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to process your message right now. Please try again.",
        ) from exc


@router.post("/symptoms/assessment", response_model=SymptomAssessmentResponse)
async def assess_symptoms(
    request: SymptomAssessmentRequest, _: CurrentUser = Depends(get_current_user)
) -> SymptomAssessmentResponse:
    summary = (
        f"Symptoms: {request.symptoms}\n"
        f"Duration: {request.duration}\n"
        f"Severity: {request.severity}\n"
        f"Age: {request.age}\n"
        f"Relevant context: {request.medical_context or 'None provided'}"
    )
    urgent_terms = (
        "chest pain",
        "trouble breathing",
        "difficulty breathing",
        "faint",
        "unconscious",
        "seizure",
        "heavy bleeding",
        "suicidal",
        "overdose",
    )
    is_urgent = request.severity == "Severe" or any(
        term in request.symptoms.lower() for term in urgent_terms
    )
    safety_warning = (
        "Please seek urgent emergency medical care now or contact local emergency services immediately. Do not wait."
        if is_urgent
        else None
    )

    guidance = gemini_service.respond(
        f"Provide educational, non-diagnostic symptom guidance based on this structured assessment:\n{summary}"
    )
    if not guidance:
        guidance = (
            "This structured summary is ready to share with a nurse or doctor at your clinic. "
            "Rest, stay hydrated, and seek professional care promptly if your symptoms persist or worsen. "
            "Nompilo provides educational information and is not a substitute for a healthcare professional."
        )
    return SymptomAssessmentResponse(
        summary=summary, safety_warning=safety_warning, guidance=guidance
    )
