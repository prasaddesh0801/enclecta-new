/* =========================================================
   TEMPLATE SHOWCASE — 3D RING SCENE (three.js r128 + gsap)

   Controls
   · mouse  : click empty space once to "steer" — then just move the
              mouse left / right and the ring follows. Click again
              (or press Esc) to stop. Press-and-drag also works.
   · touch  : drag / swipe with inertia, snaps to the nearest card
   · click / tap any card : it turns to the front and zooms to full view
   · zoomed : swipe, drag, arrow keys or the on-screen arrows change card;
              tap the card again, tap outside it, or press Esc to go back
   · keys   : ← → Home End · Enter/Space open or close · Esc
   · trackpad sideways scroll rotates the ring; vertical scroll is left
     alone so the page keeps scrolling normally

   Tuning knobs are the constants directly below.
   ========================================================= */

import * as THREE from "three";
import gsap from "gsap";
import { CARD_H, CARD_W, TEMPLATES, drawTemplate, ensureFonts } from "./template-showcase-cards";

/* ---------- tuning ---------- */
const N = TEMPLATES.length;
const STEP = (Math.PI * 2) / N; // angle between two cards
const PLANE_W = 3.2; // card width in scene units
const PLANE_H = (PLANE_W * CARD_H) / CARD_W;
const CORNER = 0.085; // card corner radius
/** Half of the angular gap between neighbouring cards (radians).
 *  Smaller = cards sit closer together. 0.012 is nearly touching. */
const HALF_GAP = 0.012;
const RADIUS = PLANE_W / 2 / Math.tan(STEP / 2 - HALF_GAP);
const FOV = 36;
const TILT = 0.08; // how far the ring leans back at rest
const CAM_Y = 1.3; // camera height at rest
const LOOK_Y = -0.8; // where the camera aims at rest
const DRIFT = 0.1; // idle spin speed (rad/s) until the visitor interacts
const HOVER_LIFT = 0.14;

export type ShowcaseParams = {
  /** WebGL canvas. Pointer and wheel input are read from it. */
  canvas: HTMLCanvasElement;
  /** Sized container that has focus for keyboard control. */
  stage: HTMLElement;
  onActive: (index: number) => void;
  onZoom: (zoomed: boolean) => void;
  onSteer: (steering: boolean) => void;
  onReady: () => void;
};

export type ShowcaseHandle = {
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  /** turn a card to the front and zoom to it (current card when omitted) */
  open: (index?: number) => void;
  close: () => void;
  setVisible: (visible: boolean) => void;
  /** re-read theme colours (fog + floor shadow) after a light/dark switch */
  refreshTheme: () => void;
  destroy: () => void;
};

/* ---------- helpers ---------- */

const mod = (n: number, m: number) => ((n % m) + m) % m;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const wrapPi = (a: number) => mod(a + Math.PI, Math.PI * 2) - Math.PI;

function roundedPlane(w: number, h: number, r: number) {
  const x = -w / 2;
  const y = -h / 2;
  const s = new THREE.Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  const g = new THREE.ShapeGeometry(s, 8);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  return g;
}

function readTheme() {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return { fog: v("--showcase-fog", "#f4f0fa"), floor: v("--showcase-floor", "rgba(38,30,90,.30)") };
}

function makeFloorTexture(color: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  if (g) {
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, "rgba(0,0,0,1)");
    gr.addColorStop(0.55, "rgba(0,0,0,.35)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 256, 256);
    g.globalCompositeOperation = "source-in"; // keep the soft mask, swap in the theme colour
    g.fillStyle = color;
    g.fillRect(0, 0, 256, 256);
  }
  return new THREE.CanvasTexture(c);
}

/* ---------- scene ---------- */

export async function createShowcaseScene(p: ShowcaseParams): Promise<ShowcaseHandle> {
  const { canvas, stage } = p;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  canvas.style.touchAction = "pan-y"; // vertical swipes still scroll the page

  const theme = readTheme();
  const scene = new THREE.Scene();
  const fog = new THREE.Fog(theme.fog, 10, 30);
  scene.fog = fog;
  const cam = new THREE.PerspectiveCamera(FOV, 1, 0.1, 80);
  const ring = new THREE.Group();
  scene.add(ring);

  const floorMat = new THREE.MeshBasicMaterial({ map: makeFloorTexture(theme.floor), transparent: true, depthWrite: false, fog: false });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(RADIUS * 2.7, RADIUS * 2.7), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -PLANE_H / 2 - 0.5;
  floor.renderOrder = -1;
  scene.add(floor);

  type CardRig = { pivot: THREE.Group; front: THREE.Mesh; mat: THREE.MeshBasicMaterial; hover: number };
  const rigs: CardRig[] = [];
  const fronts: THREE.Mesh[] = [];
  const disposables: { dispose: () => void }[] = [];
  disposables.push(floorMat, floor.geometry);

  /* ----- state ----- */
  const S = { rot: 0, target: 0, tilt: TILT, zoom: 0, zoomOn: false, steer: false };
  let dead = false;
  let visible = false;
  let raf = 0;
  let last = performance.now();
  let interacted = false; // idle drift stops for good after the first interaction
  let activeShown = -1;
  let hover = -1;
  let cursor = "";
  let baseDist = 8;
  let zoomDist = 4;
  let steerTimer = 0;
  let wheelTimer = 0;
  let lastX: number | null = null;
  const ptr = { x: 0.5, y: 0.5, cx: 0, cy: 0, inside: false, type: "mouse" };
  let drag: { id: number; sx: number; sy: number; x: number; t: number; moved: boolean; vel: number } | null = null;

  const activeAtTarget = () => mod(Math.round(-S.target / STEP), N);
  const snap = () => {
    S.target = Math.round(S.target / STEP) * STEP;
  };
  const radPerPx = () => STEP / (Math.max(240, stage.clientWidth) * (S.zoomOn ? 0.42 : 0.28));

  function goToIndex(i: number) {
    const d = wrapPi(-mod(i, N) * STEP - S.target);
    S.target += d;
  }

  function setSteer(v: boolean) {
    if (S.steer === v) return;
    S.steer = v;
    lastX = null;
    window.clearTimeout(steerTimer);
    p.onSteer(v);
  }

  function setZoom(on: boolean) {
    if (S.zoomOn === on) return;
    S.zoomOn = on;
    if (on) setSteer(false);
    gsap.to(S, { zoom: on ? 1 : 0, duration: reduced ? 0 : on ? 0.9 : 0.75, ease: "power3.inOut", overwrite: true });
    p.onZoom(on);
  }

  /* ----- layout ----- */
  function layout() {
    const w = Math.max(1, stage.clientWidth);
    const h = Math.max(1, stage.clientHeight);
    renderer.setSize(w, h, false);
    const aspect = w / h;
    cam.aspect = aspect;
    cam.updateProjectionMatrix();
    const tanH = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    // share of the stage width the front card takes when the ring is at rest
    const share = aspect > 1.5 ? 0.44 : aspect > 1.2 ? 0.56 : 0.72;
    baseDist = PLANE_W / (share * 2 * tanH * aspect);
    // zoomed: card fills ~86% of the height or ~94% of the width, whichever is tighter
    zoomDist = Math.max(PLANE_H / (2 * tanH * 0.86), PLANE_W / (2 * tanH * aspect * 0.94));
    fog.near = baseDist + RADIUS * 0.6;
    fog.far = baseDist + RADIUS * 2.6;
  }

  /* ----- picking ----- */
  const ray = new THREE.Raycaster();
  const v2 = new THREE.Vector2();
  function pick(cx: number, cy: number) {
    const r = canvas.getBoundingClientRect();
    v2.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(v2, cam);
    const hit = ray.intersectObjects(fronts, false)[0];
    return hit ? (hit.object.userData.index as number) : -1;
  }

  function tap(e: PointerEvent) {
    const hit = pick(e.clientX, e.clientY);
    if (S.zoomOn) {
      if (hit === -1 || hit === activeAtTarget()) setZoom(false);
      else goToIndex(hit);
      return;
    }
    if (hit >= 0) {
      setSteer(false);
      goToIndex(hit);
      setZoom(true);
      return;
    }
    if (e.pointerType === "mouse") setSteer(!S.steer); // touch has no "hover", so no steer mode
  }

  /* ----- input ----- */
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x: e.clientX, t: performance.now(), moved: false, vel: 0 };
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      /* pointer already gone */
    }
    interacted = true;
  };

  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    ptr.x = (e.clientX - r.left) / r.width;
    ptr.y = (e.clientY - r.top) / r.height;
    ptr.cx = e.clientX;
    ptr.cy = e.clientY;
    ptr.inside = true;
    ptr.type = e.pointerType;

    if (drag && e.pointerId === drag.id) {
      const now = performance.now();
      if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > (e.pointerType === "mouse" ? 5 : 9)) drag.moved = true;
      if (drag.moved) {
        const dx = e.clientX - drag.x;
        S.target += dx * radPerPx();
        const dt = Math.max(8, now - drag.t);
        drag.vel = drag.vel * 0.6 + ((dx * radPerPx()) / dt) * 1000 * 0.4;
      }
      drag.x = e.clientX;
      drag.t = now;
    } else if (S.steer && e.pointerType === "mouse" && !S.zoomOn) {
      if (lastX !== null) {
        S.target += (e.clientX - lastX) * radPerPx();
        window.clearTimeout(steerTimer);
        steerTimer = window.setTimeout(snap, 380); // settle on the nearest card when the mouse rests
      }
    }
    if (e.pointerType === "mouse") lastX = e.clientX;
  };

  const release = (e: PointerEvent, cancelled: boolean) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    if (d.moved) {
      const still = performance.now() - d.t > 90; // finger rested before lifting: no fling
      S.target += clamp(still ? 0 : d.vel * 0.16, -STEP * 1.4, STEP * 1.4);
      snap();
    } else if (!cancelled) {
      tap(e);
    }
  };
  const onUp = (e: PointerEvent) => release(e, false);
  const onCancel = (e: PointerEvent) => release(e, true);
  const onLeave = () => {
    ptr.inside = false;
    lastX = null;
    hover = -1;
  };
  const onEnter = () => {
    lastX = null;
  };

  const onWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical scroll belongs to the page
    e.preventDefault();
    interacted = true;
    S.target -= e.deltaX * radPerPx() * 1.1;
    window.clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(snap, 150);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.target !== stage) return; // let the on-screen buttons handle their own keys
    const k = e.key;
    if (k === "ArrowRight" || k === "ArrowLeft") {
      e.preventDefault();
      interacted = true;
      goToIndex(activeAtTarget() + (k === "ArrowRight" ? 1 : -1));
    } else if (k === "Home" || k === "End") {
      e.preventDefault();
      interacted = true;
      goToIndex(k === "Home" ? 0 : N - 1);
    } else if (k === "Enter" || k === " ") {
      e.preventDefault();
      interacted = true;
      setZoom(!S.zoomOn);
    } else if (k === "Escape") {
      if (S.zoomOn) setZoom(false);
      else setSteer(false);
    }
  };

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onCancel);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("pointerenter", onEnter);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  stage.addEventListener("keydown", onKey);
  const ro = new ResizeObserver(layout);
  ro.observe(stage);
  layout();

  /* ----- frame loop ----- */
  function frame(now: number) {
    raf = 0;
    if (dead || !visible) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (!interacted && !reduced) S.target -= dt * DRIFT;
    const follow = reduced ? 1 : 1 - Math.exp(-dt * (drag?.moved ? 24 : 8.5));
    S.rot += (S.target - S.rot) * follow;

    const z = S.zoom;
    const py = ptr.inside && ptr.type === "mouse" && !drag ? (ptr.y - 0.5) * 0.07 : 0;
    S.tilt += (TILT + py - S.tilt) * (1 - Math.exp(-dt * 5));
    ring.rotation.y = S.rot;
    ring.rotation.x = S.tilt * (1 - z);

    const restZ = RADIUS + baseDist;
    const zoomZ = RADIUS + zoomDist;
    cam.position.set(0, CAM_Y * (1 - z), restZ + (zoomZ - restZ) * z);
    cam.lookAt(0, LOOK_Y * (1 - z), 0);
    floorMat.opacity = 1 - z * 0.85;

    for (let i = 0; i < rigs.length; i++) {
      const rig = rigs[i];
      const ang = wrapPi(i * STEP + S.rot);
      const near = Math.max(0, 1 - Math.abs(ang) / (STEP * 0.7));
      rig.mat.color.setScalar(1 - z * (1 - near) * 0.62); // when zoomed, neighbours dim
      const want = hover === i && z < 0.05 ? 1 : 0;
      rig.hover += (want - rig.hover) * (1 - Math.exp(-dt * 12));
      rig.pivot.scale.setScalar(1 + rig.hover * 0.05);
      rig.pivot.position.z = rig.hover * HOVER_LIFT;
    }

    const a = activeAtTarget(); // the card the visitor is heading to
    if (a !== activeShown) {
      activeShown = a;
      p.onActive(a);
    }

    renderer.render(scene, cam);

    // hover + cursor (after render so matrices are current)
    if (ptr.inside && ptr.type === "mouse" && !drag) hover = pick(ptr.cx, ptr.cy);
    const next = drag?.moved ? "grabbing" : S.zoomOn ? (hover >= 0 && hover === activeAtTarget() ? "zoom-out" : "grab") : S.steer ? "ew-resize" : hover >= 0 ? "pointer" : "grab";
    if (next !== cursor) {
      cursor = next;
      canvas.style.cursor = next;
    }
  }

  const handle: ShowcaseHandle = {
    goTo(i) {
      interacted = true;
      goToIndex(i);
    },
    next() {
      interacted = true;
      goToIndex(activeAtTarget() + 1);
    },
    prev() {
      interacted = true;
      goToIndex(activeAtTarget() - 1);
    },
    open(i) {
      interacted = true;
      if (i !== undefined) goToIndex(i);
      setZoom(true);
      stage.focus({ preventScroll: true });
    },
    close() {
      setZoom(false);
    },
    setVisible(v) {
      visible = v;
      if (v && !raf && !dead) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    },
    refreshTheme() {
      const th = readTheme();
      fog.color.set(th.fog);
      floorMat.map?.dispose();
      floorMat.map = makeFloorTexture(th.floor);
      floorMat.needsUpdate = true;
    },
    destroy() {
      if (dead) return;
      dead = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(steerTimer);
      window.clearTimeout(wheelTimer);
      gsap.killTweensOf(S);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onCancel);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("wheel", onWheel);
      stage.removeEventListener("keydown", onKey);
      floorMat.map?.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };

  /* ----- build the cards (spread over a few ticks so the page never freezes) ----- */
  const fonts = await ensureFonts();
  const geo = roundedPlane(PLANE_W, PLANE_H, CORNER);
  // the far side of the ring is seen from behind: mirror the UVs so those cards read the right way round
  const geoBack = geo.clone();
  const uvBack = geoBack.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uvBack.count; i++) uvBack.setX(i, 1 - uvBack.getX(i));
  disposables.push(geo, geoBack);
  const maxAniso = renderer.capabilities.getMaxAnisotropy();

  for (let i = 0; i < N; i++) {
    if (dead) return handle;
    const tpl = TEMPLATES[i];
    const cv = document.createElement("canvas");
    drawTemplate(cv, tpl, fonts);
    const tex = new THREE.CanvasTexture(cv);
    tex.anisotropy = Math.min(8, maxAniso);
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    const back = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide });
    disposables.push(tex, mat, back);

    const front = new THREE.Mesh(geo, mat);
    front.userData.index = i;
    const rear = new THREE.Mesh(geoBack, back);
    const pivot = new THREE.Group();
    pivot.add(front, rear);
    const slot = new THREE.Group();
    const a = i * STEP;
    slot.position.set(Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS);
    slot.rotation.y = a;
    slot.add(pivot);
    ring.add(slot);
    rigs.push({ pivot, front, mat, hover: 0 });
    fronts.push(front);
    await new Promise((r) => setTimeout(r, 0));
  }
  if (dead) return handle;

  S.rot = reduced ? 0 : -1.5; // ring spins into place on first show
  p.onReady();
  return handle;
}
