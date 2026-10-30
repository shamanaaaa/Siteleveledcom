import type { Surface } from "./pixel";

/*
 * 5×7 uppercase pixel font with Slovak diacritics, used for signs inside the city and for
 * the text on the Open Graph images. Accents sit in two rows above the cap height.
 */

const GLYPHS: Record<string, readonly string[]> = {
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
  C: [".###.", "#...#", "#....", "#....", "#....", "#...#", ".###."],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  G: [".###.", "#...#", "#....", "#.###", "#...#", "#...#", ".####"],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  I: ["###", ".#.", ".#.", ".#.", ".#.", ".#.", "###"],
  J: ["..###", "...#.", "...#.", "...#.", "#..#.", "#..#.", ".##.."],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  N: ["#...#", "#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  Q: [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  W: ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "#.#.#", ".#.#."],
  X: ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  Z: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],
  "0": [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
  "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
  "3": ["####.", "....#", "....#", ".###.", "....#", "....#", "####."],
  "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  "5": ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
  "6": [".###.", "#....", "#....", "####.", "#...#", "#...#", ".###."],
  "7": ["#####", "....#", "...#.", "..#..", "..#..", "..#..", "..#.."],
  "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  "9": [".###.", "#...#", "#...#", ".####", "....#", "....#", ".###."],
  ".": [".", ".", ".", ".", ".", ".", "#"],
  ",": ["..", "..", "..", "..", ".#", ".#", "#."],
  ":": [".", ".", "#", ".", ".", "#", "."],
  "-": ["....", "....", "....", "####", "....", "....", "...."],
  "/": ["....#", "...#.", "...#.", "..#..", ".#...", ".#...", "#...."],
  "!": ["#", "#", "#", "#", "#", ".", "#"],
  "?": [".###.", "#...#", "....#", "...#.", "..#..", ".....", "..#.."],
  "'": ["#", "#", ".", ".", ".", ".", "."],
  "+": [".....", "..#..", "..#..", "#####", "..#..", "..#..", "....."],
  ">": ["....", "#...", ".#..", "..#.", ".#..", "#...", "...."],
  "·": [".", ".", ".", "#", ".", ".", "."],
  " ": ["...", "...", "...", "...", "...", "...", "..."],
};

type Accent = "acute" | "caron" | "umlaut" | "circumflex";

const ACCENTS: Record<Accent, readonly [string, string]> = {
  acute: ["...#.", "..#.."],
  caron: [".#.#.", "..#.."],
  umlaut: [".....", ".#.#."],
  circumflex: ["..#..", ".#.#."],
};

const COMPOSED: Record<string, readonly [string, Accent]> = {
  Á: ["A", "acute"],
  Ä: ["A", "umlaut"],
  Č: ["C", "caron"],
  Ď: ["D", "caron"],
  É: ["E", "acute"],
  Í: ["I", "acute"],
  Ĺ: ["L", "acute"],
  Ň: ["N", "caron"],
  Ó: ["O", "acute"],
  Ô: ["O", "circumflex"],
  Ŕ: ["R", "acute"],
  Š: ["S", "caron"],
  Ť: ["T", "caron"],
  Ú: ["U", "acute"],
  Ý: ["Y", "acute"],
  Ž: ["Z", "caron"],
};

/* Ľ carries its caron as an apostrophe beside the stem, like the printed letter. */
const L_CARON = ["#..#.", "#..#.", "#....", "#....", "#....", "#....", "#####"];

export const FONT_CAP = 7;
/** Rows reserved above the cap height for accents. */
export const FONT_ASCENT = 2;

function glyphFor(ch: string): { rows: readonly string[]; accent?: Accent } {
  if (ch === "Ľ") return { rows: L_CARON };
  const composed = COMPOSED[ch];
  if (composed) return { rows: GLYPHS[composed[0]], accent: composed[1] };
  return { rows: GLYPHS[ch] ?? GLYPHS["?"] };
}

export function textWidth(text: string, scale = 1) {
  let w = 0;
  for (const ch of text.toLocaleUpperCase("sk")) w += glyphFor(ch).rows[0].length + 1;
  return Math.max(0, w - 1) * scale;
}

/**
 * Draw text with its cap line at y. `skew` shifts each column vertically (0.5 follows the
 * left face of an isometric box, -0.5 the right face). Returns the advance width.
 */
export function drawText(
  s: Surface,
  text: string,
  x: number,
  y: number,
  color: string,
  scale = 1,
  skew = 0,
) {
  let cx = 0;
  for (const ch of text.toLocaleUpperCase("sk")) {
    const { rows, accent } = glyphFor(ch);
    const width = rows[0].length;
    const plot = (col: number, row: number) => {
      const column = cx + col;
      s.fill(x + column * scale, y + (row + Math.floor(column * skew)) * scale, scale, scale, color);
    };
    for (let r = 0; r < rows.length; r++) {
      for (let c = 0; c < width; c++) if (rows[r][c] === "#") plot(c, r);
    }
    if (accent) {
      const marks = ACCENTS[accent];
      // Centre the 5-wide accent over narrower glyphs such as I
      const shift = Math.floor((width - 5) / 2);
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 5; c++) if (marks[r][c] === "#") plot(c + shift, r - FONT_ASCENT);
      }
    }
    cx += width + 1;
  }
  return Math.max(0, cx - 1) * scale;
}
