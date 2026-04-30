# How to use this repository

This repo has two parts: a **minimal Node reference** you can run locally, and an optional **Cursor / agent skill** that summarizes the Agent Program model and points back here. You can use either or both.

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

## 2. Install the Agent Program skill (`neon-postgres-agent-platforms`)

For editors and agents that support [Agent Skills](https://neon.com/docs/ai/agent-skills), install the topic that matches **this repo** (program context + snippets), without replacing Neon’s full platform skill:

```bash
npx skills add neondatabase/agent-skill -s neon-postgres-agent-platforms
```

That pulls the packaged skill; after install, your agent has structured guidance that defers detailed Neon usage to the main **`neon-postgres`** skill or **`npx neonctl@latest init`**.

**Skill source in this repo:** [`skills/neon-postgres-agent-platforms`](../skills/neon-postgres-agent-platforms)

---

## 3. Full Neon platform skill (optional)

For Auth, Data API, MCP, drivers, consumption API, and the rest of Neon—not duplicated by this repo—use Neon’s main skill:

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
```

Or: [`npx neonctl@latest init`](https://neon.com/docs/ai/agent-skills).

---

## More reading

- [Partner builder guide](NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md)
- [Link index](AGENT_PROGRAM_REFERENCE.md)
