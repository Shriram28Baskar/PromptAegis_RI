"""
Claim registry and provenance management for PromptAegis.
Ensures every publication-facing claim has an unbroken provenance chain
linking it to committed experiment code and raw/derived artifacts.
"""
import json
import os
from typing import Any, Dict, List, Optional

from experiments.common.config import AUDITED_COMMIT, PROVENANCE_DIR, PROJECT_ROOT


CLAIM_REGISTRY_PATH = os.path.join(PROVENANCE_DIR, "claim_registry.json")

VALID_STATUSES = {
    "CURRENT-PRODUCTION",
    "CURRENT-DERIVED",
    "HISTORICAL",
    "OFFLINE",
    "SIMULATED",
    "RETIRED",
}

VALID_MEASUREMENT_TYPES = {
    "MEASURED",
    "DERIVED",
    "SIMULATED",
}


def load_claim_registry() -> Dict[str, Any]:
    """Load existing claim registry or initialize a new one."""
    if os.path.exists(CLAIM_REGISTRY_PATH):
        with open(CLAIM_REGISTRY_PATH, "r", encoding="utf-8") as fp:
            return json.load(fp)
    return {
        "registry_version": "2.0.0",
        "commit": AUDITED_COMMIT,
        "claims": []
    }


def save_claim_registry(registry: Dict[str, Any]) -> None:
    """Save the claim registry to disk formatted with indent."""
    with open(CLAIM_REGISTRY_PATH, "w", encoding="utf-8") as fp:
        json.dump(registry, fp, indent=2)


def register_claim(
    claim_id: str,
    metric: str,
    value: Any,
    unit: str,
    population: str,
    configuration: str,
    dataset: str,
    raw_artifact: str,
    derived_artifact: str,
    experiment_script: str,
    status: str,
    production_runtime: bool,
    measurement_type: str,
    notes: str = "",
) -> Dict[str, Any]:
    """
    Validate and register a publication claim into claim_registry.json.
    """
    if status not in VALID_STATUSES:
        raise ValueError(f"Invalid status '{status}'. Must be one of {VALID_STATUSES}")
    if measurement_type not in VALID_MEASUREMENT_TYPES:
        raise ValueError(f"Invalid measurement_type '{measurement_type}'. Must be one of {VALID_MEASUREMENT_TYPES}")

    registry = load_claim_registry()
    claim_entry = {
        "claim_id": claim_id,
        "metric": metric,
        "value": value,
        "unit": unit,
        "population": population,
        "configuration": configuration,
        "dataset": dataset,
        "raw_artifact": raw_artifact,
        "derived_artifact": derived_artifact,
        "experiment_script": experiment_script,
        "commit": AUDITED_COMMIT,
        "status": status,
        "production_runtime": bool(production_runtime),
        "measurement_type": measurement_type,
        "notes": notes,
    }

    # Replace existing claim if already present, or append
    existing_idx = None
    for idx, c in enumerate(registry["claims"]):
        if c["claim_id"] == claim_id:
            existing_idx = idx
            break

    if existing_idx is not None:
        registry["claims"][existing_idx] = claim_entry
    else:
        registry["claims"].append(claim_entry)

    save_claim_registry(registry)
    return claim_entry
