import { createHmac, timingSafeEqual } from "node:crypto";

// The admin console sits behind one shared password, stored server-side in
// the ADMIN_PASSWORD env var. The browser never gets the password itself:
// after a successful login we hand it a cookie holding an HMAC of a fixed
// message keyed by that password. Checking the cookie only proves the login
// went through, and rotating the password invalidates every session at once.
const COOKIE_NAME = "fresco_admin";
const SESSION_MESSAGE = "fresco-admin-session-v1";

export function adminCookieName(): string {
  return COOKIE_NAME;
}

export function adminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

// The value we expect the session cookie to carry. null when no password is
// configured, which makes every check below fail closed.
export function adminSessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update(SESSION_MESSAGE).digest("hex");
}

export function isValidAdminSession(cookieValue: string | undefined): boolean {
  const expected = adminSessionToken();
  if (!expected || !cookieValue) return false;
  const given = Buffer.from(cookieValue);
  const want = Buffer.from(expected);
  return given.length === want.length && timingSafeEqual(given, want);
}

export function checkAdminPassword(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const given = Buffer.from(candidate);
  const want = Buffer.from(password);
  return given.length === want.length && timingSafeEqual(given, want);
}
