# Fleet provisioning and org layout

Agent platforms usually run **two Neon organizations** (e.g. sponsored free vs paid) and **one Neon project per customer app** so isolation and quotas stay aligned. Read **[README § Start here](../README.md#start-here-agent-program-partners)** first; this page maps the **control-plane model** to **`examples/api-scripts/`**, alongside the [AI Agent integration guide](https://neon.com/docs/guides/ai-agent-integration).

---

## 1. Organization layout (two pools)


| Org role                 | Typical use                             | You store                                               |
| ------------------------ | --------------------------------------- | ------------------------------------------------------- |
| **Sponsored / free org** | Free-tier end users (per program rules) | `NEON_ORG_ID` (free), org-scoped **API key** (optional) |
| **Paid org**             | Paying customers, higher quotas         | `NEON_ORG_ID` (paid), org-scoped **API key** (optional) |


Your **control plane** decides which `org_id` to pass when **creating a project** for a new tenant. The same `create-project.ts` call is used for both; only **`NEON_ORG_ID`** (and which **API key** you load) changes.

**Diagram and narrative:** [README — Program model (reference)](../README.md#program-model-reference).

---

## 2. API keys (what automates where)


| Key type                 | Scope                             | Fleet provisioning                                                                                                                                                                                     |
| ------------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Organization API key** | Single org                        | Use one key per org in prod (e.g. secrets `NEON_API_KEY_FREE`, `NEON_API_KEY_PAID`) **or** swap `.env` per job. Each `**create-project`** run targets that org via `**NEON_ORG_ID**` matching the key. |
| **Personal API key**     | Can act across orgs you belong to | Often used with `**NEON_ORG_ID`** set per request for **create**. **Required** for `**transfer-project.ts`** (move project from free org → paid org).                                                 |


Details: [repository README](../README.md) (API keys) · [Org project transfer](https://neon.com/docs/manage/orgs-project-transfer).

---

## 3. Fleet operations → scripts in `examples/api-scripts/`

These scripts are the **building blocks** for a fleet; your product wraps them in queues, DB records, and retries.


| Fleet goal                             | Script                                                                                                                                       | Notes                                                                                                                                                                                                                                                |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Provision** a new tenant DB          | `[create-project.ts](api-scripts/create-project.ts)`                                                                                       | Set `**NEON_ORG_ID`** to the org for that customer tier; `**NEON_PROJECT_NAME**` (e.g. `tenant-{customerId}`). Output includes `**projectId**` and `**DATABASE_URL**` — persist both.                                                                |
| **Offboard** / destroy tenant          | `[delete-project.ts](api-scripts/delete-project.ts)`                                                                                       | `**NEON_PROJECT_ID`**                                                                                                                                                                                                                                |
| **Upgrade tier** (free org → paid org) | `[transfer-project.ts](api-scripts/transfer-project.ts)`                                                                                   | `**NEON_SOURCE_ORG_ID`**, `**NEON_DESTINATION_ORG_ID**`, `**NEON_PROJECT_ID**` (or `**NEON_PROJECT_IDS**`). Uses **personal** API key with transfer permissions. After transfer, **raise quotas** per Neon docs (PATCH project / integration guide). |
| **Observe usage** across projects      | `[consumption-query.ts](api-scripts/consumption-query.ts)`                                                                                 | `**NEON_ORG_ID`** + time range; optional `**CONSUMPTION_PROJECT_IDS**` to slice the fleet.                                                                                                                                                           |
| **Branches / versioning** per tenant   | `[branch.ts](api-scripts/branch.ts)`, `[versioning-flow.ts](api-scripts/versioning-flow.ts)`, `[snapshot.ts](api-scripts/snapshot.ts)` | Same APIs as single-tenant; scale by storing `**NEON_PROJECT_ID`** per tenant.                                                                                                                                                                       |


Full env reference: `[api-scripts/README.md](api-scripts/README.md)`.

---

## 4. Practical patterns

1. **Per-tier provisioning** — When a user signs up on the free plan, call `**create-project`** with the **free** `NEON_ORG_ID` and your naming convention. When they convert to paid, either provision net-new in the paid org **or** `**transfer`** the existing project and adjust quotas.
2. **Secrets layout** — Common: `NEON_API_KEY` + `NEON_ORG_ID_FREE` + `NEON_ORG_ID_PAID` in your worker; pick org id by tier before calling create. Alternatively, two separate API keys (one per org) and match `**NEON_ORG_ID`** to the key you use.
3. **Idempotency & bookkeeping** — This repo prints JSON; your fleet layer should persist `**project_id` ↔ customer_id** and handle partial failures (Neon is async; `**create-project`** already waits on initial operations via `**neon-client.ts**`).

---

## 5. What is not automated here

- **Quota PATCH** after transfer — follow [integration guide](https://neon.com/docs/guides/ai-agent-integration) / Console; not duplicated in these scripts.
- **Rate limits and project caps** — contact [agents@neon.tech](mailto:agents@neon.tech) per Agent Program; see [README — Support](../README.md#support).

For **Route 1 vs Route 2** product framing, see **[README § Product routes](../README.md#2-product-routes)**.