import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRequest, listRequests } from "@/lib/requests";
import { adminCookieName, isValidAdminSession } from "@/lib/admin-auth";
import { sendBookingConfirmation } from "@/lib/email";
import { PREFERRED_TIME_WINDOWS } from "@/lib/service-locations";

// Never cache this; the admin dashboard polls it for live data.
export const dynamic = "force-dynamic";

/* ──────────────────────────── GET /api/requests ────────────────────────────
   Everything on the board, newest first. Used by the admin dashboard. */
export async function GET() {
  // Booking data is internal: only the logged-in admin console can read it.
  // POST stays open, that is the public booking form.
  const store = await cookies();
  if (!isValidAdminSession(store.get(adminCookieName())?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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

  // Scheduling preferences are optional, but if they show up they have to
  // be well-formed: a real date and one of the windows the form offers.
  const preferred: { preferredDate?: string; preferredTime?: string } = {};
  if (typeof body.preferredDate === "string" && body.preferredDate.trim() !== "") {
    const d = body.preferredDate.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || Number.isNaN(Date.parse(d))) {
      return NextResponse.json({ error: "Invalid preferred date" }, { status: 400 });
    }
    preferred.preferredDate = d;
  }
  if (typeof body.preferredTime === "string" && body.preferredTime.trim() !== "") {
    const t = body.preferredTime.trim();
    if (!PREFERRED_TIME_WINDOWS.includes(t)) {
      return NextResponse.json({ error: "Invalid preferred time window" }, { status: 400 });
    }
    preferred.preferredTime = t;
  }

  const created = await createRequest({
    customer: `${fields.firstName} ${fields.lastName}`,
    email: fields.email,
    phone: fields.phone,
    location: fields.location,
    serviceType: fields.serviceType,
    issue: fields.issue,
    ...preferred,
  });

  // Awaits but never throws: if email isn't configured or SendGrid hiccups,
  // the booking still succeeds and we just log it. The flag lets the
  // confirmation screen tell the customer the email is actually on its way.
  const emailSent = await sendBookingConfirmation(created);

  return NextResponse.json({ request: created, emailSent }, { status: 201 });
}
