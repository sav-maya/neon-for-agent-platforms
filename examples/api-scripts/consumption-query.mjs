#!/usr/bin/env node
/**
 * GET /consumption_history/v2/projects — usage-based metrics aligned with billing.
 * @see https://neon.com/docs/guides/consumption-metrics
 */
import { NeonApi } from "./lib/neon-client.mjs";

const key = process.env.NEON_API_KEY;
const orgId = process.env.NEON_ORG_ID;
const from = process.env.CONSUMPTION_FROM;
const to = process.env.CONSUMPTION_TO;
const granularity = process.env.CONSUMPTION_GRANULARITY || "daily";

const DEFAULT_METRICS = [
  "compute_unit_seconds",
  "root_branch_bytes_month",
  "child_branch_bytes_month",
  "instant_restore_bytes_month",
  "snapshot_storage_bytes_month",
  "public_network_transfer_bytes",
  "private_network_transfer_bytes",
  "extra_branches_month",
];

const metricsRaw = process.env.CONSUMPTION_METRICS;
const metrics = metricsRaw
  ? metricsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : DEFAULT_METRICS;

const projectIdsRaw = process.env.CONSUMPTION_PROJECT_IDS;
const projectIds = projectIdsRaw
  ? projectIdsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : undefined;

if (!orgId || !from || !to) {
  console.error(
    "Set NEON_API_KEY, NEON_ORG_ID, CONSUMPTION_FROM, CONSUMPTION_TO (RFC 3339). Optional: CONSUMPTION_GRANULARITY, CONSUMPTION_METRICS (comma list), CONSUMPTION_PROJECT_IDS.",
  );
  process.exit(1);
}

if (!["hourly", "daily", "monthly"].includes(granularity)) {
  console.error("CONSUMPTION_GRANULARITY must be hourly, daily, or monthly.");
  process.exit(1);
}

const api = new NeonApi(key);
const json = await api.getConsumptionHistoryV2({
  orgId,
  from,
  to,
  granularity,
  metrics,
  projectIds,
  limit: process.env.CONSUMPTION_LIMIT
    ? Number(process.env.CONSUMPTION_LIMIT)
    : undefined,
  cursor: process.env.CONSUMPTION_CURSOR || undefined,
});

console.log(JSON.stringify(json, null, 2));
