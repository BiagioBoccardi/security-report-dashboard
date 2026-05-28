import json
import os
from typing import Any, Dict, Optional

_cache: Dict[str, Any] = {}

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


def load_report_file(filename: str = "cybersonar-report.json") -> Optional[Dict]:
    if filename in _cache:
        return _cache[filename]
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    _cache[filename] = data
    return data


def save_report_file(data: Dict, filename: str = "cybersonar-report.json") -> str:
    os.makedirs(DATA_DIR, exist_ok=True)
    path = os.path.join(DATA_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    _cache[filename] = data
    return path


def clear_cache(filename: Optional[str] = None) -> None:
    if filename:
        _cache.pop(filename, None)
    else:
        _cache.clear()
