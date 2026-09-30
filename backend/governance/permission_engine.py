"""
Permission engine (PRD Section 14, FR-03).
Implements least-privilege model: agents must have an explicit ALLOW permission
for each tool. Absence of permission → DENY.
"""
from typing import Optional, Tuple

from database import db


def check_permission(agent_id: str, tool_name: str) -> Tuple[bool, str]:
    """
    Check if agent_id is allowed to use tool_name.

    Returns:
        (allowed: bool, reason: str)
    """
    allowed = db.is_tool_allowed_for_agent(agent_id, tool_name)
    if allowed is True:
        return True, "PERMISSION_GRANTED"
    elif allowed is False:
        return False, "INSUFFICIENT_PERMISSION"
    else:
        # No permission record at all → default deny
        return False, "NO_PERMISSION_RECORD"
