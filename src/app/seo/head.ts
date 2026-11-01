import { SITE, type PageMeta } from "./pages";

function setMeta(attr: "name" | "property", key: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (content === null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Mirror the static head scripts/seoPages.ts writes for a route, so the tab title, history
 * and a crawler's rendered DOM match the page after client-side navigation too.
 */
export function applyHead(page: PageMeta) {
  const indexable = !page.robots?.includes("noindex");
  const url = SITE + page.path;
  document.title = page.title;
  setMeta("name", "description", page.description);
  setMeta("name", "robots", page.robots ?? null);
  setMeta("property", "og:title", page.title);
  setMeta("property", "og:description", page.description);
  setMeta("property", "og:url", indexable ? url : null);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!indexable) {
    canonical?.remove();
  } else {
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }
}
