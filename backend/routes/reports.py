import json
from fastapi import APIRouter, HTTPException, UploadFile, File
from services.report_analyzer import get_all_reports, get_report_by_id
from services.data_processor import save_report_file, clear_cache

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("")
def list_reports():
    reports = get_all_reports()
    return {"status": "success", "reports": reports}


@router.get("/{idsummary}")
def get_report(idsummary: str):
    report = get_report_by_id(idsummary)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"status": "success", "data": report}


@router.post("/upload")
async def upload_report(file: UploadFile = File(...)):
    if not file.filename or not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Il file deve essere in formato JSON (.json)")

    content = await file.read()

    try:
        data = json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Il file JSON non è valido")

    if "results" not in data or not isinstance(data.get("results"), list) or len(data["results"]) == 0:
        raise HTTPException(status_code=422, detail="Formato report non valido: campo 'results' mancante o vuoto")

    first = data["results"][0]
    if "idsummary" not in first or "domain_name" not in first:
        raise HTTPException(status_code=422, detail="Formato report non valido: campi 'idsummary' o 'domain_name' mancanti")

    save_report_file(data)   # salva + aggiorna cache con i nuovi dati
    clear_cache()            # poi svuota tutto → prossima GET rilegge da disco

    return {
        "status": "success",
        "message": "Report importato con successo",
        "domain": first.get("domain_name"),
        "idsummary": first.get("idsummary"),
        "risk_score": first.get("risk_score"),
    }
