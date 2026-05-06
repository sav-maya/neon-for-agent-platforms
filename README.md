# Neon for Agent Platforms

Sample code and a companion skill for the **[Neon AI Agent Program](https://neon.com/use-cases/ai-agents)**—when **your product** provisions Neon Postgres **for each customer** (agent platforms, codegen tools, multi-tenant SaaS). The companion topic follows the open **[Agent Skills](https://agentskills.io/home)** format ([specification](https://agentskills.io/specification)); this repo adds **runnable `examples/`** beside the skill for partners.

**Official Neon docs (pricing, limits, product behavior):** [neon.com](https://neon.com) — **[Agent Plan](https://neon.com/docs/introduction/agent-plan)** · **[AI Agent integration](https://neon.com/docs/guides/ai-agent-integration)** · **[Database versioning](https://neon.com/docs/ai/ai-database-versioning)**.

---

## Start here (Agent Program partners)

Use this section as the **single entry point** for this repository after Neon has accepted you into the program. Everything else below is background or deep links.

### 1. Accounts, orgs, and keys

Agent Program partners typically use **two Neon organizations** (free-tier users vs paying customers). Store **both org IDs**, **organization API keys** for automation inside each org, and a **personal API key** for **[project transfer](https://neon.com/docs/manage/orgs-project-transfer)** between orgs. Follow **[Before you begin](https://neon.com/docs/guides/ai-agent-integration)** in the integration guide.

### 2. Product routes

Two common product shapes; **script names and env vars** are in **[examples/api-scripts/README.md](examples/api-scripts/README.md)**.

- **Route 1** — Postgres *inside* your product (embedded, sandboxes, previews): provision with **create-project**, branch with **branch**, undo/time-travel with **versioning-flow** / **snapshot** / **restore-snapshot**, delete with **delete-project** (npm scripts — see [examples/api-scripts README](examples/api-scripts/README.md)).
- **Route 2** — Each **generated app** gets its own DB: same scripts; aim for **one Neon project per customer app**. See Neon’s **[AI Agent integration guide](https://neon.com/docs/guides/ai-agent-integration)**.

**Which API?** [Neon Auth](https://neon.com/docs/neon-auth/api) (app users under `…/auth/users`) is not [Postgres roles](https://neon.com/docs/manage/users) (connection users) or [consumption / billing metrics](https://neon.com/docs/guides/consumption-metrics). Run **`auth-users.ts meta`** for a short routing summary.

For fleet **two-org** patterns (create → transfer → consume → delete), read **[examples/FLEET_AND_ORG_LAYOUT.md](examples/FLEET_AND_ORG_LAYOUT.md)**.

### 3. Clone and run the examples

```bash
git clone https://github.com/neondatabase/neon-for-agent-platforms.git
cd neon-for-agent-platforms/examples/api-scripts
npm install
cp .env.example .env
# Node 20+: load vars from .env — see .env.example for each script
node --env-file=.env --import tsx/esm create-project.ts
node --env-file=.env --import tsx/esm branch.ts list
node --env-file=.env --import tsx/esm consumption-query.ts
node --env-file=.env --import tsx/esm auth-users.ts meta
```

**Snapshots + restore (database versioning):**

```bash
# NEON_API_KEY + NEON_PROJECT_ID in .env
node --env-file=.env --import tsx/esm versioning-flow.ts
# Optional: DEMO_MUTATE=1 for a visible restore demo
```

**Full script list, env vars, and commands:** [examples/api-scripts/README.md](examples/api-scripts/README.md).

### 4. AI assistants in your editor (recommended)

Install Neon’s baseline skill, then this repo’s Agent Program companion:

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
npx skills add neondatabase/agent-skills -s neon-postgres-agent-platforms
```

Or bootstrap skills + MCP: `npx neonctl@latest init` — [Agent Skills on Neon](https://neon.com/docs/ai/agent-skills).

---

## What’s in this repository

### Layout (Agent Skills + examples)

The **[Agent Skills directory model](https://agentskills.io/home#what-are-agent-skills)** is: `SKILL.md` + optional `scripts/`, `references/`, `assets/`. This repo implements that under **`skills/neon-postgres-agent-platforms/`** and also ships **Management API sample code** at the root for the Agent Program (not duplicated inside the skill folder). Details: **[skills/README.md](skills/README.md)**.

```
neon-for-agent-platforms/
├── examples/
│   └── api-scripts/          # Runnable TypeScript samples (Management API) — partner engineering
├── skills/
│   ├── README.md
│   └── neon-postgres-agent-platforms/   # Agent Skills–shaped companion topic
│       ├── SKILL.md
│       ├── references/
│       ├── scripts/          # See scripts/README (automation lives in examples/)
│       └── assets/           # See assets/README (optional; env patterns in examples)
```


| Path                                             | Purpose                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[examples/api-scripts/](examples/api-scripts/)` | **Runnable samples** — [@neondatabase/api-client](https://www.npmjs.com/package/@neondatabase/api-client); thin [lib/neon-client.ts](examples/api-scripts/lib/neon-client.ts) wrapper (TypeScript + `tsx` — [examples/api-scripts/README.md](examples/api-scripts/README.md)). |
| `[skills/](skills/README.md)`                    | **Agent Skills layout** — companion [neon-postgres-agent-platforms](skills/neon-postgres-agent-platforms/) ([SKILL.md](skills/neon-postgres-agent-platforms/SKILL.md) + `references/`). Use with **[neon-postgres](https://github.com/neondatabase/agent-skills)**.                               |


Hub for `examples/`: [examples/README.md](examples/README.md).

---

## Program model (reference)

### Two Neon organizations


| Org                    | Who it serves                                           |
| ---------------------- | ------------------------------------------------------- |
| **Sponsored free org** | Your free-tier users (within program rules on neon.com) |
| **Paid org**           | Paying customers (metered per Agent Plan)               |


Your control plane chooses **which org** when creating a tenant project. Upgrades often mean **[transferring](https://neon.com/docs/manage/orgs-project-transfer)** the project into the paid org and **raising quotas**.

### API keys (two kinds)

- **Organization API key** — automate work **inside one** org.
- **Personal API key** — required to **transfer** a project **between** orgs.

### One project per tenant

Neon’s recommended pattern is **one Neon project per customer app**. Details: **[AI Agent integration guide](https://neon.com/docs/guides/ai-agent-integration)**.

```mermaid
flowchart LR
  subgraph yours [Your platform]
    CP[Control plane]
  end
  subgraph neon_free [Neon — sponsored org]
    F[Free-tier DBs]
  end
  subgraph neon_paid [Neon — paid org]
    P[Paid DBs]
  end
  CP -->|"Org API key"| F
  CP -->|"Org API key"| P
```



---

## Further reference


| Resource                                                          | Use when                                            |
| ----------------------------------------------------------------- | --------------------------------------------------- |
| [Examples hub](examples/README.md)                                | Short map of `api-scripts` + cross-links            |
| [Fleet & org layout](examples/FLEET_AND_ORG_LAYOUT.md)            | Two-org flows: create → transfer → consume → delete |
| [Agent Plan](https://neon.com/docs/introduction/agent-plan)       | Pricing, credits, program details                   |
| [Agent Skills repo](https://github.com/neondatabase/agent-skills) | `neon-postgres` bundle                              |
| [AI Agent Platforms](https://neon.com/use-cases/ai-agents)        | Apply / program overview on neon.com                |


---

## Contributing

Lint, format, and typecheck for `examples/**/*.ts`: repo root — `npm install`, `npm run lint`, `npm run fmt:check`, `npm run typecheck`. Format: **`npm run fmt`**. Agent guidance: **[AGENTS.md](AGENTS.md)**.

---

## Support

- **Shared Slack channel** — Agent Program participants get direct access to the Neon team
- **Email** — [agents@neon.tech](mailto:agents@neon.tech) for limit increases and account requests (include org IDs and context)
- **HIPAA (Agent Plan)** — Requirements and enablement: [HIPAA on Neon](https://neon.com/docs/security/hipaa) (contact your Neon representative)
- **Docs** — [neon.com/docs](https://neon.com/docs) · [API reference](https://api-docs.neon.tech)

## License

Apache 2.0 — [LICENSE](LICENSE)