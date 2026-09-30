# PromptAegis

**Deterministic Post-Generation Tool Governance Gateway for Autonomous AI Agents**

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![Docker Compose](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://docs.docker.com/compose/)
[![Security Research](https://img.shields.io/badge/Security-Research%20Prototype-orange.svg)](#security-disclosure)

---

## Navigation

- [Overview and Conceptual Framing](#overview-and-conceptual-framing)
- [The Fundamental Problem](#the-fundamental-problem)
- [Why PromptAegis: Decoupled Confinement](#why-promptaegis-decoupled-confinement)
- [System Architecture](#system-architecture)
- [Threat Model](#threat-model)
- [Key Security Mechanisms](#key-security-mechanisms)
- [Empirical Research Results](#empirical-research-results)
- [Adversarial Robustness Evaluation](#adversarial-robustness-evaluation)
- [Closed-Loop Live LLM Agent Pilot](#closed-loop-live-llm-agent-pilot)
- [Results Interpretation and Scientific Scope](#results-interpretation-and-scientific-scope)
- [Threats to Validity and Limitations](#threats-to-validity-and-limitations)
- [Quick Start](#quick-start)
- [Project Directory Structure](#project-directory-structure)
- [Reproducing the Research](#reproducing-the-research)
- [Engineering vs. Research Contributions](#engineering-vs-research-contributions)
- [Evidence Hierarchy and Traceability](#evidence-hierarchy-and-traceability)
- [Citation and Security Disclosure](#citation-and-security-disclosure)

---

## Overview and Conceptual Framing

**PromptAegis** is an application-level, post-generation execution confinement gateway designed to govern tool invocations issued by autonomous AI agents. Rather than attempting to solve prompt injection through probabilistic text classifiers or fragile prompt engineering at the input layer, PromptAegis intercepts **structured tool call requests after model generation** but **prior to crossing into external system APIs or downstream execution environments**.

```
PROMPT INJECTION ATTACK (Direct or Indirect)
                     │
                     ▼
             LLM / AGENT REASONING
                     │
                     ▼
          PROPOSED TOOL INVOCATION
       {"tool": "execute_sql", ...}
                     │
                     ▼
  ┌─────────────────────────────────────┐
  │         PROMPTAEGIS GATEWAY         │
  │                                     │
  │  [1] Rate Limiter (60s Window)      │
  │  [2] Role-Based Access Control      │
  │  [3] Policy & Parameter Validation  │
  │  [4] Risk & Severity Scoring        │
  │  [5] Forensic Execution Audit       │
  └─────────────────────────────────────┘
                     │
                     ▼
     [ ALLOW | REQUIRE_APPROVAL | DENY ]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
   EXTERNAL API            BLOCKED AT
(Database / Shell)          BOUNDARY
```

### What PromptAegis Is
- **An Execution Confinement Gateway**: An intermediary enforcement layer that evaluates candidate tool calls against deterministic security invariants (RBAC, regex parameter constraints, rate limits, and approval policies).
- **A Decoupled Security Boundary**: An architecture ensuring that an agent's internal cognitive compromise does not automatically translate into unauthorized execution privilege.
- **An Auditable Governance Platform**: A full-stack system providing real-time interception, policy authoring, automated benchmark reproduction, and cryptographic forensic execution tracing.

### What PromptAegis Is NOT
- **Not a Universal Prompt Injection Detector**: It does not inspect raw natural language inputs to decide whether a user prompt is semantically hostile.
- **Not a Guarantee of Complete Immunity**: If an authorized tool is invoked with syntactically valid parameters that still accomplish an attacker's subtle semantic objective, PromptAegis will permit the execution.
- **Not an Out-of-Band Sandbox**: Confinement is contingent upon agent tool execution being routed through the gateway adapter. Out-of-band execution paths that circumvent the gateway are outside its reference monitor boundary.
- **Not a Replacement for Model Alignment or System Defense-in-Depth**: It complements, rather than supplants, secure coding practices, least-privilege database accounts, and operating system virtualization.

---

## The Fundamental Problem

Modern LLM-based autonomous agents do not merely generate text—they interact with operating systems, query production databases, call external APIs, and execute arbitrary code. Consequently:

$$\text{Prompt-Level Safety} \neq \text{Execution-Level Safety}$$

1. **The Fallacy of Input-Layer Detection**: Statistical classifiers, heuristic filters, and LLM-as-a-judge pre-guards operate on unstructured natural language. Attackers systematically evade them using lexical perturbations, multi-turn context dilution, linguistic indirection, and base64/URL encoding.
2. **The Fragility of System Prompts**: Instructing an LLM to "never delete production databases" fails under adversarial pressure because instruction-following models cannot mathematically distinguish authoritative system instructions from untrusted data inputs.
3. **The Disconnect**: When an agent ingests untrusted third-party data (e.g., summarizing an email or reading a webpage containing an indirect injection), the model may become fully subverted. If the agent holds unmediated credentials, the attacker inherits full ambient execution authority.

---

## Why PromptAegis: Decoupled Confinement

PromptAegis addresses this vulnerability by shifting the primary enforcement locus from **pre-generation prompt filtering** to **post-generation execution governance**.

### Architecture Comparison

```
UNMITIGATED AGENT PIPELINE:
User / Attacker ──► Ingestion ──► LLM / Agent ──► Tool Call ──► External Execution
                                  (Subverted)                   (Compromised System)

GOVERNED PROMPTAEGIS PIPELINE:
User / Attacker ──► Ingestion ──► LLM / Agent ──► Proposed Call ──► [ PROMPTAEGIS ] ──► ALLOW ──► External Execution
                                  (Subverted)                        │
                                                                     ├─► REQUIRE_APPROVAL ──► Human-in-the-Loop
                                                                     └─► DENY / RATE_LIMIT ──► Boundary Confined
```

### Core Architectural Axiom
> **Security enforcement must be decoupled from model generation.** The agent proposes candidate actions; a deterministic reference monitor decides whether those actions are permitted to cross the trust boundary.

---

## System Architecture

PromptAegis consists of a high-throughput FastAPI asynchronous backend, a thread-safe relational database management system, an agent runtime adapter layer, and an interactive React 18 administrative dashboard.

### Gateway Pipeline Flow

```mermaid
flowchart TD
    A["Proposed Tool Call<br/>(Agent, Tool, Arguments)"] --> B{"Stage 1: Rate Limiter<br/>60s Tumbling Window"}
    B -- "Limit Exceeded" --> R["RATE_LIMIT<br/>(Execution Halted)"]
    B -- "Within Limit" --> C{"Stage 2: RBAC Check<br/>permissions Table"}
    C -- "Unauthorized Tool" --> D1["DENY<br/>(UNAUTHORIZED_TOOL)"]
    C -- "Authorized" --> E{"Stage 3: Policy Engine<br/>Regex & Parameter Filter"}
    E -- "Malicious Parameter" --> D2["DENY<br/>(POLICY_VIOLATION)"]
    E -- "Policy Compliant" --> F{"Stage 4: Risk Scorer<br/>Heuristic & Sensitivity Gate"}
    F -- "Risk >= 7.0 / Requires Approval" --> AP["REQUIRE_APPROVAL<br/>(Human Escrow)"]
    F -- "Low / Medium Risk" --> G["ALLOW<br/>(Permitted Execution)"]

    R --> LOG["Stage 5: Forensic Audit<br/>SQLite tool_calls Persistence"]
    D1 --> LOG
    D2 --> LOG
    AP --> LOG
    G --> LOG
    LOG --> H["Dispatch to External Tool / Return Result to Agent"]
```

### Implementation Module Reference

| Component / Subsystem | Repository Source File | Core Responsibility |
|:---|:---|:---|
| **Interception Pipeline** | `backend/governance/interceptor.py` | Orchestrates the multi-stage evaluation pipeline; enforces deterministic decision hierarchy (`RATE_LIMIT` → `POLICY_DENY` → `RBAC_DENY` → `RISK_GATE` → `ALLOW`). |
| **RBAC Engine** | `backend/governance/permission_engine.py` | Validates agent identity against authorized tool mappings stored in the relational database. |
| **Policy Engine** | `backend/governance/policy_engine.py` | Enforces parameter-level regex patterns, forbidden commands, path traversal filters, and payload size bounds. |
| **Rate Limiter** | `backend/governance/rate_limiter.py` | Implements a 60-second sliding tumbling window (`math.floor(ts / 60.0) * 60.0`) tracking invocations per `(agent_id, tool_name)`. |
| **Risk Scorer** | `backend/governance/risk_scorer.py` | Evaluates tool criticality, destructive side-effects, and parameter sensitivity; gates execution when threat score $\ge 7.0$. |
| **Agent SDK & Adapter** | `backend/governance/adapter.py` | Standardizes agent tool calls via `StandardToolRequest` (PRD §12.1); provides `@wrap_tool` Python function decorator. |
| **Database & Audit** | `backend/database/db.py` | Thread-safe SQLite context manager managing 9 relational tables; logs immutable forensic traces for every intercepted call. |
| **Experiments API** | `backend/api/experiments.py` | Programmatic benchmark orchestration engine supporting automated reproduction, configuration ablations, and CSV export. |
| **Governance API** | `backend/api/governance.py` | REST endpoints for agent registration, tool provisioning, RBAC assignment, policy management, and statistics. |
| **Administrative UI** | `frontend/src/` | React 18 single-page application featuring interactive policy panels, real-time interceptor logs, and benchmark runners. |

---

## Threat Model

PromptAegis is evaluated against an adversarial threat model spanning six primary tool-misuse vectors.

| Threat ID | Threat Category | Attacker Capability | Attack Vector & Manifestation | Gateway Mitigation Control | Primary Benchmark Outcome |
|:---:|:---|:---|:---|:---|:---:|
| **T1** | **Unauthorized Tool Use** | Attacker injects prompt forcing agent to call unassigned tools. | Agent assigned `support` role invokes `execute_sql` or `file_delete`. | Strict RBAC permission lookup in `permissions` table. | **100% Interception** (0/100 attacks breached) |
| **T2** | **Privilege Escalation** | Attacker manipulates agent into performing administrative mutations. | Support agent attempts to invoke `export_customer_data` or `update_customer_role`. | Role-to-tool permission constraints and administrative policy barriers. | **100% Interception** (0/100 attacks breached) |
| **T3** | **Prompt-Driven Restricted Tool Execution** | Attacker embeds indirect jailbreak within retrieved context. | Agent is instructed to bypass conversational boundaries and invoke high-risk APIs. | Combined RBAC verification, tool risk gating, and parameter validation. | **100% Interception** (0/100 attacks breached) |
| **T4** | **Parameter Manipulation** | Attacker exploits an authorized tool by injecting malicious arguments. | Agent calls authorized `search_customer`, but argument contains `admin'; DROP TABLE customers;--` or `../../etc/passwd`. | Fine-grained parameter regex filters and path traversal detection rules. | **43% Interception** (Controlled benchmark baseline policies; improved to 68% under calibrated rules) |
| **T5** | **Excessive Invocations (DoS)** | Attacker forces recursive or loops of resource-intensive tool calls. | Prompt induces rapid automated search queries exhaustively scraping records. | 60-second tumbling-window rate counter stored in SQLite. | **100% Interception** (0/100 attacks breached once saturated) |
| **T6** | **Adversarial Parameter Obfuscation** | Attacker perturbs malicious payloads to evade syntactic regex filters. | Payloads perturbed using case alternation, comment fragmentation, advanced SQL syntax, URL hex encoding, or Base64 obfuscation. | Evaluated under standard regex vs hardened pre-execution normalization layers. | **54.8% Recall** (Standard) → **66.0% Recall** (Hardened normalization) |

---

## Key Security Mechanisms

### 1. Role-Based Access Control (RBAC)
PromptAegis enforces a strict zero-trust permission model (`backend/governance/permission_engine.py`). Tools are explicitly registered with associated risk levels (`low`, `medium`, `high`). An agent may only execute a tool if an explicit record exists in the relational `permissions` table mapping `agent_id` to `tool_id` with `allowed = 1`. Calls to unknown or unregistered tools are rejected by default (`UNKNOWN_TOOL`).

### 2. Fine-Grained Policy Engine
Even when an agent is authorized to call a tool, the invocation arguments are subjected to priority-ordered policy evaluations (`backend/governance/policy_engine.py`). Policies support four deterministic enforcement types:
- `parameter_regex`: Blocks or gates calls matching forbidden regex patterns (e.g., SQL union queries, shell syntax, directory climbing `../`).
- `domain_allowlist`: Enforces strict outbound network destination restrictions.
- `payload_size`: Rejects arguments exceeding configured memory or byte bounds.
- `time_window`: Constrains operational windows for high-risk actions.

### 3. Risk Scoring & Human Approval Gate
Every tool request is evaluated by `backend/governance/risk_scorer.py` using a weighted arithmetic risk model:

$$\text{Risk} = w_{\text{base}} \times \text{ToolRisk} + w_{\text{arg}} \times \text{ArgSensitivity} + w_{\text{rate}} \times \text{RateStatus}$$

- Low-risk tools (e.g., read-only lookup) receive baseline scores ($1.0 - 3.0$).
- Sensitive arguments or administrative actions elevate the risk score.
- If $\text{Risk Score} \ge 7.0$ or if the target tool has `requires_approval = 1`, the gateway halts automated execution and issues `REQUIRE_APPROVAL`, holding the action in escrow until authenticated human operator intervention.

### 4. 60-Second Tumbling-Window Rate Limiting
To prevent automated denial-of-service, financial API depletion, or data scraping loops, `backend/governance/rate_limiter.py` tracks execution volume per `(agent_id, tool_name)` over a 60-second tumbling window:

$$\text{Window Start} = \lfloor \frac{t}{60.0} \rfloor \times 60.0$$

Counters are atomically incremented in SQLite. When the limit is reached, subsequent requests within the active 60-second window receive `RATE_LIMIT` and are terminated before dispatch.

### 5. Forensic Audit Logging & Cryptographic Traceability
Every transaction crossing the gateway boundary generates an immutable audit record in the `tool_calls` database table (`backend/database/db.py`), logging:
- Unique invocation UUID (`call_id`)
- High-precision timestamp and execution latency (in milliseconds)
- Calling `agent_id` and requesting `user_id`
- Exact serialized `arguments_json` payload
- Final deterministic decision (`ALLOW`, `DENY`, `REQUIRE_APPROVAL`, `RATE_LIMIT`)
- Detailed explanatory reason code and triggering policy ID

### 6. Application-Level Integration & Function Wrapping
Developers integrate PromptAegis via the `AgentAdapter` or the `@wrap_tool` Python decorator (`backend/governance/adapter.py`). When an agent executes a decorated function, execution is transparently routed through PromptAegis:

```python
from governance.adapter import AgentAdapter

adapter = AgentAdapter(agent_id="support_bot_01", configuration="full")

@adapter.wrap_tool("search_customer", search_customer_api)
def search_customer(query: str):
    # This execution occurs ONLY if PromptAegis issues ALLOW
    return query_database(query)
```

---

## Empirical Research Results

### The Validated Research Question
> *"To what extent can a deterministic, post-generation tool governance gateway mitigate the execution risks of prompt injection and privilege escalation in autonomous AI agents, and what are the quantifiable trade-offs in runtime latency, false positives, and parameter-obfuscation resilience?"*

### Primary Controlled Benchmark ($N = 600$ Scenarios)

The primary benchmark consists of 600 synthetically generated, deterministic scenario execution records:
- **500 Attack Scenarios**: 100 Unauthorized Tool Use, 100 Privilege Escalation, 100 Prompt-Driven Execution, 100 Parameter Manipulation, and 100 Excessive Rate-Limit Invocations.
- **100 Legitimate Scenarios**: Routine, authorized customer-support tool operations.

All configurations were evaluated over identical input distributions.

| Governance Layer Configuration | Attack Success Rate (ASR) | Legitimate Task Completion (LTCR) | False Positive Rate (FPR) | Successful Attacks / Total | Blocked Attacks | Median Total Latency | Paired Median Overhead |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Baseline (Unmitigated)** | $1.000$ (100.0%) | $1.000$ (100.0%) | $0.000$ (0.0%) | 500 / 500 | 0 | 21.38 ms | +0.00 ms (Ref) |
| **Permission-Only (RBAC)** | $0.360$ (36.0%) | $0.800$ (80.0%) | $0.200$ (20.0%) | 180 / 500 | 320 | 57.05 ms | +35.14 ms |
| **Policy-Only** | $0.280$ (28.0%) | $0.800$ (80.0%) | $0.200$ (20.0%) | 140 / 500 | 360 | 54.76 ms | +33.38 ms |
| **Full Governance** | **$0.314$ (31.4%)** | **$0.800$ (80.0%)** | **$0.200$ (20.0%)** | **157 / 500** | **343** | **139.72 ms** | **+112.55 ms** |

> **Primary Statistical Finding**:
> - **Attack Reduction**: Full governance reduces Attack Success Rate from **100.0% to 31.4%** (343 attacks intercepted).
> - **McNemar Statistical Test**: Discordant pairs $b = 20$ (baseline correct, full governance incorrect: legitimate calls blocked), $c = 343$ (baseline incorrect, full governance correct: attack calls intercepted). $\chi^2 = \frac{(|343 - 20| - 1)^2}{343 + 20} = \frac{322^2}{363} \approx 285.63085$ ($df = 1, p \approx 4.4522 \times 10^{-64}$). The reduction in attack execution is statistically significant.
> - **Latency Overhead**: The median of per-scenario paired latency differences ($L_{\text{full}, i} - L_{\text{baseline}, i}$) is **$+112.55\text{ ms}$** (Paired Wilcoxon Signed-Rank test: $W = 811.0, p \approx 3.41 \times 10^{-98}$). This differs slightly from the aggregate median difference of $139.72 - 21.38 = 118.34\text{ ms}$.

### Secondary Calibrated Evaluation ($N = 600$ Scenarios)

In the secondary calibrated experiment, two specific benchmark configuration misalignments were corrected:
1. Legitimate scenarios that had been misattributed to an unpermissioned role were mapped to their designated support role.
2. Parameter validation regular expressions were expanded to cover complex nesting and whitespace variations.

| Evaluation Regime | ASR | LTCR | FPR | Methodological Status |
|:---|:---:|:---:|:---:|:---|
| **Controlled Benchmark (Full)** | **31.4%** | **80.0%** | **20.0%** | **Canonical primary control baseline** (strict un-tuned policies) |
| **Calibrated Configuration** | **6.4%** | **100.0%** | **0.0%** | **Secondary operational demonstration** (incorporates configuration alignment) |

> [!IMPORTANT]
> **Scientific Attribution Boundary**: The 6.4% ASR result must **not** be presented as an architectural ablation improvement over the 31.4% controlled result. It reflects parameter regex tuning and role mapping calibration. The defensible scientific baseline of the core un-tuned architecture is 31.4% ASR and 20.0% FPR.

---

## Adversarial Robustness Evaluation

To assess resilience against evasion attacks seeking to bypass regex policies, a clustered adversarial testbed of **500 mutation instances** was constructed ($100\text{ base attack cases} \times 5\text{ deterministic perturbation classes}$).

### Perturbation Classes
1. **Case Alternation**: Random upper/lower-case interleaving (e.g., `SeLeCt`).
2. **Comment Fragmentation**: SQL inline comment token splitting (e.g., `SEL/**/ECT`).
3. **Advanced SQL Logic**: Boolean tautologies and subquery structuring.
4. **URL Percent-Encoding**: Alphanumeric and symbol hex-encoding (e.g., `%27%20OR%201%3D1`).
5. **Base64 Obfuscation**: Raw Base64 ASCII payload encapsulation.

### Mutation Evaluation Results

| Perturbation Class | Standard Gateway Recall | Standard Evasion Rate (AER) | Hardened Normalization Recall | Improvement ($\Delta$) |
|:---|:---:|:---:|:---:|:---:|
| **Case Alternation** | 78.0% (78/100) | 22.0% | 78.0% (78/100) | +0.0% |
| **Comment Fragmentation** | 78.0% (78/100) | 22.0% | 78.0% (78/100) | +0.0% |
| **Advanced SQL Logic** | 68.0% (68/100) | 32.0% | 68.0% (68/100) | +0.0% |
| **URL Encoding** | 50.0% (50/100) | 50.0% | 78.0% (78/100) | **+28.0%** |
| **Base64 Obfuscation** | 0.0% (0/100) | 100.0% | 28.0% (28/100) | **+28.0%** |
| **Overall Clustered Aggregate** | **54.8% (274/500)** | **45.2% (226/500)** | **66.0% (330/500)** | **+11.2%** |

> **Adversarial Insights & Semantic Asymmetry**:
> - Standard regex policies suffer severe degradation under character-level encoding, yielding an overall Adversarial Evasion Rate of **45.2%**.
> - Adding a pre-execution canonicalization layer (URL decoding and Base64 heuristic sniffing) increased recall from **54.8% to 66.0%**.
> - **The Base64 Semantic Nuance**: The 0% raw detection rate of standard regex on Base64 strings highlights a vital distinction between **syntactic non-detection** and **downstream exploitability**. If the target tool expects a raw plaintext SQL query, a raw Base64 string will cause a SQL parser syntax error rather than executing malicious logic. Un-decoded regex failure does not automatically establish execution compromise.

---

## Closed-Loop Live LLM Agent Pilot

To validate governance in a realistic end-to-end environment, PromptAegis was integrated into a live autonomous agent loop powered by a production LLM hosted on Groq (`openai/gpt-oss-120b`).

The evaluation utilized **$N = 20$ live pilot prompts** (10 adversarial jailbreak prompts, 10 legitimate benign user queries) with tool calling enabled.

```
CLOSED-LOOP EXPERIMENTAL TRACE:
10 Adversarial Prompts ──► Groq LLM (gpt-oss-120b)
                             │
                             ├─► 6 Prompts Resisted / Refused by LLM (No tool emitted)
                             │
                             └─► 4 Prompts Deceived LLM (40.0% Model Compromise)
                                   │
                                   ▼
                             Malicious Tool Calls Proposed to PromptAegis
                                   │
                                   ├─► 3 / 4 Intercepted & Blocked (75.0% Conditional Interception)
                                   └─► 1 / 4 Bypassed Regex Policy (10.0% End-to-End Breach)
```

### Closed-Loop Summary Metrics

| Metric | Measured Value | Sample Size / Context |
|:---|:---:|:---|
| **LLM Attack Induction Rate** | **40.0%** (4 / 10) | Proportion of adversarial prompts that successfully tricked the LLM into generating malicious tool calls. |
| **Conditional Gateway Interception** | **75.0%** (3 / 4) | Proportion of model-emitted malicious calls blocked by PromptAegis before execution. |
| **End-to-End Governed Breach Rate** | **10.0%** (1 / 10) | Attacks that succeeded end-to-end through both LLM and Gateway. |
| **Legitimate Task Completion** | **100.0%** (10 / 10) | Benign requests successfully executed with zero false rejections. |
| **Median LLM Inference Latency** | **4,375.2 ms** | End-to-end token generation and reasoning time on Groq API. |
| **Median Gateway Overhead** | **161.1 ms** | PromptAegis interception, validation, and audit persistence latency. |
| **Relative Gateway Latency Tax** | **3.55%** | Overhead expressed as a fraction of total 4,536.3 ms agent transaction duration ($161.1 / 4,536.3$). |

> [!NOTE]
> **Strict Claim Formulation**: Do **not** state that "PromptAegis blocks 75% of prompt injections." The precise scientific finding is: *Among adversarial prompts that successfully tricked the LLM into emitting malicious tool calls in this 20-prompt pilot, PromptAegis blocked 3 of 4 such calls (75.0% conditional interception), reducing the unmitigated 40.0% model compromise rate to a 10.0% end-to-end breach rate.*

---

## Results Interpretation and Scientific Scope

### What the Empirical Evidence Supports
1. **Execution Confinement is Viable**: Enforcing deterministic RBAC, parameter regular expressions, and rate limits at the tool boundary substantially reduces unauthorized agent actions ($100\% \to 31.4\%$ in controlled benchmarks).
2. **Execution Decoupling Catches Induced Malice**: When an LLM's internal reasoning is fully subverted by a jailbreak, an external deterministic gateway can still prevent hazardous tool execution.
3. **Predictable Runtime Latency**: The governance pipeline introduces a median paired overhead of $\approx 112.55\text{ ms}$ (representing $3.55\%$ of the $4,536.3\text{ ms}$ round-trip agent transaction in the closed-loop pilot, and $21.32\%$ of mean LLM generation time).
4. **Configuration Sensitivity**: Security outcomes are highly sensitive to policy tuning; calibrated parameters reduced residual ASR from $31.4\%$ to $6.4\%$.

### What the Evidence Does NOT Establish
1. **Universal Prompt Injection Immunity**: PromptAegis does not prevent model subversion, hallucination, or malicious generation that does not involve governed tool calls.
2. **Uncircumventable Reference Monitor**: If an agent framework executes functions through un-wrapped internal routines, PromptAegis cannot enforce mediation.
3. **Cross-Model Equivalence**: The closed-loop pilot was conducted on a single LLM (`openai/gpt-oss-120b`). Susceptibility and tool-calling structures vary across model families.
4. **Generalization Beyond Evaluated Heuristics**: Regex-based parameter validation remains vulnerable to novel evasion strategies that bypass pre-configured patterns.

---

## Threats to Validity and Limitations

To maintain scientific integrity, the known limitations of this research prototype are explicitly documented across 13 core dimensions:

1. **Synthetic Benchmark Construction**: The primary 600-scenario benchmark is synthetic and evaluates single-turn invocations rather than complex, long-horizon multi-agent tasks.
2. **Closed-Loop Sample Size**: The live LLM agent experiment was conducted as an exploratory pilot ($N = 20$). Larger evaluations are needed for high-power generalizability.
3. **Single LLM Family Evaluated**: Live agent tests were conducted solely against Groq-hosted `openai/gpt-oss-120b`; frontier models (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro) may exhibit different tool-calling behaviors.
4. **Clustered Mutation Artifacts**: The 500 adversarial mutation instances were deterministically generated from 100 base seeds, resulting in clustered variance rather than 500 independent samples.
5. **Application-Level Boundary**: Enforcement operates in Python user-space. It does not provide kernel-level or hypervisor-level sandboxing against malicious Python code execution.
6. **Regex Fragility**: Syntactic regex pattern matching is brittle against zero-day evasion vectors and complex obfuscated strings.
7. **Syntactic vs. Semantic Parsing Divergence**: Standard regex failed on Base64 strings ($0\%$ recall), but downstream tools unable to parse raw Base64 would crash safely rather than execute malice.
8. **Storage Concurrency Bottlenecks**: Relational persistence relies on SQLite. High-concurrency enterprise workloads require migration to PostgreSQL or Redis to avoid database lock contention.
9. **Framework Integration Coupling**: Tool calls must be routed via `StandardToolRequest` or `@wrap_tool`. Agents with hard-coded function dispatches require manual wrapper integration.
10. **Absence of Stateful Multi-Turn Attackers**: The current evaluation tests static attacks rather than adaptive, multi-turn attackers who probe gateway responses to craft custom evasions.
11. **Concurrency Stress Limitations**: Benchmarking evaluated sequential and low-concurrency workloads; distributed load testing remains future work.
12. **Confounding in Calibrated Results**: The secondary $6.4\%$ ASR result reflects simultaneous policy tuning and role alignment, and cannot be separated into isolated architectural sub-components.
13. **Non-Universal Security Claim**: PromptAegis is an exploratory academic research prototype, not a production-certified, turnkey security appliance.

---

## Quick Start

### Prerequisites
- **Python**: Version `3.11+`
- **Node.js**: Version `18+` and `npm 9+`
- **Docker & Docker Compose** (Optional, for containerized execution)
- **Groq API Key** (Optional, only required for closed-loop live LLM experiments)

---

### Option A: Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Somaskandan931/PromptAegis.git
cd PromptAegis
```

#### 2. Backend Setup
```powershell
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# Linux / macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 3. Environment Configuration
Create a `.env` file in the `backend/` directory:
```bash
# backend/.env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_BASE_URL=https://api.groq.com/openai/v1
LLM_TIMEOUT_SECONDS=45
```
*(Note: If no Groq API key is provided, all deterministic governance, RBAC, policy checks, and synthetic benchmarks remain fully functional. Only live LLM agent inference requires the key.)*

#### 4. Launch the Backend API Service
```powershell
python -m uvicorn app:app --reload --port 8000
```
Verify the backend is live by opening [http://localhost:8000/docs](http://localhost:8000/docs) or checking [http://localhost:8000/health](http://localhost:8000/health).

#### 5. Frontend Setup (New Terminal)
```powershell
cd frontend
npm install
npm run dev
```
Open your browser to [http://localhost:5173](http://localhost:5173).

---

### Option B: Docker Compose Setup

Run the full-stack containerized deployment in a single command:
```bash
docker compose up --build
```
- **Backend API**: Accessible at [http://localhost:8001](http://localhost:8001)
- **Frontend Dashboard**: Accessible at [http://localhost:5173](http://localhost:5173)

---

### Verification & Health Check

Test the live gateway interception endpoint using `curl`:

```bash
curl -X POST http://localhost:8000/intercept \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "support_agent",
    "tool_name": "execute_sql",
    "arguments": {"query": "DROP TABLE users;"},
    "configuration": "full"
  }'
```

**Expected JSON Response:**
```json
{
  "call_id": "7b049d56-0ea4-4861-9c60-a2267b14d872",
  "decision": "DENY",
  "reason": "PERMISSION_DENIED",
  "policy_id": "",
  "risk_score": 10.0,
  "latency_ms": 1.42
}
```

---

## Project Directory Structure

```
PromptAegis/
├── backend/
│   ├── api/                     # FastAPI route handlers
│   │   ├── governance.py        # Agents, tools, policies, and /intercept
│   │   ├── experiments.py       # Benchmark runner and CSV data export
│   │   ├── detect.py            # Prompt injection input analysis routes
│   │   ├── chat.py              # LLM chat and streaming interface
│   │   └── dashboard.py         # Metrics aggregation endpoints
│   ├── core/                    # Core detection & semantic classification
│   │   ├── pipeline.py          # Input analysis orchestrator
│   │   ├── rule_engine.py       # Keyword & pattern regex rules
│   │   └── semantic_engine.py   # Embedding similarity engine
│   ├── database/                # Relational persistence layer
│   │   └── db.py                # Thread-safe SQLite manager (9 tables)
│   ├── data/
│   │   └── benchmark/           # Canonical benchmark datasets (600 JSONs)
│   │       ├── unauthorized_tool.json
│   │       ├── privilege_escalation.json
│   │       ├── prompt_injection.json
│   │       ├── parameter_manipulation.json
│   │       ├── excessive_calls.json
│   │       ├── legitimate.json
│   │       └── adversarial_extension.json
│   ├── governance/              # Post-generation execution governance
│   │   ├── interceptor.py       # 4-stage tool governance interceptor
│   │   ├── permission_engine.py # Role-based access control engine
│   │   ├── policy_engine.py     # Parameter validation & regex policies
│   │   ├── rate_limiter.py      # 60-second tumbling-window rate limiter
│   │   ├── risk_scorer.py       # Threat scoring & approval gating
│   │   └── adapter.py           # StandardToolRequest & @wrap_tool SDK
│   ├── app.py                   # FastAPI application entry point
│   ├── config.py                # System-wide configuration & thresholds
│   ├── Dockerfile               # Backend container definition
│   └── requirements.txt         # Pinned Python package dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── GovernancePanel.jsx   # Policy & agent management UI
│   │   │   ├── ToolInterceptor.jsx   # Live tool call interception console
│   │   │   ├── ExperimentRunner.jsx  # Benchmark execution & evaluation UI
│   │   │   ├── Dashboard.jsx         # System analytics & metric charts
│   │   │   └── AegisChat.jsx         # Interactive testbed chat interface
│   │   ├── api.js                    # Frontend REST client bindings
│   │   └── App.jsx                   # React root navigation & routing
│   ├── Dockerfile               # Frontend container definition
│   └── package.json             # Pinned Node.js dependencies
├── docker-compose.yml           # Multi-container orchestration definition
└── README.md                    # Project technical documentation
```

---

## Reproducing the Research

Every empirical metric reported in this project can be independently reproduced using the scripts and endpoints built into the repository.

### Phase 1: Benchmark Execution via Experiments API
Execute benchmark experiments directly via HTTP:
```bash
# 1. Baseline Run (No Governance)
curl -X POST http://localhost:8000/experiments/run \
  -H "Content-Type: application/json" \
  -d '{"configuration": "baseline", "description": "Baseline replication"}'

# 2. Permission-Only Run (RBAC)
curl -X POST http://localhost:8000/experiments/run \
  -H "Content-Type: application/json" \
  -d '{"configuration": "permission", "description": "RBAC replication"}'

# 3. Policy-Only Run
curl -X POST http://localhost:8000/experiments/run \
  -H "Content-Type: application/json" \
  -d '{"configuration": "policy", "description": "Policy replication"}'

# 4. Full Governance Run
curl -X POST http://localhost:8000/experiments/run \
  -H "Content-Type: application/json" \
  -d '{"configuration": "full", "description": "Full governance replication"}'
```

### Phase 2: Statistical Significance Analysis
Calculate McNemar chi-square tests, paired Wilcoxon signed-rank latency metrics, and 95% bootstrap confidence intervals:
```powershell
python scratch/phase2_statistical_analysis.py
```
*Expected Output: McNemar $\chi^2 \approx 285.63$ ($p \approx 4.45 \times 10^{-64}$), Paired Latency Difference $\approx +112.55\text{ ms}$.*

### Phase 3: Calibrated Configuration Reproduction
Evaluate the secondary calibrated configuration:
```powershell
python scratch/phase3_calibrated_evaluation.py
```
*Expected Output: Calibrated ASR $= 6.4\%$, LTCR $= 100.0\%$, FPR $= 0.0\%$.*

### Phase 4: Adversarial Mutation Evaluation
Run the 500-instance clustered adversarial perturbation study across the 5 mutation classes:
```powershell
python scratch/phase4_adversarial_extension.py
```
*Expected Output: Standard Recall $= 54.8\%$, AER $= 45.2\%$, Hardened Normalization Recall $= 66.0\%$.*

### Phase 5: Closed-Loop Live LLM Agent Experiment
Run the 20-prompt live LLM evaluation using the Groq API (requires `GROQ_API_KEY`):
```powershell
python scratch/phase5_closed_loop_llm.py
```
*Expected Output: Attack Induction Rate $= 40.0\%$, Conditional Interception $= 75.0\%$, End-to-End Breach Rate $= 10.0\%$.*

---

## Engineering vs. Research Contributions

To prevent ambiguity, the technical achievements of this repository are split into systems engineering and scientific research contributions:

### Systems Engineering Contributions
- **Deterministic Middleware Architecture**: Built a production-grade, low-overhead interception pipeline in FastAPI capable of sub-millisecond RBAC and policy checks.
- **Unified Relational Governance Schema**: Implemented a thread-safe SQLite persistence model encompassing agents, tools, permissions, policies, rate limits, and audit logs.
- **Developer-Friendly Integration SDK**: Created the `AgentAdapter` and `@wrap_tool` Python decorator enabling seamless zero-code-change wrapping of existing agent tool functions.
- **Full-Stack Governance Dashboard**: Engineered an administrative React 18 dashboard for policy creation, live interception inspection, and visual benchmark execution.

### Empirical Research Contributions
- **Post-Generation Execution Confinement Characterization**: Provided rigorous empirical quantification of execution-side governance, demonstrating a drop in Attack Success Rate from $100\% \to 31.4\%$ in controlled benchmarks.
- **Empirical Measurement of Security/Latency Trade-offs**: Quantified the precise latency tax of layered governance (paired median overhead of $+112.55\text{ ms}$), representing $21.32\%$ of mean LLM generation time ($161.11\text{ ms} / 755.83\text{ ms}$) and $3.55\%$ of end-to-end agent transaction duration ($161.1\text{ ms} / 4,536.3\text{ ms}$).
- **Adversarial Parameter Obfuscation Benchmarking**: Quantified the degradation of standard regex policies under adversarial mutation ($45.2\%$ AER) and established the effectiveness of pre-execution canonicalization ($+11.2\%$ recall).
- **Closed-Loop Agent Interception Validation**: Demonstrated on a live production LLM that execution-side governance successfully intercepts malicious tool calls ($75.0\%$ conditional interception) even when the model itself has been subverted by prompt injection.

---

## Evidence Hierarchy and Traceability

This repository adheres to an immutable four-tier evidence hierarchy ensuring that all public claims are verifiable:

```
LEVEL 1: Primary Evidence (Ground Truth)
├── Source Code: backend/governance/interceptor.py, permission_engine.py, etc.
├── Relational Database: backend/database/db.py (SQLite Schema)
├── Raw Benchmark Files: backend/data/benchmark/*.json
└── Raw Evaluation Outputs: scratch/baseline_events.csv, closed_loop_traces.csv

LEVEL 2: Statistical Verification Artifacts
├── Statistical Computation Scripts: scratch/phase2_statistical_analysis.py
└── Exported Result Summaries: scratch/statistical_bootstrap_cis.csv, statistical_mcnemar.csv

LEVEL 3: Locked Technical Dossier
└── Authoritative Record: PROMPTAEGIS_COMPLETE_SCIENTIFIC_TECHNICAL_RECORD.md (v3.0.0 Frozen)

LEVEL 4: Public Interface
└── Repository README: README.md (This Document)
```

---

## Citation and Security Disclosure

### Citing PromptAegis
If you reference PromptAegis, its architectural methodology, or its experimental benchmark results in your research, please cite:

```bibtex
@misc{promptaegis2026,
  author = {PromptAegis Research Team},
  title = {PromptAegis: Deterministic Post-Generation Tool Governance Gateway for Autonomous AI Agents},
  year = {2026},
  howpublished = {\url{https://github.com/Somaskandan931/PromptAegis}},
  note = {Technical Record and Empirical Benchmark}
}
```

### Security Disclosure
PromptAegis is an active research prototype developed to study post-generation execution confinement. It is not intended to serve as a standalone security appliance for critical infrastructure without layered defense-in-depth controls. If you discover a vulnerability or bypass in the governance gateway, please open a confidential security advisory on GitHub.

---

*PromptAegis — Architected for Verifiable, Decoupled AI Agent Governance.*