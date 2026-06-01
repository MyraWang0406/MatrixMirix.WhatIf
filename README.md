# MatrixMirix What-If: Reflective AI for Complex Decisions

MatrixMirix What-If is a reflective AI prototype for complex decision-making. It uses multi-role AI agents to help users reconstruct decision contexts, surface hidden assumptions, compare stakeholder perspectives, and explore alternative what-if paths before committing to a decision.

The prototype is designed for research demonstration, not production deployment.

## Project Information

| Item | Description |
|---|---|
| Status | Research prototype |
| Repository | https://github.com/MyraWang0406/MatrixMirix.WhatIf |
| Live Demo | https://matrixmirix-whatif.pages.dev/ |
| Research Area | Human-AI Collaboration, Reflective AI, Decision Support, HCI / CSCW |
| Main Methods | Multi-role agent prompting, narrative-to-scenario structuring, reflective decision support |
| Intended Use | Research demonstration, not production deployment |

## Research Positioning

When facing complex decisions, people often struggle to externalize assumptions, surface hidden trade-offs, and consider perspectives they have not yet thought of. This is especially common under time pressure, emotional pressure, or organizational ambiguity.

LLM agents can generate options quickly, but they may also collapse the decision space too early by producing confident recommendations before the user has inspected alternative interpretations.

This project explores a different design direction: AI should not directly replace human judgment. Instead, it should help users expand the decision space, inspect assumptions, and preserve decision ownership.

## Research Question

How can multi-role AI agents support reflective deliberation and perspective-taking in complex decisions without replacing the user's final judgment?

## System Overview

The system transforms a user’s narrative into a structured decision scenario. It then activates several agent roles to inspect the situation from different perspectives.

The output is not a single recommendation. The goal is to help users see:

- what happened
- who is involved
- what assumptions are hidden
- what risks are ignored
- what perspectives are missing
- what alternative futures may be possible

## Agent Roles

| Agent | Function |
|---|---|
| Scenario Agent | Reconstructs the decision context from user input |
| Skeptic Agent | Challenges hidden assumptions and optimistic biases |
| Stakeholder Agent | Represents perspectives of people affected by the decision |
| Risk Agent | Surfaces downside scenarios and uncertainty |
| Memory Agent | Recalls prior decisions, patterns, and stated values |

Each agent contributes a distinct perspective. The system is designed to expand the decision space through structured disagreement, making implicit trade-offs visible before a commitment is made.

## Core Design Principle

Most AI decision-support systems try to generate a recommendation.

This prototype takes a different position:

> Complex decisions benefit from deliberate exposure to conflict, not premature consensus.

Human judgment remains the final step. The agents provide structured perspectives, not final answers.

## Example Workflow

1. The user enters a complex decision narrative.
2. The Scenario Agent reconstructs the context.
3. The Skeptic Agent challenges assumptions.
4. The Stakeholder Agent identifies affected parties and alternative viewpoints.
5. The Risk Agent surfaces downside scenarios.
6. The Memory Agent recalls relevant prior patterns or stated values.
7. The user compares perspectives and makes their own judgment.

## Relation to Other Prototypes

This project is part of my broader research portfolio on traceable AI-assisted decision-making.

- `MatrixMirix.WhatIf` focuses on pre-decision or in-decision reflection through role-based what-if reasoning.
- `UserResearchAgent-CF` focuses on post-decision memory, falsification recall, and evidence-constrained future decisions.
- `Memory-Genesis` focuses on longitudinal decision memory and reinterpretation after time has passed.

In this sense, MatrixMirix What-If explores how AI agents can help users reason before a decision is finalized, while UserResearchAgent-CF and Memory-Genesis explore how memory and evidence constrain or reinterpret decisions after they have been made.

## Research Contribution

This prototype contributes an interaction pattern for reflective AI decision support:

```text
narrative input
→ scenario reconstruction
→ role-based perspective generation
→ assumption challenge
→ risk and stakeholder inspection
→ user-controlled reflection
```

The contribution is not a new optimization algorithm. The research value lies in the interaction design of multi-agent deliberation.

## Informal Evaluation

The prototype was tested through scenario-based walkthroughs across career, relationship, and organizational decision contexts.

It also received a Memorial Award in the Memory Genesis Competition 2026.

Current evaluation remains informal. A systematic study has not yet been conducted.

## Evaluation Plan

Future evaluation could examine:

- reflection depth
- perspective diversity
- decision confidence
- perceived decision ownership
- cognitive load
- trust in AI-generated perspectives
- comparison with a single-agent baseline

## Current Limitations

- No systematic evaluation of reflection depth, decision confidence, or outcome quality has been completed.
- Agent roles are hand-crafted rather than learned.
- LLM-generated perspectives may still converge despite different role assignments.
- The system has not yet been compared with a single-agent baseline.
- The prototype is intended for research demonstration, not production decision-making.

## Technical Overview

| Layer | Description |
|---|---|
| Frontend | TypeScript-based web prototype |
| Agent Logic | Multi-role prompt orchestration |
| Deployment | Static web deployment |
| Core Interaction | Narrative-to-scenario transformation and role-based perspective generation |

## Local Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

## Research Fit

`human-agent collaboration` · `multi-agent systems` · `reflective AI` · `decision support` · `HCI` · `CSCW`

## Status and Scope

This repository is a research prototype. It is intended to demonstrate interaction logic, workflow design, and research framing. It is not a production-ready decision-support system.

## License

This repository is for research and portfolio demonstration purposes.
