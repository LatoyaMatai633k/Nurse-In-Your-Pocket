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
from app.services.openai_service import openai_service

router = APIRouter()


def _record(record: dict) -> dict:
    """Convert Supabase's row data into JSON-friendly response content."""
    return record


@router.get("/profile", response_model=HealthProfile)
async def get_profile(user: CurrentUser = Depends(get_current_user)) -> HealthProfile:
    result = database_service.client().table("health_profiles").select("*").eq("user_id", user.id).maybe_single().execute()
    row = result.data or {"name": None, "age": None, "emergency_contact": None, "blood_group": None, "allergies": [], "medications": [], "chronic_conditions": [], "contraceptive_method": None, "preferred_language": "English"}
    return HealthProfile.model_validate(row)


@router.put("/profile", response_model=HealthProfile)
async def save_profile(profile: HealthProfile, user: CurrentUser = Depends(get_current_user)) -> HealthProfile:
    payload = profile.model_dump()
    payload["user_id"] = user.id
    result = database_service.client().table("health_profiles").upsert(payload, on_conflict="user_id").execute()
    return HealthProfile.model_validate(result.data[0])


@router.get("/periods", response_model=list[PeriodRecord])
async def list_periods(user: CurrentUser = Depends(get_current_user)) -> list[PeriodRecord]:
    result = database_service.client().table("period_records").select("*").eq("user_id", user.id).order("start_date", desc=True).execute()
    return [PeriodRecord.model_validate(_record(row)) for row in result.data]


@router.post("/periods", response_model=PeriodRecord, status_code=status.HTTP_201_CREATED)
async def create_period(record: PeriodRecordCreate, user: CurrentUser = Depends(get_current_user)) -> PeriodRecord:
    payload = record.model_dump(mode="json") | {"user_id": user.id}
    result = database_service.client().table("period_records").insert(payload).execute()
    return PeriodRecord.model_validate(_record(result.data[0]))


@router.delete("/periods/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_period(record_id: str, user: CurrentUser = Depends(get_current_user)) -> None:
    database_service.client().table("period_records").delete().eq("id", record_id).eq("user_id", user.id).execute()


@router.get("/appointments", response_model=list[Appointment])
async def list_appointments(user: CurrentUser = Depends(get_current_user)) -> list[Appointment]:
    result = database_service.client().table("appointments").select("*").eq("user_id", user.id).order("appointment_at").execute()
    return [Appointment.model_validate(_record(row)) for row in result.data]


@router.post("/appointments", response_model=Appointment, status_code=status.HTTP_201_CREATED)
async def create_appointment(appointment: AppointmentCreate, user: CurrentUser = Depends(get_current_user)) -> Appointment:
    payload = appointment.model_dump(mode="json") | {"user_id": user.id}
    result = database_service.client().table("appointments").insert(payload).execute()
    return Appointment.model_validate(_record(result.data[0]))


@router.put("/appointments/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: str, appointment: AppointmentCreate, user: CurrentUser = Depends(get_current_user)) -> Appointment:
    result = database_service.client().table("appointments").update(appointment.model_dump(mode="json")).eq("id", appointment_id).eq("user_id", user.id).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found.")
    return Appointment.model_validate(_record(result.data[0]))


@router.delete("/appointments/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(appointment_id: str, user: CurrentUser = Depends(get_current_user)) -> None:
    database_service.client().table("appointments").delete().eq("id", appointment_id).eq("user_id", user.id).execute()


@router.get("/chat/messages", response_model=list[ChatMessage])
async def list_chat_messages(user: CurrentUser = Depends(get_current_user)) -> list[ChatMessage]:
    result = database_service.client().table("chat_messages").select("id,role,content,created_at").eq("user_id", user.id).order("created_at").limit(100).execute()
    return [ChatMessage.model_validate(_record(row)) for row in result.data]


@router.post("/chat/messages", response_model=ChatReply)
async def send_chat_message(message: ChatMessageCreate, user: CurrentUser = Depends(get_current_user)) -> ChatReply:
    client = database_service.client()
    user_row = client.table("chat_messages").insert({"user_id": user.id, "role": "user", "content": message.content}).execute().data[0]
    history = client.table("chat_messages").select("role,content").eq("user_id", user.id).order("created_at", desc=True).limit(10).execute().data
    context = "\n".join(f"{item['role']}: {item['content']}" for item in reversed(history))
    guidance = openai_service.respond(message.content, context)
    if not guidance:
        guidance = "Nompilo is not connected to the health guidance service yet. Please try again once your clinic’s app administrator has completed setup. If you feel unwell or worried, contact a nurse, clinic, or trusted healthcare professional."
    assistant_row = client.table("chat_messages").insert({"user_id": user.id, "role": "assistant", "content": guidance}).execute().data[0]
    return ChatReply(user_message=ChatMessage.model_validate(user_row), assistant_message=ChatMessage.model_validate(assistant_row))


@router.post("/symptoms/assessment", response_model=SymptomAssessmentResponse)
async def assess_symptoms(request: SymptomAssessmentRequest, _: CurrentUser = Depends(get_current_user)) -> SymptomAssessmentResponse:
    summary = f"Symptoms: {request.symptoms}\nDuration: {request.duration}\nSeverity: {request.severity}\nAge: {request.age}\nRelevant context: {request.medical_context or 'None provided'}"
    urgent_terms = ("chest pain", "trouble breathing", "difficulty breathing", "faint", "unconscious", "seizure", "heavy bleeding", "suicidal", "overdose")
    is_urgent = request.severity == "Severe" or any(term in request.symptoms.lower() for term in urgent_terms)
    safety_warning = "Please seek urgent medical care now or contact local emergency services. Do not wait for an online response." if is_urgent else None
    guidance = openai_service.respond(f"Provide educational, non-diagnostic symptom guidance based on this structured assessment:\n{summary}")
    if not guidance:
        guidance = "This summary is ready to discuss with a nurse or doctor. Rest, stay hydrated if you can, and seek professional care if symptoms worsen, persist, or worry you. This tool does not diagnose health conditions."
    return SymptomAssessmentResponse(summary=summary, safety_warning=safety_warning, guidance=guidance)
