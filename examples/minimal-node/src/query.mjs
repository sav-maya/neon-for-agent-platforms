import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "Set DATABASE_URL to your Neon connection string (pooler host optional).",
  );
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  const result = await client.query("SELECT 1 AS ok");
  console.log(result.rows);
} finally {
  await client.end();
}
