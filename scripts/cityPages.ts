import { loadMessages } from "../src/app/i18n/messages";
import { LOCALES, type Locale } from "../src/app/i18n/routes";
import fs from "node:fs";
import path from "node:path";
import { deflateSync } from "node:zlib";
import type { Plugin } from "vite";
import { CLIENTS } from "../src/app/city/cityData";
import { OG_H, OG_SCALE, OG_W, drawOgCard } from "../src/app/city/og";
import { bufferSurface, type BufferSurface } from "../src/app/city/pixel";

/* Build-time SK/EN social PNGs. seoPages runs next and writes the corresponding localized
 * HTML files. In development, images are generated on request. */

/* ── PNG encoding (RGB, "Up" filter: the ×3 upscale makes most rows repeat) ── */

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf: Buffer) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer) {
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const out = Buffer.alloc(body.length + 8);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc32(body), body.length + 4);
  return out;
}

/** Encode a surface as PNG, scaling every pixel up to a scale×scale block. */
export function encodePng(surface: BufferSurface, scale: number) {
  const w = surface.width * scale;
  const h = surface.height * scale;
  const stride = w * 3 + 1;
  const raw = Buffer.alloc(stride * h);
  let prev: Buffer | null = null;
  for (let y = 0; y < h; y++) {
    const row = Buffer.alloc(w * 3);
    const sy = Math.floor(y / scale);
    for (let x = 0; x < w; x++) {
      const i = (sy * surface.width + Math.floor(x / scale)) * 4;
      row[x * 3] = surface.data[i];
      row[x * 3 + 1] = surface.data[i + 1];
      row[x * 3 + 2] = surface.data[i + 2];
    }
    const at = y * stride;
    raw[at] = 2;
    for (let x = 0; x < row.length; x++) raw[at + 1 + x] = (row[x] - (prev ? prev[x] : 0)) & 255;
    prev = row;
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(w, 0);
  header.writeUInt32BE(h, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // colour type: RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

export function renderOgPng(clientId?: string, locale: Locale = "sk") {
  const surface = bufferSurface(OG_W, OG_H, "#06060B");
  drawOgCard(surface, clientId, locale);
  return encodePng(surface, OG_SCALE);
}

export function cityPages(): Plugin {
  let outDir = "";
  let isBuild = false;
  return {
    name: "siteleveled-city-pages",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      isBuild = config.command === "build";
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const match = req.url?.match(/^\/og\/(en-)?(?:siteleveled|mesto-([\w-]+))\.png$/);
        if (!match || (match[2] && !CLIENTS.some((c) => c.id === match[2]))) return next();
        await loadMessages(match[1] ? "en" : "sk");
        res.setHeader("Content-Type", "image/png");
        res.end(renderOgPng(match[2], match[1] ? "en" : "sk"));
      });
    },
    // Not closeBundle, which also runs after a failed build: dist/ still holds the live site then
    writeBundle() {
      if (!isBuild) return;
      fs.mkdirSync(path.join(outDir, "og"), { recursive: true });
      for (const locale of LOCALES) {
        const prefix = locale === "en" ? "en-" : "";
        fs.writeFileSync(path.join(outDir, "og", `${prefix}siteleveled.png`), renderOgPng(undefined, locale));
        for (const client of CLIENTS) fs.writeFileSync(path.join(outDir, "og", `${prefix}mesto-${client.id}.png`), renderOgPng(client.id, locale));
      }
      // seoPages runs next and writes each share route with its localized prerender and metadata.
    },
  };
}
