import type { ServiceRequest } from "./requests";
import { locationLabel } from "./service-locations";

/* ──────────────────────────── Confirmation emails ────────────────────────────
   Sends through SendGrid's Web API over plain HTTPS, so there is no SDK
   dependency. Free tier is 100 emails/day, far above demo traffic.

   Two env vars turn it on (see .env.local.example):
     SENDGRID_API_KEY    from sendgrid.com, Settings > API Keys
     BOOKING_FROM_EMAIL  the sender address verified in SendGrid
                         (Single Sender Verification works with any inbox,
                         no domain needed; swap in a real domain later and
                         this code doesn't change)
   With either one missing we skip quietly, so local dev keeps working
   before email is set up. */

const SENDGRID_URL =
  process.env.SENDGRID_API_URL ?? "https://api.sendgrid.com/v3/mail/send";

// Everything below interpolates customer-typed text, so escape before HTML.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string): string {
  return `<tr>
      <td style="padding:6px 16px 6px 0;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-size:13px;color:#0f172a;">${escapeHtml(value)}</td>
    </tr>`;
}

export function buildConfirmationEmail(r: ServiceRequest): {
  subject: string;
  text: string;
  html: string;
} {
  const firstName = r.customer.split(" ")[0];
  const details: [string, string][] = [
    ["Reference number", r.id],
    ["Name", r.customer],
    ["Service", r.serviceType],
    ["Location", locationLabel(r.location)],
    ["Phone", r.phone],
    ["Email", r.email],
    ["What's going on", r.issue],
  ];
  // Only booked-in scheduling preferences show up; most fields stay optional.
  if (r.preferredDate) details.push(["Preferred date", r.preferredDate]);
  if (r.preferredTime) details.push(["Preferred time", r.preferredTime]);

  const subject = `Booking confirmed (${r.id}) - Fresco Heating & Air`;

  const text = [
    `Hi ${firstName},`,
    "",
    "Thanks for booking with Fresco Heating & Air Conditioning. Your request is in, and our team will reach out shortly to lock in a time.",
    "",
    ...details.map(([k, v]) => `${k}: ${v}`),
    "",
    "If anything changes, reply to this email or call (512) 395-5883.",
    "",
    "- The Fresco team",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:0 auto;padding:24px 16px;">
      <div style="background:#2563eb;border-radius:12px 12px 0 0;padding:20px 24px;">
        <p style="margin:0;color:#ffffff;font-size:17px;font-weight:bold;">Fresco Heating &amp; Air Conditioning</p>
      </div>
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
        <p style="margin:0 0 4px;font-size:18px;font-weight:bold;color:#0f172a;">You're booked in, ${escapeHtml(firstName)}.</p>
        <p style="margin:0 0 18px;font-size:14px;color:#475569;line-height:1.5;">
          Thanks for choosing Fresco. Your request is in, and our team will reach out shortly to lock in a time.
        </p>
        <table style="border-collapse:collapse;width:100%;background:#f8fafc;border-radius:8px;" cellpadding="0">
          ${details.map(([k, v]) => row(k, v)).join("\n          ")}
        </table>
        <p style="margin:18px 0 0;font-size:13px;color:#64748b;line-height:1.5;">
          If anything changes, just reply to this email or call
          <a href="tel:+15123955883" style="color:#2563eb;text-decoration:none;">(512) 395-5883</a>.
        </p>
      </div>
      <p style="margin:14px 0 0;font-size:11px;color:#94a3b8;text-align:center;">
        Fresco Heating &amp; Air Conditioning · Georgetown, TX · License #TACLB27082E
      </p>
    </div>
  </body>
</html>`;

  return { subject, text, html };
}

// A failed email must never take the booking down with it, so this never
// throws; it logs and moves on. Returns whether a confirmation actually
// went out, so the UI can say so.
export async function sendBookingConfirmation(r: ServiceRequest): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.BOOKING_FROM_EMAIL;
  if (!apiKey || !fromEmail) return false;

  const { subject, text, html } = buildConfirmationEmail(r);
  try {
    const res = await fetch(SENDGRID_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: r.email, name: r.customer }] }],
        from: { email: fromEmail, name: "Fresco Heating & Air Conditioning" },
        reply_to: { email: fromEmail, name: "Fresco Heating & Air Conditioning" },
        subject,
        content: [
          { type: "text/plain", value: text },
          { type: "text/html", value: html },
        ],
      }),
    });
    if (!res.ok) {
      console.warn(`[email] SendGrid rejected the confirmation for ${r.id}: ${res.status} ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[email] could not send confirmation for ${r.id}:`, err);
    return false;
  }
}
