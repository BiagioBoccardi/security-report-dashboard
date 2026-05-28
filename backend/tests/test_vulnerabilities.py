"""Tests for /api/v1/reports/{id}/vulnerabilities endpoint."""
import pytest
from tests.conftest import VALID_IDSUMMARY, UNKNOWN_IDSUMMARY


class TestListVulnerabilities:
    def test_returns_200_with_data(self, client_with_data):
        response = client_with_data.get(f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities")
        assert response.status_code == 200

    def test_returns_success_status(self, client_with_data):
        data = client_with_data.get(f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities").json()
        assert data["status"] == "success"

    def test_returns_count_and_list(self, client_with_data):
        data = client_with_data.get(f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities").json()
        assert "count" in data
        assert "vulnerabilities" in data
        assert isinstance(data["vulnerabilities"], list)

    def test_vulnerability_has_required_fields(self, client_with_data):
        data = client_with_data.get(f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities").json()
        vuln = data["vulnerabilities"][0]
        for field in ("id", "severity", "status", "title", "description"):
            assert field in vuln, f"Missing field: {field}"

    def test_returns_404_for_unknown_id(self, client_with_data):
        response = client_with_data.get(f"/api/v1/reports/{UNKNOWN_IDSUMMARY}/vulnerabilities")
        assert response.status_code == 404

    def test_returns_404_when_no_data(self, client):
        response = client.get(f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities")
        assert response.status_code == 404


class TestVulnerabilityFilters:
    def test_filter_by_severity_critical(self, client_with_data):
        data = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities?severity=critical"
        ).json()
        for v in data["vulnerabilities"]:
            assert v["severity"] == "critical"

    def test_filter_by_severity_high(self, client_with_data):
        data = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities?severity=high"
        ).json()
        for v in data["vulnerabilities"]:
            assert v["severity"] == "high"

    def test_filter_by_status_active(self, client_with_data):
        data = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities?status=active"
        ).json()
        for v in data["vulnerabilities"]:
            assert v["status"] == "active"

    def test_filter_by_status_passive(self, client_with_data):
        data = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities?status=passive"
        ).json()
        for v in data["vulnerabilities"]:
            assert v["status"] == "passive"

    def test_combined_severity_and_status(self, client_with_data):
        data = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities?severity=high&status=passive"
        ).json()
        for v in data["vulnerabilities"]:
            assert v["severity"] == "high"
            assert v["status"] == "passive"

    def test_no_info_vulns_since_count_is_zero(self, client_with_data):
        data = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities?severity=info"
        ).json()
        assert data["count"] == 0
        assert data["vulnerabilities"] == []


class TestVulnerabilityPagination:
    def test_limit_reduces_result_count(self, client_with_data):
        data = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities?limit=3"
        ).json()
        assert len(data["vulnerabilities"]) <= 3

    def test_offset_skips_records(self, client_with_data):
        all_data = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities"
        ).json()["vulnerabilities"]

        offset_data = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities?offset=2"
        ).json()["vulnerabilities"]

        assert offset_data == all_data[2:]

    def test_offset_beyond_total_returns_empty(self, client_with_data):
        data = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities?offset=9999"
        ).json()
        assert data["vulnerabilities"] == []

    def test_results_sorted_by_severity(self, client_with_data):
        from utils.constants import SEVERITY_ORDER
        vulns = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/vulnerabilities"
        ).json()["vulnerabilities"]
        orders = [SEVERITY_ORDER.get(v["severity"], 99) for v in vulns]
        assert orders == sorted(orders)
