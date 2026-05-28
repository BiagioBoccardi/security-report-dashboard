from pydantic import BaseModel
from typing import Any, Dict, List, Optional


class EmailSecurity(BaseModel):
    spoofable: str
    dmarc_policy: str
    blacklist_detections: int
    blacklist_total_list: int
    blacklist_detected_list: List[str]


class DataLeak(BaseModel):
    total: Dict[str, int]
    resolved: Dict[str, int]
    unresolved: Dict[str, int]


class SecurityReport(BaseModel):
    idsummary: str
    summary_text: str
    summary_text_en: str
    risk_score: Any
    creation_date: str
    last_edit: str
    domain_name: str

    servizi_esposti_score: int
    dataleak_score: int
    rapporto_leak_email_score: int
    spoofing_score: int
    open_ports_score: int
    blacklist_score: int
    vulnerability_score_active: int
    vulnerability_score_passive: int
    certificate_score: int

    n_asset: int
    n_similar_domains: int
    n_cert_attivi: int
    n_cert_scaduti: int
    unique_ipv4: int
    unique_ipv6: int

    n_port: Dict[str, Any]
    n_dataleak: DataLeak
    n_vulns: Dict[str, Any]
    email_security: EmailSecurity
    waf: Dict[str, Any]
    cdn: Dict[str, Any]


class ReportSummary(BaseModel):
    idsummary: str
    domain_name: str
    risk_score: Any
    creation_date: str
    vulnerability_count: int
    dataleak_count: int
    certificate_count: int
