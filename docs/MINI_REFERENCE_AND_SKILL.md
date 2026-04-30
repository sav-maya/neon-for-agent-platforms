# How to use this repository

**Running the sample** below needs only Node and a Neon database—no skills required.

If you use **Cursor or another agent that loads skills**, you get the **best experience** by installing Neon’s primary skills from **[github.com/neondatabase/agent-skills](https://github.com/neondatabase/agent-skills)** (`neon-postgres`). That covers Auth, Data API, MCP, drivers, branching, consumption APIs, and the rest of the platform. This repo does not duplicate that content.

The **`neon-postgres-agent-platforms`** topic is **optional**: it only adds Agent Program org layout, transfers, and pointers to this repo’s minimal sample. Use it **together with** `neon-postgres`, not instead of it.

---

## 1. Run the reference implementation

The sample lives in [`examples/minimal-node`](../examples/minimal-node). It runs a single query with `@neondatabase/serverless`.

**Clone and run:**

```bash
git clone https://github.com/sav-maya/neon-for-agent-platforms.git
cd neon-for-agent-platforms/examples/minimal-node
npm install
cp .env.example .env
```

Edit `.env` and set **`DATABASE_URL`** to a Neon connection string (from the Neon console). Then:

```bash
npm run start
```

You should see a successful `SELECT 1`-style result. That confirms connectivity from a minimal agent-style Node setup.

**Browse the code:** [`examples/minimal-node/src/query.mjs`](../examples/minimal-node/src/query.mjs)

---

## 2. Recommended: skills from `neondatabase/agent-skills` (best agent experience)

Repo: **[github.com/neondatabase/agent-skills](https://github.com/neondatabase/agent-skills)**

Install Neon’s main skill so your assistant has full platform guidance:

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
```

Or bootstrap skills + MCP in one step: **`npx neonctl@latest init`** — [Agent Skills](https://neon.com/docs/ai/agent-skills).

---

## 3. Full Neon platform skill (optional but highly encouraged)

Use this **after** (or alongside) `neon-postgres` when you care about **Agent Program** context—two-org model, transfers, fleet patterns—and the mini repo snippets:

```bash
npx skills add neondatabase/agent-skill -s neon-postgres-agent-platforms
```

**Skill source in this repo:** [`skills/neon-postgres-agent-platforms`](../skills/neon-postgres-agent-platforms)

---

## More reading

- [Partner builder guide](NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md)
- [Link index](AGENT_PROGRAM_REFERENCE.md)
