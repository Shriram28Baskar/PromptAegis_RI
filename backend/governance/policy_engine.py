"""
Policy engine (PRD Sections 15-16, FR-04, FR-06).
Evaluates enabled policies in priority order and returns the first matching action.
Supports policy types:
  - tool_based: block agent from using specific tool
  - parameter_based: block based on argument values
  - role_based: block based on agent role
  - context_based: block based on session context
  - rate_based: additional rate control beyond rate_limiter
"""
from typing import Any, Dict, List, Optional, Tuple

from database import db


def evaluate_policies(
    agent_id: str,
    tool_name: str,
    arguments: Dict[str, Any],
    agent_role: str = "default",
) -> Tuple[str, str, str]:
    """
    Evaluate all enabled policies in priority order.

    Returns:
        (action, reason, policy_id)
        action: 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL' | 'RATE_LIMIT' | 'PASS'
        'PASS' means no policy matched → caller uses permission engine result.
    """
    policies = db.list_policies(enabled_only=True)
    agent = db.get_agent(agent_id)

    for policy in policies:
        pid = policy["policy_id"]
        ptype = policy["policy_type"]
        action = policy["action"]
        cond = policy.get("condition", {})
        ta = policy.get("target_agent_id")
        tt = policy.get("target_tool_id")

        # Agent filter
        if ta and ta != agent_id:
            continue
        # Tool filter
        if tt:
            tool_row = db.get_tool(tt)
            if tool_row and tool_row["name"] != tool_name:
                continue

        if ptype == "tool_based":
            # Policy targets a specific tool by name
            target_tool_name = cond.get("tool_name", "")
            if not target_tool_name:
                # No tool specified — skip (malformed policy)
                continue
            if target_tool_name != tool_name:
                continue
            return action, f"POLICY_{ptype.upper()}:{target_tool_name}", pid

        elif ptype == "parameter_based":
            # Block if a specific argument key has a forbidden value
            param_key = cond.get("param_key", "")
            forbidden_values = cond.get("forbidden_values", [])
            forbidden_domains = cond.get("forbidden_domains", [])
            arg_val = str(arguments.get(param_key, "")).lower()
            if forbidden_values:
                if any(fv.lower() in arg_val for fv in forbidden_values):
                    return action, f"PARAMETER_VIOLATION:{param_key}", pid
            if forbidden_domains:
                if any(fd.lower() in arg_val for fd in forbidden_domains):
                    return action, f"DOMAIN_VIOLATION:{param_key}", pid
            continue

        elif ptype == "role_based":
            # Apply action only if agent's role matches
            target_role = cond.get("role", "")
            blocked_tool = cond.get("blocked_tool", "")
            if agent and agent.get("role") == target_role:
                if blocked_tool and blocked_tool != tool_name:
                    continue
                return action, f"ROLE_RESTRICTION:{target_role}", pid
            continue

        elif ptype == "context_based":
            # Simple context check: e.g., tool only allowed during certain hours
            # For research MVP, this always passes through
            continue

        elif ptype == "rate_based":
            # Handled by rate_limiter.py — skip here
            continue

    return "PASS", "NO_POLICY_MATCHED", ""
