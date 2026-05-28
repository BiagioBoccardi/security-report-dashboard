from fastapi import APIRouter, HTTPException
from services.analytics_service import get_analytics

router = APIRouter(prefix="/reports", tags=["analytics"])


@router.get("/{idsummary}/analytics")
def report_analytics(idsummary: str):
    data = get_analytics(idsummary)
    if data is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"status": "success", "analytics": data}
