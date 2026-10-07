/**
 * Decorative 3D scene for the form section: a slowly turning cube whose six faces carry the ways to reach us,
 * two tilted orbit rings with glowing satellites, and floating labels. Pure CSS 3D (no WebGL, no extra package),
 * so it is light, works in both themes and is hidden from screen readers.
 * Sizes use container units (cqw), so the whole thing scales with `.ct-stage`.
 */

const svg = (children: React.ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const FACES: React.ReactNode[] = [
  svg(<><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></>), // mail
  svg(<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />), // phone
  svg(<path d="M4 5h16v11H9l-5 4V5Z" />), // chat
  svg(<><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.4" /></>), // pin
  svg(<path d="m21 3-9.5 18-2.3-7.7L3 11 21 3ZM21 3 9.2 13.3" />), // send
  svg(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9S14.6 18.4 12 21c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3Z" /></>), // globe
];

export default function ContactScene() {
  return (
    <div className="ct-stage" aria-hidden="true">
      <div className="ct-scene">
        <span className="ct-glow" />
        <span className="ct-orbit ct-orbit-a"><i className="ct-orbit-spin"><b className="ct-sat" /></i></span>
        <span className="ct-orbit ct-orbit-b"><i className="ct-orbit-spin"><b className="ct-sat ct-sat-2" /></i></span>
        <div className="ct-cube">
          {FACES.map((icon, i) => (
            <span key={i} className={`ct-face ct-f${i + 1}`}>{icon}</span>
          ))}
        </div>
        <span className="ct-float ct-float-1">Free intro call</span>
        <span className="ct-float ct-float-2">Reply in 1 day</span>
        <span className="ct-float ct-float-3">Fixed price</span>
      </div>
    </div>
  );
}
