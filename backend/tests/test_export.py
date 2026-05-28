"""Tests for /api/v1/reports/{id}/export endpoint."""
import json
from tests.conftest import VALID_IDSUMMARY, UNKNOWN_IDSUMMARY


class TestExportJSON:
    def test_returns_200(self, client_with_data):
        response = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/export?format=json"
        )
        assert response.status_code == 200

    def test_content_type_is_json(self, client_with_data):
        response = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/export?format=json"
        )
        assert "application/json" in response.headers["content-type"]

    def test_content_disposition_contains_filename(self, client_with_data):
        response = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/export?format=json"
        )
        cd = response.headers.get("content-disposition", "")
        assert VALID_IDSUMMARY in cd
        assert cd.endswith(".json")

    def test_body_is_valid_json(self, client_with_data):
        response = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/export?format=json"
        )
        data = json.loads(response.content)
        assert isinstance(data, dict)

    def test_exported_json_contains_domain(self, client_with_data):
        response = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/export?format=json"
        )
        data = json.loads(response.content)
        assert data.get("domain_name") == "cybersonar.demo"

    def test_returns_404_for_unknown_id(self, client_with_data):
        response = client_with_data.get(
            f"/api/v1/reports/{UNKNOWN_IDSUMMARY}/export?format=json"
        )
        assert response.status_code == 404

    def test_default_format_is_json(self, client_with_data):
        response = client_with_data.get(f"/api/v1/reports/{VALID_IDSUMMARY}/export")
        assert response.status_code == 200
        assert "application/json" in response.headers["content-type"]


class TestExportCSV:
    def test_returns_200(self, client_with_data):
        response = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/export?format=csv"
        )
        assert response.status_code == 200

    def test_content_type_is_csv(self, client_with_data):
        response = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/export?format=csv"
        )
        assert "text/csv" in response.headers["content-type"]

    def test_content_disposition_contains_filename(self, client_with_data):
        response = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/export?format=csv"
        )
        cd = response.headers.get("content-disposition", "")
        assert VALID_IDSUMMARY in cd
        assert cd.endswith(".csv")

    def test_body_has_csv_header_row(self, client_with_data):
        response = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/export?format=csv"
        )
        first_line = response.content.decode().splitlines()[0]
        for col in ("id", "severity", "status", "title", "description"):
            assert col in first_line

    def test_csv_has_data_rows(self, client_with_data):
        response = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/export?format=csv"
        )
        lines = [l for l in response.content.decode().splitlines() if l.strip()]
        # header + at least one data row
        assert len(lines) > 1

    def test_returns_404_for_unknown_id(self, client_with_data):
        response = client_with_data.get(
            f"/api/v1/reports/{UNKNOWN_IDSUMMARY}/export?format=csv"
        )
        assert response.status_code == 404
