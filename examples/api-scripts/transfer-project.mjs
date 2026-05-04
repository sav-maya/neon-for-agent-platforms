#!/usr/bin/env node
/**
 * Transfer one or more projects from a source org to a destination org (e.g. free / sponsored → paid).
 * Personal API key with access to both orgs; see Neon docs on org project transfer.
 */
import { NeonApi } from "./lib/neon-client.mjs";

const key = process.env.NEON_API_KEY;
const sourceOrgId = process.env.NEON_SOURCE_ORG_ID;
const destinationOrgId = process.env.NEON_DESTINATION_ORG_ID;
const rawIds =
  process.env.NEON_PROJECT_IDS ||
  process.env.NEON_PROJECT_ID ||
  "";

if (!sourceOrgId || !destinationOrgId || !rawIds.trim()) {
  console.error(
    "Set NEON_SOURCE_ORG_ID, NEON_DESTINATION_ORG_ID, and NEON_PROJECT_IDS (comma-separated) or NEON_PROJECT_ID.",
  );
  process.exit(1);
}

const projectIds = rawIds
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const api = new NeonApi(key);
await api.transferProjects({
  sourceOrgId,
  destinationOrgId,
  projectIds,
});
console.log(
  JSON.stringify(
    {
      ok: true,
      transferred: projectIds,
      sourceOrgId,
      destinationOrgId,
    },
    null,
    2,
  ),
);
