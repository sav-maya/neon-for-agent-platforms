/**
 * Machine-readable success and error contracts for {@link NeonApi} helpers and the underlying
 * Neon Management API shapes they use. Field names match the Management API / `@neondatabase/api-client` OpenAPI types.
 *
 * @see https://neon.com/docs/reference/typescript-sdk
 */
import type {
  BranchResponse,
  ConnectionDetails,
  ConnectionURIResponse,
  ConnectionURIsOptionalResponse,
  ConnectionURIsResponse,
  ConsumptionHistoryPerProjectV2Response,
  DatabasesResponse,
  EndpointsOptionalResponse,
  EndpointsResponse,
  GeneralError,
  NeonAuthCreateIntegrationResponse,
  NeonAuthCreateNewUserResponse,
  Operation,
  OperationResponse,
  OperationsResponse,
  OperationStatus,
  Pagination,
  PaginationResponse,
  ProjectResponse,
  RolesResponse,
  Snapshot,
} from "@neondatabase/api-client";

// --- Re-exports: wire-level SDK types used by this package -----------------

export type {
  BranchResponse,
  ConnectionDetails,
  ConnectionURIResponse,
  ConnectionURIsResponse,
  ConsumptionHistoryPerProjectV2Response,
  GeneralError,
  NeonAuthCreateIntegrationResponse,
  NeonAuthCreateNewUserResponse,
  Operation,
  OperationResponse,
  OperationsResponse,
  OperationStatus,
  Pagination,
  PaginationResponse,
  ProjectResponse,
  Snapshot,
};

/** HTTP error JSON body returned by the Neon Management API (Axios `response.data` on failures). */
export type NeonManagementApiErrorBody = GeneralError;

/**
 * Cursor pagination appended to some list endpoints (e.g. consumption history v2).
 * @see PaginationResponse in the SDK
 */
export type NeonPagination = Pagination;

/** Successful GET `/projects/{project_id}/operations/{operation_id}` response body. */
export type ManagementApiGetProjectOperationResponseBody = OperationResponse;

/** Successful GET `/projects/{project_id}/connection_uri` response body. */
export type ManagementApiGetConnectionUriResponseBody = ConnectionURIResponse;

/** Successful GET `/projects/{project_id}/snapshots` response body. */
export interface ManagementApiListSnapshotsResponseBody {
  snapshots: Snapshot[];
}

/**
 * Successful `POST /projects` response body (composite returned by the SDK `createProject` call).
 * Includes project metadata, initial branch/endpoint roles/databases, connection strings, and outstanding operations.
 */
export type ManagementApiCreateProjectResponseBody = ProjectResponse &
  ConnectionURIsResponse &
  RolesResponse &
  DatabasesResponse &
  OperationsResponse &
  BranchResponse &
  EndpointsResponse;

/**
 * Successful `POST /projects/{project_id}/branches` response body.
 * Connection URIs may be omitted when the branch has multiple roles/databases.
 */
export type ManagementApiCreateBranchResponseBody = BranchResponse &
  EndpointsResponse &
  OperationsResponse &
  RolesResponse &
  DatabasesResponse &
  ConnectionURIsOptionalResponse;

/** Successful `POST .../snapshots` (create snapshot) response body from the SDK. */
export type ManagementApiCreateSnapshotResponseBody = {
  snapshot: Snapshot;
} & OperationsResponse;

/** Successful `POST .../snapshots/{snapshot_id}/restore` response body. */
export type ManagementApiRestoreSnapshotResponseBody = BranchResponse &
  EndpointsOptionalResponse &
  OperationsResponse;

/**
 * Successful `GET /consumption_history/v2/projects` response body including optional pagination.
 * Matches SDK: `ConsumptionHistoryPerProjectV2Response & PaginationResponse`.
 */
export type ManagementApiConsumptionHistoryPerProjectV2ResponseBody =
  ConsumptionHistoryPerProjectV2Response & PaginationResponse;

// --- NeonApi wrapper return types (narrowed / mapped for scripts) -----------

/**
 * Result of {@link import("./neon-client.js").NeonApi#createProject}.
 * Maps Management API fields: `project.id` → `projectId`, first `connection_uris[].connection_uri` → `databaseUrl`.
 */
export interface NeonApiCreateProjectResult {
  /** From `project.id` on create-project response. */
  projectId: string;
  /** From `connection_uris[0].connection_uri` after operations settle. */
  databaseUrl: string;
}

/** Result of {@link import("./neon-client.js").NeonApi#createBranch}. Maps `branch.id` → `id`. */
export interface NeonApiCreateBranchResult {
  id: string;
}

/**
 * Result of {@link import("./neon-client.js").NeonApi#createSnapshot}.
 * The snapshot identifier (`snapshot.id` in the API).
 */
export type NeonApiCreateSnapshotResult = string;

/** Result of {@link import("./neon-client.js").NeonApi#restoreSnapshotAsNewBranch}. Maps `branch.id` → `branchId`. */
export interface NeonApiRestoreSnapshotAsNewBranchResult {
  branchId: string;
}

/**
 * Terminal statuses accepted by {@link import("./neon-client.js").NeonApi#waitForOperationsToSettle}.
 * Values are {@link OperationStatus} enum strings returned by `GET .../operations/{operation_id}`.
 */
export type NeonApiSettledOperationStatus =
  | OperationStatus.Finished
  | OperationStatus.Skipped
  | OperationStatus.Cancelled;

/** Map of operation id → final {@link OperationStatus} after {@link import("./neon-client.js").NeonApi#waitForOperationsToSettle}. */
export type NeonApiWaitForOperationsResult = Record<
  string,
  NeonApiSettledOperationStatus
>;
