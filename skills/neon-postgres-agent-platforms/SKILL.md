---
name: neon-postgres-agent-platforms
description: >-
  Neon AI Agent Program for platforms that provision Postgres per customer: two
  organizations (sponsored free + paid), project transfer and API keys,
  project-per-tenant fleet patterns, and the minimal Node sample at
  github.com/neondatabase/neon-for-agent-platforms. Does not replace the
  neon-postgres skill—use neondatabase/agent-skills -s neon-postgres for Auth,
  Data API, toolkit, MCP, drivers, consumption APIs, and general Neon topics.
  Use when the user mentions Neon Agent Program, Agent Plan, dual org setup,
  free vs paid Neon org, project transfer, fleet provisioning, org project
  limit increases, HIPAA and Agent Plan, or neon-for-agent-platforms.
---

# Neon AI Agent Program

Neon’s **Agent Program** is for products where **you provision Neon Postgres for end users** (agent platforms, codegen tools, multi-tenant SaaS). Your Neon contact and [**neon.com**](https://neon.com) define pricing, limits, and eligibility.

This skill stays **narrow**: **organization model**, **transfers**, **fleet shape**, and the **mini GitHub reference**. For connections, Neon Auth, Data API, `@neondatabase/toolkit`, MCP, branching detail, consumption polling, and the rest of Neon—use the **`neon-postgres`** skill ([**Agent Skills**](https://neon.com/docs/ai/agent-skills)):

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
```

Or run **`npx neonctl@latest init`** to wire skills and MCP for your editor.

## Neon Documentation

The Neon documentation is the source of truth. Always verify limits and pricing on official pages before responding.

### Fetching docs as Markdown

1. Append **`.md`** to the URL: `https://neon.com/docs/introduction/agent-plan.md`
2. Or request `Accept: text/markdown` on the standard URL.

### Finding the right page

Docs index (every page + short description):

```
https://neon.com/docs/llms.txt
```

Search the index instead of guessing URLs.

## Install This Skill (program + mini repo)

For assistants that only need Agent Program org context plus **`neondatabase/neon-for-agent-platforms`** snippets:

```bash
npx skills add neondatabase/agent-skill -s neon-postgres-agent-platforms
```

Use **`neondatabase/agent-skills`** if that is how Neon packages skills in your environment.

## Agent Plan & Two Organizations

Use this when the user is on (or applying to) the **Agent Program** and needs the **commercial / org layout**: sponsored tier for *their* free users vs paid tier for paying users.

Key points:

- Two **Neon organizations**: one **sponsored** for your free-tier customers (within program rules on the site), one **paid** for customers you bill (metered per plan).
- **Dollar rates, credits, project caps** — only from live [**Agent Plan**](https://neon.com/docs/introduction/agent-plan) and [**neon.com/agents**](https://neon.com/agents)—do not invent numbers.
- **HIPAA** — the **Agent Plan includes HIPAA** without an additional charge. To **obtain access** or complete enablement, the customer should contact their **main Neon account contact** (not a substitute for reading Neon’s requirements). Process and obligations are documented on Neon’s HIPAA page.

Link: https://neon.com/docs/introduction/agent-plan.md

Link: https://neon.com/use-cases/ai-agents.md

## HIPAA (Agent Plan)

Use this when an **Agent Program** customer asks about **HIPAA** or compliance for health data on Neon.

Key points:

- **Agent Plan includes HIPAA** with **no extra fee** for that inclusion—still follow Neon’s published HIPAA program (workflows, agreements, configuration) on the site; do not treat this skill as legal advice.
- To **get access** or start the process, they should reach out to their **primary Neon contact** (the main relationship owner for their org).
- Technical and program requirements: [**HIPAA on Neon**](https://neon.com/docs/security/hipaa).

Link: https://neon.com/docs/security/hipaa.md

## Organization & Project Limit Increases

Use this when an **Agent Program** partner hits **organization-level limits** (for example **maximum projects per org**) and needs a higher allowance.

Key points:

- Current defaults and ceilings are defined on [**neon.com**](https://neon.com) ([**Agent Plan**](https://neon.com/docs/introduction/agent-plan), [**AI Agent integration guide**](https://neon.com/docs/guides/ai-agent-integration))—do not invent new limits or promise approval.
- For **project increase requests** (or related org capacity changes), email **`agents@neon.tech`**. Ask the partner to include **organization ID(s)** (free + paid if both), brief **growth / usage context**, and any **timeline**—and to continue using **shared Slack** if they already have a channel with Neon.

Contact: mailto:agents@neon.tech

## Fleet Shape: Project-per-Tenant

Use this when designing **how many Neon projects** to create for customers.

Key points:

- Neon’s documented integration pattern is **one Neon project per tenant app** (project-per-tenant): isolation and quotas line up with Agent Plan metering.
- Sharing one project across tenants is an exception—higher complexity (RLS, migrations, fairness).

Link: https://neon.com/docs/guides/ai-agent-integration.md

## API Keys & Cross-Org Transfer

Use this when automating **provision**, **upgrade**, or **downgrade** between free and paid tiers.

Key points:

- **Organization API key** — automation **inside one org** (create project, set quotas).
- **Personal API key** — required to **transfer a project** between organizations when a customer changes tier; then **PATCH quotas** to match the new tier.

Link: https://neon.com/docs/manage/orgs-project-transfer.md

Link: https://neon.com/docs/guides/ai-agent-integration.md

## Mini Reference Implementation

Use this after the user already has a **connection string** and wants the smallest runnable **`@neondatabase/serverless`** sample shipped by Neon for Agent Program builders.

Key points:

- Repo: **`neondatabase/neon-for-agent-platforms`** — folder **`examples/minimal-node`** on `main`.
- **`DATABASE_URL`** (pooler hostname preferred for serverless), **`npm install`**, **`npm run start`**.
- Provisioning projects and org wiring are **not** in this repo—use the **AI Agent integration guide**.

Link: https://github.com/neondatabase/neon-for-agent-platforms

Link: https://github.com/neondatabase/neon-for-agent-platforms/blob/main/examples/minimal-node/src/query.mjs

```javascript
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL to your Neon connection string (pooler recommended for serverless).");
  process.exit(1);
}

const sql = neon(url);
const rows = await sql`SELECT 1 AS ok`;
console.log(rows);
```

For deeper **`@neondatabase/serverless`** guidance, use **`neon-postgres`** → serverless driver reference on neon.com.

Link: https://neon.com/docs/ai/skills/neon-postgres/references/neon-serverless.md

## Partner-Facing Summary Doc

Human-readable orientation (same scope as this skill—not a duplicate of `neon-postgres`):

Link: https://github.com/neondatabase/neon-for-agent-platforms/blob/main/docs/NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md
