import {
  CLIENTS,
  CONSTRUCTION_LOT,
  FREE_LOTS,
  HQ_LOT,
  TREES,
  type BuildingStyle,
  type Lot,
} from "./cityData";
import { drawText, textWidth, FONT_ASCENT, FONT_CAP } from "./font";
import { fillPoly, hash, line, sprite, type Pt, type Sprite, type Surface } from "./pixel";

/*
 * Isometric pixel-art renderer for the client city. Pure drawing code over a Surface: the
 * browser repaints it on a small canvas that CSS scales up with image-rendering: pixelated,
 * the build paints it into the Open Graph images.
 */

export const CITY_W = 320;
export const CITY_H = 256;

const OX = 160;
const OY = 92;
const GRID = 12;
const ROAD = 6;
const SIDE = 12;

/** Screen position of grid point (gx, gy) at height z. Sixths of a tile land on whole pixels. */
export function iso(gx: number, gy: number, z = 0): Pt {
  return [OX + (gx - gy) * 12, OY + (gx + gy) * 6 - z];
}

/* ── Palette ─────────────────────────────────────────────── */

const NEON = "#1AFF8C";
const NEON_DIM = "#128a55";
const GOLD = "#FFD93D";
const INK = "#0b0b14";

const G = {
  plazaA: "#23233b",
  plazaB: "#272741",
  yard: "#202030",
  grass: "#1c4633",
  grassB: "#1f4d38",
  road: "#13131d",
  curb: "#3c3c5c",
  dash: "#8f7a2a",
  dirt: "#2d2437",
  pebble: "#3d3149",
  pool: "#34314c",
  shadow: "#17172a",
  rimTop: "#4a4a72",
  sideL: "#3a2b4e",
  sideR: "#2a1f3a",
  band: "#231931",
  speck: "#4d3c66",
  glow: "#6C63FF",
};

interface Shades {
  top: string;
  left: string;
  right: string;
}

interface Palette extends Shades {
  edge: string;
  glass: string;
  lit: string;
  lit2: string;
}

const PAL: Record<"violet" | "cyan" | "rose" | "cream" | "steel" | "lilac" | "peach" | "champagne", Palette> = {
  violet: { top: "#5a52cc", left: "#3a3486", right: "#29245f", edge: "#9a93ff", glass: "#1c1942", lit: "#ffe9a8", lit2: "#c9c4ff" },
  cyan: { top: "#3aa3c7", left: "#1e6884", right: "#154a5f", edge: "#93f2ff", glass: "#10303f", lit: "#c4f7ff", lit2: "#ffe9a8" },
  rose: { top: "#a3567f", left: "#6c3456", right: "#4d243d", edge: "#ffa6d3", glass: "#2b1526", lit: "#ffd9a0", lit2: "#ffc6e4" },
  cream: { top: "#e6dfd0", left: "#bcb3a3", right: "#91897a", edge: "#fffaf0", glass: "#2b3b3a", lit: "#ffe39a", lit2: "#c3ffe0" },
  steel: { top: "#5e6579", left: "#41475b", right: "#2f3343", edge: "#9199b1", glass: "#1b1e29", lit: "#ffe9a8", lit2: "#ffd34d" },
  lilac: { top: "#8a84e8", left: "#5d57b8", right: "#443f8c", edge: "#c9c4ff", glass: "#26224f", lit: "#ffe9a8", lit2: "#c9c4ff" },
  champagne: { top: "#ead2a4", left: "#b08a55", right: "#7f6238", edge: "#fff1d0", glass: "#2e2416", lit: "#ffeec4", lit2: "#ffc6dc" },
  peach: { top: "#e7b393", left: "#b47457", right: "#87513c", edge: "#ffdcc6", glass: "#3a2420", lit: "#ffe2b8", lit2: "#ffd0dc" },
};

/* ── Geometry helpers ────────────────────────────────────── */

interface Box {
  A: Pt;
  B: Pt;
  C: Pt;
  D: Pt;
  Bg: Pt;
  Cg: Pt;
  Dg: Pt;
}

function box(gx: number, gy: number, w: number, d: number, z0: number, h: number): Box {
  return {
    A: iso(gx, gy, z0 + h),
    B: iso(gx + w, gy, z0 + h),
    C: iso(gx + w, gy + d, z0 + h),
    D: iso(gx, gy + d, z0 + h),
    Bg: iso(gx + w, gy, z0),
    Cg: iso(gx + w, gy + d, z0),
    Dg: iso(gx, gy + d, z0),
  };
}

function paintBox(s: Surface, b: Box, c: Shades) {
  fillPoly(s, [b.D, b.C, b.Cg, b.Dg], c.left);
  fillPoly(s, [b.C, b.B, b.Bg, b.Cg], c.right);
  fillPoly(s, [b.A, b.B, b.C, b.D], c.top);
}

/** Highlight the front edges: the two top edges and the vertical corner. */
function rim(s: Surface, b: Box, color: string) {
  line(s, b.D[0], b.D[1], b.C[0], b.C[1], color);
  line(s, b.C[0], b.C[1], b.B[0], b.B[1], color);
  s.fill(b.C[0], b.C[1], 1, b.Cg[1] - b.C[1], color);
}

function boxHull(b: Box): Pt[] {
  return [b.A, b.B, b.Bg, b.Cg, b.Dg, b.D];
}

/** Box drawn from a pixel origin; a and b are sixths of a tile along gx and gy. */
function prism(s: Surface, x: number, y: number, a: number, b: number, h: number, c: Shades) {
  const A: Pt = [x, y - h];
  const B: Pt = [x + 2 * a, y + a - h];
  const C: Pt = [x + 2 * a - 2 * b, y + a + b - h];
  const D: Pt = [x - 2 * b, y + b - h];
  fillPoly(s, [D, C, [C[0], C[1] + h], [D[0], D[1] + h]], c.left);
  fillPoly(s, [C, B, [B[0], B[1] + h], [C[0], C[1] + h]], c.right);
  fillPoly(s, [A, B, C, D], c.top);
}

type Face = "left" | "right";

/** Pixel columns of a vertical box face; base(k) is the first row below the face in column k. */
function faceColumns(b: Box, face: Face) {
  return face === "left"
    ? { x0: b.Dg[0], n: b.Cg[0] - b.Dg[0], base: (k: number) => b.Dg[1] + Math.ceil(k / 2) }
    : { x0: b.Cg[0], n: b.Bg[0] - b.Cg[0], base: (k: number) => b.Cg[1] - Math.ceil(k / 2) };
}

interface WindowGrid {
  colW: number;
  gap: number;
  rowH: number;
  rowGap: number;
  /** Height of the first row above the ground */
  bottom: number;
  /** Space kept free under the roof line */
  top: number;
  margin?: number;
}

/** Paint a centred grid of windows on a face; color(col, row) returns null to leave a gap. */
function windowGrid(
  s: Surface,
  b: Box,
  face: Face,
  h: number,
  g: WindowGrid,
  color: (col: number, row: number) => string | null,
) {
  const { x0, n, base } = faceColumns(b, face);
  const period = g.colW + g.gap;
  const count = Math.floor((n - 2 * (g.margin ?? 2) + g.gap) / period);
  const start = Math.floor((n - (count * period - g.gap)) / 2);
  for (let col = 0; col < count; col++) {
    for (let row = 0, v = g.bottom; v + g.rowH <= h - g.top; row++, v += g.rowH + g.rowGap) {
      const c = color(col, row);
      if (!c) continue;
      for (let i = 0; i < g.colW; i++) {
        const k = start + col * period + i;
        s.fill(x0 + k, base(k) - v - g.rowH, 1, g.rowH, c);
      }
    }
  }
}

/** Is a window lit? About 6 % of windows switch on and off every few seconds. */
function lit(seed: number, col: number, row: number, t: number, chance: number) {
  const r = hash(seed, col, row);
  if (r > 0.94) return hash(seed + col, row, Math.floor(t / 2600 + r * 9)) > 0.45;
  return r < chance;
}

function dashed(s: Surface, a: Pt, b: Pt, color: string, phase = 0) {
  let i = phase;
  const every: Surface = {
    width: s.width,
    height: s.height,
    fill(x, y, w, h, c) {
      if (i++ % 4 < 2) s.fill(x, y, w, h, c);
    },
  };
  line(every, a[0], a[1], b[0], b[1], color);
}

/** Convex hull (monotone chain) — used for the click areas. */
function convexHull(points: Pt[]): Pt[] {
  const pts = [...points].sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Pt[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Pt[] = [];
  for (const p of pts.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

/* ── Sprites ─────────────────────────────────────────────── */

const TREE: Sprite = [
  "...hhh...",
  "..hHHhg..",
  ".hHHhggg.",
  "hHhggggdd",
  "ghggggddd",
  ".gggdddd.",
  "..gddd...",
  "....t....",
  "....t....",
];
const TREE_GREEN = { H: "#7be3a4", h: "#45b878", g: "#2b8a55", d: "#1b5e3b", t: "#5a3b2e" };
const TREE_BLOSSOM = { H: "#ffe0f0", h: "#ffa6d3", g: "#d9679f", d: "#9c3f70", t: "#5a3b2e" };

const LAMP: Sprite = [".l.", "lLl", ".p.", ".p.", ".p.", ".p.", ".p.", ".p.", "ppp"];
const LAMP_PAL = { l: "#ffe9a8", L: "#ffffff", p: "#5a5a80" };

const ARROW: Sprite = ["kkkkkkk", "kyyyyyk", ".kyyyk.", "..kyk..", "...k..."];
const ARROW_PAL = { k: INK, y: GOLD };

const BILLBOARD: Sprite = [
  "ffffffffffffffffff",
  "fkkkkkkkkkkkkkkkkf",
  "fkaaaakbbbbkcccckf",
  "fkaaaakbbbbkcccckf",
  "fkkkkkkkkkkkkkkkkf",
  "fkddddkeeeekggggkf",
  "fkddddkeeeekggggkf",
  "fkkkkkkkkkkkkkkkkf",
  "ffffffffffffffffff",
];
const BILLBOARD_PAL = {
  f: "#93f2ff",
  k: "#0b1720",
  a: "#ffa6d3",
  b: "#ffd34d",
  c: "#7d75ff",
  d: "#1AFF8C",
  e: "#ff7a7a",
  g: "#00D9FF",
};

const CAMERA: Sprite = [
  "..cccc......",
  "cccccccccccc",
  "cwwccclllccc",
  "ccccclLLLlcc",
  "ccccclLgLlcc",
  "ccccclLLLlcc",
  "cccccclllccc",
  "cccccccccccc",
];

const HEART: Sprite = [
  ".hh.hh.",
  "hHhhhhh",
  "hHhhhhh",
  ".hhhhh.",
  "..hhh..",
  "...h...",
];

const FLOWER: Sprite = ["..p.p..", ".ppppp.", "ppPyPpp", ".ppppp.", "..p.p.."];

/* ── Intro: the city builds itself when it first comes into view ── */

export const INTRO_MS = 2600;

/** A moment where the construction site is finished and the cars are spread out (stills, OG). */
export const STILL_T = 5500;

function grow(intro: number, order: number) {
  const g = Math.min(1, Math.max(0, (intro - 150 - order * 190) / 650));
  return 1 - (1 - g) ** 3;
}

function grownHeight(full: number, g: number) {
  return Math.round((full * g) / 2) * 2;
}

/* ── Buildings ───────────────────────────────────────────── */

const STYLE: Record<BuildingStyle | "hq", { w: number; d: number; h: number; roof: number }> = {
  hq: { w: 2, d: 2, h: 84, roof: 24 },
  glassTower: { w: 2, d: 2, h: 62, roof: 14 },
  studio: { w: 2, d: 2, h: 34, roof: 13 },
  house: { w: 2, d: 2, h: 16, roof: 10 },
  depot: { w: 3, d: 2, h: 16, roof: 0 },
  yoga: { w: 2, d: 2, h: 22, roof: 12 },
  salon: { w: 2, d: 2, h: 22, roof: 12 },
};

function drawHQ(s: Surface, lot: Lot, h: number, full: boolean, t: number) {
  const P = PAL.violet;
  const b = box(lot.gx, lot.gy, 2, 2, 0, h);
  paintBox(s, b, P);
  const grid = { colW: 2, gap: 2, rowH: 3, rowGap: 2, bottom: 6, top: 17 };
  const win = (seed: number) => (col: number, row: number) =>
    lit(seed, col, row, t, 0.55) ? (hash(seed, col, row + 50) > 0.8 ? P.lit2 : P.lit) : P.glass;
  windowGrid(s, b, "left", h, grid, win(11));
  windowGrid(s, b, "right", h, grid, win(12));
  // lit lobby along the ground floor
  windowGrid(s, b, "left", Math.min(h, 5), { colW: 18, gap: 2, rowH: 3, rowGap: 0, bottom: 1, top: 0, margin: 3 }, () => P.lit2);
  rim(s, b, P.edge);
  if (!full) return;
  drawText(s, "HQ", b.D[0] + 7, b.D[1] + 7, NEON, 1, 0.5);
  const pent = box(lot.gx + 0.5, lot.gy + 0.5, 1, 1, h, 7);
  paintBox(s, pent, { top: P.edge, left: P.left, right: P.right });
  rim(s, pent, "#c9c4ff");
  const [ax, ay] = iso(lot.gx + 1, lot.gy + 1, h + 7);
  s.fill(ax, ay - 15, 1, 15, "#8f88e6");
  s.fill(ax - 1, ay - 9, 3, 1, "#8f88e6");
  s.fill(ax, ay - 17, 1, 2, t % 1600 < 800 ? "#ff5a6e" : "#5a2a3a");
}

function drawGlassTower(s: Surface, lot: Lot, h: number, full: boolean, t: number) {
  const P = PAL.cyan;
  const b = box(lot.gx, lot.gy, 2, 2, 0, h);
  paintBox(s, b, P);
  const grid = { colW: 5, gap: 1, rowH: 4, rowGap: 1, bottom: 3, top: 3, margin: 1 };
  const win = (seed: number, face: number) => (col: number, row: number) =>
    lit(seed, col, row, t, 0.32) ? P.lit : (col + row + face) % 4 === 0 ? "#2b7f9e" : P.glass;
  windowGrid(s, b, "left", h, grid, win(21, 0));
  windowGrid(s, b, "right", h, grid, win(22, 1));
  rim(s, b, P.edge);
  if (!full) return;
  // Rooftop billboard: a photo grid where the "picked" photo keeps moving
  const [cx, cy] = iso(lot.gx + 1, lot.gy + 1, h);
  const bx = cx - 9;
  const by = cy - 15;
  s.fill(bx + 4, by + 9, 1, 4, P.right);
  s.fill(bx + 13, by + 9, 1, 4, P.right);
  sprite(s, BILLBOARD, bx, by, BILLBOARD_PAL);
  const pick = Math.floor(t / 900) % 6;
  const tx = bx + 1 + (pick % 3) * 5;
  const ty = by + 1 + Math.floor(pick / 3) * 3;
  for (const [x, y, w, hh] of [
    [tx, ty, 6, 1],
    [tx, ty + 3, 6, 1],
    [tx, ty, 1, 4],
    [tx + 5, ty, 1, 4],
  ]) {
    s.fill(x, y, w, hh, NEON);
  }
}

function drawStudio(s: Surface, lot: Lot, h: number, full: boolean, t: number) {
  const P = PAL.rose;
  const b = box(lot.gx, lot.gy, 2, 2, 0, h);
  paintBox(s, b, P);
  windowGrid(s, b, "left", h, { colW: 8, gap: 3, rowH: 9, rowGap: 4, bottom: 4, top: 3 }, (col, row) =>
    row === 0 || lit(31, col, row, t, 0.75) ? P.lit : P.glass,
  );
  windowGrid(s, b, "right", h, { colW: 2, gap: 3, rowH: 3, rowGap: 3, bottom: 13, top: 4 }, (col, row) =>
    lit(32, col, row, t, 0.5) ? P.lit2 : P.glass,
  );
  const door = faceColumns(b, "right");
  for (let k = 10; k < 14; k++) s.fill(door.x0 + k, door.base(k) - Math.min(h, 8), 1, Math.min(h, 8), k === 10 || k === 13 ? P.edge : "#1d0f1a");
  rim(s, b, P.edge);
  if (!full) return;
  // Rooftop camera sign that fires its flash every few seconds
  const [cx, cy] = iso(lot.gx + 1, lot.gy + 1, h);
  s.fill(cx - 1, cy - 5, 1, 5, "#5d3150");
  s.fill(cx + 1, cy - 5, 1, 5, "#5d3150");
  const flash = t % 5200 < 160;
  sprite(s, CAMERA, cx - 6, cy - 13, {
    c: "#ddd6ea",
    w: flash ? "#ffffff" : "#fff3c4",
    l: "#2a2236",
    L: "#4b45c6",
    g: "#c9c4ff",
  });
  if (flash) {
    const fx = cx - 4;
    const fy = cy - 11;
    for (const [dx, dy] of [
      [-3, 0],
      [-4, 0],
      [0, -3],
      [0, -4],
      [-2, -2],
      [-3, -3],
      [2, -2],
      [3, -3],
    ]) {
      s.fill(fx + dx, fy + dy, 1, 1, "#ffffff");
    }
  }
}

function drawHouse(s: Surface, lot: Lot, h: number, full: boolean, t: number) {
  const P = PAL.cream;
  const b = box(lot.gx, lot.gy, 2, 2, 0, h);
  paintBox(s, b, P);
  const front = faceColumns(b, "left");
  // two windows and a door on the front, a window on the side
  windowGrid(s, b, "left", h, { colW: 4, gap: 10, rowH: 4, rowGap: 0, bottom: 6, top: 3, margin: 3 }, (col) =>
    lit(41, col, 0, t, 0.85) ? P.lit : P.glass,
  );
  windowGrid(s, b, "right", h, { colW: 4, gap: 6, rowH: 4, rowGap: 0, bottom: 6, top: 3, margin: 4 }, (col) =>
    lit(42, col, 0, t, 0.7) ? P.lit2 : P.glass,
  );
  for (let k = 10; k < 14; k++) {
    const dh = Math.min(h, 8);
    s.fill(front.x0 + k, front.base(k) - dh, 1, dh, k === 12 && dh > 4 ? "#d9a441" : "#6b4532");
  }
  if (h <= 0) return;
  // Pitched roof with the ridge running along gx
  const rh = full ? STYLE.house.roof : Math.round((STYLE.house.roof * h) / STYLE.house.h);
  const R1 = iso(lot.gx, lot.gy + 1, h + rh);
  const R2 = iso(lot.gx + 2, lot.gy + 1, h + rh);
  fillPoly(s, [b.A, b.B, R2, R1], "#14613f");
  fillPoly(s, [R1, R2, b.C, b.D], "#1f8a5c");
  fillPoly(s, [b.C, b.B, R2], P.right);
  line(s, R1[0], R1[1], R2[0], R2[1], "#5be3a0");
  line(s, b.D[0], b.D[1], b.C[0], b.C[1], "#0f4a30");
  line(s, b.C[0], b.C[1], R2[0], R2[1], "#0f4a30");
  if (full) {
    // round attic window in the gable
    const [gx0, gy0] = iso(lot.gx + 2, lot.gy + 1, h + 4);
    s.fill(gx0 - 1, gy0 - 1, 3, 2, P.lit);
  }
}

function drawYoga(s: Surface, lot: Lot, h: number, full: boolean, t: number) {
  const P = PAL.peach;
  const b = box(lot.gx, lot.gy, 2, 2, 0, h);
  paintBox(s, b, P);
  // The studio in front hides most of the left face: a row of small high windows there,
  // the tall practice-room windows and the door on the right face
  windowGrid(s, b, "left", h, { colW: 3, gap: 3, rowH: 3, rowGap: 0, bottom: 14, top: 4, margin: 3 }, (col) =>
    lit(61, col, 0, t, 0.7) ? P.lit2 : P.glass,
  );
  const side = faceColumns(b, "right");
  const tall = Math.min(h - 7, 11);
  for (const [k0, k1, bottom, height, glow] of [
    [3, 7, 3, tall, lit(62, 0, 0, t, 0.9)],
    [9, 13, 3, tall, lit(62, 1, 0, t, 0.9)],
    [16, 20, 0, Math.min(h, 9), false],
  ] as const) {
    if (height <= 0) continue;
    for (let k = k0; k < k1; k++) {
      const door = bottom === 0;
      const c = door ? (k === k0 || k === k1 - 1 ? P.edge : "#4a2a24") : glow ? P.lit : P.glass;
      s.fill(side.x0 + k, side.base(k) - bottom - height, 1, height, c);
    }
  }
  rim(s, b, P.edge);
  if (!full) return;
  // A mat on the roof terrace and a heart sign that slowly breathes in and out
  fillPoly(s, [iso(lot.gx + 1 / 3, lot.gy + 7 / 6, h), iso(lot.gx + 1, lot.gy + 7 / 6, h), iso(lot.gx + 1, lot.gy + 3 / 2, h), iso(lot.gx + 1 / 3, lot.gy + 3 / 2, h)], "#7d75ff");
  const [cx, cy] = iso(lot.gx + 4 / 3, lot.gy + 2 / 3, h);
  s.fill(cx - 2, cy - 4, 1, 4, P.right);
  s.fill(cx + 2, cy - 4, 1, 4, P.right);
  const inhale = t % 4800 < 2400;
  sprite(s, HEART, cx - 3, cy - 10, inhale ? { h: "#ff6f9f", H: "#ffd6e6" } : { h: "#b8466f", H: "#ff8fb8" });
}

function drawSalon(s: Surface, lot: Lot, h: number, full: boolean, t: number) {
  const P = PAL.champagne;
  const b = box(lot.gx, lot.gy, 2, 2, 0, h);
  paintBox(s, b, P);
  // Framed shop window under a striped awning on the front, salon rooms upstairs
  windowGrid(s, b, "left", Math.min(h, 10), { colW: 18, gap: 2, rowH: 9, rowGap: 0, bottom: 0, top: 0, margin: 3 }, () => "#3b2a18");
  windowGrid(s, b, "left", Math.min(h, 10), { colW: 16, gap: 2, rowH: 7, rowGap: 0, bottom: 1, top: 0, margin: 4 }, () => P.lit);
  windowGrid(s, b, "left", h, { colW: 3, gap: 4, rowH: 4, rowGap: 0, bottom: 15, top: 3, margin: 4 }, (col) =>
    lit(71, col, 0, t, 0.8) ? P.lit2 : P.glass,
  );
  const front = faceColumns(b, "left");
  if (h >= 13) {
    for (let k = 1; k < front.n - 1; k++) {
      s.fill(front.x0 + k, front.base(k) - 13, 1, 3, k % 4 < 2 ? "#e0a93c" : "#fff4dc");
      s.fill(front.x0 + k, front.base(k) - 10, 1, 1, "#5a4024");
    }
  }
  windowGrid(s, b, "right", h, { colW: 3, gap: 4, rowH: 4, rowGap: 0, bottom: 15, top: 3, margin: 4 }, (col) =>
    lit(72, col, 0, t, 0.7) ? P.lit : P.glass,
  );
  const side = faceColumns(b, "right");
  for (let k = 9; k < 13; k++) s.fill(side.x0 + k, side.base(k) - Math.min(h, 9), 1, Math.min(h, 9), k === 9 || k === 12 ? "#d9a441" : "#3b2a18");
  rim(s, b, P.edge);
  if (!full) return;
  // Rooftop spring flower that sparkles now and then
  const [cx, cy] = iso(lot.gx + 1, lot.gy + 1, h);
  s.fill(cx, cy - 4, 1, 4, "#5f7a3a");
  sprite(s, FLOWER, cx - 3, cy - 9, { p: "#ffa6d3", P: "#ffd6e6", y: GOLD });
  if (t % 3600 < 240) {
    const [gx0, gy0] = [cx + 4, cy - 11];
    for (const [dx, dy] of [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]) s.fill(gx0 + dx, gy0 + dy, 1, 1, "#ffffff");
  }
}

function drawDepot(s: Surface, lot: Lot, h: number, full: boolean, t: number) {
  const P = PAL.steel;
  const b = box(lot.gx, lot.gy, 3, 2, 0, h);
  paintBox(s, b, P);
  // corrugated roof
  for (let i = 1; i < 9; i++) {
    const a = iso(lot.gx + i / 3, lot.gy, h);
    const c = iso(lot.gx + i / 3, lot.gy + 2, h);
    line(s, a[0], a[1], c[0], c[1], "#4f5568");
  }
  // two roller doors with slats on the long face, hazard band above them
  const doors = { colW: 11, gap: 6, rowH: 10, rowGap: 0, bottom: 0, top: 0, margin: 4 };
  windowGrid(s, b, "left", h, doors, () => "#9aa1b8");
  windowGrid(s, b, "left", h, { ...doors, rowH: 1, rowGap: 2, bottom: 2, top: Math.max(0, h - 10) }, () => "#646b82");
  const face = faceColumns(b, "left");
  if (h >= 13) {
    for (let k = 1; k < face.n - 1; k++) {
      s.fill(face.x0 + k, face.base(k) - 13, 1, 2, Math.floor(k / 2) % 2 ? GOLD : INK);
    }
  }
  windowGrid(s, b, "right", h, { colW: 2, gap: 2, rowH: 3, rowGap: 2, bottom: 5, top: 3 }, (col, row) =>
    lit(51, col, row, t, 0.55) ? P.lit : P.glass,
  );
  rim(s, b, P.edge);
  if (!full) return;
  // Truck backed up to the left door
  const [tx, ty] = iso(lot.gx + 1 / 6, lot.gy + 13 / 6);
  prism(s, tx, ty, 6, 3, 7, { top: "#f4f2fa", left: "#cfcbe0", right: "#9d98b4" });
  const [kx, ky] = iso(lot.gx + 7 / 6, lot.gy + 13 / 6);
  prism(s, kx, ky, 3, 3, 6, { top: "#ffe27a", left: "#f2c230", right: "#b88e1c" });
  s.fill(kx + 1, ky - 3, 3, 2, "#2b2b45");
}

/** Where the tower crane stands, relative to the depot lot. */
const CRANE = { gx: 3.5, gy: 1.5 };

/** Tower crane next to the depot — nosekrst.sk lifts heavy things for a living. */
function drawCrane(s: Surface, lot: Lot, full: boolean, t: number) {
  if (!full) return;
  const [mx, base] = iso(lot.gx + CRANE.gx, lot.gy + CRANE.gy);
  const top = base - 64;
  prism(s, mx - 0, base - 2, 2, 2, 3, { top: "#8a8aa6", left: "#626280", right: "#4a4a63" });
  for (let y = top; y < base - 3; y++) {
    const i = y - top;
    s.fill(mx - 1, y, 1, 1, GOLD);
    s.fill(mx + 1, y, 1, 1, "#c99a1c");
    if (i % 4 === 0) s.fill(mx - 1, y, 3, 1, GOLD);
    else if (i % 4 === 2) s.fill(mx, y, 1, 1, "#e0b22a");
  }
  // jib towards -gx over the depot roof, counter-jib behind
  const tip: Pt = [mx - 42, top - 21];
  line(s, mx, top, tip[0], tip[1], GOLD);
  line(s, mx, top + 3, tip[0], tip[1] + 3, "#c99a1c");
  for (let x = mx - 4; x > tip[0]; x -= 4) {
    const y = top + Math.round((x - mx) / 2);
    s.fill(x, y, 1, 4, "#c99a1c");
  }
  line(s, mx, top, mx + 12, top + 6, GOLD);
  s.fill(mx + 9, top + 4, 5, 5, "#8a8aa6");
  s.fill(mx - 2, top - 4, 4, 4, GOLD);
  s.fill(mx - 1, top - 3, 2, 2, "#2b2b45");
  s.fill(tip[0], tip[1] - 2, 1, 2, t % 1400 < 700 ? "#ff5a6e" : "#5a2a3a");
  // trolley and load drift back and forth along the jib
  const u = 14 + Math.round(((Math.sin(t / 2600) + 1) / 2) * 20);
  const px0 = mx - u;
  const py0 = top + 3 - Math.round(u / 2);
  const drop = 16 + Math.round(((Math.sin(t / 1900) + 1) / 2) * 8);
  s.fill(px0 - 1, py0, 3, 1, "#e6e6f0");
  s.fill(px0, py0 + 1, 1, drop, "#9a9ab8");
  prism(s, px0 + 2, py0 + drop + 1, 2, 3, 4, { top: "#ff9a5a", left: "#e0662c", right: "#a8481c" });
}

/* ── Construction site: a design that sketches, paints and finishes itself ── */

export const BUILD_CYCLE = 7200;
export type BuildPhase = "skeleton" | "painting" | "finished";

export function constructionPhase(t: number): BuildPhase {
  const p = (t % BUILD_CYCLE) / BUILD_CYCLE;
  return p < 0.25 ? "skeleton" : p < 0.6 ? "painting" : "finished";
}

const CONSTRUCTION_H = 40;

function drawConstruction(s: Surface, lot: Lot, t: number) {
  const P = PAL.lilac;
  const p = (t % BUILD_CYCLE) / BUILD_CYCLE;
  const wire = box(lot.gx, lot.gy, 2, 2, 0, CONSTRUCTION_H);
  let h = 0;
  if (p >= 0.25 && p < 0.6) h = Math.ceil(((p - 0.25) / 0.35) * 8) * 5;
  else if (p >= 0.6 && p < 0.94) h = CONSTRUCTION_H;
  else if (p >= 0.94) h = Math.round((CONSTRUCTION_H * (1 - (p - 0.94) / 0.06)) / 5) * 5;
  if (h > 0) {
    const b = box(lot.gx, lot.gy, 2, 2, 0, h);
    paintBox(s, b, P);
    const shown = p >= 0.6 ? Math.min(1, (p - 0.6) / 0.18) : 0;
    const grid = { colW: 3, gap: 2, rowH: 3, rowGap: 2, bottom: 4, top: 3 };
    windowGrid(s, b, "left", h, grid, (col, row) => (hash(61, col, row) < shown ? P.lit : P.glass));
    windowGrid(s, b, "right", h, grid, (col, row) => (hash(62, col, row) < shown ? P.lit2 : P.glass));
    rim(s, b, P.edge);
    if (p >= 0.6 && p < 0.94) {
      // finished: a little flag on the roof
      const [fx, fy] = iso(lot.gx + 1, lot.gy + 1, h);
      s.fill(fx, fy - 9, 1, 9, "#e6e6f0");
      s.fill(fx + 1, fy - 9, 4, 3, NEON);
    }
  }
  if (p < 0.6) {
    // skeleton: the wireframe draws itself edge by edge, then stays as scaffolding
    const edges: [Pt, Pt][] = [
      [wire.Dg, wire.Cg],
      [wire.Cg, wire.Bg],
      [wire.Dg, wire.D],
      [wire.Cg, wire.C],
      [wire.Bg, wire.B],
      [wire.D, wire.C],
      [wire.C, wire.B],
      [wire.B, wire.A],
      [wire.A, wire.D],
    ];
    const count = p < 0.25 ? Math.ceil((p / 0.25) * edges.length) : edges.length;
    const color = p < 0.25 ? "#b8b2ff" : "#7d75ff";
    for (let i = 0; i < count; i++) dashed(s, edges[i][0], edges[i][1], color);
  }
  // "24H" board at the left corner
  const [sx, sy] = iso(lot.gx, lot.gy + 2);
  const w = textWidth("24H") + 4;
  s.fill(sx - 1, sy - 6, 1, 6, "#8a8aa6");
  s.fill(sx - Math.floor(w / 2) - 1, sy - 18, w + 2, 12, GOLD);
  s.fill(sx - Math.floor(w / 2), sy - 17, w, 10, INK);
  drawText(s, "24H", sx - Math.floor(w / 2) + 2, sy - 15, GOLD);
}

/* ── Free lots ───────────────────────────────────────────── */

function lotDiamond(lot: Lot): Pt[] {
  return [iso(lot.gx, lot.gy), iso(lot.gx + 2, lot.gy), iso(lot.gx + 2, lot.gy + 2), iso(lot.gx, lot.gy + 2)];
}

function drawLotOutline(s: Surface, lot: Lot, t: number, active: boolean) {
  const [a, b, c, d] = lotDiamond(lot);
  const phase = Math.floor(t / 180);
  const color = active ? NEON : NEON_DIM;
  dashed(s, a, b, color, phase);
  dashed(s, b, c, color, phase);
  dashed(s, d, c, color, phase + 2);
  dashed(s, a, d, color, phase + 2);
}

const SIGN_TEXT = "VOĽNÉ";

function signBox(lot: Lot) {
  const [cx, cy] = iso(lot.gx + 1, lot.gy + 1);
  const w = textWidth(SIGN_TEXT) + 6;
  const h = FONT_CAP + FONT_ASCENT + 5;
  return { x: cx - Math.floor(w / 2), y: cy - 6 - h, w, h, cx, cy };
}

function drawLotSign(s: Surface, lot: Lot, active: boolean, t: number) {
  const { x, y, w, h, cx, cy } = signBox(lot);
  s.fill(cx, cy - 6, 1, 6, "#8a8aa6");
  s.fill(x, y, w, h, active ? NEON : NEON_DIM);
  s.fill(x + 1, y + 1, w - 2, h - 2, INK);
  drawText(s, SIGN_TEXT, x + 3, y + 2 + FONT_ASCENT, active || t % 2400 < 1800 ? NEON : NEON_DIM);
}

/** Wireframe preview of "your building" while a free lot is hovered. */
function drawGhost(s: Surface, lot: Lot, t: number) {
  if (t % 900 > 650) return;
  const b = box(lot.gx + 0.25, lot.gy + 0.25, 1.5, 1.5, 0, 30);
  for (const [p, q] of [
    [b.Dg, b.Cg],
    [b.Cg, b.Bg],
    [b.Dg, b.D],
    [b.Cg, b.C],
    [b.Bg, b.B],
    [b.D, b.C],
    [b.C, b.B],
    [b.B, b.A],
    [b.A, b.D],
  ] as const) {
    dashed(s, p, q, NEON, Math.floor(t / 120));
  }
}

/* ── Decor ───────────────────────────────────────────────── */

const LAMPS: readonly Lot[] = [
  { gx: 3.5, gy: 5 + 5 / 6 },
  { gx: 9.5, gy: 5 + 5 / 6 },
  { gx: 4.5, gy: 7 + 1 / 6 },
  { gx: 9.5, gy: 7 + 1 / 6 },
  { gx: 5 + 5 / 6, gy: 0.5 },
  { gx: 5 + 5 / 6, gy: 3.5 },
  { gx: 5 + 5 / 6, gy: 9.5 },
  { gx: 7 + 1 / 6, gy: 3.5 },
  { gx: 7 + 1 / 6, gy: 9.5 },
];

function drawTree(s: Surface, lot: Lot) {
  const [x, y] = iso(lot.gx + 0.5, lot.gy + 0.5);
  const blossom = hash(lot.gx, lot.gy, 7) > 0.72;
  sprite(s, TREE, x - 4, y - 8, blossom ? TREE_BLOSSOM : TREE_GREEN);
}

function drawLamp(s: Surface, lot: Lot) {
  const [x, y] = iso(lot.gx, lot.gy);
  sprite(s, LAMP, x - 1, y - 8, LAMP_PAL);
}

/* ── Cars ────────────────────────────────────────────────── */

interface Car {
  road: "x" | "y";
  /** Lane offset across the road, in sixths of a tile */
  lane: number;
  dir: 1 | -1;
  speed: number;
  offset: number;
  paint: Shades;
}

const CARS: readonly Car[] = [
  { road: "x", lane: 3, dir: 1, speed: 0.9, offset: 0, paint: { top: "#ff9a9a", left: "#e05252", right: "#a83b3b" } },
  { road: "x", lane: 1, dir: -1, speed: 0.7, offset: 7, paint: { top: "#ffffff", left: "#d8d6e4", right: "#a6a3b8" } },
  { road: "y", lane: 1, dir: 1, speed: 0.8, offset: 3, paint: { top: "#ffe27a", left: "#f2c230", right: "#b88e1c" } },
  { road: "y", lane: 3, dir: -1, speed: 1, offset: 10, paint: { top: "#8ff2ff", left: "#18c2e6", right: "#118aa6" } },
];

const CABIN = { left: "#2b2b45", right: "#22223a" };

function carObjects(t: number): CityObject[] {
  const out: CityObject[] = [];
  for (const car of CARS) {
    const run = (((t / 1000) * car.speed + car.offset) % 16) - 2;
    const pos = car.dir === 1 ? run : GRID - 0.5 - run;
    if (pos < 0 || pos > GRID - 0.5) continue;
    const along = Math.round(pos * 6);
    const across = ROAD * 6 + car.lane;
    const [gxU, gyU] = car.road === "x" ? [along, across] : [across, along];
    const [x, y] = iso(gxU / 6, gyU / 6);
    const a = car.road === "x" ? 3 : 2;
    const b = car.road === "x" ? 2 : 3;
    out.push({
      key: gxU / 6 + gyU / 6 + 0.42,
      draw: (s) => {
        prism(s, x, y, a, b, 3, car.paint);
        // cabin sits towards the back of the car
        const back = car.dir === 1 ? 0 : 1;
        const [cx, cy] = car.road === "x" ? [x + 2 * back, y + back] : [x - 2 * back, y + back];
        prism(s, cx, cy - 3, 2, 2, 2, { top: car.paint.top, ...CABIN });
        // headlights face the viewer when the car drives towards us, tail lights otherwise
        const light = car.dir === 1 ? "#fff7c0" : "#ff4d5e";
        if (car.road === "x") s.fill(x + 2 * a - 2 * b + 1, y + a + b - 2, 1, 1, light);
        else s.fill(x - 2 * b + 1, y + b - 2, 1, 1, light);
      },
    });
  }
  return out;
}

/* ── Scene ───────────────────────────────────────────────── */

export interface CityState {
  /** Animation clock in ms */
  t: number;
  /** Time since the intro started in ms; Infinity once the city stands */
  intro: number;
  hovered: string | null;
}

interface CityObject {
  key: number;
  draw: (s: Surface, st: CityState) => void;
}

const lotKey = (lot: Lot, w: number, d: number) => lot.gx + w / 2 + lot.gy + d / 2;

const BUILDERS: Record<BuildingStyle, typeof drawStudio> = {
  glassTower: drawGlassTower,
  studio: drawStudio,
  house: drawHouse,
  depot: drawDepot,
  yoga: drawYoga,
  salon: drawSalon,
};

const STATIC_OBJECTS: CityObject[] = [
  {
    key: lotKey(HQ_LOT, 2, 2),
    draw: (s, st) => {
      const g = grow(st.intro, 0);
      const h = grownHeight(STYLE.hq.h, g);
      if (h > 0) drawHQ(s, HQ_LOT, h, g >= 1, st.t);
    },
  },
  ...CLIENTS.map((client, i): CityObject => {
    const style = STYLE[client.building.style];
    return {
      key: lotKey(client.building, style.w, style.d),
      draw: (s, st) => {
        const g = grow(st.intro, i + 1);
        const h = grownHeight(style.h, g);
        if (h > 0) BUILDERS[client.building.style](s, client.building, h, g >= 1, st.t);
      },
    };
  }),
  ...CLIENTS.filter((c) => c.building.style === "depot").map(
    (client): CityObject => ({
      key: client.building.gx + CRANE.gx + client.building.gy + CRANE.gy,
      draw: (s, st) => drawCrane(s, client.building, grow(st.intro, 3) >= 1, st.t),
    }),
  ),
  {
    key: lotKey(CONSTRUCTION_LOT, 2, 2),
    draw: (s, st) => {
      if (st.intro >= INTRO_MS - 400) drawConstruction(s, CONSTRUCTION_LOT, st.t);
    },
  },
  ...FREE_LOTS.map(
    (lot, i): CityObject => ({
      key: lotKey(lot, 2, 2),
      draw: (s, st) => {
        if (st.intro < INTRO_MS - 300 + i * 120) return;
        const active = st.hovered === `plot-${i + 1}`;
        if (active) drawGhost(s, lot, st.t);
        drawLotSign(s, lot, active, st.t + i * 700);
      },
    }),
  ),
  ...TREES.map(
    (lot): CityObject => ({
      key: lot.gx + lot.gy + 1,
      draw: (s, st) => {
        if (st.intro > 120 + (lot.gx + lot.gy) * 60) drawTree(s, lot);
      },
    }),
  ),
  ...LAMPS.map(
    (lot): CityObject => ({
      key: lot.gx + lot.gy,
      draw: (s, st) => {
        if (st.intro > 900) drawLamp(s, lot);
      },
    }),
  ),
];

/* ── Ground (static; the browser paints it once into a cache) ── */

type GroundKind = "road" | "grass" | "yard" | "plaza" | "dirt";

function inLot(gx: number, gy: number, lot: Lot, w = 2, d = 2) {
  return gx >= lot.gx && gx < lot.gx + w && gy >= lot.gy && gy < lot.gy + d;
}

function groundKind(gx: number, gy: number): GroundKind {
  if (gx === ROAD || gy === ROAD) return "road";
  if (FREE_LOTS.some((lot) => inLot(gx, gy, lot)) || inLot(gx, gy, CONSTRUCTION_LOT)) return "dirt";
  if (gx < ROAD && gy < ROAD) return gx === 0 || gy === 0 || gx === 5 || gy === 5 ? "grass" : "plaza";
  if (gx < ROAD && gy > ROAD) return gx <= 3 && gy >= 9 ? "yard" : "grass";
  return "plaza";
}

const GROUND_COLOR: Record<GroundKind, [string, string]> = {
  road: [G.road, G.road],
  grass: [G.grass, G.grassB],
  yard: [G.yard, G.yard],
  plaza: [G.plazaA, G.plazaB],
  dirt: [G.dirt, G.dirt],
};

function dither(s: Surface, cx: number, cy: number, rx: number, ry: number, color: string) {
  for (let dy = -ry; dy <= ry; dy++) {
    for (let dx = -rx; dx <= rx; dx++) {
      if (Math.abs(dx) / rx + Math.abs(dy) / ry <= 1 && (dx + dy) % 2 === 0) s.fill(cx + dx, cy + dy, 1, 1, color);
    }
  }
}

export function drawGround(s: Surface) {
  const L = iso(0, GRID);
  const F = iso(GRID, GRID);
  const R = iso(GRID, 0);

  // Floating island: layered rock sides with a glowing underside
  fillPoly(s, [L, F, [F[0], F[1] + SIDE], [L[0], L[1] + SIDE]], G.sideL);
  fillPoly(s, [F, R, [R[0], R[1] + SIDE], [F[0], F[1] + SIDE]], G.sideR);
  for (let x = L[0]; x < R[0]; x++) {
    const top = x < F[0] ? L[1] + Math.ceil((x - L[0]) / 2) : F[1] - Math.ceil((x - F[0]) / 2);
    s.fill(x, top + 6, 1, 2, G.band);
    if (hash(x, 3) > 0.7) s.fill(x, top + 2 + Math.floor(hash(x, 4) * 8), 1, 1, G.speck);
    s.fill(x, top + SIDE - 1, 1, 1, G.glow);
    const root = hash(x, 5);
    if (root > 0.8) s.fill(x, top + SIDE, 1, 1 + Math.floor((root - 0.8) * 25), x < F[0] ? G.sideL : G.sideR);
  }

  // Tiles
  for (let gx = 0; gx < GRID; gx++) {
    for (let gy = 0; gy < GRID; gy++) {
      const colors = GROUND_COLOR[groundKind(gx, gy)];
      fillPoly(s, [iso(gx, gy), iso(gx + 1, gy), iso(gx + 1, gy + 1), iso(gx, gy + 1)], colors[(gx + gy) % 2]);
    }
  }
  line(s, L[0], L[1], F[0], F[1], G.rimTop);
  line(s, F[0], F[1], R[0], R[1], G.rimTop);

  // Road markings: curbs along both roads, dashed centre lines, a zebra crossing
  for (const [from, to] of [
    [0, ROAD],
    [ROAD + 1, GRID],
  ]) {
    for (const edge of [ROAD, ROAD + 1]) {
      const a = iso(from, edge);
      const b = iso(to, edge);
      line(s, a[0], a[1], b[0], b[1], G.curb);
      const c = iso(edge, from);
      const d = iso(edge, to);
      line(s, c[0], c[1], d[0], d[1], G.curb);
    }
  }
  for (let i = 0; i < GRID; i++) {
    if (i === ROAD) continue;
    const a = iso(i + 2 / 6, ROAD + 0.5);
    const b = iso(i + 4 / 6, ROAD + 0.5);
    line(s, a[0], a[1], b[0], b[1], G.dash);
    const c = iso(ROAD + 0.5, i + 2 / 6);
    const d = iso(ROAD + 0.5, i + 4 / 6);
    line(s, c[0], c[1], d[0], d[1], G.dash);
  }
  for (let k = 1; k < 6; k += 2) {
    const a = iso(ROAD + 1 + 1 / 6, ROAD + k / 6);
    const b = iso(ROAD + 1 + 4 / 6, ROAD + k / 6);
    line(s, a[0], a[1], b[0], b[1], "#5a5a7a");
  }

  // Free lots and the construction site are bare earth with pebbles
  for (const lot of [...FREE_LOTS, CONSTRUCTION_LOT]) {
    for (let i = 0; i < 9; i++) {
      const p = iso(lot.gx + 0.2 + hash(lot.gx, lot.gy, i) * 1.6, lot.gy + 0.2 + hash(lot.gy, lot.gx, i + 9) * 1.6);
      s.fill(Math.round(p[0]), Math.round(p[1]), 1, 1, G.pebble);
    }
  }

  // Pools of lamp light, tree shadows, flowers in the garden
  for (const lamp of LAMPS) {
    const [x, y] = iso(lamp.gx, lamp.gy);
    dither(s, x, y, 7, 3, G.pool);
  }
  for (const tree of TREES) {
    const [x, y] = iso(tree.gx + 0.5, tree.gy + 0.5);
    s.fill(x - 3, y, 7, 1, G.shadow);
    s.fill(x - 2, y + 1, 5, 1, G.shadow);
  }
  for (const client of CLIENTS) {
    if (client.building.style !== "house") continue;
    const { gx, gy } = client.building;
    for (let i = 0; i < 14; i++) {
      const p = iso(gx + hash(gx, i, 1) * 2.4, gy + 2 + 1 / 6 + hash(gy, i, 2) * 0.6);
      s.fill(Math.round(p[0]), Math.round(p[1]), 1, 1, ["#ffa6d3", "#ffd34d", "#ffffff", "#c9c4ff"][i % 4]);
    }
  }
}

/* ── Frame ───────────────────────────────────────────────── */

/** Draw everything above the ground for one frame (depth-sorted painter's algorithm). */
export function drawCity(s: Surface, st: CityState) {
  if (st.intro > INTRO_MS - 300) {
    FREE_LOTS.forEach((lot, i) => drawLotOutline(s, lot, st.t, st.hovered === `plot-${i + 1}`));
  }
  const objects = st.intro >= INTRO_MS ? [...STATIC_OBJECTS, ...carObjects(st.t)] : [...STATIC_OBJECTS];
  objects.sort((a, b) => a.key - b.key);
  for (const o of objects) o.draw(s, st);

  const spot = HOTSPOTS.find((h) => h.id === st.hovered);
  if (spot && st.intro >= INTRO_MS) {
    for (let i = 0; i < spot.hull.length; i++) {
      const a = spot.hull[i];
      const b = spot.hull[(i + 1) % spot.hull.length];
      line(s, a[0], a[1], b[0], b[1], NEON);
    }
    const bob = Math.round(Math.sin(st.t / 180) * 1.5);
    sprite(s, ARROW, spot.anchor[0] - 3, spot.anchor[1] - 8 + bob, ARROW_PAL);
  }
}

/* ── Hotspots (click areas) ──────────────────────────────── */

export type HotspotKind = "client" | "hq" | "construction" | "plot";

export interface Hotspot {
  id: string;
  kind: HotspotKind;
  /** Outline in city pixels */
  hull: Pt[];
  /** Top centre, where the label and selection arrow go */
  anchor: Pt;
  /** Paint order: later hotspots sit on top */
  key: number;
}

function hotspot(id: string, kind: HotspotKind, points: Pt[], key: number): Hotspot {
  const hull = convexHull(points);
  const xs = hull.map((p) => p[0]);
  const top = Math.min(...hull.map((p) => p[1]));
  return { id, kind, hull, anchor: [Math.round((Math.min(...xs) + Math.max(...xs)) / 2), top], key };
}

export const HOTSPOTS: readonly Hotspot[] = [
  hotspot("hq", "hq", boxHull(box(HQ_LOT.gx, HQ_LOT.gy, 2, 2, 0, STYLE.hq.h + STYLE.hq.roof)), lotKey(HQ_LOT, 2, 2)),
  ...CLIENTS.map((client) => {
    const { gx, gy, style } = client.building;
    const spec = STYLE[style];
    const points = boxHull(box(gx, gy, spec.w, spec.d, 0, spec.h + spec.roof));
    if (style === "depot") {
      const [mx, base] = iso(gx + CRANE.gx, gy + CRANE.gy);
      points.push([mx - 2, base], [mx + 2, base], [mx - 2, base - 68], [mx + 14, base - 64]);
    }
    return hotspot(client.id, "client", points, lotKey(client.building, spec.w, spec.d));
  }),
  hotspot(
    "construction",
    "construction",
    boxHull(box(CONSTRUCTION_LOT.gx, CONSTRUCTION_LOT.gy, 2, 2, 0, CONSTRUCTION_H + 10)),
    lotKey(CONSTRUCTION_LOT, 2, 2),
  ),
  ...FREE_LOTS.map((lot, i) => {
    const sign = signBox(lot);
    return hotspot(
      `plot-${i + 1}`,
      "plot",
      [...lotDiamond(lot), [sign.x, sign.y], [sign.x + sign.w, sign.y]],
      lotKey(lot, 2, 2),
    );
  }),
].sort((a, b) => a.key - b.key);
