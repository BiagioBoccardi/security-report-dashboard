VALID_SEVERITIES = {"critical", "high", "medium", "low", "info"}
VALID_STATUSES = {"active", "passive"}


def validate_severity(value: str) -> bool:
    return value in VALID_SEVERITIES


def validate_status(value: str) -> bool:
    return value in VALID_STATUSES
