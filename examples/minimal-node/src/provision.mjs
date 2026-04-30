const API = "https://console.neon.tech/api/v2";
const key = process.env.NEON_API_KEY;
const orgId = process.env.NEON_ORG_ID;
if (!key) {
  console.error("Set NEON_API_KEY to your Neon API key.");
  process.exit(1);
}

const res = await fetch(`${API}/projects`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    project: {
      name: `tenant-${Date.now()}`,
      org_id: orgId || undefined,
      default_endpoint_settings: {
        autoscaling_limit_min_cu: 0.25,
        autoscaling_limit_max_cu: 2,
        suspend_timeout_seconds: 300,
      },
    },
  }),
});

const data = await res.json();
if (!res.ok) {
  console.error("Error:", data.message || JSON.stringify(data));
  process.exit(1);
}

console.log("Project ID:", data.project.id);
console.log("DATABASE_URL:", data.connection_uris[0].connection_uri);
