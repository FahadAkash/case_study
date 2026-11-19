import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import {
  FALLBACK_TOPICS,
  FALLBACK_CASE_STUDIES,
  FALLBACK_SETTINGS,
  FALLBACK_FAQS,
} from "../lib/fallback-data";

dotenv.config({ path: ".env.local" });
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(connectionString);

async function seed() {
  console.log("Seeding initial data...");

  // 1. Topics
  for (const t of FALLBACK_TOPICS) {
    await sql`
      INSERT INTO topics (id, slug, name, description, template)
      VALUES (${t.id}, ${t.slug}, ${t.name}, ${t.description}, ${JSON.stringify(t.template)}::jsonb)
      ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name, description = EXCLUDED.description, template = EXCLUDED.template;
    `;
  }
  console.log("✓ Seeded topics");

  // 2. Case Studies
  for (const cs of FALLBACK_CASE_STUDIES) {
    await sql`
      INSERT INTO case_studies (
        id, slug, title, outcome, summary, topic_id, tags, role, duration, year,
        stack, links, hero_media, blocks, featured, display_order, status,
        seo_title, seo_description, seo_image, confidential_notice, published_at, updated_at
      ) VALUES (
        ${cs.id},
        ${cs.slug},
        ${cs.title},
        ${cs.outcome},
        ${cs.summary},
        ${cs.topic_id},
        ${JSON.stringify(cs.tags)}::jsonb,
        ${cs.role},
        ${cs.duration},
        ${cs.year},
        ${JSON.stringify(cs.stack)}::jsonb,
        ${JSON.stringify(cs.links)}::jsonb,
        ${JSON.stringify(cs.hero_media)}::jsonb,
        ${JSON.stringify(cs.blocks)}::jsonb,
        ${cs.featured},
        ${cs.display_order},
        ${cs.status},
        ${cs.seo_title || null},
        ${cs.seo_description || null},
        ${cs.seo_image || null},
        ${cs.confidential_notice || null},
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        outcome = EXCLUDED.outcome,
        summary = EXCLUDED.summary,
        topic_id = EXCLUDED.topic_id,
        tags = EXCLUDED.tags,
        role = EXCLUDED.role,
        duration = EXCLUDED.duration,
        year = EXCLUDED.year,
        stack = EXCLUDED.stack,
        links = EXCLUDED.links,
        hero_media = EXCLUDED.hero_media,
        blocks = EXCLUDED.blocks,
        featured = EXCLUDED.featured,
        display_order = EXCLUDED.display_order,
        status = EXCLUDED.status,
        seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description,
        seo_image = EXCLUDED.seo_image,
        confidential_notice = EXCLUDED.confidential_notice,
        updated_at = NOW();
    `;
  }
  console.log("✓ Seeded case studies");

  // 3. Site Settings
  for (const [key, value] of Object.entries(FALLBACK_SETTINGS)) {
    await sql`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (${key}, ${JSON.stringify(value)}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
    `;
  }
  console.log("✓ Seeded site settings");

  // 4. FAQ
  for (const f of FALLBACK_FAQS) {
    await sql`
      INSERT INTO faq (id, question, answer, group_name, display_order)
      VALUES (${f.id}, ${f.question}, ${f.answer}, ${f.group_name}, ${f.display_order})
      ON CONFLICT (id) DO UPDATE SET
        question = EXCLUDED.question,
        answer = EXCLUDED.answer,
        group_name = EXCLUDED.group_name,
        display_order = EXCLUDED.display_order;
    `;
  }
  console.log("✓ Seeded FAQs");

  console.log("🎉 Database seeding completed successfully!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
