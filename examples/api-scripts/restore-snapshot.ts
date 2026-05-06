/**
 * Restore an existing snapshot onto a branch (single REST step after versioning-flow or Console).
 *
 * @see https://neon.com/docs/ai/ai-database-versioning
 */
import { NeonApi } from "./lib/neon-client.js";

const key = process.env.NEON_API_KEY;
const projectId = process.env.NEON_PROJECT_ID;
const snapshotId = process.env.NEON_SNAPSHOT_ID;
const targetBranchId = process.env.NEON_TARGET_BRANCH_ID;

if (!key || !projectId || !snapshotId || !targetBranchId) {
  console.error(
    "Set NEON_API_KEY, NEON_PROJECT_ID, NEON_SNAPSHOT_ID, NEON_TARGET_BRANCH_ID.",
  );
  process.exit(1);
}

const api = new NeonApi(key);
await api.applySnapshot(projectId, snapshotId, targetBranchId);
console.log(
  JSON.stringify(
    {
      ok: true,
      projectId,
      snapshotId,
      targetBranchId,
    },
    null,
    2,
  ),
);
