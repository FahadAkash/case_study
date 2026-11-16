"use server";

import { saveContactMessage } from "@/lib/db";

export async function submitContactInquiry(formData: FormData): Promise<{ success: boolean; error?: string }> {
  // 1. Check honeypot field
  const honeypot = formData.get("website_hp") as string;
  if (honeypot && honeypot.trim().length > 0) {
    // Silently succeed to trick spam bot without storing spam
    return { success: true };
  }

  // 2. Extract and validate fields
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const company = (formData.get("company") as string)?.trim() || "";
  const projectType = (formData.get("project_type") as string)?.trim() || "General";
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { success: false, error: "Name, email, and project scope message are required." };
  }

  // Basic email pattern check
  if (!email.includes("@") || !email.includes(".")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    // 3. Persist to Neon Postgres
    await saveContactMessage({
      name,
      email,
      company,
      project_type: projectType,
      message,
    });

    return { success: true };
  } catch (err: any) {
    console.error("Failed to save contact message:", err);
    return { success: false, error: "Database error occurred while processing message." };
  }
}
