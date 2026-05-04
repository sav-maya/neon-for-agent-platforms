# api-scripts

Small **Node.js** scripts that call the **[Neon Console REST API](https://console.neon.tech/api/v2)** (`fetch` only). Shared logic lives in [`lib/neon-client.mjs`](lib/neon-client.mjs). Patterns are adapted from the open-source app [Aileen](https://github.com/andrelandgraf/aileen) (`src/lib/neon.ts`), trimmed for agent-platform builders.

Use these to prototype **per-tenant provisioning**, **branching**, **database versioning** (snapshots + restore), **org transfer** (free ↔ paid org), **consumption** polling, and **Neon Auth** user APIs.

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| Node.js **20+** | Enables `node --env-file=.env` (or export vars manually). |
| `NEON_API_KEY` | [API key](https://neon.com/docs/manage/api-keys). Org keys are scoped to one org; **personal** keys can transfer projects across orgs. |
| `NEON_ORG_ID` | Often required when creating projects with a personal key. |

Install dependencies once (**`pg`** is only used for optional SQL in **`versioning-flow.mjs`**):

```bash
cd examples/api-scripts
npm install
cp .env.example .env
# Fill in NEON_API_KEY and any IDs your scripts need (see table below)
```

Run scripts with env vars loaded:

```bash
node --env-file=.env <script.mjs>
```

---

## Script catalog

| Script | npm shortcut | What it does |
|--------|----------------|----------------|
| [`create-project.mjs`](create-project.mjs) | `npm run create-project` | Creates a Neon **project**; prints `projectId` and `DATABASE_URL`. Waits for initial operations to finish. |
| [`delete-project.mjs`](delete-project.mjs) | `npm run delete-project` | **Deletes** a project by id (destructive). |
| [`branch.mjs`](branch.mjs) | `npm run branch` | **`list`** — JSON list of branches. **`create <name>`** — new branch from **main** / **production** (or `NEON_PARENT_BRANCH_ID`). |
| [`snapshot.mjs`](snapshot.mjs) | `npm run snapshot` | Creates a **logical snapshot** on the default branch (same pattern as many hosts). |
| [`versioning-flow.mjs`](versioning-flow.mjs) | `npm run versioning-flow` | **Full versioning demo**: snapshot prod → child branch → optional SQL mutation → snapshot branch → **restore** baseline onto branch. See [AI database versioning](https://neon.com/docs/ai/ai-database-versioning). |
| [`restore-snapshot.mjs`](restore-snapshot.mjs) | `npm run restore-snapshot` | **One-shot restore**: applies an existing snapshot id to a target branch id. |
| [`transfer-project.mjs`](transfer-project.mjs) | `npm run transfer` | Moves project(s) between orgs (e.g. sponsored → paid). Needs **personal** API key + permissions. |
| [`consumption-query.mjs`](consumption-query.mjs) | `npm run consumption` | **`GET /consumption_history/v2/projects`** — usage-based metrics aligned with billing. |
| [`auth-users.mjs`](auth-users.mjs) | `npm run auth-users` | Neon **Auth** REST: **`meta`** (no API call—prints routing + SQL hint), **`create`**, **`delete`**. Requires Auth enabled on the branch first. |

---

## Environment variables (by script)

Copy [`.env.example`](.env.example) and set only what you need.

### Always

| Variable | Used by |
|----------|---------|
| `NEON_API_KEY` | All scripts |

### Projects

| Variable | Used by |
|----------|---------|
| `NEON_ORG_ID` | `create-project.mjs` (often required with personal keys) |
| `NEON_PROJECT_NAME` | `create-project.mjs` (optional; default `tenant-<timestamp>`) |
| `NEON_PROJECT_ID` | `delete-project`, `branch`, `snapshot`, `versioning-flow`, `consumption` (filter), `auth-users`, `restore-snapshot` (with snapshot vars) |

### Branches

| Variable | Used by |
|----------|---------|
| `NEON_PARENT_BRANCH_ID` | `branch.mjs create` — optional; defaults to production branch id |
| `NEON_BRANCH_ID` | `auth-users.mjs` |

### Snapshots & versioning

| Variable | Used by |
|----------|---------|
| `NEON_SNAPSHOT_NAME` | `snapshot.mjs` — optional label |
| `NEON_SNAPSHOT_ID` | `restore-snapshot.mjs` |
| `NEON_TARGET_BRANCH_ID` | `restore-snapshot.mjs` |
| `VERSION_BASELINE_NAME`, `VERSION_DEMO_BRANCH_NAME`, `VERSION_AFTER_NAME` | `versioning-flow.mjs` — optional overrides |
| `DEMO_MUTATE` | Set to `1` to run optional **SQL** on the demo branch (requires `npm install` so **`pg`** is present). |

### Org transfer

| Variable | Used by |
|----------|---------|
| `NEON_SOURCE_ORG_ID`, `NEON_DESTINATION_ORG_ID` | `transfer-project.mjs` |
| `NEON_PROJECT_IDS` or `NEON_PROJECT_ID` | Comma-separated or single project id |

### Consumption API (v2)

| Variable | Used by |
|----------|---------|
| `NEON_ORG_ID` | `consumption-query.mjs` |
| `CONSUMPTION_FROM`, `CONSUMPTION_TO` | RFC 3339 range |
| `CONSUMPTION_GRANULARITY` | `hourly` \| `daily` \| `monthly` |
| `CONSUMPTION_METRICS` | Optional comma list (defaults include compute + storage + transfer) |
| `CONSUMPTION_PROJECT_IDS` | Optional filter |
| `CONSUMPTION_LIMIT`, `CONSUMPTION_CURSOR` | Pagination |

### Neon Auth users

| Variable | Used by |
|----------|---------|
| `USER_EMAIL`, `USER_NAME` | `auth-users.mjs create` |
| `AUTH_USER_ID` | `auth-users.mjs delete` |

Enable Auth on the branch once: `POST .../projects/{id}/branches/{id}/auth` with `better_auth` — see [Manage Neon Auth via the API](https://neon.com/docs/neon-auth/api).

---

## Typical flows

### Spin up a tenant project

```bash
node --env-file=.env create-project.mjs
```

### List branches, then create a dev branch

```bash
node --env-file=.env branch.mjs list
node --env-file=.env branch.mjs create my-feature
```

### Database versioning (snapshots + restore)

End-to-end demo (creates a **child branch** named `versioning-demo-<timestamp>`):

```bash
node --env-file=.env versioning-flow.mjs
```

Optional: **`DEMO_MUTATE=1`** inserts a row so restore visibly rewinds the demo branch.

Restore an arbitrary snapshot onto a branch:

```bash
node --env-file=.env restore-snapshot.mjs
# Needs NEON_SNAPSHOT_ID and NEON_TARGET_BRANCH_ID in .env
```

### Move a customer from free org to paid org

```bash
node --env-file=.env transfer-project.mjs
```

### Poll usage (invoice-aligned metrics)

```bash
node --env-file=.env consumption-query.mjs
```

### Neon Auth app users (REST)

Print the **[meta]** map (REST vs Postgres `neon_auth`, doc links)—no credentials required beyond habit:

```bash
node --env-file=.env auth-users.mjs meta
```

---

## Shared library

[`lib/neon-client.mjs`](lib/neon-client.mjs) exports class **`NeonApi`**: projects, branches, snapshots, **`applySnapshot`** (restore), **`getConnectionUri`**, transfer, consumption v2, Auth user create/delete, operation polling. Import it from your own scripts if you outgrow the one-file demos.

---

## Related docs in this repo

- [`../../docs/REST_API_META.md`](../../docs/REST_API_META.md) — when to use Auth **`/users`** vs Postgres roles vs consumption API.
- [`../../README.md`](../../README.md) — Agent Program model (two orgs, keys, skills).
