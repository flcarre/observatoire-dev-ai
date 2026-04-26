<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- [PRINCIPLE_1_NAME] -> I. Senior-First, Framework-Agnostic Value
- [PRINCIPLE_2_NAME] -> II. Source-Traceable Modern Watch
- [PRINCIPLE_3_NAME] -> III. Spec-Driven Product Clarity
- [PRINCIPLE_4_NAME] -> IV. Open Source by Default
- [PRINCIPLE_5_NAME] -> V. Accessible, Durable Reading Experience
Added sections:
- Content & Curation Standards
- Development Workflow & Quality Gates
Removed sections:
- Placeholder template sections
Templates requiring updates:
- .specify/templates/plan-template.md: reviewed, no update required
- .specify/templates/spec-template.md: reviewed, no update required
- .specify/templates/tasks-template.md: reviewed, no update required
Follow-up TODOs: none
-->

# DevIA Observatory Constitution

## Core Principles

### I. Senior-First, Framework-Agnostic Value

The project MUST serve experienced software engineers who already understand
production development, teams, delivery, architecture, and trade-offs. Content
MUST avoid beginner chatbot tutorials, framework marketing, and one-stack
training paths. Framework-specific material is allowed only when it illustrates a
portable practice, failure mode, operating model, or tool category.

Rationale: the product exists to help senior developers understand how their
profession changes with GenAI, not to teach a web framework.

### II. Source-Traceable Modern Watch

Every external resource MUST expose its original source URL, source type, date
or update recency when known, and a concise AI-assisted synthesis. Recent sources
from the last six months SHOULD be preferred for tool behavior, product
capabilities, pricing, benchmarks, and company workflows. Older sources MAY be
included when they define durable concepts, but they MUST be labeled as durable
or historical context rather than current news.

Rationale: GenAI engineering changes too quickly for undated summaries or
opaque references to be trustworthy.

### III. Spec-Driven Product Clarity

Business intent, audience, requirements, and acceptance criteria MUST live in
Spec Kit artifacts before substantial implementation changes. Feature work MUST
be traceable from `spec.md` to `plan.md` to `tasks.md`, with implementation
tasks grouped by independently testable user value. If behavior changes, the
corresponding spec MUST be updated in the same change set.

Rationale: AI-assisted development becomes reliable when the maintained
specification is the source of truth, not a prompt lost in chat history.

### IV. Open Source by Default

The repository MUST be understandable, forkable, and locally runnable without
private services. Public documentation MUST explain the product purpose, local
setup, content model, contribution expectations, and license. Secret material,
private workspace data, analytics keys, and account-specific agent credentials
MUST NOT be committed.

Rationale: the project is intended to be shared, audited, extended, and improved
by other developers.

### V. Accessible, Durable Reading Experience

The product MUST remain usable as a static web application with no mandatory
account, database, tracking, or paid API. The primary interface MUST support
fast scanning, search/filtering, source inspection, and deep reading on desktop
and mobile. Visual design MUST favor dense, professional information work over
marketing-style hero pages.

Rationale: senior developers need a reliable observatory they can revisit, fork,
and browse quickly during real work.

## Content & Curation Standards

- Categories MUST map to durable professional questions: context engineering,
  agentic coding workflows, team process, evaluation, security, tooling,
  enterprise adoption, and research/benchmarks.
- Each resource MUST include a practical senior takeaway and a "use when"
  framing that helps decide whether to read it now.
- Vendor sources MUST be clearly labeled. The product SHOULD balance vendor
  narratives with independent research, reports, or empirical studies.
- Existing long-form modules MAY remain as internal dossiers when they add
  value, but the product navigation MUST not present the whole experience as a
  linear certification path.

## Development Workflow & Quality Gates

- Before implementation: write or update the relevant Spec Kit artifacts.
- During implementation: keep data models and UI components small, typed, and
  easy to extend without coupling content to presentation.
- Before completion: run TypeScript validation and a production build when
  dependencies are available; run a browser smoke check for meaningful UI
  changes.
- Documentation changes are first-class product work. README, spec artifacts,
  and contribution guidance MUST stay aligned with the shipped behavior.

## Governance

This constitution supersedes conflicting informal project guidance. Amendments
require an update to this file, a Sync Impact Report, and review of affected Spec
Kit templates or feature specs. Versioning follows semantic versioning:

- MAJOR: principles are removed or redefined incompatibly.
- MINOR: principles or governance sections are added or materially expanded.
- PATCH: wording, clarifications, or non-semantic refinements.

All pull requests and AI-generated changes MUST be reviewed for compliance with
these principles before merge.

**Version**: 1.0.0 | **Ratified**: 2026-04-26 | **Last Amended**: 2026-04-26
