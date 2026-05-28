from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from services.report_analyzer import get_vulnerabilities

router = APIRouter(prefix="/reports", tags=["vulnerabilities"])


@router.get("/{idsummary}/vulnerabilities")
def list_vulnerabilities(
    idsummary: str,
    severity: Optional[str] = Query(None, description="Filter by severity: critical, high, medium, low, info"),
    status: Optional[str] = Query(None, description="Filter by status: active, passive"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
):
    result = get_vulnerabilities(idsummary, severity=severity, status=status, limit=limit, offset=offset)
    if result is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"status": "success", "count": result["count"], "vulnerabilities": result["items"]}
