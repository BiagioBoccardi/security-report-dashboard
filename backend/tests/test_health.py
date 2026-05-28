"""Tests for the /health endpoint."""
from fastapi.testclient import TestClient
from main import app


def test_health_returns_200():
    with TestClient(app) as client:
        response = client.get("/health")
    assert response.status_code == 200


def test_health_status_ok():
    with TestClient(app) as client:
        data = client.get("/health").json()
    assert data["status"] == "ok"


def test_health_has_timestamp():
    with TestClient(app) as client:
        data = client.get("/health").json()
    assert "timestamp" in data
    assert isinstance(data["timestamp"], str)
    assert len(data["timestamp"]) > 0
