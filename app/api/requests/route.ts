import { NextResponse } from "next/server";
import { createRequest, listRequests } from "@/lib/requests";

// Never cache this; the admin dashboard polls it for live data.
export const dynamic = "force-dynamic";

/* ──────────────────────────── GET /api/requests ────────────────────────────
   Everything on the board, newest first. Used by the admin dashboard. */
export async function GET() {
  const requests = await listRequests();
  return NextResponse.json({ requests });
}

/* ──────────────────────────── POST /api/requests ────────────────────────────
   The booking form lands here. Validates the fields the form collects,
   then stores the request and hands back the record (with its new id) so
   the confirmation screen can show it. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const required = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "location",
    "issue",
    "serviceType",
  ] as const;

  const fields: Record<string, string> = {};
  for (const key of required) {
    const value = body[key];
    if (typeof value !== "string" || value.trim() === "") {
      return NextResponse.json(
        { error: `Missing or empty field: ${key}` },
        { status: 400 }
      );
    }
    fields[key] = value.trim();
  }

  // Cheap sanity check on the email; the browser already enforces type=email
  // but API callers don't have to come from our form.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const created = await createRequest({
    customer: `${fields.firstName} ${fields.lastName}`,
    email: fields.email,
    phone: fields.phone,
    location: fields.location,
    serviceType: fields.serviceType,
    issue: fields.issue,
  });

  return NextResponse.json({ request: created }, { status: 201 });
}
