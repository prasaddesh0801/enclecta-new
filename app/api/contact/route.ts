import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";
import { validateContact, type ContactValues } from "@/lib/contact";

export const runtime = "nodejs";

/*
 * Lead handling — sends the enquiry to your inbox through Resend (https://resend.com), no extra package needed.
 * Set these in .env.local (and in Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY=re_xxx
 *   CONTACT_TO_EMAIL=hello@enclecta.com                  (where leads arrive; defaults to NEXT_PUBLIC_CONTACT_EMAIL)
 *   CONTACT_FROM_EMAIL="Enclecta <leads@enclecta.com>"   (a verified domain; defaults to Resend's test sender)
 * Want leads in a Google Sheet, CRM or WhatsApp instead? Replace the body of sendLead() — nothing else changes.
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* tiny per-IP limiter (per server instance): stops accidental double-sends and trivial spam */
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;
const MAX_HITS = 5;
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

async function sendLead(v: ContactValues) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact] RESEND_API_KEY not set. Lead (dev only, not emailed):", v);
      return;
    }
    throw new Error("Email is not configured on the server.");
  }

  const rows: [string, string][] = [
    ["Name", v.name],
    ["Email", v.email],
    ["Phone", v.phone || "-"],
    ["Company", v.company || "-"],
    ["Service", v.service],
    ["Budget", v.budget || "-"],
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? `${siteConfig.name} <onboarding@resend.dev>`,
      to: [process.env.CONTACT_TO_EMAIL ?? siteConfig.email],
      reply_to: v.email,
      subject: `New enquiry from ${v.name} · ${v.service}`,
      text: rows.map(([k, val]) => `${k}: ${val}`).join("\n") + `\n\n${v.message}`,
      html:
        `<table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:15px">` +
        rows.map(([k, val]) => `<tr><td><b>${k}</b></td><td>${esc(val)}</td></tr>`).join("") +
        `</table><p style="font-family:system-ui,sans-serif;font-size:15px;white-space:pre-wrap">${esc(v.message)}</p>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many messages from this connection. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "That request could not be read." }, { status: 400 });
  }

  // honeypot: real people never see this field. Pretend it worked so bots move on.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string) : "");
  const values: ContactValues = {
    name: str("name"),
    email: str("email"),
    phone: str("phone"),
    company: str("company"),
    service: str("service"),
    budget: str("budget"),
    message: str("message"),
  };

  const errors = validateContact(values);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, message: "Please fix the highlighted fields.", errors }, { status: 400 });
  }

  try {
    await sendLead({ ...values, name: values.name.trim(), email: values.email.trim(), message: values.message.trim() });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      { ok: false, message: `We could not send your message. Please email us at ${siteConfig.email}.` },
      { status: 500 },
    );
  }
}
