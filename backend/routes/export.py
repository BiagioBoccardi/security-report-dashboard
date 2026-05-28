from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from typing import Literal
from services.export_service import export_report_csv, export_report_json

router = APIRouter(prefix="/reports", tags=["export"])


@router.get("/{idsummary}/export")
def export_report(
    idsummary: str,
    format: Literal["csv", "json"] = Query("json", description="Export format: csv or json"),
):
    if format == "csv":
        content, filename = export_report_csv(idsummary)
        if content is None:
            raise HTTPException(status_code=404, detail="Report not found")
        return StreamingResponse(
            iter([content]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    else:
        content, filename = export_report_json(idsummary)
        if content is None:
            raise HTTPException(status_code=404, detail="Report not found")
        return StreamingResponse(
            iter([content]),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
