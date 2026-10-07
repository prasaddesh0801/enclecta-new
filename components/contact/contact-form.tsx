"use client";

import { useRef, useState } from "react";
import {
  BUDGET_OPTIONS,
  EMPTY_CONTACT,
  MESSAGE_MAX,
  SERVICE_OPTIONS,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from "@/lib/contact";
import { siteConfig } from "@/lib/site";

type Status = "idle" | "loading" | "success" | "error";

const FIELD_ORDER: (keyof ContactValues)[] = ["name", "email", "phone", "company", "service", "budget", "message"];

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [values, setValues] = useState<ContactValues>(EMPTY_CONTACT);
  const [touched, setTouched] = useState<Partial<Record<keyof ContactValues, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [sentTo, setSentTo] = useState("");

  const liveErrors = validateContact(values);
  /* an error shows once the field was visited (or after a failed submit); typing clears a server error for that field */
  const errorFor = (k: keyof ContactValues) => (touched[k] ? liveErrors[k] ?? serverErrors[k] : undefined);

  const set = (k: keyof ContactValues, v: string) => {
    setValues((p) => ({ ...p, [k]: v }));
    if (serverErrors[k]) setServerErrors((p) => ({ ...p, [k]: undefined }));
  };
  const blur = (k: keyof ContactValues) => setTouched((p) => ({ ...p, [k]: true }));

  const focusFirstInvalid = () =>
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const errs = validateContact(values);
    if (Object.keys(errs).length) {
      setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])));
      focusFirstInvalid();
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: fd.get("website") ?? "" }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; errors?: ContactErrors };

      if (res.ok && data.ok) {
        setSentTo(values.email.trim());
        setStatus("success");
        setValues(EMPTY_CONTACT);
        setTouched({});
        setServerErrors({});
        return;
      }
      if (data.errors) {
        setServerErrors(data.errors);
        setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])));
        focusFirstInvalid();
      }
      setErrorMsg(data.message ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setErrorMsg("We could not reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  /* ---------- success ---------- */
  if (status === "success") {
    return (
      <div id="contact-form" className="ct-panel ct-done" role="status" aria-live="polite">
        <span className="ct-done-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 className="heading-font ct-done-title">Message sent</h3>
        <p className="body-font sv-card-text">
          Thanks. We will reply to <strong>{sentTo}</strong> within one working day with next steps and a rough quote.
        </p>
        <button type="button" className="sv-btn ct-btn" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  const field = (k: keyof ContactValues) => ({
    id: `ct-${k}`,
    name: k,
    value: values[k],
    "aria-invalid": errorFor(k) ? (true as const) : undefined,
    "aria-describedby": errorFor(k) ? `ct-${k}-err` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => set(k, e.target.value),
    onBlur: () => blur(k),
    disabled: status === "loading",
  });

  const Err = ({ k }: { k: keyof ContactValues }) =>
    errorFor(k) ? (
      <p id={`ct-${k}-err`} className="body-font ct-err">{errorFor(k)}</p>
    ) : null;

  const left = MESSAGE_MAX - values.message.length;

  return (
    <form id="contact-form" ref={formRef} className="ct-panel" onSubmit={onSubmit} noValidate aria-busy={status === "loading"}>
      <h3 className="heading-font ct-form-title">Send us the details</h3>

      {status === "error" && (
        <div className="ct-alert body-font" role="alert">
          <strong>Your message was not sent.</strong> {errorMsg}{" "}
          <a href={`mailto:${siteConfig.email}`}>Email us directly</a> if it keeps happening.
        </div>
      )}

      <div className="ct-grid2">
        <div className="ct-field">
          <label htmlFor="ct-name" className="body-font ct-label">Your name</label>
          <input {...field("name")} type="text" autoComplete="name" className="body-font ct-input" placeholder="Priya Sharma" />
          <Err k="name" />
        </div>

        <div className="ct-field">
          <label htmlFor="ct-email" className="body-font ct-label">Email</label>
          <input {...field("email")} type="email" inputMode="email" autoComplete="email" className="body-font ct-input" placeholder="you@company.com" />
          <Err k="email" />
        </div>

        <div className="ct-field">
          <label htmlFor="ct-phone" className="body-font ct-label">Phone <span className="ct-opt">optional</span></label>
          <input {...field("phone")} type="tel" inputMode="tel" autoComplete="tel" className="body-font ct-input" placeholder="+91 98765 43210" />
          <Err k="phone" />
        </div>

        <div className="ct-field">
          <label htmlFor="ct-company" className="body-font ct-label">Company <span className="ct-opt">optional</span></label>
          <input {...field("company")} type="text" autoComplete="organization" className="body-font ct-input" placeholder="Your company" />
          <Err k="company" />
        </div>

        <div className="ct-field">
          <label htmlFor="ct-service" className="body-font ct-label">What do you need?</label>
          <select {...field("service")} className="body-font ct-input">
            <option value="">Choose a service</option>
            {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Err k="service" />
        </div>

        <div className="ct-field">
          <label htmlFor="ct-budget" className="body-font ct-label">Budget <span className="ct-opt">optional</span></label>
          <select {...field("budget")} className="body-font ct-input">
            <option value="">Not decided</option>
            {BUDGET_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Err k="budget" />
        </div>

        <div className="ct-field ct-span">
          <label htmlFor="ct-message" className="body-font ct-label">About your project</label>
          <textarea
            {...field("message")}
            rows={5}
            maxLength={MESSAGE_MAX + 200}
            className="body-font ct-input ct-textarea"
            placeholder="What are you building, who is it for, and when do you need it?"
          />
          <div className="ct-meta">
            <Err k="message" />
            <span className={`body-font ct-count${left < 0 ? " is-over" : ""}`} aria-hidden="true">{values.message.length}/{MESSAGE_MAX}</span>
          </div>
        </div>

        {/* honeypot: hidden from people; bots fill it in */}
        <div className="ct-hp" aria-hidden="true">
          <label>Website <input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>
      </div>

      <div className="ct-actions">
        <button type="submit" className="sv-btn ct-btn" disabled={status === "loading"}>
          {status === "loading" ? (
            <>
              <span className="ct-spinner" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Send message
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
              </svg>
            </>
          )}
        </button>
        <p className="body-font ct-note">We reply within one working day. Your details are only used to answer this enquiry.</p>
      </div>
    </form>
  );
}
