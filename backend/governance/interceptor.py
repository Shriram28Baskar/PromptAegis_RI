"""
Tool interception pipeline (PRD FR-05, FR-06, FR-07).
Orchestrates: Permission Check → Policy Evaluation → Risk Scoring → Rate Limiting → Audit Log.

Decision priority:
  1. RATE_LIMIT (if rate limit exceeded)
  2. Policy engine DENY/REQUIRE_APPROVAL (explicit policy match)
  3. Permission engine DENY (no permission)
  4. Risk score threshold gate (high-risk tool requires explicit ALLOW)
  5. ALLOW
"""
import time
import uuid
from typing import Any, Dict, Optional, Tuple

from database import db
from governance.permission_engine import check_permission
from governance.policy_engine import evaluate_policies
from governance.rate_limiter import check_and_increment
from governance.risk_scorer import compute_risk_score


def intercept(
    agent_id: str,
    tool_name: str,
    arguments: Dict[str, Any],
    user_id: str = "",
    configuration: str = "full",  # 'baseline' | 'permission' | 'policy' | 'full'
    experiment_run_id: str = "",
) -> Dict[str, Any]:
    """
    Main interception entry point.

    Args:
        agent_id: Registered agent identifier
        tool_name: Name of the tool being invoked
        arguments: Tool call arguments dict
        user_id: Optional user identifier for audit
        configuration: Which governance controls are active
        experiment_run_id: Optional experiment run ID for benchmark tracking

    Returns dict with keys:
        decision: 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL' | 'RATE_LIMIT'
        reason: human-readable reason string
        policy_id: matched policy ID (if any)
        risk_score: computed risk score
        call_id: audit log UUID
        latency_ms: processing time
    """
    t0 = time.perf_counter()
    call_id = str(uuid.uuid4())

    # Fetch tool metadata
    tool_row = db.get_tool_by_name(tool_name)
    if tool_row is None:
        # Unknown tool — DENY (secure by default)
        decision = "DENY"
        reason = "UNKNOWN_TOOL"
        policy_id = ""
        risk_score = 10.0
        latency_ms = (time.perf_counter() - t0) * 1000
        _audit(call_id, agent_id, user_id, tool_name, arguments, decision,
               reason, policy_id, risk_score, latency_ms, experiment_run_id, configuration)
        return _result(decision, reason, policy_id, risk_score, call_id, latency_ms)

    tool_risk = tool_row["risk_level"]
    requires_approval = bool(tool_row["requires_approval"])

    # Baseline: no governance — just execute (always ALLOW)
    if configuration == "baseline":
        decision, reason, policy_id = "ALLOW", "BASELINE_NO_GOVERNANCE", ""
        risk_score = compute_risk_score(tool_risk, True, arguments, 0, 10, requires_approval)
        latency_ms = (time.perf_counter() - t0) * 1000
        _audit(call_id, agent_id, user_id, tool_name, arguments, decision,
               reason, policy_id, risk_score, latency_ms, experiment_run_id, configuration)
        return _result(decision, reason, policy_id, risk_score, call_id, latency_ms)

    # Step 1: Rate limiting (all configurations except baseline)
    if configuration in ("full", "policy"):
        rate_ok, call_count, limit = check_and_increment(agent_id, tool_name)
        if not rate_ok:
            decision = "RATE_LIMIT"
            reason = f"RATE_LIMIT_EXCEEDED:{call_count}/{limit}_per_60s"
            policy_id = ""
            risk_score = compute_risk_score(tool_risk, None, arguments, call_count, limit, requires_approval)
            latency_ms = (time.perf_counter() - t0) * 1000
            _audit(call_id, agent_id, user_id, tool_name, arguments, decision,
                   reason, policy_id, risk_score, latency_ms, experiment_run_id, configuration)
            return _result(decision, reason, policy_id, risk_score, call_id, latency_ms)
    else:
        call_count, limit = 0, 10

    # Step 2: Permission check
    perm_granted = None
    if configuration in ("permission", "policy", "full"):
        perm_ok, perm_reason = check_permission(agent_id, tool_name)
        perm_granted = perm_ok
        if not perm_ok:
            risk_score = compute_risk_score(tool_risk, False, arguments, call_count, limit, requires_approval)
            # Policy engine still gets a chance to override (e.g., REQUIRE_APPROVAL instead of outright DENY)
            if configuration in ("policy", "full"):
                agent_row = db.get_agent(agent_id)
                agent_role = agent_row["role"] if agent_row else "default"
                pol_action, pol_reason, policy_id = evaluate_policies(agent_id, tool_name, arguments, agent_role)
                if pol_action not in ("PASS", "ALLOW"):
                    decision = pol_action
                    reason = pol_reason
                else:
                    decision = "DENY"
                    reason = perm_reason
                    policy_id = ""
            else:
                decision = "DENY"
                reason = perm_reason
                policy_id = ""
            latency_ms = (time.perf_counter() - t0) * 1000
            _audit(call_id, agent_id, user_id, tool_name, arguments, decision,
                   reason, policy_id, risk_score, latency_ms, experiment_run_id, configuration)
            return _result(decision, reason, policy_id, risk_score, call_id, latency_ms)

    # Step 3: Policy evaluation
    policy_id = ""
    if configuration in ("policy", "full"):
        agent_row = db.get_agent(agent_id)
        agent_role = agent_row["role"] if agent_row else "default"
        pol_action, pol_reason, policy_id = evaluate_policies(agent_id, tool_name, arguments, agent_role)
        if pol_action not in ("PASS", "ALLOW"):
            risk_score = compute_risk_score(tool_risk, perm_granted, arguments, call_count, limit, requires_approval)
            decision = pol_action
            reason = pol_reason
            latency_ms = (time.perf_counter() - t0) * 1000
            _audit(call_id, agent_id, user_id, tool_name, arguments, decision,
                   reason, policy_id, risk_score, latency_ms, experiment_run_id, configuration)
            return _result(decision, reason, policy_id, risk_score, call_id, latency_ms)

    # Step 4: Risk-based gate (full configuration only)
    risk_score = compute_risk_score(tool_risk, perm_granted, arguments, call_count, limit, requires_approval)
    if configuration == "full" and requires_approval and risk_score >= 7.0:
        decision = "REQUIRE_APPROVAL"
        reason = f"HIGH_RISK_REQUIRES_APPROVAL:score={risk_score}"
        latency_ms = (time.perf_counter() - t0) * 1000
        _audit(call_id, agent_id, user_id, tool_name, arguments, decision,
               reason, policy_id, risk_score, latency_ms, experiment_run_id, configuration)
        return _result(decision, reason, policy_id, risk_score, call_id, latency_ms)

    # Step 5: ALLOW
    decision = "ALLOW"
    reason = "ALL_CHECKS_PASSED"
    latency_ms = (time.perf_counter() - t0) * 1000
    _audit(call_id, agent_id, user_id, tool_name, arguments, decision,
           reason, policy_id, risk_score, latency_ms, experiment_run_id, configuration)
    return _result(decision, reason, policy_id, risk_score, call_id, latency_ms)


def _audit(call_id, agent_id, user_id, tool_name, arguments, decision,
           reason, policy_id, risk_score, latency_ms, experiment_run_id, configuration):
    db.insert_tool_call(
        call_id=call_id, agent_id=agent_id, tool_name=tool_name,
        arguments=arguments, decision=decision, reason=reason,
        risk_score=risk_score, policy_id=policy_id, user_id=user_id,
        latency_ms=latency_ms, experiment_run_id=experiment_run_id,
        configuration=configuration
    )


def _result(decision, reason, policy_id, risk_score, call_id, latency_ms) -> Dict[str, Any]:
    return {
        "decision": decision,
        "reason": reason,
        "policy_id": policy_id,
        "risk_score": risk_score,
        "call_id": call_id,
        "latency_ms": round(latency_ms, 3),
    }
