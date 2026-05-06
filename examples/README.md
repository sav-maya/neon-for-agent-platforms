# Examples

Follow **[README § Start here](../README.md#start-here-agent-program-partners)** first. Runnable code for the **[Neon AI Agent Program](https://neon.com/use-cases/ai-agents)** lives only in **`api-scripts/`** — **[Management API TypeScript SDK](https://neon.com/docs/reference/typescript-sdk)** (`@neondatabase/api-client`).

**Fleets & two-org layout:** If you provision **many** tenant projects and separate **free vs paid** Neon orgs, read **[FLEET_AND_ORG_LAYOUT.md](FLEET_AND_ORG_LAYOUT.md)** first—it maps org ids, API keys, **create-project**, **transfer-project**, **consumption-query**, and **delete-project** to a fleet mental model.


| Folder                                    | Role                                |
| ----------------------------------------- | ----------------------------------- |
| **[api-scripts/](api-scripts/README.md)** | All scripts, env vars, and commands |


**Cross-links**

- [Fleet provisioning & org layout](FLEET_AND_ORG_LAYOUT.md) — two orgs, keys, create → transfer → consume → delete.
- [README — § Product routes](../README.md#2-product-routes) — Route 1 vs Route 2 (scripts live in **api-scripts** README).
- [Database versioning](https://neon.com/docs/ai/ai-database-versioning) — walkthrough aligns with **`api-scripts/versioning-flow.ts`**.
- **Routing:** [Neon Auth API](https://neon.com/docs/neon-auth/api) · [Postgres roles](https://neon.com/docs/manage/users) · [Consumption metrics](https://neon.com/docs/guides/consumption-metrics) · [API reference](https://api-docs.neon.tech).

**Requirements**

- **Node.js 20+** recommended (`node --env-file=.env`).
- Neon **[API key](https://neon.com/docs/manage/api-keys)** (`NEON_API_KEY`). Org-scoped keys need **`NEON_ORG_ID`** where noted.