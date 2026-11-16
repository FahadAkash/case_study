import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "northfold_admin_session";
const SECRET_SALT = process.env.ADMIN_SESSION_SECRET || "northfold-default-salt-key-99120485";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin-secure-pass-2026";

export function createSessionToken(): string {
  const payload = `admin:${Date.now()}`;
  const hmac = crypto.createHmac("sha256", SECRET_SALT).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64")}.${hmac}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !token.includes(".")) return false;
  try {
    const [encodedPayload, hmac] = token.split(".");
    const payload = Buffer.from(encodedPayload, "base64").toString("utf-8");
    const [user, timestamp] = payload.split(":");

    if (user !== "admin") return false;

    // Optional 7-day expiration check
    const tokenTime = parseInt(timestamp, 10);
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (isNaN(tokenTime) || now - tokenTime > sevenDays) return false;

    const expectedHmac = crypto.createHmac("sha256", SECRET_SALT).update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
  } catch {
    return false;
  }
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function validateAdminPassword(password: string): boolean {
  if (!password) return false;
  return password === ADMIN_PASSWORD;
}

export const AUTH_COOKIE_OPTIONS = {
  name: SESSION_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7 // 7 days
};
