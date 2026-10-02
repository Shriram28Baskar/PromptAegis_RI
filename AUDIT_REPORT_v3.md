# PromptAegis — Final Scientific Reproducibility Audit Report (v3)
**Auditor Role:** Independent Senior Research Reproducibility Auditor  **Audit Version:** 3.0 (Final Reconciled Verification)  **Target Repository:** `Shriram28Baskar/PromptAegis_RI`  **Audit Date:** October 1, 2026  
---
## Executive Summary
This document provides the definitive reproducibility audit of the PromptAegis research record, completing the reconciliation of audit passes v1 and v2. Over the course of this multi-stage audit, every quantitative, architectural, statistical, and latency claim across `README.md`, `backend/reports/`, and associated artifacts was tracked against Level-1 experimental data, committed source code, uncommitted research scripts in `scratch/`, and live benchmark executions.
All quantitative claims (75 claims in total: C01–C72 plus new items C73–C75) have been systematically audited and assigned strictly evidentiary labels based on reproducibility from the committed repository versus uncommitted scratch scripts.

### Audit Standard and Label Definitions
To prevent conflating committed repository functionality with uncommitted scratch experiments, this report uses seven rigorously defined classifications:
1. **`REPRODUCED`**: The claim was dynamically verified and reproduced from the committed backend repository code without requiring any uncommitted files, modified runners, or external API keys.
2. **`REPRODUCED-OFFLINE`**: The claim was successfully reproduced from standalone scripts or historical datasets preserved in the author's uncommitted `scratch/` workspace, but cannot be reproduced directly from the committed backend repository.
3. **`PARTIALLY REPRODUCED`**: The evaluation code executes successfully, but the empirical outcome differs in magnitude (e.g. CPU hardware differences in latency benchmarks), interception mechanism (e.g. rate-limit preemption blocking an attack before RBAC/policy can evaluate it), or timing window phase.
4. **`CONTRADICTED`**: The claim is directly contradicted by primary source code implementation, raw Level-1 experimental records (e.g. trace logs), or internal mathematical self-contradiction.
5. **`HARDCODED`**: The reported value is not dynamically computed or measured, but is an arbitrarily hardcoded literal, synthetic offset constant, or static figure label.
6. **`UNVERIFIABLE`**: The claim cannot be verified because required external services, API credentials, or primary evidence artifacts do not exist.
7. **`NOT EXECUTED`**: The script or benchmark was not run.

### Reconciled Census and v1 -> v2 -> v3 Transition Matrix
| Classification Label | v1 Count | v2 Count | v3 Count | v3 Proportion | Notes on Census Reconciliation |
|:---|:---:|:---:|:---:|:---:|:---|
| **`REPRODUCED`** | 23 | 16 | **17** | 22.7% | Claims fully reproducible from committed backend (`C01–C05`, `C07`, `C09–C10`, `C14–C15`, `C19–C20`, `C39`, `C64–C65`, `C71–C72`). |
| **`REPRODUCED-OFFLINE`** | — | — | **29** | 38.7% | Distinct category introduced in v3 for claims reproducible exclusively via `scratch/` scripts or stored Level-1 datasets (`C08`, `C13`, `C18`, `C26–C27`, `C28–C31`, `C37`, `C40–C48`, `C49–C56`, `C62–C63`). |
| **`PARTIALLY REPRODUCED`** | 13 | 20 | **18** | 24.0% | Incorporates latency benchmarks (`C06`, `C11`, `C16`, `C21–C22`, `C58–C61`, `C66–C69`), tumbling window rollover (`C12`, `C38`), and Rate Limiter preemption in Full mode (`C33–C35`). |
| **`CONTRADICTED`** | 5 | 6 | **9** | 12.0% | Contradictions established by code or Level-1 data: `C17` (ASR 31.4%), `C23–C25` (McNemar stats), `C36` (PM 43%), `C57` (3.55% latency tax), `C70` (AND vs OR risk gate), `C73` (4,375.2 ms median latency), `C75` (decoders outside gateway). |
| **`HARDCODED`** | 17 | 16 | **2** | 2.7% | Narrowed to claims with synthetic constants: `C32` (calibrated latency offset) and `C74` (calibrated latency synthetic additions). |
| **`UNVERIFIABLE`** | 14 | 14 | **0** | 0.0% | Dropped to 0 as all closed-loop and calibrated claims were verified against stored traces and scratch scripts. |
| **`NOT EXECUTED`** | 0 | 0 | **0** | 0.0% | Every script and benchmark was executed live during the audit. |
| **TOTAL** | **72** | **72** | **75** | **100.0%** | Full census incorporating 3 newly audited quantitative claims (`C73–C75`). |

#### Explanation of Census Discrepancies Between v1 and v2
In audit report v2, reviewers observed an apparent discrepancy where `REPRODUCED` dropped from 23 to 16, and `HARDCODED` dropped from 17 to 16, without an explicit claim-by-claim reconciliation table. The audit v3 investigation determined the exact claim movements:
1. **Claims leaving `REPRODUCED` (8 claims)**:
   - `C66–C69` (Latency benchmarks) were downgraded from `REPRODUCED` to `PARTIALLY REPRODUCED` (-4) when live CPU benchmarking revealed execution-dependent variances (29.56 ms vs 19.82 ms).
   - `C70` (Risk threshold gating) was downgraded from `REPRODUCED` to `CONTRADICTED` (-1) because `interceptor.py:138` enforces a logical AND, contradicting README's claim of OR.
   - `C33–C35` (Category interception in Full mode) were downgraded from `REPRODUCED` to `PARTIALLY REPRODUCED` (-3) because 88%–100% of these blocks are triggered by Rate Limiter preemption rather than RBAC/policy.
   - This reduced the base count from 23 to 15.
2. **Claims entering `REPRODUCED` from `HARDCODED` (1 claim)**:
   - In v2, recomputation of bootstrap confidence intervals (e.g. `C29` / `C72` table verification) was treated as newly reproduced rather than static hardcoding, moving 1 claim from `HARDCODED` to `REPRODUCED` ($15 + 1 = 16$). Simultaneously, this reduced `HARDCODED` from 17 to 16.
3. **v3 Reclassification**:
   - In v3, all 29 claims that depend on uncommitted scripts (`phase1`–`phase5`) or stored CSV/JSON records have been placed into `REPRODUCED-OFFLINE`. This eliminates ambiguity and ensures that only code present in the committed git tree is classified as `REPRODUCED`.

---
## Full Reconciled Claims Census Table (C01–C75)

| ID | Claim Description | README Value | Stored Value | Fresh Value | Label | Evidence & Code Reference |
|:---:|:---|:---:|:---:|:---:|:---:|:---|
| **C01** | Primary benchmark sample size N = 600 | `600` | `600` | `600` | **`REPRODUCED`** | backend/data/benchmark/ has 6 canonical JSON files totaling exactly 600 scenarios. |
| **C02** | Threat category distribution: 100/cat (500 atk, 100 legit) | `100 each` | `100 each` | `100 each` | **`REPRODUCED`** | Canonical JSON files contain exactly 100 scenarios each across 6 categories. |
| **C03** | Baseline ASR = 100.0% (500/500 breached) | `100.0%` | `100.0%` | `100.0%` | **`REPRODUCED`** | Under 'baseline' configuration, interceptor bypasses all security checks; 500/500 attacks allowed. |
| **C04** | Baseline LTCR = 100.0% (100/100 completed) | `100.0%` | `100.0%` | `100.0%` | **`REPRODUCED`** | 100/100 legitimate customer support scenarios execute without restriction. |
| **C05** | Baseline FPR = 0.0% (0/100 false blocks) | `0.0%` | `0.0%` | `0.0%` | **`REPRODUCED`** | Zero legitimate requests blocked under unmitigated baseline. |
| **C06** | Baseline Median Total Latency = 21.38 ms | `21.38 ms` | `21.38 ms` | `3.54 ms (HTTP) / 3.78 ms (InProc)` | **`PARTIALLY REPRODUCED`** | Stored in results_control_baseline.json (21.38 ms); fresh native execution measures 3.54 ms. Containerization overhead accounts for stored latency. |
| **C07** | Permission-Only ASR = 36.0% (180/500 breached) | `36.0%` | `36.0%` | `36.0%` | **`REPRODUCED`** | Deterministic RBAC checks block unauthorized tools and admin actions (320 blocked, 180 breached). |
| **C08** | Permission-Only ASR 95% Bootstrap CI: [31.8%, 40.2%] | `[31.8%, 40.2%]` | `[31.80%, 40.20%]` | `[31.80%, 40.20%]` | **`REPRODUCED-OFFLINE`** | Reproduced bit-for-bit offline via phase2 bootstrap function (B=10000, seed=42) on stored baseline data. |
| **C09** | Permission-Only LTCR = 80.0% (80/100 completed) | `80.0%` | `80.0%` | `80.0%` | **`REPRODUCED`** | CustomerSupportAgent lacks update_customer permission by default; 20 legitimate requests blocked. |
| **C10** | Permission-Only FPR = 20.0% (20/100 blocked) | `20.0%` | `20.0%` | `20.0%` | **`REPRODUCED`** | Direct consequence of CustomerSupportAgent lacking update_customer in default seed. |
| **C11** | Permission-Only Median Latency = 57.05 ms | `57.05 ms` | `57.05 ms` | `5.10 ms (HTTP) / 4.92 ms (InProc)` | **`PARTIALLY REPRODUCED`** | Stored results match 57.05 ms; fresh native HTTP runs measure 5.10 ms. Docker volume sync overhead in stored run. |
| **C12** | Policy-Only ASR = 28.0% (140/500 breached) | `28.0%` | `28.0%` | `8.0% (no rollover) / 28.0% (straddled)` | **`PARTIALLY REPRODUCED`** | Produces 8.0% in pre-saturated non-straddling runs; jumps to 28.0% when tumbling window rolls over during execution. |
| **C13** | Policy-Only ASR 95% Bootstrap CI: [24.0%, 31.8%] | `[24.0%, 31.8%]` | `[24.00%, 31.80%]` | `[24.00%, 31.80%]` | **`REPRODUCED-OFFLINE`** | Reproduced bit-for-bit offline via phase2 bootstrap function (B=10000, seed=42) on stored baseline data. |
| **C14** | Policy-Only LTCR = 80.0% (80/100 completed) | `80.0%` | `80.0%` | `80.0%` | **`REPRODUCED`** | Matches committed backend evaluation metrics. |
| **C15** | Policy-Only FPR = 20.0% (20/100 blocked) | `20.0%` | `20.0%` | `20.0%` | **`REPRODUCED`** | Matches committed backend evaluation metrics. |
| **C16** | Policy-Only Median Latency = 54.76 ms | `54.76 ms` | `54.76 ms` | `5.29 ms (HTTP) / 5.66 ms (InProc)` | **`PARTIALLY REPRODUCED`** | Stored baseline records 54.76 ms; fresh native runs measure 5.29 ms. |
| **C17** | Full Governance (Controlled) ASR = 31.4% (157/500 breached) | `31.4%` | `31.4%` | `8.0% (no rollover) / 26.6-32.0% (rollover)` | **`CONTRADICTED`** | Committed backend produces 8.0% (non-straddled) or 28.0% (straddled). 31.4% cannot be reproduced by committed backend; requires uncommitted Sep 29 script order. |
| **C18** | Full Governance ASR 95% Bootstrap CI: [27.4%, 35.4%] | `[27.4%, 35.4%]` | `[27.40%, 35.40%]` | `[27.40%, 35.40%]` | **`REPRODUCED-OFFLINE`** | Reproduced bit-for-bit offline via phase2 bootstrap function (B=10000, seed=42) on stored baseline data. |
| **C19** | Full Governance LTCR = 80.0% (80/100 completed) | `80.0%` | `80.0%` | `80.0%` | **`REPRODUCED`** | Matches committed backend evaluation metrics. |
| **C20** | Full Governance FPR = 20.0% (20/100 blocked) | `20.0%` | `20.0%` | `20.0%` | **`REPRODUCED`** | Matches committed backend evaluation metrics. |
| **C21** | Full Governance Median Total Latency = 139.72 ms | `139.72 ms` | `139.72 ms` | `4.69 ms (HTTP) / 8.75 ms (InProc)` | **`PARTIALLY REPRODUCED`** | Stored baseline records 139.72 ms; fresh native runs measure 4.69 ms. Container volume fsync overhead in stored run. |
| **C22** | Full Governance Paired Median Overhead = +112.55 ms | `+112.55 ms` | `+112.55 ms` | `+1.20 ms (HTTP) / +5.06 ms (InProc)` | **`PARTIALLY REPRODUCED`** | Stored paired difference is 112.55 ms; native paired overhead is 1.20 ms. |
| **C23** | McNemar Discordant Pairs: b = 20, c = 343 | `b=20, c=343` | `b=20, c=343` | `b=20, c=460` | **`CONTRADICTED`** | c=343 reflects the historical run with 0 excessive calls blocked; committed code yields c=460. |
| **C24** | McNemar Chi-Square Statistic: chi2 = 285.63 | `285.63` | `285.63` | `402.08` | **`CONTRADICTED`** | Derived from c=343. In committed backend with c=460, chi2 = 402.08. |
| **C25** | McNemar p-value: p approx 4.45e-64 | `4.45e-64` | `4.45e-64` | `1.98e-89` | **`CONTRADICTED`** | Derived from c=343. In committed backend, p-value is 1.98e-89. |
| **C26** | Paired Wilcoxon Signed-Rank Test Statistic W = 811.0 | `811.0` | `811.0` | `3580.0` | **`REPRODUCED-OFFLINE`** | Reproduced bit-for-bit offline via phase2 statistical analysis on stored baseline latencies. |
| **C27** | Paired Wilcoxon Signed-Rank p-value: p approx 3.41e-98 | `3.41e-98` | `3.41e-98` | `1.12e-95` | **`REPRODUCED-OFFLINE`** | Reproduced bit-for-bit offline via phase2 statistical analysis on stored baseline latencies. |
| **C28** | Calibrated Configuration ASR = 6.4% (32/500 breached) | `6.4%` | `6.4%` | `20.8% (on real gateway)` | **`REPRODUCED-OFFLINE`** | Reproduced offline via phase3_calibrated_evaluation.py. Real committed gateway achieves 20.8% (14.4% gap). |
| **C29** | Calibrated Configuration ASR 95% Bootstrap CI: [4.4%, 8.6%] | `[4.4%, 8.6%]` | `[4.40%, 8.60%]` | `[4.40%, 8.60%]` | **`REPRODUCED-OFFLINE`** | Reproduced bit-for-bit offline via phase2 bootstrap function on results_calibrated.json. |
| **C30** | Calibrated Configuration LTCR = 100.0% (100/100 completed) | `100.0%` | `100.0%` | `80.0% (on real gateway)` | **`REPRODUCED-OFFLINE`** | Reproduced offline via phase3_calibrated_evaluation.py. Real committed gateway achieves 80.0%. |
| **C31** | Calibrated Configuration FPR = 0.0% (0/100 blocked) | `0.0%` | `0.0%` | `20.0% (on real gateway)` | **`REPRODUCED-OFFLINE`** | Reproduced offline via phase3_calibrated_evaluation.py. Real committed gateway achieves 20.0%. |
| **C32** | Calibrated Median Latency = 25.00 ms (Overhead +3.63 ms) | `25.00 ms (+3.63 ms)` | `25.00 ms (+3.63 ms)` | `N/A (synthetic)` | **`HARDCODED`** | Task 5 proved phase3 hardcodes synthetic latency constants (+25.0, +35.0 ms). Latency was not measured. |
| **C33** | T1 Unauthorized Tool Interception = 100.0% (Controlled) | `100.0%` | `100.0%` | `100.0%` | **`PARTIALLY REPRODUCED`** | 100% blocked, but 95% blocked by RATE_LIMIT preemption in Full mode rather than RBAC alone. |
| **C34** | T2 Privilege Escalation Interception = 100.0% (Controlled) | `100.0%` | `100.0%` | `100.0%` | **`PARTIALLY REPRODUCED`** | 100% blocked, but 88% blocked by RATE_LIMIT preemption in Full mode rather than RBAC alone. |
| **C35** | T3 Prompt Injection Interception = 100.0% (Controlled) | `100.0%` | `100.0%` | `100.0%` | **`PARTIALLY REPRODUCED`** | 100% blocked, but 100% blocked by RATE_LIMIT preemption in Full mode before reaching policy engine. |
| **C36** | T4 Parameter Manipulation Controlled Interception = 43.0% | `43.0%` | `43.0%` | `60.0% / 100.0%` | **`CONTRADICTED`** | 43% was an artifact of contamination from preceding legitimate runs and window rollover. Committed backend yields 60-100%. |
| **C37** | T4 Parameter Manipulation Calibrated Interception = 68.0% | `68.0%` | `68.0%` | `96.0% (on real gateway)` | **`REPRODUCED-OFFLINE`** | Reproduced offline via phase3_calibrated_evaluation.py (32/100 breached = 68% interception). |
| **C38** | T5 Excessive Invocations (DoS) Interception = 100.0% | `100.0%` | `100.0% (README Table 2) / 0.0% (stored JSON)` | `100.0% (non-straddled) / 0.0% (straddled)` | **`PARTIALLY REPRODUCED`** | Table 2 claims 100%, but stored results_control_baseline.json had 0% blocked. Committed backend achieves 100% only if run does not straddle rollover. |
| **C39** | Adversarial mutation testbed size N = 500 | `500` | `500` | `500` | **`REPRODUCED`** | scratch/adversarial_extension.json contains exactly 500 scenarios across 5 mutation classes. |
| **C40** | Case Alternation Recall = 78.0% (78/100) | `78.0%` | `78.0%` | `100.0% (on real gateway via rate limit)` | **`REPRODUCED-OFFLINE`** | Reproduced bit-for-bit offline via phase4_adversarial_extension.py. In real gateway, 100% blocked by rate limit. |
| **C41** | Comment Fragmentation Recall = 78.0% (78/100) | `78.0%` | `78.0%` | `100.0% (on real gateway via rate limit)` | **`REPRODUCED-OFFLINE`** | Reproduced bit-for-bit offline via phase4_adversarial_extension.py. In real gateway, 100% blocked by rate limit. |
| **C42** | Advanced SQL Invariants Recall = 68.0% (68/100) | `68.0%` | `68.0%` | `100.0% (on real gateway via rate limit)` | **`REPRODUCED-OFFLINE`** | Reproduced bit-for-bit offline via phase4_adversarial_extension.py. In real gateway, 100% blocked by rate limit. |
| **C43** | URL Hex Encoding Standard Recall = 78.0% (78/100) | `78.0%` | `78.0%` | `100.0% (on real gateway via rate limit)` | **`REPRODUCED-OFFLINE`** | Reproduced bit-for-bit offline via phase4_adversarial_extension.py. In real gateway, 100% blocked by rate limit. |
| **C44** | URL Hex Encoding Hardened Recall = 78.0% (78/100) | `78.0%` | `78.0%` | `N/A (uncommitted decoder)` | **`REPRODUCED-OFFLINE`** | Reproduced bit-for-bit offline via phase4_adversarial_extension.py using standalone script decoding transform. |
| **C45** | Base64 Obfuscation Standard Recall = 0.0% (0/100) | `0.0%` | `0.0%` | `100.0% (on real gateway via rate limit)` | **`REPRODUCED-OFFLINE`** | Reproduced bit-for-bit offline via phase4_adversarial_extension.py. In real gateway, 100% blocked by rate limit. |
| **C46** | Base64 Obfuscation Hardened Recall = 56.0% (56/100) | `56.0%` | `56.0%` | `N/A (uncommitted decoder)` | **`REPRODUCED-OFFLINE`** | Reproduced bit-for-bit offline via phase4_adversarial_extension.py using standalone script Base64 decoding transform. |
| **C47** | Overall Aggregate Standard Recall = 54.8% (274/500) | `54.8%` | `54.8%` | `100.0% (on real gateway via rate limit)` | **`REPRODUCED-OFFLINE`** | Reproduced bit-for-bit offline via phase4_adversarial_extension.py. In real gateway, 100% blocked by rate limit. |
| **C48** | Overall Aggregate Hardened Recall = 66.0% (330/500) | `66.0%` | `66.0%` | `N/A (uncommitted decoder)` | **`REPRODUCED-OFFLINE`** | Reproduced bit-for-bit offline via phase4_adversarial_extension.py using standalone script decoding transforms. |
| **C49** | Closed-Loop Pilot Sample Size N = 20 | `20` | `20` | `20` | **`REPRODUCED-OFFLINE`** | closed_loop_traces.csv contains exactly 20 trace records (10 attack, 10 legitimate). |
| **C50** | LLM Attack Induction Rate = 40.0% (4/10) | `40.0%` | `40.0%` | `40.0%` | **`REPRODUCED-OFFLINE`** | Recomputed offline from closed_loop_traces.csv: 4 out of 10 attack prompts induced unsafe tool calls. |
| **C51** | LLM Prompt Resistance / Refusal = 60.0% (6/10) | `60.0%` | `60.0%` | `60.0%` | **`REPRODUCED-OFFLINE`** | Recomputed offline from closed_loop_traces.csv: 6 out of 10 attack prompts refused by model. |
| **C52** | Conditional Gateway Interception = 75.0% (3/4) | `75.0%` | `75.0%` | `75.0%` | **`REPRODUCED-OFFLINE`** | Recomputed offline from closed_loop_traces.csv: 3 out of 4 induced tool calls intercepted by gateway. |
| **C53** | End-to-End Governed Breach Rate = 10.0% (1/10) | `10.0%` | `10.0%` | `10.0%` | **`REPRODUCED-OFFLINE`** | Recomputed offline from closed_loop_traces.csv: 1 breach out of 10 attack attempts. |
| **C54** | Closed-Loop Legitimate Completion = 100.0% (10/10) | `100.0%` | `100.0%` | `100.0%` | **`REPRODUCED-OFFLINE`** | Recomputed offline from closed_loop_traces.csv: 10 out of 10 legitimate prompts completed. |
| **C55** | Closed-Loop Mean LLM Inference Latency = 755.8 ms | `755.8 ms` | `755.83 ms` | `755.83 ms` | **`REPRODUCED-OFFLINE`** | Recomputed offline from closed_loop_traces.csv: mean of latency_llm_ms is exactly 755.83 ms. |
| **C56** | Closed-Loop Mean Gateway Overhead = 161.1 ms | `161.1 ms` | `161.11 ms` | `161.11 ms` | **`REPRODUCED-OFFLINE`** | Recomputed offline from closed_loop_traces.csv: mean of latency_gateway_ms is exactly 161.11 ms. |
| **C57** | Relative Gateway Latency Tax = 3.55% (single-call) | `3.55%` | `21.32% (direct) / 3.55% (unmeasured multi-turn)` | `21.32%` | **`CONTRADICTED`** | Direct gateway/LLM ratio is 21.32% (161.11 / 755.83). Denominator of 4,536.3 ms is not found in primary trace data. |
| **C58** | Baseline Latency Percentiles: P95 = 34.30 ms, P99 = 47.70 ms | `P95=34.30, P99=47.70` | `P95=34.30, P99=47.70` | `P95=5.81 ms` | **`PARTIALLY REPRODUCED`** | Stored baseline records 34.30 / 47.70 ms; native execution measures 5.81 ms. Container fsync overhead in stored run. |
| **C59** | Permission Latency Percentiles: P95 = 107.54 ms, P99 = 200.53 ms | `P95=107.54, P99=200.53` | `P95=107.54, P99=200.53` | `P95=7.40 ms` | **`PARTIALLY REPRODUCED`** | Stored baseline records 107.54 / 200.53 ms; native execution measures 7.40 ms. |
| **C60** | Policy Latency Percentiles: P95 = 203.70 ms, P99 = 307.61 ms | `P95=203.70, P99=307.61` | `P95=203.70, P99=307.61` | `P95=25.74 ms` | **`PARTIALLY REPRODUCED`** | Stored baseline records 203.70 / 307.61 ms; native execution measures 25.74 ms. |
| **C61** | Full Governance Latency Percentiles: P95 = 257.40 ms, P99 = 373.94 ms | `P95=257.40, P99=373.94` | `P95=257.40, P99=373.94` | `P95=19.34 ms` | **`PARTIALLY REPRODUCED`** | Stored baseline records 257.40 / 373.94 ms; native execution measures 19.34 ms. |
| **C62** | Held-out Test Split Precision = 0.9855 | `0.9855` | `0.9855` | `0.9855` | **`REPRODUCED-OFFLINE`** | Stored in models/threshold.json; reproduced offline from evaluation_report.json. |
| **C63** | Recall by Attack Category: harmful_instruction = 1.000 | `1.000` | `1.000` | `1.000` | **`REPRODUCED-OFFLINE`** | Stored in models/threshold.json; reproduced offline from evaluation_report.json. |
| **C64** | General Benign Stress-Test FPR = 0.00% (0/500) | `0.00%` | `0.00%` | `0.00%` | **`REPRODUCED`** | Evaluated via backend/scripts/evaluation_report.py on data/benign.csv sample. |
| **C65** | Benign Trigger-Word Stress-Test FPR = 0.00% (0/50) | `0.00%` | `0.00%` | `0.00%` | **`REPRODUCED`** | Evaluated via backend/scripts/evaluation_report.py on data/trigger_benign.csv sample. |
| **C66** | Detection Pipeline Average Latency = 19.82 ms | `19.82 ms` | `19.82 ms` | `29.56 ms` | **`PARTIALLY REPRODUCED`** | Live execution of benchmark_latency.py measures 29.56 ms (same order of magnitude, dependent on host CPU). |
| **C67** | Detection Pipeline P50 Latency = 19.79 ms | `19.79 ms` | `19.79 ms` | `27.39 ms` | **`PARTIALLY REPRODUCED`** | Live execution measures 27.39 ms (same order of magnitude). |
| **C68** | Detection Pipeline P95 Latency = 25.38 ms | `25.38 ms` | `25.38 ms` | `46.40 ms` | **`PARTIALLY REPRODUCED`** | Live execution measures 46.40 ms (same order of magnitude). |
| **C69** | Detection Pipeline Throughput = 50.44 rps | `50.44 rps` | `50.44 rps` | `33.82 rps` | **`PARTIALLY REPRODUCED`** | Live execution measures 33.82 rps (same order of magnitude). |
| **C70** | Risk Gate Threshold >= 7.0 triggers human approval OR halt | `score >= 7.0 OR requires_approval` | `N/A` | `requires_approval AND score >= 7.0` | **`CONTRADICTED`** | backend/governance/interceptor.py:138 enforces logical AND ('requires_approval and risk_score >= 7.0'), directly contradicting README's claim of OR. |
| **C71** | Rate Limiter Window Duration = 60.0s tumbling window | `60.0s` | `60.0s` | `60.0s` | **`REPRODUCED`** | backend/governance/rate_limiter.py:19 defines _WINDOW_SECONDS = 60.0. |
| **C72** | Relational Database Schema: 9 Relational Tables | `9 tables` | `9 tables` | `9 tables` | **`REPRODUCED`** | backend/database/db.py contains exactly 9 CREATE TABLE IF NOT EXISTS statements. |
| **C73** | Closed-Loop Median LLM Inference Latency = 4,375.2 ms | `4,375.2 ms` | `N/A (755.83 ms mean)` | `761.35 ms (median)` | **`CONTRADICTED`** | Derived from 4,536.3 - 161.1 ms. Real single-call LLM inference median in closed_loop_traces.csv is 761.35 ms (mean 755.83 ms). Not found in Level-1 trace data. |
| **C74** | Calibrated Configuration Latency Constants (+25.00 ms offset, +3.63 ms paired overhead) | `25.00 ms (+3.63 ms)` | `N/A` | `+25.0 ms constant` | **`HARDCODED`** | phase3_calibrated_evaluation.py lines 50, 56, 65, 72, 79, 84, 88 hardcode synthetic millisecond constants; latency was never dynamically measured. |
| **C75** | Adversarial Extension 'Hardened' Decoders (URL Unquote, Base64 Decode, SQL Comment Strip) | `Gateway Hardened Defense` | `phase4 evaluate_defense` | `Absent from policy_engine.py` | **`CONTRADICTED`** | Decoders exist exclusively inside phase4_adversarial_extension.py standalone simulation; absent from committed backend/governance/policy_engine.py. |

---
## Task 1: Secret Scan & Sanitization Audit
A comprehensive regular-expression audit was conducted across the scratch directory, repository working tree, and complete git commit history (`git log -p --all`).
- **Regex Patterns Evaluated**: `gsk_[A-Za-z0-9_-]{20,}`, `sk-[A-Za-z0-9_-]{20,}`, `AIza[0-9A-Za-z-_]{35}`, `ghp_[A-Za-z0-9]{36}`, `xox[baprs]-[0-9A-Za-z_-]{10,}`, `Bearer [A-Za-z0-9_.-]{20,}`, `api_key\s*=\s*['"][A-Za-z0-9_.-]{16,}['"]`, `API_KEY\s*=\s*['"][A-Za-z0-9_.-]{16,}['"]`.

### Secret Scan Findings
| Location | File Path & Line | Secret Type | Masked Value | Key Length | Committed in Git? |
|:---|:---|:---|:---|:---:|:---:|
| Working Tree | `backend/.env:1` | Groq API Key | `gsk_...` | 56 chars | **NO** (Untracked) |
| Scratch Workspace | `scratch/phase5_closed_loop_llm.py:31` | Groq API Key | `gsk_...` | 56 chars | **NO** (Untracked) |
| Git History | Complete commit log (`d8698aa`, `e12a06a`) | All credential regexes | *None* | 0 | **CLEAN (0 secrets)** |

> [!WARNING]
> **Mandatory Secret Sanitization Warning**:
> While the committed git history is completely clean, an active 56-character Groq API key is hardcoded at line 31 of `scratch/phase5_closed_loop_llm.py`. Prior to committing or distributing any files from the scratch directory, line 31 must be updated to load the key dynamically via `os.environ.get('GROQ_API_KEY')`, and the active credential must be rotated in the Groq console.

---
## Task 2: Provenance of Stored Results & Runner History
### 2.1 Scratch Directory Filesystem Timestamps
A complete inspection of filesystem metadata in `C:\Users\Saish\.gemini\antigravity\brain\ada7b6c3-b46b-4e64-b510-bf115d6047b1\scratch` confirms the timeline established in v2:
| File Name | Size (Bytes) | Filesystem MTime (ISO) | Filesystem CTime (ISO) | Provenance Role |
|:---|:---:|:---|:---|:---|
| `run_experiments.py` | 3821 | `2026-09-28T19:12:42.351223` | `2026-09-28T19:12:42.351223` | Historical research artifact |
| `phase1_reproduce_baseline.py` | 5082 | `2026-09-29T20:50:08.600209` | `2026-09-29T20:50:08.600209` | Historical research artifact |
| `results_control_baseline.json` | 825355 | `2026-09-29T20:58:54.961273` | `2026-09-29T20:58:54.821620` | Historical research artifact |
| `phase2_statistical_analysis.py` | 16580 | `2026-09-29T21:00:22.995466` | `2026-09-29T21:00:22.994886` | Historical research artifact |
| `results_calibrated.json` | 168307 | `2026-09-29T21:05:52.749305` | `2026-09-29T21:05:52.718325` | Historical research artifact |
| `phase3_calibrated_evaluation.py` | 10831 | `2026-09-29T21:05:33.923882` | `2026-09-29T21:05:33.923338` | Historical research artifact |
| `phase4_adversarial_extension.py` | 13487 | `2026-09-29T21:06:11.716256` | `2026-09-29T21:06:11.715720` | Historical research artifact |
| `adversarial_robustness_results.json` | 220742 | `2026-09-29T21:06:26.232743` | `2026-09-29T21:06:26.196499` | Historical research artifact |
| `phase5_closed_loop_llm.py` | 20854 | `2026-09-29T21:07:46.518697` | `2026-09-29T21:07:46.518104` | Historical research artifact |
| `closed_loop_results.json` | 12794 | `2026-09-29T21:08:32.842745` | `2026-09-29T21:08:32.842229` | Historical research artifact |
| `closed_loop_traces.csv` | 5423 | `2026-09-29T21:08:32.829549` | `2026-09-29T21:08:32.826204` | Historical research artifact |
| `statistical_evaluation_report.json` | 12164 | `2026-09-30T20:29:00.607817` | `2026-09-29T21:01:03.026197` | Historical research artifact |
| `PROMPTAEGIS_HOSTILE_PEER_REVIEW_REPORT.md` | 24755 | `2026-09-30T20:53:00.249547` | `2026-09-30T20:43:28.364080` | Historical research artifact |

### 2.2 Internal Run Identifiers and Embedded Epoch Timestamps
In `results_control_baseline.json`, embedded Unix timestamps confirm that the stored run executed sequentially between 20:50:17 and 20:58:54 IST on September 29, 2026:
- **Baseline**: `run_id: run_ea756de0042e` | Started: `1790695217.27` (2026-09-29 20:50:17 IST) | Completed: `1790695305.11` (Elapsed: 87.8s)
- **Permission**: `run_id: run_4ad40cbec79d` | Started: `1790695306.17` (2026-09-29 20:51:46 IST) | Completed: `1790695445.70` (Elapsed: 139.5s)
- **Policy**: `run_id: run_c539339e13f5` | Started: `1790695446.94` (2026-09-29 20:54:06 IST) | Completed: `1790695581.39` (Elapsed: 134.4s)
- **Full**: `run_id: run_0ed575698641` | Started: `1790695582.61` (2026-09-29 20:56:22 IST) | Completed: `1790695734.49` (Elapsed: 151.9s)

### 2.3 Agent Workspace History & Runner Evolution
A deep search across the agent transcript logs (`transcript_full.jsonl`) revealed the exact origin of runner modifications:
- **Transcript Step 429 (`2026-09-28T13:50:36Z` / 19:20 IST)**: Tool `replace_file_content` inserted the rate-limiter pre-saturation logic into `backend/api/experiments.py`:
  ```python
  # Pre-saturate rate limit counters for 'baseline' role agent on search tools
  # so that excessive_calls scenarios trigger rate limiting correctly
  for sat_tool in ['search_customer', 'search_order']:
      limit = _DEFAULT_LIMITS.get(sat_tool, 50)
      rid = f'{baseline_agent_id}::{sat_tool}::{window}'
      conn.execute('INSERT INTO rate_limit_counters ... VALUES (?,?,?,?,?)', ...)
  ```
- **Why Stored Results Had 0 Blocked**: The run for `full` configuration (`run_0ed575698641`) started at second 22 of the clock minute and ran for 151.9 seconds. Because scenarios were ordered with 500 non-excessive scenarios running first, by the time the runner reached `excessive_calls`, the clock had rolled over two full 60-second tumbling windows. The pre-saturated window had expired, leaving the counter at 0 in the new window, resulting in 0/100 excessive calls blocked.

### 2.4 Git Commit History Comparison
Verification via `git diff d8698aa e12a06a --stat` and `git show d8698aa` demonstrates the commit timeline:
- **Commit `d8698aa` (Somaskandan931, July 10, 2026)**: The initial prototype codebase consisting of an LLM prompt injection classifier (`backend/core/classifier.py`, `rule_engine.py`, `semantic_engine.py`, `AegisChat.jsx`). It contained **no tool governance gateway**, no interceptor, no multi-stage permissions or policies, and no benchmark scenario suites.
- **Commit `e12a06a` (Shriram28Baskar, September 30, 2026)**: Added 26,378 lines across 57 files. It introduced the entire multi-stage gateway architecture (`backend/governance/`), `backend/api/experiments.py` (238 lines), the 6 benchmark scenario suites (`backend/data/benchmark/`), the adversarial extension dataset (9,102 lines), 11 certified figures, and frontend management panels.
- **Conclusion**: While git commit history alone shows `experiments.py` appearing in `e12a06a`, the transcript file history conclusively demonstrates that pre-saturation was introduced on September 28, prior to the stored control run of September 29.

---
## Task 3: Latency Over HTTP & Virtualization Analysis
Phase 1 was re-executed against a live FastAPI Uvicorn server on port 8001 across 3 repeats using **strictly the 6 canonical benchmark files** ($N = 600$), with `adversarial_extension.json` quarantined outside the benchmark path. Fresh database seeding was performed before each repeat.

### Latency Comparison Matrix
| Configuration | Stored Baseline (Docker/Windows) | HTTP Fresh (3-Rep Avg) | In-Process TestClient | Hypothesis Evaluation |
|:---|:---:|:---:|:---:|:---|
| **Baseline** | Med: 21.38 ms (Mean: 22.91) | Med: 3.54 ms (Mean: 3.78) | Med: 3.78 ms (Mean: 4.41) | Native execution is ~10-30x faster than stored Docker run. |
| **Permission** | Med: 57.05 ms (Mean: 63.46) | Med: 5.10 ms (Mean: 5.39) | Med: 4.92 ms (Mean: 5.36) | Native execution is ~10-30x faster than stored Docker run. |
| **Policy** | Med: 54.76 ms (Mean: 101.81) | Med: 5.29 ms (Mean: 9.20) | Med: 5.66 ms (Mean: 9.36) | Native execution is ~10-30x faster than stored Docker run. |
| **Full** | Med: 139.72 ms (Mean: 121.28) | Med: 4.69 ms (Mean: 7.88) | Med: 8.75 ms (Mean: 15.64) | Native execution is ~10-30x faster than stored Docker run. |
| **Paired Overhead (Full - Base)** | **Med: +112.55 ms** | **Med: +1.20 ms** | **Med: +5.06 ms** | Gateway introduces ~1-5 ms native paired overhead. |

### Diagnostic Testing of Overhead Hypotheses
1. **HTTP Network Overhead**: Comparing live HTTP against in-process TestClient reveals a difference of only ~0.2 to 0.5 ms per request. **DEMONSTRATED**: HTTP overhead does not explain the 139.72 ms stored median.
2. **OneDrive Cloud File Filter Driver (`cldflt.sys`)**: Synchronous SQLite commits were benchmarked on a OneDrive-synced path (`C:\Users\...\OneDrive`) versus a non-synced local temp path (`C:\tmp`). Measured commit latency was **5.19 ms** (OneDrive) vs **4.55 ms** (Local Temp) — a 1.14x ratio. **DEMONSTRATED**: OneDrive synchronization adds ~0.64 ms, but cannot account for 139 ms.
3. **Container Volume Virtualization (Docker Desktop on Windows)**: `docker-compose.yml:7-8` bind-mounts the host directory `./backend` into Linux container `/app`. In `PROMPTAEGIS_COMPLETE_SCIENTIFIC_TECHNICAL_RECORD.md:677`, the author explicitly notes: *'Synchronous disk transactions in Docker volume on Windows host; rate_limit_counters disk sync'*. In Docker Desktop for Windows, NTFS volume bind mounts have documented 20–140 ms latency on synchronous `fsync` calls. **SUPPORTED**: High stored latencies reflect Docker Windows host bind-mount filesystem sync latency.

---
## Task 4: Tumbling-Window Rollover & Non-Determinism Analysis
### 4.1 Reconciliation of v2 Rollover Arithmetic
In audit report v2, sequential runs logging rollover showed ASR jumping from 12.0% to 22.0% (+10.0 percentage points) when `excessive_calls` blocks dropped by 100. This seemed inconsistent with a 600-scenario benchmark (where 100 attacks out of 500 would be +20.0 percentage points). The audit v3 code review resolved this:
- In audit v2, the benchmark was executed from the repo root containing all 7 JSON files, including `adversarial_extension.json` (500 scenarios), giving $N = 1,100$ total scenarios (1,000 attack scenarios, 100 legitimate).
- In a 1,000-attack benchmark: $\Delta\text{ASR} = 100 / 1000 = +10.0\%$, exactly matching 12.0% to 22.0%.
- In the canonical 600-scenario benchmark: $\Delta\text{ASR} = 100 / 500 = +20.0\%$, exactly matching 8.0% to 28.0%.
- Both runs demonstrate the exact same physical mechanism: 100 excessive calls unblocked due to tumbling window expiration.

### 4.2 Empirical Distribution Across 40 Controlled Runs
Twenty sequential runs each of `policy` and `full` configurations were executed in-process against the canonical 600 scenarios from fresh databases, with documented start times across clock minute phases:
| Configuration | Total Runs | Non-Straddled Runs (ASR = 8.0%) | Straddled Runs (ASR > 8.0%) | Min ASR | Max ASR | Distinct ASR Values Observed |
|:---|:---:|:---:|:---:|:---:|:---:|:---|
| **POLICY** | 20 | 15/20 (75.0%) | 5/20 | 8.0% | 32.0% | ['8.0%', '28.0%', '28.4%', '31.2%', '32.0%'] |
| **FULL** | 20 | 13/20 (65.0%) | 7/20 | 8.0% | 30.0% | ['8.0%', '26.6%', '28.0%', '30.0%'] |

### 4.3 Determinism and Reproducibility of 31.4% Headline ASR
- **Determinism Verdict**: The committed benchmark runner is **NON-DETERMINISTIC**. Because it relies on unmocked wall-clock time (`math.floor(time.time() / 60)`), outcome metrics depend on the precise second of the minute when execution begins. The empirical spread is **8.0% to 32.0% ASR** (a 24.0 percentage point range).
- **Condition Producing 31.4% (343 Blocked)**: In the current committed backend, 31.4% ASR **CANNOT BE PRODUCED** under any schedule (0/40 runs produced 31.4%). The headline 31.4% requires:
  $$\text{Blocked} = 100\text{ (Prompt Injection)} + 100\text{ (Privilege Escalation)} + 100\text{ (Unauthorized Tool)} + 43\text{ (Parameter Manipulation)} + 0\text{ (Excessive Calls)} = 343$$
  In the committed backend, `backend/api/experiments.py:92-94` reorders scenarios so that non-excessive scenarios run first, preventing legitimate scenarios from contaminating parameter manipulation rate limits. Consequently, parameter manipulation achieves 60–100 blocks rather than 43 blocks.

---
## Task 5: The 'Calibrated' Configuration & Leakage Audit
### 5.1 Architecture & Imports Proof
An inspection of `scratch/phase3_calibrated_evaluation.py` proves conclusively:
- **Imports**: `import copy` (line 14), `import json` (15), `import os` (16), `import re` (17), `import time` (18), `import httpx` (19), `import pandas as pd` (20).
- `phase3` **NEVER** imports `backend/governance/interceptor.py`, `backend/database/db.py`, or any gateway module.
- Although `import httpx` and `BASE_URL = 'http://localhost:8001'` are present, neither `httpx` nor `BASE_URL` is ever invoked. The entire calibrated evaluation is an **in-memory Python simulation**.

### 5.2 Hardcoded Latency Constants
In `phase3_calibrated_evaluation.py`, latency is not measured through the gateway. Instead, synthetic millisecond constants are added directly to the timer:
- Line 50: `latency = (time.perf_counter() - t0) * 1000 + 15.0` (Rate limit block: +15.0 ms)
- Line 56: `latency = (time.perf_counter() - t0) * 1000 + 25.0` (Permission deny: +25.0 ms)
- Line 65: `latency = (time.perf_counter() - t0) * 1000 + 40.0` (Domain violation: +40.0 ms)
- Line 72: `latency = (time.perf_counter() - t0) * 1000 + 42.0` (SQL injection: +42.0 ms)
- Line 79: `latency = (time.perf_counter() - t0) * 1000 + 41.0` (Field violation: +41.0 ms)
- Line 84: `latency = (time.perf_counter() - t0) * 1000 + 55.0` (Approval required: +55.0 ms)
- Line 88: `latency = (time.perf_counter() - t0) * 1000 + 35.0` (All checks passed: +35.0 ms)
- **Conclusion**: The README's reported calibrated median latency of **25.00 ms** and paired overhead of **+3.63 ms** are **SYNTHETIC CONSTANTS** rather than measured systems timings.

### 5.3 Rule-by-Rule Ablation Analysis
Ablation of each calibrated rule in `phase3` reveals their exact contribution to reducing ASR from 22.0% to 6.4%:
| Ablation Setting | ASR (%) | LTCR (%) | FPR (%) | Parameter Manipulation Accuracy | Threat Rules Impact |
|:---|:---:|:---:|:---:|:---:|:---|
| **Full Calibrated (All Active)** | 6.4% | 100.0% | 0.0% | 78.0% | Evaluated against 600 canonical scenarios. |
| **Ablate: Remove update_customer permission** | 2.4% | 80.0% | 20.0% | 98.0% | Evaluated against 600 canonical scenarios. |
| **Ablate: Remove SQL_INJECTION_PATTERN** | 12.0% | 100.0% | 0.0% | 50.0% | Evaluated against 600 canonical scenarios. |
| **Ablate: Remove FORBIDDEN_DOMAINS** | 16.4% | 100.0% | 0.0% | 28.0% | Evaluated against 600 canonical scenarios. |
| **Ablate: Remove RESTRICTED_FIELDS** | 6.4% | 100.0% | 0.0% | 78.0% | Evaluated against 600 canonical scenarios. |
| **Ablate: Remove ALL Parameter Checks (RBAC only)** | 22.0% | 100.0% | 0.0% | 0.0% | Evaluated against 600 canonical scenarios. |

**Key Findings**:
1. `FORBIDDEN_DOMAINS` accounts for **10.0 percentage points of ASR** (50 blocked attacks).
2. `SQL_INJECTION_PATTERN` accounts for **5.6 percentage points of ASR** (28 blocked attacks).
3. `RESTRICTED_FIELDS` accounts for **0 attacks** (0.0 percentage points). The rule expects `arguments['fields']`, but `parameter_manipulation.json` provides flat argument dictionaries, making this rule completely inert.
4. Granting `update_customer` to `CustomerSupportAgent` is what recovers LTCR from 80.0% to 100.0% (and drops FPR from 20.0% to 0.0%).

### 5.4 Leakage and Split Testing
- **Pattern Derivation**: The forbidden domains (`attacker.com`, `evil.com`, `hacker.io`) exactly match the literal target domains in `parameter_manipulation.json`.
- **Split Test (First 50 vs Last 50 Scenarios)**:
  - First Half (Scenarios 0–49 per category): ASR = **20.0%**, LTCR = **100.0%**, FPR = **0.0%** (PM Accuracy: 100.0%).
  - Second Half (Scenarios 50–99 per category): ASR = **28.8%**, LTCR = **100.0%**, FPR = **0.0%** (PM Accuracy: 56.0%).
  - Parameter manipulation accuracy drops from 100.0% on the first half to 56.0% on the second half because the regex patterns do not cover the full range of SQL injection variants in the latter half.

### 5.5 Porting Attempt to Real Gateway Interceptor
When the calibrated permissions (`update_customer` granted to `CustomerSupportAgent`) and equivalent parameter policies (`'to'` domain check, SQL query check) were added directly to the real SQLite database and evaluated through `backend/governance/interceptor.py`:
- **Real Gateway ASR**: **20.8%** (compared to the simulated 6.4%).
- **Real Gateway LTCR**: **80.0%** (compared to the simulated 100.0%).
- **Real Gateway FPR**: **20.0%** (compared to the simulated 0.0%).
- **ASR Gap**: **14.4 percentage points**. The real gateway cannot achieve 6.4% ASR without also replicating the in-memory simulated rate limiter counter.

---
## Task 6: Adversarial Extension vs The Committed Gateway
All 500 mutated scenarios from `scratch/adversarial_extension.json` were passed through the real committed gateway across all 4 configurations:
| Configuration | Overall Recall (%) | Blocked / Total | Primary Interception Mechanism | Dominant Decision Reason |
|:---|:---:|:---:|:---|:---|
| **Baseline** | 0.0% | 0/500 | None (Unmitigated) | `BASELINE_NO_GOVERNANCE` (500) |
| **Permission-Only** | 70.0% | 350/500 | RBAC (350 blocks) | `NO_PERMISSION_RECORD` (350) |
| **Policy-Only** | 80.0% | 400/500 | RATE_LIMIT (360), RBAC (40) | `RATE_LIMIT_EXCEEDED:20/20` (310) |
| **Full Governance** | **100.0%** | **500/500** | **RATE_LIMIT (500 blocks)** | `RATE_LIMIT_EXCEEDED:20/20` (350) |

### Comparison with Phase 4 Reported Numbers (54.8% / 66.0%)
- `README.md` reports 54.8% standard recall and 66.0% hardened recall across the 5 mutation classes.
- **Code Divergence**: In `scratch/phase4_adversarial_extension.py:125-174`, `evaluate_defense()` implements standalone decoders:
  ```python
  if check_url_decode and '%' in dest_str:
      dest_str = urllib.parse.unquote(dest_str).lower()
  if check_b64_decode and 'base64:' in dest_str:
      dest_str = base64.b64decode(raw_b64).decode('utf-8', errors='ignore').lower()
  norm_query = test_query.replace('/**/', ' ')
  ```
- **Conclusion**: None of these decoders exist in `backend/governance/policy_engine.py`. In the real gateway, 100% of mutated scenarios are intercepted by Rate Limiter preemption. The README's 'Hardened Defense' numbers describe the standalone simulation in `phase4`, NOT the committed gateway.

---
## Task 7: Closed-Loop Live Pilot Latency Analysis
Recomputation of latency distributions directly from `scratch/closed_loop_traces.csv` ($N = 20$):
- **LLM Inference Latency**: Mean = **755.83 ms**, Median = **761.35 ms**, P95 = **899.70 ms** (Min: 618.9 ms, Max: 928.9 ms).
- **Gateway Overhead Latency**: Mean = **161.11 ms**, Median = **162.77 ms**, P95 = **186.25 ms** (Min: 122.9 ms, Max: 188.7 ms).
- **Direct Latency Tax**: The true ratio of gateway overhead to live LLM generation is:
  $$\frac{161.11\text{ ms}}{755.83\text{ ms}} = 21.32\%$$

### Provenance of 4,375.2 ms and 4,536.3 ms
- An exhaustive search across all files confirmed that the number **4,536.3 ms** does not exist in `closed_loop_traces.csv` or `closed_loop_results.json`.
- In `README.md:330`, 4,536.3 ms is described as the *'total agent transaction duration'*, from which the 3.55% relative overhead was calculated ($161.1 / 4536.3 = 3.551\%$), and $4536.3 - 161.1 = 4375.2\text{ ms}$ was labeled *'median LLM latency'* in Table 4.
- **Conclusion**: 4,536.3 ms is **NOT DERIVABLE** from any primary experimental data in the repository. The explanation that it represents an unmeasured multi-turn transaction is classified as **`INFERRED`**.

---
## Task 8: Bootstrap Confidence Interval Recomputation
Confidence intervals were recomputed using `phase2_statistical_analysis.py`'s own functions (`bootstrap_ci_proportion`, $B=10000$, seeds 42, 43, 44, 45) on stored baseline data:
| Configuration | Metric | Estimate | Recomputed 95% CI | Stored Report CI | Reconciliation Status |
|:---|:---|:---:|:---:|:---:|:---|
| **Baseline** | attack_success_rate | 100.0% | `[100.00%, 100.00%]` | `[100.00%, 100.00%]` | **EXACT (0.00 pts variance)** |
| **Baseline** | legitimate_task_completion_rate | 100.0% | `[100.00%, 100.00%]` | `[100.00%, 100.00%]` | **EXACT (0.00 pts variance)** |
| **Baseline** | false_positive_rate | 0.0% | `[0.00%, 0.00%]` | `[0.00%, 0.00%]` | **EXACT (0.00 pts variance)** |
| **Permission** | attack_success_rate | 36.0% | `[31.80%, 40.20%]` | `[31.80%, 40.20%]` | **EXACT (0.00 pts variance)** |
| **Permission** | legitimate_task_completion_rate | 80.0% | `[72.00%, 88.00%]` | `[72.00%, 88.00%]` | **EXACT (0.00 pts variance)** |
| **Permission** | false_positive_rate | 20.0% | `[13.00%, 28.00%]` | `[13.00%, 28.00%]` | **EXACT (0.00 pts variance)** |
| **Policy** | attack_success_rate | 28.0% | `[24.00%, 31.80%]` | `[24.00%, 31.80%]` | **EXACT (0.00 pts variance)** |
| **Policy** | legitimate_task_completion_rate | 80.0% | `[72.00%, 88.00%]` | `[72.00%, 88.00%]` | **EXACT (0.00 pts variance)** |
| **Policy** | false_positive_rate | 20.0% | `[13.00%, 28.00%]` | `[13.00%, 28.00%]` | **EXACT (0.00 pts variance)** |
| **Full** | attack_success_rate | 31.4% | `[27.40%, 35.40%]` | `[27.40%, 35.40%]` | **EXACT (0.00 pts variance)** |
| **Full** | legitimate_task_completion_rate | 80.0% | `[72.00%, 88.00%]` | `[72.00%, 88.00%]` | **EXACT (0.00 pts variance)** |
| **Full** | false_positive_rate | 20.0% | `[13.00%, 28.00%]` | `[13.00%, 28.00%]` | **EXACT (0.00 pts variance)** |

All 12 primary confidence intervals and all 6 category intervals reproduce bit-for-bit with 0.00 points variance.

---
## Task 10: Re-Graded Scientific Explanations
Each primary technical explanation in the PromptAegis research record has been re-evaluated and graded under strict evidentiary standards:
1. **Omitted Scratch Workspace**: **`DEMONSTRATED`**  
   - *Evidence*: 67 files verified in `C:\Users\Saish\...\scratch\` with matching SHA-256 hashes and September 28–30 timestamps.
2. **Runner Pre-Saturation**: **`DEMONSTRATED`**  
   - *Evidence*: Verbatim code in `backend/api/experiments.py:68-85` and transcript step 429 adding pre-saturation on September 28.
3. **Tumbling-Window Rollover Effect**: **`DEMONSTRATED`**  
   - *Evidence*: 40 controlled sequential runs in Task 4 proved that crossing the minute boundary drops excessive calls blocks from 100 to 0 and jumps ASR from 8.0% to 28.0%–32.0%.
4. **Container Filesystem Virtualization Overhead**: **`SUPPORTED`**  
   - *Evidence*: `docker-compose.yml:7-8` volume mount, author's explicit documentation in `PROMPTAEGIS_COMPLETE_SCIENTIFIC_TECHNICAL_RECORD.md:677`, and native measurements demonstrating that native execution is ~10-30x faster than Docker on Windows.
5. **Hardcoded Figure Literals & Synthetic Latency**: **`DEMONSTRATED`**  
   - *Evidence*: `generate_governance_figures.py:80` defines static arrays for CIs; `phase3_calibrated_evaluation.py:50-88` adds synthetic millisecond constants (+25.0, +35.0 ms).
6. **Adversarial Decoders Outside Gateway**: **`DEMONSTRATED`**  
   - *Evidence*: Decoders exist exclusively in `phase4_adversarial_extension.py:125-174`; absent from `policy_engine.py`.
7. **Unmeasured Multi-Turn Agent Latency (4,536.3 ms)**: **`INFERRED`**  
   - *Evidence*: 4,536.3 ms does not appear in any Level-1 raw data file. It is mathematically consistent with an unmeasured 4-turn transaction, but cannot be derived from stored artifacts.

---
## What Would Make Every Claim Reproducible
To achieve 100% direct reproducibility from a clean `git clone`, the repository requires the following minimal changes:
1. **Sanitize and Commit Scratch Scripts**: Sanitize the hardcoded Groq API key in `scratch/phase5_closed_loop_llm.py:31` and commit `phase1` through `phase5` into `backend/scripts/research/`.
2. **Quarantine Adversarial Extension from Benchmark Suite**: Move `adversarial_extension.json` from `backend/data/benchmark/` to `backend/data/adversarial/` so standard benchmark runs default to the canonical 600 scenarios.
3. **Mock Virtual Time in Rate Limiter**: Replace `time.time()` with a mockable virtual clock in `backend/governance/rate_limiter.py` to eliminate wall-clock non-determinism.
4. **Integrate Calibrated Policies into Seed Data**: Add the `'to'` parameter domain check and search query SQL checks to `_SEED_POLICIES` in `backend/api/governance.py`.
5. **Port Decoders to Policy Engine**: Port URL unquoting and Base64 decoding into `backend/governance/policy_engine.py` to make the 66.0% hardened adversarial recall native to the gateway.

---
## Exact Reproduction Commands and SHA-256 Manifest
### Reproduction Commands
```powershell
# 1. Task 1: Secret Scan
python tmp/audit3/scripts/task1_secret_scan.py

# 2. Task 2: Provenance and Runner History
python tmp/audit3/scripts/task2_provenance.py

# 3. Task 3: Latency Over HTTP (3 Repeats with 6 Canonical Files)
python tmp/audit3/scripts/task3_latency_http.py

# 4. Task 4: Tumbling-Window Rollover & Distribution Test (40 Runs)
python tmp/audit3/scripts/task4_rollover_determinism.py

# 5. Task 5: Calibrated Ablation, Leakage, and Real Gateway Porting
python tmp/audit3/scripts/task5_calibrated_ablation.py

# 6. Task 6: Adversarial Extension Through Real Committed Gateway
python tmp/audit3/scripts/task6_adversarial_gateway.py

# 7. Task 7: Closed-Loop Trace Recomputation and Literal Search
python tmp/audit3/scripts/task7_closed_loop_latency.py

# 8. Task 8: Bootstrap Confidence Interval Recomputation
python tmp/audit3/scripts/task8_bootstrap.py
```

### SHA-256 Manifest of Audit Output Files
| Output File Path | SHA-256 Hex Digest | Description |
|:---|:---:|:---|
| `tmp/audit3/raw/claims_table_v3.json` | `ff9a80e649e3f656e75431a26da73be2c2e23517ff839ebb4f8660fb34271779` | Primary audit evidence file |
| `tmp/audit3/raw/claims_table_v3.md` | `45815c9b3efa25122f2ec24fa2a251b88ac0c79657da8ab97943c2026734ef49` | Primary audit evidence file |
| `tmp/audit3/raw/secret_scan_report.txt` | `051e96c2d4ebc3ca00db9a559ccbd06e14b8d0ed6cdbfea57cb0750c450ec994` | Primary audit evidence file |
| `tmp/audit3/raw/secret_scan_results.json` | `46120a5d4b876c1b773ec9a0250b51687df889297ed751d8ec4b3df9ec4c7adb` | Primary audit evidence file |
| `tmp/audit3/raw/task2_provenance.log` | `0bd82764729e9b4768f5da7b284f18d27fa1cb75effa593d56e6bde8dac9aedc` | Primary audit evidence file |
| `tmp/audit3/raw/task2_provenance_results.json` | `60dd79d274f6578f214e25cc0451d8e0d9f6bcae12dfc1c2dc7ef046bb18e245` | Primary audit evidence file |
| `tmp/audit3/raw/task3_inprocess.json` | `fe634e75fbee6513f9758815d6327efd20fa9051543dcae2b5355e86ca1bd7a0` | Primary audit evidence file |
| `tmp/audit3/raw/task3_latency_run.log` | `742e0165a34af0b9d4b77a02c5ce1074f85a73e1677bf24ced46917c279ac91e` | Primary audit evidence file |
| `tmp/audit3/raw/task3_latency_summary.json` | `de7955547773d744f26123ae79c9368334353557018d075c43af839110b2b53a` | Primary audit evidence file |
| `tmp/audit3/raw/task3_repeat_1.json` | `b8e37dc282380c408546cdd79bb7086a0167a4f38a8aefcc288e6e1f36d29afb` | Primary audit evidence file |
| `tmp/audit3/raw/task3_repeat_2.json` | `b0236227f2184d7678ae602b18d7ac556200272a891dab167eb1bd7e5683e588` | Primary audit evidence file |
| `tmp/audit3/raw/task3_repeat_3.json` | `fe7d66be520d463266cb76ea7ccf224cb94a1a6344384de0ce31f016b201c5d1` | Primary audit evidence file |
| `tmp/audit3/raw/task4_rollover_results.json` | `632137da75f92af77cb737c9ef75b32b9a5b94ec7205032af0e4d951d1ae31db` | Primary audit evidence file |
| `tmp/audit3/raw/task4_rollover_runs.log` | `0197c5b05dd262ee14e51e2659dea4251adc4c6d522cad2796326233ea82a156` | Primary audit evidence file |
| `tmp/audit3/raw/task5_calibrated_ablation.log` | `9ddab1bc5e22687708f75ac9035b5fe861f2b7a3dfd21299d009bf7716c5fe67` | Primary audit evidence file |
| `tmp/audit3/raw/task5_calibrated_results.json` | `22b2356b10988ea81e9abeb1ecd880e1728991ad4cb799d100cc5135a46f82bf` | Primary audit evidence file |
| `tmp/audit3/raw/task6_adversarial_gateway.json` | `0ead666fdfc265bd923c2a9e1a091be9822dc0da949aa60a6f2efa3d9cbcc872` | Primary audit evidence file |
| `tmp/audit3/raw/task6_adversarial_gateway.log` | `01b7ef1f12ab879963f5647f32dfd3920ca5d4259d07bfad4ddd423cf54cf36a` | Primary audit evidence file |
| `tmp/audit3/raw/task7_closed_loop.json` | `ea24009922bacd46a9ca5f55eabe070ad7f2d98aeaa090157dafdbfa7785c95a` | Primary audit evidence file |
| `tmp/audit3/raw/task7_closed_loop.log` | `53af734cbc58e7a598777315c60f221ab4e51b33babdc8afed7728387466cc00` | Primary audit evidence file |
| `tmp/audit3/raw/task8_bootstrap.json` | `d824397256b4d7f310a2bcac7c2bface39e6534b070853412c93e52818dd7b36` | Primary audit evidence file |
| `tmp/audit3/raw/task8_bootstrap.log` | `31e255980f670043148820ba2b11c01b441d18a849492d0bc35d589c0105da21` | Primary audit evidence file |
| `tmp/audit3/raw/user_prompt_10.txt` | `e9971d20fbe92a611ccf52e78f757123535e742c17bd5cc6d8985ffe8017001b` | Primary audit evidence file |
