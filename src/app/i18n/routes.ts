import { CLIENTS } from "../city/cityData";
export type Locale = "sk" | "en";
export const LOCALES: readonly Locale[] = ["sk", "en"];

// Used by React, prerendering, preload discovery, metadata and counterpart links.
export const ROUTES = [
  { id: "home", module: "HomePage", sk: "/", en: "/en/" },
  { id: "services", module: "ServicesPage", sk: "/sluzby/", en: "/en/services/" },
  { id: "onlineStores", module: "EshopPage", sk: "/tvorba-eshopu/", en: "/en/online-stores/" },
  { id: "pricing", module: "PricingPage", sk: "/cennik/", en: "/en/pricing/" },
  { id: "portfolio", module: "PortfolioPage", sk: "/portfolio/", en: "/en/portfolio/" },
  { id: "process", module: "ProcessPage", sk: "/proces/", en: "/en/process/" },
  { id: "about", module: "AboutPage", sk: "/o-nas/", en: "/en/about/" },
  { id: "contact", module: "ContactPage", sk: "/kontakt/", en: "/en/contact/" },
  { id: "seoAudit", module: "SeoAuditPage", sk: "/seo-audit/", en: "/en/seo-audit/" },
  { id: "privacy", module: "PrivacyPage", sk: "/ochrana-osobnych-udajov/", en: "/en/privacy/" },
  { id: "cityClient", module: "HomePage", sk: "/mesto/:slug/", en: "/en/city/:slug/" },
] as const;
export type PageId = typeof ROUTES[number]["id"];
export const normalizePath = (path: string) => `${path.replace(/\/+$/, "")}/`;
export const localeForPath = (path: string): Locale => /^\/en(?:\/|$)/.test(path) ? "en" : "sk";
export function routeMatch(pathname: string) {
  const locale = localeForPath(pathname);
  const path = normalizePath(pathname);
  for (const route of ROUTES) {
    if (route.id === "cityClient") {
      const prefix = route[locale].split(":")[0];
      const slug = path.slice(prefix.length, -1);
      if (path.startsWith(prefix) && CLIENTS.some(client => client.id === slug)) return { route, locale, slug };
    } else if (path === route[locale]) return { route, locale };
  }
  return undefined;
}
export function pathFor(id: PageId, locale: Locale, slug?: string) {
  const route = ROUTES.find(r => r.id === id)!;
  return route[locale].replace(":slug", encodeURIComponent(slug ?? ""));
}
const HOME_ANCHORS = new Set(["formular", "portfolio", "referencie", "faq", "ako-to-funguje"]);
export function counterpart(pathname: string, locale: Locale, search = "", hash = "") {
  const match = routeMatch(pathname);
  const id = match?.route.id;
  let result = id ? pathFor(id, locale, match?.slug) : pathFor("home", locale);
  // Only the public audit's shareable job ID is supported. Never propagate owner tokens.
  const params = new URLSearchParams(search);
  const job = params.get("audit");
  if (id === "seoAudit" && job && /^[0-9a-f-]{36}$/.test(job)) result += `?audit=${encodeURIComponent(job)}`;
  const anchor = hash.replace(/^#/, "");
  if (id && ["home", "cityClient"].includes(id) && HOME_ANCHORS.has(anchor)) result += `#${anchor}`;
  return result;
}
export function localizeLink(href: string, locale: Locale): string {
  if (locale === "en" && href.startsWith("tel:")) return "mailto:info@siteleveled.com";
  if (href.startsWith("#")) return pathFor("home", locale) + href;
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const url = new URL(href, "https://siteleveled.com");
  const match = routeMatch(url.pathname);
  return match ? counterpart(url.pathname, locale, url.search, url.hash) : href;
}
export function preferredLocale(languages: readonly unknown[], saved?: string | null): Locale {
  if (saved === "en" || saved === "sk") return saved;
  for (const language of languages) {
    if (typeof language !== "string") continue;
    const base = language.toLowerCase().split(/[-_]/)[0];
    if (base === "en" || base === "sk") return base;
    if (base === "cs") return "sk";
  }
  return "en";
}
