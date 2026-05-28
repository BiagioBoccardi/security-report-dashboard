"""Shared fixtures for the test suite."""
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from main import app

# ---------------------------------------------------------------------------
# Minimal but complete sample report that satisfies all service code paths
# ---------------------------------------------------------------------------
SAMPLE_REPORT = {
    "status": "success",
    "results": [
        {
            "idsummary": "test-id-001",
            "domain_name": "cybersonar.demo",
            "risk_score": "75",
            "creation_date": "2024-01-01",
            "last_edit": "2024-01-02",
            "summary_text": "Sommario di test",
            "summary_text_en": "Test executive summary",
            # Scores
            "servizi_esposti_score": 80,
            "dataleak_score": 60,
            "rapporto_leak_email_score": 40,
            "spoofing_score": 90,
            "open_ports_score": 50,
            "blacklist_score": 10,
            "vulnerability_score_active": 75,
            "vulnerability_score_passive": 55,
            "certificate_score": 30,
            # Counts
            "n_asset": 10,
            "n_similar_domains": 3,
            "n_cert_attivi": 5,
            "n_cert_scaduti": 2,
            "unique_ipv4": 8,
            "unique_ipv6": 2,
            # Details
            "n_port": {"80": {"n": 5}, "443": {"n": 3}, "8080": {"n": 1}},
            "n_dataleak": {
                "total":      {"domain_stealer": 2, "potential_stealer": 1, "other_stealer": 0},
                "resolved":   {"domain_stealer": 1, "potential_stealer": 0, "other_stealer": 0},
                "unresolved": {"domain_stealer": 1, "potential_stealer": 1, "other_stealer": 0},
            },
            "n_vulns": {
                "total":   {"critical": 2, "high": 3, "medium": 5, "low": 1, "info": 0},
                "active":  {"critical": 2, "high": 2, "medium": 3, "low": 1, "info": 0},
                "passive": {"critical": 0, "high": 1, "medium": 2, "low": 0, "info": 0},
            },
            "email_security": {
                "spoofable": "Spoofing possible",
                "dmarc_policy": "none",
                "blacklist_detections": 2,
                "blacklist_total_list": 50,
                "blacklist_detected_list": ["spam-list"],
            },
            "waf": {"count": 1, "assets": ["cdn.cybersonar.demo"]},
            "cdn": {"count": 1, "assets": ["cdn.cybersonar.demo"]},
        }
    ],
}

VALID_IDSUMMARY = "test-id-001"
UNKNOWN_IDSUMMARY = "nonexistent-id"


@pytest.fixture
def sample_report():
    """The raw sample report dict."""
    return SAMPLE_REPORT


@pytest.fixture
def client():
    """TestClient with no data on disk (load_report_file returns None)."""
    with patch("services.report_analyzer.load_report_file", return_value=None):
        with TestClient(app) as c:
            yield c


@pytest.fixture
def client_with_data():
    """TestClient with SAMPLE_REPORT injected into the data layer."""
    with patch("services.report_analyzer.load_report_file", return_value=SAMPLE_REPORT):
        with TestClient(app) as c:
            yield c
