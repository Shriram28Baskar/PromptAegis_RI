# Findings and Recommendations for the Author
**Document Version:** 3.0 | **Date:** October 1, 2026 | **Scope:** Reproducibility Assessment of PromptAegis

---

### 1. What Reproduces from the Committed Backend
The committed repository (`backend/` as of commit `e12a06a`) reproducibly implements and demonstrates the following core capabilities:
- **Baseline Unmitigated Control**: 100.0% Attack Success Rate (500/500 attacks execute), 100.0% Legitimate Task Completion Rate (100/100 legitimate queries succeed), 0.0% False Positive Rate.
- **Permission-Only (RBAC)**: Deterministically blocks 320/500 attacks (36.0% ASR) across unauthorized tool use and privilege escalation. Holds an 80.0% LTCR (20.0% FPR) because the default seeded `CustomerSupportAgent` is not granted `update_customer` permission.
- **Relational Schema**: All 9 relational tables (`logs`, `agents`, `tools`, `permissions`, `policies`, `tool_calls`, `rate_limit_counters`, `experiment_runs`, `experiment_events`) are properly initialized via SQLite.
- **Original Detection Pipeline**: Classifier, rule engine, semantic embeddings, and benign stress tests (0.00% FPR across 500 benign and 50 trigger-word samples) execute deterministically.

---

### 2. What Reproduces Only from Uncommitted Scripts
Key headline claims in `README.md` and evaluation reports depend on scripts in the uncommitted scratch environment (`scratch/`):
- **Calibrated Configuration (6.4% ASR, 100% LTCR, 0% FPR)**: Reproduces only via `scratch/phase3_calibrated_evaluation.py`. The real committed gateway achieves 20.8% ASR under equivalent DB policies.
- **Adversarial Extension Perturbation Recalls (54.8% Standard, 66.0% Hardened)**: Reproduces bit-for-bit (SHA-256 `baa1c383...`) only via `scratch/phase4_adversarial_extension.py`.
- **Closed-Loop LLM Agent Pilot (40% Induction, 10% Governed Breach, 161.1 ms Gateway Overhead)**: Traces exist in `scratch/closed_loop_traces.csv`. Live execution requires Groq API access.
- **Statistical Bootstrap CIs**: Exact 95% bootstrap intervals reproduce from `results_control_baseline.json` via `scratch/phase2_statistical_analysis.py`.

---

### 3. Contradicted Claims and Logic Mismatches
- **Excessive Calls Interception in Table 2 vs Table 1**: `README.md` Table 2 reports 100% interception (0 breached) for excessive calls. However, in `results_control_baseline.json`, 0/100 excessive calls were blocked, which was the mathematical cause of the 31.4% headline ASR ($100 + 100 + 100 + 43 + 0 = 343$ blocked).
- **Risk Gate Logic**: `README.md:195` states tool execution halts if risk score $\ge 7.0$ **OR** if `requires_approval = 1`. In `backend/governance/interceptor.py:138`, the implementation enforces a logical **AND** (`if configuration == "full" and requires_approval and risk_score >= 7.0:`).
- **Closed-Loop Latency Tax**: `README.md:330` reports a 3.55% latency tax, derived from $161.1\text{ ms} / 4,536.3\text{ ms}$. In primary trace data (`closed_loop_traces.csv`), mean LLM latency is 755.83 ms, making the direct single-call overhead ratio $161.11 / 755.83 = 21.32\%$. The 4,536.3 ms figure is not found in primary trace logs.
- **Tumbling-Window Rollover**: The benchmark runner relies on wall-clock tumbling windows (`math.floor(time.time() / 60)`). If a 600-scenario run crosses a minute boundary, rate-limit pre-saturation expires, causing excessive calls blocks to drop from 100 to 0 and ASR to jump from 8.0% to 28.0%–32.0%.

---

### 4. Simulated and Hardcoded Elements
- **Calibrated Latency Constants**: In `phase3_calibrated_evaluation.py`, lines 50, 56, 65, 72, 79, 84, and 88 hardcode synthetic millisecond constants (`+ 15.0`, `+ 25.0`, `+ 35.0`, `+ 40.0`, `+ 41.0`, `+ 42.0`, `+ 55.0`). The reported 25.00 ms median latency is synthetic rather than measured.
- **Hardened Adversarial Decoders**: The URL and Base64 decoders evaluated in Phase 4 exist only inside `evaluate_defense()` in `phase4_adversarial_extension.py`; they are absent from `backend/governance/policy_engine.py`.
- **Figure Plotting Literals**: `backend/scripts/generate_governance_figures.py:80` defines bootstrap CI intervals as hardcoded float literals rather than loading from database queries.

---

### 5. Mandatory Secret-Handling Warning
> [!WARNING]
> **Active Groq API Key Exposure Risk**:
> - An active Groq API key (`gsk_...`, length 56) is present in two uncommitted local files: `backend/.env:1` and `scratch/phase5_closed_loop_llm.py:31`.
> - **Action Required Before Sharing or Committing**:
>   1. Sanitize `scratch/phase5_closed_loop_llm.py:31` to read credentials dynamically from an environment variable: `os.environ.get("GROQ_API_KEY")`.
>   2. Immediately rotate the API key in the Groq Cloud Console.
>   3. Ensure `.env` remains listed in `.gitignore` and is never committed to version control.

---

### 6. Minimal File and Runner Changes for Full Reproducibility
To make all quantitative claims reproducible directly from a clean `git clone`, apply the following changes:
1. **Move Benchmark Scenarios**: Remove `adversarial_extension.json` from `backend/data/benchmark/` to avoid polluting the canonical 600-scenario suite. Place it in `backend/data/adversarial/`.
2. **Deterministic Time Mocking**: In `backend/governance/rate_limiter.py`, allow the benchmark runner to supply a simulated virtual timestamp rather than relying on wall-clock `time.time()`.
3. **Harmonize Interceptor Logic**: Align `interceptor.py:138` with `README.md` by supporting configurable OR gating (`if requires_approval or risk_score >= 7.0:`).
4. **Incorporate Calibrated Policies**: Add the calibrated parameter rules (checking argument key `"to"` for email domains and SQL injection keywords on search queries) into `backend/api/governance.py:_SEED_POLICIES`.
5. **Port Adversarial Decoders**: Integrate URL unquoting and Base64 decoding into `backend/governance/policy_engine.py` so the gateway natively demonstrates the reported 66.0% hardened recall.
6. **Commit Core Scratch Scripts**: Sanitize secrets from `phase1`–`phase5` and commit them under `backend/scripts/research/` alongside a single top-level runner (`run_all_evaluations.py`).
