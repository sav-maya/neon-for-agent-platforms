/**
 * Delete one snapshot by id (async operations are polled to completion).
 * @see https://neon.com/docs/ai/ai-database-versioning#delete-snapshot
 */
import { NeonApi } from "./lib/neon-client.js";

const key = process.env.NEON_API_KEY;
const projectId = process.env.NEON_PROJECT_ID;
const snapshotId = process.env.NEON_SNAPSHOT_ID;

if (!key || !projectId || !snapshotId) {
  console.error("Set NEON_API_KEY, NEON_PROJECT_ID, and NEON_SNAPSHOT_ID.");
  process.exit(1);
}

const api = new NeonApi(key);
await api.deleteSnapshot(projectId, snapshotId);
console.log(JSON.stringify({ ok: true, projectId, snapshotId }, null, 2));
