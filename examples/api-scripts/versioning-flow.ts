/**
 * Full snapshot → branch → (optional SQL) → snapshot → restore flow for AI database versioning.
 *
 * 1. Snapshot the production branch (baseline).
 * 2. Create a child branch from production (sandbox).
 * 3. Optionally run SQL on the child branch (set DEMO_MUTATE=1; requires `npm install` in this folder for `pg`).
 * 4. (Skipped) Logical snapshots are **root-branch only** in the Neon API (`not allowed to snapshot non-root branch`).
 * 5. Restore the baseline snapshot onto the child branch (undo / rewind).
 *
 * @see https://neon.com/docs/ai/ai-database-versioning
 */
import { NeonApi } from "./lib/neon-client.js";

const key = process.env.NEON_API_KEY;
const projectId = process.env.NEON_PROJECT_ID;
const demoMutate =
  process.env.DEMO_MUTATE === "1" || process.env.DEMO_MUTATE === "true";

if (!key || !projectId) {
  console.error("Set NEON_API_KEY and NEON_PROJECT_ID.");
  process.exit(1);
}

const api = new NeonApi(key);

const prod = await api.getProductionBranch(projectId);
if (prod == null || !prod.id) {
  console.error("No production branch (main or production).");
  process.exit(1);
}

const runId = Date.now();
const baselineName = process.env.VERSION_BASELINE_NAME ?? `flow-baseline-${runId}`;
const demoBranchName =
  process.env.VERSION_DEMO_BRANCH_NAME ?? `versioning-demo-${runId}`;

console.error("[versioning-flow] 1/5 Snapshot production branch (baseline)...");
const baselineSnapshotId = await api.createSnapshot(projectId, {
  name: baselineName,
});

console.error("[versioning-flow] 2/5 Create child branch from production...");
const { id: demoBranchId } = await api.createBranch(projectId, {
  name: demoBranchName,
  parentId: prod.id,
});

let sqlNote = "skipped (set DEMO_MUTATE=1 and run npm install here for pg)";
if (demoMutate) {
  try {
    const { default: pg } = await import("pg");
    console.error("[versioning-flow] 3/5 Optional SQL mutation on demo branch...");
    const dbUrl = await api.getConnectionUri({
      projectId,
      branchId: demoBranchId,
      pooled: true,
    });
    const client = new pg.Client({ connectionString: dbUrl });
    await client.connect();
    try {
      await client.query(
        `CREATE TABLE IF NOT EXISTS neon_versioning_demo (
          id serial PRIMARY KEY,
          note text,
          created_at timestamptz DEFAULT now()
        )`,
      );
      await client.query(`INSERT INTO neon_versioning_demo (note) VALUES ($1)`, [
        `demo mutation ${runId}`,
      ]);
    } finally {
      await client.end();
    }
    sqlNote = "inserted row into neon_versioning_demo";
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(
      "[versioning-flow] DEMO_MUTATE failed (run `npm install` in examples/api-scripts):",
      msg,
    );
    sqlNote = `failed: ${msg}`;
  }
} else {
  console.error("[versioning-flow] 3/5 Skipping SQL (DEMO_MUTATE unset).");
}

console.error(
  "[versioning-flow] 4/5 Skip snapshot of demo branch — Neon allows logical snapshots on the root branch only.",
);

console.error(
  "[versioning-flow] 5/5 Restore baseline snapshot onto demo branch (rewind)...",
);
await api.applySnapshot(projectId, baselineSnapshotId, demoBranchId);

console.log(
  JSON.stringify(
    {
      projectId,
      productionBranchId: prod.id,
      baselineSnapshotId,
      demoBranchId,
      demoBranchName,
      afterSnapshotId: null,
      afterSnapshotNote:
        "Logical snapshots are root-branch only; see versioning-flow.ts header.",
      demoMutation: sqlNote,
      restoredBaselineToDemoBranch: true,
    },
    null,
    2,
  ),
);
