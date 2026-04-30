const API = "https://console.neon.tech/api/v2";
const key = process.env.NEON_API_KEY;
if (!key) {
  console.error("Set NEON_API_KEY to your Neon organization API key.");
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
      default_endpoint_settings: {
        autoscaling_limit_min_cu: 0.25,
        autoscaling_limit_max_cu: 2,
        suspend_timeout_seconds: 300,
      },
    },
  }),
});

const { project, connection_uris } = await res.json();
console.log("Project ID:", project.id);
console.log("DATABASE_URL:", connection_uris[0].connection_uri);
