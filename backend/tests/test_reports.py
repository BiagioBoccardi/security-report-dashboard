"""Tests for /api/v1/reports endpoints."""
import json
import io
import pytest
from unittest.mock import patch

from tests.conftest import VALID_IDSUMMARY, UNKNOWN_IDSUMMARY, SAMPLE_REPORT


# ---------------------------------------------------------------------------
# GET /api/v1/reports
# ---------------------------------------------------------------------------

class TestListReports:
    def test_returns_200_with_no_data(self, client):
        response = client.get("/api/v1/reports")
        assert response.status_code == 200

    def test_returns_success_status_with_no_data(self, client):
        data = client.get("/api/v1/reports").json()
        assert data["status"] == "success"

    def test_returns_empty_list_when_no_report_on_disk(self, client):
        data = client.get("/api/v1/reports").json()
        assert data["reports"] == []

    def test_returns_reports_list_with_data(self, client_with_data):
        data = client_with_data.get("/api/v1/reports").json()
        assert isinstance(data["reports"], list)
        assert len(data["reports"]) == 1

    def test_report_summary_has_required_fields(self, client_with_data):
        report = client_with_data.get("/api/v1/reports").json()["reports"][0]
        for field in ("idsummary", "domain_name", "risk_score", "creation_date",
                      "vulnerability_count", "dataleak_count", "certificate_count"):
            assert field in report, f"Missing field: {field}"

    def test_report_summary_values(self, client_with_data):
        report = client_with_data.get("/api/v1/reports").json()["reports"][0]
        assert report["idsummary"] == VALID_IDSUMMARY
        assert report["domain_name"] == "cybersonar.demo"
        assert report["risk_score"] == "75"

    def test_vulnerability_count_sums_all_severities(self, client_with_data):
        report = client_with_data.get("/api/v1/reports").json()["reports"][0]
        # total: critical=2, high=3, medium=5, low=1, info=0  → 11
        assert report["vulnerability_count"] == 11

    def test_certificate_count_active_plus_expired(self, client_with_data):
        report = client_with_data.get("/api/v1/reports").json()["reports"][0]
        assert report["certificate_count"] == 7  # 5 active + 2 expired


# ---------------------------------------------------------------------------
# GET /api/v1/reports/{idsummary}
# ---------------------------------------------------------------------------

class TestGetReport:
    def test_returns_200_when_found(self, client_with_data):
        response = client_with_data.get(f"/api/v1/reports/{VALID_IDSUMMARY}")
        assert response.status_code == 200

    def test_returns_success_status(self, client_with_data):
        data = client_with_data.get(f"/api/v1/reports/{VALID_IDSUMMARY}").json()
        assert data["status"] == "success"

    def test_returns_full_report_data(self, client_with_data):
        data = client_with_data.get(f"/api/v1/reports/{VALID_IDSUMMARY}").json()
        assert "data" in data
        assert data["data"]["domain_name"] == "cybersonar.demo"

    def test_returns_404_for_unknown_id(self, client_with_data):
        response = client_with_data.get(f"/api/v1/reports/{UNKNOWN_IDSUMMARY}")
        assert response.status_code == 404

    def test_returns_404_when_no_data_on_disk(self, client):
        response = client.get(f"/api/v1/reports/{VALID_IDSUMMARY}")
        assert response.status_code == 404


# ---------------------------------------------------------------------------
# POST /api/v1/reports/upload
# ---------------------------------------------------------------------------

class TestUploadReport:
    def _make_file(self, data: dict, filename: str = "report.json") -> dict:
        content = json.dumps(data).encode()
        return {"file": (filename, io.BytesIO(content), "application/json")}

    def test_upload_valid_report_returns_200(self):
        with (
            patch("routes.reports.save_report_file"),
            patch("routes.reports.clear_cache"),
        ):
            from fastapi.testclient import TestClient
            from main import app
            with TestClient(app) as client:
                response = client.post(
                    "/api/v1/reports/upload",
                    files=self._make_file(SAMPLE_REPORT),
                )
        assert response.status_code == 200

    def test_upload_returns_success_and_metadata(self):
        with (
            patch("routes.reports.save_report_file"),
            patch("routes.reports.clear_cache"),
        ):
            from fastapi.testclient import TestClient
            from main import app
            with TestClient(app) as client:
                data = client.post(
                    "/api/v1/reports/upload",
                    files=self._make_file(SAMPLE_REPORT),
                ).json()
        assert data["status"] == "success"
        assert data["domain"] == "cybersonar.demo"
        assert data["idsummary"] == VALID_IDSUMMARY

    def test_upload_non_json_file_returns_400(self):
        from fastapi.testclient import TestClient
        from main import app
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/reports/upload",
                files={"file": ("report.txt", io.BytesIO(b"not json"), "text/plain")},
            )
        assert response.status_code == 400

    def test_upload_invalid_json_content_returns_400(self):
        from fastapi.testclient import TestClient
        from main import app
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/reports/upload",
                files={"file": ("report.json", io.BytesIO(b"{bad json}"), "application/json")},
            )
        assert response.status_code == 400

    def test_upload_missing_results_field_returns_422(self):
        from fastapi.testclient import TestClient
        from main import app
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/reports/upload",
                files=self._make_file({"status": "success"}),
            )
        assert response.status_code == 422

    def test_upload_empty_results_array_returns_422(self):
        from fastapi.testclient import TestClient
        from main import app
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/reports/upload",
                files=self._make_file({"results": []}),
            )
        assert response.status_code == 422

    def test_upload_missing_idsummary_returns_422(self):
        from fastapi.testclient import TestClient
        from main import app
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/reports/upload",
                files=self._make_file({"results": [{"domain_name": "x"}]}),
            )
        assert response.status_code == 422

    def test_upload_missing_domain_name_returns_422(self):
        from fastapi.testclient import TestClient
        from main import app
        with TestClient(app) as client:
            response = client.post(
                "/api/v1/reports/upload",
                files=self._make_file({"results": [{"idsummary": "id-1"}]}),
            )
        assert response.status_code == 422
