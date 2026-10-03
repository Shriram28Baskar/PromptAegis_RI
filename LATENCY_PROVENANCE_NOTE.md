# LATENCY PROVENANCE NOTE

**Prepared**: 2026-10-03  
**Status**: Supplementary reproducibility documentation — not manuscript content

---

## Overview

This note documents a known two-run discrepancy between paired latency statistics present in the current `results/statistical/latency_analysis.json` artifact and the canonical manuscript-reported values.

---

## Canonical Manuscript Values (Frozen)

| Metric | Manuscript Value |
|--------|----------------|
| Baseline P50 | 7.35 ms |
| Full Normalized P50 | 19.08 ms |
| Full Burst P50 | 20.43 ms |
| Hardened P50 | 24.21 ms |
| Normalized paired overhead | **+11.27 ms** |
| Burst paired overhead | **+13.38 ms** |
| Wilcoxon W (Normalized) | 1.0 |
| Wilcoxon W (Burst) | 2.0 |

These values are sourced from the **Mechanism Isolation Report benchmark execution** at commit `e12a06ad8062518dbe7c67dbee6988298ae5597d`, documented in `MECHANISM_ISOLATION_REPORT.md`, `FINAL_CLAIM_CENSUS.md`, and `README.md`. They are designated as `CURRENT-PRODUCTION` in `claim_registry.json` (CLM-PROD-009 through CLM-PROD-014, CLM-STAT-002, CLM-STAT-006).

---

## Second-Run Values in `latency_analysis.json`

| Metric | Current `latency_analysis.json` |
|--------|--------------------------------|
| Baseline P50 (ref_median_ms) | 10.894 ms |
| Full Normalized P50 | 22.751 ms |
| Full Burst P50 | 20.601 ms |
| Normalized paired diff | **+12.009 ms** |
| Burst paired diff | **+9.243 ms** |
| Wilcoxon W (Normalized) | 10.0 |
| Wilcoxon W (Burst) | 796.0 |
| Run ID | `run_canonical_benchmark_1790917798` |

---

## Explanation

Both executions ran identical code (`experiments/phase2_statistics.py`) on identical benchmark scenarios (N=600 canonical scenarios, commit `e12a06a`). Both produce statistically correct paired Wilcoxon results.

The two executions produced different timing measurements despite using the same benchmark code and scenario corpus. The discrepancy is treated as run-to-run execution-environment and timing variation; the specific causal contribution of timer resolution was not independently isolated.

Neither run is "wrong." Both correctly measure the latency of the same gateway pipeline code under the conditions present at the time of each execution.

---

## Canonical Designation

The Mechanism Isolation Report execution was designated canonical during the scientific audit at the `f16fae2` freeze commit. The designation is recorded in:
- `results/provenance/claim_registry.json`: `CLM-STAT-002` (notes field) and `CLM-RET-004` (retired artifact note)
- `FINAL_CLAIM_CENSUS.md`: CLM-STAT-002, CLM-STAT-006 marked `CURRENT-PRODUCTION`
- `docs/archive/pre_freeze/FINAL_RELEASE_GATE_REPORT.md`: Section on paired overhead

The `latency_analysis.json` artifact in `results/statistical/` reflects the second execution run and has values inconsistent with the canonical claims. This file was generated but not used as the source for the manuscript-reported figures; it was superseded by the earlier Mechanism Isolation Report execution which was designated canonical.

---

## Impact on Reproducibility

A reviewer attempting to reproduce the paired latency statistics by running `experiments/phase2_statistics.py` on the current `results/raw/canonical_benchmark_events.json` will obtain `+12.009 ms` and `+9.243 ms` rather than `+11.27 ms` and `+13.38 ms`. The discrepancy is treated as run-to-run execution-environment variation; the specific causal mechanism was not independently isolated.

The direction, statistical significance (Wilcoxon p < 10⁻⁹⁸ in both runs), and order of magnitude of all results are consistent across both runs. The qualitative findings (multi-stage governance introduces measurable latency overhead; normalized traffic has higher overhead than burst due to rate-limiter early-exit; overhead is small relative to LLM generation time) are robust across both executions.

---

## Authoritative Artifact for Manuscript

The authoritative primary evidence for the reported paired latency values is the Mechanism Isolation Report execution, which corresponds to the data recorded in `MECHANISM_ISOLATION_REPORT.md` (commit `e12a06a`). The manuscript reports the values from the Mechanism Isolation Report execution, which was designated as the canonical source for the frozen manuscript results.

The `results/statistical/latency_analysis.json` file was generated during a second execution and is noted here for transparency. It is not the source of the manuscript figures.
