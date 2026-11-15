// a small three.js copy of the book club shelf: the same camera, layout, drag, springs, turns and close-up

import * as THREE from "three";
import {
  BOOKS,
  CASE,
  buildRows,
  caseHeight,
  changePose,
  cloneRows,
  dropAt,
  entryWidth,
  findShelf,
  idsOf,
  layoutRows,
  liftOut,
  locate,
  persistPositions,
  poseIn,
  poseOfEntry,
  rng,
  stackUnder,
  surfaceY,
  type DropTarget,
  type Entry,
  type Pose,
  type RowSpec,
  type Rows,
  type Rules,
} from "../shared/shelf-model";
import { PALETTE, bookGeometry, createArt, type BookArt, type Theme } from "./book-art";
import { PAD, viewSize } from "../shared/view";

export { viewSize };
import {
  clearZ,
  easeInOut,
  easeOut,
  place,
  startChoreo,
  stepBook,
  sync,
  tweenPose,
  type BookState,
  type Tween,
} from "./motion";

const FOV = 20;
const FRONT_Z = 1.5; // the camera frames the case's front edge at this depth
const LONG_PRESS = 380;
const SLOP = { mouse: 12, touch: 8 };
const QUICK_DRAG = { ms: 280, px: 26 };
const HANDLE_TIMEOUT = 5000;
const HANDOFF = 0.72; // share of the return flight drawn over the blurred shelf

const UP = new THREE.Vector3(0, 1, 0);
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);

// books are modelled spine towards +z, cover towards +x
const Q_SPINE = new THREE.Quaternion();
const Q_FACE = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0.06, "YXZ"));
const Q_FLAT = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2));
const poseQuat = (pose: Pose) => (pose === "spine" ? Q_SPINE : pose === "face" ? Q_FACE : Q_FLAT).clone();

export type Mode = "shelf" | "detail" | "closing";

export interface EngineCallbacks {
  onHandle(handled: { id: string; pose: Pose } | null): void;
  onMode(mode: Mode): void;
  onReady(): void;
}

// a scripted carry the footer can start: the book is picked up, carried along the path and dropped
export interface Carry {
  id: string;
  path: [number, number][]; // canvas fractions after the book's own spot
  dur: number;
}

export interface EngineOptions {
  spec: RowSpec[];
  W: number;
  rules: Rules;
  interactive: boolean;
  tap: "open" | "turn" | "none"; // a tap opens the close-up like the site, turns the book, or does nothing
  turnDuration?: number; // seconds for out, turn, in
  cycle: Pose[];
  initialHandled: string | null;
}

interface Script {
  carry: Carry;
  phase: "back" | "wait" | "press" | "carry" | "rest";
  t: number;
  from: THREE.Vector2; // screen point the carry starts from
}

interface Drag {
  id: string;
  entry: Entry;
  offset: THREE.Vector2; // book centre minus pointer, so it does not jump to the finger
  target: DropTarget;
  before: Rows; // the rows before the lift, so a drag that was a click can be undone
  vx: number;
  lastX: number;
}

interface Press {
  id: string | null;
  x: number;
  y: number;
  cx0: number;
  cy0: number;
  t0: number;
  pointerId: number;
  type: string;
  timer: ReturnType<typeof setTimeout> | null;
  active: boolean;
  panning: boolean;
}

interface Outgoing {
  mesh: THREE.Mesh;
  tween: Tween;
}

export function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export class ShelfEngine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(FOV, 1, 5, 3000);
  private ray = new THREE.Raycaster();
  private furniture = new THREE.Group();
  private boardMat = new THREE.MeshLambertMaterial();
  private wallMat = new THREE.MeshLambertMaterial();
  private key = new THREE.DirectionalLight(0xffffff, 0.45 * Math.PI);
  private books = new Map<string, BookState>();
  private arts = new Map<string, Record<Theme, BookArt>>(); // both themes drawn up front, so a switch only swaps maps
  private rows: Rows;
  private rules: Rules;
  private theme: Theme;
  private size = { w: 1, h: 1 };
  private mode: Mode = "shelf";
  private heroId: string | null = null;
  private busy = false;
  private outgoing: Outgoing[] = [];
  private drag: Drag | null = null;
  private press: Press | null = null;
  private hover: string | null = null;
  private handled: string | null = null;
  private lastHandled: string | null;
  private handleTimer: ReturnType<typeof setTimeout> | null = null;
  private raf = 0;
  private last = 0;
  private time = 0;
  private dirty = true;
  private onScreen = true;
  private disposed = false;
  private pull = new THREE.Vector3();
  private abort = new AbortController();
  private observers: { disconnect(): void }[] = [];
  private script: Script | null = null;
  private moved = false; // the shelf differs from its spec after a carry
  private lastCarried: string | null = null;
  private hopping: { t: number } | null = null;
  private lastTap = -Infinity;
  private openedAt = -Infinity;
  private presented = new Map<string, Pose>(); // pose each footer-driven book shows
  private readonly shelves: number;
  private readonly caseH: number;
  private readonly reduced: boolean;

  constructor(
    private root: HTMLElement,
    private canvas: HTMLCanvasElement,
    private snap: HTMLCanvasElement,
    private cursor: HTMLElement | null,
    private opts: EngineOptions,
    private cb: EngineCallbacks,
  ) {
    this.rules = opts.rules;
    this.shelves = opts.spec.length;
    this.caseH = caseHeight(this.shelves);
    this.lastHandled = opts.initialHandled;
    this.theme = currentTheme();
    this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    r.setClearColor(0x000000, 0);
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    this.renderer = r;

    this.buildLights();
    this.buildFurniture();
    this.rows = buildRows(opts.spec, opts.W);
    for (const row of this.rows) for (const e of row) for (const id of idsOf(e)) this.addBook(id);
    this.applyTheme();

    this.resize();
    this.relayout(true);
    this.bind();
    this.emitHandle();
  }

  // compiles the shaders off the main thread where the browser allows it, then draws the first frame
  async start() {
    try {
      await this.renderer.compileAsync(this.scene, this.camera);
    } catch {
      // compiling ahead is best effort, the first render compiles anything left
    }
    if (this.disposed) return;
    this.render();
    this.warmOtherTheme();
    this.cb.onReady();
    this.invalidate();
  }

  // public api

  setRules(rules: Rules) {
    this.rules = rules;
    for (const s of this.books.values()) s.stiff = rules.springs === "two";
    this.relayout();
  }

  // the spec with one book in a given pose, solved under the given rules; the book turns only when its pose changes
  present(id: string, pose: Pose, overrides: Partial<Rules> = {}) {
    this.rules = { ...this.rules, ...overrides };
    const before = this.presented.get(id) ?? "spine";
    this.presented.set(id, pose);
    this.rows = buildRows(this.opts.spec, this.opts.W);
    if (pose !== "spine") {
      const changed = changePose(this.rows, id, pose, this.rules);
      if (changed) this.relayout(false, changed, true);
    } else {
      const loc = locate(this.rows, id)!;
      this.relayout(false, { shelf: loc.shelf, entry: this.rows[loc.shelf][loc.index] });
    }
    if (before !== pose) this.choreograph(id);
  }

  // stands a book up or lays it down, with the turn the footer picked
  turn(id: string, overrides: Partial<Rules> = {}) {
    if (this.mode !== "shelf") return;
    this.rules = { ...this.rules, ...overrides };
    const pose = poseIn(this.rows, id) === "flat" ? "spine" : "flat";
    this.setPose(id, pose);
  }

  // runs one carry, first putting the shelf back if an earlier carry moved things
  carry(carry: Carry, overrides: Partial<Rules> = {}) {
    if (this.mode !== "shelf" || this.drag) return;
    this.rules = { ...this.rules, ...overrides };
    for (const s of this.books.values()) s.stiff = this.rules.springs === "two";
    this.setCursor(0, 0, false, false);
    const back = this.moved;
    if (back) {
      this.rows = buildRows(this.opts.spec, this.opts.W);
      this.relayout();
      for (const prev of new Set([this.script?.carry.id ?? this.lastCarried, carry.id])) if (prev) this.choreograph(prev);
      this.moved = false;
    }
    this.script = { carry, phase: back ? "back" : "wait", t: 0, from: new THREE.Vector2() };
    this.invalidate();
  }

  openBook(id: string) {
    this.open(id);
  }

  // a tap at a point inside the canvas, used for a tap that landed before the engine was ready
  tapAt(x: number, y: number) {
    if (!this.opts.interactive || this.mode !== "shelf" || this.busy) return;
    this.tap(this.pick(x, y));
  }

  // moves a flat book from the spec next to a stack or onto it, or back where the spec has it
  placeByStack(id: string, stackMember: string, where: "home" | "beside" | "on") {
    if (this.mode !== "shelf" || this.drag) return;
    this.rows = buildRows(this.opts.spec, this.opts.W);
    if (where === "home") {
      this.relayout();
    } else {
      const lifted = liftOut(this.rows, id)!;
      const loc = locate(this.rows, stackMember)!;
      const stack = this.rows[loc.shelf][loc.index];
      // over the middle of a stack the book joins it, past its edge it keeps a spot of its own
      const target: DropTarget =
        where === "on"
          ? { shelf: loc.shelf, x: stack.x, stack: loc.index }
          : { shelf: loc.shelf, x: stack.x + entryWidth(stack) + 1.2 };
      const pin = dropAt(this.rows, id, lifted.entry, target);
      this.relayout(false, { shelf: target.shelf, entry: pin }, true);
    }
    this.choreograph(id);
  }

  // picks a book up and carries it to the other end of its shelf with the chosen springs, then sets it down
  hop(id: string, xs: [number, number], overrides: Partial<Rules> = {}) {
    if (this.mode !== "shelf" || this.drag || this.hopping) return;
    this.rules = { ...this.rules, ...overrides };
    const loc = locate(this.rows, id);
    const s = this.books.get(id);
    if (!loc || !s) return;
    const e = this.rows[loc.shelf][loc.index];
    const w = entryWidth(e);
    const centre = e.x + w / 2;
    const to = Math.abs(centre - xs[0]) < Math.abs(centre - xs[1]) ? xs[1] : xs[0];
    const from = this.project(s.pos);
    if (!this.startDrag(id, from.x, from.y)) return;
    const b = BOOKS[id];
    const dest = this.project(
      new THREE.Vector3(to - this.opts.W / 2, surfaceY(loc.shelf, this.shelves) + b.h / 2 + 2, clearZ(id)),
    );
    this.moveDrag(dest.x, dest.y);
    // no tilt from the jump itself, the springs carry the motion
    this.drag!.vx = 0;
    this.moveDrag(dest.x, dest.y);
    this.hopping = { t: 0 };
    this.invalidate();
  }

  reset() {
    this.closeNow();
    this.rows = buildRows(this.opts.spec, this.opts.W);
    for (const s of this.books.values()) {
      s.choreo = null;
      s.flight = null;
    }
    this.relayout();
  }

  // the pose control acts on the book last in hand
  setPoseOfHandled(pose: Pose) {
    const id = this.lastHandled;
    if (!id || this.mode !== "shelf" || this.drag) return;
    if (poseIn(this.rows, id) === pose) return;
    if (this.setPose(id, pose)) this.setHandled(id);
  }

  close() {
    const id = this.heroId;
    if (!id || this.busy || this.mode !== "detail") return;
    // a touch sends its click a moment after the tap that opened the book, that click must not close it
    if (performance.now() - this.openedAt < 500) return;
    const s = this.books.get(id)!;
    this.busy = true;
    this.setMode("closing");
    s.flight = {
      from: { pos: s.pos.clone(), quat: s.quat.clone() },
      to: () => ({ pos: s.tPos, quat: s.tQuat }),
      t: 0,
      dur: this.reduced ? 0.3 : 0.8,
      pullStart: 0,
      pullEnd: poseIn(this.rows, id) === "flat" ? 18 : 24,
      done: () => {
        s.inHand = false;
        this.heroId = null;
        this.busy = false;
        if (this.mode !== "shelf") this.setMode("shelf");
        this.updateVisibility();
        this.invalidate();
      },
    };
    this.invalidate();
  }

  // slides the current book out and the previous or next book in
  step(dir: 1 | -1) {
    const oldId = this.heroId;
    if (!oldId || this.mode !== "detail" || this.busy) return;
    const order = this.readingOrder().filter((id) => id === oldId || !this.books.get(id)!.offShelf);
    const nextId = order[(order.indexOf(oldId) + dir + order.length) % order.length];
    if (nextId === oldId) return;
    const old = this.books.get(oldId)!;
    const next = this.books.get(nextId)!;

    // the outgoing copy slides away while the real book goes back to its slot under the blur
    const copy = old.mesh.clone();
    this.scene.add(copy);
    const off = new THREE.Vector3(-dir * this.viewWidthAt(old.pos) * 0.9, 0, 0);
    const turned = (sign: number, q: THREE.Quaternion) =>
      new THREE.Quaternion().setFromAxisAngle(UP, sign * dir * 0.6).multiply(q);
    const outTween: Tween = {
      from: { pos: old.pos.clone(), quat: old.quat.clone() },
      to: () => {
        const t = this.heroTarget(oldId);
        return { pos: t.pos.add(off), quat: turned(-1, t.quat) };
      },
      t: 0,
      dur: 0.5,
      pullStart: 0,
      pullEnd: 0,
    };
    this.outgoing.push({ mesh: copy, tween: outTween });
    old.inHand = false;
    old.flight = null;
    place(old, old.tPos, old.tQuat);

    next.inHand = true;
    next.choreo = null;
    this.heroId = nextId;
    this.takeSnapshot();
    const target = this.heroTarget(nextId);
    place(next, target.pos.clone().sub(off), turned(1, target.quat));
    next.flight = {
      from: { pos: next.pos.clone(), quat: next.quat.clone() },
      to: () => this.heroTarget(nextId),
      t: 0,
      dur: 0.5,
      ease: easeOut,
      pullStart: 0,
      pullEnd: 0,
    };
    this.updateVisibility();
    this.invalidate();
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.abort.abort();
    this.observers.forEach((o) => o.disconnect());
    if (this.handleTimer) clearTimeout(this.handleTimer);
    if (this.press?.timer) clearTimeout(this.press.timer);
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) m.geometry.dispose();
    });
    for (const s of this.books.values()) (s.mesh.material as THREE.Material).dispose();
    for (const a of this.arts.values()) {
      a.light.texture.dispose();
      a.dark.texture.dispose();
    }
    this.boardMat.dispose();
    this.wallMat.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }

  // scene

  private buildLights() {
    const W = this.opts.W;
    // balanced so a face pointing at the camera shows its own colour, lambert divides by pi
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xc4c4c4, 0.65 * Math.PI));
    const center = new THREE.Vector3(0, this.caseH / 2, -CASE.depth / 2);
    const key = this.key;
    key.position.copy(center).add(new THREE.Vector3(70, 170, 460));
    key.target.position.copy(center);
    key.castShadow = true;
    // phones get a smaller shadow map, the shelf is drawn smaller there and the map costs memory and time
    const small = Math.min(window.screen.width, window.screen.height) < 600;
    key.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
    // soft contact shadows rather than hard blocks on the back wall
    key.shadow.intensity = 0.55;
    const sc = key.shadow.camera;
    const hw = W / 2 + 24;
    const hh = this.caseH / 2 + 30;
    sc.left = -hw;
    sc.right = hw;
    sc.top = hh;
    sc.bottom = -hh;
    sc.near = 300;
    sc.far = 640;
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.04;
    key.shadow.radius = 4;
    const fill = new THREE.DirectionalLight(0xffffff, 0.12 * Math.PI);
    fill.position.set(-60, 80, 400);
    this.scene.add(key, key.target, fill);
  }

  // boards, sides, top and back wall, all in skeleton tones
  private buildFurniture() {
    const { W } = this.opts;
    const { board, depth, side } = CASE;
    const H = this.caseH;
    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, cast = true) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = cast;
      m.receiveShadow = true;
      this.furniture.add(m);
    };
    const outer = W + side * 2;
    for (let r = 0; r < this.shelves; r++)
      add(new THREE.BoxGeometry(outer, board, depth), this.boardMat, 0, surfaceY(r, this.shelves) - board / 2, -depth / 2);
    add(new THREE.BoxGeometry(outer, board, depth), this.boardMat, 0, H + board / 2, -depth / 2, false);
    for (const sx of [-1, 1])
      add(new THREE.BoxGeometry(side, H + board * 2, depth), this.boardMat, sx * (W / 2 + side / 2), H / 2, -depth / 2, false);
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), this.wallMat);
    wall.position.set(0, H / 2, -depth);
    wall.receiveShadow = true;
    this.furniture.add(wall);
    this.scene.add(this.furniture);
  }

  private addBook(id: string) {
    if (this.books.has(id)) return;
    const arts = { light: createArt(id, "light"), dark: createArt(id, "dark") };
    this.arts.set(id, arts);
    const art = arts[this.theme];
    // diffuse only so a book looks the same on the shelf and in the hand from any angle
    const mesh = new THREE.Mesh(bookGeometry(id, art), new THREE.MeshLambertMaterial({ map: art.texture }));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.id = id;
    this.scene.add(mesh);
    this.books.set(id, {
      id,
      mesh,
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      quat: new THREE.Quaternion(),
      tPos: new THREE.Vector3(),
      tQuat: new THREE.Quaternion(),
      follow: false,
      stiff: this.rules.springs === "two",
      offShelf: true,
      inHand: false,
      choreo: null,
      flight: null,
    });
  }

  private applyTheme() {
    const P = PALETTE[this.theme];
    this.boardMat.color.set(P.board);
    this.wallMat.color.set(P.wall);
    for (const [id, arts] of this.arts) {
      const mat = this.books.get(id)!.mesh.material as THREE.MeshLambertMaterial;
      mat.map = arts[this.theme].texture;
    }
    this.invalidate();
  }

  // uploads the other theme's textures while the page is idle, so the first switch has nothing to upload
  private warmOtherTheme() {
    const other: Theme = this.theme === "light" ? "dark" : "light";
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    idle(() => {
      if (this.disposed) return;
      for (const arts of this.arts.values()) this.renderer.initTexture(arts[other].texture);
    });
  }

  // layout

  private dragPreview() {
    const d = this.drag;
    return d && d.target.stack === undefined ? { shelf: d.target.shelf, entry: d.entry, x: d.target.x } : undefined;
  }

  // re-solves every row, snap skips the glide, pin holds one entry and persist keeps pushed positions
  private relayout(snap = false, pin?: { shelf: number; entry: Entry }, persist = false) {
    const placed = layoutRows(this.rows, this.rules, { extra: this.dragPreview(), pin });
    if (persist) persistPositions(this.rows, placed);
    const half = this.opts.W / 2;
    placed.forEach((row, r) => {
      const y0 = surfaceY(r, this.shelves);
      for (const p of row) {
        if (p.extra) continue;
        if (p.hidden) {
          for (const id of idsOf(p.e)) {
            const s = this.books.get(id)!;
            if (!s.follow) s.offShelf = true;
          }
          continue;
        }
        this.placeEntry(p.e, p.x - half, p.w, y0, snap);
      }
    });
    this.updateVisibility();
    this.emitHandle();
    this.invalidate();
  }

  // writes a target for each book in an entry, x is the entry's world left edge
  private placeEntry(e: Entry, x: number, w: number, y0: number, snap: boolean) {
    const set = (id: string, pos: THREE.Vector3, quat: THREE.Quaternion) => {
      const s = this.books.get(id)!;
      s.tPos.copy(pos);
      s.tQuat.copy(quat);
      // a book appearing or coming back on the shelf is placed rather than flown in
      if ((snap || s.offShelf) && !s.inHand) place(s, pos, quat);
      s.offShelf = false;
    };
    if (e.kind === "book") {
      const b = BOOKS[e.id];
      const r = rng(b.id + "jit");
      if (e.pose === "spine") {
        // spines sit at slightly different depths like a real shelf
        const push = r() * 0.9;
        set(b.id, new THREE.Vector3(x + w / 2, y0 + b.h / 2, -1.2 - push - b.d / 2), Q_SPINE.clone());
      } else {
        set(b.id, new THREE.Vector3(x + w / 2, y0 + (b.h / 2) * Math.cos(0.06) + 0.05, -4.5 - b.t / 2), Q_FACE.clone());
      }
      return;
    }
    // stacks build up from ids[0] with a little seeded jitter per book
    let y = y0;
    e.ids.forEach((id, k) => {
      const b = BOOKS[id];
      const r = rng(b.id + "stack" + k);
      const jx = (r() - 0.5) * 1.4;
      const jr = (r() - 0.5) * 0.06;
      const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, jr, Math.PI / 2, "YXZ"));
      set(id, new THREE.Vector3(x + w / 2 + jx, y + b.t / 2, -1.4 - b.d / 2 - r() * 0.6), quat);
      y += b.t;
    });
  }

  private setPose(id: string, pose: Pose) {
    const changed = changePose(this.rows, id, pose, this.rules);
    if (!changed) return false;
    this.relayout(false, changed, true);
    this.choreograph(id);
    return true;
  }

  // out, turn and back in, or the straight turn the comparison shows
  private choreograph(id: string) {
    const s = this.books.get(id);
    if (!s) return;
    const dur = this.reduced ? 0.25 : (this.opts.turnDuration ?? 0.75);
    if (this.rules.turn === "direct") {
      s.choreo = null;
      s.vel.set(0, 0, 0);
      s.flight = {
        from: { pos: s.pos.clone(), quat: s.quat.clone() },
        to: () => ({ pos: s.tPos, quat: s.tQuat }),
        t: 0,
        dur,
        ease: easeInOut,
        pullStart: 0,
        pullEnd: 0,
      };
    } else {
      const loc = locate(this.rows, id);
      startChoreo(s, loc ? surfaceY(loc.shelf, this.shelves) : null, dur);
    }
    this.invalidate();
  }

  private readingOrder() {
    const order: string[] = [];
    for (const list of this.rows)
      for (const e of list) order.push(...(e.kind === "book" ? [e.id] : e.ids.slice().reverse()));
    return order;
  }

  private updateVisibility() {
    const shelf = this.mode === "shelf";
    this.furniture.visible = shelf;
    for (const s of this.books.values())
      s.mesh.visible = shelf ? !s.offShelf || s.follow || s.inHand : s.inHand;
  }

  // selection

  private setHandled(id: string | null) {
    this.handled = id;
    if (id) this.lastHandled = id;
    if (this.handleTimer) clearTimeout(this.handleTimer);
    if (id)
      this.handleTimer = setTimeout(() => {
        this.handled = this.drag || this.press ? this.handled : null;
        this.invalidate();
      }, HANDLE_TIMEOUT);
    this.emitHandle();
    this.invalidate();
  }

  private emitHandle() {
    const id = this.lastHandled;
    const pose = id ? (poseIn(this.rows, id) ?? (this.drag?.id === id ? poseOfEntry(this.drag.entry) : null)) : null;
    this.cb.onHandle(id && pose ? { id, pose } : null);
  }

  private setHover(id: string | null) {
    if (this.hover === id) return;
    this.hover = id;
    this.canvas.style.cursor = id ? "grab" : "";
    this.invalidate();
  }

  // forward nudge in cm so hovered and handled books stand out from the row
  private lift(id: string) {
    if (this.drag) return 0;
    return (this.hover === id ? 1.6 : 0) + (this.handled === id ? 0.8 : 0);
  }

  // drag

  private startDrag(id: string, px: number, py: number) {
    const before = cloneRows(this.rows);
    const lifted = liftOut(this.rows, id);
    if (!lifted) return false;
    const s = this.books.get(id)!;
    const p = this.pointOnPlane(px, py, clearZ(id));
    this.drag = {
      id,
      entry: lifted.entry,
      offset: new THREE.Vector2(s.pos.x - p.x, s.pos.y - p.y),
      target: { shelf: lifted.shelf, x: lifted.entry.x },
      before,
      vx: 0,
      lastX: p.x,
    };
    s.follow = true;
    s.stiff = this.rules.springs === "two";
    s.choreo = null;
    s.flight = null;
    this.setHover(null);
    this.canvas.style.cursor = "grabbing";
    this.setHandled(id);
    this.moveDrag(px, py);
    return true;
  }

  private moveDrag(px: number, py: number) {
    const d = this.drag;
    if (!d) return;
    const { W } = this.opts;
    const p = this.pointOnPlane(px, py, clearZ(d.id));
    const bx = THREE.MathUtils.clamp(p.x + d.offset.x, -W / 2 + 2, W / 2 - 2);
    const by = THREE.MathUtils.clamp(p.y + d.offset.y, -2, this.caseH);
    d.vx = THREE.MathUtils.lerp(d.vx, p.x - d.lastX, 0.35);
    d.lastX = p.x;

    // the shelf whose compartment centre is nearest the book
    let shelf = 0;
    let best = Infinity;
    for (let i = 0; i < this.shelves; i++) {
      const dist = Math.abs(by - (surfaceY(i, this.shelves) + CASE.compH / 2));
      if (dist < best) {
        best = dist;
        shelf = i;
      }
    }
    const rowX = bx + W / 2;
    const stack = d.entry.kind === "stack" ? stackUnder(this.rows, shelf, rowX, this.rules) : undefined;
    let x = rowX - entryWidth(d.entry) / 2;
    // a full shelf sends the book to the nearest shelf with room instead of pushing one off the end
    if (stack === undefined && this.rules.landing === "room") {
      const spot = findShelf(this.rows, d.entry, shelf, x, this.rules);
      if (spot) ({ shelf, x } = spot);
    }
    const t = d.target;
    if (t.shelf !== shelf || Math.abs(t.x - x) > 0.05 || t.stack !== stack) {
      d.target = { shelf, x, stack };
      this.relayout();
    }

    // lifted, tilted with the motion and held towards the reader
    const pose = poseOfEntry(d.entry);
    const tilt = THREE.MathUtils.clamp(-d.vx * 0.09, -0.45, 0.45) + (pose === "flat" ? 0 : -0.12);
    const s = this.books.get(d.id)!;
    s.tPos.set(bx, by, clearZ(d.id));
    s.tQuat
      .setFromAxisAngle(Z_AXIS, tilt)
      .multiply(new THREE.Quaternion().setFromAxisAngle(X_AXIS, 0.12))
      .multiply(poseQuat(pose));
    this.invalidate();
  }

  // a drag that turned out to be a click puts the book back where it was
  private cancelDrag() {
    const d = this.drag;
    if (!d) return false;
    this.rows = d.before;
    this.releaseDrag(d);
    this.relayout();
    return true;
  }

  private endDrag() {
    const d = this.drag;
    if (!d) return;
    const pin = dropAt(this.rows, d.id, d.entry, d.target);
    this.releaseDrag(d);
    this.relayout(false, { shelf: d.target.shelf, entry: pin }, true);
    this.choreograph(d.id);
    this.setHandled(d.id);
  }

  private releaseDrag(d: Drag) {
    this.books.get(d.id)!.follow = false;
    this.drag = null;
    this.canvas.style.cursor = "";
  }

  // close-up

  private open(id: string) {
    const s = this.books.get(id);
    if (this.mode !== "shelf" || this.busy || !s || s.offShelf) return;
    s.inHand = true;
    this.heroId = id;
    this.openedAt = performance.now();
    this.takeSnapshot();
    this.setMode("detail");
    this.setHover(null);
    const flat = poseIn(this.rows, id) === "flat";
    s.choreo = null;
    s.flight = {
      from: { pos: s.pos.clone(), quat: s.quat.clone() },
      to: () => this.heroTarget(id),
      t: 0,
      dur: this.reduced ? 0.25 : 0.72,
      ease: easeOut,
      pullStart: flat ? 16 : 22,
      pullEnd: 0,
    };
    this.updateVisibility();
    this.invalidate();
  }

  private closeNow() {
    if (!this.heroId) return;
    const s = this.books.get(this.heroId)!;
    s.inHand = false;
    s.flight = null;
    place(s, s.tPos, s.tQuat);
    this.heroId = null;
    this.busy = false;
    for (const o of this.outgoing) this.scene.remove(o.mesh);
    this.outgoing = [];
    this.setMode("shelf");
  }

  private setMode(mode: Mode) {
    this.mode = mode;
    this.updateVisibility();
    this.cb.onMode(mode);
  }

  // the shelf without the book in hand, drawn once and blurred behind the close-up
  private takeSnapshot() {
    for (const s of this.books.values()) s.mesh.visible = !s.offShelf && !s.inHand;
    this.furniture.visible = true;
    this.outgoing.forEach((o) => (o.mesh.visible = false));
    this.renderer.render(this.scene, this.camera);
    const ctx = this.snap.getContext("2d")!;
    this.snap.width = this.canvas.width;
    this.snap.height = this.canvas.height;
    ctx.clearRect(0, 0, this.snap.width, this.snap.height);
    ctx.drawImage(this.canvas, 0, 0);
    this.outgoing.forEach((o) => (o.mesh.visible = true));
    this.updateVisibility();
  }

  // where the close-up book floats: upper middle of the preview, turned three quarters
  private heroTarget(id: string) {
    const b = BOOKS[id];
    const { w: W, h: H } = this.size;
    const cx = W / 2;
    const cy = H * 0.34;
    const rh = H * 0.42 * 0.9;
    const rw = W * 0.5;
    const tan = Math.tan((this.camera.fov * Math.PI) / 360);
    const wEff = b.d * 0.98 + b.t * 0.24;
    const dist = Math.max((b.h * H) / (rh * 2 * tan), (wEff * H) / (rw * 2 * tan));
    const dir = this.rayAt(cx, cy).direction.clone();
    const eye = this.camera.position;
    const pos = eye.clone().addScaledVector(dir, dist / dir.dot(new THREE.Vector3(0, 0, -1)));
    const toCam = eye.clone().sub(pos);
    const sway = this.mode === "detail" && !this.reduced ? 1 : 0;
    pos.y += Math.sin(this.time * 1.1) * 0.25 * sway;
    const quat = new THREE.Quaternion()
      .setFromAxisAngle(UP, Math.atan2(toCam.x, toCam.z) + Math.sin(this.time * 0.7) * 0.05 * sway)
      .multiply(new THREE.Quaternion().setFromAxisAngle(X_AXIS, -Math.atan2(toCam.y, Math.hypot(toCam.x, toCam.z))))
      .multiply(new THREE.Quaternion().setFromAxisAngle(X_AXIS, -0.04))
      .multiply(new THREE.Quaternion().setFromAxisAngle(UP, -Math.PI / 2 + 0.27));
    return { pos, quat };
  }

  // camera

  private resize() {
    const w = Math.max(1, Math.round(this.root.clientWidth));
    const { w: viewW, h: viewH } = viewSize(this.shelves, this.opts.W);
    const h = Math.round((w * viewH) / viewW);
    if (w === this.size.w && h === this.size.h) return;
    this.size = { w, h };
    this.renderer.setSize(w, h, false);
    const cy = (this.caseH + CASE.board + PAD.top - CASE.board - PAD.bottom) / 2;
    const dist = viewH / 2 / Math.tan((FOV * Math.PI) / 360);
    this.camera.aspect = w / h;
    this.camera.position.set(0, cy, FRONT_Z + dist);
    this.camera.lookAt(0, cy, FRONT_Z);
    this.camera.near = 5;
    this.camera.far = dist + 400;
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();
    if (this.heroId && this.mode === "detail") this.takeSnapshot();
    this.dirty = true;
    this.render();
  }

  private rayAt(x: number, y: number) {
    const ndc = new THREE.Vector2((x / this.size.w) * 2 - 1, -(y / this.size.h) * 2 + 1);
    this.ray.setFromCamera(ndc, this.camera);
    return this.ray.ray;
  }

  private pointOnPlane(x: number, y: number, z: number) {
    const p = new THREE.Vector3();
    this.rayAt(x, y).intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), -z), p);
    return p;
  }

  private viewWidthAt(p: THREE.Vector3) {
    const dist = this.camera.position.z - p.z;
    return 2 * dist * Math.tan((this.camera.fov * Math.PI) / 360) * this.camera.aspect;
  }

  private pick(x: number, y: number): string | null {
    this.rayAt(x, y);
    const meshes = [...this.books.values()].filter((s) => s.mesh.visible).map((s) => s.mesh);
    const hit = this.ray.intersectObjects(meshes, false)[0];
    return hit ? (hit.object.userData.id as string) : null;
  }

  // frame loop, only runs while something moves

  private invalidate() {
    this.dirty = true;
    this.kick();
  }

  private kick() {
    if (this.raf || this.disposed || !this.onScreen) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  private loop = (now: number) => {
    this.raf = 0;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.time += dt;
    let moving = false;
    for (const s of this.books.values()) {
      if (s.inHand) {
        // idle in the hand the book follows its slot with a gentle float
        if (s.flight) stepBook(s, dt, s.tPos);
        else {
          const t = this.heroTarget(s.id);
          s.pos.lerp(t.pos, 1 - Math.exp(-10 * dt));
          s.quat.slerp(t.quat, 1 - Math.exp(-10 * dt));
          sync(s);
        }
        moving = true;
        continue;
      }
      if (s.offShelf && !s.follow) continue;
      this.pull.copy(s.tPos);
      this.pull.z += this.lift(s.id);
      if (stepBook(s, dt, this.pull)) moving = true;
    }
    for (const o of [...this.outgoing]) {
      const tw = o.tween;
      tw.t = Math.min(1, tw.t + dt / tw.dur);
      const P = tweenPose(tw, tw.t);
      o.mesh.position.copy(P.pos);
      o.mesh.quaternion.copy(P.quat);
      moving = true;
      if (tw.t >= 1) {
        this.scene.remove(o.mesh);
        this.outgoing = this.outgoing.filter((x) => x !== o);
      }
    }
    if (this.script && this.stepScript(dt)) moving = true;
    if (this.hopping) {
      this.hopping.t += dt;
      moving = true;
      if (this.hopping.t > 0.9) {
        this.hopping = null;
        this.endDrag();
      }
    }
    // the shelf takes over the return flight once the blur has cleared
    if (this.mode === "closing" && this.heroId) {
      const f = this.books.get(this.heroId)!.flight;
      if (!f || f.t >= HANDOFF) this.setMode("shelf");
    }
    if (moving || this.dirty) this.render();
    if (moving || this.mode !== "shelf" || this.press || this.script) this.kick();
  };

  private render() {
    this.dirty = false;
    this.renderer.render(this.scene, this.camera);
  }

  // the scripted carry: wait, press, carry along the path, drop, then rest with the cursor up
  private stepScript(dt: number) {
    const st = this.script!;
    const c = st.carry;
    st.t += dt;
    if (st.phase === "back" && st.t > 0.9) {
      st.phase = "wait";
      st.t = 0;
    } else if (st.phase === "wait" && st.t > 0.15) {
      const s = this.books.get(c.id)!;
      const p = this.project(s.pos);
      st.from.set(p.x, p.y);
      this.setCursor(p.x, p.y, true, false);
      st.phase = "press";
      st.t = 0;
    } else if (st.phase === "press" && st.t > 0.25) {
      this.setCursor(st.from.x, st.from.y, true, true);
      this.startDrag(c.id, st.from.x, st.from.y);
      this.moved = true;
      st.phase = "carry";
      st.t = 0;
    } else if (st.phase === "carry") {
      const k = Math.min(1, st.t / c.dur);
      const p = this.pathPoint(c.path, easeInOut(k));
      this.setCursor(p.x, p.y, true, true);
      this.moveDrag(p.x, p.y);
      if (k >= 1) {
        this.endDrag();
        this.setCursor(p.x, p.y, true, false);
        st.phase = "rest";
        st.t = 0;
      }
    } else if (st.phase === "rest" && st.t > 0.9) {
      this.setCursor(0, 0, false, false);
      this.lastCarried = c.id;
      this.script = null;
      return false;
    }
    return true;
  }

  // a point along the carry path, which starts wherever the book was picked up
  private pathPoint(path: [number, number][], k: number) {
    const pts = [
      new THREE.Vector2(this.script!.from.x, this.script!.from.y),
      ...path.map(([x, y]) => new THREE.Vector2(x * this.size.w, y * this.size.h)),
    ];
    const lens = pts.slice(1).map((p, i) => p.distanceTo(pts[i]));
    const total = lens.reduce((a, b) => a + b, 0) || 1;
    let d = k * total;
    for (let i = 0; i < lens.length; i++) {
      if (d <= lens[i] || i === lens.length - 1) return pts[i].clone().lerp(pts[i + 1], Math.min(1, d / (lens[i] || 1)));
      d -= lens[i];
    }
    return pts[pts.length - 1];
  }

  private setCursor(x: number, y: number, visible: boolean, down: boolean) {
    const c = this.cursor;
    if (!c) return;
    c.style.opacity = visible ? "1" : "0";
    c.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${down ? 0.8 : 1})`;
  }

  private project(v: THREE.Vector3) {
    const p = v.clone().project(this.camera);
    return { x: ((p.x + 1) / 2) * this.size.w, y: ((1 - p.y) / 2) * this.size.h };
  }

  // input

  private bind() {
    const opts = { signal: this.abort.signal };
    const c = this.canvas;
    c.style.touchAction = "pan-y";
    if (this.opts.interactive) this.bindPointer(c, opts);
    this.observe();
  }

  private bindPointer(c: HTMLCanvasElement, opts: { signal: AbortSignal }) {
    c.addEventListener("pointerdown", (e) => this.onDown(e), opts);
    c.addEventListener("pointermove", (e) => this.onMove(e), opts);
    c.addEventListener("pointerup", (e) => this.onUp(e, false), opts);
    c.addEventListener("pointercancel", (e) => this.onUp(e, true), opts);
    c.addEventListener("pointerleave", () => !this.press && this.setHover(null), opts);
    // some mobile browsers drop pointer events on a canvas, the click that follows a tap still arrives
    c.addEventListener(
      "click",
      (e) => {
        if (performance.now() - this.lastTap < 500) return;
        const r = this.canvas.getBoundingClientRect();
        this.tapAt(e.clientX - r.left, e.clientY - r.top);
      },
      opts,
    );
    // a carried book must not scroll the page under it
    c.addEventListener("touchmove", (e) => this.drag && e.preventDefault(), { ...opts, passive: false });
  }

  private observe() {
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(this.root);
    const io = new IntersectionObserver(([entry]) => {
      this.onScreen = entry.isIntersecting;
      if (this.onScreen) this.invalidate();
    });
    io.observe(this.root);
    const mo = new MutationObserver(() => {
      const t = currentTheme();
      if (t === this.theme) return;
      this.theme = t;
      this.applyTheme();
      const draw = () => {
        if (this.disposed) return;
        if (this.mode !== "shelf") this.takeSnapshot();
        this.render();
      };
      // a shelf on screen redraws in the same frame as the page, the others catch up a moment later
      if (this.onScreen) draw();
      else window.setTimeout(draw, 0);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    this.observers.push(ro, io, mo);
  }

  private local(e: PointerEvent) {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  private onDown(e: PointerEvent) {
    if (this.mode !== "shelf" || this.busy || e.button !== 0 || this.press) return;
    const p = this.local(e);
    const id = this.pick(p.x, p.y);
    const now = performance.now();
    const press: Press = {
      id,
      x: p.x,
      y: p.y,
      cx0: e.clientX,
      cy0: e.clientY,
      t0: now,
      pointerId: e.pointerId,
      type: e.pointerType,
      timer: null,
      active: false,
      panning: false,
    };
    this.press = press;
    if (!id) return;
    this.canvas.setPointerCapture(e.pointerId);
    // a long press picks a book up, on touch it is the only way so a swipe still scrolls the page
    press.timer = setTimeout(() => {
      if (this.press === press && !press.active && !press.panning) {
        navigator.vibrate?.(8);
        press.active = this.startDrag(id, press.x, press.y);
      }
    }, LONG_PRESS);
  }

  private onMove(e: PointerEvent) {
    const p = this.local(e);
    const d = this.press;
    if (!d || d.pointerId !== e.pointerId) {
      if (this.mode === "shelf" && !this.busy && e.pointerType === "mouse") this.setHover(this.pick(p.x, p.y));
      return;
    }
    const slop = d.type === "mouse" ? SLOP.mouse : SLOP.touch;
    if (!d.active && !d.panning && Math.hypot(p.x - d.x, p.y - d.y) > slop) {
      if (d.timer) clearTimeout(d.timer);
      // a mouse on a book drags it, a finger scrolls the page
      if (d.id && d.type === "mouse") d.active = this.startDrag(d.id, d.x, d.y);
      else d.panning = true;
    }
    d.x = d.active || d.panning ? p.x : d.x;
    d.y = d.active || d.panning ? p.y : d.y;
    if (d.active) this.moveDrag(p.x, p.y);
  }

  private onUp(e: PointerEvent, cancelled: boolean) {
    const d = this.press;
    if (!d || d.pointerId !== e.pointerId) return;
    // the click that follows this pointer up belongs to it, the fallback below must skip it
    this.lastTap = performance.now();
    if (this.canvas.hasPointerCapture(e.pointerId)) this.canvas.releasePointerCapture(e.pointerId);
    if (d.timer) clearTimeout(d.timer);
    this.press = null;
    if (d.active) {
      const quick =
        performance.now() - d.t0 < QUICK_DRAG.ms && Math.hypot(e.clientX - d.cx0, e.clientY - d.cy0) < QUICK_DRAG.px;
      // a quick short drag was a click, put the book back and treat it as a tap
      if (quick && !cancelled && this.cancelDrag()) this.tap(d.id);
      else this.endDrag();
      return;
    }
    if (d.panning || cancelled) return;
    this.tap(d.id);
  }

  private tap(id: string | null) {
    this.lastTap = performance.now();
    if (this.opts.tap === "none") return;
    if (!id) {
      this.setHandled(null);
      return;
    }
    // the book in hand turns, any other book flies out to the close-up
    if (this.opts.tap === "turn" || id === this.handled) {
      const cycle = this.opts.cycle;
      const pose = poseIn(this.rows, id) ?? "spine";
      const next = cycle[(cycle.indexOf(pose) + 1) % cycle.length] ?? "spine";
      if (!this.setPose(id, next)) this.setPose(id, "spine");
      this.setHandled(id);
      return;
    }
    this.setHandled(null);
    this.open(id);
  }
}
