import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { NOT_FOUND, PAGES, SITE, type PageMeta } from "../src/app/seo/pages";

/*
 * Build-time heads for every route in src/app/seo/pages.ts. nginx serves dist/ as static files
 * and falls back to index.html, so without a file per route every URL would carry the home
 * page's title. Writes:
 *   dist/index.html, dist/<path>/index.html   own title, description, canonical, og:url, JSON-LD
 *   dist/404.html                              noindex, for nginx's error_page once it has one
 *   dist/sitemap.xml, dist/robots.txt
 * Must run after cityPages, which copies dist/index.html for the /mesto/<id>/ pages.
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
    email: "domansro@gmail.com",
    telephone: "+421910803993",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+421910803993",
      email: "domansro@gmail.com",
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
  if (page.path === "/o-nas/") graph.push(webPage("AboutPage", page, { mainEntity: { "@id": MARIO } }));
  if (page.path === "/kontakt/") graph.push(webPage("ContactPage", page));
  return { "@context": "https://schema.org", "@graph": graph };
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// "</script>" inside a string would end the tag early
const scriptJson = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");

function pageHtml(template: string, page: PageMeta) {
  const indexable = !page.robots?.includes("noindex");
  const url = SITE + page.path;
  const tags = indexable
    ? [
        `<link rel="canonical" href="${url}" />`,
        `<meta property="og:url" content="${url}" />`,
        `<script type="application/ld+json">${scriptJson(jsonLd(page))}</script>`,
      ]
    : [`<meta name="robots" content="${page.robots}" />`];
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`)
    .replace(/<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${escapeHtml(page.title)}" />`)
    .replace(/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${escapeHtml(page.description)}" />`)
    .replace("</head>", `  ${tags.join("\n    ")}\n  </head>`);
}

export function seoPages(): Plugin {
  let outDir = "";
  let isBuild = false;
  return {
    name: "siteleveled-seo-pages",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      isBuild = config.command === "build";
    },
    closeBundle() {
      if (!isBuild) return;
      const template = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      for (const page of PAGES) {
        const dir = path.join(outDir, page.path);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), pageHtml(template, page));
      }
      fs.writeFileSync(path.join(outDir, "404.html"), pageHtml(template, NOT_FOUND));

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
