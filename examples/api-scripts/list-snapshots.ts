/**
 * List all logical snapshots for a project (IDs, names, timestamps — see Neon API).
 * @see https://neon.com/docs/ai/ai-database-versioning#list-available-snapshots
 */
import { NeonApi } from "./lib/neon-client.js";

const key = process.env.NEON_API_KEY;
const projectId = process.env.NEON_PROJECT_ID;

if (!key || !projectId) {
  console.error("Set NEON_API_KEY and NEON_PROJECT_ID.");
  process.exit(1);
}

const api = new NeonApi(key);
const snapshots = await api.listSnapshots(projectId);
console.log(JSON.stringify({ projectId, snapshots }, null, 2));
