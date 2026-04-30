# Neon for agent platforms

**Agent Program partners:** short orientation is [**docs/NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md**](docs/NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md). It does **not** repeat Neon’s main [**Agent Skill**](https://neon.com/docs/ai/agent-skills) (`neon-postgres`) — use that (or **`npx neonctl@latest init`**) for Auth, Data API, toolkit, MCP, drivers, and the rest.

| Doc | What |
|-----|------|
| [**Mini reference + skills**](docs/MINI_REFERENCE_AND_SKILL.md) | Tiny page: GitHub sample + both skill installs |
| [**Partner guide**](docs/NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md) | Two-org Agent Program model + links |

## Mini implementation

[**github.com/neondatabase/neon-for-agent-platforms**](https://github.com/neondatabase/neon-for-agent-platforms) — [`examples/minimal-node`](examples/minimal-node)

## Skills

- **General Neon:** `npx skills add neondatabase/agent-skills -s neon-postgres` or `npx neonctl@latest init`
- **This repo (program + snippets):** `npx skills add neondatabase/agent-skill -s neon-postgres-agent-platforms`

Source: [`skills/neon-postgres-agent-platforms`](skills/neon-postgres-agent-platforms)

## Program

[**Neon AI Agent Program**](https://neon.com/use-cases/ai-agents)

## License

Apache 2.0 — [LICENSE](LICENSE)
