---
name: neon-postgres-agent-platforms
description: >-
  Agent Program and agent-platform context: dual Neon orgs (sponsored free + paid),
  org vs personal API keys, project transfer, fleet provisioning, snapshots and
  database versioning, branching, consumption v2, Agent Plan rates and entitlements,
  co-marketing, support, and neondatabase/neon-for-agent-platforms sample code.
  Required companion to neon-postgres (install that first from neondatabase/agent-skills).
  Does not replace neon-postgres. Use when users mention Neon Agent Program, Agent Plan,
  dual org, free vs paid Neon org, transfer, fleet, snapshots, checkpoints, database
  versioning, pricing, org project limits, HIPAA, or neon-for-agent-platforms.
license: Apache-2.0
---

# Neon AI Agent Program (companion skill)

**Partners cloning the repo:** follow **[README — Start here (Agent Program partners)](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/README.md#start-here-agent-program-partners)**, then **[Agent use cases](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/docs/AGENT_USE_CASES.md)** to map product shape → scripts. This file is for **assistants** (after **`neon-postgres`**); it does not replace that skill.

This directory follows the **[Agent Skills](https://agentskills.io/specification)** layout (`SKILL.md`, `references/`, `scripts/`, `assets/`). Runnable Console API samples live in **`examples/api-scripts/`** at the repository root — see **`scripts/README.md`** here.

Neon’s **Agent Program** is for products where **you provision Neon Postgres for end users** (agent platforms, codegen tools, multi-tenant SaaS). Your Neon contact and **[neon.com](https://neon.com)** define pricing, limits, and eligibility.

## Install Neon agent skills (order matters)

**Step 1** — Install Neon's primary skill from **[github.com/neondatabase/agent-skills](https://github.com/neondatabase/agent-skills)**. This gives your AI assistant full Neon platform knowledge (Auth, Data API, `@neondatabase/toolkit`, MCP, drivers, branching, consumption APIs, and more):

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
```

Or bootstrap skills + MCP together: `npx neonctl@latest init` — see [Agent Skills docs](https://neon.com/docs/ai/agent-skills).

**Step 2** — If you are on the **Neon AI Agent Program** or building an **agent platform** that provisions Postgres for end users, install this companion skill. It is **required** for that context (org layout, transfers, fleet patterns, quotas, cost guidance). It is not a substitute for Step 1:

```bash
npx skills add neondatabase/agent-skills -s neon-postgres-agent-platforms
```

Teams using Neon **without** the Agent Program / per-customer provisioning model may rely on Step 1 alone. Everyone else should use **both** steps. **Do not** rely on this skill alone for full Neon guidance—`neon-postgres` stays mandatory as the platform baseline.

## Gotchas

Non-obvious facts agents often get wrong without this skill:

- **Install `neon-postgres` first** — This skill is a *companion*; it does not cover Auth, Data API, drivers, or general Neon how-tos.
- **Cross-org transfer** needs a **personal** API key (org keys only automate inside one org).
- **After a finalized snapshot restore**, the active **branch ID changes**; poll operations to completion before reconnecting; delete orphaned `(old)` branches to avoid storage cost.
- **Billing-aligned usage** — Prefer `GET /api/v2/consumption_history/v2/projects` over legacy consumption endpoints (fields differ).
- **Snapshot schedules** — Not provided on Agent Plan; partners implement via snapshot API + their own scheduler.
- **Rates and caps** — Never invent dollar amounts or limits; confirm on live neon.com docs for the question at hand.

## Neon Documentation

The Neon documentation is the source of truth. Always verify limits and pricing on official pages before responding.

### Fetching docs as Markdown

1. Append the `.md` suffix to the docs URL when you want raw Markdown (example: `https://neon.com/docs/introduction/agent-plan.md`).
2. Or request `Accept: text/markdown` on the standard URL.

### Finding the right page

Docs index (every page + short description):

```
https://neon.com/docs/llms.txt
```

Search the index instead of guessing URLs.

## Agent Plan & Two Organizations

Use this when the user is on (or applying to) the **Agent Program** and needs the **commercial / org layout**: sponsored tier for *their* free users vs paid tier for paying users.

Key points:

- Two **Neon organizations**: one **sponsored** for your free-tier customers (within program rules on the site), one **paid** for customers you bill (metered per plan).
- **Dollar rates, credits, project caps** — only from live **[Agent Plan](https://neon.com/docs/introduction/agent-plan)** and **[neon.com/agents](https://neon.com/agents)**—do not invent numbers.
- **HIPAA** — the **Agent Plan includes HIPAA** without an additional charge. To **obtain access** or complete enablement, the customer should contact their **main Neon account contact** (not a substitute for reading Neon’s requirements). Process and obligations are documented on Neon’s HIPAA page.

Link: [https://neon.com/docs/introduction/agent-plan.md](https://neon.com/docs/introduction/agent-plan.md)

Link: [https://neon.com/use-cases/ai-agents.md](https://neon.com/use-cases/ai-agents.md)

## HIPAA (Agent Plan)

Use this when an **Agent Program** customer asks about **HIPAA** or compliance for health data on Neon.

Key points:

- **Agent Plan includes HIPAA** with **no extra fee** for that inclusion—still follow Neon’s published HIPAA program (workflows, agreements, configuration) on the site; do not treat this skill as legal advice.
- To **get access** or start the process, they should reach out to their **primary Neon contact** (the main relationship owner for their org).
- Technical and program requirements: **[HIPAA on Neon](https://neon.com/docs/security/hipaa)**.

Link: [https://neon.com/docs/security/hipaa.md](https://neon.com/docs/security/hipaa.md)

## Organization & Project Limit Increases

Use this when an **Agent Program** partner hits **organization-level limits** (for example **maximum projects per org**) and needs a higher allowance.

Key points:

- Current defaults and ceilings are defined on **[neon.com](https://neon.com)** (**[Agent Plan](https://neon.com/docs/introduction/agent-plan)**, **[AI Agent integration guide](https://neon.com/docs/guides/ai-agent-integration)**)—do not invent new limits or promise approval.
- For **project increase requests** (or related org capacity changes), email `**agents@neon.tech`**. Ask the partner to include **organization ID(s)** (free + paid if both), brief **growth / usage context**, and any **timeline**—and to continue using **shared Slack** if they already have a channel with Neon.

Contact: mailto:[agents@neon.tech](mailto:agents@neon.tech)

## Fleet Shape: Project-per-Tenant

Use this when designing **how many Neon projects** to create for customers.

Key points:

- Neon’s documented integration pattern is **one Neon project per tenant app** (project-per-tenant): isolation and quotas line up with Agent Plan metering.
- Sharing one project across tenants is an exception—higher complexity (RLS, migrations, fairness).

Link: [https://neon.com/docs/guides/ai-agent-integration.md](https://neon.com/docs/guides/ai-agent-integration.md)

## API Keys & Cross-Org Transfer

Use this when automating **provision**, **upgrade**, or **downgrade** between free and paid tiers.

Key points:

- **Organization API key** — automation **inside one org** (create project, set quotas).
- **Personal API key** — required to **transfer a project** between organizations when a customer changes tier; then **PATCH quotas** to match the new tier.

Link: [https://neon.com/docs/manage/orgs-project-transfer.md](https://neon.com/docs/manage/orgs-project-transfer.md)

Link: [https://neon.com/docs/guides/ai-agent-integration.md](https://neon.com/docs/guides/ai-agent-integration.md)

## Snapshots & Database Versioning

Use this when an Agent Program partner needs **undo/redo**, **checkpoints**, or **version control** for tenant databases.

Key points:

- **Snapshots** capture a point-in-time state of a root branch. Free org projects get **1 manual snapshot**; paid org projects get **10 manual snapshots**.
- The recommended pattern is the **active branch pattern**: each tenant project has one root branch (production). Snapshots save versions. Restoring with `finalize_restore: true` replaces data in-place while **keeping the connection string stable**.
- Restoring with `finalize_restore: false` creates a **preview branch** with its own connection string — useful for "what if" exploration without touching production.
- After a finalized restore, the **branch ID changes** (the old branch becomes orphaned with `(old)` suffix). Update any stored branch IDs and delete orphaned branches to avoid storage costs.
- **Always poll operations** to completion before reconnecting — connections made before operations finish will hit the old state.
- Snapshots are **free during Beta**. Billing starts at **$0.09/GB-month** on May 1, 2026.
- **Snapshot scheduling** (automated backups) is **not available** on the Agent Plan. Partners can build their own via the snapshot creation API + a cron/scheduler.
- For recent history within the restore window, use **PITR** (point-in-time recovery): 1-day window in free org, up to 7-day window in paid org.

When to create snapshots:

- Before schema migrations
- Start of each agent session
- After successful operations (user-initiated save points)
- Before promoting changes to production

Link: [https://neon.com/docs/ai/ai-database-versioning.md](https://neon.com/docs/ai/ai-database-versioning.md)

Link: [https://neon.com/docs/guides/backup-restore.md](https://neon.com/docs/guides/backup-restore.md)

Demo repo: [https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo)

## Dev vs. Prod Environments

Use this when a partner needs **isolated development or preview environments** alongside production for their tenant projects.

Key points:

- Each tenant project can have a **production branch** (root/main) and **development branches** created from it via the API.
- Development branches are **instant** (copy-on-write), **fully isolated** (separate compute), and **cost-efficient** (only pay for storage diffs and compute time).
- Free org projects support up to **10 branches** total (including main). Paid org projects support up to **1,000 branches**.
- Set `suspend_timeout_seconds: 300` (5 min) on dev branches to keep costs low — they scale to zero when idle.
- Dev branches can be **reset** to match production at any time, or deleted after testing.
- Combine with snapshots: create a snapshot before promoting dev → prod, so you have a rollback point.

Link: [https://neon.com/docs/guides/ai-agent-integration.md](https://neon.com/docs/guides/ai-agent-integration.md)

## Cost, consumption, and Agent Plan entitlements

Default: give a **high-level** answer and point to live docs for numbers.

- **Never invent** pricing, quotas, or limits — confirm on **[Agent Plan](https://neon.com/docs/introduction/agent-plan)** and **[consumption metrics](https://neon.com/docs/guides/consumption-metrics)** for the user’s question.
- On usage-based plans, use `**GET /api/v2/consumption_history/v2/projects`** for billing-aligned fields; legacy endpoints differ.
- Poll consumption about every **15 minutes**; polling does not wake suspended computes.
- Routing index (Auth users vs Postgres roles vs consumption): [REST_API_META.md](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/docs/REST_API_META.md).

**When the user needs line-item rates, full entitlement matrices, or consumption semantics**, read **[references/pricing-and-plan-features.md](references/pricing-and-plan-features.md)** (progressive disclosure — keeps `SKILL.md` lean).

Quick links: [Agent Plan](https://neon.com/docs/introduction/agent-plan.md) · [Consumption metrics](https://neon.com/docs/guides/consumption-metrics.md) · [Consumption limits](https://neon.com/docs/guides/consumption-limits.md) · [Cost optimization](https://neon.com/docs/introduction/cost-optimization.md) · [Plans](https://neon.com/docs/introduction/plans.md)

## Co-Marketing

Use this when a partner asks about **joint marketing opportunities** with Neon.

Key points:

- Co-marketing is an included **Agent Plan benefit**.
- Available opportunities: **joint blog posts**, **social promotion** from Neon's channels, **hackathon sponsorship/support**, **case studies**, and landing page features.
- To get started, the partner should reach out via their **shared Slack channel** with Neon or contact their **Neon representative** directly.
- Provide context on what they're building, user/growth numbers, and the type of co-marketing they're interested in.

Link: [https://neon.com/docs/introduction/agent-plan.md](https://neon.com/docs/introduction/agent-plan.md)

## Support

Use this when a partner asks about getting **technical help**, **billing support**, or **limit increases**.

Key points:

- **Shared Slack channel**: Every Agent Plan participant gets a dedicated Slack channel with direct access to the Neon team. This is the fastest path for technical questions and urgent issues.
- **Neon representative**: Each partner has a primary contact at Neon for account-level requests, custom configuration, and escalations.
- **Limit increases** (project caps, rate limits, etc.): Email `**agents@neon.tech`** with org ID(s), growth context, and timeline. Also flag in the shared Slack channel.
- **Billing questions**: Raise via the shared Slack channel or through the Neon representative. Credit balances and invoices are visible in the Neon Console under Billing for each org.
- **Priority support**: Agent Plan participants receive faster response times for platform-critical issues.
- **Community resources**: [Neon Discord](https://discord.gg/92vNTzKDGp), [Neon documentation](https://neon.com/docs), [API reference](https://api-docs.neon.tech).

Contact: mailto:[agents@neon.tech](mailto:agents@neon.tech)

## neon-for-agent-platforms repository samples

Use when the user wants runnable **Management API** automation from **[neondatabase/neon-for-agent-platforms](https://github.com/neondatabase/neon-for-agent-platforms)**.

There is **no** separate “mini reference” doc—the **[repository README](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/README.md)** (**Start here** section) is the human entry point. **All** runnable scripts live under `**examples/api-scripts/`**:

- **[Fleet provisioning & org layout](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/examples/FLEET_AND_ORG_LAYOUT.md)** — two-org mental model.
- **[examples/api-scripts/README.md](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/examples/api-scripts/README.md)** — full script list, env vars, commands.
- Shared client: **[neon-client.mjs](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/examples/api-scripts/lib/neon-client.mjs)** (`fetch` to Console API v2). Patterns are **adapted and simplified** from [Aileen](https://github.com/andrelandgraf/aileen) (`src/lib/neon.ts`). Fleet-oriented flows include create/delete project, branches, snapshots + **versioning-flow.mjs** ([database versioning](https://neon.com/docs/ai/ai-database-versioning)), org transfer, consumption **v2**, Neon Auth users (`auth-users.mjs meta` for REST vs Postgres roles). Routing index: **[REST_API_META.md](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/docs/REST_API_META.md)**.

For **SQL access from application code** (drivers, pooling, ORMs), use `**neon-postgres`** from agent-skills and **[neon.com/docs](https://neon.com/docs)**—this repo does not ship a separate minimal query sample.

For full product guidance on provisioning fleets and org layout, use the **[AI Agent integration guide](https://neon.com/docs/guides/ai-agent-integration)** on neon.com alongside these samples.

## Partner-facing docs in this repo

- **Single onboarding path:** [README — Start here](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/README.md#start-here-agent-program-partners).
- **Post-call addendum:** [NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/docs/NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md)

