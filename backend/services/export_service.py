import csv
import io
import json
from typing import Optional, Tuple
from services.report_analyzer import get_report_by_id, get_vulnerabilities


def export_report_csv(idsummary: str) -> Tuple[Optional[bytes], Optional[str]]:
    result = get_vulnerabilities(idsummary, limit=500)
    if result is None:
        return None, None

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=["id", "severity", "status", "title", "description"])
    writer.writeheader()
    writer.writerows(result["items"])
    return output.getvalue().encode("utf-8"), f"{idsummary}_vulnerabilities.csv"


def export_report_json(idsummary: str) -> Tuple[Optional[bytes], Optional[str]]:
    report = get_report_by_id(idsummary)
    if not report:
        return None, None
    return json.dumps(report, ensure_ascii=False, indent=2).encode("utf-8"), f"{idsummary}_report.json"
