from typing import Any, Dict, List, Optional
from services.data_processor import load_report_file
from utils.constants import SEVERITY_ORDER


def get_all_reports() -> List[Dict]:
    data = load_report_file()
    if not data:
        return []
    results = data.get("results", [])
    return [_to_summary(r) for r in results]


def get_report_by_id(idsummary: str) -> Optional[Dict]:
    data = load_report_file()
    if not data:
        return None
    for r in data.get("results", []):
        if r.get("idsummary") == idsummary:
            return r
    return None


def get_vulnerabilities(
    idsummary: str,
    severity: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
) -> Optional[Dict]:
    report = get_report_by_id(idsummary)
    if not report:
        return None

    n_vulns = report.get("n_vulns", {})
    items = _expand_vulns(n_vulns, severity=severity, status=status)
    total = len(items)
    return {"count": total, "items": items[offset : offset + limit]}


def _to_summary(r: Dict) -> Dict:
    n_vulns = r.get("n_vulns", {}).get("total", {})
    n_leak = r.get("n_dataleak", {}).get("total", {})
    return {
        "idsummary": r.get("idsummary"),
        "domain_name": r.get("domain_name"),
        "risk_score": r.get("risk_score"),
        "creation_date": r.get("creation_date"),
        "vulnerability_count": sum(n_vulns.values()),
        "dataleak_count": sum(n_leak.values()),
        "certificate_count": r.get("n_cert_attivi", 0) + r.get("n_cert_scaduti", 0),
    }


def _expand_vulns(n_vulns: Dict, severity: Optional[str], status: Optional[str]) -> List[Dict]:
    items = []
    target_buckets = ["total", "active", "passive"]
    if status == "active":
        target_buckets = ["active"]
    elif status == "passive":
        target_buckets = ["passive"]

    for bucket in target_buckets:
        counts = n_vulns.get(bucket, {})
        for sev, count in counts.items():
            if severity and sev != severity:
                continue
            for i in range(count):
                items.append({
                    "id": f"vuln_{bucket}_{sev}_{i}",
                    "severity": sev,
                    "status": bucket if bucket != "total" else "active",
                    "title": f"{sev.capitalize()} vulnerability #{i + 1}",
                    "description": f"Detected {sev} severity issue ({bucket})",
                })

    items.sort(key=lambda x: SEVERITY_ORDER.get(x["severity"], 99))
    return items
