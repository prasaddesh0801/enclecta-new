/**
 * Shared by the contact form (browser) and /api/contact (server),
 * so both check the exact same rules and offer the exact same options.
 */

export const SERVICE_OPTIONS = [
  "Website Development",
  "AI & Automation",
  "SaaS Development",
  "Product Engineering",
  "Data & Analytics",
  "Social Media Management",
  "Not sure yet",
] as const;

export const BUDGET_OPTIONS = [
  "Under ₹50,000",
  "₹50,000 – ₹2 lakh",
  "₹2 – 5 lakh",
  "₹5 lakh +",
  "Not sure yet",
] as const;

export const MESSAGE_MAX = 2000;

export type ContactValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export const EMPTY_CONTACT: ContactValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  budget: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(v: ContactValues): ContactErrors {
  const e: ContactErrors = {};
  const name = v.name.trim();
  const phoneDigits = v.phone.replace(/\D/g, "");

  if (!name) e.name = "Enter your name.";
  else if (name.length < 2) e.name = "Your name needs at least 2 characters.";
  else if (name.length > 80) e.name = "Keep your name under 80 characters.";

  if (!v.email.trim()) e.email = "Enter your email so we can reply.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email, like name@company.com.";

  // phone is optional, but if it is filled in it must look like a phone number
  if (v.phone.trim()) {
    if (!/^[+()\d\s-]+$/.test(v.phone.trim()) || phoneDigits.length < 7 || phoneDigits.length > 15) {
      e.phone = "Enter a valid phone number, or leave it empty.";
    }
  }

  if (v.company.length > 100) e.company = "Keep this under 100 characters.";

  if (!v.service) e.service = "Choose what you need help with.";

  const msg = v.message.trim();
  if (!msg) e.message = "Tell us a little about your project.";
  else if (msg.length < 10) e.message = "Add a few more words (at least 10 characters).";
  else if (msg.length > MESSAGE_MAX) e.message = `Keep your message under ${MESSAGE_MAX} characters.`;

  return e;
}
