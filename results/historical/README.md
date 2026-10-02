# Historical Results Archive

This directory archives historical execution artifacts and experimental outputs produced during earlier development and research evaluation phases of PromptAegis.

## Archival Purpose & Evidence Discipline
As mandated by the scientific reproducibility protocol:
1. **Historical artifacts are preserved**, not overwritten or deleted, even when superseded by newer canonical runs.
2. **Historical claims must remain clearly designated as `HISTORICAL`, `OFFLINE`, or `SIMULATED`** and must not be conflated with the current reproducible production gateway results.
3. Any contradicted documentation fictions (such as the 3.55% latency tax or 4,375.2 ms median LLM latency) are formally marked `RETIRED`.

## Artifact Inventory

| Filename | Description | Provenance Status | Origin / Generating Script | Known Scientific Limitations |
|:---|:---|:---:|:---|:---|
| `results_control_baseline.json` | 2,400 raw execution events across 4 configs (baseline, permission, policy, full) | **HISTORICAL** | `scratch/phase1_reproduce_baseline.py` executed against unpinned wall-clock gateway | 60s tumbling-window rollover straddled execution; Docker NTFS bind mount inflated median latency to 139.72 ms. |
| `results_calibrated.json` | 600 execution events under tuned rules and role remapping | **SIMULATION/SCRATCH-ONLY** | `scratch/phase3_calibrated_evaluation.py` | In-memory standalone evaluator; utilized synthetic latency constants (+15ms to +55ms). Not executed by production gateway. |
| `closed_loop_traces.csv` | 20 real execution traces (10 jailbreak, 10 benign) | **HISTORICAL** | `scratch/phase5_closed_loop_llm.py` via Groq Cloud API (`openai/gpt-oss-120b`) | Real API measurements; mean LLM latency 755.83 ms, mean gateway latency 161.11 ms. Prior documentation fabricated 3.55% ratio and 4,375.2 ms median. |
| `closed_loop_results.json` | Detailed model responses, tool emissions, and gateway interception outcomes | **HISTORICAL** | `scratch/phase5_closed_loop_llm.py` | Governs tool invocations emitted by `openai/gpt-oss-120b`. |
| `statistical_mcnemar.csv` | Edwards continuity-corrected McNemar test results | **DERIVED-FROM-HISTORICAL** | `scratch/phase2_statistical_analysis.py` | Recomputed from `results_control_baseline.json` discordant pairs ($b=20, c=343 \implies \chi^2 = 285.63$). |
| `statistical_latency.csv` | Latency percentiles and Wilcoxon signed-rank test | **DERIVED-FROM-HISTORICAL** | `scratch/phase2_statistical_analysis.py` | Paired Wilcoxon $W = 811.0, p = 3.41 \times 10^{-98}$ on Docker/NTFS latencies. |
| `statistical_bootstrap_cis.csv` | 95% bootstrap confidence intervals for ASR across configs | **DERIVED-FROM-HISTORICAL** | `scratch/phase2_statistical_analysis.py` | 10,000 bootstrap resamples on `results_control_baseline.json`. |
| `statistical_evaluation_report.json` | Aggregated metrics and category breakdown | **DERIVED-FROM-HISTORICAL** | `scratch/phase2_statistical_analysis.py` | JSON synthesis of historical evaluation. |
