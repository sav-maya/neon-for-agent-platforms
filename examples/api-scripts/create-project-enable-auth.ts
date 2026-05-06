/**
 * Create a Neon project and enable Neon Auth (Better Auth) on the default branch.
 *
 * Env: NEON_API_KEY; optional NEON_ORG_ID, NEON_PROJECT_NAME (see create-project.ts).
 *
 * @see https://neon.com/docs/neon-auth/get-started
 */
import { NeonApi } from "./lib/neon-client.js";

const key = process.env.NEON_API_KEY;
const orgId = process.env.NEON_ORG_ID;
const name = process.env.NEON_PROJECT_NAME?.trim() || `auth-demo-${Date.now()}`;

if (!key) {
  console.error("Set NEON_API_KEY.");
  process.exit(1);
}

const api = new NeonApi(key);

console.error("[create-project-enable-auth] Creating project...");
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
  console.error("No production branch (main or production).");
  process.exit(1);
}

console.error(
  `[create-project-enable-auth] Enabling Neon Auth on branch ${prod.id}...`,
);
const auth = await api.enableNeonAuthForBranch(projectId, prod.id);

console.log(
  JSON.stringify(
    {
      projectId,
      branchId: prod.id,
      branchName: prod.name,
      databaseUrl,
      neonAuth: auth,
    },
    null,
    2,
  ),
);
