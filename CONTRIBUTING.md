# Contributing To Observatoire DevIA

Contributions are welcome when they improve the signal of the observatory for
senior software engineers.

This project is intentionally LLM-native: you can use Codex, Claude Code,
Cursor, Copilot coding agent or another coding agent to prepare a contribution.
The maintainer still expects a reviewed PR, not a raw dump of generated content.

## What To Contribute

- A high-signal article, report, paper, product engineering post or case study.
- A public watch list, GitHub repo, README or JSON file containing many links.
- Better categorization, article summaries, source metadata or editorial
  framing.
- Corrections to outdated resources.

Avoid:

- Beginner chatbot tutorials.
- Framework-first tutorials unless they teach a durable senior practice.
- Pure vendor marketing with no useful operational detail.
- Bulk imports without curation.

## Prompt For A Coding Agent

Paste this prompt into Codex, Claude Code or another coding agent after replacing
`<URL_TO_ANALYZE>` with an article, repo, README or watch list.

```text
You are contributing to the open source Observatoire DevIA repository.

Input source:
<URL_TO_ANALYZE>

Goal:
Analyze this source and prepare a pull request that adds only high-signal
resources for senior software engineers working with GenAI, coding agents,
context engineering, team processes, evals, observability, security,
enterprise adoption or critical research.

Before editing:
1. Read AGENTS.md.
2. Read README.md.
3. Read specs/001-open-source-devia-observatory/spec.md.
4. Read specs/002-watch-source-ingestion/spec.md.
5. Inspect lib/resources.ts to understand the existing category model.

Files you are allowed to edit for a resource/watch contribution:
- lib/resources.ts
- README.md only if the contribution workflow or public documentation changes
- CONTRIBUTING.md only if the contribution workflow changes
- AGENTS.md only if agent instructions need to change
- specs/002-watch-source-ingestion/* only if the ingestion behavior changes
- specs/001-open-source-devia-observatory/* only if public product behavior changes

Files you must not edit for a normal article/watch contribution:
- app/*
- components/*
- core/*
- content/*
- package.json
- package-lock.json
- scripts/*
- .github/workflows/*

Rules:
- Do not import everything.
- Deduplicate existing URLs.
- Prefer recent sources for tools and product capabilities.
- Keep older sources only when they describe a durable concept.
- Reject beginner tutorials and framework-first content.
- Write all final summaries in French.
- Keep `synthesis` as a short "what this is about" framing.
- For each article/watch resource, add `articleSummary`: a richer explanation
  of the important information, roughly ten lines when useful, without treating
  the line count as a fixed constraint.
- Do not copy long excerpts from sources.
- Preserve source traceability.
- Fill `author` with the canonical person, company, lab or organization behind
  the resource so the Watchtower can be filtered by "who wrote it".

Implementation:
1. If the input is a repo/list/README, add or update watchSources in
   lib/resources.ts with source owner, URL, import date, candidate count,
   selected count and selection strategy.
2. Add selected resources to the best existing ResourceCategory.
3. Create a new category only if no existing category fits and the category is
   framework-agnostic and durable.
4. For every resource, fill title, publisher, author, url, date, kind,
   sourceType, freshness, tags, synthesis, seniorTakeaway and useWhen. For
   article/watch resources, also fill `articleSummary` so readers can understand
   the source without opening it immediately.
5. Normalize author values when several publisher labels point to the same
   writer or organization, for example "Linear Docs" and "Linear Changelog" ->
   "Linear". Keep individual authors or tech influencers as their own author
   value.
6. Update README.md or specs only if the contribution changes the model,
   contribution workflow or public behavior.

Validation:
- Run npm run typecheck.
- Run npm run build.
- Run npm run check:contribution-scope.

Pull request:
Open a PR with:
- the input source URL,
- resources selected,
- resources rejected and why,
- categories changed,
- validation commands run,
- any uncertainty that needs maintainer review.
```

## Files To Edit

For a normal article or watch-list contribution, edit only:

- `lib/resources.ts`: add resources, categories or `watchSources`.
- `README.md`: only when public contribution docs need to change.
- `CONTRIBUTING.md`: only when the agent contribution prompt changes.
- `AGENTS.md`: only when agent behavior instructions change.
- `specs/002-watch-source-ingestion/`: only when ingestion behavior changes.
- `specs/001-open-source-devia-observatory/`: only when public product behavior changes.

Do not edit these files in a content-only PR:

- `app/`
- `components/`
- `core/`
- `content/`
- `package.json`
- `package-lock.json`
- `scripts/`
- `.github/workflows/`

The CI workflow `Contribution Scope` emits a non-blocking warning when
`lib/resources.ts` is modified together with protected files.

## Manual Checklist

Before opening a PR:

- [ ] I read `AGENTS.md`.
- [ ] I added only selected, high-signal resources.
- [ ] Every resource has a source URL.
- [ ] Every resource has an `author` value usable for Watchtower filtering.
- [ ] Summaries are original, in French, and dense enough to capture the
      important information from each article.
- [ ] Vendor, independent and community sources are labeled correctly.
- [ ] I did not edit UI, architecture, package or workflow files for a content-only PR.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] `npm run check:contribution-scope` has no scope warning, or the warning is explained in the PR.

## Data Model

Resources live in `lib/resources.ts`.

For each resource, provide:

- `title`
- `publisher`
- `author`
- `url`
- `date`
- `kind`
- `sourceType`
- `freshness`
- `tags`
- `synthesis`
- `articleSummary` for article/watch resources
- `seniorTakeaway`
- `useWhen`

Use `author` as the canonical filter label for who wrote the resource. It can
be a company, lab, standards body, individual author or tech influencer. Keep
`publisher` for the visible source label when it is more specific than the
author, such as `GitHub Changelog` with author `GitHub`.

If importing from a repo or watch list, also update `watchSources`.

## Review Expectations

Maintainers may ask you to remove low-signal links, shorten summaries, move a
resource to another category, or split a large PR. This is normal: the project
optimizes for signal, not volume.
