---

## name: neon-postgres-agent-platforms

description: >-
  Neon AI Agent Program for platforms that provision Postgres per customer: two
  organizations (sponsored free + paid), project transfer and API keys,
  project-per-tenant fleet patterns, snapshots and database versioning
  (checkpoints), dev vs prod environments via branching, cost implications and
  consumption tracking, agent plan features and pricing summary, co-marketing
  opportunities, technical and billing support channels, and the repo’s README
  quick start plus examples/minimal-node and examples/api-scripts (REST) at
  github.com/neondatabase/neon-for-agent-platforms. Always install **after**
  neon-postgres from agent-skills first (baseline platform knowledge). For Agent
  Program and agent-platform builders, this topic is the required companion—not
  optional. Does not replace the neon-postgres skill—use
  neondatabase/agent-skills -s neon-postgres for Auth, Data API, toolkit, MCP,
  drivers, and general Neon topics. Use when the
  user mentions Neon Agent Program, Agent Plan, dual org setup, free vs paid
  Neon org, project transfer, fleet provisioning, snapshots, checkpoints,
  database versioning, agent plan pricing, co-marketing, org project limit
  increases, HIPAA and Agent Plan, or neon-for-agent-platforms.

# Neon AI Agent Program

Neon’s **Agent Program** is for products where **you provision Neon Postgres for end users** (agent platforms, codegen tools, multi-tenant SaaS). Your Neon contact and **[neon.com](https://neon.com)** define pricing, limits, and eligibility.

## Start here: install Neon's agent skills

**Step 1** — Install Neon's primary skill from **[github.com/neondatabase/agent-skills](https://github.com/neondatabase/agent-skills)**. This gives your AI assistant full Neon platform knowledge (Auth, Data API, `@neondatabase/toolkit`, MCP, drivers, branching, consumption APIs, and more):

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
```

Or bootstrap skills + MCP together: `**npx neonctl@latest init**` — see [Agent Skills docs](https://neon.com/docs/ai/agent-skills).

**Step 2** — If you are on the **Neon AI Agent Program** or building an **agent platform** that provisions Postgres for end users, install this companion skill. It is **required** for that context (org layout, transfers, fleet patterns, quotas, cost guidance). It is not a substitute for Step 1:

```bash
npx skills add neondatabase/agent-skills -s neon-postgres-agent-platforms
```

Teams using Neon **without** the Agent Program / per-customer provisioning model may rely on Step 1 alone. Everyone else should use **both** steps. **Do not** rely on this skill alone for full Neon guidance—`neon-postgres` stays mandatory as the platform baseline.

## Neon Documentation

The Neon documentation is the source of truth. Always verify limits and pricing on official pages before responding.

### Fetching docs as Markdown

1. Append `**.md`** to the URL: `https://neon.com/docs/introduction/agent-plan.md`
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

## Cost Implications & Tracking

Use this when a partner asks about **pricing**, **cost optimization**, or **consumption monitoring** for their fleet.

Key points — pricing (paid org only, free org is $0):

- **Compute**: $0.106/CU-hour (roughly half of standard Scale pricing at $0.222)
- **Storage**: $0.35/GB-month
- **Instant restore (PITR)**: $0.20/GB-month for change history
- **Snapshots**: $0.09/GB-month (after Beta, starting May 1, 2026)
- **Extra branches**: $1.50/branch-month (beyond plan allowance)
- **Public network transfer**: 100 GB included, then $0.10/GB
- **Initial credits**: up to **$25,000** for the paid org

Key points — cost optimization levers:

- **Scale-to-zero**: Most tenant databases are idle most of the time. Set `suspend_timeout_seconds` aggressively (300s for free, 60s–300s for paid).
- **Autoscaling caps**: Set `autoscaling_limit_max_cu` per project to prevent runaway compute. Free: max 2 CU. Paid: up to 16 CU.
- **Per-project quotas**: Configure `active_time_seconds`, `logical_size_bytes`, `compute_time_seconds`, `data_transfer_bytes` on project creation or via PATCH.
- **Branch cleanup**: Delete old dev branches and orphaned `(old)` branches after restores.
- **Snapshot rotation**: Delete snapshots no longer needed; use `expires_at` for automatic cleanup.

Key points — consumption tracking:

- On **usage-based plans** (Launch, Scale, Agent, Enterprise), use `**GET /api/v2/consumption_history/v2/projects`** for metrics that match billing (`compute_unit_seconds`, branch storage byte-hours, transfer bytes, etc.). Legacy endpoints return different fields — see Neon’s consumption docs.
- Poll about every **15 minutes** (Neon’s update cadence). Polling does **not** wake suspended computes.
- Alert users at **80%** and **95%** of their quota to prevent unexpected suspension.
- Routing index (Auth `/users` vs Postgres roles vs consumption): [REST_API_META.md](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/docs/REST_API_META.md) in this repo.

Link: [https://neon.com/docs/introduction/agent-plan.md](https://neon.com/docs/introduction/agent-plan.md)

Link: [https://neon.com/docs/guides/consumption-metrics.md](https://neon.com/docs/guides/consumption-metrics.md)

Link: [https://neon.com/docs/guides/consumption-limits.md](https://neon.com/docs/guides/consumption-limits.md)

Link: [https://neon.com/docs/introduction/cost-optimization.md](https://neon.com/docs/introduction/cost-optimization.md)

## Agent Plan Features Summary

Use this when a partner asks **what's included** in the Agent Plan. Do not invent numbers — verify against live docs. This summary reflects the docs as of April 2026.

Key points — database and compute:

- Up to **30,000 projects per org** (can request increases via `agents@neon.tech`)
- **25 branches per project** (paid), 10 (free)
- Autoscaling up to **16 CU** (paid) or **2 CU** (free); fixed computes up to 56 CU on paid
- **Scale to zero**: configurable 1 min to always-on (paid); 5 min fixed (free)
- Up to **16 TB** logical data per branch

Key points — APIs and services:

- **Neon Auth** — managed auth built on Better Auth (up to 1M MAU on paid)
- **Data API** — PostgREST-compatible REST API for direct DB access
- **Management API** — full CRUD for projects, branches, snapshots, quotas
- **Higher rate limits** on both Management and Data APIs for Agent Plan

Key points — versioning and recovery:

- **Instant restore** with up to **30-day** restore window (paid), 1-day (free)
- **10 manual snapshots** per project (paid), 1 (free)
- Copy-on-write branching for dev environments

Key points — security and compliance:

- SOC 2, SOC 3, ISO 27001, ISO 27701, GDPR, CCPA
- **HIPAA** included (contact Neon to enable)
- **Protected branches**, **IP Allow**, **Private Networking** (AWS PrivateLink)

Key points — monitoring:

- **14-day** monitoring retention (paid)
- **Metrics/logs export** to Datadog or OTel-compatible platforms

Key points — what's NOT included:

- **Automated backup schedules** are not available on the Agent Plan (build your own via API)

Link: [https://neon.com/docs/introduction/plans.md](https://neon.com/docs/introduction/plans.md)

Link: [https://neon.com/docs/introduction/agent-plan.md](https://neon.com/docs/introduction/agent-plan.md)

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

Use this when the user wants runnable code from `**neondatabase/neon-for-agent-platforms`**. There is **no** separate “mini reference” doc—the **[repository README](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/README.md)** is the single entry point for clone, install, and quick start.

**Smallest query (`examples/minimal-node`):** `**DATABASE_URL`**, `**npm install**`, `**npm run start**` — `**pg**` + one query after the user has a connection string.

Link: [https://github.com/neondatabase/neon-for-agent-platforms/blob/main/examples/minimal-node/src/query.mjs](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/examples/minimal-node/src/query.mjs)

**REST automation (`examples/api-scripts`):** **[Fleet provisioning & org layout](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/examples/FLEET_AND_ORG_LAYOUT.md)** · Full script list, env vars, and flows: `[examples/api-scripts/README.md](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/examples/api-scripts/README.md)`. Neon Console API v2 via **`fetch`**, shared `[neon-client.mjs](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/examples/api-scripts/lib/neon-client.mjs)`. Patterns are **adapted and simplified** from the open-source app [Aileen](https://github.com/andrelandgraf/aileen) (`**src/lib/neon.ts`** — project/branch/snapshot/delete flows). This repo adds fleet-oriented scripts (create/delete project, branches, snapshots + `**versioning-flow.mjs**` [restore](https://neon.com/docs/ai/ai-database-versioning), org transfer, consumption `**v2**`, Neon Auth users; run `**auth-users.mjs meta**` for REST vs Postgres roles). Routing index: `[REST_API_META.md](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/docs/REST_API_META.md)`.

For full product guidance on provisioning fleets and org layout, use the **AI Agent integration guide** on neon.com alongside these samples.

```javascript
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL to your Neon connection string.");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  const result = await client.query("SELECT 1 AS ok");
  console.log(result.rows);
} finally {
  await client.end();
}
```

For connection patterns beyond this repo’s `**pg**` example (pooling, HTTP, framework adapters), use `**neon-postgres**` from **agent-skills** and neon.com docs.

## Partner-facing docs in this repo

- **Program model + how to run the samples:** [README](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/README.md) (authoritative for this repository).
- **Post-call addendum** (link table, HIPAA, optional Aileen): [NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/docs/NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md)

