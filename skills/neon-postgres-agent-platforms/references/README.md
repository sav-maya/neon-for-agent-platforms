# Skill references (progressive disclosure)

Supplementary material for **neon-postgres-agent-platforms** lives here per the [Agent Skills specification](https://agentskills.io/specification) (`references/` is optional and may include any file types).

**Human onboarding:** [README.md § Start here](../../../README.md#start-here-agent-program-partners) (repo root) · **Catalog & env vars:** [MANAGEMENT_API_SAMPLES.md](MANAGEMENT_API_SAMPLES.md).

## Symlinked TypeScript (same files as `../../../scripts/`)

Each **`*.ts`** file in this directory is a **symbolic link** to the canonical source under **`scripts/`** so assistants can open samples beside the skill.


| Symlink                                                      | Purpose (short)                                      |
| ------------------------------------------------------------ | ---------------------------------------------------- |
| `[auth-users.ts](auth-users.ts)`                             | Neon Auth REST admin (`meta`, `create`, `delete`).   |
| `[branch.ts](branch.ts)`                                     | List or create branches.                             |
| `[consumption-query.ts](consumption-query.ts)`               | Billing-aligned consumption **v2** per project/org.  |
| `[create-project-with-auth.ts](create-project-with-auth.ts)` | Create project + enable Neon Auth on the branch.     |
| `[create-project.ts](create-project.ts)`                     | Create project; wait on operations.                  |
| `[delete-branch.ts](delete-branch.ts)`                       | Delete a branch by id (e.g. orphaned `main (old)`).  |
| `[delete-project.ts](delete-project.ts)`                     | Delete a project (destructive).                      |
| `[delete-snapshot.ts](delete-snapshot.ts)`                   | Delete one snapshot; polls operations.               |
| `[list-projects.ts](list-projects.ts)`                       | List projects (ids + names).                         |
| `[list-snapshots.ts](list-snapshots.ts)`                     | List snapshots for `NEON_PROJECT_ID`.                |
| `[promote-safe-production.ts](promote-safe-production.ts)`   | Safe promote / bootstrap / rollback flows.           |
| `[rename-snapshot.ts](rename-snapshot.ts)`                   | PATCH rename snapshot.                               |
| `[restore-snapshot.ts](restore-snapshot.ts)`                 | Apply snapshot to a branch.                          |
| `[snapshot.ts](snapshot.ts)`                                 | Create logical snapshot on default branch.           |
| `[transfer-project.ts](transfer-project.ts)`                 | Move project between orgs (personal key).            |
| `[versioning-flow.ts](versioning-flow.ts)`                   | Snapshot → branch → restore demo.                    |
| `[utils.ts](utils.ts)`                                       | Shared polling helpers for async Management API ops. |


**Run:** from `**scripts/`**, use `**npm run …**` or `**npx tsx <script>.ts**` (sources are `**.ts**` only; no compile output).

**Windows:** enable Git symlink support (`git config core.symlinks true`) so links resolve after clone.

## Other reference paths


| Path                                                                                                                                                         | Contents                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| `[MANAGEMENT_API_SAMPLES.md](MANAGEMENT_API_SAMPLES.md)`                                                                                                     | Env vars, npm commands, flows                |
| `[application-rest-api/](application-rest-api/)`                                                                                                             | App-level curl examples (not Neon console)   |
| [COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md](COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md), [CHECKPOINT_ORCHESTRATION_PATTERN.md](CHECKPOINT_ORCHESTRATION_PATTERN.md) | Checkpoint patterns (compound ledger + orchestration) |
| `[pricing-and-plan-features.md](pricing-and-plan-features.md)`                                                                                               | Agent Plan pricing summary                   |
| [README.md](../../../README.md) (repository root)                                                                                                            | Front door: overview, scripts, skill install |
| `[AGENTS.md](AGENTS.md)`                                                                                                                                     | Guidance for AI agents editing this repo     |
| `[LICENSE](LICENSE)`                                                                                                                                         | Apache-2.0 full text                         |
