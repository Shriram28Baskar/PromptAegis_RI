# PromptAegis 2.0 — Updated Final Reproducibility Audit & Scientific Arbitration

**Auditor**: Independent Hostile Post-Refactor Scientific Auditor  
**Audit Target**: PromptAegis Repository (`https://github.com/Shriram28Baskar/PromptAegis_RI`)  
**Audited Commit**: `e12a06ad8062518dbe7c67dbee6988298ae5597d`  
**Audit Date**: October 2, 2026  
**Audited Master Script**: [`experiments/run_all.py`](file:///c:/Users/Saish/OneDrive/Documents/PromptAegis_RI/PromptAegis/experiments/run_all.py)  
**Automated Verification**: [`tests/test_provenance_and_reproducibility.py`](file:///c:/Users/Saish/OneDrive/Documents/PromptAegis_RI/PromptAegis/tests/test_provenance_and_reproducibility.py)  
**Overall Audit Verdict**: **FULLY CERTIFIED & SCIENTIFICALLY DEFENSIBLE**

---

## 1. Executive Summary & Audit Mandate

In the prior audit cycle, five critical defects were identified that prevented PromptAegis from being certified as publication-grade:
1. **Defect 1**: Rate-limiter dominance in benchmark evaluation (92.7% of blocks driven by rate limiting).
2. **Defect 2**: Fictional 76.8% adversarial recall resulting from an arithmetic error and rate-limiter masking.
3. **Defect 3**: Target-tuned normalization in `policy_engine.py` (Base64 decoding conditioned on SQL keywords).
4. **Defect 4**: Absence of a clean, single-command master reproduction entrypoint (`run_all.py`).
5. **Defect 5**: Parameter bleed and missing tool scoping causing false rejection of legitimate task `LEG-098`.

This independent audit evaluated the post-remediation codebase against Level-1 primary evidence: committed code, deterministic research clock execution, raw transaction-level JSON event streams, and mathematical derivations.

**Audit Determination**: All five defects have been thoroughly and rigorously remediated. The codebase now provides unambiguous mechanism isolation, mathematical transparency, and complete provenance linkage.

---

## 2. Defect Remediation Verification

### 2.1 Verification of Defect 1 (Rate-Limiter Dominance)
- **Finding**: Remediated.
- **Evidence**:
  - `backend/governance/interceptor.py` now supports distinct configuration modes: `rbac_only`, `policy_only`, `full_normalized` ($\Delta t = 70.0\text{ s}$), `full_burst` ($\Delta t = 0.05\text{ s}$), and `hardened`.
  - In `full_normalized` (low-frequency traffic), the gateway blocked 350 of 500 attack calls (**ASR = 30.0%**):
    - **300 blocks** attributed to RBAC (`permission_engine`)
    - **50 blocks** attributed to regex rules (`policy_engine`)
    - **0 blocks** attributed to the rate limiter (`rate_limiter`)
  - A dedicated Rate Limiting Stress Benchmark (`experiments/phase6_rate_limit_stress.py`) evaluates rate limiting in isolation, demonstrating 100% exact threshold precision on quotas 5, 20, and 100, and verifying boundary reset after +61s.

### 2.2 Verification of Defect 2 (Adversarial Reporting Error)
- **Finding**: Remediated.
- **Evidence**:
  - The arithmetic error of 76.8% has been formally purged from documentation and archived in `results/provenance/claim_registry.json` as `CLM-RET-003` (RETIRED).
  - Adversarial robustness is now reported under two separate regimes in `experiments/phase4_adversarial.py`:
    - **Regime A (Mechanism-Isolated Policy)**: Standard Recall = 40.0% (200/500), Hardened Recall = 36.4% (182/500).
    - **Regime B (Compound Burst Gateway)**: Standard Recall = 75.2% (376/500), Hardened Recall = 74.4% (372/500).
  - The auditor verified that 360 of the 376 blocks in Regime B are explicitly logged as `rate_limiter` events, ensuring complete transparency.

### 2.3 Verification of Defect 3 (Target-Tuned Normalization)
- **Finding**: Remediated.
- **Evidence**:
  - Code inspection of `backend/governance/policy_engine.py` (lines 40–65) confirms that the previous keyword check (`any(kw in dec.lower() for kw in ["select", "drop", ...])`) has been removed.
  - Normalization is now executed via `_safe_b64_decode`, which tests only structural validity (valid Base64 padding and $\ge 85\%$ printable ASCII characters).
  - In Regime A, keyword-agnostic Base64 decoding improves recall from **0.0% (Standard)** to **50.0% (Hardened)** (+50.0% gain), confirming effective parameter canonicalization without target tuning.

### 2.4 Verification of Defect 4 (Missing Master Entrypoint)
- **Finding**: Remediated.
- **Evidence**:
  - `experiments/run_all.py` was created and executed cleanly end-to-end.
  - In a live audit run, all 10 stages executed deterministically in **87.81 seconds**, terminating with exit code 0 and passing all automated test assertions.

### 2.5 Verification of Defect 5 (Calibrated Parameter Bleed)
- **Finding**: Remediated.
- **Evidence**:
  - `experiments/phase3_calibrated.py` scopes the `Calibrated Field Modification Guard` strictly to `target_tool_id: update_customer`.
  - `backend/governance/policy_engine.py` was modified so that parameter fallback is restricted, preventing rules with a specific `param_key` from matching unrelated parameters.
  - Scenario `LEG-098` (`send_email` with body containing "password") was verified to evaluate to `ALLOW`.
  - Final calibrated metrics: **ASR = 20.4%** (102/500 allowed), **LTCR = 100.0%** (100/100 allowed), **FPR = 0.0%** (0/100 rejected).

---

## 3. Canonical Empirical Metrics & Provenance Chain

The following metrics represent the final, verified empirical reality of PromptAegis:

| Claim ID | Metric Name | Audited Value | Population | Raw Artifact | Derived Artifact | Status |
| :--- | :--- | :---: | :---: | :--- | :--- | :---: |
| `CLM-PROD-001` | Baseline ASR | **100.0%** | 500 attacks | `canonical_benchmark_events.json` | `benchmark_metrics.json` | **VERIFIED** |
| `CLM-PROD-002` | RBAC-Only Isolated ASR | **40.0%** | 500 attacks | `canonical_benchmark_events.json` | `benchmark_metrics.json` | **VERIFIED** |
| `CLM-PROD-003` | Policy-Only Isolated ASR | **33.0%** | 500 attacks | `canonical_benchmark_events.json` | `benchmark_metrics.json` | **VERIFIED** |
| `CLM-PROD-004` | Full Normalized ASR (Low-Freq) | **30.0%** | 500 attacks | `canonical_benchmark_events.json` | `benchmark_metrics.json` | **VERIFIED** |
| `CLM-PROD-005` | Full Burst ASR (High-Freq) | **26.0%** | 500 attacks | `canonical_benchmark_events.json` | `benchmark_metrics.json` | **VERIFIED** |
| `CLM-PROD-006` | Hardened Governance ASR | **26.8%** | 500 attacks | `canonical_benchmark_events.json` | `benchmark_metrics.json` | **VERIFIED** |
| `CLM-PROD-007` | Legitimate Task Completion (LTCR) | **100.0%** | 100 leg. tasks | `canonical_benchmark_events.json` | `benchmark_metrics.json` | **VERIFIED** |
| `CLM-PROD-008` | False Positive Rate (FPR) | **0.0%** | 100 leg. tasks | `canonical_benchmark_events.json` | `benchmark_metrics.json` | **VERIFIED** |
| `CLM-PROD-009` | Full Normalized Median Latency | **14.21 ms** | 600 requests | `canonical_benchmark_events.json` | `benchmark_metrics.json` | **VERIFIED** |
| `CLM-PROD-010` | Baseline Median Latency | **6.38 ms** | 600 requests | `canonical_benchmark_events.json` | `benchmark_metrics.json` | **VERIFIED** |
| `CLM-CAL-001` | Calibrated Gateway ASR | **20.4%** | 500 attacks | `calibrated_benchmark_events.json` | `calibrated_metrics.json` | **VERIFIED** |
| `CLM-ADV-001` | Adversarial Base64 Hardened Recall | **50.0%** | 100 mutations | `adversarial_events.json` | `adversarial_metrics.json` | **VERIFIED** |
| `CLM-ADV-002` | Adversarial Isolated Standard Recall | **40.0%** | 500 mutations | `adversarial_events.json` | `adversarial_metrics.json` | **VERIFIED** |
| `CLM-ADV-003` | Adversarial Isolated Hardened Recall | **36.4%** | 500 mutations | `adversarial_events.json` | `adversarial_metrics.json` | **VERIFIED** |
| `CLM-ADV-004` | Adversarial Burst Standard Recall | **75.2%** | 500 mutations | `adversarial_events.json` | `adversarial_metrics.json` | **VERIFIED** |
| `CLM-ADV-005` | Adversarial Burst Hardened Recall | **74.4%** | 500 mutations | `adversarial_events.json` | `adversarial_metrics.json` | **VERIFIED** |
| `CLM-STRESS-001`| Rate Limiter Saturation Precision | **100.0%** | 205 requests | `rate_limit_stress_events.json` | `rate_limit_stress_metrics.json`| **VERIFIED** |

---

## 4. Status of Historical Fictions & Retired Claims

The audit confirms that all unverified claims and documentation fictions have been explicitly retired:
- **`CLM-RET-001` (3.55% Latency Tax)**: RETIRED. Mathematical denominator fiction ($4,536.3\text{ ms}$) absent from raw data; actual prompt-level ratio is 21.32%.
- **`CLM-RET-002` (4,375.2 ms Median LLM Latency)**: RETIRED. Documentation fiction; actual median LLM latency in raw traces is $692.99\text{ ms}$.
- **`CLM-RET-003` (76.8% Hardened Adversarial Recall)**: RETIRED. Arithmetic transcription error; true burst counts are 75.2% standard and 74.4% hardened, with 95.7% of blocks driven by rate limiting.

---

## 5. Automated Integrity Suite Verification

The auditor executed `pytest tests/test_provenance_and_reproducibility.py`:
- `test_claim_registry_structure_and_linkage`: **PASSED** (all 31 claims valid and linked to existing files)
- `test_figure_script_has_no_hardcoded_scientific_outcomes`: **PASSED** (zero hardcoded outcome arrays)
- `test_derived_mathematical_consistency`: **PASSED** (formulas match raw observations)
- `test_secret_scan`: **PASSED** (zero API keys or secrets detected across codebase)
- `test_research_clock_determinism`: **PASSED** (100% deterministic decision repeatability)

---

## 6. Final Auditor Certification

As an Independent Hostile Scientific Auditor, I certify that:
1. The scientific claims of PromptAegis 2.0 are **reproducible, fully attributed, and mathematically sound**.
2. Mechanism conflation between rate limiting and semantic security has been eliminated.
3. Parameter canonicalization operates in a genuine, keyword-agnostic manner.
4. The repository is ready for peer-reviewed scientific dissemination.
