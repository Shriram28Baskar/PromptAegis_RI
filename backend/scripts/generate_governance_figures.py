"""
Generates the publication-grade evaluation figures for PromptAegis 2.0 Tool Governance:
  1. governance_asr_ablation.png         - ASR and LTCR across Baseline, Permission, Policy, Full, and Calibrated with CIs
  2. governance_latency_distribution.png  - P50, P95, P99 latency percentiles and overhead comparison
  3. adversarial_robustness_comparison.png - 500 mutation instances: Standard vs Hardened recall across 5 perturbation classes
  4. closed_loop_agent_funnel.png        - Live Groq LLM pilot: Model deception vs Gateway interception funnel
  5. threat_category_defense.png         - Interception rates across the 5 threat categories (T1-T5)

Outputs are saved in backend/reports/figures/.
"""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "reports", "figures")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Aesthetic palette (clean dark-slate theme for high contrast publication)
BG_COLOR = "#0B0F19"
SURFACE_COLOR = "#151C2C"
BORDER_COLOR = "#2D3748"
TEXT_COLOR = "#F8FAFC"
MUTED_TEXT = "#94A3B8"
GREEN = "#22C55E"
RED = "#EF4444"
BLUE = "#3B82F6"
YELLOW = "#EAB308"
PURPLE = "#A855F7"
CYAN = "#06B6D4"

plt.rcParams.update({
    "font.family": "sans-serif",
    "font.size": 11,
    "figure.facecolor": BG_COLOR,
    "axes.facecolor": SURFACE_COLOR,
    "axes.edgecolor": BORDER_COLOR,
    "axes.labelcolor": TEXT_COLOR,
    "xtick.color": MUTED_TEXT,
    "ytick.color": MUTED_TEXT,
    "text.color": TEXT_COLOR,
    "grid.color": BORDER_COLOR,
    "grid.alpha": 0.4,
})

# -----------------------------------------------------------------------------
# Figure 1: Governance ASR & LTCR Ablation
# -----------------------------------------------------------------------------
def plot_asr_ablation():
    fig, ax1 = plt.subplots(figsize=(10.5, 6.2), dpi=300)
    
    configs = [
        "Baseline\n(Unmitigated)",
        "Permission-Only\n(RBAC)",
        "Policy-Only\n(Regex/Bounds)",
        "Full Governance\n(Controlled)",
        "Calibrated\n(Tuned Rules)"
    ]
    asr = [100.0, 36.0, 28.0, 31.4, 6.4]
    ltcr = [100.0, 80.0, 80.0, 80.0, 100.0]
    
    # 95% Bootstrap Confidence Intervals for ASR (from Level-1 statistical_bootstrap_cis.csv)
    asr_err_lower = [0.0, 36.0 - 31.8, 28.0 - 24.0, 31.4 - 27.4, 6.4 - 4.4]
    asr_err_upper = [0.0, 40.2 - 36.0, 31.8 - 28.0, 35.4 - 31.4, 8.6 - 6.4]
    asr_err = [asr_err_lower, asr_err_upper]
    
    x = np.arange(len(configs))
    width = 0.36
    
    bars1 = ax1.bar(x - width/2, asr, width, yerr=asr_err, capsize=5, color=RED, alpha=0.85, edgecolor="#FCA5A5", label="Attack Success Rate (ASR %)")
    bars2 = ax1.bar(x + width/2, ltcr, width, color=GREEN, alpha=0.85, edgecolor="#86EFAC", label="Legitimate Task Completion (LTCR %)")
    
    ax1.set_ylabel("Rate (%)", fontsize=12, fontweight="bold")
    ax1.set_title("PromptAegis 2.0 — Security & Utility Across Governance Configurations (N = 600)", fontsize=13, fontweight="bold", pad=34)
    ax1.set_xticks(x)
    ax1.set_xticklabels(configs, fontsize=10.5)
    ax1.set_ylim(0, 125)
    ax1.grid(axis="y", linestyle="--", alpha=0.4)
    
    # Value annotations on bars
    for bar in bars1:
        h = bar.get_height()
        offset = 4.5 if h == 6.4 else 3.5
        ax1.text(bar.get_x() + bar.get_width()/2., h + offset, f"{h:.1f}%", ha="center", va="bottom", fontsize=10, fontweight="bold", color="#FCA5A5")
        
    for bar in bars2:
        h = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., h + 3.0, f"{h:.1f}%", ha="center", va="bottom", fontsize=10, fontweight="bold", color="#86EFAC")
        
    # Statistical significance annotation placed in open whitespace above Policy/Full
    callout_text = "McNemar Test: $\\chi^2 = 285.63$, $p \\approx 4.45 \\times 10^{-64}$\nFull Governance eliminates 68.6% of attack executions"
    ax1.text(
        2.0, 105, callout_text,
        ha="center", va="center",
        bbox=dict(boxstyle="round,pad=0.55", facecolor=SURFACE_COLOR, edgecolor=BLUE, lw=1.3),
        fontsize=9.5, fontweight="semibold", color=TEXT_COLOR, zorder=6
    )
    
    # Straight vertical pointer down to Full Governance ASR bar (x = 2.82)
    # Travels strictly through the open gap between Policy LTCR (x <= 2.18) and Full LTCR (x >= 3.00)
    ax1.annotate(
        "", xy=(2.82, 38.5), xytext=(2.82, 98.0),
        arrowprops=dict(facecolor=BLUE, edgecolor=BLUE, arrowstyle="->", lw=1.8),
        zorder=5
    )
    
    # Top-centered horizontal legend avoiding any internal occlusion
    ax1.legend(loc="lower center", bbox_to_anchor=(0.5, 1.01), ncol=2, framealpha=0.9, facecolor=SURFACE_COLOR, edgecolor=BORDER_COLOR, fontsize=10.5)
    
    fig.tight_layout()
    path = os.path.join(OUTPUT_DIR, "governance_asr_ablation.png")
    fig.savefig(path, facecolor=fig.get_facecolor(), edgecolor="none")
    plt.close(fig)
    print(f"Generated: {path}")

# -----------------------------------------------------------------------------
# Figure 2: Governance Latency Distribution (Percentiles)
# -----------------------------------------------------------------------------
def plot_latency_distribution():
    fig, ax = plt.subplots(figsize=(10.5, 5.8), dpi=300)
    
    configs = [
        "Baseline\n(Unmitigated)",
        "Permission-Only\n(RBAC)",
        "Policy-Only\n(Regex/Bounds)",
        "Full Governance\n(Combined)"
    ]
    p50 = [21.38, 57.05, 54.76, 139.72]
    p95 = [34.30, 107.54, 203.70, 257.40]
    p99 = [47.70, 200.53, 307.61, 373.94]
    
    x = np.arange(len(configs))
    width = 0.25
    
    b1 = ax.bar(x - width, p50, width, color=BLUE, alpha=0.85, edgecolor="#93C5FD", label="Median (P50)")
    b2 = ax.bar(x, p95, width, color=YELLOW, alpha=0.85, edgecolor="#FDE047", label="95th Percentile (P95)")
    b3 = ax.bar(x + width, p99, width, color=PURPLE, alpha=0.85, edgecolor="#D8B4FE", label="99th Percentile (P99)")
    
    ax.set_ylabel("Runtime Latency (ms)", fontsize=12, fontweight="bold")
    ax.set_title("Runtime Execution Latency Across Governance Tiers (N = 600 Scenarios)", fontsize=13, fontweight="bold", pad=32)
    ax.set_xticks(x)
    ax.set_xticklabels(configs, fontsize=10.5)
    ax.set_ylim(0, 440)
    ax.grid(axis="y", linestyle="--", alpha=0.4)
    
    # Add values on top of bars
    for bars in [b1, b2, b3]:
        for bar in bars:
            h = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., h + 5, f"{int(h)}ms", ha="center", va="bottom", fontsize=9, color=TEXT_COLOR)
            
    # Paired median callout placed in upper left whitespace with zero legend overlap
    ax.text(
        0.03, 0.74,
        "Paired Median Overhead:\n$\\Delta = +112.55\\text{ ms}$ (vs. Baseline)\nPaired Wilcoxon $W = 811.0$, $p < 10^{-15}$",
        transform=ax.transAxes,
        bbox=dict(boxstyle="round,pad=0.6", facecolor=SURFACE_COLOR, edgecolor=CYAN, lw=1.2),
        fontsize=9.5, color=CYAN
    )
    
    # Top-centered horizontal legend avoiding any collision with callout
    ax.legend(loc="lower center", bbox_to_anchor=(0.5, 1.01), ncol=3, framealpha=0.9, facecolor=SURFACE_COLOR, edgecolor=BORDER_COLOR, fontsize=10)
    
    fig.tight_layout()
    path = os.path.join(OUTPUT_DIR, "governance_latency_distribution.png")
    fig.savefig(path, facecolor=fig.get_facecolor(), edgecolor="none")
    plt.close(fig)
    print(f"Generated: {path}")

# -----------------------------------------------------------------------------
# Figure 3: Adversarial Robustness & Evasion Evaluation
# -----------------------------------------------------------------------------
def plot_adversarial_robustness():
    fig, ax = plt.subplots(figsize=(11.5, 6.0), dpi=300)
    
    categories = [
        "Case Alternation\n(case_alternation)",
        "Comment Fragmentation\n(comment_fragmentation)",
        "Advanced SQL Invariants\n(advanced_sql)",
        "URL Hex Encoding\n(url_encoding)",
        "Base64 Obfuscation\n(base64_obfuscation)",
        "OVERALL AGGREGATE\n(500 Clustered Mutations)"
    ]
    
    standard_recall = [78.0, 78.0, 68.0, 50.0, 0.0, 54.8]
    hardened_recall = [78.0, 78.0, 68.0, 78.0, 28.0, 66.0]
    
    x = np.arange(len(categories))
    width = 0.34
    
    b1 = ax.bar(x - width/2, standard_recall, width, color="#F59E0B", alpha=0.85, edgecolor="#FCD34D", label="Standard Gateway Recall (%)")
    b2 = ax.bar(x + width/2, hardened_recall, width, color=CYAN, alpha=0.85, edgecolor="#67E8F9", label="Hardened Pre-Execution Normalization (%)")
    
    ax.set_ylabel("Detection / Interception Recall (%)", fontsize=12, fontweight="bold")
    ax.set_title("Adversarial Parameter Evasion Robustness (100 Base Seeds × 5 Classes = 500 Clustered Instances)", fontsize=13, fontweight="bold", pad=16)
    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontsize=9.0)
    ax.set_ylim(0, 115)
    ax.set_xlim(-0.6, 5.6)
    ax.grid(axis="y", linestyle="--", alpha=0.4)
    
    # Delta and value annotations
    for i in range(len(categories)):
        std = standard_recall[i]
        hrd = hardened_recall[i]
        ax.text(x[i] - width/2, std + 2, f"{std:.1f}%", ha="center", va="bottom", fontsize=9, color="#FCD34D")
        ax.text(x[i] + width/2, hrd + 2, f"{hrd:.1f}%", ha="center", va="bottom", fontsize=9, color="#67E8F9")
        if hrd > std:
            diff = hrd - std
            y_pos = hrd + 8
            ax.text(x[i] + width/2, y_pos, f"+{diff:.1f}%", ha="center", va="bottom", fontsize=9, fontweight="bold", color=GREEN)
            
    # Perfectly centered Base64 callout box in the open column above Base64 bar (x=4.0) with zero overlap
    base64_box_text = (
        "Base64 Semantic Asymmetry:\n"
        "Standard Regex Recall = 0.0%\n"
        "Raw Base64 safely fails downstream\n"
        "SQL/API parsing unless decoded."
    )
    ax.text(
        4.0, 68, base64_box_text,
        ha="center", va="center",
        bbox=dict(boxstyle="round,pad=0.45", facecolor=SURFACE_COLOR, edgecolor="#F59E0B", lw=1.2),
        fontsize=7.8, color=TEXT_COLOR
    )
    
    ax.legend(loc="upper right", framealpha=0.9, facecolor=SURFACE_COLOR, edgecolor=BORDER_COLOR)
    fig.tight_layout()
    path = os.path.join(OUTPUT_DIR, "adversarial_robustness_comparison.png")
    fig.savefig(path, facecolor=fig.get_facecolor(), edgecolor="none")
    plt.close(fig)
    print(f"Generated: {path}")

# -----------------------------------------------------------------------------
# Figure 4: Closed-Loop Live LLM Agent Experiment Funnel
# -----------------------------------------------------------------------------
def plot_closed_loop_funnel():
    fig, ax = plt.subplots(figsize=(11, 5.8), dpi=300)
    
    stages = [
        "1. Ingested Prompts\n(Adversarial)",
        "2. Model Compromise\n(LLM Tricked into Tool Call)",
        "3. Gateway Interception\n(PromptAegis Policy/RBAC)",
        "4. End-to-End Breach\n(Escaped Confinement)"
    ]
    
    counts = [10, 4, 3, 1]
    rates = ["100% (10/10)", "40.0% Deception (4/10)", "75.0% Interception (3/4)", "10.0% Governed Breach (1/10)"]
    colors = [BLUE, "#F59E0B", GREEN, RED]
    
    y = np.arange(len(stages))[::-1]
    bars = ax.barh(y, counts, height=0.45, color=colors, alpha=0.85, edgecolor=BORDER_COLOR)
    
    ax.set_yticks(y)
    ax.set_yticklabels(stages, fontsize=10.5, fontweight="semibold")
    ax.set_xlabel("Number of Scenarios (N = 10 Adversarial Prompts on Groq gpt-oss-120b)", fontsize=11, fontweight="bold")
    ax.set_title("Closed-Loop Agent Confinement Funnel: From Prompt Injection to Tool Execution", fontsize=13, fontweight="bold", pad=18)
    ax.set_xlim(0, 13.5)
    ax.set_ylim(-0.8, 3.7)
    ax.grid(axis="x", linestyle="--", alpha=0.4)
    
    for i, bar in enumerate(bars):
        w = bar.get_width()
        ax.text(w + 0.25, bar.get_y() + bar.get_height()/2., rates[i], ha="left", va="center", fontsize=10, fontweight="bold", color=TEXT_COLOR)
        
    # Utility annotation positioned in right whitespace with zero collision with Stage 4
    callout_text = (
        "Legitimate Prompt Utility (N = 10 Benign Prompts):\n"
        "• 10/10 (100.0%) Benign Prompts Completed (0.0% FPR)\n"
        "• Mean LLM Generation: 755.8 ms | Gateway Overhead: 161.1 ms\n"
        "  (21.32% of LLM time; 3.55% of 4,536.3 ms e2e transaction)"
    )
    ax.text(
        0.98, 0.40, callout_text,
        transform=ax.transAxes, ha="right", va="center",
        bbox=dict(boxstyle="round,pad=0.55", facecolor=SURFACE_COLOR, edgecolor=GREEN, lw=1.2),
        fontsize=9.0, color=GREEN
    )
    
    fig.tight_layout()
    path = os.path.join(OUTPUT_DIR, "closed_loop_agent_funnel.png")
    fig.savefig(path, facecolor=fig.get_facecolor(), edgecolor="none")
    plt.close(fig)
    print(f"Generated: {path}")

# -----------------------------------------------------------------------------
# Figure 5: Threat Category Defense Matrix (T1–T5)
# -----------------------------------------------------------------------------
def plot_threat_category_defense():
    fig, ax = plt.subplots(figsize=(10.5, 6.0), dpi=300)
    
    threats = [
        "T1: Unauthorized Tool\n(Role Violation)",
        "T2: Privilege Escalation\n(Admin Tool Invocation)",
        "T3: Prompt-Driven Execution\n(Indirect Injection)",
        "T4: Parameter Manipulation\n(SQLi / Path Traversal)",
        "T5: Excessive Calls\n(Resource Exhaustion / DoS)"
    ]
    
    unmitigated = [100.0, 100.0, 100.0, 100.0, 100.0]
    controlled_defense = [100.0, 100.0, 100.0, 43.0, 100.0]
    calibrated_defense = [100.0, 100.0, 100.0, 68.0, 100.0]
    
    y = np.arange(len(threats))[::-1]
    height = 0.25
    
    b1 = ax.barh(y + height, unmitigated, height, color=RED, alpha=0.75, label="Unmitigated ASR (100% Breached)")
    b2 = ax.barh(y, controlled_defense, height, color=BLUE, alpha=0.85, label="Controlled Interception Rate (%)")
    b3 = ax.barh(y - height, calibrated_defense, height, color=GREEN, alpha=0.85, label="Calibrated Interception Rate (%)")
    
    ax.set_yticks(y)
    ax.set_yticklabels(threats, fontsize=9.5)
    ax.set_xlabel("Interception / Protection Rate (%)", fontsize=11, fontweight="bold")
    ax.set_title("Mitigation Effectiveness Across Evaluated Threat Categories (100 Scenarios Each)", fontsize=13, fontweight="bold", pad=34)
    ax.set_xlim(0, 130)
    ax.set_ylim(-0.8, 4.6)
    ax.grid(axis="x", linestyle="--", alpha=0.4)
    
    for i, bar in enumerate(b2):
        w = bar.get_width()
        if i == 0:  # T5
            ax.text(w + 1.5, bar.get_y() + bar.get_height()/2., "100%* (0% Unsat)", ha="left", va="center", fontsize=8.5, color="#93C5FD", fontweight="bold")
        else:
            ax.text(w + 1.5, bar.get_y() + bar.get_height()/2., f"{w:.0f}%", ha="left", va="center", fontsize=9, color="#93C5FD", fontweight="bold")
        
    for bar in b3:
        w = bar.get_width()
        ax.text(w + 1.5, bar.get_y() + bar.get_height()/2., f"{w:.0f}%", ha="left", va="center", fontsize=9, color="#86EFAC", fontweight="bold")
        
    ax.text(
        0.02, 0.025,
        "*Methodological Note: Rate-limit defense shown under post-threshold saturation;\nthe unsaturated control benchmark recorded 0% interception before the counter was saturated.",
        transform=ax.transAxes, fontsize=8.0, color=MUTED_TEXT,
        bbox=dict(boxstyle="round,pad=0.35", facecolor=SURFACE_COLOR, edgecolor=BORDER_COLOR, lw=0.8)
    )
        
    # Top-centered horizontal legend avoiding any collision with bars or note
    ax.legend(loc="lower center", bbox_to_anchor=(0.5, 1.01), ncol=3, framealpha=0.9, facecolor=SURFACE_COLOR, edgecolor=BORDER_COLOR, fontsize=9.5)
    
    fig.tight_layout()
    path = os.path.join(OUTPUT_DIR, "threat_category_defense.png")
    fig.savefig(path, facecolor=fig.get_facecolor(), edgecolor="none")
    plt.close(fig)
    print(f"Generated: {path}")

if __name__ == "__main__":
    print("Generating PromptAegis 2.0 Governance Research Figures...")
    plot_asr_ablation()
    plot_latency_distribution()
    plot_adversarial_robustness()
    plot_closed_loop_funnel()
    plot_threat_category_defense()
    print("All governance research figures generated successfully.")
