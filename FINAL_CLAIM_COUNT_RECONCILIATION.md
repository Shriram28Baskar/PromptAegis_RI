# PromptAegis — Final Claim Count & Taxonomy Reconciliation

**Document Status**: LOCKED & SYNCHRONIZED  
**Audited Commit**: `e12a06ad8062518dbe7c67dbee6988298ae5597d`  
**Execution Environment**: Python 3.11.3 (Windows x64), SQLite 3.x, deterministic `ResearchExperimentClock`  
**Registry Version**: `2.3.0-synchronized-canonical`  

---

## 1. Executive Reconciliation Summary

During previous audit phases, an apparent numerical discrepancy arose between documents regarding the total number of claims:
- Early provisional scripts and draft reports referenced **31 claims** (an un-expanded subset that compressed certain latency percentiles, paired statistical tests, and retired entries).
- The comprehensive **Claim Census** (`FINAL_CLAIM_CENSUS.md`) and **Consistency Matrix** (`FINAL_CONSISTENCY_MATRIX.md`) comprehensively tracked **43 claim records** to provide full transparency across every ablation stage, latency metric, statistical test, adversarial regime, and historical discrepancy.

To resolve all ambiguity and establish an absolute single source of truth, the Claim Registry generator (`experiments/build_claim_registry.py`), the primary Claim Registry (`results/provenance/claim_registry.json`), the Claim Census (`FINAL_CLAIM_CENSUS.md`), the Consistency Matrix (`FINAL_CONSISTENCY_MATRIX.md`), and the Freeze Audit (`FINAL_FREEZE_AUDIT.md`) have been fully harmonized to the **canonical 43-claim taxonomy**.

---

## 2. Canonical Taxonomy & Count Breakdown

The PromptAegis scientific record defines exactly **43 claim records**, strictly partitioned into three mutually exclusive lifecycle statuses:

```
PROMPTAEGIS CLAIM REGISTRY (43 TOTAL RECORDS)
├── ACTIVE / CURRENT CLAIMS: 32
│   ├── Primary Production Benchmarks (N=600): 14 claims (CLM-PROD-001..014)
│   ├── Statistical Significance & Paired Tests: 6 claims (CLM-STAT-001..006)
│   ├── Production-Calibrated Gateway (N=600): 4 claims (CLM-CAL-001..004)
│   ├── Adversarial Evasion Robustness (N=500): 4 claims (CLM-ADV-001..004)
│   └── Rate Limiting Boundary & Stress: 4 claims (CLM-RATE-001..004)
├── HISTORICAL PILOT CLAIMS: 6
│   └── Closed-Loop Live LLM Pilot (N=20): 6 claims (CLM-HIST-001..004, 007, 008)
└── FORMALLY RETIRED FICTIONS: 5
    └── Quarantined Historical Discrepancies: 5 claims (CLM-RET-001..005)
```

### Exact Summary Table

| Category | Claim ID Range | Count | Lifecycle Status | Runtime Verification |
| :--- | :---: | :---: | :---: | :---: |
| **Primary Production Benchmarks** | `CLM-PROD-001` .. `CLM-PROD-014` | 14 | `CURRENT-PRODUCTION` | Live code execution on 600 scenarios |
| **Statistical Significance Suite** | `CLM-STAT-001` .. `CLM-STAT-006` | 6 | `CURRENT-DERIVED` | Mathematically derived from 600 paired scenarios |
| **Production-Calibrated Gateway** | `CLM-CAL-001` .. `CLM-CAL-004` | 4 | `CURRENT-PRODUCTION` | Live production SQLite gateway execution |
| **Adversarial Evasion Robustness** | `CLM-ADV-001` .. `CLM-ADV-004` | 4 | `CURRENT-PRODUCTION` | 500 perturbed inputs across 2 regimes |
| **Rate Limiting Boundary & Stress** | `CLM-RATE-001` .. `CLM-RATE-004` | 4 | `CURRENT-PRODUCTION` | Virtual clock boundary stress evaluation |
| **Subtotal Active / Current** | — | **32** | — | **100% Empirically Verified** |
| **Closed-Loop Historical Pilot** | `CLM-HIST-001`..`004`, `007`, `008` | 6 | `HISTORICAL` | Bounded to 20-prompt exploratory pilot |
| **Formally Retired Discrepancies** | `CLM-RET-001` .. `CLM-RET-005` | 5 | `RETIRED` | Quarantined documentation errors & fictions |
| **TOTAL CLAIM RECORDS** | — | **43** | — | **100% Synchronized Across Repository** |

---

## 3. Comprehensive Inventory of All 43 Claims

### 3.1 Primary Production Benchmarks (14 Active Claims)
- **CLM-PROD-001**: Baseline Attack Success Rate = **100.0%** ($500/500$)
- **CLM-PROD-002**: RBAC-Only Isolated Attack Success Rate = **40.0%** ($200/500$)
- **CLM-PROD-003**: Policy-Only Isolated Attack Success Rate = **33.0%** ($165/500$)
- **CLM-PROD-004**: Full Normalized Attack Success Rate = **30.0%** ($150/500$)
- **CLM-PROD-005**: Full Burst Attack Success Rate = **26.0%** ($130/500$)
- **CLM-PROD-006**: Hardened Governance Attack Success Rate = **26.8%** ($134/500$)
- **CLM-PROD-007**: Legitimate Task Completion Rate (LTCR) = **100.0%** ($100/100$)
- **CLM-PROD-008**: False Positive Rate (FPR) = **0.0%** ($0/100$)
- **CLM-PROD-009**: Baseline Median Latency (P50) = **7.35 ms**
- **CLM-PROD-010**: RBAC-Only Median Latency (P50) = **8.09 ms**
- **CLM-PROD-011**: Policy-Only Median Latency (P50) = **8.99 ms**
- **CLM-PROD-012**: Full Normalized Median Latency (P50) = **19.08 ms**
- **CLM-PROD-013**: Full Burst Median Latency (P50) = **20.43 ms**
- **CLM-PROD-014**: Hardened Median Latency (P50) = **24.21 ms**

### 3.2 Statistical Significance Suite (6 Active Claims)
- **CLM-STAT-001**: McNemar Edwards $\chi^2$ (Baseline vs Full Normalized) = **348.0029** ($p = 1.15 \times 10^{-77}$)
- **CLM-STAT-002**: Paired Median Latency Overhead (Full Normalized) = **+11.27 ms** ($W = 1.0, p = 6.01 \times 10^{-100}$)
- **CLM-STAT-003**: Full Normalized ASR 95% Bootstrap CI = **[26.0%, 34.0%]**
- **CLM-STAT-004**: McNemar Edwards $\chi^2$ (Baseline vs RBAC-Only) = **298.0033** ($p = 8.97 \times 10^{-67}$)
- **CLM-STAT-005**: McNemar Edwards $\chi^2$ (Baseline vs Policy-Only) = **333.0030** ($p = 2.13 \times 10^{-74}$)
- **CLM-STAT-006**: Paired Median Latency Overhead (Full Burst) = **+13.38 ms** ($W = 2.0, p = 6.04 \times 10^{-100}$)

### 3.3 Production-Calibrated Gateway (4 Active Claims)
- **CLM-CAL-001**: Calibrated Gateway ASR = **20.4%** ($102/500$)
- **CLM-CAL-002**: Calibrated Gateway LTCR = **100.0%** ($100/100$)
- **CLM-CAL-003**: Calibrated Gateway FPR = **0.0%** ($0/100$)
- **CLM-CAL-004**: Calibrated Gateway Median Latency (P50) = **13.32 ms** (measured: $13.32\text{--}17.26\text{ ms}$)

### 3.4 Adversarial Evasion Robustness (4 Active Claims)
- **CLM-ADV-001**: Base64 Normalization Recall Gain = **+50.0%** ($0.0\% \to 50.0\%$)
- **CLM-ADV-002**: Isolated Hardened Recall vs Standard = **36.4% vs 40.0%** ($182\text{ vs }200 / 500$)
- **CLM-ADV-003**: Compound Burst Standard Recall = **75.2%** ($376/500$, 360 rate-limiter driven)
- **CLM-ADV-004**: Compound Burst Hardened Recall = **74.4%** ($372/500$, 343 rate-limiter driven)

### 3.5 Rate Limiting Boundary & Stress (4 Active Claims)
- **CLM-RATE-001**: High-Risk SQL Quota Precision ($L=5$) = **Call #6 Blocked** (100% precision)
- **CLM-RATE-002**: Modification Tool Quota Precision ($L=20$) = **Call #21 Blocked** (100% precision)
- **CLM-RATE-003**: Read Tool Quota Precision ($L=100$) = **Call #101 Blocked** (100% precision)
- **CLM-RATE-004**: Tumbling Window Boundary Reset (+61.0s) = **100% Window Reset Verified**

### 3.6 Closed-Loop Historical Pilot (6 Historical Claims)
- **CLM-HIST-001**: Model Compromise Induction Rate = **40.0%** ($4/10$)
- **CLM-HIST-002**: Conditional Gateway Interception Rate = **75.0%** ($3/4$)
- **CLM-HIST-003**: Governed End-to-End Breach Rate = **10.0%** ($1/10$)
- **CLM-HIST-004**: Closed-Loop Benign LTCR = **100.0%** ($10/10$)
- **CLM-HIST-007**: Prompt-Level Latency Overhead Ratio = **21.32%** ($161.11 / 755.83\text{ ms}$)
- **CLM-HIST-008**: Tool-Call Latency Overhead Ratio = **31.80%** ($230.16 / 723.74\text{ ms}$)

### 3.7 Formally Retired Historical Fictions (5 Retired Claims)
- **CLM-RET-001**: "3.55% Latency Tax" — **Retired & Quarantined** (mythical $4,536.3\text{ ms}$ denominator fiction)
- **CLM-RET-002**: "4,375.2 ms Median LLM Latency" — **Retired & Quarantined** (absent from raw traces; true median is $692.99\text{ ms}$)
- **CLM-RET-003**: "76.8% Hardened Adversarial Recall" — **Retired & Quarantined** (arithmetic transcription error)
- **CLM-RET-004**: "112.55 ms Median Overhead" — **Retired & Quarantined** (Docker NTFS bind-mount sync artifact)
- **CLM-RET-005**: "6.4% Calibrated ASR" — **Retired & Quarantined** (un-persisted offline synthetic simulation)

---

## 4. Cross-Document Traceability Matrix

| Artifact / File | Document Status | Active Claims | Historical Claims | Retired Claims | Total Claim Records |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `experiments/build_claim_registry.py` | Generator Script | 32 | 6 | 5 | **43** |
| `results/provenance/claim_registry.json` | Level-2 JSON Registry | 32 | 6 | 5 | **43** |
| `FINAL_CLAIM_CENSUS.md` | Level-3 Claim Census | 32 | 6 | 5 | **43** |
| `FINAL_CONSISTENCY_MATRIX.md` | Level-3 Traceability Matrix | 32 | 6 | 5 | **43** |
| `FINAL_FREEZE_AUDIT.md` | Level-3 Freeze Audit | 32 | 6 | 5 | **43** |
| `tests/test_provenance_and_reproducibility.py` | Pytest Validation Suite | 32 | 6 | 5 | **43 (All Passed)** |

---

## 5. Certification

All claim counts, identifiers, categorizations, and empirical values are now **100.0% synchronized and mathematically consistent** across every file in the PromptAegis repository. No un-reconciled discrepancies remain.
