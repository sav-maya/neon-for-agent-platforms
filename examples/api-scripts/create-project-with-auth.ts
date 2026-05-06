/**
 * Create a Neon project, then enable Neon Auth on the default branch (Better Auth).
 *
 * Env (same as create-project.ts, plus optional):
 *   NEON_API_KEY — required
 *   NEON_ORG_ID — optional but usually required for personal keys
 *   NEON_PROJECT_NAME — optional (default tenant-auth-<timestamp>)
 *   NEON_AUTH_DATABASE_NAME — optional; attach Auth to a non-default DB on the branch
 *
 * Prints Neon Auth keys once — store pub_client_key / secret_server_key securely.
 */
import { NeonAuthSupportedAuthProvider } from "@neondatabase/api-client";
import { NeonApi } from "./lib/neon-client.js";

const key = process.env.NEON_API_KEY;
const orgId = process.env.NEON_ORG_ID;
const name = process.env.NEON_PROJECT_NAME?.trim() || `tenant-auth-${Date.now()}`;
const authDb = process.env.NEON_AUTH_DATABASE_NAME?.trim();

if (!key) {
  console.error("Set NEON_API_KEY.");
  process.exit(1);
}

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

const prod = await api.getProductionBranch(projectId);
if (!prod?.id) {
  console.error(JSON.stringify({ error: "No production branch after create", projectId }, null, 2));
  process.exit(1);
}

const neonAuth = await api.enableBranchNeonAuth(projectId, prod.id, {
  authProvider: NeonAuthSupportedAuthProvider.BetterAuth,
  ...(authDb ? { databaseName: authDb } : {}),
});

console.error(
  "[neon-auth] Keys below are shown once by Neon; save pub_client_key and secret_server_key.",
);

console.log(
  JSON.stringify(
    {
      projectId,
      branchId: prod.id,
      databaseUrl,
      name,
      neonAuth,
    },
    null,
    2,
  ),
);
