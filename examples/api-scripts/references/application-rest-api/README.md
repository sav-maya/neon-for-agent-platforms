# Application REST API — curl reference

These **`curl`** examples are for an **application’s own HTTP API** (your product server), **not** Neon’s Management API. They mirror routes from **[andrelandgraf/aileen](https://github.com/andrelandgraf/aileen)** — the full-stack reference called out in **[`../AILEEN_CHECKPOINT_PATTERN.md`](../AILEEN_CHECKPOINT_PATTERN.md)**.

Use **`APP_BASE_URL=http://localhost:3000`** (or your dev URL). Do **not** point these at Neon **`console.neon.tech`**; control-plane scripts stay in **[`../../README.md`](../../README.md)**.

## Auth

Aileen uses **Stack Auth** (`stackServerApp.getUser()`): authenticated routes expect a **browser session cookie**, not `NEON_API_KEY`. For `curl`, paste a `Cookie` header from DevTools after signing in (keep it out of git), or expect **`401 Unauthorized`** when omitting it—still useful to verify the route exists.

## Sources (exact paths in Aileen)

| Method | Path | Source file |
|--------|------|-------------|
| `GET` | `/api/v1/models` | [`src/app/api/v1/models/route.ts`](https://github.com/andrelandgraf/aileen/blob/main/src/app/api/v1/models/route.ts) |
| `POST` | `/api/v1/projects` | [`src/app/api/v1/projects/route.ts`](https://github.com/andrelandgraf/aileen/blob/main/src/app/api/v1/projects/route.ts) |
| `GET` | `/api/v1/projects/{projectId}/versions` | [`src/app/api/v1/projects/[projectId]/versions/route.ts`](https://github.com/andrelandgraf/aileen/blob/main/src/app/api/v1/projects/%5BprojectId%5D/versions/route.ts) |
| `POST` | `/api/v1/projects/{projectId}/checkpoint` | [`src/app/api/v1/projects/[projectId]/checkpoint/route.ts`](https://github.com/andrelandgraf/aileen/blob/main/src/app/api/v1/projects/%5BprojectId%5D/checkpoint/route.ts) |
| `POST` | `/api/v1/projects/{projectId}/versions` | Same `versions/route.ts` (`POST` restores a version) |

There is **no** dedicated `/health` route in that upstream tree; add one in your app if you need probes, or treat **`GET /api/v1/models`** as an authenticated liveness check against your stack.

## Run

```bash
cd references/application-rest-api
chmod +x curl-examples.sh   # once
./curl-examples.sh
```

Optional env (see [`.env.example`](.env.example)): `APP_BASE_URL`, `APP_PROJECT_ID`, `APP_VERSION_ID`, `STACK_SESSION_COOKIE`.
