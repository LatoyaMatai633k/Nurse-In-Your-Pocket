from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field


class HealthProfile(BaseModel):
    name: str | None = Field(default=None, max_length=120)
    age: int | None = Field(default=None, ge=16, le=120)
    emergency_contact: str | None = Field(default=None, max_length=160)
    blood_group: str | None = Field(default=None, max_length=10)
    allergies: list[str] = Field(default_factory=list)
    medications: list[str] = Field(default_factory=list)
    chronic_conditions: list[str] = Field(default_factory=list)
    contraceptive_method: str | None = Field(default=None, max_length=100)
    preferred_language: Literal["English", "isiZulu", "Sesotho", "isiXhosa"] = "English"


class PeriodRecordCreate(BaseModel):
    start_date: date
    end_date: date | None = None
    cycle_length: int = Field(default=28, ge=15, le=60)
    symptoms: list[str] = Field(default_factory=list)
    mood: str | None = Field(default=None, max_length=80)


class PeriodRecord(PeriodRecordCreate):
    id: str
    created_at: datetime


class AppointmentCreate(BaseModel):
    title: str = Field(min_length=2, max_length=120)
    appointment_at: datetime
    location: str | None = Field(default=None, max_length=160)
    notes: str | None = Field(default=None, max_length=1000)
    reminder_enabled: bool = True


class Appointment(AppointmentCreate):
    id: str
    created_at: datetime


class ChatMessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=3000)


class ChatMessage(BaseModel):
    id: str
    role: Literal["user", "assistant"]
    content: str
    created_at: datetime


class ChatReply(BaseModel):
    user_message: ChatMessage
    assistant_message: ChatMessage


class SymptomAssessmentRequest(BaseModel):
    symptoms: str = Field(min_length=3, max_length=2000)
    duration: str = Field(min_length=2, max_length=120)
    severity: Literal["Mild", "Moderate", "Severe"]
    age: int = Field(ge=16, le=120)
    medical_context: str | None = Field(default=None, max_length=1500)


class SymptomAssessmentResponse(BaseModel):
    summary: str
    safety_warning: str | None = None
    guidance: str
