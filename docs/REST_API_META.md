# Neon REST API — meta index (users, Postgres, consumption)

Quick map of which **Neon Console REST** surface to use. Base URL: `https://console.neon.tech/api/v2` with `Authorization: Bearer <NEON_API_KEY>`. Full schemas: [api-docs.neon.tech](https://api-docs.neon.tech/reference/getting-started).

## [meta] Application users vs Postgres roles


| Need                                                                      | Mechanism                                      | Notes                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **End-user accounts** (login, sessions) for an app                        | **Neon Auth** — branch auth API                | User rows sync into Postgres under schema `**neon_auth`** (e.g. `users_sync`). REST under `projects/{project_id}/branches/{branch_id}/auth/...` including `**/users`** (create, delete, role changes). [Manage Neon Auth via the API](https://neon.com/docs/neon-auth/api) · [User management guide](https://neon.com/docs/auth/guides/user-management). |
| **Database roles** (Postgres `CREATE ROLE`, connection users, privileges) | **SQL or Console** — not the Auth `/users` API | [Manage roles](https://neon.com/docs/manage/users). This is standard Postgres / Neon role management, separate from Neon Auth’s application user API.                                                                                                                                                                                                    |
| **Fleet ops** (projects, branches, snapshots, restore, org transfer)      | **Control-plane API**                          | **Org layout & fleet map:** `[examples/FLEET_AND_ORG_LAYOUT.md](../examples/FLEET_AND_ORG_LAYOUT.md)`. Scripts in `[examples/api-scripts](../examples/api-scripts/)`: create/delete project, branch, **snapshot + restore** (`[versioning-flow.mjs](../examples/api-scripts/versioning-flow.mjs)`), transfer.                                            |


## Consumption API (usage-based metrics)


| API                                        | Use when                                                                                                                                                                                                                   |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `**GET /consumption_history/v2/projects`** | You are on a **usage-based** plan (Launch, Scale, Agent, Enterprise) and want metrics that **match billing** (compute, storage, transfer, branches). Requires `org_id`, `from`, `to` (RFC 3339), `granularity`, `metrics`. |


Docs: [Querying consumption metrics](https://neon.com/docs/guides/consumption-metrics) · API reference: [Retrieve project consumption metrics (v2)](https://api-docs.neon.tech/reference/getconsumptionhistoryperprojectv2).

Legacy metrics (`GET /consumption_history/projects`, older fields such as `active_time_seconds`) are documented separately — see [legacy consumption metrics](https://neon.com/docs/guides/consumption-metrics-legacy).

**Operational notes** (from Neon docs): consumption data updates about every **15 minutes**; **~50 requests/minute** shared rate limit across consumption endpoints; calls **do not wake** suspended computes.

## Example in this repo

- `**examples/api-scripts/versioning-flow.mjs`** — full [database versioning](https://neon.com/docs/ai/ai-database-versioning) flow (snapshot → branch → optional SQL → snapshot → **restore**). `**restore-snapshot.mjs`** applies one restore from `NEON_SNAPSHOT_ID` + `NEON_TARGET_BRANCH_ID`.
- `**examples/api-scripts/consumption-query.mjs`** — minimal `GET consumption_history/v2/projects` using env vars.
- `**examples/api-scripts/auth-users.mjs`** — **[meta]** (`auth-users.mjs meta`): explains REST vs Postgres roles, lists doc links and example SQL for `neon_auth.users_sync`; `**create`** / `**delete`** call Neon Auth branch endpoints (`POST` / `DELETE .../auth/users`). Requires Neon Auth enabled on the branch (`POST .../auth` with `better_auth`). Agent platforms typically combine this with per-tenant projects from `create-project.mjs`.

Full script catalog, env vars, and command examples: `[examples/api-scripts/README.md](../examples/api-scripts/README.md)`. Hub for `**minimal-node`** vs `**api-scripts`**: `[examples/README.md](../examples/README.md)`.

Install `**neon-postgres`** from [agent-skills](https://github.com/neondatabase/agent-skills) for deeper coverage (Auth details, drivers, quotas, etc.); this file is only a **routing index**.