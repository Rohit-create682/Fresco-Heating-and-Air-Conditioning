import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { STATUSES, updateStatus, type Status } from "@/lib/requests";
import { adminCookieName, isValidAdminSession } from "@/lib/admin-auth";

/* ──────────────────────────── PATCH /api/requests/[id] ────────────────────────────
   The status dropdown in the admin dashboard calls this. Only the status
   is editable; everything else about a request stays as the customer sent
   it. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Status changes come from the admin console only, same session cookie.
  const store = await cookies();
  if (!(await isValidAdminSession(store.get(adminCookieName())?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const status = body.status;
  if (typeof status !== "string" || !STATUSES.includes(status as Status)) {
    return NextResponse.json(
      { error: `status must be one of: ${STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const updated = await updateStatus(id, status as Status);
  if (!updated) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }
  return NextResponse.json({ request: updated });
}
