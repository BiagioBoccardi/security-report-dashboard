from pydantic import BaseModel
from typing import List, Optional


class VulnerabilityFilter(BaseModel):
    severity: Optional[List[str]] = None
    status: Optional[str] = None
    port: Optional[int] = None
    limit: int = 50
    offset: int = 0
