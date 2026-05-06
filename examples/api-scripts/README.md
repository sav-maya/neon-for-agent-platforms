# api-scripts

Small **Node.js + TypeScript** scripts that use Neon's official **[Management API TypeScript SDK](https://neon.com/docs/reference/typescript-sdk)** (`[@neondatabase/api-client](https://www.npmjs.com/package/@neondatabase/api-client)`), wrapped by `[lib/neon-client.ts](lib/neon-client.ts)` for stable CLI shapes. Scripts run with **[tsx](https://github.com/privatenumber/tsx)** (no separate build step).

Use these to prototype **per-tenant provisioning**, **fleet branching/snapshot orchestration**, **database versioning** (snapshots + restore), **org transfer** (free ↔ paid org), **consumption** polling, and **Neon Auth management** endpoints—not introductory app connectivity (that is `**neon-postgres`** + app docs).

### Fleet provisioning and org layout

Agent Program teams usually maintain **two Neon orgs** (sponsored free vs paid) and route `**NEON_ORG_ID`** per customer tier when calling `**create-project.ts**`. Upgrades use `**transfer-project.ts**` with a **personal** API key; fleet-wide usage uses `**consumption-query.ts`** with `**NEON_ORG_ID**`.

For the full mapping (keys, patterns, which script covers which fleet operation), see `**[../README.md` § Fleet provisioning and org layout](../README.md#fleet-provisioning-and-org-layout)**.

### Application REST API vs Neon Management API

Scripts in **this folder** call Neon’s **Management API** (`console.neon.tech`, `@neondatabase/api-client`) — provisioning, branches, snapshots, org transfer, consumption, Neon Auth management endpoints.

For `**curl` examples** aimed at **your product’s own REST API** (the HTTP surface your users or agents hit — checkpoints, versions, etc.), see `**[references/application-rest-api/](references/application-rest-api/)`**. Those examples mirror one **reference full-stack app**’s routes (see that folder’s README); they are **not** Neon control-plane calls. **Compound checkpoints** (DB + revision + secrets + deploy) are described in `**[references/COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md](references/COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md)`**.

---

## Prerequisites


| Requirement     | Notes                                                                                                                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js **20+** | Enables `node --env-file=.env` (or export vars manually).                                                                                                                                                       |
| `NEON_API_KEY`  | [API key](https://neon.com/docs/manage/api-keys). Org keys are scoped to one org; **personal** keys can transfer projects across orgs.                                                                          |
| `NEON_ORG_ID`   | Often required when creating projects with a personal key.                                                                                                                                                      |
| `**npm run …`** | Does **not** load `.env` by itself — export vars in the shell first, or run `**node --env-file=.env ./node_modules/tsx/dist/cli.mjs`** with a script path (e.g. `**branch.ts**`) so the process reads the file. |


Install dependencies once (`**pg**` is only used for optional SQL in `**versioning-flow.ts**`):

```bash
cd examples/api-scripts
npm install
cp .env.example .env
# Fill in NEON_API_KEY and any IDs your scripts need (see table below)
```

Run scripts with env vars loaded (**Node.js 20+** loads `.env`; `**--import tsx/esm`** runs TypeScript without a build):

```bash
node --env-file=.env --import tsx/esm create-project.ts
# Or: npm run create-project  (only if NEON_* vars are already exported — npm does not read .env)
```

---

## Script catalog


| Script                                                       | npm shortcut                           | What it does                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------ | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[create-project.ts](create-project.ts)`                     | `npm run create-project`               | Creates a Neon **project**; prints `projectId` and `DATABASE_URL`. Waits for initial operations to finish.                                                                                                                                                                  |
| `[create-project-with-auth.ts](create-project-with-auth.ts)` | `npm run create-project-with-auth`     | Same as `**create-project`**, then `**POST .../branches/{id}/auth**` with `**better_auth**` so Neon Auth is enabled on the default branch. Saves Auth keys once—see stderr note.                                                                                            |
| `[delete-project.ts](delete-project.ts)`                     | `npm run delete-project`               | **Deletes** a project by id (destructive).                                                                                                                                                                                                                                  |
| `[branch.ts](branch.ts)`                                     | `npm run branch`                       | `**list`** — JSON list of branches. `**create <name>**` — new branch from **main** / **production** (or `NEON_PARENT_BRANCH_ID`).                                                                                                                                           |
| `[snapshot.ts](snapshot.ts)`                                 | `npm run snapshot`                     | Creates a **logical snapshot** on the default branch (same pattern as many hosts). Optional `**NEON_SNAPSHOT_EXPIRES_AT`** (RFC 3339) for auto-deletion per [cleanup strategy](https://neon.com/docs/ai/ai-database-versioning#cleanup-strategy).                           |
| `[list-snapshots.ts](list-snapshots.ts)`                     | `npm run list-snapshots`               | **Lists** all snapshots for `**NEON_PROJECT_ID`**.                                                                                                                                                                                                                          |
| `[delete-snapshot.ts](delete-snapshot.ts)`                   | `npm run delete-snapshot`              | **Deletes** one snapshot by `**NEON_SNAPSHOT_ID`** (polls operations).                                                                                                                                                                                                      |
| `[rename-snapshot.ts](rename-snapshot.ts)`                   | `npm run rename-snapshot`              | **PATCH** rename — `**NEON_SNAPSHOT_NEW_NAME`**.                                                                                                                                                                                                                            |
| `[delete-branch.ts](delete-branch.ts)`                       | `npm run delete-branch`                | **Deletes** a branch by `**NEON_BRANCH_ID`** (e.g. orphaned `**main (old)**` after restore); destructive.                                                                                                                                                                   |
| `[versioning-flow.ts](versioning-flow.ts)`                   | `npm run versioning-flow`              | **Versioning demo**: snapshot **root** branch → child branch → optional SQL → **restore** baseline snapshot onto child (logical snapshots are root-only; child “after” snapshot is skipped). See [AI database versioning](https://neon.com/docs/ai/ai-database-versioning). |
| `[restore-snapshot.ts](restore-snapshot.ts)`                 | `npm run restore-snapshot`             | **One-shot restore**: applies an existing snapshot id to a target branch id.                                                                                                                                                                                                |
| `[promote-safe-production.ts](promote-safe-production.ts)`   | `npm run promote-safe -- <subcommand>` | **[Promoting Postgres safely](https://neon.com/blog/promoting-postgres-changes-safely-production)** — `bootstrap-dev`, `promote`, `refresh-dev`, `rollback-prod`. Set `**NEON_DEV_BRANCH_ID`** / branch ids as needed.                                                      |
| `[transfer-project.ts](transfer-project.ts)`                 | `npm run transfer`                     | Moves project(s) between orgs (e.g. sponsored → paid). Needs **personal** API key + permissions.                                                                                                                                                                            |
| `[consumption-query.ts](consumption-query.ts)`               | `npm run consumption`                  | `**GET /consumption_history/v2/projects`** — usage-based metrics aligned with billing.                                                                                                                                                                                      |
| `[auth-users.ts](auth-users.ts)`                             | `npm run auth-users`                   | Neon **Auth** REST: `**meta`** (no API call—prints routing + SQL hint), `**create**`, `**delete**`. Requires Auth enabled on the branch first.                                                                                                                              |


**Restore / bootstrap:** If the API returns `**ROOT_BRANCHES_LIMIT_EXCEEDED`**, the project has hit Neon’s **root-branch** limit for your plan. Delete old branches (preview restores, `bootstrap-*`, `before_restore_*`, orphaned `**main (old)`**) using `**delete-branch.ts**` or the Console, or point `**NEON_PROJECT_ID**` at an emptier project.

### Compound checkpoints (agent platforms)

These scripts cover **Neon snapshot + restore + branch ops** only—the **database slice** of a version. For agent platforms, a checkpoint must usually bind **source revision**, **Neon snapshot/branch ids**, **secrets/env generation**, **deployment or preview URL**, **agent run metadata**, and **rollback/promotion state**. See **[references/COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md](references/COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md)**. Generic Neon branching and connection guidance stays in `**neon-postgres`**.

---

## Environment variables (by script)

Copy `[.env.example](.env.example)` and set only what you need.

### Always


| Variable       | Used by     |
| -------------- | ----------- |
| `NEON_API_KEY` | All scripts |


### Projects


| Variable            | Used by                                                                                                                                                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEON_ORG_ID`       | `create-project.ts` (often required with personal keys)                                                                                                                                                                                      |
| `NEON_PROJECT_NAME` | `create-project.ts` (optional; default `tenant-<timestamp>`)                                                                                                                                                                                 |
| `NEON_PROJECT_ID`   | `delete-project`, `branch`, `snapshot`, `list-snapshots`, `delete-snapshot`, `rename-snapshot`, `delete-branch`, `promote-safe-production`, `versioning-flow`, `consumption` (filter), `auth-users`, `restore-snapshot` (with snapshot vars) |


### Branches


| Variable                                                               | Used by                                                                                   |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `NEON_PARENT_BRANCH_ID`                                                | `branch.ts create` — optional; defaults to production branch id                           |
| `NEON_BRANCH_ID`                                                       | `auth-users.ts`, `**delete-branch.ts**`                                                   |
| `NEON_PROD_BRANCH_ID`                                                  | `**promote-safe-production.ts**` — optional; defaults to **main** / **production** branch |
| `NEON_DEV_BRANCH_ID`                                                   | `**promote-safe-production.ts`** — required for `**promote**` and `**refresh-dev**`       |
| `NEON_BOOTSTRAP_DEV_BRANCH_NAME`                                       | `**promote-safe-production.ts bootstrap-dev**` — default `dev`                            |
| `NEON_SNAPSHOT_PRE_PROMOTION_NAME`, `NEON_SNAPSHOT_DEV_CANDIDATE_NAME` | `**promote**` — optional snapshot labels                                                  |
| `NEON_SNAPSHOT_REFRESH_NAME`                                           | `**refresh-dev**` — optional                                                              |
| `NEON_RESTORE_BACKUP_BRANCH_NAME`                                      | `**promote-safe-production**` restore steps — optional backup branch name prefix          |


### Snapshots & versioning


| Variable                                            | Used by                                                                                                |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `NEON_SNAPSHOT_NAME`                                | `snapshot.ts` — optional label                                                                         |
| `NEON_SNAPSHOT_EXPIRES_AT`                          | `snapshot.ts` — optional RFC 3339 auto-deletion time                                                   |
| `NEON_SNAPSHOT_LSN`                                 | `snapshot.ts` — optional; mutually exclusive with default timestamp (advanced)                         |
| `NEON_SNAPSHOT_ID`                                  | `restore-snapshot.ts`, `**delete-snapshot.ts**`, `**rename-snapshot.ts**`                              |
| `NEON_SNAPSHOT_NEW_NAME`                            | `**rename-snapshot.ts**`                                                                               |
| `NEON_TARGET_BRANCH_ID`                             | `restore-snapshot.ts`                                                                                  |
| `VERSION_BASELINE_NAME`, `VERSION_DEMO_BRANCH_NAME` | `versioning-flow.ts` — optional branch/snapshot name overrides                                         |
| `DEMO_MUTATE`                                       | Set to `1` to run optional **SQL** on the demo branch (requires `npm install` so `**pg`** is present). |


### Org transfer


| Variable                                        | Used by                              |
| ----------------------------------------------- | ------------------------------------ |
| `NEON_SOURCE_ORG_ID`, `NEON_DESTINATION_ORG_ID` | `transfer-project.ts`                |
| `NEON_PROJECT_IDS` or `NEON_PROJECT_ID`         | Comma-separated or single project id |


### Consumption API (v2)


| Variable                                  | Used by                                                             |
| ----------------------------------------- | ------------------------------------------------------------------- |
| `NEON_ORG_ID`                             | `consumption-query.ts`                                              |
| `CONSUMPTION_FROM`, `CONSUMPTION_TO`      | RFC 3339 range                                                      |
| `CONSUMPTION_GRANULARITY`                 | `hourly` | `daily` | `monthly`                                      |
| `CONSUMPTION_METRICS`                     | Optional comma list (defaults include compute + storage + transfer) |
| `CONSUMPTION_PROJECT_IDS`                 | Optional filter                                                     |
| `CONSUMPTION_LIMIT`, `CONSUMPTION_CURSOR` | Pagination                                                          |


### Neon Auth users


| Variable                  | Used by                |
| ------------------------- | ---------------------- |
| `USER_EMAIL`, `USER_NAME` | `auth-users.ts create` |
| `AUTH_USER_ID`            | `auth-users.ts delete` |


Enable Auth on the branch once: `POST .../projects/{id}/branches/{id}/auth` with `better_auth` — see [Manage Neon Auth via the API](https://neon.com/docs/neon-auth/api).

---

## Typical flows

### Provision fleet tenants (free vs paid org)

1. Store `**NEON_ORG_ID**` for each Neon org (free pool vs paid pool) and choose an **API key** that can create projects there ([details](../README.md#fleet-provisioning-and-org-layout)).
2. For each new customer, set `**NEON_ORG_ID`** (and optionally `**NEON_PROJECT_NAME**`) and run:

```bash
node --env-file=.env --import tsx/esm create-project.ts
```

1. Persist `**projectId**` and `**DATABASE_URL**` from the JSON output in your control-plane database.

### Spin up a single tenant project

```bash
node --env-file=.env --import tsx/esm create-project.ts
```

### List branches, then create a branch (tenant sandbox / preview)

```bash
node --env-file=.env --import tsx/esm branch.ts list
node --env-file=.env --import tsx/esm branch.ts create my-feature
```

Use this pattern to script **per-tenant** sandboxes from your control plane. Tutorials on **branching concepts** for a single app belong in `**neon-postgres`** and Neon’s branching guides—not duplicated here.

### Database versioning (snapshots + restore)

End-to-end demo (creates a **child branch** named `versioning-demo-<timestamp>`):

```bash
node --env-file=.env --import tsx/esm versioning-flow.ts
```

Optional: `**DEMO_MUTATE=1**` inserts a row so restore visibly rewinds the demo branch.

Restore an arbitrary snapshot onto a branch:

```bash
node --env-file=.env --import tsx/esm restore-snapshot.ts
# Needs NEON_SNAPSHOT_ID and NEON_TARGET_BRANCH_ID in .env
```

### Move a customer from free org to paid org

```bash
node --env-file=.env --import tsx/esm transfer-project.ts
```

### Poll usage (invoice-aligned metrics)

```bash
node --env-file=.env --import tsx/esm consumption-query.ts
```

### Neon Auth app users (REST)

Print the **[meta]** map (REST vs Postgres `neon_auth`, doc links)—no credentials required beyond habit:

```bash
node --env-file=.env --import tsx/esm auth-users.ts meta
```

---

## Shared library

`[lib/neon-client.ts](lib/neon-client.ts)` wraps the official SDK `**[@neondatabase/api-client](https://www.npmjs.com/package/@neondatabase/api-client)**` and exports class `**NeonApi**` with the same convenience methods as the samples (projects, branches, snapshots, `**applySnapshot**` / restore, `**getConnectionUri**`, org transfer, consumption v2, Neon Auth users, operation polling). Prefer importing `**createApiClient**` from `**@neondatabase/api-client**` directly in production apps; use `**NeonApi**` here to keep env validation and script shapes stable.

---

## Related docs in this repo

- [README — § Product routes / routing](../../README.md#2-product-routes) · [Neon Auth API](https://neon.com/docs/neon-auth/api) · [Postgres roles](https://neon.com/docs/manage/users) · [Consumption metrics](https://neon.com/docs/guides/consumption-metrics).
- `[../../README.md](../../README.md)` — Agent Program model (two orgs, keys, skills).

