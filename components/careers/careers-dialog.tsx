"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { JOBS, GENERAL_ROLE, ROLE_OPTIONS } from "@/lib/careers-data";
import { EMPTY_APPLY, MESSAGE_MAX, validateApply, type ApplyErrors, type ApplyValues } from "@/lib/careers";
import { siteConfig } from "@/lib/site";
import "./careers.css";

/* =========================================================
   Job details + apply form, shown in ONE dialog (bottom sheet on phones, centred card on larger screens).
   Open it from anywhere with openCareers({ jobId, mode }) or <CareersTrigger>. jobId null = general application.
   Render <CareersDialog /> ONCE per page, outside any <section> (see careers-landing.tsx).
   ========================================================= */

type OpenDetail = { jobId: string | null; mode: "details" | "apply" };
const EVENT = "cr:open";

export function openCareers(d: OpenDetail) {
  window.dispatchEvent(new CustomEvent<OpenDetail>(EVENT, { detail: d }));
}

export function CareersTrigger({
  jobId = null,
  mode = "apply",
  className,
  children,
}: {
  jobId?: string | null;
  mode?: "details" | "apply";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={() => openCareers({ jobId, mode })}>
      {children}
    </button>
  );
}

function Field({
  label,
  name,
  error,
  optional,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`cr-field${error ? " has-error" : ""}`}>
      <label htmlFor={`cr-${name}`} className="body-font cr-label">
        {label}
        {optional && <span> (optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`cr-${name}-err`} className="body-font cr-err" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const Close = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
  </svg>
);

export default function CareersDialog() {
  const [state, setState] = useState<OpenDetail | null>(null);
  const [values, setValues] = useState<ApplyValues>(EMPTY_APPLY);
  const [errors, setErrors] = useState<ApplyErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const job = state?.jobId ? JOBS.find((j) => j.id === state.jobId) ?? null : null;
  const isOpen = state !== null;
  const mode = state?.mode;

  const close = useCallback(() => {
    setState(null);
    lastFocus.current?.focus?.();
  }, []);

  /* open from cards / CTA buttons */
  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<OpenDetail>).detail;
      const j = d.jobId ? JOBS.find((x) => x.id === d.jobId) : null;
      lastFocus.current = document.activeElement as HTMLElement | null;
      setState({ jobId: j ? j.id : null, mode: j ? d.mode : "apply" });
      setValues((v) => ({ ...v, role: j ? j.title : GENERAL_ROLE }));
      setErrors({});
      setStatus("idle");
      setServerMsg("");
    };
    window.addEventListener(EVENT, onOpen);
    return () => window.removeEventListener(EVENT, onOpen);
  }, []);

  /* while open: lock page scroll, Escape closes */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  /* new view (details <-> apply): back to the top and move focus into the panel */
  useEffect(() => {
    if (!isOpen) return;
    panelRef.current?.scrollTo({ top: 0 });
    panelRef.current?.focus();
  }, [isOpen, mode]);

  if (!state) return null;

  const set =
    (k: keyof ApplyValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      setValues((v) => ({ ...v, [k]: val }));
      if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
    };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;

    const errs = validateApply(values, ROLE_OPTIONS);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    setStatus("sending");
    setServerMsg("");
    const website = String(new FormData(form).get("website") ?? "");
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("sent");
        setValues(EMPTY_APPLY);
      } else {
        setStatus("error");
        setServerMsg(data.message ?? `Something went wrong. Please email us at ${siteConfig.email}.`);
        if (data.errors) setErrors(data.errors);
      }
    } catch {
      setStatus("error");
      setServerMsg(`Network problem. Please try again, or email us at ${siteConfig.email}.`);
    }
  }

  const err = (k: keyof ApplyValues) =>
    errors[k] ? ({ "aria-invalid": true, "aria-describedby": `cr-${k}-err` } as const) : {};

  return (
    <div
      className="cr-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        className="cr-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cr-dlg-title"
        tabIndex={-1}
      >
        <button type="button" className="cr-x" aria-label="Close" onClick={close}>
          <Close />
        </button>

        {/* ---------------- job details ---------------- */}
        {state.mode === "details" && job && (
          <div className="cr-dlg-body">
            <span className="cr-badge body-font">{job.type}</span>
            <h2 id="cr-dlg-title" className="heading-font cr-dlg-title">{job.title}</h2>
            <ul className="cr-meta body-font">
              <li>{job.department}</li>
              <li>{job.location}</li>
              <li>{job.experience}</li>
            </ul>
            <p className="body-font cr-dlg-lead">{job.summary}</p>

            <h3 className="heading-font cr-dlg-h">What you will do</h3>
            <ul className="body-font cr-list">
              {job.responsibilities.map((t) => <li key={t}>{t}</li>)}
            </ul>

            <h3 className="heading-font cr-dlg-h">What we are looking for</h3>
            <ul className="body-font cr-list">
              {job.requirements.map((t) => <li key={t}>{t}</li>)}
            </ul>

            {job.niceToHave && job.niceToHave.length > 0 && (
              <>
                <h3 className="heading-font cr-dlg-h">Nice to have</h3>
                <ul className="body-font cr-list">
                  {job.niceToHave.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </>
            )}

            <h3 className="heading-font cr-dlg-h">How you will work</h3>
            <p className="body-font cr-dlg-lead">
              Enclecta is remote-first. We work from home, plan in the open and meet on short video calls, so you can do
              your best work from wherever you live in India.
            </p>

            <div className="cr-dlg-actions">
              <button type="button" className="sv-btn cr-btn" onClick={() => setState({ jobId: job.id, mode: "apply" })}>
                Apply for this role
              </button>
              <button type="button" className="cr-ghost body-font" onClick={close}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* ---------------- apply form ---------------- */}
        {state.mode === "apply" && (
          <div className="cr-dlg-body">
            {status === "sent" ? (
              <div className="cr-done" role="status">
                <span className="cr-done-ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <h2 id="cr-dlg-title" className="heading-font cr-dlg-title">Application sent</h2>
                <p className="body-font cr-dlg-lead">
                  Thank you for applying. We read every application and reply within a few working days, whether the
                  answer is yes or not yet.
                </p>
                <button type="button" className="sv-btn cr-btn" onClick={close}>Done</button>
              </div>
            ) : (
              <>
                {job && (
                  <button
                    type="button"
                    className="cr-back body-font"
                    onClick={() => setState({ jobId: job.id, mode: "details" })}
                  >
                    &larr; Back to role details
                  </button>
                )}
                <h2 id="cr-dlg-title" className="heading-font cr-dlg-title">
                  {job ? `Apply: ${job.title}` : "Send your profile"}
                </h2>
                <p className="body-font cr-dlg-lead">
                  {job
                    ? "Tell us a little about you. It takes about two minutes."
                    : "No fitting role open? Tell us what you do best and we will keep you in mind."}
                </p>

                <form className="cr-form" onSubmit={submit} noValidate>
                  <div className="cr-row-f">
                    <Field label="Full name" name="name" error={errors.name}>
                      <input id="cr-name" name="name" type="text" autoComplete="name" className="cr-input body-font" value={values.name} onChange={set("name")} {...err("name")} />
                    </Field>
                    <Field label="Email" name="email" error={errors.email}>
                      <input id="cr-email" name="email" type="email" autoComplete="email" className="cr-input body-font" value={values.email} onChange={set("email")} {...err("email")} />
                    </Field>
                  </div>

                  <div className="cr-row-f">
                    <Field label="Phone" name="phone" error={errors.phone} optional>
                      <input id="cr-phone" name="phone" type="tel" autoComplete="tel" className="cr-input body-font" value={values.phone} onChange={set("phone")} {...err("phone")} />
                    </Field>
                    <Field label="Role" name="role" error={errors.role}>
                      <select id="cr-role" name="role" className="cr-input body-font" value={values.role} onChange={set("role")} {...err("role")}>
                        {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </Field>
                  </div>

                  <Field label="Portfolio, LinkedIn or GitHub link" name="link" error={errors.link}>
                    <input id="cr-link" name="link" type="text" inputMode="url" placeholder="linkedin.com/in/yourname" className="cr-input body-font" value={values.link} onChange={set("link")} {...err("link")} />
                  </Field>

                  <Field label="Resume link (Google Drive, Dropbox…)" name="resume" error={errors.resume} optional>
                    <input id="cr-resume" name="resume" type="text" inputMode="url" placeholder="drive.google.com/…" className="cr-input body-font" value={values.resume} onChange={set("resume")} {...err("resume")} />
                  </Field>

                  <Field label="Tell us about yourself" name="message" error={errors.message}>
                    <textarea id="cr-message" name="message" rows={5} maxLength={MESSAGE_MAX + 200} className="cr-input cr-area body-font" value={values.message} onChange={set("message")} {...err("message")} />
                  </Field>

                  {/* honeypot: hidden from real people */}
                  <div className="cr-hp" aria-hidden="true">
                    <label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
                  </div>

                  {status === "error" && (
                    <p className="body-font cr-err cr-err-box" role="alert">{serverMsg}</p>
                  )}

                  <div className="cr-dlg-actions">
                    <button type="submit" className="sv-btn cr-btn" disabled={status === "sending"}>
                      {status === "sending" ? "Sending…" : "Submit application"}
                    </button>
                    <a className="cr-ghost body-font" href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(`Application: ${values.role || "Enclecta"}`)}`}>
                      Or email us
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
