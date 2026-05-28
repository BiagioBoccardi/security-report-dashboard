"""Tests for /api/v1/reports/{id}/analytics endpoint."""
from tests.conftest import VALID_IDSUMMARY, UNKNOWN_IDSUMMARY


class TestAnalytics:
    def test_returns_200_with_data(self, client_with_data):
        response = client_with_data.get(f"/api/v1/reports/{VALID_IDSUMMARY}/analytics")
        assert response.status_code == 200

    def test_returns_success_status(self, client_with_data):
        data = client_with_data.get(f"/api/v1/reports/{VALID_IDSUMMARY}/analytics").json()
        assert data["status"] == "success"

    def test_returns_analytics_object(self, client_with_data):
        data = client_with_data.get(f"/api/v1/reports/{VALID_IDSUMMARY}/analytics").json()
        assert "analytics" in data

    def test_analytics_has_required_keys(self, client_with_data):
        analytics = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/analytics"
        ).json()["analytics"]
        for key in ("risk_trend", "severity_distribution", "port_exposure", "dataleak_trend"):
            assert key in analytics, f"Missing key: {key}"

    def test_risk_trend_is_7_days(self, client_with_data):
        analytics = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/analytics"
        ).json()["analytics"]
        assert len(analytics["risk_trend"]) == 7

    def test_risk_trend_entry_has_date_and_score(self, client_with_data):
        analytics = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/analytics"
        ).json()["analytics"]
        entry = analytics["risk_trend"][0]
        assert "date" in entry
        assert "score" in entry

    def test_risk_trend_scores_within_range(self, client_with_data):
        analytics = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/analytics"
        ).json()["analytics"]
        for entry in analytics["risk_trend"]:
            assert 0 <= entry["score"] <= 100

    def test_dataleak_trend_is_7_days(self, client_with_data):
        analytics = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/analytics"
        ).json()["analytics"]
        assert len(analytics["dataleak_trend"]) == 7

    def test_port_exposure_is_list(self, client_with_data):
        analytics = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/analytics"
        ).json()["analytics"]
        assert isinstance(analytics["port_exposure"], list)

    def test_port_exposure_sorted_descending(self, client_with_data):
        analytics = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/analytics"
        ).json()["analytics"]
        counts = [p["count"] for p in analytics["port_exposure"]]
        assert counts == sorted(counts, reverse=True)

    def test_severity_distribution_matches_report(self, client_with_data):
        analytics = client_with_data.get(
            f"/api/v1/reports/{VALID_IDSUMMARY}/analytics"
        ).json()["analytics"]
        dist = analytics["severity_distribution"]
        assert dist["critical"] == 2
        assert dist["high"] == 3
        assert dist["medium"] == 5

    def test_returns_404_for_unknown_id(self, client_with_data):
        response = client_with_data.get(f"/api/v1/reports/{UNKNOWN_IDSUMMARY}/analytics")
        assert response.status_code == 404

    def test_returns_404_when_no_data(self, client):
        response = client.get(f"/api/v1/reports/{VALID_IDSUMMARY}/analytics")
        assert response.status_code == 404
