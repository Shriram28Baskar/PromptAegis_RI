# PromptAegis Research & Audit Archive

This archive contains historical audit dossiers, intermediate reproducibility baselines, and pre-freeze verification records generated during PromptAegis engineering and scientific qualification milestones.

All canonical empirical results are frozen at commit `f16fae2cffece5b032e47bb7dfc52220c2eae1fc`.

---

## Structure

### 1. `audits/`
Independent hostile reproducibility audits and author remediation recommendations:
- `AUDIT_REPORT.md`: Initial independent reproducibility audit (v1).
- `AUDIT_REPORT_v2.md`: Second-pass reconciliation audit report (v2).
- `AUDIT_REPORT_v3.md`: Comprehensive independent reproducibility audit report (v3).
- `FINDINGS_FOR_AUTHOR.md`: Author-facing findings and remediation directives from v3 audit.

### 2. `reproducibility/`
Milestone reproducibility dossiers documenting experimental outcomes before and after code remediation:
- `BEFORE_REFACTOR_REPRODUCIBILITY_REPORT.md`: Baseline reproducibility record at commit `e12a06a`.
- `POST_REMEDIATION_REPRODUCIBILITY_REPORT.md`: Verification of calibrated gateway and parameter policies.
- `FINAL_REPRODUCIBILITY_AUDIT.md`: End-to-end reproducibility certification dossier.
- `UPDATED_FINAL_REPRODUCIBILITY_AUDIT.md`: Post-refactor updated arbitration report.

### 3. `pre_freeze/`
Audit baselines and qualification gates preceding the final repository freeze:
- `POST_REFACTOR_AUDIT_BASELINE.md`: Audit baseline freeze report.
- `FINAL_PRE_SYNC_FREEZE.md`: Pre-synchronization state and hash verification ledger.
- `FINAL_FREEZE_AUDIT.md`: Synchronization and read-only freeze verification report.
- `FINAL_RELEASE_GATE_REPORT.md`: Release gate certification and milestone sign-off.

### 4. `historical/`
Supplementary historical assets and claim reconciliations:
- `AEGIS_TEST_PROMPTS.md`: Historical manual test prompt catalog and curl verification scripts.
- `FINAL_CLAIM_COUNT_RECONCILIATION.md`: Historical reconciliation of claim counts across qualification milestones.

---

## Active Root Research Reports

The authoritative active research documentation remains located at the project root:
- `README.md`: Master project guide, quick start, architecture, and verification instructions.
- `MECHANISM_ISOLATION_REPORT.md`: Mechanism isolation ablation study (RBAC, Policy, Rate Limiter).
- `ADVERSARIAL_NORMALIZATION_REPORT.md`: Adversarial evaluation and Base64 normalization trade-off.
- `RATE_LIMIT_STRESS_REPORT.md`: Volumetric fixed-window rate limiter saturation evaluation.
- `FINAL_CLAIM_CENSUS.md`: Authoritative census of all 43 research claims.
- `FINAL_CONSISTENCY_MATRIX.md`: End-to-end multi-artifact consistency matrix.
- `FINAL_GIT_CLEAN_CLONE_REPRODUCTION.md`: Clean-clone execution and verification protocol.
- `LATENCY_PROVENANCE_NOTE.md`: Latency provenance documentation across benchmark executions.
