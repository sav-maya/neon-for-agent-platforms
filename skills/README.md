# Skills (Agent Skills format)

This directory follows the **[Agent Skills](https://agentskills.io/home)** layout: each capability is a folder with **`SKILL.md`** (required metadata + instructions) and optional **`scripts/`**, **`references/`**, **`assets/`** — see the **[specification](https://agentskills.io/specification)**.

```
skills/
└── neon-postgres-agent-platforms/
    ├── SKILL.md
    ├── references/
    ├── scripts/
    └── assets/
```

## In this repository

| Piece | Location |
| ----- | -------- |
| **Companion skill** (Agent Program context for assistants) | [`neon-postgres-agent-platforms/`](neon-postgres-agent-platforms/) |
| **Runnable Management API samples** (Node, `fetch`) | [`../examples/api-scripts/`](../examples/api-scripts/) at repo root |

Partner onboarding and clone/run flows use **[`../README.md`](../README.md)** (*Start here*). Install the published skill with Neon’s bundle (**[`neon-postgres`](https://github.com/neondatabase/agent-skills)** + **`neon-postgres-agent-platforms`**); this repo is the **source** for the companion skill text and the **examples** beside it.
