"""Unit tests for the service and utility layers (no HTTP, no disk I/O)."""
import pytest
from unittest.mock import patch
from tests.conftest import SAMPLE_REPORT, VALID_IDSUMMARY, UNKNOWN_IDSUMMARY


# ---------------------------------------------------------------------------
# report_analyzer
# ---------------------------------------------------------------------------

class TestGetAllReports:
    def test_returns_empty_list_when_no_file(self):
        with patch("services.report_analyzer.load_report_file", return_value=None):
            from services.report_analyzer import get_all_reports
            assert get_all_reports() == []

    def test_returns_list_with_one_item(self):
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services import report_analyzer
            # reload so patch takes effect
            result = report_analyzer.get_all_reports()
        assert len(result) == 1

    def test_summary_fields_present(self):
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.report_analyzer import get_all_reports
            summary = get_all_reports()[0]
        for field in ("idsummary", "domain_name", "risk_score", "creation_date",
                      "vulnerability_count", "dataleak_count", "certificate_count"):
            assert field in summary


class TestGetReportById:
    def test_returns_none_when_no_file(self):
        with patch("services.report_analyzer.load_report_file", return_value=None):
            from services.report_analyzer import get_report_by_id
            assert get_report_by_id(VALID_IDSUMMARY) is None

    def test_returns_none_for_unknown_id(self):
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.report_analyzer import get_report_by_id
            assert get_report_by_id(UNKNOWN_IDSUMMARY) is None

    def test_returns_report_for_known_id(self):
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.report_analyzer import get_report_by_id
            report = get_report_by_id(VALID_IDSUMMARY)
        assert report is not None
        assert report["domain_name"] == "cybersonar.demo"


class TestGetVulnerabilities:
    def test_returns_none_for_unknown_id(self):
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.report_analyzer import get_vulnerabilities
            assert get_vulnerabilities(UNKNOWN_IDSUMMARY) is None

    def test_returns_count_and_items(self):
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.report_analyzer import get_vulnerabilities
            result = get_vulnerabilities(VALID_IDSUMMARY)
        assert "count" in result
        assert "items" in result

    def test_total_count_matches_all_buckets(self):
        # total: crit=2, high=3, med=5, low=1, info=0 → 11
        # active: crit=2, high=2, med=3, low=1, info=0 → 8
        # passive: high=1, med=2 → 3
        # total items from all buckets (not deduplicated): 11+8+3 = 22
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.report_analyzer import get_vulnerabilities
            result = get_vulnerabilities(VALID_IDSUMMARY)
        assert result["count"] == 22

    def test_filter_by_severity_only_returns_that_severity(self):
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.report_analyzer import get_vulnerabilities
            result = get_vulnerabilities(VALID_IDSUMMARY, severity="critical")
        for item in result["items"]:
            assert item["severity"] == "critical"

    def test_filter_by_status_active_excludes_passive(self):
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.report_analyzer import get_vulnerabilities
            result = get_vulnerabilities(VALID_IDSUMMARY, status="active")
        for item in result["items"]:
            assert item["status"] == "active"

    def test_filter_by_status_passive(self):
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.report_analyzer import get_vulnerabilities
            result = get_vulnerabilities(VALID_IDSUMMARY, status="passive")
        for item in result["items"]:
            assert item["status"] == "passive"

    def test_limit_applied(self):
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.report_analyzer import get_vulnerabilities
            result = get_vulnerabilities(VALID_IDSUMMARY, limit=3)
        assert len(result["items"]) <= 3

    def test_offset_applied(self):
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.report_analyzer import get_vulnerabilities
            all_items = get_vulnerabilities(VALID_IDSUMMARY)["items"]
            offset_items = get_vulnerabilities(VALID_IDSUMMARY, offset=2)["items"]
        assert offset_items == all_items[2:]

    def test_items_sorted_by_severity(self):
        from utils.constants import SEVERITY_ORDER
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.report_analyzer import get_vulnerabilities
            items = get_vulnerabilities(VALID_IDSUMMARY)["items"]
        orders = [SEVERITY_ORDER.get(i["severity"], 99) for i in items]
        assert orders == sorted(orders)


# ---------------------------------------------------------------------------
# analytics_service
# ---------------------------------------------------------------------------

class TestAnalyticsService:
    def test_returns_none_for_unknown_id(self):
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.analytics_service import get_analytics
            assert get_analytics(UNKNOWN_IDSUMMARY) is None

    def test_returns_dict_for_known_id(self):
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.analytics_service import get_analytics
            result = get_analytics(VALID_IDSUMMARY)
        assert isinstance(result, dict)

    def test_risk_trend_has_7_entries(self):
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.analytics_service import get_analytics
            result = get_analytics(VALID_IDSUMMARY)
        assert len(result["risk_trend"]) == 7

    def test_port_exposure_sorted_descending(self):
        with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
            from services.analytics_service import get_analytics
            result = get_analytics(VALID_IDSUMMARY)
        counts = [p["count"] for p in result["port_exposure"]]
        assert counts == sorted(counts, reverse=True)

    def test_generate_risk_trend_scores_bounded(self):
        from services.analytics_service import _generate_risk_trend
        trend = _generate_risk_trend(75)
        for entry in trend:
            assert 0 <= entry["score"] <= 100

    def test_generate_risk_trend_length(self):
        from services.analytics_service import _generate_risk_trend
        assert len(_generate_risk_trend(50)) == 7

    def test_port_exposure_uses_sample_ports(self):
        from services.analytics_service import _port_exposure
        ports = _port_exposure({"80": {"n": 5}, "443": {"n": 3}})
        port_nums = [p["port"] for p in ports]
        assert 80 in port_nums
        assert 443 in port_nums

    def test_port_exposure_count_from_n_key(self):
        from services.analytics_service import _port_exposure
        ports = _port_exposure({"80": {"n": 7}})
        assert ports[0]["count"] == 7


# ---------------------------------------------------------------------------
# data_processor
# ---------------------------------------------------------------------------

class TestDataProcessor:
    def test_load_returns_none_when_file_missing(self, tmp_path, monkeypatch):
        monkeypatch.setattr("services.data_processor.DATA_DIR", str(tmp_path))
        # Clear the in-memory cache first
        from services import data_processor
        data_processor.clear_cache()
        result = data_processor.load_report_file("nonexistent.json")
        assert result is None

    def test_clear_cache_removes_all_entries(self):
        from services import data_processor
        data_processor._cache["fake"] = {"data": 1}
        data_processor.clear_cache()
        assert data_processor._cache == {}

    def test_clear_cache_with_filename_removes_only_that_entry(self):
        from services import data_processor
        data_processor._cache["a"] = 1
        data_processor._cache["b"] = 2
        data_processor.clear_cache("a")
        assert "a" not in data_processor._cache
        assert "b" in data_processor._cache
        data_processor._cache.pop("b", None)  # cleanup

    def test_save_and_load_roundtrip(self, tmp_path, monkeypatch):
        from services import data_processor
        monkeypatch.setattr("services.data_processor.DATA_DIR", str(tmp_path))
        data_processor.clear_cache()

        payload = {"results": [{"idsummary": "x", "domain_name": "test.io"}]}
        data_processor.save_report_file(payload, filename="roundtrip.json")
        data_processor.clear_cache("roundtrip.json")

        loaded = data_processor.load_report_file("roundtrip.json")
        assert loaded == payload


# ---------------------------------------------------------------------------
# validators
# ---------------------------------------------------------------------------

class TestValidators:
    def test_valid_severities(self):
        from utils.validators import validate_severity
        for s in ("critical", "high", "medium", "low", "info"):
            assert validate_severity(s) is True

    def test_invalid_severity(self):
        from utils.validators import validate_severity
        for s in ("", "unknown", "CRITICAL", "extreme"):
            assert validate_severity(s) is False

    def test_valid_statuses(self):
        from utils.validators import validate_status
        for s in ("active", "passive"):
            assert validate_status(s) is True

    def test_invalid_status(self):
        from utils.validators import validate_status
        for s in ("", "total", "ACTIVE", "resolved"):
            assert validate_status(s) is False


# ---------------------------------------------------------------------------
# formatters
# ---------------------------------------------------------------------------

class TestFormatters:
    def test_format_date_valid_input(self):
        from utils.formatters import format_date
        result = format_date("2024-01-15 10:30:00")
        assert "2024" in result or "Jan" in result

    def test_format_date_invalid_input_returns_original(self):
        from utils.formatters import format_date
        original = "not-a-date"
        assert format_date(original) == original

    def test_risk_label_critical(self):
        from utils.formatters import risk_label
        assert risk_label(80) == "CRITICAL"
        assert risk_label(100) == "CRITICAL"

    def test_risk_label_high(self):
        from utils.formatters import risk_label
        assert risk_label(60) == "HIGH"
        assert risk_label(79) == "HIGH"

    def test_risk_label_medium(self):
        from utils.formatters import risk_label
        assert risk_label(40) == "MEDIUM"
        assert risk_label(59) == "MEDIUM"

    def test_risk_label_low(self):
        from utils.formatters import risk_label
        assert risk_label(0) == "LOW"
        assert risk_label(39) == "LOW"
