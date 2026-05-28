from datetime import datetime, timedelta
from typing import Dict, List, Optional
from services.report_analyzer import get_report_by_id


def get_analytics(idsummary: str) -> Optional[Dict]:
    report = get_report_by_id(idsummary)
    if not report:
        return None

    risk_score = int(report.get("risk_score", 0))
    n_vulns = report.get("n_vulns", {}).get("total", {})
    n_leak = report.get("n_dataleak", {}).get("total", {})
    n_port = report.get("n_port", {})

    return {
        "risk_trend": _generate_risk_trend(risk_score),
        "severity_distribution": n_vulns,
        "port_exposure": _port_exposure(n_port),
        "dataleak_trend": _generate_leak_trend(sum(n_leak.values())),
    }


def _generate_risk_trend(current_score: int) -> List[Dict]:
    today = datetime.utcnow().date()
    trend = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        variation = (i * 2) % 8 - 4
        score = max(0, min(100, current_score - variation))
        trend.append({"date": str(day), "score": score})
    return trend


def _generate_leak_trend(current_count: int) -> List[Dict]:
    today = datetime.utcnow().date()
    trend = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        variation = (i * 5) % 20
        count = max(0, current_count - variation)
        trend.append({"date": str(day), "count": count})
    return trend


def _port_exposure(n_port: Dict) -> List[Dict]:
    result = []
    for port, data in n_port.items():
        result.append({"port": int(port), "count": data.get("n", 0)})
    return sorted(result, key=lambda x: x["count"], reverse=True)
