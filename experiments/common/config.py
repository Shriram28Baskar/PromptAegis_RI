"""
Configuration paths and constants for the PromptAegis experiment framework.
"""
import os
import sys

# Ensure backend is in python search path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
EXPERIMENTS_DIR = os.path.dirname(CURRENT_DIR)
PROJECT_ROOT = os.path.dirname(EXPERIMENTS_DIR)
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

BENCHMARK_DIR = os.path.join(BACKEND_DIR, "data", "benchmark")
RESULTS_DIR = os.path.join(PROJECT_ROOT, "results")
RAW_DIR = os.path.join(RESULTS_DIR, "raw")
DERIVED_DIR = os.path.join(RESULTS_DIR, "derived")
STATISTICAL_DIR = os.path.join(RESULTS_DIR, "statistical")
PROVENANCE_DIR = os.path.join(RESULTS_DIR, "provenance")
HISTORICAL_DIR = os.path.join(RESULTS_DIR, "historical")
FIGURES_DIR = os.path.join(BACKEND_DIR, "reports", "figures")

# Ensure required directories exist
for d in [RAW_DIR, DERIVED_DIR, STATISTICAL_DIR, PROVENANCE_DIR, HISTORICAL_DIR, FIGURES_DIR]:
    os.makedirs(d, exist_ok=True)

AUDITED_COMMIT = "e12a06ad8062518dbe7c67dbee6988298ae5597d"
EXPERIMENT_VERSION = "2.1.0-canonical"

CANONICAL_CONFIGURATIONS = [
    "baseline",
    "rbac_only",
    "policy_only",
    "full_normalized",
    "full_burst",
    "hardened",
]
CANONICAL_BENCHMARK_FILES = [
    "excessive_calls.json",
    "legitimate.json",
    "parameter_manipulation.json",
    "privilege_escalation.json",
    "prompt_injection.json",
    "unauthorized_tool.json",
]
