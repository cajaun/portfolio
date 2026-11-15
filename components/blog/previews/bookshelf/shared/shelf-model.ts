// a small 2d port of the book-club shelf model, units are cm like the real bookcase

export type Pose = "spine" | "face" | "flat";
export type StandingPose = Exclude<Pose, "flat">;

export interface Book {
  id: string;
  h: number; // height
  t: number; // thickness, the spine width
  d: number; // depth, the cover width
  tone: number; // which skeleton shade it gets
}

// x is the left edge in cm from the shelf's inner left side
export type Entry =
  | { kind: "book"; id: string; pose: StandingPose; x: number }
  | { kind: "stack"; ids: string[]; x: number }; // ids[0] is the bottom book

export type Rows = Entry[][];

// the switches each preview flips, the real shelf runs with the defaults
export interface Rules {
  W: number;
  gaps: "touch" | "even";
  push: "fill" | "shift";
  anchor: "centre" | "edge";
  turn: "choreo" | "direct";
  landing: "room" | "pointer";
  springs: "two" | "one";
}

export const DEFAULT_RULES: Omit<Rules, "W"> = {
  gaps: "touch",
  push: "fill",
  anchor: "centre",
  turn: "choreo",
  landing: "room",
  springs: "two",
};

export const CASE = { compH: 30, board: 1.6, depth: 28, side: 1.4 };
export const MARGIN = 0.6;
const GAP_SPINE = 0.12;
const GAP_OTHER = 0.7;

export function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

export const BOOKS: Record<string, Book> = {};
for (let i = 0; i < 64; i++) {
  const r = rng(`book-${i}`);
  BOOKS[`b${i}`] = {
    id: `b${i}`,
    h: 19.5 + r() * 8,
    t: 3 + r() * 2.2,
    d: 14 + r() * 3.5,
    tone: i % 4,
  };
}

export const surfaceY = (r: number, shelves: number) =>
  (shelves - 1 - r) * (CASE.compH + CASE.board);
export const caseHeight = (shelves: number) =>
  shelves * CASE.compH + (shelves - 1) * CASE.board;

export function entryWidth(e: Entry): number {
  // a stack lies on its side so its width is the tallest book's height
  if (e.kind === "stack") return Math.max(...e.ids.map((id) => BOOKS[id].h)) + 0.6;
  const b = BOOKS[e.id];
  return e.pose === "face" ? b.d : b.t;
}

export function gapBetween(a: Entry | null, b: Entry | null, rules: Rules) {
  if (!a || !b) return 0;
  if (rules.gaps === "even") return GAP_OTHER;
  if (a.kind === "book" && b.kind === "book" && a.pose === "spine" && b.pose === "spine")
    return GAP_SPINE;
  return GAP_OTHER;
}

export const idsOf = (e: Entry) => (e.kind === "book" ? [e.id] : e.ids);
export const poseOfEntry = (e: Entry): Pose => (e.kind === "book" ? e.pose : "flat");
export const sortByX = (row: Entry[]) => row.sort((a, b) => a.x - b.x);

export const cloneRows = (rows: Rows): Rows =>
  rows.map((row) => row.map((e) => (e.kind === "stack" ? { ...e, ids: [...e.ids] } : { ...e })));

export interface Placed {
  e: Entry;
  x: number;
  w: number;
  hidden: boolean; // past the shelf end, kept in storage
  extra: boolean; // the book being dragged, not in the row yet
}

export interface Preview {
  entry: Entry;
  x: number;
}

// every entry wants its own x, overlaps get pushed away from the pinned entry
export function resolveRow(entries: Entry[], rules: Rules, extra?: Preview, pin?: Entry): Placed[] {
  const lo = MARGIN;
  const hi = rules.W - MARGIN;
  const items: Placed[] = entries.map((e) => ({ e, x: e.x, w: entryWidth(e), hidden: false, extra: false }));
  if (extra)
    items.push({ e: extra.entry, x: extra.x, w: entryWidth(extra.entry), hidden: false, extra: true });

  // the naive version keeps every x and only drops what runs past the end
  if (rules.push === "shift") {
    items.sort((a, b) => a.x - b.x);
    for (const it of items) it.hidden = it.x + it.w > hi + 1e-6;
    return items;
  }

  const pinned = (p: Placed) => p.extra || p.e === pin;
  items.sort((a, b) => a.x + a.w / 2 - (b.x + b.w / 2) || (pinned(a) ? -1 : pinned(b) ? 1 : 0));
  const n = items.length;
  const gap = (i: number) => (i > 0 ? gapBetween(items[i - 1].e, items[i].e, rules) : 0);
  const p = items.findIndex(pinned);
  let m = items.findIndex((it, i) => i !== p && it.x >= hi - 1e-6);
  if (m < 0) m = n;

  for (let i = Math.max(1, p + 1); i < n; i++)
    items[i].x = Math.max(items[i].x, items[i - 1].x + items[i - 1].w + gap(i));
  for (let i = p - 1; i >= 0; i--)
    items[i].x = Math.min(items[i].x, items[i + 1].x - gap(i + 1) - items[i].w);

  let k = 0;
  for (let i = 0, end = lo; i < m; i++) {
    end += (i > 0 ? gap(i) : 0) + items[i].w;
    if (end > hi + 1e-6) break;
    k = i + 1;
  }
  if (k > 0) {
    items[k - 1].x = Math.min(items[k - 1].x, hi - items[k - 1].w);
    for (let i = k - 2; i >= 0; i--)
      items[i].x = Math.min(items[i].x, items[i + 1].x - gap(i + 1) - items[i].w);
    items[0].x = Math.max(items[0].x, lo);
    for (let i = 1; i < k; i++)
      items[i].x = Math.max(items[i].x, items[i - 1].x + items[i - 1].w + gap(i));
  }
  for (let i = k; i < n; i++) items[i].hidden = true;
  return items;
}

export function locate(rows: Rows, id: string) {
  for (let shelf = 0; shelf < rows.length; shelf++)
    for (let index = 0; index < rows[shelf].length; index++) {
      const e = rows[shelf][index];
      if (e.kind === "book" && e.id === id) return { shelf, index, k: -1 };
      if (e.kind === "stack") {
        const k = e.ids.indexOf(id);
        if (k >= 0) return { shelf, index, k };
      }
    }
  return null;
}

export function poseIn(rows: Rows, id: string): Pose | null {
  const loc = locate(rows, id);
  return loc ? poseOfEntry(rows[loc.shelf][loc.index]) : null;
}

// turns a book around its centre, or its left edge for the comparison
export function changePose(rows: Rows, id: string, pose: Pose, rules: Rules): { shelf: number; entry: Entry } | null {
  const loc = locate(rows, id);
  if (!loc) return null;
  const list = rows[loc.shelf];
  const e = list[loc.index];
  const oldW = entryWidth(e);
  // the naive shift always grows from the left edge
  const fromEdge = rules.anchor === "edge" || rules.push === "shift";
  const anchor = (next: Entry) => (fromEdge ? e.x : e.x + oldW / 2 - entryWidth(next) / 2);
  let changed: Entry;
  if (e.kind === "book") {
    if (pose === "flat") changed = list[loc.index] = { kind: "stack", ids: [id], x: 0 };
    else changed = list[loc.index] = { ...e, pose };
    changed.x = anchor(changed);
  } else {
    if (pose === "flat") return null;
    if (e.ids.length === 1) {
      changed = list[loc.index] = { kind: "book", id, pose, x: 0 };
      changed.x = anchor(changed);
    } else {
      // a book taken off a stack stands up beside it
      e.ids.splice(loc.k, 1);
      changed = { kind: "book", id, pose, x: e.x + entryWidth(e) + 0.7 };
      list.splice(loc.index + 1, 0, changed);
    }
  }
  if (rules.push === "shift") {
    // everything to the right moves by the change in width, gaps and all
    const delta = entryWidth(changed) - oldW;
    for (const other of list) if (other !== changed && other.x > e.x) other.x += delta;
  }
  return { shelf: loc.shelf, entry: changed };
}

// removes a book from the rows for dragging, a book from a stack leaves alone
export function liftOut(rows: Rows, id: string): { entry: Entry; shelf: number } | null {
  const loc = locate(rows, id);
  if (!loc) return null;
  const list = rows[loc.shelf];
  const e = list[loc.index];
  let entry: Entry;
  if (e.kind === "stack") {
    e.ids.splice(loc.k, 1);
    entry = { kind: "stack", ids: [id], x: e.x };
    if (e.ids.length === 0) list.splice(loc.index, 1);
  } else {
    entry = list.splice(loc.index, 1)[0];
  }
  return { entry, shelf: loc.shelf };
}

export interface DropTarget {
  shelf: number;
  x: number;
  stack?: number;
}

export function dropAt(rows: Rows, id: string, entry: Entry, target: DropTarget): Entry {
  const list = rows[target.shelf];
  const st = target.stack !== undefined ? list[target.stack] : undefined;
  if (st && st.kind === "stack") {
    st.ids.push(id);
    return st;
  }
  entry.x = target.x;
  list.push(entry);
  return entry;
}

export function fitsAt(row: Entry[], entry: Entry, x: number, rules: Rules) {
  const before = resolveRow(row, rules).filter((p) => p.hidden).length;
  const after = resolveRow(row, rules, { entry, x });
  return (
    !after.some((p) => p.hidden && p.extra) &&
    after.filter((p) => p.hidden && !p.extra).length <= before
  );
}

export function findSpot(row: Entry[], entry: Entry, x: number, rules: Rules): number | null {
  if (fitsAt(row, entry, x, rules)) return x;
  const vis = resolveRow(row, rules).filter((p) => !p.hidden);
  const starts = [MARGIN, ...vis.map((p) => p.x + p.w + 0.8)].filter(
    (c) => c + entryWidth(entry) <= rules.W - MARGIN,
  );
  starts.sort((a, b) => Math.abs(a - x) - Math.abs(b - x));
  for (const c of starts) if (fitsAt(row, entry, c, rules)) return c;
  return null;
}

// the shelf under the pointer first, then the shelves below, then above
export function findShelf(rows: Rows, entry: Entry, shelf: number, x: number, rules: Rules) {
  const order = [shelf];
  for (let r = shelf + 1; r < rows.length; r++) order.push(r);
  for (let r = shelf - 1; r >= 0; r--) order.push(r);
  for (const r of order) {
    const fx = findSpot(rows[r], entry, x, rules);
    if (fx !== null) return { shelf: r, x: fx };
  }
  return null;
}

// index of the stack whose middle sits under x, a flat book dropped there joins it
export function stackUnder(rows: Rows, shelf: number, x: number, rules: Rules) {
  let found: number | undefined;
  for (const p of resolveRow(rows[shelf], rules)) {
    if (p.e.kind !== "stack" || p.hidden) continue;
    const inset = p.w * 0.22;
    if (x > p.x + inset && x < p.x + p.w - inset) found = rows[shelf].indexOf(p.e);
  }
  return found;
}

// writes resolved positions back so pushed books stay pushed
export function persistPositions(rows: Rows, placed: Placed[][]) {
  placed.forEach((row, r) => {
    const vis = row.filter((p) => !p.extra && !p.hidden);
    const last = vis[vis.length - 1];
    let tail = last ? last.x + last.w : 0;
    for (const p of row) {
      if (p.extra) continue;
      if (p.hidden) p.e.x = Math.max(p.e.x, (tail += 1));
      else p.e.x = p.x;
    }
    sortByX(rows[r]);
  });
}

export interface LayoutOptions {
  extra?: Preview & { shelf: number };
  pin?: { shelf: number; entry: Entry };
}

// solves every row, with the carried book's preview and a pinned entry where given
export function layoutRows(rows: Rows, rules: Rules, opts: LayoutOptions = {}) {
  return rows.map((entries, r) => {
    const extra = opts.extra?.shelf === r ? opts.extra : undefined;
    const pin = opts.pin?.shelf === r ? opts.pin.entry : undefined;
    return resolveRow(entries, rules, extra, pin);
  });
}

export type RowSpec = (string | { face: string } | { stack: string[] } | { space: number })[];

// turns a hand-made spec into positioned rows, spaces are in cm
export function buildRows(spec: RowSpec[], W: number): Rows {
  const rules: Rules = { W, ...DEFAULT_RULES };
  return spec.map((items) => {
    let x = MARGIN;
    let prev: Entry | null = null;
    const out: Entry[] = [];
    for (const it of items) {
      if (typeof it === "object" && "space" in it) {
        x += it.space;
        continue;
      }
      const e: Entry =
        typeof it === "string"
          ? { kind: "book", id: it, pose: "spine", x: 0 }
          : "face" in it
            ? { kind: "book", id: it.face, pose: "face", x: 0 }
            : { kind: "stack", ids: [...it.stack], x: 0 };
      e.x = x + gapBetween(prev, e, rules);
      x = e.x + entryWidth(e);
      prev = e;
      out.push(e);
    }
    return out;
  });
}

// a run of spine-out ids, b{from} to b{from + count - 1}
export const run = (from: number, count: number) =>
  Array.from({ length: count }, (_, i) => `b${from + i}`);
