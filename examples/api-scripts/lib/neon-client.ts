/**
 * Thin wrapper around the official Neon Management API TypeScript SDK.
 * @see https://neon.com/docs/reference/typescript-sdk
 */
import {
  ConsumptionHistoryGranularity,
  createApiClient,
  NeonAuthSupportedAuthProvider,
  OperationStatus,
  type Api,
  type Branch,
  type ConnectionURIResponse,
  type DefaultEndpointSettings,
  type NeonAuthCreateIntegrationResponse,
  type NeonAuthCreateNewUserResponse,
  type Operation,
  type Snapshot,
} from "@neondatabase/api-client";

import type {
  ManagementApiConsumptionHistoryPerProjectV2ResponseBody,
  NeonApiCreateBranchResult,
  NeonApiCreateProjectResult,
  NeonApiCreateSnapshotResult,
  NeonApiRestoreSnapshotAsNewBranchResult,
  NeonApiSettledOperationStatus,
  NeonApiWaitForOperationsResult,
  NeonManagementApiErrorBody,
} from "./neon-api-response-types.js";

export type ConsumptionGranularity = ConsumptionHistoryGranularity;

export interface NeonApiOptions {
  /** Optional API base URL override. */
  baseUrl?: string;
}

export interface BranchSummary {
  id?: string;
  name?: string;
  created_at?: string;
  parent_id?: string;
}

export type BranchWithId = BranchSummary & { id: string };

export interface CreateProjectParams {
  name: string;
  orgId?: string;
  endpointSettings?: DefaultEndpointSettings;
}

export interface CreateBranchParams {
  name: string;
  parentId?: string;
}

export interface CreateSnapshotOptions {
  name?: string;
  /** RFC 3339; defaults to now. Omit when using `lsn`. */
  timestamp?: string;
  /** Mutually exclusive with `timestamp` in the Neon API. */
  lsn?: string;
  /** RFC 3339 auto-deletion time ([snapshot lifecycle](https://neon.com/docs/ai/ai-database-versioning#cleanup-strategy)). */
  expiresAt?: string;
  branchId?: string;
}

export interface ApplySnapshotOptions {
  restoreBranchName?: string;
  finalizeRestore?: boolean;
}

/** Restore a snapshot into a **new** branch (no `target_branch_id`) — e.g. bootstrap `dev` from a prod snapshot. */
export interface RestoreSnapshotAsNewBranchOptions {
  /** Name for the newly created branch. */
  newBranchName: string;
  /** Preview branch when `false` (default); rarely `true` for immediate finalize. */
  finalizeRestore?: boolean;
}

export interface GetConnectionUriParams {
  projectId: string;
  branchId?: string;
  databaseName?: string;
  roleName?: string;
  endpointId?: string;
  pooled?: boolean;
}

export interface TransferProjectsParams {
  sourceOrgId: string;
  destinationOrgId: string;
  projectIds: string[];
}

export interface WaitOpsOptions {
  pollIntervalMs?: number;
  timeoutMs?: number;
}

export interface CreateBranchAuthUserBody {
  email: string;
  name?: string;
}

export interface ConsumptionHistoryParams {
  orgId: string;
  from: string;
  to: string;
  granularity: ConsumptionGranularity;
  metrics: string[];
  projectIds?: string[];
  limit?: number;
  cursor?: string;
}

export interface EnableBranchNeonAuthParams {
  /** Defaults to Better Auth (`better_auth`). */
  authProvider?: NeonAuthSupportedAuthProvider;
  /** Optional non-default database on the branch. */
  databaseName?: string;
}

function branchToSummary(b: Branch): BranchWithId {
  return {
    id: b.id,
    name: b.name,
    created_at: b.created_at,
    parent_id: b.parent_id,
  };
}

function isTerminalSuccess(status: string): boolean {
  return (
    status === OperationStatus.Finished ||
    status === OperationStatus.Skipped ||
    status === OperationStatus.Cancelled
  );
}

function isTerminalFailure(status: string): boolean {
  return status === OperationStatus.Failed || status === OperationStatus.Error;
}

/**
 * Prefer Neon JSON `{ message, code }` over a raw Axios stack trace (clearer + avoids noisy dumps).
 */
export function formatNeonManagementError(err: unknown): Error {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: NeonManagementApiErrorBody } })
      .response?.data;
    if (data?.message) {
      const text = data.code ? `${data.code}: ${data.message}` : data.message;
      return new Error(text);
    }
  }
  if (err instanceof Error) return err;
  return new Error(String(err));
}

export class NeonApi {
  private readonly api: Api<unknown>;

  constructor(apiKey: string, opts: NeonApiOptions = {}) {
    if (!apiKey) {
      throw new Error("NEON_API_KEY is required");
    }
    this.api = createApiClient({
      apiKey,
      ...(opts.baseUrl ? { baseURL: opts.baseUrl } : {}),
    });
  }

  async fetchOperationStatus(
    projectId: string,
    operationId: string,
  ): Promise<OperationStatus> {
    const { data } = await this.api.getProjectOperation(projectId, operationId);
    const status = data.operation?.status;
    if (!status) {
      throw new Error(`Operation status missing for ${operationId}`);
    }
    return status;
  }

  async waitForOperationsToSettle(
    projectId: string,
    operationIds: string[],
    options: WaitOpsOptions = {},
  ): Promise<NeonApiWaitForOperationsResult> {
    const pollIntervalMs = options.pollIntervalMs ?? 2000;
    const timeoutMs = options.timeoutMs ?? 5 * 60 * 1000;
    const results: NeonApiWaitForOperationsResult = {};
    for (const opId of operationIds) {
      const startedAt = Date.now();
      for (;;) {
        const status = await this.fetchOperationStatus(projectId, opId);
        if (isTerminalFailure(status)) {
          throw new Error(`Operation ${opId} ended with status ${status}`);
        }
        if (isTerminalSuccess(status)) {
          results[opId] = status as NeonApiSettledOperationStatus;
          break;
        }
        if (Date.now() - startedAt > timeoutMs) {
          throw new Error(
            `Timed out waiting for operation ${opId} (last status: ${status})`,
          );
        }
        await new Promise((r) => setTimeout(r, pollIntervalMs));
      }
    }
    return results;
  }

  async createProject({
    name,
    orgId,
    endpointSettings,
  }: CreateProjectParams): Promise<NeonApiCreateProjectResult> {
    const { data } = await this.api.createProject({
      project: {
        name,
        ...(orgId ? { org_id: orgId } : {}),
        ...(endpointSettings
          ? { default_endpoint_settings: endpointSettings }
          : {}),
      },
    });
    const projectId = data.project?.id;
    if (!projectId) {
      throw new Error("Create project: missing project id in response");
    }
    const databaseUrl = data.connection_uris?.[0]?.connection_uri;
    if (!databaseUrl) {
      throw new Error("Create project: missing connection URI in response");
    }
    const opIds = (data.operations ?? [])
      .map((o: Operation) => o.id)
      .filter((id): id is string => typeof id === "string" && id.length > 0);
    if (opIds.length > 0) {
      await this.waitForOperationsToSettle(projectId, opIds);
    }
    return { projectId, databaseUrl };
  }

  async deleteProject(projectId: string): Promise<void> {
    await this.api.deleteProject(projectId);
  }

  async listBranches(projectId: string): Promise<BranchWithId[]> {
    const { data } = await this.api.listProjectBranches({ projectId });
    return (data.branches ?? []).map(branchToSummary);
  }

  async getProductionBranch(
    projectId: string,
  ): Promise<BranchWithId | undefined> {
    const branches = await this.listBranches(projectId);
    return (
      branches.find((b) => b.name === "main") ??
      branches.find((b) => b.name === "production")
    );
  }

  async createBranch(
    projectId: string,
    { name, parentId }: CreateBranchParams,
  ): Promise<NeonApiCreateBranchResult> {
    const { data } = await this.api.createProjectBranch(projectId, {
      branch: {
        name,
        ...(parentId ? { parent_id: parentId } : {}),
      },
    });
    const id = data.branch?.id;
    if (!id) {
      throw new Error("Create branch: missing id in response");
    }
    const branchOpIds = (data.operations ?? [])
      .map((op: Operation) => op.id)
      .filter(
        (oid): oid is string => typeof oid === "string" && oid.length > 0,
      );
    if (branchOpIds.length > 0) {
      await this.waitForOperationsToSettle(projectId, branchOpIds);
    }
    return { id };
  }

  async createSnapshot(
    projectId: string,
    options: CreateSnapshotOptions = {},
  ): Promise<NeonApiCreateSnapshotResult> {
    let branchId = options.branchId;
    if (!branchId) {
      const prod = await this.getProductionBranch(projectId);
      if (!prod?.id) {
        throw new Error(
          "No production branch (expected name main or production)",
        );
      }
      branchId = prod.id;
    }
    const base = {
      projectId,
      branchId,
      ...(options.name ? { name: options.name } : {}),
      ...(options.expiresAt ? { expires_at: options.expiresAt } : {}),
    };
    const { data } = await this.api.createSnapshot(
      options.lsn
        ? { ...base, lsn: options.lsn }
        : {
            ...base,
            timestamp: options.timestamp ?? new Date().toISOString(),
          },
    );
    const snapshotId = data.snapshot?.id;
    if (!snapshotId) {
      throw new Error("Create snapshot: missing snapshot id in response");
    }
    const snapshotOpIds = (data.operations ?? [])
      .map((op: Operation) => op.id)
      .filter(
        (oid): oid is string => typeof oid === "string" && oid.length > 0,
      );
    if (snapshotOpIds.length > 0) {
      await this.waitForOperationsToSettle(projectId, snapshotOpIds);
    }
    return snapshotId;
  }

  async applySnapshot(
    projectId: string,
    snapshotId: string,
    targetBranchId: string,
    options: ApplySnapshotOptions = {},
  ): Promise<void> {
    try {
      const { data } = await this.api.restoreSnapshot(
        { projectId, snapshotId },
        {
          name: options.restoreBranchName ?? `before_restore_${Date.now()}`,
          finalize_restore: options.finalizeRestore !== false,
          target_branch_id: targetBranchId,
        },
      );
      const operationIds = (data.operations ?? [])
        .map((op: Operation) => op.id)
        .filter((id): id is string => typeof id === "string" && id.length > 0);
      if (operationIds.length > 0) {
        await this.waitForOperationsToSettle(projectId, operationIds);
      }
    } catch (e) {
      throw formatNeonManagementError(e);
    }
  }

  /**
   * Restore snapshot without `target_branch_id` — Neon creates a **new** branch (see promotion blog Phase 1).
   */
  async restoreSnapshotAsNewBranch(
    projectId: string,
    snapshotId: string,
    options: RestoreSnapshotAsNewBranchOptions,
  ): Promise<NeonApiRestoreSnapshotAsNewBranchResult> {
    try {
      const { data } = await this.api.restoreSnapshot(
        { projectId, snapshotId },
        {
          name: options.newBranchName,
          finalize_restore: options.finalizeRestore ?? false,
        },
      );
      const operationIds = (data.operations ?? [])
        .map((op: Operation) => op.id)
        .filter((id): id is string => typeof id === "string" && id.length > 0);
      if (operationIds.length > 0) {
        await this.waitForOperationsToSettle(projectId, operationIds);
      }
      const branchId = data.branch?.id;
      if (!branchId) {
        throw new Error(
          "restoreSnapshotAsNewBranch: missing branch id in response",
        );
      }
      return { branchId };
    } catch (e) {
      throw formatNeonManagementError(e);
    }
  }

  async listSnapshots(projectId: string): Promise<Snapshot[]> {
    const { data } = await this.api.listSnapshots(projectId);
    return data.snapshots ?? [];
  }

  async deleteSnapshot(projectId: string, snapshotId: string): Promise<void> {
    const { data } = await this.api.deleteSnapshot(projectId, snapshotId);
    const operationIds = (data.operations ?? [])
      .map((op: Operation) => op.id)
      .filter((id): id is string => typeof id === "string" && id.length > 0);
    if (operationIds.length > 0) {
      await this.waitForOperationsToSettle(projectId, operationIds);
    }
  }

  async updateSnapshotName(
    projectId: string,
    snapshotId: string,
    name: string,
  ): Promise<void> {
    await this.api.updateSnapshot(projectId, snapshotId, {
      snapshot: { name },
    });
  }

  async deleteBranch(projectId: string, branchId: string): Promise<void> {
    const { data } = await this.api.deleteProjectBranch(projectId, branchId);
    const operationIds = (data.operations ?? [])
      .map((op: Operation) => op.id)
      .filter((id): id is string => typeof id === "string" && id.length > 0);
    if (operationIds.length > 0) {
      await this.waitForOperationsToSettle(projectId, operationIds);
    }
  }

  async getConnectionUri({
    projectId,
    branchId,
    databaseName = "neondb",
    roleName = "neondb_owner",
    endpointId,
    pooled,
  }: GetConnectionUriParams): Promise<ConnectionURIResponse["uri"]> {
    const { data } = await this.api.getConnectionUri({
      projectId,
      branch_id: branchId,
      database_name: databaseName,
      role_name: roleName,
      endpoint_id: endpointId,
      pooled,
    });
    const uri = data.uri;
    if (!uri) {
      throw new Error("getConnectionUri: missing uri in response");
    }
    return uri;
  }

  async transferProjects({
    sourceOrgId,
    destinationOrgId,
    projectIds,
  }: TransferProjectsParams): Promise<void> {
    await this.api.transferProjectsFromOrgToOrg(sourceOrgId, {
      destination_org_id: destinationOrgId,
      project_ids: projectIds,
    });
  }

  async getConsumptionHistoryV2(
    p: ConsumptionHistoryParams,
  ): Promise<ManagementApiConsumptionHistoryPerProjectV2ResponseBody> {
    const { data } = await this.api.getConsumptionHistoryPerProjectV2({
      org_id: p.orgId,
      from: p.from,
      to: p.to,
      granularity: p.granularity,
      metrics: p.metrics,
      project_ids: p.projectIds,
      limit: p.limit,
      cursor: p.cursor,
    });
    return data;
  }

  async enableBranchNeonAuth(
    projectId: string,
    branchId: string,
    params: EnableBranchNeonAuthParams = {},
  ): Promise<NeonAuthCreateIntegrationResponse> {
    const { data } = await this.api.createNeonAuth(projectId, branchId, {
      auth_provider:
        params.authProvider ?? NeonAuthSupportedAuthProvider.BetterAuth,
      ...(params.databaseName ? { database_name: params.databaseName } : {}),
    });
    return data;
  }

  async createBranchAuthUser(
    projectId: string,
    branchId: string,
    body: CreateBranchAuthUserBody,
  ): Promise<NeonAuthCreateNewUserResponse> {
    const { data } = await this.api.createBranchNeonAuthNewUser(
      projectId,
      branchId,
      {
        email: body.email,
        ...(body.name ? { name: body.name } : {}),
      },
    );
    return data;
  }

  async deleteBranchAuthUser(
    projectId: string,
    branchId: string,
    authUserId: string,
  ): Promise<void> {
    await this.api.deleteBranchNeonAuthUser(projectId, branchId, authUserId);
  }
}

export type {
  ManagementApiConsumptionHistoryPerProjectV2ResponseBody,
  ManagementApiCreateBranchResponseBody,
  ManagementApiCreateProjectResponseBody,
  ManagementApiCreateSnapshotResponseBody,
  ManagementApiGetConnectionUriResponseBody,
  ManagementApiGetProjectOperationResponseBody,
  ManagementApiListSnapshotsResponseBody,
  ManagementApiRestoreSnapshotResponseBody,
  NeonApiCreateBranchResult,
  NeonApiCreateProjectResult,
  NeonApiCreateSnapshotResult,
  NeonApiRestoreSnapshotAsNewBranchResult,
  NeonApiSettledOperationStatus,
  NeonApiWaitForOperationsResult,
  NeonManagementApiErrorBody,
} from "./neon-api-response-types.js";
