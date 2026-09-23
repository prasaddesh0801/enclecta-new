/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Enclecta hero intro — LIGHT THEME (WebGL port of the approved HTML prototype).
 *
 * A laptop lid opens, hands type the headline on the screen, the machine turns
 * so the brand mark on the lid can be read, the camera pushes in, the laptop
 * dissolves and the typed text glides out to become the page title. The title
 * rides the camera, so it never jitters.
 *
 * The dark theme lives in hero-scene-dark.ts — the two files are independent.
 *
 * Colours are read from the CSS custom properties in globals.css, so changing
 * the palette there recolours the animation too.
 */
import * as THREE from "three";
import gsap from "gsap";

export type HeroSceneParams = {
  hero: HTMLElement;
  canvas: HTMLCanvasElement;
  lineEls: HTMLElement[];
  lines: [string, string];
  /** fired once the title has landed — the page uses it to reveal the header */
  onTitleLanded?: () => void;
  /** skip the laptop intro and jump straight to the landed title (used when the
   *  visitor switches theme after the intro has already played) */
  skipIntro?: boolean;
};

export type HeroSceneHandle = { destroy: () => void };

function readPalette() {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) =>
    (cs.getPropertyValue(name) || "").trim() || fallback;

  return {
    // the hero has its own permanently-dark palette, independent of the
    // site-wide (light) --background/--foreground tokens
    heroBg: v("--hero-bg", "#f6f5ff"),
    heroForeground: v("--hero-foreground", "#000d3c"),
    accent: v("--hero-accent", "#01c5ff"),
    accentWarm: v("--hero-accent-warm", "#ff6200"),
    accentSoft: v("--hero-accent-soft", "#c9b6ff"),
    navy900: v("--brand-navy-900", "#000d3c"),
    navy800: v("--brand-navy-800", "#000066"),
    blue700: v("--brand-blue-700", "#001fbd"),
    blue500: v("--brand-blue-500", "#0131ff"),
    white: v("--brand-white", "#ffffff"),
    // same token the header's logo uses for "Ventures" — keeps the wordmark
    // and the title's first line exactly in sync (see globals.css)
    titleAccent: v("--hero-title-accent", "#386cfc"),
  };
}

function hexToRgba(hex: string, alpha: number) {
  const c = new THREE.Color(hex);
  return `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(
    c.b * 255,
  )},${alpha})`;
}

/* =========================================================
   LIGHT THEME — EDIT COLOURS HERE
   ========================================================= */

/** line2's colour, sampled from the approved light-theme reference image.
 *  "Company" on the screen + "Ventures" on the lid back. line1's colour
 *  ("Website Development" / "Enclecta") is P.titleAccent, above — the same
 *  token the header's logo uses, so the two always match. */
const LINE2_COLOR = "#a0ec4c";

/** Keep the navbar's "Ventures" wordmark on the exact same green as the
 * laptop lid and the second hero title line. This is intentionally scoped
 * to the header so "Website Development" remains blue. */
function syncNavbarVenturesColor(color: string) {
  const header = document.querySelector("header");
  if (!header) return;

  header.querySelectorAll<HTMLElement>("*").forEach((el) => {
    if (el.children.length === 0 && el.textContent?.trim() === "Ventures") {
      el.style.color = color;
    }
  });
}

export function createHeroScene({
  hero,
  canvas,
  lineEls,
  lines,
  onTitleLanded,
  skipIntro = false,
}: HeroSceneParams): HeroSceneHandle {
  const P = readPalette();
  const SCREEN_LINE_1 = lines[0];
  const SCREEN_LINE_2 = lines[1];

  // Match the navbar wordmark to the laptop/title green.
  syncNavbarVenturesColor(P.titleAccent);

  gsap.config({ force3D: false });

  let disposed = false;
  const timelines: gsap.core.Timeline[] = [];
  const track = (tl: gsap.core.Timeline) => {
    timelines.push(tl);
    return tl;
  };

  /* The visible title is drawn in WebGL; the DOM <h1> stays transparent and only
     tells us where the title should land. A zero-size probe marks the baseline. */
  lineEls.forEach((el, i) => {
    el.textContent = lines[i];
    const probe = document.createElement("span");
    probe.className = "baseline-probe";
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText =
      "display:inline-block;width:0;height:0;vertical-align:baseline;";
    el.appendChild(probe);
  });

  const computed = getComputedStyle(lineEls[0]);
  const displayFamily = computed.fontFamily || "sans-serif";
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(new THREE.Color("#ffffff").getHex(), 0.055);

  const camera = new THREE.PerspectiveCamera(
    42,
    hero.clientWidth / hero.clientHeight,
    0.1,
    100,
  );
  scene.add(camera); // the title rides the camera, so it stays pixel-still

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(hero.clientWidth, hero.clientHeight);
  renderer.setClearColor(new THREE.Color("#ffffff"), 1);

  /* ---------- lighting ---------- */
  scene.add(new THREE.AmbientLight(new THREE.Color(P.white), 0.9));

  const keyLight = new THREE.PointLight(new THREE.Color(P.accent), 1.6, 20);
  keyLight.position.set(2.5, 3.5, 3);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(new THREE.Color(P.accentWarm), 1.4, 20);
  rimLight.position.set(-3, 1.5, -2);
  scene.add(rimLight);

  const fillLight = new THREE.DirectionalLight(new THREE.Color(P.blue700), 0.35);
  fillLight.position.set(0, 5, -3);
  scene.add(fillLight);

  /* ---------- background: tech grid + drifting particles ---------- */
  const grid = new THREE.GridHelper(
    40,
    40,
    new THREE.Color(P.accent),
    new THREE.Color(P.navy900),
  );
  grid.position.y = -1.35;
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.16;
  scene.add(grid);

  /* ---------- layout constants ("1024-space" = the 1024x640 screen layout) ---------- */
  const SCREEN_W = 2.3;
  const SCREEN_H = 1.38;
  const U = SCREEN_W / 1024;
  const TXT_X = 60;
  const BASE1 = 302;
  const GAP = 80;
  const FONT = 66;
  const LID_H = 1.62;
  const LID_T = 0.08;
  const SCREEN_CY = 0.81;
  const SCREEN_Z = 0.025;

  /* ---------- laptop screen texture ---------- */
  const Q = 2;
  const SC_W = 1024 * Q;
  const SC_H = 640 * Q;
  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = SC_W;
  screenCanvas.height = SC_H;
  const ctx = screenCanvas.getContext("2d") as CanvasRenderingContext2D;

  (function drawScreen() {
    ctx.fillStyle = P.heroBg;
    ctx.fillRect(0, 0, SC_W, SC_H);

    ctx.strokeStyle = hexToRgba(P.accent, 0.05);
    ctx.lineWidth = Q;
    for (let y = 0; y < SC_H; y += 4 * Q) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(SC_W, y);
      ctx.stroke();
    }

    ctx.fillStyle = hexToRgba(P.heroForeground, 0.06);
    ctx.fillRect(0, 0, SC_W, 46 * Q);
    const dotColors = [P.accent, P.accentSoft, P.accentWarm];
    for (let d = 0; d < 3; d++) {
      ctx.beginPath();
      ctx.fillStyle = dotColors[d];
      ctx.arc((34 + d * 30) * Q, 23 * Q, 8 * Q, 0, Math.PI * 2);
      ctx.fill();
    }
  })();

  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  screenTexture.minFilter = THREE.LinearFilter;
  screenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  function roundRectPath(
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  /* ---------- build the laptop ---------- */
  const laptop = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0b1436"),
    metalness: 0.55,
    roughness: 0.35,
  });
  const bodyMatLight = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#141f4d"),
    metalness: 0.4,
    roughness: 0.4,
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 1.7), bodyMat);
  base.position.y = 0;
  laptop.add(base);

  const deck = new THREE.Mesh(new THREE.PlaneGeometry(2.36, 1.4), bodyMatLight);
  deck.rotation.x = -Math.PI / 2;
  deck.position.set(0, 0.061, 0.02);
  laptop.add(deck);

  const keyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#070e26"),
    metalness: 0.3,
    roughness: 0.6,
  });
  for (let r = 0; r < 4; r++) {
    const rowStrip = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.02, 0.22),
      keyMat,
    );
    rowStrip.position.set(0, 0.068, -0.5 + r * 0.28);
    laptop.add(rowStrip);
  }

  const trackpad = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 0.45),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0a1230"),
      metalness: 0.2,
      roughness: 0.5,
    }),
  );
  trackpad.rotation.x = -Math.PI / 2;
  trackpad.position.set(0, 0.069, 0.62);
  laptop.add(trackpad);

  const screenHinge = new THREE.Group();
  screenHinge.position.set(0, 0.06, -0.83);
  laptop.add(screenHinge);

  const screenBack = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, LID_H, LID_T),
    bodyMat,
  );
  screenBack.position.set(0, 0.81, -0.02);
  screenHinge.add(screenBack);

  const screenFront = new THREE.Mesh(
    new THREE.PlaneGeometry(SCREEN_W, SCREEN_H),
    new THREE.MeshBasicMaterial({
      map: screenTexture,
      color: 0x000000,
      side: THREE.DoubleSide,
      toneMapped: false,
      fog: false,
    }),
  );
  screenFront.position.set(0, SCREEN_CY, SCREEN_Z);
  screenHinge.add(screenFront);

  /* glowing underline beneath the typed text */
  const underlineCv = document.createElement("canvas");
  underlineCv.width = 760 * Q;
  underlineCv.height = 3 * Q;
  {
    const g = underlineCv.getContext("2d") as CanvasRenderingContext2D;
    const grad = g.createLinearGradient(0, 0, underlineCv.width, 0);
    grad.addColorStop(0, P.accent);
    grad.addColorStop(1, hexToRgba(P.accent, 0));
    g.fillStyle = grad;
    g.fillRect(0, 0, underlineCv.width, underlineCv.height);
  }
  const underlineTex = new THREE.CanvasTexture(underlineCv);
  underlineTex.generateMipmaps = false;
  underlineTex.minFilter = THREE.LinearFilter;
  const underline = new THREE.Mesh(
    new THREE.PlaneGeometry(760 * U, 3 * U),
    new THREE.MeshBasicMaterial({
      map: underlineTex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false,
      fog: false,
    }),
  );
  underline.position.set(
    ((60 + 380) / 1024 - 0.5) * SCREEN_W,
    SCREEN_CY + (0.5 - 421.5 / 640) * SCREEN_H,
    SCREEN_Z + 0.002,
  );
  screenHinge.add(underline);

  const LID_CLOSED = 1.48;
  const LID_OPEN = -0.22;
  screenHinge.rotation.x = LID_CLOSED;

  scene.add(laptop);
  laptop.position.set(0, -0.15, 0);
  laptop.rotation.y = 0.5;

  /* ---------- stylized hands ---------- */
  function createHand(mirror: boolean) {
    const gloveMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#17203f"),
      metalness: 0.6,
      roughness: 0.3,
      transparent: true,
    });
    const glowRingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(P.accentSoft),
      emissive: new THREE.Color(P.accent),
      emissiveIntensity: 1.4,
      metalness: 0.2,
      roughness: 0.3,
      transparent: true,
    });

    const hand = new THREE.Group();

    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.5), gloveMat);
    palm.position.set(0, 0, 0);
    hand.add(palm);

    const fingers: THREE.Group[] = [];
    for (let f = 0; f < 4; f++) {
      const finger = new THREE.Group();
      const offsetX = (-0.15 + f * 0.1) * (mirror ? -1 : 1);
      finger.position.set(offsetX, 0.02, -0.32);

      const seg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.34, 8),
        gloveMat,
      );
      seg.rotation.x = Math.PI / 2;
      seg.position.set(0, 0, -0.15);
      finger.add(seg);

      const tip = new THREE.Mesh(
        new THREE.TorusGeometry(0.05, 0.014, 8, 16),
        glowRingMat,
      );
      tip.position.set(0, 0, -0.33);
      finger.add(tip);

      hand.add(finger);
      fingers.push(finger);
    }

    const thumb = new THREE.Group();
    thumb.position.set(mirror ? 0.22 : -0.22, 0.01, -0.05);
    thumb.rotation.z = mirror ? -0.6 : 0.6;
    const thumbSeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.24, 8),
      gloveMat,
    );
    thumbSeg.rotation.x = Math.PI / 2;
    thumbSeg.position.set(0, 0, -0.1);
    thumb.add(thumbSeg);
    hand.add(thumb);

    hand.userData.fingers = fingers;
    hand.userData.matList = [gloveMat, glowRingMat];
    hand.userData.bob = false;
    return hand;
  }

  const leftHand = createHand(false);
  leftHand.position.set(-0.55, 0.13, -0.05);
  leftHand.rotation.y = 0.12;
  laptop.add(leftHand);

  const rightHand = createHand(true);
  rightHand.position.set(0.55, 0.13, -0.05);
  rightHand.rotation.y = -0.12;
  laptop.add(rightHand);

  const allHandMats = leftHand.userData.matList.concat(
    rightHand.userData.matList,
  );
  allHandMats.forEach((mt: THREE.Material) => {
    mt.opacity = 0;
  });

  const rightHandTypingPose = {
    pos: new THREE.Vector3(0.55, 0.13, -0.05),
    rot: new THREE.Euler(0, -0.12, 0),
  };

  /* the right hand grips the closed lid, rides it open, then moves to the keys */
  screenHinge.attach(rightHand);
  rightHand.position.set(0.7, 1.5, 0.18);
  rightHand.rotation.set(1.15, -0.1, 0.35);

  /* ---------- camera state ---------- */
  const wideStart = {
    pos: new THREE.Vector3(2.6, 2.3, 5.4),
    look: new THREE.Vector3(0, 0.3, -0.2),
  };
  const restView = {
    pos: new THREE.Vector3(0, 0.9, 5.2),
    look: new THREE.Vector3(0, 0.45, -0.5),
  };

  const camPos = wideStart.pos.clone();
  const camLook = wideStart.look.clone();
  const idle = { v: 0 };
  let swayOn = true;
  let handsVisible = true;
  let titleLanded = false;
  let titleDepth = 5;

  camera.position.copy(camPos);
  camera.lookAt(camLook);

  /* ---------- brand name on the back of the lid ---------- */
  function buildBrandMark() {
    const cv = document.createElement("canvas");
    cv.width = 1024;
    cv.height = 256;
    const c = cv.getContext("2d") as CanvasRenderingContext2D;
    c.font = `600 84px ${displayFamily}`;
    c.textAlign = "left";
    c.textBaseline = "middle";
    const w1 = c.measureText("Enclecta ").width;
    const w2 = c.measureText("Ventures").width;
    const x = (1024 - (w1 + w2)) / 2;
    const words = [
      { text: "Enclecta ", x, color: P.titleAccent },
      { text: "Ventures", x: x + w1, color: LINE2_COLOR },
    ];
    words.forEach((wd) => {
      c.shadowColor = hexToRgba(wd.color, 0.55);
      c.shadowBlur = 22;
      c.fillStyle = wd.color;
      c.fillText(wd.text, wd.x, 128);
    });
    c.shadowBlur = 0;
    words.forEach((wd) => {
      c.fillStyle = wd.color;
      c.fillText(wd.text, wd.x, 128);
    });

    const tex = new THREE.CanvasTexture(cv);
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    const mark = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.375), mat);
    mark.rotation.y = Math.PI;
    mark.position.set(0, LID_H / 2, -LID_T + 0.02 - 0.003);
    screenHinge.add(mark);
  }

  /* ---------- the title text: one plane per line ---------- */
  const QT = 3;
  const SOFT = 54;
  const RISE = 9;
  const textLines: any[] = [];
  let cursorSolid = false;

  const TEXT_VERT = [
    "varying vec2 vUv;",
    "void main(){",
    "  vUv = uv;",
    "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
    "}",
  ].join("\n");

  const TEXT_FRAG = [
    "uniform sampler2D map;",
    "uniform float uReveal;",
    "uniform float uSoft;",
    "uniform float uWu;",
    "uniform float uRise;",
    "varying vec2 vUv;",
    "void main(){",
    "  float x = vUv.x * uWu;",
    "  float m = clamp((uReveal - x) / uSoft, 0.0, 1.0);",
    "  m = m * m * (3.0 - 2.0 * m);",
    "  vec4 c = texture2D(map, vec2(vUv.x, vUv.y + uRise * (1.0 - m)));",
    "  gl_FragColor = vec4(c.rgb, c.a * m);",
    "}",
  ].join("\n");

  const cursorTex = (() => {
    const cv = document.createElement("canvas");
    cv.width = 48;
    cv.height = 160;
    const c = cv.getContext("2d") as CanvasRenderingContext2D;
    c.shadowColor = hexToRgba(P.accentWarm, 0.9);
    c.shadowBlur = 12;
    c.fillStyle = P.accentWarm;
    roundRectPath(c, 19.5, 24, 9, 112, 3);
    c.fill();
    return new THREE.CanvasTexture(cv);
  })();

  function drawFullLine(L: any) {
    const c = L.ctx as CanvasRenderingContext2D;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, L.cv.width, L.cv.height);
    c.setTransform(QT, 0, 0, QT, 0, 0);
    c.font = `700 ${FONT}px ${displayFamily}`;
    c.textAlign = "left";
    c.textBaseline = "alphabetic";
    c.fillStyle = L.color;
    c.shadowColor = hexToRgba(L.color, 0.35);
    c.shadowBlur = 8 * QT;
    c.fillText(L.full, L.padL, L.above);   // soft colour halo
    c.shadowBlur = 16 * QT;
    c.fillText(L.full, L.padL, L.above);   // wider bloom
    c.shadowBlur = 0;
    c.fillText(L.full, L.padL, L.above);   // crisp pass on top
    c.setTransform(1, 0, 0, 1, 0, 0);
    L.tex.needsUpdate = true;
  }

  function applyReveal(L: any) {
    const p = L.rev.p;
    const F = L.padL + p * (L.textW + SOFT);
    const C = F - SOFT * p;
    L.mesh.material.uniforms.uReveal.value = F;
    L.cursor.position.x = (C - L.Wu / 2) * U;
  }

  function buildTextPlanes() {
    const m = document
      .createElement("canvas")
      .getContext("2d") as CanvasRenderingContext2D;
    m.font = `700 ${FONT}px ${displayFamily}`;

    [SCREEN_LINE_1, SCREEN_LINE_2].forEach((txt, i) => {
      const padL = 40;
      const padR = 40;
      const above = 100;
      const below = 50;
      const w = m.measureText(txt + "\u258C").width;
      const Wu = Math.ceil(padL + w + padR);
      const Hu = above + below;

      const cv = document.createElement("canvas");
      cv.width = Math.ceil(Wu * QT);
      cv.height = Math.ceil(Hu * QT);

      const tex = new THREE.CanvasTexture(cv);
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          map: { value: tex },
          uReveal: { value: 0 },
          uSoft: { value: SOFT },
          uWu: { value: Wu },
          uRise: { value: RISE / Hu },
        },
        vertexShader: TEXT_VERT,
        fragmentShader: TEXT_FRAG,
        transparent: true,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(Wu * U, Hu * U), mat);

      const cx = TXT_X - padL + Wu / 2;
      const cy = BASE1 + i * GAP - above + Hu / 2;
      mesh.position.set(
        (cx / 1024 - 0.5) * SCREEN_W,
        SCREEN_CY + (0.5 - cy / 640) * SCREEN_H,
        SCREEN_Z + 0.004,
      );
      screenHinge.add(mesh);

      const L: any = {
        mesh,
        cv,
        ctx: cv.getContext("2d"),
        tex,
        padL,
        above,
        full: txt,
        // both title lines now share the same colour (titleAccent) — Company
        // used to be LINE2_COLOR (green) but that's kept only for the small
        // lid brand-mark elsewhere, not the main title anymore.
        color: i === 1 ? LINE2_COLOR : P.titleAccent,
        Wu,
        textW: m.measureText(txt).width,
        ox: (padL - Wu / 2) * U,
        oy: (Hu / 2 - above) * U,
        rev: { p: 0 },
        cur: { a: 0 },
      };

      const chH = FONT * 0.95 * U * (160 / 112);
      const cursor = new THREE.Mesh(
        new THREE.PlaneGeometry((chH * 48) / 160, chH),
        new THREE.MeshBasicMaterial({
          map: cursorTex,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          toneMapped: false,
          fog: false,
        }),
      );
      cursor.position.set(0, L.oy + FONT * 0.325 * U, 0.0006);
      cursor.visible = false;
      mesh.add(cursor);
      L.cursor = cursor;

      textLines.push(L);
      drawFullLine(L);
      applyReveal(L);
    });
  }

  /* Where should each title line land? Measured from the transparent <h1>. */
  function computeTitleTargets(dp: number) {
    const hr = hero.getBoundingClientRect();
    const W = hero.clientWidth;
    const H = hero.clientHeight;
    const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const upx = (2 * dp * tanH) / H;
    const k = U / upx;
    const finalFont = parseFloat(getComputedStyle(lineEls[0]).fontSize);
    const f = finalFont / (FONT * k);

    return textLines.map((L: any, i: number) => {
      const el = lineEls[i];
      const rect = el.getBoundingClientRect();
      const probe = el.querySelector(".baseline-probe") as HTMLElement;
      const baseY = probe.getBoundingClientRect().top;
      const X = rect.left - (hr.left + W / 2);
      const Y = baseY - (hr.top + H / 2);
      return { x: X * upx - f * L.ox, y: -Y * upx - f * L.oy, f };
    });
  }

  function layoutTitleInstant() {
    const t = computeTitleTargets(titleDepth);
    textLines.forEach((L: any, i: number) => {
      L.mesh.position.x = t[i].x;
      L.mesh.position.y = t[i].y;
      L.mesh.scale.setScalar(t[i].f);
    });
  }

  /* ---------- resize ---------- */
  function onResize() {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (titleLanded) layoutTitleInstant();
  }
  window.addEventListener("resize", onResize);
  const resizeObserver =
    typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
  resizeObserver?.observe(hero);

  /* ---------- typing animation ---------- */
  function typeText(onDone: () => void) {
    const L1 = textLines[0];
    const L2 = textLines[1];
    const T0 = 0.2;
    const D1 = 0.95;
    const HOP = 0.05;
    const D2 = 0.4;
    const t1 = T0;
    const t2 = T0 + D1 + HOP + 0.1;
    const tEnd = t2 + D2;

    const upd = (L: any) => () => applyReveal(L);
    const tl = track(gsap.timeline());

    tl.to(L1.cur, { a: 1, duration: 0.25, ease: "sine.out" }, 0);
    tl.to(underline.material, { opacity: 1, duration: 0.9, ease: "sine.inOut" }, t1);
    tl.call(() => {
      cursorSolid = true;
    }, undefined, t1);

    tl.to(L1.rev, { p: 1, duration: D1, ease: "none", onUpdate: upd(L1) }, t1);

    tl.to(L1.cur, { a: 0, duration: 0.12, ease: "sine.inOut" }, t1 + D1 + HOP);
    tl.to(L2.cur, { a: 1, duration: 0.12, ease: "sine.inOut" }, t1 + D1 + HOP);
    tl.to(L2.rev, { p: 1, duration: D2, ease: "none", onUpdate: upd(L2) }, t2);

    tl.call(() => {
      cursorSolid = false;
    }, undefined, tEnd);
    tl.to(L2.cur, { a: 0, duration: 0.3, ease: "sine.inOut" }, tEnd + 0.05);
    tl.call(onDone, undefined, tEnd + 0.04);
  }

  /* ---------- zoom helpers ---------- */
  function computeZoomTarget(finalPos: THREE.Vector3, finalRotY: number) {
    const sp = laptop.position.clone();
    const sr = laptop.rotation.clone();
    laptop.position.copy(finalPos);
    laptop.rotation.set(0, finalRotY, 0);
    laptop.updateMatrixWorld(true);

    const center = new THREE.Vector3();
    screenFront.getWorldPosition(center);
    const normal = new THREE.Vector3(0, 0, 1).transformDirection(
      screenFront.matrixWorld,
    );

    laptop.position.copy(sp);
    laptop.rotation.copy(sr);
    laptop.updateMatrixWorld(true);

    const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const dH = SCREEN_H / 2 / tanH;
    const dW = SCREEN_W / 2 / (tanH * camera.aspect);
    const d = Math.max(dH, dW) * 0.92;

    return { pos: center.clone().add(normal.multiplyScalar(d)), look: center };
  }

  let laptopMats: THREE.Material[] = [];
  function collectLaptopMaterials() {
    const seen: THREE.Material[] = [];
    laptop.traverse((o: any) => {
      if (o.material && seen.indexOf(o.material) === -1) {
        seen.push(o.material);
        o.material.transparent = true;
      }
    });
    laptopMats = seen;
  }

  /* ---------- the text leaves the laptop and becomes the page title ---------- */
  function handoffText() {
    camera.position.copy(camPos);
    camera.lookAt(camLook);
    camera.updateMatrixWorld(true);
    laptop.updateMatrixWorld(true);

    textLines.forEach((L: any) => {
      camera.attach(L.mesh);
      L.mesh.quaternion.set(0, 0, 0, 1);
      L.mesh.material.depthTest = false;
      L.mesh.renderOrder = 10;
    });
    titleDepth = -textLines[0].mesh.position.z;
    const targets = computeTitleTargets(titleDepth);

    const tl = track(gsap.timeline());

    tl.to(camPos, { x: restView.pos.x, y: restView.pos.y, z: restView.pos.z, duration: 1.2, ease: "power2.inOut" }, 0.1);
    tl.to(camLook, { x: restView.look.x, y: restView.look.y, z: restView.look.z, duration: 1.2, ease: "power2.inOut" }, 0.1);

    collectLaptopMaterials();
    tl.to(laptopMats, { opacity: 0, duration: 0.65, ease: "power1.inOut" }, 0.15);
    tl.call(() => {
      laptop.visible = false;
    }, undefined, 0.85);

    const FLY_START = 0.85;
    textLines.forEach((L: any, i: number) => {
      const t = targets[i];
      const at = FLY_START + i * 0.08;
      tl.to(L.mesh.position, { x: t.x, y: t.y, duration: 1.0, ease: "power3.inOut" }, at);
      tl.to(L.mesh.scale, { x: t.f, y: t.f, z: t.f, duration: 1.0, ease: "power3.inOut" }, at);
    });

    tl.call(() => {
      titleLanded = true;
      layoutTitleInstant();
      onTitleLanded?.();
    }, undefined, 1.98);
    tl.to(idle, { v: 1, duration: 2.2, ease: "sine.inOut" }, 1.98);
  }

  /* Custom ease: normal speed, slow motion as the lid's back passes the camera, then normal again. */
  function slowMoTurnEase(start: number, end: number, back: number) {
    const N = 400;
    const sigma = 0.75;
    const vmin = 0.14;
    const cum = [0];
    for (let i = 0; i < N; i++) {
      const th = start + ((end - start) * (i + 0.5)) / N;
      const near = Math.exp(-Math.pow((th - back) / sigma, 2));
      let v = 1 - (1 - vmin) * near;
      v *= Math.min(1, 0.12 + Math.min(th - start, end - th) / 0.9);
      cum.push(cum[i] + 1 / v);
    }
    const total = cum[N];
    return (p: number) => {
      if (p <= 0) return 0;
      if (p >= 1) return 1;
      const target = p * total;
      let lo = 0;
      let hi = N;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (cum[mid] <= target) lo = mid;
        else hi = mid;
      }
      return (lo + (target - cum[lo]) / (cum[hi] - cum[lo])) / N;
    };
  }

  /* ---------- opening beat: the lid is lifted, hands settle on the keys ---------- */
  function openLid(onDone: () => void) {
    const tl = track(gsap.timeline());
    tl.to(screenHinge.rotation, { x: LID_OPEN, duration: 0.75, ease: "power2.out" }, 0);

    tl.to(rightHand.userData.matList, { opacity: 1, duration: 0.3, ease: "sine.out" }, 0.08);
    tl.to(leftHand.userData.matList, { opacity: 1, duration: 0.35, ease: "sine.out" }, 0.2);
    tl.call(() => {
      leftHand.userData.bob = true;
    }, undefined, 0.6);

    tl.to((screenFront.material as THREE.MeshBasicMaterial).color, { r: 1, g: 1, b: 1, duration: 1.0, ease: "power2.inOut" }, 0.4);

    tl.call(() => {
      screenHinge.updateMatrixWorld(true);
      laptop.attach(rightHand);
      const tl2 = track(gsap.timeline());
      tl2.to(rightHand.position, { x: rightHandTypingPose.pos.x, y: rightHandTypingPose.pos.y, z: rightHandTypingPose.pos.z, duration: 0.4, ease: "power2.inOut" }, 0);
      tl2.to(rightHand.rotation, { x: rightHandTypingPose.rot.x, y: rightHandTypingPose.rot.y, z: rightHandTypingPose.rot.z, duration: 0.4, ease: "power2.inOut" }, 0);
      tl2.call(() => {
        rightHand.userData.bob = true;
      }, undefined, 0.4);
      tl2.call(onDone, undefined, 0.25);
    }, undefined, 0.65);
  }

  /* ---------- main choreography ---------- */
  function playIntro() {
    openLid(() => {
      typeText(() => {
        swayOn = false;
        laptop.rotation.z = 0;

        const finalPos = new THREE.Vector3(0, -0.05, 0.9);
        const zoom = computeZoomTarget(finalPos, 0);

        const tl = track(
          gsap.timeline({ delay: 0.1, defaults: { ease: "power2.inOut" } }),
        );

        // 1) hands pull back off the keys and vanish
        tl.to(leftHand.position, { x: -1.1, y: -0.25, z: 0.8, duration: 0.55 }, 0);
        tl.to(rightHand.position, { x: 1.1, y: -0.25, z: 0.8, duration: 0.55 }, 0);
        tl.to([leftHand.rotation, rightHand.rotation], { x: 0.3, duration: 0.55 }, 0);
        tl.to(allHandMats, { opacity: 0, duration: 0.5, ease: "power1.in" }, 0.05);
        tl.call(() => {
          handsVisible = false;
          leftHand.visible = false;
          rightHand.visible = false;
        }, undefined, 0.6);

        // 2) one continuous turn, slowed right down as the brand mark faces the camera
        const backAngle = Math.atan2(wideStart.pos.x, wideStart.pos.z) + Math.PI;
        const T_TURN = 0.25;
        const D_TURN = 2.7;
        const T_END = T_TURN + D_TURN;
        tl.to(laptop.rotation, {
          y: Math.PI * 2,
          duration: D_TURN,
          ease: slowMoTurnEase(laptop.rotation.y, Math.PI * 2, backAngle),
        }, T_TURN);
        tl.set(laptop.rotation, { y: 0 }, T_END);

        // 3) the camera glides square-on while it settles
        tl.to(camPos, { x: 0, y: 1.2, z: 5.2, duration: 0.9, ease: "power2.inOut" }, T_END - 0.6);
        tl.to(camLook, { x: 0, y: 0.35, z: 0, duration: 0.9, ease: "power2.inOut" }, T_END - 0.6);

        // 4) straight and still, the laptop moves to the front
        tl.to(laptop.position, { x: finalPos.x, y: finalPos.y, z: finalPos.z, duration: 0.85 }, T_END - 0.05);

        // 5) camera pushes in until the screen fills the page
        tl.to(camPos, { x: zoom.pos.x, y: zoom.pos.y, z: zoom.pos.z, duration: 1.0 }, T_END + 0.3);
        tl.to(camLook, { x: zoom.look.x, y: zoom.look.y, z: zoom.look.z, duration: 1.0 }, T_END + 0.3);

        // 6) text leaves the screen and becomes the page title
        tl.call(handoffText, undefined, T_END + 1.25);
      });
    });
  }

  function showFinalStatic() {
    laptop.visible = false;
    screenHinge.rotation.x = LID_OPEN;
    if (rightHand.parent !== laptop) laptop.attach(rightHand);
    rightHand.position.copy(rightHandTypingPose.pos);
    rightHand.rotation.copy(rightHandTypingPose.rot);
    camPos.copy(restView.pos);
    camLook.copy(restView.look);
    camera.position.copy(camPos);
    camera.lookAt(camLook);
    camera.updateMatrixWorld(true);
    textLines.forEach((L: any) => {
      L.rev.p = 1;
      applyReveal(L);
      screenHinge.remove(L.mesh);
      camera.add(L.mesh);
      L.mesh.position.set(0, 0, -titleDepth);
      L.mesh.quaternion.set(0, 0, 0, 1);
      L.mesh.material.depthTest = false;
      L.mesh.renderOrder = 10;
    });
    titleLanded = true;
    layoutTitleInstant();
    onTitleLanded?.();
  }

  function boot() {
    if (disposed) return;
    buildBrandMark();
    buildTextPlanes();
    if (reduceMotion || skipIntro) showFinalStatic();
    else playIntro();
  }

  const fontReady = `700 ${FONT}px ${displayFamily.split(",")[0].trim()}`;
  if (document.fonts && document.fonts.load) {
    Promise.race([
      document.fonts.load(fontReady).catch(() => undefined),
      new Promise((res) => setTimeout(res, 1500)),
    ]).then(boot, boot);
  } else {
    boot();
  }

  /* ---------- render loop ---------- */
  const clock = new THREE.Clock();
  let rafId = 0;

  function animate() {
    rafId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (handsVisible) {
      [leftHand, rightHand].forEach((hand, hi) => {
        if (!hand.userData.bob) return;
        (hand.userData.fingers as THREE.Group[]).forEach((finger, fi) => {
          const phase = t * 7 + fi * 1.3 + hi * 0.6;
          finger.rotation.x = Math.max(0, Math.sin(phase)) * 0.35;
        });
      });
    }

    const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.cos(t * 8));
    textLines.forEach((L: any) => {
      L.cursor.material.opacity = L.cur.a * (cursorSolid ? 1 : pulse);
      L.cursor.visible = L.cur.a > 0.002;
    });

    if (swayOn) laptop.rotation.z = Math.sin(t * 0.4) * 0.006;

    camera.position.set(
      camPos.x + Math.sin(t * 0.3) * 0.25 * idle.v,
      camPos.y + Math.sin(t * 0.5) * 0.06 * idle.v,
      camPos.z,
    );
    camera.lookAt(camLook);
    renderer.render(scene, camera);
  }
  animate();

  /* ---------- teardown (React strict mode / route change) ---------- */
  return {
    destroy() {
      disposed = true;
      cancelAnimationFrame(rafId);
      timelines.forEach((tl) => tl.kill());
      window.removeEventListener("resize", onResize);
      resizeObserver?.disconnect();
      scene.traverse((o: any) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((mt: any) => {
            if (mt.map) mt.map.dispose();
            mt.dispose();
          });
        }
      });
      renderer.dispose();
    },
  };
}

