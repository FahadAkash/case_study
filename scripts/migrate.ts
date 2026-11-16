import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set in environment or .env.local");
  process.exit(1);
}

const sql = neon(connectionString);

async function runMigration() {
  console.log("Connecting to Neon Postgres and running migrations...");

  // 1. Topics table
  await sql`
    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      template JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log("✓ 'topics' table ready");

  // 2. Case Studies table
  await sql`
    CREATE TABLE IF NOT EXISTS case_studies (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      outcome TEXT NOT NULL,
      summary TEXT NOT NULL,
      topic_id TEXT REFERENCES topics(id) ON DELETE SET NULL,
      tags JSONB DEFAULT '[]'::jsonb,
      role TEXT NOT NULL,
      duration TEXT NOT NULL,
      year TEXT NOT NULL,
      stack JSONB DEFAULT '[]'::jsonb,
      links JSONB DEFAULT '{}'::jsonb,
      hero_media JSONB NOT NULL,
      blocks JSONB DEFAULT '[]'::jsonb,
      featured BOOLEAN DEFAULT FALSE,
      display_order INTEGER DEFAULT 0,
      status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      seo_title TEXT,
      seo_description TEXT,
      seo_image TEXT,
      confidential_notice TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      published_at TIMESTAMPTZ
    );
  `;
  console.log("✓ 'case_studies' table ready");

  // 3. Site Settings table
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log("✓ 'site_settings' table ready");

  // 4. FAQ table
  await sql`
    CREATE TABLE IF NOT EXISTS faq (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      group_name TEXT DEFAULT 'General',
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log("✓ 'faq' table ready");

  // 5. Messages table
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      project_type TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log("✓ 'messages' table ready");

  // Indexes for performance
  await sql`CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_case_studies_status ON case_studies(status);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_case_studies_featured ON case_studies(featured);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_case_studies_order ON case_studies(display_order);`;

  console.log("All migrations executed successfully!");
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
