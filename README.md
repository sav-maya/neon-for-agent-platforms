# Neon for agent platforms

**Start here:** [**docs/MINI_REFERENCE_AND_SKILL.md**](docs/MINI_REFERENCE_AND_SKILL.md) — run [`examples/minimal-node`](examples/minimal-node), then wire skills.

**Best experience with an AI assistant:** install Neon’s skills from **[github.com/neondatabase/agent-skills](https://github.com/neondatabase/agent-skills)** (primary topic `neon-postgres`). That is what covers Auth, Data API, toolkit, MCP, drivers, and the rest. This repo stays narrow on **Agent Program** layout and the minimal sample.

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
```

**Agent Program add-on** (optional; use _with_ `neon-postgres`, not instead):

```bash
npx skills add neondatabase/agent-skill -s neon-postgres-agent-platforms
```

**Agent Program partners:** deeper orientation is [**docs/NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md**](docs/NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md).

| Doc | What |
|-----|------|
| [**How to use this repo**](docs/MINI_REFERENCE_AND_SKILL.md) | Sample run + `agent-skills` first, then optional program skill |
| [**Partner guide**](docs/NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md) | Two-org Agent Program model + links |

## Reference implementation

[**github.com/sav-maya/neon-for-agent-platforms**](https://github.com/sav-maya/neon-for-agent-platforms) — [`examples/minimal-node`](examples/minimal-node)

## Skills

| Priority | Install | Purpose |
|----------|---------|---------|
| **Recommended** | [`neondatabase/agent-skills`](https://github.com/neondatabase/agent-skills): `npx skills add neondatabase/agent-skills -s neon-postgres` or `npx neonctl@latest init` | Full Neon platform guidance — **best assistant experience** |
| **Optional add-on** | `npx skills add neondatabase/agent-skill -s neon-postgres-agent-platforms` — source [`skills/neon-postgres-agent-platforms`](skills/neon-postgres-agent-platforms) | Agent Program org model + mini-repo snippets only |

## Program

[**Neon AI Agent Program**](https://neon.com/use-cases/ai-agents)

## License

Apache 2.0 — [LICENSE](LICENSE)
