import type { CSSProperties } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/reveal";
import Tilt from "./tilt";
import Shot from "./shot";
import type { Work } from "@/lib/featured-projects";

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
  </svg>
);

const vars = (t: Work["theme"]) => ({ "--pw-dark": t.dark, "--pw-b1": t.b1, "--pw-b2": t.b2 }) as CSSProperties;

/**
 * Featured projects (data: lib/featured-projects.ts).
 * 1. The big three: one large 3D card each (number, name, subtitle, tags, summary, "View case study", tech chips, photo).
 * 2. "Explore other projects": three small cards in one row.
 * Every card links to its own page, /portfolio/<slug>.
 */
export default function FeaturedProjects({ projects, others }: { projects: Work[]; others: Work[] }) {
  return (
    <>
      <div className="pw-feats">
        {projects.map((p, i) => {
          const href = `/portfolio/${p.slug}`;
          return (
            <Reveal key={p.slug} className="pw-feat-wrap">
              <Tilt className={`pw-feat${p.theme.light ? " is-alt" : ""}`} max={4} style={vars(p.theme)}>
                <span className="pw-feat-bg" aria-hidden="true">
                  <i className="pw-orb pw-orb-a" />
                  <i className="pw-orb pw-orb-b" />
                </span>

                <div className="pw-feat-copy">
                  <span className="heading-font pw-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="heading-font pw-feat-title">{p.name}</h3>
                  <p className="body-font pw-feat-cat">{p.subtitle}</p>
                  {p.tags.length > 0 && (
                    <ul className="pw-tags">
                      {p.tags.map((t) => (
                        <li key={t} className="body-font">{t}</li>
                      ))}
                    </ul>
                  )}
                  <p className="body-font pw-feat-text">{p.summary}</p>
                  <Link href={href} className="pw-btn body-font">
                    View case study <Arrow />
                  </Link>
                  {p.stack.length > 0 && (
                    <ul className="pw-stack body-font" aria-label="Built with">
                      {p.stack.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pw-stage" aria-hidden="true">
                  <div className="pw-shot pw-main">
                    <div className="pw-shot-in">
                      <Shot src={p.image} name={p.name} sizes="(min-width: 900px) 55vw, 100vw" />
                    </div>
                  </div>
                  {p.image2 && (
                    <div className="pw-shot pw-second">
                      <div className="pw-shot-in">
                        <Shot src={p.image2} name={p.name} sizes="20vw" />
                      </div>
                    </div>
                  )}
                  {p.stack.slice(0, 2).map((t, j) => (
                    <span key={t} className={`pw-float pw-float-${j + 1} body-font`}>
                      <i />
                      {t}
                    </span>
                  ))}
                </div>

                {/* the whole card opens the project (the button above is the keyboard / screen-reader link) */}
                <Link href={href} className="pw-feat-cover" aria-hidden="true" tabIndex={-1} />
              </Tilt>
            </Reveal>
          );
        })}
      </div>

      {others.length > 0 && (
        <>
          <Reveal className="pw-sub-head">
            <h3 className="heading-font pw-sub-title">
              Explore other <em>projects</em>
            </h3>
            <p className="body-font pw-sub-text">Open any project to see the challenge, the solution and the result.</p>
          </Reveal>

          <div className="pw-minis">
            {others.map((p, i) => {
              const href = `/portfolio/${p.slug}`;
              return (
                <Reveal key={p.slug} delay={i * 90} className="pw-mini-cell">
                  <Tilt className="pw-mini-tilt" max={8} style={vars(p.theme)}>
                    <article className="pw-mini">
                      <Link href={href} className="pw-card-cover" aria-hidden="true" tabIndex={-1} />
                      <div className="pw-mini-shot">
                        <div className="pw-shot-in">
                          <Shot src={p.image} name={p.name} sizes="(min-width: 760px) 33vw, 100vw" />
                        </div>
                      </div>
                      <div className="pw-mini-body">
                        <div>
                          <h4 className="heading-font pw-mini-title">{p.name}</h4>
                          <p className="body-font pw-mini-sub">{p.subtitle}</p>
                        </div>
                        <Link href={href} className="pw-card-go" aria-label={`View the ${p.name} project`}>
                          <Arrow />
                        </Link>
                      </div>
                    </article>
                  </Tilt>
                </Reveal>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
