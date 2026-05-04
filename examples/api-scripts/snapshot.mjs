#!/usr/bin/env node
/**
 * Create a logical snapshot on the default branch (same pattern as many agent hosts).
 */
import { NeonApi } from "./lib/neon-client.mjs";

const key = process.env.NEON_API_KEY;
const projectId = process.env.NEON_PROJECT_ID;
const snapshotName = process.env.NEON_SNAPSHOT_NAME;

if (!projectId) {
  console.error("Set NEON_PROJECT_ID.");
  process.exit(1);
}

const api = new NeonApi(key);
const snapshotId = await api.createSnapshot(projectId, {
  name: snapshotName || undefined,
});
console.log(JSON.stringify({ snapshotId, projectId }, null, 2));
