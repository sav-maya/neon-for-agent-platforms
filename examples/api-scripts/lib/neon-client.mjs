/**
 * Minimal Neon Console API (v2) client.
 * Request/response handling adapted from https://github.com/andrelandgraf/aileen (src/lib/neon.ts).
 * Uses HTTPS JSON only — no extra SDKs.
 */
const DEFAULT_API = "https://console.neon.tech/api/v2";

function isTerminalOperationStatus(status) {
  return (
    status === "finished" ||
    status === "skipped" ||
    status === "cancelled"
  );
}

function isRecord(value) {
  return typeof value === "object" && value !== null;
}

function isBranchContainer(value) {
  if (!isRecord(value)) return false;
  const record = value;
  const branch = record["branch"];
  const branchOk =
    branch === undefined ||
    (isRecord(branch) &&
      ["id", "name", "created_at", "parent_id"].every(
        (k) => branch[k] === undefined || typeof branch[k] === "string",
      ));
  return (
    ["id", "name", "created_at", "parent_id"].every(
      (k) => record[k] === undefined || typeof record[k] === "string",
    ) && branchOk
  );
}

function extractBranchContainers(input) {
  if (Array.isArray(input)) {
    return input.filter(isBranchContainer);
  }
  if (!isRecord(input)) return [];
  for (const key of ["branches", "items", "data"]) {
    const maybe = input[key];
    if (Array.isArray(maybe)) {
      return maybe.filter(isBranchContainer);
    }
  }
  return [];
}

function normalizeBranch(container) {
  return {
    id: container.id ?? container.branch?.id,
    name: container.name ?? container.branch?.name,
    created_at: container.created_at ?? container.branch?.created_at,
    parent_id: container.parent_id ?? container.branch?.parent_id,
  };
}

function isBranch(value) {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    ["name", "created_at", "parent_id"].every(
      (k) => value[k] === undefined || typeof value[k] === "string",
    )
  );
}

export class NeonApi {
  /**
   * @param {string} apiKey
   * @param {{ baseUrl?: string }} [opts]
   */
  constructor(apiKey, opts = {}) {
    if (!apiKey) {
      throw new Error("NEON_API_KEY is required");
    }
    this.apiKey = apiKey;
    this.baseUrl = opts.baseUrl ?? DEFAULT_API;
  }

  _headers(json = true) {
    return {
      Accept: "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      ...(json ? { "Content-Type": "application/json" } : {}),
    };
  }

  async _readError(res) {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  /**
   * @param {string} projectId
   * @param {string} operationId
   */
  async fetchOperationStatus(projectId, operationId) {
    const url = `${this.baseUrl}/projects/${projectId}/operations/${operationId}`;
    const res = await fetch(url, {
      method: "GET",
      headers: this._headers(false),
      cache: "no-store",
    });
    if (!res.ok) {
      const err = await this._readError(res);
      throw new Error(
        `Failed to get operation ${operationId}: ${res.status} ${typeof err === "string" ? err : JSON.stringify(err)}`,
      );
    }
    const json = await res.json();
    const status = json?.operation?.status;
    if (!status) {
      throw new Error(`Operation status missing for ${operationId}`);
    }
    return status;
  }

  /**
   * @param {string} projectId
   * @param {string[]} operationIds
   * @param {{ pollIntervalMs?: number, timeoutMs?: number }} [options]
   */
  async waitForOperationsToSettle(projectId, operationIds, options = {}) {
    const pollIntervalMs = options.pollIntervalMs ?? 2000;
    const timeoutMs = options.timeoutMs ?? 5 * 60 * 1000;
    const results = {};
    for (const opId of operationIds) {
      const startedAt = Date.now();
      for (;;) {
        const status = await this.fetchOperationStatus(projectId, opId);
        if (isTerminalOperationStatus(status)) {
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

  /**
   * @param {{ name: string, orgId?: string, endpointSettings?: object }} body
   * @returns {Promise<{ projectId: string, databaseUrl: string }>}
   */
  async createProject({ name, orgId, endpointSettings } = {}) {
    const project = { name };
    if (orgId) {
      project.org_id = orgId;
    }
    if (endpointSettings) {
      project.default_endpoint_settings = endpointSettings;
    }
    const res = await fetch(`${this.baseUrl}/projects`, {
      method: "POST",
      headers: this._headers(),
      body: JSON.stringify({ project }),
      cache: "no-store",
    });
    if (!res.ok) {
      const err = await this._readError(res);
      throw new Error(
        `Create project failed: ${res.status} ${typeof err === "string" ? err : JSON.stringify(err)}`,
      );
    }
    const json = await res.json();
    const projectId = json.project?.id ?? json.id;
    if (!projectId) {
      throw new Error("Create project: missing project id in response");
    }
    const databaseUrl = json.connection_uris?.[0]?.connection_uri;
    if (!databaseUrl) {
      throw new Error("Create project: missing connection URI in response");
    }
    const opIds = (json.operations ?? [])
      .map((o) => o.id)
      .filter((id) => typeof id === "string" && id.length > 0);
    if (opIds.length > 0) {
      await this.waitForOperationsToSettle(projectId, opIds);
    }
    return { projectId, databaseUrl };
  }

  /**
   * @param {string} projectId
   */
  async deleteProject(projectId) {
    const res = await fetch(`${this.baseUrl}/projects/${projectId}`, {
      method: "DELETE",
      headers: this._headers(false),
      cache: "no-store",
    });
    if (!res.ok) {
      const err = await this._readError(res);
      throw new Error(
        `Delete project failed: ${res.status} ${typeof err === "string" ? err : JSON.stringify(err)}`,
      );
    }
  }

  /**
   * @param {string} projectId
   * @returns {Promise<Array<{ id: string, name?: string, parent_id?: string }>>}
   */
  async listBranches(projectId) {
    const res = await fetch(
      `${this.baseUrl}/projects/${projectId}/branches`,
      {
        method: "GET",
        headers: this._headers(false),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      const err = await this._readError(res);
      throw new Error(
        `List branches failed: ${res.status} ${typeof err === "string" ? err : JSON.stringify(err)}`,
      );
    }
    const json = await res.json();
    const items = extractBranchContainers(json);
    return items.map(normalizeBranch).filter(isBranch);
  }

  /**
   * @param {string} projectId
   */
  async getProductionBranch(projectId) {
    const branches = await this.listBranches(projectId);
    return (
      branches.find((b) => b.name === "main") ??
      branches.find((b) => b.name === "production")
    );
  }

  /**
   * @param {string} projectId
   * @param {{ name: string, parentId?: string }} opts
   */
  async createBranch(projectId, { name, parentId }) {
    const branch = { name };
    if (parentId) {
      branch.parent_id = parentId;
    }
    const res = await fetch(
      `${this.baseUrl}/projects/${projectId}/branches`,
      {
        method: "POST",
        headers: this._headers(),
        body: JSON.stringify({ branch }),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      const err = await this._readError(res);
      throw new Error(
        `Create branch failed: ${res.status} ${typeof err === "string" ? err : JSON.stringify(err)}`,
      );
    }
    const json = await res.json();
    const id = json.branch?.id ?? json.id;
    if (!id) {
      throw new Error("Create branch: missing id in response");
    }
    return { id, raw: json };
  }

  /**
   * Point-in-time snapshot on the production branch (main, or production).
   * @param {string} projectId
   * @param {{ name?: string, timestamp?: string }} [options]
   */
  async createSnapshot(projectId, options = {}) {
    const prod = await this.getProductionBranch(projectId);
    if (!prod?.id) {
      throw new Error("No production branch (expected name main or production)");
    }
    const res = await fetch(
      `${this.baseUrl}/projects/${projectId}/branches/${prod.id}/snapshot`,
      {
        method: "POST",
        headers: this._headers(),
        body: JSON.stringify({
          timestamp: options.timestamp ?? new Date().toISOString(),
          name: options.name,
        }),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      const err = await this._readError(res);
      throw new Error(
        `Create snapshot failed: ${res.status} ${typeof err === "string" ? err : JSON.stringify(err)}`,
      );
    }
    const json = await res.json();
    const snapshotId = json?.snapshot?.id ?? json?.id;
    if (!snapshotId) {
      throw new Error("Create snapshot: missing snapshot id in response");
    }
    return snapshotId;
  }

  /**
   * Move projects between orgs (e.g. sponsored → paid). Requires a personal API key with access to both orgs.
   * @see https://neon.com/docs/manage/orgs-project-transfer
   * @param {{ sourceOrgId: string, destinationOrgId: string, projectIds: string[] }} p
   */
  async transferProjects({ sourceOrgId, destinationOrgId, projectIds }) {
    const res = await fetch(
      `${this.baseUrl}/organizations/${sourceOrgId}/projects/transfer`,
      {
        method: "POST",
        headers: this._headers(),
        body: JSON.stringify({
          project_ids: projectIds,
          destination_org_id: destinationOrgId,
        }),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      const err = await this._readError(res);
      throw new Error(
        `Transfer failed: ${res.status} ${typeof err === "string" ? err : JSON.stringify(err)}`,
      );
    }
  }

  /**
   * Usage-based consumption metrics (plans: Launch, Scale, Agent, Enterprise).
   * @see https://neon.com/docs/guides/consumption-metrics
   * @param {{
   *   orgId: string,
   *   from: string,
   *   to: string,
   *   granularity: 'hourly' | 'daily' | 'monthly',
   *   metrics: string[],
   *   projectIds?: string[],
   *   limit?: number,
   *   cursor?: string,
   * }} p
   */
  async getConsumptionHistoryV2(p) {
    const sp = new URLSearchParams();
    sp.set("from", p.from);
    sp.set("to", p.to);
    sp.set("granularity", p.granularity);
    sp.set("org_id", p.orgId);
    sp.set("metrics", p.metrics.join(","));
    if (p.projectIds?.length) {
      sp.set("project_ids", p.projectIds.join(","));
    }
    if (p.limit != null) {
      sp.set("limit", String(p.limit));
    }
    if (p.cursor) {
      sp.set("cursor", p.cursor);
    }
    const url = `${this.baseUrl}/consumption_history/v2/projects?${sp.toString()}`;
    const res = await fetch(url, {
      method: "GET",
      headers: this._headers(false),
      cache: "no-store",
    });
    if (!res.ok) {
      const err = await this._readError(res);
      throw new Error(
        `Consumption history failed: ${res.status} ${typeof err === "string" ? err : JSON.stringify(err)}`,
      );
    }
    return res.json();
  }

  /**
   * Create an application user via Neon Auth (Better Auth). Rows sync into Postgres `neon_auth` (e.g. `users_sync`).
   * Enable Auth on the branch first: POST .../branches/{id}/auth
   * @see https://api-docs.neon.tech/reference/createbranchneonauthnewuser
   */
  async createBranchAuthUser(projectId, branchId, { email, name }) {
    const body = { email };
    if (name) {
      body.name = name;
    }
    const res = await fetch(
      `${this.baseUrl}/projects/${projectId}/branches/${branchId}/auth/users`,
      {
        method: "POST",
        headers: this._headers(),
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      const err = await this._readError(res);
      throw new Error(
        `Create auth user failed: ${res.status} ${typeof err === "string" ? err : JSON.stringify(err)}`,
      );
    }
    return res.json();
  }

  /**
   * @see https://api-docs.neon.tech/reference/deletebranchneonauthuser
   */
  async deleteBranchAuthUser(projectId, branchId, authUserId) {
    const res = await fetch(
      `${this.baseUrl}/projects/${projectId}/branches/${branchId}/auth/users/${authUserId}`,
      {
        method: "DELETE",
        headers: this._headers(false),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      const err = await this._readError(res);
      throw new Error(
        `Delete auth user failed: ${res.status} ${typeof err === "string" ? err : JSON.stringify(err)}`,
      );
    }
  }
}
