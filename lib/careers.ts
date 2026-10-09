/**
 * Shared by the apply form (browser) and /api/careers (server),
 * so both check the same rules.
 */

export const MESSAGE_MAX = 2000;

export type ApplyValues = {
  name: string;
  email: string;
  phone: string;
  role: string;
  link: string; // portfolio / LinkedIn / GitHub
  resume: string; // optional link to a CV (Drive, Dropbox…)
  message: string;
};

export type ApplyErrors = Partial<Record<keyof ApplyValues, string>>;

export const EMPTY_APPLY: ApplyValues = {
  name: "",
  email: "",
  phone: "",
  role: "",
  link: "",
  resume: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** adds https:// when the visitor typed "linkedin.com/in/me" */
export function normalizeUrl(s: string) {
  const t = s.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

function validUrl(s: string) {
  try {
    const u = new URL(normalizeUrl(s));
    return (u.protocol === "http:" || u.protocol === "https:") && u.hostname.includes(".");
  } catch {
    return false;
  }
}

export function validateApply(v: ApplyValues, roles: readonly string[]): ApplyErrors {
  const e: ApplyErrors = {};
  const name = v.name.trim();
  const phoneDigits = v.phone.replace(/\D/g, "");

  if (!name) e.name = "Enter your name.";
  else if (name.length < 2) e.name = "Your name needs at least 2 characters.";
  else if (name.length > 80) e.name = "Keep your name under 80 characters.";

  if (!v.email.trim()) e.email = "Enter your email so we can reply.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email, like name@gmail.com.";

  if (v.phone.trim()) {
    if (!/^[+()\d\s-]+$/.test(v.phone.trim()) || phoneDigits.length < 7 || phoneDigits.length > 15) {
      e.phone = "Enter a valid phone number, or leave it empty.";
    }
  }

  if (!v.role || !roles.includes(v.role)) e.role = "Choose the role you are applying for.";

  if (!v.link.trim()) e.link = "Add a link to your portfolio, LinkedIn or GitHub.";
  else if (!validUrl(v.link)) e.link = "Enter a valid link, like linkedin.com/in/yourname.";

  if (v.resume.trim() && !validUrl(v.resume)) e.resume = "Enter a valid link, or leave it empty.";

  const msg = v.message.trim();
  if (!msg) e.message = "Tell us a little about yourself.";
  else if (msg.length < 10) e.message = "Add a few more words (at least 10 characters).";
  else if (msg.length > MESSAGE_MAX) e.message = `Keep your message under ${MESSAGE_MAX} characters.`;

  return e;
}
