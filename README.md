# Neon for agent platforms

**Start here:** [**docs/MINI_REFERENCE_AND_SKILL.md**](docs/MINI_REFERENCE_AND_SKILL.md) — step-by-step: clone → run [`examples/minimal-node`](examples/minimal-node) → install the skill:

```bash
npx skills add neondatabase/agent-skill -s neon-postgres-agent-platforms
```

**Agent Program partners:** deeper orientation is [**docs/NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md**](docs/NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md). This repo does **not** repeat Neon’s main [**Agent Skill**](https://neon.com/docs/ai/agent-skills) (`neon-postgres`) — use that (or **`npx neonctl@latest init`**) for Auth, Data API, toolkit, MCP, drivers, and the rest.

| Doc | What |
|-----|------|
| [**How to use this repo**](docs/MINI_REFERENCE_AND_SKILL.md) | Reference implementation + skill install commands |
| [**Partner guide**](docs/NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md) | Two-org Agent Program model + links |

## Reference implementation

[**github.com/sav-maya/neon-for-agent-platforms**](https://github.com/sav-maya/neon-for-agent-platforms) — [`examples/minimal-node`](examples/minimal-node)

## Skills

- **This repo (program + snippets):** `npx skills add neondatabase/agent-skill -s neon-postgres-agent-platforms` — source: [`skills/neon-postgres-agent-platforms`](skills/neon-postgres-agent-platforms)
- **General Neon:** `npx skills add neondatabase/agent-skills -s neon-postgres` or `npx neonctl@latest init`

## Program

[**Neon AI Agent Program**](https://neon.com/use-cases/ai-agents)

## License

Apache 2.0 — [LICENSE](LICENSE)
