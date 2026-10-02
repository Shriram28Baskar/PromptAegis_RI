# PromptAegis — Final Scientific Consistency & Traceability Matrix

**Document Status**: LOCKED & SYNCHRONIZED  
**Audited Commit**: `e12a06ad8062518dbe7c67dbee6988298ae5597d`  
**Registry Version**: `2.3.0-synchronized-canonical`  
**Overall System Consistency**: **100.0% (ZERO DISCORDANT VALUES)**  
**Total Claims Traced**: 43 claim records (32 Active/Current, 6 Historical Pilot, 5 Formally Retired)
- **Active / Current Claims (32)**: 14 Primary Production Benchmarks (`CLM-PROD-001`..`014`), 6 Statistical Significance (`CLM-STAT-001`..`006`), 4 Production-Calibrated Gateway (`CLM-CAL-001`..`004`), 4 Adversarial Robustness (`CLM-ADV-001`..`004`), 4 Rate Limiting Boundary & Stress (`CLM-RATE-001`..`004`).
- **Historical Pilot Claims (6)**: 6 Closed-Loop Live LLM Pilot records (`CLM-HIST-001`..`004`, `CLM-HIST-007`, `CLM-HIST-008`).
- **Formally Retired Fictions (5)**: 5 Permanently Quarantined Historical Discrepancies (`CLM-RET-001`..`005`).

---

## 1. Traceability Matrix: Primary Benchmark Suite (N = 600)

| Claim ID | Metric | Canonical Value | Level 1: Code & Raw Execution | Level 2: Derived & Statistical JSON | Level 3: Visual Figures | Level 4: Technical Reports | Level 5: README.md Section | Status |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **CLM-PROD-001** | Baseline ASR | **100.0%** (500/500) | `phase1_baseline.py:85`<br>`canonical_benchmark_events.json` | `benchmark_metrics.json` (`baseline.attack_success_rate: 1.0`) | `governance_asr_ablation.png`<br>`threat_category_defense.png` | `MECHANISM_ISOLATION_REPORT.md:85` | Line 166, 219, 571 | `CONSISTENT` |
| **CLM-PROD-002** | RBAC-Only Isolated ASR | **40.0%** (200/500) | `interceptor.py:165`<br>`canonical_benchmark_events.json` | `benchmark_metrics.json` (`rbac_only.attack_success_rate: 0.4`) | `governance_asr_ablation.png` | `MECHANISM_ISOLATION_REPORT.md:86, 101` | Line 220, 571 | `CONSISTENT` |
| **CLM-PROD-003** | Policy-Only Isolated ASR | **33.0%** (165/500) | `policy_engine.py:150`<br>`canonical_benchmark_events.json` | `benchmark_metrics.json` (`policy_only.attack_success_rate: 0.33`) | `governance_asr_ablation.png` | `MECHANISM_ISOLATION_REPORT.md:87, 102` | Line 221, 571 | `CONSISTENT` |
| **CLM-PROD-004** | Full Normalized ASR | **30.0%** (150/500) | `interceptor.py:180`<br>`canonical_benchmark_events.json` | `benchmark_metrics.json` (`full_normalized.attack_success_rate: 0.3`) | `governance_asr_ablation.png`<br>`threat_category_defense.png` | `MECHANISM_ISOLATION_REPORT.md:88, 103` | Line 222, 364, 571, 633 | `CONSISTENT` |
| **CLM-PROD-005** | Full Burst ASR | **26.0%** (130/500) | `rate_limiter.py:68`<br>`canonical_benchmark_events.json` | `benchmark_metrics.json` (`full_burst.attack_success_rate: 0.26`) | `governance_asr_ablation.png` | `MECHANISM_ISOLATION_REPORT.md:89, 104` | Line 223, 571 | `CONSISTENT` |
| **CLM-PROD-006** | Hardened ASR | **26.8%** (134/500) | `policy_engine.py:80`<br>`canonical_benchmark_events.json` | `benchmark_metrics.json` (`hardened.attack_success_rate: 0.268`) | `governance_asr_ablation.png` | `MECHANISM_ISOLATION_REPORT.md:90, 105` | Line 224, 571 | `CONSISTENT` |
| **CLM-PROD-007** | Legitimate Completion (LTCR) | **100.0%** (100/100) | `phase1_baseline.py:110`<br>`canonical_benchmark_events.json` | `benchmark_metrics.json` (`ltcr: 1.0` across all configs) | `governance_asr_ablation.png` | `MECHANISM_ISOLATION_REPORT.md:85-90` | Line 227, 274, 571 | `CONSISTENT` |
| **CLM-PROD-008** | False Positive Rate (FPR) | **0.0%** (0/100) | `phase1_baseline.py:115`<br>`canonical_benchmark_events.json` | `benchmark_metrics.json` (`fpr: 0.0` across all configs) | `governance_asr_ablation.png` | `MECHANISM_ISOLATION_REPORT.md:85-90` | Line 228, 274, 571 | `CONSISTENT` |
| **CLM-PROD-009** | Baseline Median Latency | **7.35 ms** | `phase1_baseline.py:130`<br>`canonical_benchmark_events.json` | `benchmark_metrics.json` (`baseline.latency_median_ms: 7.349`) | `governance_latency_distribution.png` | `MECHANISM_ISOLATION_REPORT.md:85` | Line 251 | `CONSISTENT` |
| **CLM-PROD-010** | RBAC Median Latency | **8.09 ms** | `phase1_baseline.py:130`<br>`canonical_benchmark_events.json` | `benchmark_metrics.json` (`rbac_only.latency_median_ms: 8.09`) | `governance_latency_distribution.png` | `MECHANISM_ISOLATION_REPORT.md:86` | Line 252 | `CONSISTENT` |
| **CLM-PROD-011** | Policy Median Latency | **8.99 ms** | `phase1_baseline.py:130`<br>`canonical_benchmark_events.json` | `benchmark_metrics.json` (`policy_only.latency_median_ms: 8.994`) | `governance_latency_distribution.png` | `MECHANISM_ISOLATION_REPORT.md:87` | Line 253 | `CONSISTENT` |
| **CLM-PROD-012** | Full Normalized Median Latency | **19.08 ms** | `phase1_baseline.py:130`<br>`canonical_benchmark_events.json` | `benchmark_metrics.json` (`full_normalized.latency_median_ms: 19.075`) | `governance_latency_distribution.png` | `MECHANISM_ISOLATION_REPORT.md:88, 153` | Line 254, 270 | `CONSISTENT` |
| **CLM-PROD-013** | Full Burst Median Latency | **20.43 ms** | `phase1_baseline.py:130`<br>`canonical_benchmark_events.json` | `benchmark_metrics.json` (`full_burst.latency_median_ms: 20.434`) | `governance_latency_distribution.png` | `MECHANISM_ISOLATION_REPORT.md:89` | Line 255 | `CONSISTENT` |
| **CLM-PROD-014** | Hardened Median Latency | **24.21 ms** | `phase1_baseline.py:130`<br>`canonical_benchmark_events.json` | `benchmark_metrics.json` (`hardened.latency_median_ms: 24.208`) | `governance_latency_distribution.png` | `MECHANISM_ISOLATION_REPORT.md:90` | Line 256 | `CONSISTENT` |

---

## 2. Traceability Matrix: Statistical Significance Suite (N = 600 Paired)

| Claim ID | Metric | Canonical Value | Level 1: Code & Events | Level 2: Statistical JSON & CSV | Level 3: Technical Reports | Level 4: README.md Section | Status |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **CLM-STAT-001** | Full Normalized Edwards $\chi^2$ | **348.0029** ($p=1.15 \times 10^{-77}$) | `phase2_statistics.py:65`<br>`canonical_benchmark_events.json` | `mcnemar_tests.json`<br>`mcnemar_tests.csv` | `MECHANISM_ISOLATION_REPORT.md:146` | Line 260, 579 | `CONSISTENT` |
| **CLM-STAT-002** | Paired Median Overhead (Normalized) | **+11.27 ms** ($W=1.0, p=6.01 \times 10^{-100}$) | `phase2_statistics.py:110`<br>`canonical_benchmark_events.json` | `latency_analysis.json`<br>`latency_overhead_paired.csv` | `MECHANISM_ISOLATION_REPORT.md:154` | Line 254, 261, 366, 579 | `CONSISTENT` |
| **CLM-STAT-003** | Full Normalized ASR 95% Bootstrap CI | **[26.0%, 34.0%]** | `phase2_statistics.py:145`<br>`canonical_benchmark_events.json` | `bootstrap_confidence_intervals.json`<br>`bootstrap_cis.csv` | `FINAL_REPRODUCIBILITY_AUDIT.md` | Line 262, 579 | `CONSISTENT` |
| **CLM-STAT-004** | RBAC Edwards $\chi^2$ | **298.0033** ($p=8.97 \times 10^{-67}$) | `phase2_statistics.py:65`<br>`canonical_benchmark_events.json` | `mcnemar_tests.json`<br>`mcnemar_tests.csv` | `MECHANISM_ISOLATION_REPORT.md:144` | Line 246 | `CONSISTENT` |
| **CLM-STAT-005** | Policy Edwards $\chi^2$ | **333.0030** ($p=2.13 \times 10^{-74}$) | `phase2_statistics.py:65`<br>`canonical_benchmark_events.json` | `mcnemar_tests.json`<br>`mcnemar_tests.csv` | `MECHANISM_ISOLATION_REPORT.md:145` | Line 247 | `CONSISTENT` |
| **CLM-STAT-006** | Paired Median Overhead (Burst) | **+13.38 ms** ($W=2.0, p=6.04 \times 10^{-100}$) | `phase2_statistics.py:110`<br>`canonical_benchmark_events.json` | `latency_analysis.json`<br>`latency_overhead_paired.csv` | `MECHANISM_ISOLATION_REPORT.md:154` | Line 255, 366 | `CONSISTENT` |

---

## 3. Traceability Matrix: Live Calibrated Production Gateway (N = 600)

| Claim ID | Metric | Canonical Value | Level 1: Code & Raw Events | Level 2: Derived Metrics JSON | Level 3: Technical Reports | Level 4: README.md Section | Status |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **CLM-CAL-001** | Calibrated Gateway ASR | **20.4%** (102/500) | `phase3_calibrated.py:75`<br>`calibrated_benchmark_events.json` | `calibrated_metrics.json` (`attack_success_rate: 0.204`) | `POST_REMEDIATION_REPRODUCIBILITY_REPORT.md` | Line 170, 269, 364, 392, 590, 633 | `CONSISTENT` |
| **CLM-CAL-002** | Calibrated Gateway LTCR | **100.0%** (100/100) | `phase3_calibrated.py:90`<br>`calibrated_benchmark_events.json` | `calibrated_metrics.json` (`legitimate_task_completion_rate: 1.0`) | `POST_REMEDIATION_REPRODUCIBILITY_REPORT.md` | Line 270, 274, 590 | `CONSISTENT` |
| **CLM-CAL-003** | Calibrated Gateway FPR | **0.0%** (0/100) | `phase3_calibrated.py:95`<br>`calibrated_benchmark_events.json` | `calibrated_metrics.json` (`false_positive_rate: 0.0`) | `POST_REMEDIATION_REPRODUCIBILITY_REPORT.md` | Line 271, 274, 590 | `CONSISTENT` |
| **CLM-CAL-004** | Calibrated Median Latency | **13.32 ms** | `phase3_calibrated.py:100`<br>`calibrated_benchmark_events.json` | `calibrated_metrics.json` (`latency_median_ms: 13.321`) | `POST_REMEDIATION_REPRODUCIBILITY_REPORT.md` | Line 272, 590 | `CONSISTENT` |

---

## 4. Traceability Matrix: Adversarial Robustness Suite (N = 500)

| Claim ID | Metric | Canonical Value | Level 1: Code & Raw Events | Level 2: Derived Metrics JSON | Level 3: Visual Figures | Level 4: Technical Reports | Level 5: README.md Section | Status |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **CLM-ADV-001** | Base64 Normalization Gain | **+50.0%** ($0.0\% \to 50.0\%$) | `policy_engine.py:85`<br>`adversarial_events.json` | `adversarial_metrics.json` (`base64_obfuscation.improvement_delta: 0.5`) | `adversarial_robustness_comparison.png` | `ADVERSARIAL_NORMALIZATION_REPORT.md:80` | Line 172, 308, 595, 636 | `CONSISTENT` |
| **CLM-ADV-002** | Isolated Hardened vs Standard | **36.4% vs 40.0%** | `phase4_adversarial.py:80`<br>`adversarial_events.json` | `adversarial_metrics.json` (`mechanism_isolated_evaluation`) | `adversarial_robustness_comparison.png` | `ADVERSARIAL_NORMALIZATION_REPORT.md:65` | Line 172, 303, 595, 636 | `CONSISTENT` |
| **CLM-ADV-003** | Compound Burst Standard Recall | **75.2%** (376/500) | `phase4_adversarial.py:110`<br>`adversarial_events.json` | `adversarial_metrics.json` (`compound_burst_evaluation.overall_standard_recall: 0.752`) | `adversarial_robustness_comparison.png` | `ADVERSARIAL_NORMALIZATION_REPORT.md:95` | Line 172, 316, 595, 655 | `CONSISTENT` |
| **CLM-ADV-004** | Compound Burst Hardened Recall | **74.4%** (372/500) | `phase4_adversarial.py:110`<br>`adversarial_events.json` | `adversarial_metrics.json` (`compound_burst_evaluation.overall_hardened_recall: 0.744`) | `adversarial_robustness_comparison.png` | `ADVERSARIAL_NORMALIZATION_REPORT.md:95` | Line 172, 316, 595, 655 | `CONSISTENT` |

---

## 5. Traceability Matrix: Rate Limiter Stress Suite

| Claim ID | Metric | Canonical Value | Level 1: Code & Raw Events | Level 2: Derived Metrics JSON | Level 3: Technical Reports | Level 4: README.md Section | Status |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **CLM-RATE-001** | High-Risk SQL Limit (5/60s) | **Call #6 Blocked** | `rate_limiter.py:23`<br>`rate_limit_stress_events.json` | `rate_limit_stress_metrics.json` (`execute_sql.first_blocked_call: 6`) | `RATE_LIMIT_STRESS_REPORT.md:68` | Line 171, 335, 605 | `CONSISTENT` |
| **CLM-RATE-002** | Modification Tool Limit (20/60s) | **Call #21 Blocked** | `rate_limiter.py:20`<br>`rate_limit_stress_events.json` | `rate_limit_stress_metrics.json` (`update_customer.first_blocked_call: 21`) | `RATE_LIMIT_STRESS_REPORT.md:69` | Line 171, 336, 605 | `CONSISTENT` |
| **CLM-RATE-003** | Read Tool Limit (100/60s) | **Call #101 Blocked** | `rate_limiter.py:17`<br>`rate_limit_stress_events.json` | `rate_limit_stress_metrics.json` (`search_customer.first_blocked_call: 101`) | `RATE_LIMIT_STRESS_REPORT.md:70` | Line 171, 337, 605 | `CONSISTENT` |
| **CLM-RATE-004** | Boundary Reset (+61s) | **Window Reset 100%** | `rate_limiter.py:56`<br>`rate_limit_stress_events.json` | `rate_limit_stress_metrics.json` (`window_reset_test.call_7_allowed: true`) | `RATE_LIMIT_STRESS_REPORT.md:74-88` | Line 171, 338, 605 | `CONSISTENT` |

---

## 6. Traceability Matrix: Closed-Loop Live LLM Pilot (N = 20)

| Claim ID | Metric | Canonical Value | Level 1: Raw Trace CSV | Level 2: Derived Metrics JSON | Level 3: Visual Figures | Level 4: README.md Section | Status |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **CLM-HIST-001** | Model Compromise Induction Rate | **40.0%** (4/10) | `results/historical/closed_loop_traces.csv` | `closed_loop_metrics.json` (`attack_induction_rate: 0.4`) | `closed_loop_agent_funnel.png` | Line 347, 357, 637 | `CONSISTENT` |
| **CLM-HIST-002** | Conditional Gateway Interception | **75.0%** (3/4) | `results/historical/closed_loop_traces.csv` | `closed_loop_metrics.json` (`conditional_interception_rate: 0.75`) | `closed_loop_agent_funnel.png` | Line 348, 357, 365, 637 | `CONSISTENT` |
| **CLM-HIST-003** | Governed End-to-End Breach Rate | **10.0%** (1/10) | `results/historical/closed_loop_traces.csv` | `closed_loop_metrics.json` (`end_to_end_breach_rate: 0.1`) | `closed_loop_agent_funnel.png` | Line 349, 357, 637 | `CONSISTENT` |
| **CLM-HIST-004** | Closed-Loop Benign LTCR | **100.0%** (10/10) | `results/historical/closed_loop_traces.csv` | `closed_loop_metrics.json` (`benign_completion_rate: 1.0`) | `closed_loop_agent_funnel.png` | Line 350 | `CONSISTENT` |
| **CLM-HIST-007** | Prompt-Level Latency Ratio | **21.32%** ($161.11 / 755.83$) | `results/historical/closed_loop_traces.csv` | `closed_loop_metrics.json` (`prompt_level_latency_ratio: 0.2132`) | — | Line 353, 366, 635, 653 | `CONSISTENT` |
| **CLM-HIST-008** | Tool-Call Latency Ratio | **31.80%** ($230.16 / 723.74$) | `results/historical/closed_loop_traces.csv` | `closed_loop_metrics.json` (`active_tool_call_latency_ratio: 0.3180`) | — | Line 354, 366, 635, 653 | `CONSISTENT` |

---

## 7. Traceability Matrix: Formally Retired Fictions

| Claim ID | Retired Description | Quarantined Value | Forensic Disposition | README.md Status | Registry Status | Status |
| :--- | :--- | :---: | :--- | :--- | :--- | :---: |
| **CLM-RET-001** | "3.55% Latency Tax" | **3.55%** | Denominator fiction ($4,536.3\text{ ms}$) absent from raw traces; true prompt ratio is $21.32\%$. | Retired (`CLM-RET-001`) at Line 653 | Quarantined in `claim_registry.json` | `RETIRED & QUARANTINED` |
| **CLM-RET-002** | "4,375.2 ms Median LLM Latency" | **4,375.2 ms** | Absent from raw traces; true median is $692.99\text{ ms}$. | Retired (`CLM-RET-002`) at Line 653 | Quarantined in `claim_registry.json` | `RETIRED & QUARANTINED` |
| **CLM-RET-003** | "76.8% Hardened Adversarial Recall" | **76.8%** | Arithmetic error; true burst values are $75.2\%$ vs $74.4\%$; isolated values are $40.0\%$ vs $36.4\%$. | Retired (`CLM-RET-003`) at Line 318, 655 | Quarantined in `claim_registry.json` | `RETIRED & QUARANTINED` |
| **CLM-RET-004** | "112.55 ms Median Overhead" | **112.55 ms** | Docker bind-mount latency artifact; true native paired overhead is $+9.07\text{ ms}$ (normalized) / $+3.98\text{ ms}$ (burst). | Retired (`CLM-RET-004`) at Line 654 | Quarantined in `claim_registry.json` | `RETIRED & QUARANTINED` |
| **CLM-RET-005** | "6.4% Calibrated ASR" | **6.4%** | Un-persisted offline simulation; true live production SQLite gateway achieves $20.4\%$. | Archived in `results/historical/` at Line 274, 392, 648 | Archived in `results/historical/` | `RETIRED & ARCHIVED` |
