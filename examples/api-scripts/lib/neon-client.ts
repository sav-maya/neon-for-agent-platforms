/**
 * Thin wrapper around the official Neon Management API TypeScript SDK.
 * @see https://neon.com/docs/reference/typescript-sdk
 */
import {
  ConsumptionHistoryGranularity,
  createApiClient,
  OperationStatus,
  type Api,
  type Branch,
  type DefaultEndpointSettings,
  type Operation,
} from "@neondatabase/api-client";

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
  timestamp?: string;
  branchId?: string;
}

export interface ApplySnapshotOptions {
  restoreBranchName?: string;
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

  async fetchOperationStatus(projectId: string, operationId: string): Promise<string> {
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
  ): Promise<Record<string, string>> {
    const pollIntervalMs = options.pollIntervalMs ?? 2000;
    const timeoutMs = options.timeoutMs ?? 5 * 60 * 1000;
    const results: Record<string, string> = {};
    for (const opId of operationIds) {
      const startedAt = Date.now();
      for (;;) {
        const status = await this.fetchOperationStatus(projectId, opId);
        if (isTerminalFailure(status)) {
          throw new Error(`Operation ${opId} ended with status ${status}`);
        }
        if (isTerminalSuccess(status)) {
          results[opId] = status;
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
  }: CreateProjectParams): Promise<{ projectId: string; databaseUrl: string }> {
    const { data } = await this.api.createProject({
      project: {
        name,
        ...(orgId ? { org_id: orgId } : {}),
        ...(endpointSettings ? { default_endpoint_settings: endpointSettings } : {}),
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

  async getProductionBranch(projectId: string): Promise<BranchWithId | undefined> {
    const branches = await this.listBranches(projectId);
    return (
      branches.find((b) => b.name === "main") ??
      branches.find((b) => b.name === "production")
    );
  }

  async createBranch(
    projectId: string,
    { name, parentId }: CreateBranchParams,
  ): Promise<{ id: string }> {
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
    return { id };
  }

  async createSnapshot(
    projectId: string,
    options: CreateSnapshotOptions = {},
  ): Promise<string> {
    let branchId = options.branchId;
    if (!branchId) {
      const prod = await this.getProductionBranch(projectId);
      if (!prod?.id) {
        throw new Error("No production branch (expected name main or production)");
      }
      branchId = prod.id;
    }
    const { data } = await this.api.createSnapshot({
      projectId,
      branchId,
      timestamp: options.timestamp ?? new Date().toISOString(),
      name: options.name,
    });
    const snapshotId = data.snapshot?.id;
    if (!snapshotId) {
      throw new Error("Create snapshot: missing snapshot id in response");
    }
    return snapshotId;
  }

  async applySnapshot(
    projectId: string,
    snapshotId: string,
    targetBranchId: string,
    options: ApplySnapshotOptions = {},
  ): Promise<void> {
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
  }

  async getConnectionUri({
    projectId,
    branchId,
    databaseName = "neondb",
    roleName = "neondb_owner",
    endpointId,
    pooled,
  }: GetConnectionUriParams): Promise<string> {
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

  async getConsumptionHistoryV2(p: ConsumptionHistoryParams): Promise<unknown> {
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

  async createBranchAuthUser(
    projectId: string,
    branchId: string,
    body: CreateBranchAuthUserBody,
  ): Promise<unknown> {
    const { data } = await this.api.createBranchNeonAuthNewUser(projectId, branchId, {
      email: body.email,
      ...(body.name ? { name: body.name } : {}),
    });
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
