import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";
import { ROLE_OPTIONS } from "@/lib/careers-data";
import { normalizeUrl, validateApply, type ApplyValues } from "@/lib/careers";

export const runtime = "nodejs";

/*
 * Job applications: emailed to your inbox through Resend, exactly like /api/contact.
 * Uses the same env vars. Optional extra:
 *   CAREERS_TO_EMAIL=careers@enclecta.com   (defaults to CONTACT_TO_EMAIL, then siteConfig.email)
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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

async function sendApplication(v: ApplyValues) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[careers] RESEND_API_KEY not set. Application (dev only, not emailed):", v);
      return;
    }
    throw new Error("Email is not configured on the server.");
  }

  const rows: [string, string][] = [
    ["Name", v.name],
    ["Email", v.email],
    ["Phone", v.phone || "-"],
    ["Role", v.role],
    ["Portfolio / profile", v.link],
    ["Resume link", v.resume || "-"],
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? `${siteConfig.name} <onboarding@resend.dev>`,
      to: [process.env.CAREERS_TO_EMAIL ?? process.env.CONTACT_TO_EMAIL ?? siteConfig.email],
      reply_to: v.email,
      subject: `New application: ${v.role} · ${v.name}`,
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
      { ok: false, message: "Too many applications from this connection. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "That request could not be read." }, { status: 400 });
  }

  // honeypot: real people never see this field
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string) : "");
  const values: ApplyValues = {
    name: str("name"),
    email: str("email"),
    phone: str("phone"),
    role: str("role"),
    link: str("link"),
    resume: str("resume"),
    message: str("message"),
  };

  const errors = validateApply(values, ROLE_OPTIONS);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, message: "Please fix the highlighted fields.", errors }, { status: 400 });
  }

  try {
    await sendApplication({
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      link: normalizeUrl(values.link),
      resume: normalizeUrl(values.resume),
      message: values.message.trim(),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[careers] send failed:", err);
    return NextResponse.json(
      { ok: false, message: `We could not send your application. Please email us at ${siteConfig.email}.` },
      { status: 500 },
    );
  }
}
