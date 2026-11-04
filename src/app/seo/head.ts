import { SITE, alternates, xDefault, type PageMeta } from "./pages";
import { jsonLd } from "./schema";
function setMeta(attr: "name" | "property", key: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (content === null) { el?.remove(); return; }
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.content = content;
}
export function applyHead(page: PageMeta) {
  const indexable = !page.robots?.includes("noindex");
  document.documentElement.lang = page.locale;
  document.title = page.title;
  setMeta("name", "description", page.description);
  setMeta("name", "robots", page.robots ?? null);
  setMeta("property", "og:title", page.title);
  setMeta("property", "og:description", page.description);
  setMeta("property", "og:locale", page.locale === "en" ? "en_US" : "sk_SK");
  setMeta("property", "og:url", indexable || page.id === "cityClient" ? SITE + page.path : null);
  setMeta("property", "og:image", SITE + (page.image ?? `/og/${page.locale === "en" ? "en-" : ""}siteleveled.png`));
  setMeta("property", "og:image:alt", page.imageAlt ?? (page.locale === "en" ? "SiteLeveled — custom websites and online stores" : "SiteLeveled — tvorba webstránok a e-shopov"));
  document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang], script[type="application/ld+json"]').forEach(el => el.remove());
  if (!indexable) return;
  const canonical = document.createElement("link"); canonical.rel = "canonical"; canonical.href = SITE + page.path; document.head.appendChild(canonical);
  const fallback = xDefault(page);
  for (const [hreflang, other] of [...alternates(page).map(other => [other.locale, other] as const), ...(fallback ? [["x-default", fallback] as const] : [])]) {
    const link = document.createElement("link"); link.rel = "alternate"; link.hreflang = hreflang; link.href = SITE + other.path; document.head.appendChild(link);
  }
  const schema = document.createElement("script"); schema.type = "application/ld+json"; schema.textContent = JSON.stringify(jsonLd(page)); document.head.appendChild(schema);
}
