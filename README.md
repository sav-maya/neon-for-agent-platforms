# Neon for Agent Platforms

Everything you need to get started with the [Neon AI Agent Program](https://neon.com/use-cases/ai-agents) — provision Postgres databases for your users, manage free and paid tiers, and build with AI-assisted tooling.

**Step-by-step guide:** [**docs/MINI_REFERENCE_AND_SKILL.md**](docs/MINI_REFERENCE_AND_SKILL.md)

## Quick start

### 1. Provision a project

```bash
git clone https://github.com/neondatabase/neon-for-agent-platforms.git
cd neon-for-agent-platforms/examples/minimal-node
npm install
cp .env.example .env
```

Add your `NEON_API_KEY` to `.env`, then:

```bash
npm run provision
```

This creates a Neon project and returns a connection string.

### 2. Connect and query

Add the `DATABASE_URL` from step 1 to `.env`, then:

```bash
npm run start
```

### 3. Install Neon’s AI skills (recommended)

Give your AI assistant full Neon platform knowledge (Auth, Data API, MCP, drivers, branching, and more) — install from **[github.com/neondatabase/agent-skills](https://github.com/neondatabase/agent-skills)**:

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
```

Or bootstrap skills + MCP in one step: `npx neonctl@latest init`

**Optional add-on** — Agent Program org layout, transfers, fleet patterns (use **with** `neon-postgres`, not instead):

```bash
npx skills add neondatabase/agent-skill -s neon-postgres-agent-platforms
```

## Key docs

| Resource | Description |
|----------|-------------|
| [Agent Plan](https://neon.com/docs/introduction/agent-plan) | Pricing, features, credits, two-org model |
| [Integration guide](https://neon.com/docs/guides/ai-agent-integration) | Provisioning, transfers, versioning, monitoring |
| [Database versioning](https://neon.com/docs/ai/ai-database-versioning) | Snapshots and checkpoints for undo/redo |
| [Partner guide](docs/NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md) | Post-call orientation for Agent Program partners |
| [Agent Skills](https://github.com/neondatabase/agent-skills) | Install `neon-postgres` for full platform coverage |

## What’s in this repo

```
examples/minimal-node/     Provision a project + connect and query
skills/                    Agent Program AI skill (neon-postgres-agent-platforms)
docs/                      Partner guide, reference links, how-to
```

## Support

- **Shared Slack channel** — every Agent Program participant gets direct access to the Neon team
- **Email** — agents@neon.tech for limit increases and account requests
- **Docs** — [neon.com/docs](https://neon.com/docs) | [API reference](https://api-docs.neon.tech)

## License

Apache 2.0 — [LICENSE](LICENSE)
