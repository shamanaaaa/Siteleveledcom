/*
 * Search metadata of every route. scripts/seoPages.ts writes a static dist/<path>/index.html
 * with this head for each entry (nginx serves dist/ as plain files, so crawlers only see what
 * exists at build time), plus sitemap.xml and robots.txt. Layout applies the same values on
 * client-side navigation. A new route in routes.ts needs an entry here.
 */

export const SITE = "https://siteleveled.com";

export interface PageMeta {
  /** Canonical path, with trailing slash */
  path: string;
  title: string;
  description: string;
  /** Label in breadcrumbs; the home page has none */
  name?: string;
  /** Only set for pages that must stay out of the index */
  robots?: string;
}

export const PAGES: PageMeta[] = [
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
      "Weby a e-shopy, ktoré sme navrhli a naprogramovali pre slovenské firmy – od fotografiek po e-shop. Každý projekt si môžete otvoriť naživo.",
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
    // Placeholder posts without articles: kept out of the index until real ones exist
    path: "/blog/",
    name: "Blog",
    title: "Blog o tvorbe webu a SEO pre malé firmy | SiteLeveled",
    description:
      "Praktické rady o tvorbe webstránok, cenách, SEO a správe webu pre slovenských podnikateľov – z projektov, ktoré sme naozaj robili.",
    robots: "noindex, follow",
  },
  {
    path: "/seo-audit/admin/",
    title: "Prehľad SEO auditov | SiteLeveled",
    description: "Prehľad SEO auditov pre majiteľa webu.",
    robots: "noindex, nofollow",
  },
];

export const NOT_FOUND: PageMeta = {
  path: "/404/",
  title: "Stránka sa nenašla | SiteLeveled",
  description: "Táto stránka neexistuje. Pokračujte na úvod, cenník alebo služby SiteLeveled.",
  robots: "noindex, follow",
};

/** The entry for a router pathname, with or without its trailing slash */
export function pageFor(pathname: string): PageMeta | undefined {
  const path = `${pathname.replace(/\/+$/, "")}/`;
  return PAGES.find((p) => p.path === path);
}
