import fs from "fs";
import path from "path";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function runMigrations() {
  try {
    // ✅ We are already inside the backend folder
    const __dirname = path.resolve();
    const filePath = path.join(__dirname, "sql", "createTables.sql");

    if (!fs.existsSync(filePath)) {
      throw new Error(`❌ SQL file not found at: ${filePath}`);
    }

    const sql = fs.readFileSync(filePath, "utf-8");
    console.log("🚀 Running database setup on Neon...");

    await pool.query(sql);
    console.log("✅ Tables created successfully on Neon Database!");
  } catch (error) {
    console.error("❌ Error creating tables:", error.message);
  } finally {
    await pool.end();
  }
}

runMigrations();
