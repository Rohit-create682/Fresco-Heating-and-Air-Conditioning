import { NextResponse } from "next/server";
import {
  adminCookieName,
  adminPasswordConfigured,
  adminSessionToken,
  checkAdminPassword,
} from "@/lib/admin-auth";

/* ──────────────────────────── POST /api/admin/login ────────────────────────────
   The login page posts the password here. On a match we set the session
   cookie (httpOnly, a week long) and the /admin layout lets the console
   render. On a miss we just say no. */
export async function POST(request: Request) {
  if (!(await adminPasswordConfigured())) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not set on the server" },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const password = body.password;
  if (typeof password !== "string" || !(await checkAdminPassword(password))) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const token = await adminSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookieName(), token!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // one week, then log in again
  });
  return res;
}
