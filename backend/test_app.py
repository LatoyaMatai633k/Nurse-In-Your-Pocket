import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.api.dependencies import get_current_user, CurrentUser

client = TestClient(app)

# Mock authenticated user for testing endpoint logic
mock_user = CurrentUser(id="00000000-0000-0000-0000-000000000001", email="test@nurseinyourpocket.co.za")

def override_get_current_user():
    return mock_user

app.dependency_overrides[get_current_user] = override_get_current_user

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_symptom_assessment_urgent():
    payload = {
        "symptoms": "Severe chest pain and difficulty breathing",
        "duration": "1 hour",
        "severity": "Severe",
        "age": 22,
        "medical_context": "None"
    }
    response = client.post("/api/v1/symptoms/assessment", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "safety_warning" in data
    assert data["safety_warning"] is not None
    assert "urgent" in data["safety_warning"].lower()

def test_symptom_assessment_mild():
    payload = {
        "symptoms": "Mild headache after studying",
        "duration": "2 hours",
        "severity": "Mild",
        "age": 20
    }
    response = client.post("/api/v1/symptoms/assessment", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "guidance" in data
    assert data["safety_warning"] is None

print("Verification tests passed!")
