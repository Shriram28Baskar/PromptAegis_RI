# BEFORE_REFACTOR_REPRODUCIBILITY_REPORT.md

**Status**: IMMUTABLE EVIDENCE BOUNDARY (BEFORE-REFACTOR)  
**Timestamp**: 2026-10-02T08:15:00+05:30  
**Evaluator**: Principal Engineer & Reproducibility Architect  
**Repository**: `https://github.com/Shriram28Baskar/PromptAegis_RI`  
**Base Commit**: `e12a06ad8062518dbe7c67dbee6988298ae5597d`

---

## 1. Executive Summary & Purpose

This report freezes the exact repository, environment, configuration, and evidentiary state of PromptAegis **before any refactoring, pipeline reconstruction, or code modifications are made**. 

All quantitative claims and performance metrics documented herein represent the pre-refactor baseline. Future experimental results generated post-refactoring must be compared against this document to verify that:
1. Historical artifacts are preserved rather than overwritten.
2. Changes to performance metrics reflect clean, deterministic execution rather than artificial tuning.
3. All publication-facing quantitative claims are strictly traced to committed, executable code.

---

## 2. Git & Working-Tree State

- **Branch**: `main`
- **Head Commit Hash**: `e12a06ad8062518dbe7c67dbee6988298ae5597d`
- **Commit Message**: `feat: complete PromptAegis research deliverables, multi-stage governance gateway, benchmark datasets, and certified figures`
- **Tracked Files in Repository**: 54 files across `backend/`, `frontend/`, and root documentation.
- **Untracked / Audit Scratch Files Present in Working Tree**:
  - `AUDIT_REPORT.md` (Audit v1 report)
  - `AUDIT_REPORT_v2.md` (Audit v2 report)
  - `AUDIT_REPORT_v3.md` (Audit v3 report)
  - `FINDINGS_FOR_AUTHOR.md` (Author-facing remediation dossier)
  - `tmp/` (Local audit workspaces containing verification runs and mirrors)

---

## 3. Environment & Runtime Platform

- **Operating System**: Microsoft Windows 11 Home Single Language (Build 10.0.26100)
- **Architecture**: AMD64 (x86_64)
- **Python Version**: Python 3.11.3 (`pytest-8.3.3`, `scipy-1.14.1`, `numpy-1.26.4`, `pandas-2.2.3`, `fastapi-0.115.0`, `matplotlib-3.9.2`, `httpx-0.27.2`)
- **Node.js Environment**: Node.js v18+, npm 9+ (Vite 5.4, React 18.3)
- **Database Engine**: SQLite 3 (Thread-safe context manager, `WAL` journal mode)

---

## 4. Current Database Schema & State

The database file `backend/database/gateway.db` encapsulates 9 relational tables as defined in `backend/database/db.py`:

| Table Name | Pre-Refactor Row Count | Description / Role |
|:---|:---:|:---|
| `agents` | 5 rows | Registered agent personas (`CustomerSupportAgent`, `AdminAgent`, `EmailAssistant`, `UnrestrictedAgent`, `TestResearchAgent`) |
| `tools` | 8 rows | Canonical tools (`search_customer`, `search_order`, `send_email`, `update_customer`, `delete_customer`, `export_customer_data`, `execute_sql`, `file_delete`) |
| `permissions` | 27 rows | Agent-to-tool RBAC mappings (`allowed` = 0 or 1) |
| `policies` | 5 rows | Priority-ordered governance policies (role-based, parameter-based, tool-based, rate-based) |
| `tool_calls` | 14 rows | Historical live intercepted tool calls with latency, risk score, decision |
| `rate_limit_counters` | 3 rows | SQLite 60-second tumbling-window counters keyed by `agent_id::tool_name::window_start` |
| `experiment_runs` | 1 rows | Historical benchmark execution metadata |
| `experiment_events` | 10 rows | Per-scenario execution traces from prior run |
| `logs` | 0 rows | Auxiliary detection pipeline logs |

---

## 5. Benchmark Dataset Census

Committed benchmark datasets reside in `backend/data/benchmark/` totaling 600 canonical scenarios plus 1 extension dataset:

| Dataset File | Scenario Count | Threat / Task Classification | Expected Decision |
|:---|:---:|:---|:---:|
| `unauthorized_tool.json` | 100 | T1: Unauthorized Tool Invocation | `DENY` |
| `privilege_escalation.json` | 100 | T2: Privilege Escalation via Parameter Manipulation | `DENY` |
| `prompt_injection.json` | 100 | T3: Prompt-Driven Indirect Tool Invocation | `DENY` |
| `parameter_manipulation.json` | 100 | T4: Malicious Parameter Injection (SQLi, Path Traversal) | `DENY` |
| `excessive_calls.json` | 100 | T5: High-Frequency Denial-of-Service / Abuse | `RATE_LIMIT` |
| `legitimate.json` | 100 | Benign Customer Support Tasks | `ALLOW` |
| **Canonical Primary Suite** | **600** | **500 Attack Scenarios + 100 Legitimate Scenarios** | — |
| `adversarial_extension.json` | 500 | T6: Clustered Adversarial Perturbations (5 classes $\times$ 100 base) | `DENY` |

---

## 6. Pre-Refactor Claims Census & Provenance Classification

Every publication-facing quantitative claim appearing in the repository prior to refactoring has been inventoried and assigned a forensic provenance category:

| Claim ID | Metric Description | Value Claimed | Documented Location | Pre-Refactor Provenance Status | Ground-Truth Finding |
|:---:|:---|:---:|:---|:---:|:---|
| **C01** | Baseline ASR | 100.0% (500/500) | README:244, Report:17 | **ARCHIVED-ARTIFACT-REPRODUCED** | Generated in `results_control_baseline.json`; all 500 allowed under baseline bypass. |
| **C02** | Permission-Only ASR | 36.0% (180/500) | README:245, Report:18 | **ARCHIVED-ARTIFACT-REPRODUCED** | Generated in `results_control_baseline.json`; 320/500 blocked by RBAC table. |
| **C03** | Policy-Only ASR | 28.0% (140/500) | README:246, Report:19 | **ARCHIVED-ARTIFACT-REPRODUCED** | Generated in `results_control_baseline.json`; 360/500 blocked by policy regexes. |
| **C04** | Full Governance ASR (Historical) | 31.4% (157/500) | README:247, Report:20 | **ARCHIVED-ARTIFACT-REPRODUCED** | Present in `results_control_baseline.json` ($N=2400$). However, non-deterministic under current wall clock (yields 8.0% if run at `:00` without rollover). |
| **C05** | Calibrated ASR | 6.4% (32/500) | README:263, Report:21 | **SIMULATION/SCRATCH-ONLY** | Produced by `scratch/phase3_calibrated_evaluation.py` using in-memory mock and synthetic parameter expansion. Not executed by production gateway. |
| **C06** | Legitimate Task Completion (LTCR) | 80.0% (Full), 100.0% (Calibrated) | README:247, 263 | **ARCHIVED-ARTIFACT-REPRODUCED** / **SIMULATION** | 80.0% in `results_control_baseline.json` (20 legitimate calls blocked due to missing permissions for role); 100.0% in mock. |
| **C07** | False Positive Rate (FPR) | 20.0% (Full), 0.0% (Calibrated) | README:247, 263 | **ARCHIVED-ARTIFACT-REPRODUCED** / **SIMULATION** | Inverse of LTCR ($1 - 0.80 = 0.20$); 0.0% in mock. |
| **C08** | McNemar Chi-Square Test | $\chi^2 = 285.63$, $p = 4.45 \times 10^{-64}$ | README:251, Report:27 | **DERIVED-FROM-GENUINE-ARTIFACTS** | Exact Edwards continuity-corrected formula on $b=20, c=343$ discordant pairs in `results_control_baseline.json`. |
| **C09** | Wilcoxon Signed-Rank Test | $W = 811.0$, $p = 3.41 \times 10^{-98}$ | README:252, Report:28 | **DERIVED-FROM-GENUINE-ARTIFACTS** | Computed from 600 paired latencies in `results_control_baseline.json`. |
| **C10** | Baseline Median Latency | 21.38 ms | README:244, Report:17 | **ARCHIVED-ARTIFACT-REPRODUCED** | Exact median of baseline latencies in `results_control_baseline.json` (21.376 ms). |
| **C11** | Full Governance Median Latency | 139.72 ms | README:247, Report:20 | **ARCHIVED-ARTIFACT-REPRODUCED** | Exact median of full governance latencies in `results_control_baseline.json` (139.719 ms, reflecting Docker/NTFS sync overhead). |
| **C12** | Paired Median Overhead | +112.55 ms | README:247, Report:20 | **DERIVED-FROM-GENUINE-ARTIFACTS** | Exact median of differences $(L_{\text{full}, i} - L_{\text{baseline}, i})$. Native HTTP overhead is +1.20 to +5.06 ms. |
| **C13** | Standard Adversarial Recall | 54.8% (274/500) | README:290, Report:76 | **SIMULATION/SCRATCH-ONLY** | Computed in `scratch/phase4_adversarial_extension.py` via inline helper; not integrated into production gateway. |
| **C14** | Hardened Adversarial Recall | 66.0% (330/500) | README:290, Report:76 | **SIMULATION/SCRATCH-ONLY** | Computed in `scratch/phase4_adversarial_extension.py` with standalone URL/Base64 decoders. |
| **C15** | Closed-Loop LLM Model Compromise | 40.0% (4/10) | README:324, Report:89 | **ARCHIVED-ARTIFACT-REPRODUCED** | Real Groq API run (`openai/gpt-oss-120b`) in `scratch/closed_loop_traces.csv`. |
| **C16** | Closed-Loop Conditional Interception | 75.0% (3/4) | README:325, Report:90 | **ARCHIVED-ARTIFACT-REPRODUCED** | 3 of 4 malicious calls intercepted by PromptAegis. |
| **C17** | Closed-Loop End-to-End Breach Rate | 10.0% (1/10) | README:326, Report:91 | **ARCHIVED-ARTIFACT-REPRODUCED** | 1 malicious call bypassed regex filter. |
| **C18** | Closed-Loop Prompt-Level Latency Ratio | 21.32% | README:599 | **DERIVED-FROM-GENUINE-ARTIFACTS** | Mean Gateway (161.11 ms) / Mean LLM (755.83 ms) across all 20 prompts. |
| **C19** | Closed-Loop Tool-Call Latency Ratio | 31.80% | Unreported in README | **DERIVED-FROM-GENUINE-ARTIFACTS** | Mean Gateway (230.16 ms) / Mean LLM (723.74 ms) across 14 active tool-calling prompts. |
| **C20** | Relative Latency Tax Claim (3.55%) | 3.55% ($161.1 / 4536.3$) | README:330, Report:94 | **CONTRADICTED / RETIRED** | Documentation fiction. The 4,536.3 ms denominator does not exist in any raw execution trace. |
| **C21** | Median LLM Inference Latency (4,375.2 ms) | 4,375.2 ms | README:328 | **CONTRADICTED / RETIRED** | Documentation fiction. Actual median LLM latency in `closed_loop_traces.csv` is 692.99 ms. |
| **C22** | Secondary Calibrated Latency (25.0 ms) | 25.00 ms | Report:21 | **SIMULATION/SCRATCH-ONLY** | Synthetic constant added in `scratch/phase3_calibrated_evaluation.py`. |

---

## 7. Pre-Refactor Figure Hashes & Status

Figure artifacts currently committed in `backend/reports/figures/`:

| Figure Filename | Size (Bytes) | SHA-256 Checksum | Pre-Refactor Evaluation Path |
|:---|:---:|:---:|:---|
| `adversarial_robustness_comparison.png` | 307,143 | `2551f810a14ef23cf6867a9f979d81a5c02e91c744a3d6a2baae1cad344a9bed` | Hardcoded literal arrays in script |
| `category_recall_comparison.png` | 257,965 | `bd2424d8db8c7407235e6584e1a5cb3d013aca54745ce0d7aba80820c8933b88` | Hardcoded literal arrays in script |
| `closed_loop_agent_funnel.png` | 291,607 | `53ed27eb578bfa24e23056d1a7d2f9572b8c32329eeeb82fd8ed553f471faf48` | Hardcoded literal values in script |
| `confusion_matrix.png` | 258,433 | `8d8d18522bda364fb00d8b6eb3018354cdfda52a93464a41878daab3259af067` | Pre-generation classifier artifact |
| `feature_importance.png` | 288,225 | `0327f7ff857e8656da361e3e40167cef127e4c9593eb1045bd0af552d832d84b` | Pre-generation classifier artifact |
| `governance_asr_ablation.png` | 240,459 | `988730cf35ff573b252ca9bd186e54e7b59dbcdd940f6fa7b1a44e5db6424680` | Hardcoded literal arrays in script |
| `governance_latency_distribution.png` | 241,553 | `c8dbe3f59099b9ff72090dbad273fe1b926f93a85b0c3821c0bedb54b1ecd2a5` | Hardcoded literal percentiles in script |
| `pipeline_architecture.png` | 273,558 | `d74f020d2cdab8c3a9dc403aa6ad5a123f0da3ab3ccad0c31ec66cb34c9e99c6` | Architectural schematic diagram |
| `pr_curve.png` | 233,628 | `01c513cdbd5c260d8a78925f2b3a34cf988bf50897d6095f224327127bb9fecf` | Pre-generation classifier artifact |
| `risk_score_distribution.png` | 161,468 | `433d8927ee6c40cb1e742cf0b316bac3c815b948ed281295e77220196a2920db` | Static distribution plot |
| `roc_curve.png` | 259,872 | `fc6ff1a77848e4093738a89adf2e39888f54d710df6f229d390625561e49a626` | Pre-generation classifier artifact |
| `threat_category_defense.png` | 288,510 | `24b72a277ed21a1f7e4f2a5d4c1abeb59143da7efdfb2a79c3644334ef5565ef` | Hardcoded literal arrays in script |

---

## 8. Deficiencies Identified in Pre-Refactor State

1. **Absence of Committed Experiment Pipeline**: The README directed users to run `python scratch/phase*.py`, but no `scratch/` directory was tracked by Git.
2. **Wall-Clock Dependent Rate Limiting**: The 60-second tumbling window (`rate_limiter.py:48`) caused benchmark outcomes to vary from 8.0% to 31.4% ASR depending purely on execution start time relative to minute boundaries.
3. **Hardcoded Visualization Pipelines**: Figure-generation scripts in `backend/scripts/` relied on hardcoded numeric arrays rather than reading dynamically computed metrics from raw result artifacts.
4. **Offline Defense Logic**: URL and Base64 normalization in Phase 4 existed only as local scratch functions, never integrated into `backend/governance/policy_engine.py`.
5. **Simulated Calibrated Run**: Calibrated evaluation in Phase 3 bypassed the gateway, using hardcoded synthetic latency constants (`+15`, `+25`, `+40` ms).
6. **Contradicted README Latency Claims**: Claims of 3.55% relative latency tax and 4,375.2 ms median LLM latency directly contradicted raw Groq traces.

---

## 9. Immutable Freeze Certification

This document establishes the pre-refactor boundary. All subsequent architectural and experimental modifications shall be strictly logged and compared against the baseline captured here.
