import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promises as fs } from "fs";
import path from "path";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// The admin console sits behind one shared password. On a fresh deploy the
// password comes from the ADMIN_PASSWORD env var; once someone changes it
// from the Settings screen, a salted scrypt hash of the new password is
// written to data/admin.json (same gitignored disk store as the bookings)
// and that takes over from then on. Delete data/admin.json and the env
// password works again. The raw password is never stored anywhere.
//
// The browser never gets the password itself: after a successful login we
// hand it a cookie holding an HMAC keyed by whatever secret is active
// (the stored hash, or the env password). Changing the password changes
// that secret, so every session dies the moment the password rotates.
const COOKIE_NAME = "fresco_admin";
const SESSION_MESSAGE = "fresco-admin-session-v1";
const DATA_DIR = path.join(process.cwd(), "data");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

interface StoredAdmin {
  salt: string;
  hash: string;
}

async function readStored(): Promise<StoredAdmin | null> {
  try {
    const raw = await fs.readFile(ADMIN_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (typeof parsed.salt === "string" && typeof parsed.hash === "string") {
      return parsed;
    }
  } catch {
    // No file (or unreadable): fall through to the env bootstrap.
  }
  return null;
}

export function adminCookieName(): string {
  return COOKIE_NAME;
}

export async function adminPasswordConfigured(): Promise<boolean> {
  return Boolean(process.env.ADMIN_PASSWORD) || (await readStored()) !== null;
}

export async function checkAdminPassword(candidate: string): Promise<boolean> {
  const stored = await readStored();
  if (stored) {
    const hash = (await scryptAsync(candidate, stored.salt, 64)) as Buffer;
    const want = Buffer.from(stored.hash, "hex");
    return hash.length === want.length && timingSafeEqual(hash, want);
  }
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const given = Buffer.from(candidate);
  const want = Buffer.from(password);
  return given.length === want.length && timingSafeEqual(given, want);
}

export async function setAdminPassword(newPassword: string): Promise<void> {
  const salt = randomBytes(16).toString("hex");
  const hash = ((await scryptAsync(newPassword, salt, 64)) as Buffer).toString("hex");
  await fs.mkdir(DATA_DIR, { recursive: true });
  // Write-then-rename, same as the bookings store: a crash mid-write can't
  // leave a half-written credential file that locks everyone out.
  const tmp = ADMIN_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify({ salt, hash }, null, 2), {
    encoding: "utf8",
    mode: 0o600,
  });
  await fs.rename(tmp, ADMIN_FILE);
}

// The value we expect the session cookie to carry. null when no password is
// configured, which makes every check below fail closed.
export async function adminSessionToken(): Promise<string | null> {
  const stored = await readStored();
  const secret = stored ? stored.hash : process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  return createHmac("sha256", secret).update(SESSION_MESSAGE).digest("hex");
}

export async function isValidAdminSession(
  cookieValue: string | undefined
): Promise<boolean> {
  const expected = await adminSessionToken();
  if (!expected || !cookieValue) return false;
  const given = Buffer.from(cookieValue);
  const want = Buffer.from(expected);
  return given.length === want.length && timingSafeEqual(given, want);
}
