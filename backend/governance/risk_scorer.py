"""
Governance risk scoring (PRD Section 17).
Risk Score = Tool Risk + Permission Risk + Parameter Risk + Context Risk + Frequency Risk.
All scores normalized to 0-10 range.
"""
from typing import Any, Dict, Optional

# Base tool risk by risk_level
_TOOL_RISK = {"low": 1.0, "medium": 4.0, "high": 8.0}

# Parameter danger patterns
_DANGER_PARAMS = [
    "delete", "drop", "truncate", "export", "all_users", "dump",
    "admin", "root", "../", ";", "--", "exec(", "eval(", "system("
]


def compute_risk_score(
    tool_risk_level: str,
    permission_granted: Optional[bool],
    arguments: Dict[str, Any],
    call_count_in_window: int = 0,
    rate_limit: int = 10,
    requires_approval: bool = False,
) -> float:
    """
    Compute composite risk score (0.0-10.0).

    Args:
        tool_risk_level: 'low', 'medium', or 'high'
        permission_granted: True=explicit allow, False=explicit deny, None=not set
        arguments: dict of tool arguments to inspect for dangerous patterns
        call_count_in_window: how many times this tool was called in current window
        rate_limit: configured max calls per window for this tool
        requires_approval: whether tool metadata says approval needed
    """
    # 1. Tool Risk (0-4)
    tool_score = _TOOL_RISK.get(tool_risk_level, 4.0) * 0.5  # scale to 0-4

    # 2. Permission Risk (0-2): denied or no permission → higher risk
    if permission_granted is True:
        perm_score = 0.0
    elif permission_granted is None:
        perm_score = 1.5  # no explicit permission → suspicious
    else:
        perm_score = 2.0  # explicit deny

    # 3. Parameter Risk (0-2): scan argument values for dangerous patterns
    param_score = 0.0
    all_values = " ".join(str(v) for v in arguments.values()).lower()
    hits = sum(1 for p in _DANGER_PARAMS if p in all_values)
    param_score = min(2.0, hits * 0.5)

    # 4. Context Risk: requires_approval flag (0-1)
    ctx_score = 1.0 if requires_approval else 0.0

    # 5. Frequency Risk (0-1)
    if rate_limit > 0:
        freq_ratio = call_count_in_window / rate_limit
        freq_score = min(1.0, freq_ratio)
    else:
        freq_score = 0.0

    total = tool_score + perm_score + param_score + ctx_score + freq_score
    return round(min(10.0, total), 3)
