#!/usr/bin/env node
import { NeonApi } from "./lib/neon-client.mjs";

const key = process.env.NEON_API_KEY;
const projectId = process.env.NEON_PROJECT_ID;

if (!projectId) {
  console.error("Set NEON_PROJECT_ID to the project to delete.");
  process.exit(1);
}

const api = new NeonApi(key);
await api.deleteProject(projectId);
console.log(`Deleted project ${projectId}`);
