import fs from "node:fs";
import path from "node:path";
import { deflateSync } from "node:zlib";
import type { Plugin } from "vite";
import { CLIENTS, type CityClient } from "../src/app/city/cityData";
import { OG_H, OG_SCALE, OG_W, drawOgCard } from "../src/app/city/og";
import { bufferSurface, type BufferSurface } from "../src/app/city/pixel";

/*
 * Build-time pages for the client city. nginx serves dist/ as static files, so instead of
 * server-side rendering every share link gets a real file:
 *   dist/og/siteleveled.png        default share image (referenced from index.html)
 *   dist/og/mesto-<id>.png         share image of one client's building
 *   dist/mesto/<id>/index.html     index.html with that client's title and Open Graph tags
 * In dev the images are rendered on request.
 */

const SITE = "https://siteleveled.com";

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

export function renderOgPng(clientId?: string) {
  const surface = bufferSurface(OG_W, OG_H, "#06060B");
  drawOgCard(surface, clientId);
  return encodePng(surface, OG_SCALE);
}

/* ── Share pages ─────────────────────────────────────────── */

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function sharePage(indexHtml: string, client: CityClient) {
  const url = `${SITE}/mesto/${client.id}/`;
  const title = `${client.name} — budova v meste klientov SiteLeveled`;
  const description = `${client.name} (${client.category}) má svoju budovu v pixelovom meste klientov SiteLeveled. Pozrite si projekt a postavte tam aj svoj web — návrh zadarmo do 24 hodín.`;
  const tags: [string, string, string][] = [
    ["name", "robots", "noindex, follow"],
    ["property", "og:type", "website"],
    ["property", "og:site_name", "SiteLeveled"],
    ["property", "og:locale", "sk_SK"],
    ["property", "og:url", url],
    ["property", "og:title", title],
    ["property", "og:description", description],
    ["property", "og:image", `${SITE}/og/mesto-${client.id}.png`],
    ["property", "og:image:width", String(OG_W * OG_SCALE)],
    ["property", "og:image:height", String(OG_H * OG_SCALE)],
    ["property", "og:image:alt", `Budova ${client.name} v pixelovom meste klientov SiteLeveled`],
    ["name", "twitter:card", "summary_large_image"],
  ];
  const meta = tags.map(([attr, key, value]) => `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`);
  return indexHtml
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/\s*<meta\s+(?:property="og:[^"]*"|name="twitter:[^"]*")[^>]*>/g, "")
    // The home page's canonical and JSON-LD (scripts/seoPages.ts) don't belong on a noindex copy
    .replace(/\s*<link\s+rel="canonical"[^>]*>/g, "")
    .replace(/\s*<meta\s+name="robots"[^>]*>/g, "")
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "")
    .replace("</head>", `  ${meta.join("\n    ")}\n  </head>`);
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
      server.middlewares.use((req, res, next) => {
        const match = req.url?.match(/^\/og\/(?:siteleveled|mesto-([\w-]+))\.png$/);
        if (!match || (match[1] && !CLIENTS.some((c) => c.id === match[1]))) return next();
        res.setHeader("Content-Type", "image/png");
        res.end(renderOgPng(match[1]));
      });
    },
    closeBundle() {
      if (!isBuild) return;
      const indexHtml = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      fs.mkdirSync(path.join(outDir, "og"), { recursive: true });
      fs.writeFileSync(path.join(outDir, "og", "siteleveled.png"), renderOgPng());
      for (const client of CLIENTS) {
        fs.writeFileSync(path.join(outDir, "og", `mesto-${client.id}.png`), renderOgPng(client.id));
        const dir = path.join(outDir, "mesto", client.id);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), sharePage(indexHtml, client));
      }
    },
  };
}
