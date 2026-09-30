"""
Prompt Aegis Governance Layer (PRD Section 12-20).
"""
from governance.interceptor import intercept
from governance.permission_engine import check_permission
from governance.policy_engine import evaluate_policies
from governance.rate_limiter import check_and_increment, get_limit, set_limit
from governance.risk_scorer import compute_risk_score
from governance.adapter import AgentAdapter, StandardToolRequest

__all__ = [
    "intercept",
    "check_permission",
    "evaluate_policies",
    "check_and_increment",
    "get_limit",
    "set_limit",
    "compute_risk_score",
    "AgentAdapter",
    "StandardToolRequest",
]
