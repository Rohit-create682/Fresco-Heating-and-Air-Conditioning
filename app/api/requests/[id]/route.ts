import { NextResponse } from "next/server";
import { STATUSES, updateStatus, type Status } from "@/lib/requests";

/* ──────────────────────────── PATCH /api/requests/[id] ────────────────────────────
   The status dropdown in the admin dashboard calls this. Only the status
   is editable; everything else about a request stays as the customer sent
   it. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
