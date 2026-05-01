# How to use this repository

**Running the sample** needs Node and a Neon database—no AI skills required.

If you use **Cursor or another agent that loads skills**, the **best experience** is to install Neon’s primary skills from **[github.com/neondatabase/agent-skills](https://github.com/neondatabase/agent-skills)** (`neon-postgres`). That covers Auth, Data API, MCP, drivers, branching, consumption APIs, and the rest of the platform. This repo does not duplicate that content.

The **`neon-postgres-agent-platforms`** topic is **optional**: it adds Agent Program org layout, transfers, and pointers to this sample. Use it **together with** `neon-postgres`, not instead of it.

---

## 1. Run the reference implementation

The sample lives in [`examples/minimal-node`](../examples/minimal-node). It provisions a project (optional), uses `@neondatabase/serverless`, and runs a simple query.

**Clone:**

```bash
git clone https://github.com/neondatabase/neon-for-agent-platforms.git
cd neon-for-agent-platforms/examples/minimal-node
npm install
cp .env.example .env
```

**Path A — Provision via script:** add **`NEON_API_KEY`** to `.env`, then:

```bash
npm run provision
```

Add the printed **`DATABASE_URL`** to `.env` and run:

```bash
npm run start
```

**Path B — Use an existing database:** set **`DATABASE_URL`** in `.env` (from the Neon console), then `npm run start`.

You should see a successful `SELECT 1`-style result.

**Code:** [`query.mjs`](../examples/minimal-node/src/query.mjs) · [`provision.mjs`](../examples/minimal-node/src/provision.mjs)

---

## 2. Recommended: skills from `neondatabase/agent-skills` (best agent experience)

Repo: **[github.com/neondatabase/agent-skills](https://github.com/neondatabase/agent-skills)**

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
```

Or: **`npx neonctl@latest init`** — [Agent Skills](https://neon.com/docs/ai/agent-skills).

---

## 3. Optional add-on: Agent Program skill (`neon-postgres-agent-platforms`)

```bash
npx skills add neondatabase/agent-skill -s neon-postgres-agent-platforms
```

**Source in this repo:** [`skills/neon-postgres-agent-platforms`](../skills/neon-postgres-agent-platforms)

---

## More reading

- [Partner builder guide](NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md)
- [Link index](AGENT_PROGRAM_REFERENCE.md)
