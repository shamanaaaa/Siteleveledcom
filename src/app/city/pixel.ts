/*
 * Pixel-art raster primitives for the client city. Everything is drawn as whole-pixel
 * rectangles, so the same drawing code paints a <canvas> in the browser and a raw RGBA
 * buffer at build time (the Open Graph share images).
 */

export interface Surface {
  readonly width: number;
  readonly height: number;
  /** Fill a whole-pixel rectangle with an opaque #rrggbb colour. */
  fill(x: number, y: number, w: number, h: number, color: string): void;
}

export type Pt = readonly [number, number];

export function canvasSurface(ctx: CanvasRenderingContext2D): Surface {
  let last = "";
  return {
    width: ctx.canvas.width,
    height: ctx.canvas.height,
    fill(x, y, w, h, color) {
      if (color !== last) {
        ctx.fillStyle = color;
        last = color;
      }
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    },
  };
}

export interface BufferSurface extends Surface {
  readonly data: Uint8Array;
}

export function bufferSurface(width: number, height: number, background: string): BufferSurface {
  const data = new Uint8Array(width * height * 4);
  const rgbCache = new Map<string, [number, number, number]>();
  const rgb = (hex: string) => {
    let c = rgbCache.get(hex);
    if (!c) {
      const n = parseInt(hex.slice(1), 16);
      c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      rgbCache.set(hex, c);
    }
    return c;
  };
  const surface: BufferSurface = {
    width,
    height,
    data,
    fill(x, y, w, h, color) {
      const x0 = Math.max(0, Math.round(x));
      const y0 = Math.max(0, Math.round(y));
      const x1 = Math.min(width, Math.round(x) + Math.round(w));
      const y1 = Math.min(height, Math.round(y) + Math.round(h));
      if (x1 <= x0 || y1 <= y0) return;
      const [r, g, b] = rgb(color);
      for (let yy = y0; yy < y1; yy++) {
        for (let i = (yy * width + x0) * 4, end = (yy * width + x1) * 4; i < end; i += 4) {
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = 255;
        }
      }
    },
  };
  surface.fill(0, 0, width, height, background);
  return surface;
}

/** Shift everything drawn through the returned surface by (dx, dy). */
export function translate(s: Surface, dx: number, dy: number): Surface {
  return {
    width: s.width,
    height: s.height,
    fill: (x, y, w, h, color) => s.fill(x + dx, y + dy, w, h, color),
  };
}

export function px(s: Surface, x: number, y: number, color: string) {
  s.fill(x, y, 1, 1, color);
}

/** Scanline fill of a convex polygon, sampling pixel centres so shared edges never overlap. */
export function fillPoly(s: Surface, pts: readonly Pt[], color: string) {
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [, y] of pts) {
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  for (let y = Math.ceil(minY - 0.5), last = Math.floor(maxY - 0.5); y <= last; y++) {
    const cy = y + 0.5;
    let left = Infinity;
    let right = -Infinity;
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i];
      const [bx, by] = pts[(i + 1) % pts.length];
      if ((ay <= cy && by > cy) || (by <= cy && ay > cy)) {
        const x = ax + ((cy - ay) / (by - ay)) * (bx - ax);
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
    const a = Math.round(left);
    const b = Math.round(right);
    if (b > a) s.fill(a, y, b - a, 1, color);
  }
}

/** Bresenham line; 2:1 slopes come out as clean isometric pixel steps. */
export function line(s: Surface, x0: number, y0: number, x1: number, y1: number, color: string) {
  x0 = Math.round(x0);
  y0 = Math.round(y0);
  x1 = Math.round(x1);
  y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    s.fill(x0, y0, 1, 1, color);
    if (x0 === x1 && y0 === y1) return;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
}

export type Sprite = readonly string[];

/** Draw a sprite given as rows of palette keys; keys missing from the palette are transparent. */
export function sprite(
  s: Surface,
  rows: Sprite,
  x: number,
  y: number,
  palette: Readonly<Record<string, string>>,
  flip = false,
) {
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      const color = palette[row[flip ? row.length - 1 - c : c]];
      if (color) s.fill(x + c, y + r, 1, 1, color);
    }
  }
}

/** Deterministic 0..1 noise from up to three integers. */
export function hash(a: number, b = 0, c = 0) {
  let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
