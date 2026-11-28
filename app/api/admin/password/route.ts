import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  adminCookieName,
  checkAdminPassword,
  isValidAdminSession,
  setAdminPassword,
} from "@/lib/admin-auth";

/* ──────────────────────────── POST /api/admin/password ────────────────────────────
   The Settings screen posts a password change here. You have to be signed
   in AND know the current password, so a stolen unlocked laptop session
   still can't rotate it quietly. A successful change kills every session
   including this one, so the client sends you back to /login after. */
export async function POST(request: Request) {
  const store = await cookies();
  if (!(await isValidAdminSession(store.get(adminCookieName())?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { currentPassword, newPassword } = body;
  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!(await checkAdminPassword(currentPassword))) {
    return NextResponse.json(
      { error: "The current password is not right" },
      { status: 403 }
    );
  }
  if (newPassword.length < 10) {
    return NextResponse.json(
      { error: "Make the new password at least 10 characters" },
      { status: 400 }
    );
  }
  if (newPassword === currentPassword) {
    return NextResponse.json(
      { error: "That is already the password" },
      { status: 400 }
    );
  }

  await setAdminPassword(newPassword);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookieName(), "", { path: "/", maxAge: 0 });
  return res;
}
