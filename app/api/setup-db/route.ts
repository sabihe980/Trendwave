// =====================================================================
// TREND WAVE - SUPABASE AUTOMATED DATABASE SETUP & MIGRATIONS
// File: /app/api/setup-db/route.ts
// =====================================================================

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import postgres from "postgres";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { dbPassword, connectionString } = body;

    // 1. Resolve Connection String
    let finalConnectionString = connectionString || process.env.DATABASE_URL;

    if (!finalConnectionString) {
      if (!dbPassword) {
        return NextResponse.json(
          {
            success: false,
            error: "Database password or full connection string is required to run migrations."
          },
          { status: 400 }
        );
      }

      // Dynamically extract the project reference from the SUPABASE_URL
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      let projectRef = "blunxlndlkbzizrtigyk"; // Fallback matching user's active instance

      const match = supabaseUrl.match(/https:\/\/(.*?)\.supabase/);
      if (match && match[1]) {
        projectRef = match[1];
      }

      // Build standard Supabase transaction connection string
      // Note: direct port 5432 or pooler port 6543
      const encodedPassword = encodeURIComponent(dbPassword);
      finalConnectionString = `postgresql://postgres:${encodedPassword}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`;
    }

    console.log("Initializing postgres driver connection...");
    // 2. Establish connection to PostgreSQL
    const sql = postgres(finalConnectionString, {
      ssl: "require",
      connect_timeout: 15,
      idle_timeout: 10
    });

    const results: Array<{ file: string; success: boolean; error?: string }> = [];

    // 3. Define migrations to apply
    const migrations = [
      { name: "20260623000000_schema.sql", file: "20260623000000_schema.sql" },
      { name: "20260623000001_rls_policies.sql", file: "20260623000001_rls_policies.sql" },
      { name: "20260623000002_triggers_and_indexes.sql", file: "20260623000002_triggers_and_indexes.sql" },
      { name: "20260623000003_pg_cron_setup.sql", file: "20260623000003_pg_cron_setup.sql" }
    ];

    const migrationsDir = path.join(process.cwd(), "supabase", "migrations");

    // 4. Run migrations sequentially
    for (const m of migrations) {
      const fullPath = path.join(migrationsDir, m.file);
      if (!fs.existsSync(fullPath)) {
        results.push({
          file: m.name,
          success: false,
          error: `Migration file not found on path: ${fullPath}`
        });
        continue;
      }

      const sqlContent = fs.readFileSync(fullPath, "utf8");
      console.log(`Applying migration: ${m.name}...`);

      try {
        // Run the SQL script raw/unsafe on Postgres
        await sql.unsafe(sqlContent);
        results.push({ file: m.name, success: true });
        console.log(`Successfully applied: ${m.name}`);
      } catch (err: any) {
        console.error(`Error applying migration ${m.name}:`, err.message);
        results.push({ file: m.name, success: false, error: err.message });
      }
    }

    // Close the postgres connection pool safely
    await sql.end().catch(() => {});

    const allSuccessful = results.every((r) => r.success);

    return NextResponse.json({
      success: allSuccessful,
      message: allSuccessful
        ? "All database migrations applied successfully! Your Supabase schema is fully built."
        : "Some migrations failed to apply. Please review the errors below.",
      connectionStringUsed: finalConnectionString.replace(/:([^:@]+)@/, ":****@"), // Hide password for security
      results
    });
  } catch (error: any) {
    console.error("Database Setup Router Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to establish Postgres database connection. Verify your credentials.",
        details: error.message
      },
      { status: 500 }
    );
  }
}
