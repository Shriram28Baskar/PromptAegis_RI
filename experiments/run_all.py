"""
PromptAegis Master Reproducibility Orchestrator.
Executes the complete end-to-end research experimental pipeline deterministically from scratch:
1. Initialize research database schema and default seeds
2. Phase 1: Canonical Controlled Benchmark (Baseline, RBAC-Only, Policy-Only, Full Normalized, Full Burst, Hardened)
3. Phase 2: Canonical Statistical Analysis (McNemar, Wilcoxon, Bootstrap CIs)
4. Phase 3: Calibrated Gateway Evaluation (scoped parameter policies)
5. Phase 4: Adversarial Robustness Benchmark (Mechanism-Isolated Policy + Compound Burst)
6. Phase 5: Closed-Loop Trace Re-Evaluation (Groq Cloud API live trace analysis)
7. Phase 6: Dedicated Rate-Limiter Stress Benchmark (Threshold saturation & window reset)
8. Build Machine-Readable Claim Registry (claim_registry.json)
9. Regenerate Publication Figures (data-driven PNGs)
10. Automated Provenance & Integrity Validation Suite

Usage:
    python experiments/run_all.py
"""
import os
import sys
import time
import subprocess

# Ensure project root in path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from experiments.common.runner import ensure_initialized
from experiments.phase1_baseline import run_phase1
from experiments.phase2_statistics import run_phase2
from experiments.phase3_calibrated import run_phase3
from experiments.phase4_adversarial import run_phase4
from experiments.phase5_closed_loop import run_phase5
from experiments.phase6_rate_limit_stress import run_rate_limit_stress


def main():
    t_start = time.time()
    print("=" * 72)
    print("  PROMPTAEGIS: MASTER RESEARCH REPRODUCIBILITY ORCHESTRATOR")
    print("=" * 72)
    print(f"Project Root: {PROJECT_ROOT}")
    print(f"Timestamp:    {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}\n")

    # Step 1: Initialize research environment & database
    print(">>> [1/10] Initializing database schema and seeds...")
    ensure_initialized()

    # Step 2: Phase 1 Canonical Controlled Benchmark
    print("\n>>> [2/10] Executing Phase 1 Canonical Benchmark (N=600)...")
    run_phase1()

    # Step 3: Phase 3 Calibrated Gateway Evaluation
    print("\n>>> [3/10] Executing Phase 3 Calibrated Evaluation (N=600)...")
    run_phase3()

    # Step 4: Phase 4 Adversarial Robustness Benchmark
    print("\n>>> [4/10] Executing Phase 4 Adversarial Robustness (N=500)...")
    run_phase4()

    # Step 5: Phase 5 Closed-Loop LLM Trace Analysis
    print("\n>>> [5/10] Executing Phase 5 Closed-Loop Agent Trace Analysis (N=20)...")
    run_phase5()

    # Step 6: Phase 6 Rate-Limiting Stress Benchmark
    print("\n>>> [6/10] Executing Phase 6 Rate-Limiting Stress Benchmark...")
    run_rate_limit_stress()

    # Step 7: Phase 2 Statistical Analysis
    print("\n>>> [7/10] Executing Phase 2 Statistical Analysis & Bootstrap CIs...")
    run_phase2()

    # Step 8: Build Claim Registry
    print("\n>>> [8/10] Building Machine-Readable Claim Registry...")
    from experiments.build_claim_registry import build_registry
    build_registry()

    # Step 9: Regenerate Data-Driven Figures
    print("\n>>> [9/10] Generating Data-Driven Research Figures...")
    from backend.scripts.generate_governance_figures import main as generate_figures
    generate_figures()

    # Step 10: Run Provenance & Integrity Test Suite
    print("\n>>> [10/10] Running Automated Integrity & Provenance Verification Suite...")
    res = subprocess.run([sys.executable, "-m", "pytest", "tests/test_provenance_and_reproducibility.py", "-v"], cwd=PROJECT_ROOT)
    if res.returncode != 0:
        print("\n[WARNING] Test suite reported warnings or failures.")
    else:
        print("\n[PASS] All provenance and reproducibility tests passed successfully.")

    elapsed = time.time() - t_start
    print("\n" + "=" * 72)
    print(f"  [COMPLETE] Full Reproducibility Pipeline Executed in {elapsed:.2f}s")
    print("=" * 72)


if __name__ == "__main__":
    main()
