# POST-REFACTOR AUDIT BASELINE FREEZE
**Audit Role:** Independent Hostile Scientific Auditor  
**Date/Timestamp:** 2026-10-02T08:34:00Z  
**Target Repository:** `https://github.com/Shriram28Baskar/PromptAegis_RI`  
**Base Commit Hash:** `e12a06ad8062518dbe7c67dbee6988298ae5597d`  
**Objective:** Freeze the exact post-refactor repository state prior to independent hostile evaluation.

---

## 1. Git Repository State

- **Branch:** `main` (tracking `origin/main`)
- **Base Commit:** `e12a06ad8062518dbe7c67dbee6988298ae5597d`
- **Git Status Output:**
```
Changes not staged for commit:
  modified:   README.md
  modified:   backend/api/experiments.py
  modified:   backend/governance/interceptor.py
  modified:   backend/governance/policy_engine.py
  modified:   backend/governance/rate_limiter.py
  modified:   backend/reports/figures/adversarial_robustness_comparison.png
  modified:   backend/reports/figures/closed_loop_agent_funnel.png
  modified:   backend/reports/figures/governance_asr_ablation.png
  modified:   backend/reports/figures/governance_latency_distribution.png
  modified:   backend/reports/figures/threat_category_defense.png
  modified:   backend/scripts/generate_governance_figures.py

Untracked files:
  AUDIT_REPORT.md
  AUDIT_REPORT_v2.md
  AUDIT_REPORT_v3.md
  BEFORE_REFACTOR_REPRODUCIBILITY_REPORT.md
  FINAL_REPRODUCIBILITY_AUDIT.md
  FINDINGS_FOR_AUTHOR.md
  backend/governance/clock.py
  experiments/
  results/
  tests/
  tmp/
```

---

## 2. Frozen File Census & SHA256 Hashes

| File Path | Size (Bytes) | SHA256 Hash |
|---|---|---|
| `README.md` | 44,806 | `5adb373b1af5214ac0fc8eeedcfc5df8c7145fb3f44c93f14b9e5ee10f4889cf` |
| `FINAL_REPRODUCIBILITY_AUDIT.md` | 34,581 | `04b61918d4db43e8ce9562bad502e6f208f5782ba544da4e1e6973bafbb20ed6` |
| `BEFORE_REFACTOR_REPRODUCIBILITY_REPORT.md` | 12,928 | `5dbaca2970d99b1e1a38e663cf8a4cbac24018e5262009b48c058327e5e977cf` |
| `backend/governance/clock.py` | 2,958 | `0428499f64cff0beae1d2fcf5647df3ca90ef69c3f81a978c4691bbb5a315457` |
| `backend/governance/rate_limiter.py` | 2,139 | `09ea13da0ecd8ab3df1cd3fa508b392afed547804b197db9b5a80cf69e67a5b8` |
| `backend/governance/policy_engine.py` | 5,614 | `a2541fe98ad610c28150748e1e88ea32c34e635be4a1421afbdcab358be1eb0a` |
| `backend/governance/interceptor.py` | 8,221 | `e4bbeb2373b2e0fa22fd81c40481c251ace13f825d300aa962d9a5dcb3a19dd5` |
| `backend/api/experiments.py` | 9,733 | `b3f6dc1821473041c3ab85cadc091f0791681612bdb40b77dc2b0c9e11c79f19` |
| `backend/scripts/generate_governance_figures.py` | 17,773 | `f1ded50a9a60c8f053069fe84b0d82a3737337ca7088e1bf97a4864b051ff608` |
| `backend/reports/figures/adversarial_robustness_comparison.png` | 200,209 | `0060affbad1e5594e911ea7a8b72a420ddc11f081a1d3ba34b81618119f05fd1` |
| `backend/reports/figures/closed_loop_agent_funnel.png` | 274,260 | `d5bc9640252ab00d7271a6e550373564ee8eb008e5b8e15f1b2a3a91a6fda9a0` |
| `backend/reports/figures/governance_asr_ablation.png` | 227,543 | `cdf3eb327e156e6faa85b2f3b90fabd674e7e3a2a86f18de582e0f3179901ba2` |
| `backend/reports/figures/governance_latency_distribution.png` | 195,937 | `cc0244b0ac28676a738abaecb2eefe480606c6606e79318ab3f67261bd8ef204` |
| `backend/reports/figures/threat_category_defense.png` | 199,492 | `da047a1e0689fc33b37b0e40f9b577c2ba5f40d4f5ab0bcbf6eb1c07d2b573fc` |
| `results/provenance/claim_registry.json` | 18,874 | `3dc67ff6d2bc0b2d399e83b87d902a22cec189d862a81625455e5bc3ffccd474` |
| `results/raw/canonical_benchmark_events.json` | 2,684,373 | `097d53c47b6dd72d5c64b9ee268106c5e67d443b88058304ff6a4a33c5b151fd` |
| `results/raw/canonical_benchmark_summary.json` | 12,950 | `1d0e8e52a3682f74473dd991694817520b2a5226378afcb5bd7bdffddba2ec2f` |
| `results/raw/canonical_benchmark_events.csv` | 678,857 | `b026a6b2d01d761786c823ccb410ebf69575aeae2d27a4f7384f9ef0c7ded217` |
| `results/raw/calibrated_benchmark_events.json` | 260,820 | `ff09279cbc579bbfa408dade220d10111ef541c482b8e27259cdd77780c0f0d6` |
| `results/raw/adversarial_events.json` | 392,397 | `d0298634d8156d4e09628b0ace5c5f1fe84b0cc79030ef58c4a35b4bd4e5300b` |
| `results/derived/benchmark_metrics.json` | 18,053 | `ad677e0662f2cc766ce501fe185126afa6f21f1f032ba2700cef32594232a93e` |
| `results/derived/calibrated_metrics.json` | 2,212 | `5791ad83e95c29891c26e06eeea0f10d8872f7ab2bc5b47fc5c9c68ca59b5662` |
| `results/derived/adversarial_metrics.json` | 1,921 | `33fb9979c3021c67d04407465d4dfffcea31df61c9bc1847f944da54d0cb6fc7` |
| `results/derived/adversarial_metrics.csv` | 418 | `71e6db8c008dd5bd447525654a7bb80a59c81beeca7b673ece7642602d8d9b38` |
| `results/derived/closed_loop_metrics.json` | 1,193 | `995a199bb49ce0214cc62031f2d10ec6c6d5a2ca8bbbd88ca2a89fa079f4153c` |
| `results/statistical/mcnemar_tests.json` | 1,320 | `d5329ac1d19c4aafa5516b38f49393099e9ba65f683c16aca3d34473598e64eb` |
| `results/statistical/mcnemar_tests.csv` | 551 | `ffdd4de93d1f876ab80034408253dbab682d2aa589b09313de6d539ba347c6d0` |
| `results/statistical/latency_analysis.json` | 1,555 | `742111903e1c935169834185f34b37eb178bbdbf08ba89e18f797415362f9819` |
| `results/statistical/latency_analysis.csv` | 480 | `c45a5b501b89e3392aeea39e48d1fe07ca02fe75cd8918267177733c29d7defc` |
| `results/statistical/bootstrap_confidence_intervals.json` | 818 | `bbcced64d498c81327288916b1f550639b781d39bca608aac57ce327e9ff87a4` |
| `results/statistical/bootstrap_confidence_intervals.csv` | 263 | `c579f5ef27c8ddd24cb27a2134e95d820d7893328b7cba7565cb87b4f2bafa37` |
| `experiments/common/config.py` | 1,427 | `606856962ffab156a61d77d78c614f3363430c4402ef7e506e8107f6304b181d` |
| `experiments/common/clock.py` | 609 | `9000f30a2b34f8c3aa029c78cb8a6fb16658c8701f1f887cc4d80405137badc6` |
| `experiments/common/runner.py` | 8,884 | `192c12cb85647dc102de8904f5efa9c1dba8f0ef0a12e2b9c328090adb9fc38e` |
| `experiments/common/metrics.py` | 4,110 | `b990e978e60b6dd27a0f0a3d4fb1fb414e600ca19305b0c326f70c61fa39d734` |
| `experiments/common/provenance.py` | 2,990 | `d2ac64577aa3725a7d944fe40cdc0a3f84e81331fda128a92ef72ec4ca056cb3` |
| `experiments/phase1_baseline.py` | 2,829 | `ccd3558b3b56f70aafe1c7ca54a3beea94e22f9c86c0fdbf04549460fa828c33` |
| `experiments/phase2_statistics.py` | 12,295 | `220144ef0fc9c6296191808c8295170125b649ccc3e720be36dfe7dabef469ef` |
| `experiments/phase3_calibrated.py` | 6,598 | `abb7a5deb995aac439c9d856fd3f321afbc9787cca6d7f03046f2ce26cd7ab96` |
| `experiments/phase4_adversarial.py` | 8,350 | `7eb1994886d08b070ee9841d8a99972f44d457a3e37b81f9dc34ed392a022ea1` |
| `experiments/phase5_closed_loop.py` | 7,355 | `6cdae9d747c33eef67a710a3545d1cf04416c38df07b5a8736ebc01521e3e39b` |
| `experiments/build_claim_registry.py` | 21,183 | `dbbc4a4c1444a5f02d6fdcacab37c8d088145f39de9785a55eb7fcf4e482b635` |
| `tests/test_provenance_and_reproducibility.py` | 7,458 | `c50052bf4aa7b2953c6b1a2f50048ad6a6af19c6022a11a4f94289b28bc9b757` |

*Auditor Finding on Inventory:* `experiments/run_all.py` was claimed in `README.md` and `FINAL_REPRODUCIBILITY_AUDIT.md` as the master reproduction entry point, but is **MISSING** from disk.

---

## 3. Hostile Environment Inventory

- **Python Version:** 3.11.3 (tags/v3.11.3:f3909b8, Apr 5 2023, 17:04:26) [MSC v.1934 64 bit (AMD64)]
- **OS Platform:** Windows 11 Enterprise (Build 26100)
- **Key Scientific Libraries:**
  - `numpy`: 1.26.4
  - `scipy`: 1.13.1
  - `pandas`: 2.2.2
  - `matplotlib`: 3.9.0
  - `pytest`: 8.3.3
  - `fastapi`: 0.111.0
  - `pydantic`: 2.9.2
  - `starlette`: 0.37.2
  - `sqlite3`: 2.6.0 (SQLite core 3.40.1)

---

## 4. Initial Test Suite Execution

Execution of `pytest tests/test_provenance_and_reproducibility.py`:
- Collected: 5 items
- Passed: 5 items in 2.46s
- Result: **PASS** (Tests pass, but hostile audit will inspect whether test assertions are tautological or genuinely rigorous).
