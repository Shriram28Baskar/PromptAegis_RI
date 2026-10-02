# PromptAegis — Final Pre-Synchronization State Freeze

**Author**: Final Scientific Synchronization Engineer & Read-Only Freeze Auditor  
**Date**: October 2, 2026  
**Audited Git Commit**: `e12a06ad8062518dbe7c67dbee6988298ae5597d`  
**Python Runtime**: `3.11.3 (tags/v3.11.3:f3909b8, Apr 4 2023, 23:49:59) [MSC v.1934 64 bit (AMD64)]`  
**Platform**: Windows 11 AMD64  
**Preservation Directory**: [`results/historical/final_pre_sync_freeze/`](file:///c:/Users/Saish/OneDrive/Documents/PromptAegis_RI/PromptAegis/results/historical/final_pre_sync_freeze/)

---

## 1. Objective & Freeze Scope

This document establishes an immutable pre-synchronization evidence boundary prior to executing the repository-wide synchronization and read-only freeze audit. All experimental artifacts, generated figures, claim registries, and technical reports representing the state immediately following the defect remediation cycle are archived here.

---

## 2. Environment & Dependency State

- **Python**: 3.11.3
- **Pytest**: 8.3.3
- **FastAPI**: 0.115.0
- **Uvicorn**: 0.30.6
- **Matplotlib**: 3.9.2
- **NumPy**: 2.1.1
- **Pydantic**: 2.9.2
- **SQLite**: 3.40.1 (in-process)

---

## 3. Cryptographic Hashes of Pre-Sync Artifacts (SHA-256)

### 3.1 Technical Reports & Documentation
| File Path | SHA-256 Checksum |
| :--- | :--- |
| `README.md` | `d29648d652446b1a360edc91a0ae57f2592d73c5d56c950a124f2157daf734df` |
| `UPDATED_FINAL_REPRODUCIBILITY_AUDIT.md` | `125aa1884435f1aac9aa4d5b9777e462d5454edb05803fad462a1aec0b6e0980` |
| `POST_REMEDIATION_REPRODUCIBILITY_REPORT.md` | `d68cb3a069ddc5842cdb1b02f4045d5ca748267ed11eec5617fb3407918a216a` |
| `RATE_LIMIT_STRESS_REPORT.md` | `93933be9310ef89807a1f25152eab62b7717e9166794cc94ac8394f2c79174e2` |
| `ADVERSARIAL_NORMALIZATION_REPORT.md` | `c44d14e8bd61fbe779ca684df61697f2daefb56657b620d04cbf462049b222b0` |
| `MECHANISM_ISOLATION_REPORT.md` | `3117e2116d7538f50a6d5e6065768df808784e2263e7b1b6be3288aacb84b006` |
| `results/provenance/claim_registry.json` | `e18ea2b94ba1e37044fb24902a65c984df15a80fb0d11e241eb4fa3e88fb0c4e` |

### 3.2 Raw Experimental Event Streams
| File Path | SHA-256 Checksum |
| :--- | :--- |
| `results/raw/canonical_benchmark_events.json` | `78eb1eb3060b382880504e35d15a02065369a30c3f34a0b4b92f3218e882fbe8` |
| `results/raw/canonical_benchmark_summary.json` | `e56c44fdd62a26a910912fa23927e06abe0a2ffeeee7159058196be0de654953` |
| `results/raw/calibrated_benchmark_events.json` | `b69583cb57ee6b54ff96cd5abedf2a0546160dc5c7100b48ac4a0f9de9e9f922` |
| `results/raw/adversarial_events.json` | `ae2d84edeef2853dc1b5864ed1789e22b0049def8647b2fe22de0cfc252aa88d` |
| `results/raw/rate_limit_stress_events.json` | `537ae65c23de9dc5a2ce1242269cc1b1ec3db56e1b308916eb078ce57f1e4f84` |

### 3.3 Derived Metric & Statistical Artifacts
| File Path | SHA-256 Checksum |
| :--- | :--- |
| `results/derived/benchmark_metrics.json` | `3cf1fdbba2e010a308f1d32a7a6d0f98cdc7bc1531a0fa4b7de659e720fd0659` |
| `results/derived/calibrated_metrics.json` | `82cfcf7e8aca7e2f33aa1e93c782ab4455b3475765aa0d70dc1813873777c876` |
| `results/derived/adversarial_metrics.json` | `2ac90a3763f78cd76add5fd4c78ce28db5c1cf82bcadb95a42b5e0f4c2a92ce6` |
| `results/derived/adversarial_metrics.csv` | `5b483b3a32ca815e0eea0168549b614de855ea9021ce555638be8fd8852c1216` |
| `results/derived/closed_loop_metrics.json` | `995a199bb49ce0214cc62031f2d10ec6c6d5a2ca8bbbd88ca2a89fa079f4153c` |
| `results/derived/rate_limit_stress_metrics.json` | `2896d7fa959de5a9af8d53c2c87ed82491b25cad7edc3aae92a40ee7e077c43c` |
| `results/statistical/mcnemar_tests.json` | `05c036aeffdbf3ac8576a77f0815b23681bc4418d30ae7318951f8877ca25ece` |
| `results/statistical/latency_analysis.json` | `3eafe8ddce54f38f1edfa6b70c2d1d8d5bfc16f01356b3d255ab88655c726f58` |
| `results/statistical/bootstrap_confidence_intervals.json` | `557e158aad5fda733d635a1f20a6624738ac4275656eeb6d9d8ac8eaeb39533a` |

### 3.4 Data-Driven Publication Figures
| File Path | SHA-256 Checksum |
| :--- | :--- |
| `backend/reports/figures/governance_asr_ablation.png` | `6d2addb7897627fde52256dc1a5ed3f1bdd41b0ed1d1d383767d32d2aaed431e` |
| `backend/reports/figures/governance_latency_distribution.png` | `dbb6da70babc3993c45e5a2824a656211f2196d358be89fabc3f916cf4343b46` |
| `backend/reports/figures/adversarial_robustness_comparison.png` | `99a0ed00d033f2524a14b951cfc18d079c29eac95bc1a5dcc5628455ae8d6a07` |
| `backend/reports/figures/closed_loop_agent_funnel.png` | `d5bc9640252ab00d7271a6e550373564ee8eb008e5b8e15f1b2a3a91a6fda9a0` |
| `backend/reports/figures/threat_category_defense.png` | `06e7d6c65f9ef669a074438ac0409ae4ad3668b3e5502c7afd52db2497c3efb2` |

---

## 4. Certification of Archive Preservation

All files listed above have been copied into `results/historical/final_pre_sync_freeze/` and verified identical against their recorded checksums.
