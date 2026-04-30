import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL to your Neon connection string (pooler recommended for serverless).");
  process.exit(1);
}

const sql = neon(url);
const rows = await sql`SELECT 1 AS ok`;
console.log(rows);
