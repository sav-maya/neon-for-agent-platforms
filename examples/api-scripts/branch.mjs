#!/usr/bin/env node
/**
 * List branches or create a dev branch from production (main / production).
 *
 * Usage:
 *   NEON_API_KEY=... NEON_PROJECT_ID=... node branch.mjs list
 *   NEON_API_KEY=... NEON_PROJECT_ID=... node branch.mjs create <branch-name>
 */
import { NeonApi } from "./lib/neon-client.mjs";

const key = process.env.NEON_API_KEY;
const projectId = process.env.NEON_PROJECT_ID;
const [, , cmd, branchName] = process.argv;

if (!key) {
  console.error("Set NEON_API_KEY.");
  process.exit(1);
}

if (!projectId) {
  console.error("Set NEON_PROJECT_ID.");
  process.exit(1);
}

const api = new NeonApi(key);

if (cmd === "list") {
  const branches = await api.listBranches(projectId);
  console.log(JSON.stringify(branches, null, 2));
  process.exit(0);
}

if (cmd === "create") {
  if (!branchName) {
    console.error("Usage: node branch.mjs create <branch-name>");
    process.exit(1);
  }
  const parent = await api.getProductionBranch(projectId);
  if (!parent?.id) {
    console.error("Could not resolve production branch (main or production).");
    process.exit(1);
  }
  const optionalParent = process.env.NEON_PARENT_BRANCH_ID;
  const parentId = optionalParent || parent.id;
  const { id } = await api.createBranch(projectId, {
    name: branchName,
    parentId,
  });
  console.log(JSON.stringify({ branchId: id, parentBranchId: parentId }, null, 2));
  process.exit(0);
}

console.error("Usage: node branch.mjs list | create <branch-name>");
process.exit(1);
