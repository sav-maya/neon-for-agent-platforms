/**
 * Create a logical snapshot on the default branch (same pattern as many agent hosts).
 */
import { NeonApi } from "./lib/neon-client.js";

const key = process.env.NEON_API_KEY;
const projectId = process.env.NEON_PROJECT_ID;
const snapshotName = process.env.NEON_SNAPSHOT_NAME;
const expiresAt = process.env.NEON_SNAPSHOT_EXPIRES_AT?.trim();
const lsn = process.env.NEON_SNAPSHOT_LSN?.trim();

if (!key) {
  console.error("Set NEON_API_KEY.");
  process.exit(1);
}

if (!projectId) {
  console.error("Set NEON_PROJECT_ID.");
  process.exit(1);
}

const api = new NeonApi(key);
const snapshotId = await api.createSnapshot(projectId, {
  name: snapshotName || undefined,
  ...(expiresAt ? { expiresAt } : {}),
  ...(lsn ? { lsn } : {}),
});
console.log(JSON.stringify({ snapshotId, projectId }, null, 2));
