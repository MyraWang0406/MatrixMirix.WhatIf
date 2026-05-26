# MatrixMirix What-If: Reflective AI for Complex Decisions

## 🧠 Research Positioning

**Research Problem:**
When facing complex decisions, people struggle to externalize their assumptions, surface hidden trade-offs, and consider perspectives they haven't thought of — especially under time pressure. LLM agents can generate options quickly, but they tend to collapse the decision space rather than expand it, and can push users toward premature conclusions.

**Research Question:**
How can multi-role AI agents support reflective deliberation and perspective-taking in complex decisions, without replacing the user's final judgment?

**Overarching research thread:**
> AI-assisted decision traceability — this prototype focuses on the deliberation phase: surfacing assumptions and perspectives *before* a decision is made

**Relation to other prototypes:**
- Complements [UserResearchAgent-CF](https://github.com/MyraWang0406/UserResearchAgent-CF): that system handles memory *after* decisions; this handles deliberation *before*
- Shares the "AI augments human reasoning without replacing judgment" principle with [Memory-Genesis](https://github.com/MyraWang0406/Memory-Genesis)

**Informal evaluation:**
Memorial Award, Memory Genesis Competition 2026. Scenario-based testing across career, relationship, and organizational decision contexts with approximately 5 participants.

**Limitations:**
- No systematic evaluation of reflection depth, decision confidence, or outcome quality
- Agent roles are hand-crafted; no learned specialization
- LLM-generated perspectives may still converge despite different role assignments
- No comparison with single-agent baseline established

---

## Agent Roles

| Agent | Function |
|-------|----------|
| Scenario Agent | Reconstructs the decision context from user input |
| Skeptic Agent | Challenges hidden assumptions and optimistic biases |
| Stakeholder Agent | Represents perspectives of people affected by the decision |
| Risk Agent | Surfaces downside scenarios and uncertainty |
| Memory Agent | Recalls prior decisions, patterns, and stated values |

Each agent contributes a distinct perspective. The system is designed to expand the decision space through structured disagreement — making implicit trade-offs visible before a commitment is made.

## Core Design Principle

Most AI decision support systems generate a single recommendation. This prototype takes a different position: **complex decisions benefit from deliberate exposure to conflict, not consensus.** Human judgment remains the final step — the agents provide input, not conclusions.

## Technical Overview

- **Stack:** TypeScript · LLM API · multi-role prompt orchestration
- **Key features:** narrative-to-scenario transformation, role-based perspective generation, user-controlled deliberation flow

## Research Fit

`human-agent collaboration` · `multi-agent systems` · `reflective AI` · `decision support` · `HCI` · `CSCW`
