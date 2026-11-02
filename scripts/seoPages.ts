import fs from "node:fs";
import path from "node:path";
import { createServer, type Plugin } from "vite";
import { NOT_FOUND, PAGES, SITE, type PageMeta } from "../src/app/seo/pages";

/*
 * Build-time heads for every route in src/app/seo/pages.ts. nginx serves dist/ as static files
 * and falls back to index.html, so without a file per route every URL would carry the home
 * page's title. Writes:
 *   dist/index.html, dist/<path>/index.html   own title, description, canonical, og:url, JSON-LD,
 *                                              and the page itself as HTML (src/entry-prerender.tsx)
 *   dist/404.html                              noindex, for nginx's error_page once it has one
 *   dist/sitemap.xml, dist/robots.txt
 * Must run after cityPages, which copies dist/index.html for the /mesto/<id>/ pages.
 * nginx answers a path without a file with 404, so the build fails if a route in
 * src/app/routes.ts has no entry in PAGES.
 */

const ORG = `${SITE}/#organization`;
const MARIO = `${SITE}/o-nas/#mario-doman`;
const MARIA = `${SITE}/o-nas/#maria-domanova`;

// Only owner-confirmed facts: no address or IČO, no review stars for our own reviews
const SITEWIDE = [
  {
    "@type": "Organization",
    "@id": ORG,
    name: "SiteLeveled",
    legalName: "DOMAN s.r.o.",
    url: `${SITE}/`,
    logo: { "@type": "ImageObject", url: `${SITE}/apple-touch-icon.png`, width: 180, height: 180 },
    image: `${SITE}/og/siteleveled.png`,
    description: "Tvorba webstránok a e-shopov pre slovenské firmy. Návrh webu zadarmo do 24 hodín.",
    email: "info@siteleveled.com",
    telephone: "+421910803993",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+421910803993",
      email: "info@siteleveled.com",
      availableLanguage: "sk",
    },
    employee: [{ "@id": MARIO }, { "@id": MARIA }],
  },
  {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: "SiteLeveled",
    url: `${SITE}/`,
    inLanguage: "sk",
    publisher: { "@id": ORG },
  },
  {
    "@type": "Person",
    "@id": MARIO,
    name: "Mário Doman",
    jobTitle: "Vývojár",
    telephone: "+421910803993",
    image: `${SITE}/profile.jpg`,
    worksFor: { "@id": ORG },
  },
  {
    "@type": "Person",
    "@id": MARIA,
    name: "Mária Domanová",
    jobTitle: "Konateľka",
    worksFor: { "@id": ORG },
  },
];

const offer = (priceSpecification: object, description?: string) => ({
  "@type": "Offer",
  url: `${SITE}/cennik/`,
  priceCurrency: "EUR",
  priceSpecification,
  ...(description ? { description } : {}),
});

const SERVICES = [
  {
    "@type": "Service",
    "@id": `${SITE}/sluzby/#tvorba-webu`,
    name: "Tvorba webstránky na mieru",
    serviceType: "Tvorba webstránok",
    provider: { "@id": ORG },
    areaServed: { "@type": "Country", name: "Slovensko" },
    offers: offer(
      { "@type": "PriceSpecification", minPrice: 300, priceCurrency: "EUR" },
      "Web od 300 €, hotový do 7 dní. Bez zálohy, platíte až po spustení."
    ),
  },
  {
    "@type": "Service",
    "@id": `${SITE}/sluzby/#tvorba-eshopu`,
    name: "Tvorba e-shopu na mieru",
    serviceType: "Tvorba e-shopov",
    provider: { "@id": ORG },
    areaServed: { "@type": "Country", name: "Slovensko" },
    offers: offer(
      { "@type": "PriceSpecification", minPrice: 1000, priceCurrency: "EUR" },
      "E-shop od 1 000 €, hotový do 14 dní. Bez zálohy, platíte až po spustení."
    ),
  },
  {
    "@type": "Service",
    "@id": `${SITE}/sluzby/#seo-audit`,
    name: "SEO audit webu",
    serviceType: "SEO audit",
    provider: { "@id": ORG },
    offers: { "@type": "Offer", url: `${SITE}/cennik/`, price: 199, priceCurrency: "EUR" },
  },
  {
    "@type": "Service",
    "@id": `${SITE}/sluzby/#sprava-webu`,
    name: "Správa webu",
    serviceType: "Správa a údržba webu",
    provider: { "@id": ORG },
    offers: offer({
      "@type": "UnitPriceSpecification",
      minPrice: 30,
      priceCurrency: "EUR",
      unitCode: "MON",
      unitText: "mesiac",
    }),
  },
];

function webPage(type: string, page: PageMeta, extra: object = {}) {
  return {
    "@type": type,
    "@id": `${SITE}${page.path}#webpage`,
    url: SITE + page.path,
    name: page.title,
    inLanguage: "sk",
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": ORG },
    ...extra,
  };
}

function jsonLd(page: PageMeta) {
  const graph: object[] = [...SITEWIDE];
  if (page.name) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Domov", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: page.name, item: SITE + page.path },
      ],
    });
  }
  if (page.path === "/sluzby/" || page.path === "/cennik/") graph.push(...SERVICES);
  if (page.path === "/tvorba-eshopu/") graph.push(...SERVICES.filter((s) => s["@id"].endsWith("#tvorba-eshopu")));
  if (page.path === "/o-nas/") graph.push(webPage("AboutPage", page, { mainEntity: { "@id": MARIO } }));
  if (page.path === "/kontakt/") graph.push(webPage("ContactPage", page));
  return { "@context": "https://schema.org", "@graph": graph };
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// "</script>" inside a string would end the tag early
const scriptJson = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");

function pageHtml(template: string, page: PageMeta, body: string | undefined, pageCode: string[]) {
  const indexable = !page.robots?.includes("noindex");
  const url = SITE + page.path;
  const tags = indexable
    ? [
        `<link rel="canonical" href="${url}" />`,
        `<meta property="og:url" content="${url}" />`,
        `<script type="application/ld+json">${scriptJson(jsonLd(page))}</script>`,
      ]
    : [`<meta name="robots" content="${page.robots}" />`];
  for (const file of pageCode) tags.push(`<link rel="modulepreload" href="/${file}" />`);
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`)
    .replace(/<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${escapeHtml(page.title)}" />`)
    .replace(/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${escapeHtml(page.description)}" />`)
    .replace("</head>", `  ${tags.join("\n    ")}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${body ?? ""}</div>`);
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
      // Dynamic routes (mesto/:slug, *) have no page of their own
      const routes = fs.readFileSync(path.join(root, "src/app/routes.ts"), "utf8");
      const missing = [...routes.matchAll(/path:\s*"([^"]+)"/g)]
        .map((m) => m[1])
        .filter((p) => p !== "/" && !/[:*]/.test(p))
        .filter((p) => !PAGES.some((page) => page.path === `/${p}/`));
      if (missing.length) {
        this.error(`No entry in src/app/seo/pages.ts for route(s) ${missing.join(", ")}: they would 404 on a direct visit`);
      }
      const images = fs.readdirSync(path.join(root, "public"));
      const noPhoneVersion = images.filter(
        (f) => /-preview\.webp$|^blog-\d+\.webp$/.test(f) && !images.includes(f.replace(".webp", "-720.webp")),
      );
      if (noPhoneVersion.length) {
        this.error(`No 720 px wide -720.webp version of ${noPhoneVersion.join(", ")} in public/: it would break on phones`);
      }

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
        for (const page of [...PAGES, NOT_FOUND]) {
          if (!page.clientOnly) bodies.set(page.path, await render(page.path));
        }
      } finally {
        await server.close();
      }
    },
    // Which code files each page needs, so its HTML can name them and they don't start late
    generateBundle(_options, bundle) {
      const routes = fs.readFileSync(path.join(root, "src/app/routes.ts"), "utf8");
      const chunks = Object.values(bundle).flatMap((file) => (file.type === "chunk" ? [file] : []));
      const entries = new Set(chunks.filter((chunk) => chunk.isEntry).map((chunk) => chunk.fileName));
      for (const [, route, module] of routes.matchAll(/(?:path: "([^"]+)"|index: true), lazy: \(\) => import\("\.\/pages\/(\w+)"\)/g)) {
        const chunk = chunks.find((c) => c.moduleIds.some((id) => id.endsWith(`/pages/${module}.tsx`)));
        // Only a warning: by this point dist/ is empty, and the page works without the hint
        if (!chunk) {
          this.warn(`No code file for ${module}`);
          continue;
        }
        const pagePath = route === "*" ? NOT_FOUND.path : route ? `/${route}/` : "/";
        pageCode.set(pagePath, [chunk.fileName, ...chunk.imports.filter((file) => !entries.has(file))]);
      }
    },
    // Not closeBundle, which also runs after a failed build: dist/ still holds the live site then
    writeBundle() {
      if (!isBuild) return;
      const template = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      for (const page of PAGES) {
        const dir = path.join(outDir, page.path);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), pageHtml(template, page, bodies.get(page.path), pageCode.get(page.path) ?? []));
      }
      fs.writeFileSync(path.join(outDir, "404.html"), pageHtml(template, NOT_FOUND, bodies.get(NOT_FOUND.path), pageCode.get(NOT_FOUND.path) ?? []));

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
