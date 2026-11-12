import { ROUTES, localeForPath, normalizePath, type Locale, type PageId } from "../i18n/routes";
import { POSTS, postPath } from "../blog/posts";
/*
 * Search metadata of every route. scripts/seoPages.ts writes a static dist/<path>/index.html
 * with this head for each entry (nginx serves dist/ as plain files, so crawlers only see what
 * exists at build time), plus sitemap.xml and robots.txt. Layout applies the same values on
 * client-side navigation. A new route in routes.ts needs an entry here.
 */

export const SITE = "https://siteleveled.com";

export interface PageMeta {
  /** Articles get their own id each, so alternates() never pairs two of them */
  id: PageId | "blog" | `blog:${string}` | "admin" | "notFound";
  locale: Locale;
  image?: string;
  imageAlt?: string;
  /** Canonical path, with trailing slash */
  path: string;
  title: string;
  description: string;
  /** Label in breadcrumbs; the home page has none */
  name?: string;
  /** Only set for pages that must stay out of the index */
  robots?: string;
  /** Not pre-rendered: what it shows depends on the browser (the owner's token in localStorage) */
  clientOnly?: boolean;
  /** Middle breadcrumb level, for pages below another page */
  parent?: { name: string; path: string };
  /** Blog articles: ISO dates for og:type article and BlogPosting */
  article?: { published: string; modified: string };
}

const SK_PAGES = [
  {
    path: "/",
    title: "Tvorba webstránok a e-shopov na mieru | SiteLeveled",
    description:
      "Tvorba webstránok od 300 € a e-shopov od 1 000 € pre slovenské firmy. Návrh vášho nového webu dostanete zadarmo do 24 hodín, bez zálohy.",
  },
  {
    path: "/sluzby/",
    name: "Služby",
    title: "Tvorba webu, e-shopu, SEO a správa webu | SiteLeveled",
    description:
      "Navrhneme a naprogramujeme váš web alebo e-shop, nastavíme SEO a postaráme sa o správu webu. Web od 300 €, e-shop od 1 000 €, SEO audit 199 €.",
  },
  {
    path: "/tvorba-eshopu/",
    name: "Tvorba e-shopu",
    title: "Tvorba e-shopu na mieru od 1 000 € | SiteLeveled",
    description:
      "Tvorba e-shopu na mieru od 1 000 €, hotový do 14 dní. Návrh dostanete zadarmo do 24 hodín, bez zálohy – platíte až po spustení.",
  },
  {
    path: "/cennik/",
    name: "Cenník",
    title: "Cenník: koľko stojí webstránka a e-shop | SiteLeveled",
    description:
      "Web od 300 € (do 7 dní), e-shop od 1 000 € (do 14 dní), SEO audit 199 €, správa webu od 30 €/mesiac. Bez zálohy – platíte až po spustení.",
  },
  {
    path: "/portfolio/",
    name: "Portfólio",
    title: "Portfólio a referencie: naše weby | SiteLeveled",
    description:
      "Weby a webové aplikácie, ktoré sme navrhli a naprogramovali pre slovenské firmy – od fotografiek po servisný systém. Každý projekt si môžete otvoriť naživo.",
  },
  {
    path: "/proces/",
    name: "Proces",
    title: "Ako prebieha tvorba webu krok za krokom | SiteLeveled",
    description:
      "Návrh dostanete do 24 hodín, jednoduchý web je hotový do 7 dní, e-shop do 14 dní. Pozrite si, ako prebieha spolupráca od návrhu po spustenie.",
  },
  {
    path: "/o-nas/",
    name: "O nás",
    title: "O nás: Mário Doman a DOMAN s.r.o. | SiteLeveled",
    description:
      "Za SiteLeveled stojí vývojár Mário Doman a spoločnosť DOMAN s.r.o. Každý projekt vedie osobne – zavolajte mu priamo na 0910 803 993.",
  },
  {
    path: "/kontakt/",
    name: "Kontakt",
    title: "Kontakt – návrh webu zadarmo do 24 hodín | SiteLeveled",
    description:
      "Napíšte na info@siteleveled.com alebo zavolajte na 0910 803 993. Návrh vašej novej webstránky pripravíme zadarmo do 24 hodín.",
  },
  {
    path: "/seo-audit/",
    name: "SEO audit",
    title: "SEO audit webu zadarmo – online kontrola | SiteLeveled",
    description:
      "Zadajte adresu webu a o pár minút uvidíte skóre SEO, rýchlosti a prístupnosti pre až 15 podstránok. Bezplatná kontrola nástrojom Lighthouse.",
  },
  {
    path: "/ochrana-osobnych-udajov/",
    name: "Ochrana osobných údajov",
    title: "Ochrana osobných údajov | SiteLeveled",
    description:
      "Ako DOMAN s.r.o. (SiteLeveled) spracúva údaje z formulárov a SEO auditu, kto k nim má prístup, ako dlho ich uchováva a aké máte práva. Bez cookies.",
  },
  {
    // Slovak only; lists the articles in src/app/blog/posts.ts
    path: "/blog/",
    name: "Blog",
    title: "Blog o tvorbe webu a SEO pre malé firmy | SiteLeveled",
    description:
      "Praktické rady o cenách webstránok a e-shopov, tvorbe webu a SEO pre slovenské firmy a živnostníkov. Ceny a príklady z našich projektov.",
  },
  {
    path: "/seo-audit/admin/",
    title: "Prehľad SEO auditov | SiteLeveled",
    description: "Prehľad SEO auditov pre majiteľa webu.",
    robots: "noindex, nofollow",
    clientOnly: true,
  },
];

const EN_META: Record<string, [string, string, string?]> = {
  home: ["Web design and development from Slovakia | SiteLeveled", "Custom websites and online stores, direct contact with the developer, and a clear process. Start with a free design proposal and quote."],
  services: ["Web design, online stores and SEO | SiteLeveled", "Custom websites, online stores, copy, SEO and maintenance, built in Slovakia. Websites from €300, online stores from €1,000. Request a free proposal.", "Services"],
  onlineStores: ["Online store development from Slovakia | SiteLeveled", "An online store built around your products, customers, and workflow. Review a free design proposal and quote before deciding.", "Online stores"],
  pricing: ["Website and online store pricing from €300 | SiteLeveled", "Websites from €300, stores from €1,000, manual SEO audit €199, maintenance from €30/month. No deposit; pay after launch.", "Pricing"],
  portfolio: ["Portfolio: real Slovak business websites | SiteLeveled", "Explore websites and applications built for Slovak businesses: photography, logistics, service management, yoga, and more.", "Portfolio"],
  process: ["Our website development process | SiteLeveled", "From your brief to design approval, preview, testing, and launch. Understand the steps and how to work directly with the developer.", "Process"],
  about: ["About Mário Doman and DOMAN s.r.o. | SiteLeveled", "Meet the people behind SiteLeveled: developer Mário Doman and DOMAN s.r.o., a Slovak company. Work directly with the developer who builds your website.", "About us"],
  contact: ["Contact us about your website | SiteLeveled", "Tell us about your business and website project. Email info@siteleveled.com to discuss a free design proposal.", "Contact"],
  seoAudit: ["Free website SEO audit | SiteLeveled", "Check SEO, performance, accessibility, and best practices for up to 15 pages using Lighthouse. Get a free automated website audit.", "SEO audit"],
  privacy: ["Privacy policy | SiteLeveled", "How DOMAN s.r.o. processes inquiries and SEO audits, uses browser storage, and handles your personal data and rights.", "Privacy policy"],
};
export const PAGES: PageMeta[] = [
  ...SK_PAGES.map(page => ({ ...page, locale: "sk" as const, id: ROUTES.find(route => route.sk === page.path)?.id ?? (page.path === "/blog/" ? "blog" as const : "admin" as const) })),
  ...POSTS.map(post => ({
    id: `blog:${post.slug}` as const, locale: "sk" as const, path: postPath(post.slug),
    title: post.title, description: post.description, name: post.heading,
    parent: { name: "Blog", path: "/blog/" }, article: { published: post.published, modified: post.modified },
  })),
  ...ROUTES.filter(route => route.id !== "cityClient").map(route => ({
    id: route.id, locale: "en" as const, path: route.en,
    title: EN_META[route.id][0], description: EN_META[route.id][1], name: EN_META[route.id][2],
  })),
];

export const NOT_FOUND: PageMeta = {
  id: "notFound", locale: "sk",
  path: "/404/",
  title: "Stránka sa nenašla | SiteLeveled",
  description: "Táto stránka neexistuje. Pokračujte na úvod, cenník alebo služby SiteLeveled.",
  robots: "noindex, follow",
};

/** The entry for a router pathname, with or without its trailing slash */
export function pageFor(pathname: string): PageMeta | undefined {
  const path = normalizePath(pathname);
  return PAGES.find((p) => p.path === path);
}

export const EN_NOT_FOUND: PageMeta = {
  id: "notFound", locale: "en", path: "/en/404/", title: "Page not found | SiteLeveled",
  description: "This page could not be found. Explore SiteLeveled services, pricing, or the homepage.", robots: "noindex, follow",
};
export const notFoundFor = (path: string) => localeForPath(path) === "en" ? EN_NOT_FOUND : NOT_FOUND;
export function alternates(page: PageMeta) {
  if (page.robots?.includes("noindex")) return [];
  const versions = PAGES.filter(candidate => candidate.id === page.id && !candidate.robots?.includes("noindex"));
  // A page without a translation (the Slovak articles) gets no hreflang at all
  return versions.length > 1 ? versions : [];
}
/** Searchers in any other language get the international English page. */
export const xDefault = (page: PageMeta) => alternates(page).find(other => other.locale === "en");
