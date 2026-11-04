import { loadMessages } from "../src/app/i18n/messages";
import { jsonLd } from "../src/app/seo/schema";
import { LOCALES, ROUTES } from "../src/app/i18n/routes";
import { CLIENTS } from "../src/app/city/cityData";
import { cityMeta } from "../src/app/seo/city";
import { PROJECT_PREVIEW_IMAGES, localizedImage } from "../src/app/lib/images";
import fs from "node:fs";
import path from "node:path";
import { createServer, type Plugin } from "vite";
import { EN_NOT_FOUND, NOT_FOUND, PAGES, SITE, alternates, xDefault, type PageMeta } from "../src/app/seo/pages";

/*
 * Static content and metadata for catalogue routes, client city shares, and both 404 documents.
 * Run after cityPages, which generates the localized social images. Coverage and lazy preloads
 * use the same route catalogue as React instead of parsing route source with regular expressions.
 * SSR happens before Vite empties dist/, so a rendering failure preserves the previous build.
 */

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// "</script>" inside a string would end the tag early
const scriptJson = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");

function pageHtml(template: string, page: PageMeta, body: string | undefined, pageCode: string[]) {
  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${page.locale}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/\s*<meta\s+(?:name="(?:description|robots|twitter:[^"]*)"|property="og:[^"]*")[^>]*>/g, "")
    .replace(/\s*<link\s+rel="(?:canonical|alternate)"[^>]*>/g, "")
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "")
    .replace("</head>", `${headHtml(page)}${pageCode.map(file => `<link rel="modulepreload" href="/${file}" />`).join("\n")}\n</head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${body ?? ""}</div>`);
}
function headHtml(page: PageMeta) {
  const indexable = !page.robots?.includes("noindex");
  const tags = [
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:locale" content="${page.locale === "en" ? "en_US" : "sk_SK"}" />`,
    `<meta property="og:type" content="website" />`, `<meta property="og:site_name" content="SiteLeveled" />`,
    `<meta property="og:image" content="${SITE}${page.image ?? `/og/${page.locale === "en" ? "en-" : ""}siteleveled.png`}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(page.imageAlt ?? (page.locale === "en" ? "SiteLeveled — custom websites and online stores" : "SiteLeveled — tvorba webstránok a e-shopov"))}" />`,
    `<meta property="og:image:width" content="1200" />`, `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (page.robots) tags.push(`<meta name="robots" content="${page.robots}" />`);
  if (indexable) {
    tags.push(`<link rel="canonical" href="${SITE}${page.path}" />`);
    tags.push(`<script type="application/ld+json">${scriptJson(jsonLd(page))}</script>`);
    tags.push(...alternates(page).map(other => `<link rel="alternate" hreflang="${other.locale}" href="${SITE}${other.path}" />`));
    const fallback = xDefault(page);
    if (fallback) tags.push(`<link rel="alternate" hreflang="x-default" href="${SITE}${fallback.path}" />`);
  }
  if (indexable || page.id === "cityClient") tags.push(`<meta property="og:url" content="${SITE}${page.path}" />`);
  return tags.join("\n");
}

export function seoPages(): Plugin {
  let root = "";
  let outDir = "";
  let isBuild = false;
  const bodies = new Map<string, string>();
  const pageCode = new Map<string, string[]>();
  return {
    name: "siteleveled-seo-pages",
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
      isBuild = config.command === "build";
    },
    async buildStart() {
      if (!isBuild) return;
      await loadMessages("en");
      const missing = ROUTES.filter(route => route.id !== "cityClient").flatMap(route => LOCALES.filter(locale => !PAGES.some(page => page.id === route.id && page.locale === locale)).map(locale => route[locale]));
      if (missing.length) this.error(`Missing metadata: ${missing.join(", ")}`);
      const images = fs.readdirSync(path.join(root, "public"));
      const noPhoneVersion = images.filter(
        (f) => /-preview\.webp$|^blog-\d+\.webp$/.test(f) && !images.includes(f.replace(".webp", "-720.webp")),
      );
      if (noPhoneVersion.length) {
        this.error(`No 720 px wide -720.webp version of ${noPhoneVersion.join(", ")} in public/: it would break on phones`);
      }
      const missingEnglishImages = PROJECT_PREVIEW_IMAGES.flatMap(src => {
        const localized = localizedImage(src, "en");
        return [localized, localized.replace(".webp", "-720.webp")];
      }).filter(src => !fs.existsSync(path.join(root, "public", src)));
      if (missingEnglishImages.length) this.error(`Missing English screenshots: ${missingEnglishImages.join(", ")}`);

      // Here, before dist/ is emptied: a page that can't render stops the build and the live site stays as it is
      const server = await createServer({
        root,
        mode: "production",
        appType: "custom",
        logLevel: "error",
        optimizeDeps: { noDiscovery: true },
        server: { middlewareMode: true, hmr: false, ws: false },
      });
      try {
        const { render } = await server.ssrLoadModule("/src/entry-prerender.tsx");
        for (const page of [...PAGES, NOT_FOUND, EN_NOT_FOUND, ...LOCALES.flatMap(locale => CLIENTS.map(client => cityMeta(client, locale)))]) {
          if (!page.clientOnly) bodies.set(page.path, await render(page.path));
        }
      } finally {
        await server.close();
      }
    },
    // Which code files each page needs, so its HTML can name them and they don't start late
    generateBundle(_options, bundle) {
      const chunks = Object.values(bundle).flatMap(file => file.type === "chunk" ? [file] : []);
      const entries = new Set(chunks.filter(chunk => chunk.isEntry).map(chunk => chunk.fileName));
      const modules = [...ROUTES.flatMap(route => LOCALES.flatMap(locale => route.id === "cityClient" ? CLIENTS.map(client => ({ path: route[locale].replace(":slug", client.id), module: route.module })) : [{ path: route[locale], module: route.module }])),
        { path: "/blog/", module: "BlogPage" }, { path: "/seo-audit/admin/", module: "SeoAuditAdminPage" },
        { path: NOT_FOUND.path, module: "NotFoundPage" }, { path: EN_NOT_FOUND.path, module: "NotFoundPage" }];
      for (const route of modules) {
        const chunk = chunks.find(chunk => chunk.moduleIds.some(id => id.endsWith(`/pages/${route.module}.tsx`)));
        if (!chunk) { this.warn(`No code file for ${route.module}`); continue; }
        const dictionary = route.path.startsWith("/en/") ? chunks.find(c => c.moduleIds.some(id => id.endsWith("/i18n/en.json"))) : undefined;
        pageCode.set(route.path, [...(dictionary ? [dictionary.fileName] : []), chunk.fileName, ...chunk.imports.filter(file => !entries.has(file))]);
      }
    },
    // Not closeBundle, which also runs after a failed build: dist/ still holds the live site then
    writeBundle() {
      if (!isBuild) return;
      const template = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      for (const page of [...PAGES, ...LOCALES.flatMap(locale => CLIENTS.map(client => cityMeta(client, locale)))]) {
        const dir = path.join(outDir, page.path);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), pageHtml(template, page, bodies.get(page.path), pageCode.get(page.path) ?? []));
      }
      for (const page of [NOT_FOUND, EN_NOT_FOUND]) {
        const target = path.join(outDir, page.locale === "en" ? "en/404.html" : "404.html");
        fs.writeFileSync(target, pageHtml(template, page, bodies.get(page.path), pageCode.get(page.path) ?? []));
      }

      const urls = PAGES.filter((p) => !p.robots).map((p) => `  <url><loc>${SITE}${p.path}</loc></url>`);
      fs.writeFileSync(
        path.join(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`
      );
      // /seo-audit/admin/ and /mesto/ stay crawlable: their noindex has to be seen
      fs.writeFileSync(path.join(outDir, "robots.txt"), `User-agent: *\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`);
    },
  };
}
