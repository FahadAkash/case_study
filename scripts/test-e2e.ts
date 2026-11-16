import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { parseDriveUrl } from "../lib/drive";
import { getCaseStudies, getCaseStudyBySlug, getAllTopics, getSiteSettings, getFaqs, saveContactMessage, getContactMessages } from "../lib/db";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function runTests() {
  console.log("=========================================");
  console.log("RUNNING END-TO-END VERIFICATION TESTS");
  console.log("=========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // TEST 1: Database connection and Neon queries
  console.log("1. Testing Neon Postgres Connection & Data Queries...");
  try {
    const studies = await getCaseStudies({ status: "published" });
    assert(studies.length >= 4, `Queried ${studies.length} published case studies`);

    const aetherfall = await getCaseStudyBySlug("aetherfall-aerial-combat");
    assert(aetherfall !== null && aetherfall.title.includes("Aetherfall"), "Retrieved case study by slug with facts table & blocks");
    assert(aetherfall?.blocks.length! >= 5, `Case study contains ${aetherfall?.blocks.length} structured blocks`);

    const topics = await getAllTopics();
    assert(topics.length >= 5, `Retrieved ${topics.length} topics with pre-filled templates`);

    const settings = await getSiteSettings();
    assert(typeof settings.hero_headline === "string", "Retrieved site settings from database");

    const faqs = await getFaqs();
    assert(faqs.length >= 4, `Retrieved ${faqs.length} FAQ questions`);
  } catch (err: any) {
    assert(false, `Database queries failed: ${err.message}`);
  }

  // TEST 2: Google Drive Media Engine
  console.log("\n2. Testing Google Drive Link Resolver...");
  const sampleDriveUrl = "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing";
  const parsed = parseDriveUrl(sampleDriveUrl, "image");
  assert(parsed.fileId === "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs", `Extracted File ID: ${parsed.fileId}`);
  assert(parsed.directImageUrl === "https://lh3.googleusercontent.com/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs", `Generated direct CDN image URL: ${parsed.directImageUrl}`);
  assert(parsed.embedVideoUrl === "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview", "Generated embed video URL");
  assert(Boolean(parsed.warning), "Surfaces sharing permission guidance to user");

  // TEST 3: Contact Form Database Logging
  console.log("\n3. Testing Contact Message DB Persistence...");
  try {
    const testEmail = `test-${Date.now()}@test-studio.com`;
    const res = await saveContactMessage({
      name: "Automated Verifier",
      email: testEmail,
      company: "Northfold Quality Lab",
      project_type: "Game Engine / Real-time",
      message: "Testing end-to-end database insertion from contact form.",
    });
    assert(res.success && Boolean(res.id), `Message inserted with ID ${res.id}`);

    const allMessages = await getContactMessages();
    const found = allMessages.find((m) => m.email === testEmail);
    assert(Boolean(found), "Retrieved newly submitted contact message from Neon DB");
  } catch (err: any) {
    assert(false, `Contact persistence failed: ${err.message}`);
  }

  console.log("\n=========================================");
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
