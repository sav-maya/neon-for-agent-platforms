#!/usr/bin/env node
/**
 * Create a Neon project (REST API). Optional org + autoscaling match multi-tenant / Agent Program flows.
 */
import { NeonApi } from "./lib/neon-client.mjs";

const key = process.env.NEON_API_KEY;
const orgId = process.env.NEON_ORG_ID;
const name =
  process.env.NEON_PROJECT_NAME?.trim() || `tenant-${Date.now()}`;

const api = new NeonApi(key);

const { projectId, databaseUrl } = await api.createProject({
  name,
  orgId: orgId || undefined,
  endpointSettings: {
    autoscaling_limit_min_cu: 0.25,
    autoscaling_limit_max_cu: 2,
    suspend_timeout_seconds: 300,
  },
});

console.log(JSON.stringify({ projectId, databaseUrl, name }, null, 2));
