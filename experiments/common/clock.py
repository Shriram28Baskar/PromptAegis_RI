"""
Clock integration for the experiment framework.
Re-exports clock abstractions from backend/governance/clock.py.
"""
import os
import sys

# Ensure backend path
from experiments.common.config import BACKEND_DIR
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from governance.clock import (
    BaseClock,
    ProductionRuntimeClock,
    ResearchExperimentClock,
    get_clock,
    set_clock,
    reset_to_production_clock,
)

__all__ = [
    "BaseClock",
    "ProductionRuntimeClock",
    "ResearchExperimentClock",
    "get_clock",
    "set_clock",
    "reset_to_production_clock",
]
