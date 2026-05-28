from pydantic import BaseModel
from typing import Any, List


class SuccessResponse(BaseModel):
    status: str = "success"
    data: Any


class ListResponse(BaseModel):
    status: str = "success"
    count: int
    items: List[Any]


class ErrorResponse(BaseModel):
    status: str = "error"
    detail: str
