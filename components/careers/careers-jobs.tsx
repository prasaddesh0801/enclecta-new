"use client";

import { useState } from "react";
import Reveal from "@/components/ui/reveal";
import Ico from "@/components/services/service-icons";
import { JOBS } from "@/lib/careers-data";
import { openCareers, CareersTrigger } from "./careers-dialog";

/* Open positions as a job board: a sticky department list on the left, one wide row per role on the right.
   Rows only fire an event; the details / apply dialog lives in careers-dialog.tsx (rendered once at page level). */

const DEPARTMENTS = ["All", ...Array.from(new Set(JOBS.map((j) => j.department)))];
const count = (d: string) => (d === "All" ? JOBS.length : JOBS.filter((j) => j.department === d).length);

export default function CareersJobs() {
  const [dept, setDept] = useState("All");
  const list = dept === "All" ? JOBS : JOBS.filter((j) => j.department === dept);

  if (JOBS.length === 0) {
    return (
      <Reveal>
        <div className="cr-empty">
          <h3 className="heading-font sv-card-title">No open roles right now</h3>
          <p className="body-font sv-card-text">
            We are not hiring at the moment, but we always like meeting good people. Send us your profile and we will
            reach out when something opens up.
          </p>
          <CareersTrigger jobId={null} mode="apply" className="sv-btn cr-btn">Send your profile</CareersTrigger>
        </div>
      </Reveal>
    );
  }

  return (
    <div className="cr-board">
      <aside className="cr-side" aria-label="Filter roles">
        <p className="heading-font cr-side-h">Departments</p>
        <div className="cr-depts" role="group" aria-label="Filter roles by department">
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              type="button"
              className={`cr-dept body-font${d === dept ? " is-on" : ""}`}
              aria-pressed={d === dept}
              onClick={() => setDept(d)}
            >
              <span>{d}</span>
              <b>{count(d)}</b>
            </button>
          ))}
        </div>
        <div className="cr-note">
          <p className="heading-font cr-note-h">Not seeing your role?</p>
          <p className="body-font cr-note-t">Tell us what you do best and we will keep you in mind.</p>
          <CareersTrigger jobId={null} mode="apply" className="cr-ghost body-font">Send your profile</CareersTrigger>
        </div>
      </aside>

      <div className="cr-rows" aria-live="polite">
        {list.map((j, i) => (
          <Reveal key={j.id} delay={Math.min(i, 3) * 70} className="h-full">
            <article className={`cr-row cr-t-${j.tone}`}>
              <span className="cr-ic"><Ico name={j.icon} /></span>
              <div className="cr-row-main">
                <div className="cr-row-title">
                  <h3 className="heading-font">{j.title}</h3>
                  <span className="cr-badge body-font">{j.type}</span>
                </div>
                <p className="body-font cr-row-text">{j.summary}</p>
                <ul className="cr-meta body-font" aria-label="Role details">
                  <li>{j.department}</li>
                  <li>{j.location}</li>
                  <li>{j.experience}</li>
                </ul>
              </div>
              <div className="cr-row-actions">
                <button
                  type="button"
                  className="cr-ghost body-font"
                  onClick={() => openCareers({ jobId: j.id, mode: "details" })}
                  aria-label={`View details for ${j.title}`}
                >
                  View details
                </button>
                <button
                  type="button"
                  className="sv-btn cr-btn"
                  onClick={() => openCareers({ jobId: j.id, mode: "apply" })}
                  aria-label={`Apply for ${j.title}`}
                >
                  Apply now
                </button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
