import type { ServiceRequest } from "./requests";
import { locationLabel } from "./service-locations";
import { formatPreferredDate } from "./format";

/* ──────────────────────────── Confirmation emails ────────────────────────────
   Sends through a transactional email API over plain HTTPS, so there is no
   SDK dependency. Two providers are wired up; Brevo wins when both are set:

     Brevo (primary, free tier 300 emails/day):
       BREVO_API_KEY       from brevo.com, SMTP & API > API Keys
       BOOKING_FROM_EMAIL  the sender address verified in Brevo (a Gmail
                           address works, no domain needed; swap in a real
                           domain later and this code doesn't change)

     SendGrid (fallback, free tier 100 emails/day):
       SENDGRID_API_KEY    from sendgrid.com, Settings > API Keys
       BOOKING_FROM_EMAIL  the sender address verified in SendGrid
                           (Single Sender Verification)

   With no key set we skip quietly, so local dev keeps working before email
   is set up. */

const BREVO_URL =
  process.env.BREVO_API_URL ?? "https://api.brevo.com/v3/smtp/email";
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
  if (r.preferredDate) details.push(["Preferred date", formatPreferredDate(r.preferredDate)]);
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

/* Both providers get the same booking and return true when the API accepted
   the message. Payload shapes differ just enough to keep them apart. */

async function sendViaBrevo(
  r: ServiceRequest,
  apiKey: string,
  fromEmail: string,
  mail: { subject: string; text: string; html: string }
): Promise<boolean> {
  const res = await fetch(BREVO_URL, {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: { email: fromEmail, name: "Fresco Heating & Air Conditioning" },
      to: [{ email: r.email, name: r.customer }],
      replyTo: { email: fromEmail, name: "Fresco Heating & Air Conditioning" },
      subject: mail.subject,
      textContent: mail.text,
      htmlContent: mail.html,
    }),
  });
  if (!res.ok) {
    console.warn(`[email] Brevo rejected the confirmation for ${r.id}: ${res.status} ${await res.text()}`);
  }
  return res.ok;
}

async function sendViaSendGrid(
  r: ServiceRequest,
  apiKey: string,
  fromEmail: string,
  mail: { subject: string; text: string; html: string }
): Promise<boolean> {
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
      subject: mail.subject,
      content: [
        { type: "text/plain", value: mail.text },
        { type: "text/html", value: mail.html },
      ],
    }),
  });
  if (!res.ok) {
    console.warn(`[email] SendGrid rejected the confirmation for ${r.id}: ${res.status} ${await res.text()}`);
  }
  return res.ok;
}

// A failed email must never take the booking down with it, so this never
// throws; it logs and moves on. Returns whether a confirmation actually
// went out, so the UI can say so.
export async function sendBookingConfirmation(r: ServiceRequest): Promise<boolean> {
  // Public demo deployments set BOOKING_EMAILS_ENABLED=false: the booking
  // still lands on the board, but nothing goes out to real inboxes from a
  // site strangers can reach. Flip to true for the live pitch demo.
  if (process.env.BOOKING_EMAILS_ENABLED === "false") {
    console.info(`[email] confirmations suppressed (BOOKING_EMAILS_ENABLED=false) for ${r.id}`);
    return false;
  }
  const fromEmail = process.env.BOOKING_FROM_EMAIL;
  if (!fromEmail) return false;

  const brevoKey = process.env.BREVO_API_KEY;
  const sendgridKey = process.env.SENDGRID_API_KEY;
  if (!brevoKey && !sendgridKey) return false;

  const mail = buildConfirmationEmail(r);
  try {
    // Brevo is the day-to-day sender; SendGrid stays around as a spare.
    if (brevoKey) return await sendViaBrevo(r, brevoKey, fromEmail, mail);
    return await sendViaSendGrid(r, sendgridKey!, fromEmail, mail);
  } catch (err) {
    console.warn(`[email] could not send confirmation for ${r.id}:`, err);
    return false;
  }
}
