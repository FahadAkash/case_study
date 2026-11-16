import { neon } from "@neondatabase/serverless";

function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in environment variables");
  }
  return neon(connectionString);
}

export type BlockType =
  | "rich_text"
  | "image"
  | "gallery"
  | "video"
  | "code"
  | "quote"
  | "stats"
  | "architecture"
  | "divider";

export interface CaseStudyBlock {
  id?: string;
  type: BlockType;
  title?: string;
  content?: string;
  caption?: string;
  url?: string;
  drive_id?: string;
  images?: Array<{ url: string; drive_id?: string; caption?: string; alt?: string }>;
  language?: string;
  code?: string;
  quote?: string;
  author?: string;
  stats?: Array<{ label: string; value: string; detail?: string }>;
  diagram?: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  outcome: string;
  summary: string;
  topic_id: string | null;
  topic_name?: string;
  topic_slug?: string;
  tags: string[];
  role: string;
  duration: string;
  year: string;
  stack: string[];
  links: {
    demo?: string;
    github?: string;
    video?: string;
  };
  hero_media: {
    type: "image" | "video";
    drive_id?: string;
    drive_url?: string;
    fallback_url?: string;
    alt?: string;
  };
  blocks: CaseStudyBlock[];
  featured: boolean;
  display_order: number;
  status: "draft" | "published";
  seo_title?: string;
  seo_description?: string;
  seo_image?: string;
  confidential_notice?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

export interface Topic {
  id: string;
  slug: string;
  name: string;
  description: string;
  template: CaseStudyBlock[];
  created_at?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  group_name: string;
  display_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  project_type?: string;
  message: string;
  status: "unread" | "read" | "archived";
  created_at?: string;
}

// -------------------------------------------------------------
// Database Accessors
// -------------------------------------------------------------

export async function getCaseStudies(options?: {
  status?: "published" | "draft" | "all";
  topicSlug?: string;
  featuredOnly?: boolean;
}): Promise<CaseStudy[]> {
  const sql = getSql();
  const statusFilter = options?.status || "published";

  let query;
  if (statusFilter === "all") {
    query = await sql`
      SELECT cs.*, t.name as topic_name, t.slug as topic_slug
      FROM case_studies cs
      LEFT JOIN topics t ON cs.topic_id = t.id
      ORDER BY cs.display_order ASC, cs.created_at DESC;
    `;
  } else if (options?.featuredOnly) {
    query = await sql`
      SELECT cs.*, t.name as topic_name, t.slug as topic_slug
      FROM case_studies cs
      LEFT JOIN topics t ON cs.topic_id = t.id
      WHERE cs.status = 'published' AND cs.featured = TRUE
      ORDER BY cs.display_order ASC, cs.created_at DESC;
    `;
  } else {
    query = await sql`
      SELECT cs.*, t.name as topic_name, t.slug as topic_slug
      FROM case_studies cs
      LEFT JOIN topics t ON cs.topic_id = t.id
      WHERE cs.status = ${statusFilter}
      ORDER BY cs.display_order ASC, cs.created_at DESC;
    `;
  }

  let list = (query as any[]).map(formatCaseStudyRow);
  if (options?.topicSlug && options.topicSlug !== "all") {
    list = list.filter((cs) => cs.topic_slug === options.topicSlug || cs.topic_id === options.topicSlug);
  }
  return list;
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT cs.*, t.name as topic_name, t.slug as topic_slug
    FROM case_studies cs
    LEFT JOIN topics t ON cs.topic_id = t.id
    WHERE cs.slug = ${slug}
    LIMIT 1;
  `;
  if (!rows || rows.length === 0) return null;
  return formatCaseStudyRow(rows[0]);
}

export async function getCaseStudyById(id: string): Promise<CaseStudy | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT cs.*, t.name as topic_name, t.slug as topic_slug
    FROM case_studies cs
    LEFT JOIN topics t ON cs.topic_id = t.id
    WHERE cs.id = ${id}
    LIMIT 1;
  `;
  if (!rows || rows.length === 0) return null;
  return formatCaseStudyRow(rows[0]);
}

export async function getAllTopics(): Promise<Topic[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM topics ORDER BY name ASC;
  `;
  return (rows as any[]).map((r) => {
    let t = r.template;
    if (typeof t === "string") {
      try {
        t = JSON.parse(t);
      } catch {
        t = [];
      }
    }
    return {
      id: r.id,
      slug: r.slug,
      name: r.name,
      description: r.description || "",
      template: Array.isArray(t) ? t : [],
      created_at: r.created_at
    };
  });
}

export async function getSiteSettings(): Promise<Record<string, any>> {
  const sql = getSql();
  const rows = await sql`SELECT key, value FROM site_settings;`;
  const result: Record<string, any> = {};
  for (const row of rows as any[]) {
    if (typeof row.value === "string") {
      try {
        result[row.key] = JSON.parse(row.value);
      } catch {
        result[row.key] = row.value;
      }
    } else {
      result[row.key] = row.value;
    }
  }
  return result;
}

export async function getFaqs(): Promise<FaqItem[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM faq ORDER BY display_order ASC, created_at ASC;`;
  return (rows as any[]).map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
    group_name: r.group_name || "General",
    display_order: r.display_order || 0
  }));
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM messages ORDER BY created_at DESC;`;
  return rows as ContactMessage[];
}

export async function saveContactMessage(msg: {
  name: string;
  email: string;
  company?: string;
  project_type?: string;
  message: string;
}): Promise<{ success: boolean; id: string }> {
  const sql = getSql();
  const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  await sql`
    INSERT INTO messages (id, name, email, company, project_type, message, status)
    VALUES (${id}, ${msg.name}, ${msg.email}, ${msg.company || null}, ${msg.project_type || null}, ${msg.message}, 'unread');
  `;
  return { success: true, id };
}

// -------------------------------------------------------------
// Admin Mutations
// -------------------------------------------------------------

export async function upsertCaseStudy(data: Partial<CaseStudy> & { id: string; title: string; slug: string }): Promise<void> {
  const sql = getSql();
  const isPublishing = data.status === "published";

  await sql`
    INSERT INTO case_studies (
      id, slug, title, outcome, summary, topic_id, tags, role, duration, year,
      stack, links, hero_media, blocks, featured, display_order, status,
      seo_title, seo_description, seo_image, confidential_notice, published_at, updated_at
    ) VALUES (
      ${data.id},
      ${data.slug},
      ${data.title},
      ${data.outcome || ""},
      ${data.summary || ""},
      ${data.topic_id || null},
      ${JSON.stringify(data.tags || [])}::jsonb,
      ${data.role || "Lead Engineer"},
      ${data.duration || "N/A"},
      ${data.year || new Date().getFullYear().toString()},
      ${JSON.stringify(data.stack || [])}::jsonb,
      ${JSON.stringify(data.links || {})}::jsonb,
      ${JSON.stringify(data.hero_media || { type: "image" })}::jsonb,
      ${JSON.stringify(data.blocks || [])}::jsonb,
      ${Boolean(data.featured)},
      ${Number(data.display_order) || 0},
      ${data.status || "draft"},
      ${data.seo_title || null},
      ${data.seo_description || null},
      ${data.seo_image || null},
      ${data.confidential_notice || null},
      ${isPublishing ? sql`NOW()` : null},
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
      published_at = CASE WHEN EXCLUDED.status = 'published' AND case_studies.published_at IS NULL THEN NOW() ELSE case_studies.published_at END,
      updated_at = NOW();
  `;
}

export async function deleteCaseStudy(id: string): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM case_studies WHERE id = ${id};`;
}

export async function duplicateCaseStudy(id: string): Promise<string> {
  const existing = await getCaseStudyById(id);
  if (!existing) throw new Error("Case study not found");

  const newId = `cs-${Date.now()}`;
  const newSlug = `${existing.slug}-copy-${Math.random().toString(36).substring(2, 6)}`;
  const newTitle = `${existing.title} (Copy)`;

  await upsertCaseStudy({
    ...existing,
    id: newId,
    slug: newSlug,
    title: newTitle,
    status: "draft",
    featured: false
  });

  return newId;
}

export async function updateSiteSetting(key: string, value: any): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (${key}, ${JSON.stringify(value)}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
  `;
}

export async function upsertTopic(topic: Topic): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO topics (id, slug, name, description, template)
    VALUES (${topic.id}, ${topic.slug}, ${topic.name}, ${topic.description}, ${JSON.stringify(topic.template)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      slug = EXCLUDED.slug,
      description = EXCLUDED.description,
      template = EXCLUDED.template;
  `;
}

export async function deleteTopic(id: string): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM topics WHERE id = ${id};`;
}

export async function upsertFaq(item: FaqItem): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO faq (id, question, answer, group_name, display_order)
    VALUES (${item.id}, ${item.question}, ${item.answer}, ${item.group_name}, ${item.display_order})
    ON CONFLICT (id) DO UPDATE SET
      question = EXCLUDED.question,
      answer = EXCLUDED.answer,
      group_name = EXCLUDED.group_name,
      display_order = EXCLUDED.display_order;
  `;
}

export async function deleteFaq(id: string): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM faq WHERE id = ${id};`;
}

export async function markMessageStatus(id: string, status: "unread" | "read" | "archived"): Promise<void> {
  const sql = getSql();
  await sql`UPDATE messages SET status = ${status} WHERE id = ${id};`;
}

export async function getFullBackup(): Promise<Record<string, any>> {
  const [caseStudies, topics, settings, faqs, messages] = await Promise.all([
    getCaseStudies({ status: "all" }),
    getAllTopics(),
    getSiteSettings(),
    getFaqs(),
    getContactMessages()
  ]);

  return {
    exportDate: new Date().toISOString(),
    caseStudies,
    topics,
    settings,
    faqs,
    messages
  };
}

// -------------------------------------------------------------
// Formatters
// -------------------------------------------------------------

function formatCaseStudyRow(row: any): CaseStudy & { topic_slug?: string } {
  const parseJson = (val: any, fallback: any) => {
    if (!val) return fallback;
    if (typeof val === "object") return val;
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  };

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    outcome: row.outcome || "",
    summary: row.summary || "",
    topic_id: row.topic_id,
    topic_name: row.topic_name || "General",
    topic_slug: row.topic_slug,
    tags: parseJson(row.tags, []),
    role: row.role || "",
    duration: row.duration || "",
    year: row.year || "",
    stack: parseJson(row.stack, []),
    links: parseJson(row.links, {}),
    hero_media: parseJson(row.hero_media, { type: "image" }),
    blocks: parseJson(row.blocks, []),
    featured: Boolean(row.featured),
    display_order: Number(row.display_order) || 0,
    status: row.status || "draft",
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    seo_image: row.seo_image,
    confidential_notice: row.confidential_notice,
    created_at: row.created_at,
    updated_at: row.updated_at,
    published_at: row.published_at
  };
}
