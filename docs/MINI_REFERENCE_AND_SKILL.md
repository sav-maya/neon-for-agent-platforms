# Mini reference + skills

## Reference implementation

**[github.com/neondatabase/neon-for-agent-platforms](https://github.com/neondatabase/neon-for-agent-platforms)** → `[examples/minimal-node](https://github.com/neondatabase/neon-for-agent-platforms/tree/main/examples/minimal-node)`

```bash
cd examples/minimal-node && npm install && cp .env.example .env
# set DATABASE_URL, then: npm run start
```

## Skills

**General Neon** (Auth, Data API, toolkit, MCP, drivers, consumption API, etc.) — use Neon’s main skill:

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
```

Or `**npx neonctl@latest init**` — [Agent Skills](https://neon.com/docs/ai/agent-skills).

**Agent Program org model + mini repo snippets only:**

```bash
npx skills add neondatabase/agent-skill -s neon-postgres-agent-platforms
```

---

[Partner builder guide](NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md)