"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  createSessionToken,
  validateAdminPassword,
  AUTH_COOKIE_OPTIONS,
  isAuthenticatedAdmin
} from "@/lib/auth";
import {
  upsertCaseStudy,
  deleteCaseStudy,
  duplicateCaseStudy,
  updateSiteSetting,
  upsertTopic,
  deleteTopic,
  upsertFaq,
  deleteFaq,
  markMessageStatus,
  CaseStudy,
  Topic,
  FaqItem
} from "@/lib/db";

// -------------------------------------------------------------
// Authentication Actions
// -------------------------------------------------------------

export async function loginAdminAction(password: string): Promise<{ success: boolean; error?: string }> {
  if (!validateAdminPassword(password)) {
    return { success: false, error: "Invalid admin password." };
  }

  const token = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_OPTIONS.name, token, AUTH_COOKIE_OPTIONS);

  return { success: true };
}

export async function logoutAdminAction(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_OPTIONS.name);
  return { success: true };
}

// Guard helper
async function ensureAdmin() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    throw new Error("Unauthorized admin access.");
  }
}

// -------------------------------------------------------------
// Case Study Actions
// -------------------------------------------------------------

export async function saveCaseStudyAction(data: Partial<CaseStudy> & { id: string; title: string; slug: string }): Promise<{ success: boolean; error?: string }> {
  await ensureAdmin();

  if (!data.id || !data.title || !data.slug) {
    return { success: false, error: "ID, Title, and Slug are required." };
  }

  try {
    await upsertCaseStudy(data);

    // On-demand revalidation: immediately updates public pages without redeploy
    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath(`/work/${data.slug}`);
    revalidatePath("/admin");

    return { success: true };
  } catch (err: any) {
    console.error("Failed to upsert case study:", err);
    return { success: false, error: err.message || "Failed to save case study." };
  }
}

export async function deleteCaseStudyAction(id: string): Promise<{ success: boolean; error?: string }> {
  await ensureAdmin();

  try {
    await deleteCaseStudy(id);
    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function duplicateCaseStudyAction(id: string): Promise<{ success: boolean; newId?: string; error?: string }> {
  await ensureAdmin();

  try {
    const newId = await duplicateCaseStudy(id);
    revalidatePath("/admin");
    return { success: true, newId };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// -------------------------------------------------------------
// Site Settings Actions
// -------------------------------------------------------------

export async function saveSiteSettingsAction(settings: Record<string, any>): Promise<{ success: boolean; error?: string }> {
  await ensureAdmin();

  try {
    for (const [key, value] of Object.entries(settings)) {
      await updateSiteSetting(key, value);
    }

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// -------------------------------------------------------------
// Topic & Template Actions
// -------------------------------------------------------------

export async function saveTopicAction(topic: Topic): Promise<{ success: boolean; error?: string }> {
  await ensureAdmin();

  try {
    await upsertTopic(topic);
    revalidatePath("/work");
    revalidatePath("/admin/topics");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteTopicAction(id: string): Promise<{ success: boolean; error?: string }> {
  await ensureAdmin();

  try {
    await deleteTopic(id);
    revalidatePath("/work");
    revalidatePath("/admin/topics");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// -------------------------------------------------------------
// FAQ Actions
// -------------------------------------------------------------

export async function saveFaqAction(faq: FaqItem): Promise<{ success: boolean; error?: string }> {
  await ensureAdmin();

  try {
    await upsertFaq(faq);
    revalidatePath("/faq");
    revalidatePath("/admin/faq");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteFaqAction(id: string): Promise<{ success: boolean; error?: string }> {
  await ensureAdmin();

  try {
    await deleteFaq(id);
    revalidatePath("/faq");
    revalidatePath("/admin/faq");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// -------------------------------------------------------------
// Contact Messages Actions
// -------------------------------------------------------------

export async function updateMessageStatusAction(id: string, status: "unread" | "read" | "archived"): Promise<{ success: boolean; error?: string }> {
  await ensureAdmin();

  try {
    await markMessageStatus(id, status);
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
