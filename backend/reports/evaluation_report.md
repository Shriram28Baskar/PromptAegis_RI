# Aegis — Evaluation Report (Feasibility / False-Positive Rate / Latency)

> **NOTE: generated with `--fast`/`--sample-size`** -- the semantic index and stress-test sample were capped for a quick smoke test. Re-run without that flag before citing these numbers anywhere (paper, PRD, pitch).

Generated from `models/threshold.json`, `reports/latency_table.csv`, and a live run of the benign + benign-trigger-word stress test. All numbers below come from held-out data the classifier was never trained or indexed on (see `models/train.py`'s leakage-safe split).

## 1. Feasibility

- Classifier reaches **precision 0.900** / **recall 0.924** on the held-out test split at the auto-calibrated threshold (`class_weight=balanced`).
- Recall by attack category: harmful_content_request=0.440, prompt_injection=0.968.
- The full pipeline (rule engine -> SBERT semantic layer -> classifier -> drift tracker -> severity gate -> sanitize/pass/block) runs end to end on real data pulled from public sources (Stanford Alpaca for benign traffic, JBB-Behaviors / HackAPrompt-derived corpora for attacks), not only hand-written placeholder examples.
- This demonstrates feasibility as: (a) the architecture is implementable and measurable end to end, and (b) it generalizes to held-out real prompts rather than only the examples it was tuned on.

## 2. False-Positive Rate

- General benign set: 0/500 flagged (**FP rate 0.00%**).
- Benign trigger-word set (contains words like "ignore", "system", "secret" in ordinary sentences — the over-defense stress test): 0/50 flagged (**FP rate 0.00%**).
- Overall FP rate: **0.00%**.
- Why this is low: a lone rule/keyword match can never reach HIGH/block by itself (`core/severity.py`'s agreement gate requires the rule match to be corroborated by both elevated embedding similarity and classifier probability); the classifier's own decision threshold is chosen to keep precision >= 0.90 (`models/train.py::_select_threshold`) rather than maximizing recall unconditionally.

## 3. Latency

- Average end-to-end detection time: **19.82 ms**.
- P50: 19.79 ms, P95: 25.38 ms.
- Throughput: 50.44 requests/sec (single process, 250 requests).
- This is the full gateway decision (rules + SBERT embedding + classifier + drift + severity), measured *before* any call to the downstream LLM — the LLM call only happens after the gateway has already decided pass/sanitize/block, so gateway latency is additive but small relative to typical LLM response times (hundreds of ms to seconds).
