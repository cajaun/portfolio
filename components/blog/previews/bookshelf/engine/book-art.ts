// skeleton art for each book: one small canvas per book with spine, cover, back and page regions

import * as THREE from "three";
import { BOOKS, type Book } from "../shared/shelf-model";

export type Theme = "light" | "dark";

// the blog's preview tokens, books step through a few skeleton shades
export const PALETTE: Record<
  Theme,
  { books: string[]; line: string[]; pages: string; pageLine: string; board: string; wall: string }
> = {
  light: {
    books: ["#ffffff", "#fafafa", "#f3f3f3", "#ececec"],
    line: ["#ebebeb", "#e6e6e6", "#dfdfdf", "#d8d8d8"],
    pages: "#f8f8f6",
    pageLine: "#ececea",
    board: "#dddddd",
    wall: "#e8e8e8",
  },
  dark: {
    books: ["#262626", "#2d2d2d", "#343434", "#3c3c3c"],
    line: ["#444444", "#4a4a4a", "#505050", "#575757"],
    pages: "#4a4a47",
    pageLine: "#41413e",
    board: "#2a2a2a",
    wall: "#141414",
  },
};

const S = 14; // canvas pixels per cm
const PAGES = 3; // cm of page texture

export interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface BookArt {
  canvas: HTMLCanvasElement;
  texture: THREE.CanvasTexture;
  size: { w: number; h: number };
  spine: Region;
  cover: Region;
  back: Region;
  pages: Region;
}

function pill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const r = Math.min(w, h) / 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function layout(b: Book) {
  const t = Math.round(b.t * S);
  const d = Math.round(b.d * S);
  const h = Math.round(b.h * S);
  const p = PAGES * S;
  return {
    size: { w: t + d * 2 + p, h },
    spine: { x: 0, y: 0, w: t, h },
    cover: { x: t, y: 0, w: d, h },
    back: { x: t + d, y: 0, w: d, h },
    pages: { x: t + d * 2, y: 0, w: p, h },
  };
}

export function drawBook(art: BookArt, b: Book, theme: Theme) {
  const P = PALETTE[theme];
  const base = P.books[b.tone];
  const line = P.line[b.tone];
  const ctx = art.canvas.getContext("2d")!;
  const { spine, cover, back, pages } = art;

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, art.size.w, art.size.h);

  // spine: a title bar and an author mark, like a skeleton line turned on its side
  ctx.fillStyle = line;
  const sw = Math.max(4, spine.w * 0.26);
  const sx = spine.x + (spine.w - sw) / 2;
  pill(ctx, sx, spine.h * 0.2, sw, spine.h * 0.42);
  pill(ctx, sx, spine.h * 0.82, sw, spine.h * 0.07);
  ctx.fillRect(spine.x + spine.w * 0.15, spine.h * 0.06, spine.w * 0.7, 2);
  ctx.fillRect(spine.x + spine.w * 0.15, spine.h * 0.94 - 2, spine.w * 0.7, 2);

  // cover: title, a subtitle, a block and a footer line, the modal skeleton on a book
  const cx = cover.x;
  pill(ctx, cx + cover.w * 0.16, cover.h * 0.12, cover.w * 0.62, cover.h * 0.05);
  pill(ctx, cx + cover.w * 0.16, cover.h * 0.21, cover.w * 0.42, cover.h * 0.028);
  ctx.beginPath();
  ctx.roundRect(cx + cover.w * 0.16, cover.h * 0.34, cover.w * 0.68, cover.h * 0.38, cover.w * 0.06);
  ctx.fill();
  pill(ctx, cx + cover.w * 0.16, cover.h * 0.82, cover.w * 0.3, cover.h * 0.028);

  // back: two faint lines
  pill(ctx, back.x + back.w * 0.2, back.h * 0.18, back.w * 0.6, back.h * 0.025);
  pill(ctx, back.x + back.w * 0.2, back.h * 0.24, back.w * 0.45, back.h * 0.025);

  // pages: off white with a few page lines
  ctx.fillStyle = P.pages;
  ctx.fillRect(pages.x, pages.y, pages.w, pages.h);
  ctx.fillStyle = P.pageLine;
  for (let i = 1; i < 9; i++) ctx.fillRect(pages.x, (pages.h * i) / 9, pages.w, 1);

  art.texture.needsUpdate = true;
}

export function createArt(id: string, theme: Theme): BookArt {
  const b = BOOKS[id];
  const L = layout(b);
  const canvas = document.createElement("canvas");
  canvas.width = L.size.w;
  canvas.height = L.size.h;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.anisotropy = 4;
  const art: BookArt = { canvas, texture, ...L };
  drawBook(art, b, theme);
  return art;
}

type V3 = [number, number, number];

// a book box with spine on +z and cover on +x, the same layout as the site's book geometry
export function bookGeometry(id: string, art: BookArt) {
  const b = BOOKS[id];
  const x = b.t / 2;
  const y = b.h / 2;
  const z = b.d / 2;
  const { w: AW, h: AH } = art.size;
  const pos: number[] = [];
  const nor: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const face = (bl: V3, br: V3, tr: V3, tl: V3, n: V3, r: Region) => {
    const i = pos.length / 3;
    const u0 = (r.x + 0.5) / AW;
    const u1 = (r.x + r.w - 0.5) / AW;
    const v0 = (r.y + r.h - 0.5) / AH; // the bottom of the art, the canvas is not flipped
    const v1 = (r.y + 0.5) / AH;
    pos.push(...bl, ...br, ...tr, ...tl);
    for (let k = 0; k < 4; k++) nor.push(...n);
    uv.push(u0, v0, u1, v0, u1, v1, u0, v1);
    idx.push(i, i + 1, i + 2, i, i + 2, i + 3);
  };
  face([-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z], [0, 0, 1], art.spine);
  face([x, -y, z], [x, -y, -z], [x, y, -z], [x, y, z], [1, 0, 0], art.cover);
  face([-x, -y, -z], [-x, -y, z], [-x, y, z], [-x, y, -z], [-1, 0, 0], art.back);
  face([x, -y, -z], [-x, -y, -z], [-x, y, -z], [x, y, -z], [0, 0, -1], art.pages);
  face([-x, y, z], [x, y, z], [x, y, -z], [-x, y, -z], [0, 1, 0], art.pages);
  face([-x, -y, -z], [x, -y, -z], [x, -y, z], [-x, -y, z], [0, -1, 0], art.pages);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
}
