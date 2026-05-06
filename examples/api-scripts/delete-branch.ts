/**
 * Delete a branch by id (e.g. orphaned `main (old)` after a finalized restore).
 * Destructive — Neon may reject protected/root branches.
 *
 * @see https://neon.com/docs/ai/ai-database-versioning#cleanup-strategy
 */
import { NeonApi } from "./lib/neon-client.js";

const key = process.env.NEON_API_KEY;
const projectId = process.env.NEON_PROJECT_ID;
const branchId = process.env.NEON_BRANCH_ID;

if (!key || !projectId || !branchId) {
  console.error("Set NEON_API_KEY, NEON_PROJECT_ID, and NEON_BRANCH_ID.");
  process.exit(1);
}

console.error(
  "[delete-branch] Deleting branch — irreversible for that branch environment.",
);

const api = new NeonApi(key);
await api.deleteBranch(projectId, branchId);
console.log(JSON.stringify({ ok: true, projectId, branchId }, null, 2));
