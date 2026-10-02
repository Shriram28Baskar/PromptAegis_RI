"""
Deterministic Clock Abstraction for PromptAegis.

Provides:
- ProductionRuntimeClock: Live system wall-clock (time.time(), time.perf_counter())
- ResearchExperimentClock: Deterministic virtual time advancement for repeatable evaluation
"""
from abc import ABC, abstractmethod
import time
from typing import Optional


class BaseClock(ABC):
    @abstractmethod
    def time(self) -> float:
        """Return current timestamp in seconds."""
        pass

    @abstractmethod
    def perf_counter(self) -> float:
        """Return high-resolution counter in seconds."""
        pass

    @abstractmethod
    def reset(self) -> None:
        """Reset clock state if applicable."""
        pass


class ProductionRuntimeClock(BaseClock):
    """Production runtime clock utilizing live system wall-clock and high-resolution timer."""
    def time(self) -> float:
        return time.time()

    def perf_counter(self) -> float:
        return time.perf_counter()

    def reset(self) -> None:
        pass


class ResearchExperimentClock(BaseClock):
    """
    Deterministic research experiment clock.
    Provides controllable virtual time so that benchmarks run deterministically
    regardless of wall-clock start time or CPU scheduling delays.
    """
    def __init__(self, start_time: float = 1790000000.0, step_seconds: float = 0.05):
        self.initial_time = float(start_time)
        self.current_time = float(start_time)
        self.step_seconds = float(step_seconds)

    def time(self) -> float:
        return self.current_time

    def perf_counter(self) -> float:
        # Measures real elapsed time for latency benchmarking
        return time.perf_counter()

    def advance(self, seconds: float) -> float:
        """Explicitly advance virtual time by given seconds."""
        self.current_time += float(seconds)
        return self.current_time

    def step(self) -> float:
        """Advance virtual time by the configured step_seconds."""
        return self.advance(self.step_seconds)

    def set_time(self, ts: float) -> None:
        """Set virtual time to a specific timestamp."""
        self.current_time = float(ts)

    def reset(self, start_time: Optional[float] = None) -> None:
        """Reset virtual time to initial or specified timestamp."""
        if start_time is not None:
            self.initial_time = float(start_time)
        self.current_time = self.initial_time


# Module-level active clock (defaults to ProductionRuntimeClock)
_ACTIVE_CLOCK: BaseClock = ProductionRuntimeClock()


def get_clock() -> BaseClock:
    """Return the currently active clock."""
    global _ACTIVE_CLOCK
    return _ACTIVE_CLOCK


def set_clock(clock: BaseClock) -> None:
    """Set the active clock."""
    global _ACTIVE_CLOCK
    _ACTIVE_CLOCK = clock


def reset_to_production_clock() -> None:
    """Restore the default production runtime clock."""
    global _ACTIVE_CLOCK
    _ACTIVE_CLOCK = ProductionRuntimeClock()
