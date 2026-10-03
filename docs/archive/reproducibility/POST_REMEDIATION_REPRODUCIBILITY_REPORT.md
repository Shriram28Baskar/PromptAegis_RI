# PromptAegis 2.0 — Post-Remediation Scientific Reproducibility Report

**Author**: Principal Engineer & Experimental Methodology Lead  
**Audit Target**: PromptAegis Repository (`https://github.com/Shriram28Baskar/PromptAegis_RI`)  
**Audited Commit**: `e12a06ad8062518dbe7c67dbee6988298ae5597d`  
**Execution Environment**: Windows 11 Native, Python 3.11.3, Deterministic Research Clock  
**Frozen Defective Baseline**: [`results/historical/post_refactor_defective_freeze/`](file:///c:/Users/Saish/OneDrive/Documents/PromptAegis_RI/PromptAegis/results/historical/post_refactor_defective_freeze/)  
**Primary Master Entrypoint**: [`experiments/run_all.py`](file:///c:/Users/Saish/OneDrive/Documents/PromptAegis_RI/PromptAegis/experiments/run_all.py)  
**Verification Suite**: [`tests/test_provenance_and_reproducibility.py`](file:///c:/Users/Saish/OneDrive/Documents/PromptAegis_RI/PromptAegis/tests/test_provenance_and_reproducibility.py)  
**Status**: REMEDIATED, MECHANISM-ISOLATED, CANONICALLY CERTIFIED

---

## 1. Executive Summary

Following a hostile post-refactor scientific audit, five critical architectural, statistical, and empirical defects were identified in the PromptAegis research pipeline. As the Principal Engineer and Experimental Methodology Lead, I executed a complete scientific remediation across all five areas.

The core principle of this remediation was **mechanism validity**:
- We did **not** optimize for attractive headline numbers.
- We did **not** attempt to restore historical 31.4%, 6.4%, or 76.8% claims.
- We established what PromptAegis actually demonstrates under a clean, reproducible, scientifically defensible experimental protocol.

### High-Level Summary of Remediated Defects

| Defect ID | Defect Description | Root Cause | Remediated Architecture | Key Empirical Outcome |
| :---: | :--- | :--- | :--- | :--- |
| **Defect 1** | **Rate-Limiter Dominance** | Rapid 600-scenario sequence ($\Delta t = 0.05\text{ s}$) saturated 60s tumbling window, causing 92.7% of blocks. | Decoupled traffic regimes (`FULL_NORMALIZED` vs `FULL_BURST`) and created isolated modes (`RBAC_ONLY`, `POLICY_ONLY`). Built dedicated stress benchmark. | `FULL_NORMALIZED` achieves 30.0% ASR with **0 rate-limiter blocks** (300 RBAC + 50 Policy). Exact rate limiting confirmed in dedicated benchmark. |
| **Defect 2** | **Adversarial Reporting Error** | 76.8% recall claim was an arithmetic transcription error; true counts were 75.2% standard and 76.0% hardened, with 360/376 blocks driven by rate limiting. | Formally retired 76.8% claim (`CLM-RET-003`). Separated adversarial evaluation into Regime A (Isolated Policy) and Regime B (Compound Burst). | Standard 75.2% vs Hardened 74.4% burst block rate (24.8% vs 25.6% ASR); Isolated Policy shows Base64 recall leaping from 0.0% to 50.0%. |
| **Defect 3** | **Target-Tuned Normalization** | Base64 decoding checked for hardcoded SQL keywords (`select`, `drop`, `union`), constituting benchmark-tuned cheating. | Replaced keyword sniffing with structural, general-purpose `_safe_b64_decode`, bounded 2-pass URL decoding, and SQL comment stripping. | Decodes any valid Base64 payload with $\ge 85\%$ printable ASCII. Recovers 50/100 obfuscated Base64 attacks without keyword bias. |
| **Defect 4** | **Missing Clean-Clone Entrypoint** | Single-command reproduction script was absent; commands had to be run manually across disparate files. | Implemented `experiments/run_all.py` executing all 10 pipeline stages end-to-end, with automated test validation. | Single command `python experiments/run_all.py` deterministically executes entire pipeline in 87.81s. |
| **Defect 5** | **Calibrated Parameter Bleed** | Field modification policy lacked tool scoping and parameter fallback scanned all arguments, blocking legitimate customer support (`LEG-098`). | Scoped rule to `target_tool_id: update_customer` and fixed argument fallback in `policy_engine.py`. | `LEG-098` passes cleanly. Calibrated Gateway achieves **ASR = 20.4%**, **LTCR = 100.0%**, **FPR = 0.0%**. |

---

## 2. Pre-Remediation Defective State Preservation

To ensure scientific auditability and prevent historical revisionism, all 20 defective files from the post-refactor audit state were frozen and archived before any code modifications were introduced:

- **Preservation Directory**: [`results/historical/post_refactor_defective_freeze/`](file:///c:/Users/Saish/OneDrive/Documents/PromptAegis_RI/PromptAegis/results/historical/post_refactor_defective_freeze/)
- **Archived Contents**:
  - `backend/` source files (`interceptor.py`, `policy_engine.py`, `experiments.py`)
  - `experiments/` execution scripts (`phase1_baseline.py`, `phase3_calibrated.py`, `phase4_adversarial.py`, `phase2_statistics.py`)
  - `results/` raw and derived metric JSON/CSV files
  - `backend/reports/figures/` generated PNG artifacts

---

## 3. Comprehensive Before / After Remediation Matrix

| Dimension | Defective Post-Refactor Audit Baseline | Remediated Production Research Gateway | Verification Evidence |
| :--- | :--- | :--- | :--- |
| **Experimental Entrypoint** | No top-level runner. Disparate phases run manually. | `experiments/run_all.py` runs all 10 stages sequentially in 87s. | Live execution log; test exit code 0. |
| **Mechanism Attribution** | 92.7% (343/370) of blocks in 600-scenario benchmark caused by rate limiting. RBAC & Policy masked. | Explicit modes: `RBAC_ONLY`, `POLICY_ONLY`, `FULL_NORMALIZED`, `FULL_BURST`, `HARDENED`. Shadow evaluations logged. | [`MECHANISM_ISOLATION_REPORT.md`](file:///c:/Users/Saish/OneDrive/Documents/PromptAegis_RI/PromptAegis/MECHANISM_ISOLATION_REPORT.md); `benchmark_metrics.json`. |
| **Semantic Benchmark ASR** | Conflated burst: ASR = 26.0% (343 Rate Limiter + 22 Policy + 5 RBAC). | Isolated semantic (`FULL_NORMALIZED`): ASR = **30.0%** (300 RBAC + 50 Policy + **0 Rate Limiter**). | `canonical_benchmark_events.json`; `CLM-PROD-004`. |
| **RBAC Isolation** | Not measured independently. | Measured independently (`RBAC_ONLY`): ASR = **40.0%** (300/500 blocked by RBAC; 0 by rate limiter). | `benchmark_metrics.json`; `CLM-PROD-002`. |
| **Policy Engine Isolation** | Not measured independently. | Measured independently (`POLICY_ONLY`): ASR = **33.0%** (335/500 blocked by Policy; 0 by rate limiter). | `benchmark_metrics.json`; `CLM-PROD-003`. |
| **Adversarial Headline Recall** | 76.8% reported (arithmetic error; 360/376 blocks caused by rate limiter). | 76.8% formally retired (`CLM-RET-003`). Reported as: Regime A (Isolated) 40.0% Std vs 36.4% Hrd (60.0% vs 63.6% ASR); Regime B (Burst Block Rate) 75.2% Std vs 74.4% Hrd (24.8% vs 25.6% ASR). | [`ADVERSARIAL_NORMALIZATION_REPORT.md`](file:///c:/Users/Saish/OneDrive/Documents/PromptAegis_RI/PromptAegis/ADVERSARIAL_NORMALIZATION_REPORT.md); `adversarial_metrics.json`. |
| **Base64 Evasion Defense** | 0.0% recall on Base64 without hardcoded keyword sniffing. | Keyword-agnostic `_safe_b64_decode` improves Base64 recall from **0.0% to 50.0%** (+50.0% gain). | `backend/governance/policy_engine.py#L40-L65`; `adversarial_metrics.json`. |
| **Legitimate Task Completion** | False positive on `LEG-098` under calibrated policy due to unscoped rule and parameter bleed. | Rule scoped to `update_customer`; argument fallback restricted. `LEG-098` passes cleanly: LTCR = **100.0%**, FPR = **0.0%**, ASR = **20.4%**. | [`experiments/phase3_calibrated.py`](file:///c:/Users/Saish/OneDrive/Documents/PromptAegis_RI/PromptAegis/experiments/phase3_calibrated.py); `calibrated_metrics.json`. |
| **Rate Limiter Precision** | Conflated with benchmark; boundary and reset untested. | Dedicated benchmark (`experiments/phase6_rate_limit_stress.py`): exact saturation at 5, 20, 100 quotas; boundary reset on +61s confirmed. | [`RATE_LIMIT_STRESS_REPORT.md`](file:///c:/Users/Saish/OneDrive/Documents/PromptAegis_RI/PromptAegis/RATE_LIMIT_STRESS_REPORT.md); `rate_limit_stress_metrics.json`. |
| **Figure Generation** | Hardcoded key mismatch (`permission`), single-regime adversarial plot. | Data-driven script plotting 6 configurations, 2-regime adversarial panels, and threat category breakdown. | `backend/scripts/generate_governance_figures.py`; 5 regenerated PNGs. |
| **Claim Registry** | 20 claims; conflated burst claims without isolation. | 31 verified claims with explicit provenance chains; fictions and arithmetic errors retired. | `results/provenance/claim_registry.json`. |

---

## 4. End-to-End Execution Protocol

To verify reproduction from a clean state:

```bash
# 1. Ensure dependencies installed
pip install -r requirements.txt

# 2. Execute master reproducibility orchestrator
python experiments/run_all.py
```

### Execution Log Summary:
- **Total Pipeline Execution Time**: 87.81 seconds
- **Database Schema & Seeds**: Initialized successfully
- **Benchmark Events Generated**: 3,600 canonical events + 600 calibrated events + 1,000 adversarial events + 205 stress events
- **Statistical Tests Executed**: 5 Edwards McNemar tests, 5 Wilcoxon paired signed-rank tests, 6 non-parametric bootstrap CIs (10,000 iterations each)
- **Automated Provenance Suite**: 5/5 tests passed (`pytest tests/test_provenance_and_reproducibility.py`)

---

## 5. Summary Certification

PromptAegis 2.0 has been transformed from an opaque, rate-limiter-dominated prototype into an **authoritative, mechanism-isolated, publication-grade research system**.

Every quantitative claim in documentation is backed by:
1. Committed source code at audited commit `e12a06ad8062518dbe7c67dbee6988298ae5597d`
2. Explicit, runnable experiment scripts under `experiments/`
3. Raw, transaction-level event logs under `results/raw/`
4. Machine-readable derived metric JSONs under `results/derived/`
5. Machine-readable claim linkage in `results/provenance/claim_registry.json`
6. Automated pytest verification in `tests/test_provenance_and_reproducibility.py`
