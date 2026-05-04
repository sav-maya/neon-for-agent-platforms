# minimal-node

Smallest path from **“no database”** to **“query succeeds”** using the Neon API and Node’s **`pg`** driver.

## What this example does

1. **`npm run provision`** — calls `POST /projects` on the Neon Console API (`src/provision.mjs`) and prints a **`DATABASE_URL`** (and project id).
2. **`npm run start`** — connects with **`pg`** and runs `SELECT 1` (`src/query.mjs`).

Use this to verify API keys, org wiring, and connectivity before building a larger control plane.

## Prerequisites

- Node.js 18+ (20+ recommended for `--env-file`).
- `NEON_API_KEY` in `.env`. If you use a **personal** API key, set **`NEON_ORG_ID`** so projects are created in the right org ([docs](https://neon.com/docs/manage/api-keys)).

## Setup

```bash
cd examples/minimal-node
npm install
cp .env.example .env
# Edit .env: NEON_API_KEY, and NEON_ORG_ID if required
```

## Paths

### A — Provision, then query

```bash
npm run provision
# Copy DATABASE_URL from the output into .env
npm run start
```

### B — Existing database only

If you already have a connection string from the Neon Console:

```bash
# Set DATABASE_URL in .env
npm run start
```

## Files

| File | Role |
|------|------|
| [`src/provision.mjs`](src/provision.mjs) | Creates a project; optional `NEON_ORG_ID`; sets default endpoint autoscaling/suspend. |
| [`src/query.mjs`](src/query.mjs) | Opens one connection and runs a trivial query. |

## Going further

Control-plane automation without extra SDKs (branches, snapshots, transfer, consumption, …) lives in **[`../api-scripts/README.md`](../api-scripts/README.md)**.
