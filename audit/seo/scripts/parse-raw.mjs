// Parse saved raw HTML files (no JS, no network) and write one JSON summary per page.
// Usage: node parse.mjs <html-dir> <out.json>
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire("/home/shamanaaaa/Siteleveledcom/server/package.json");
const puppeteer = require("puppeteer");

const [dir, out] = process.argv.slice(2);
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setJavaScriptEnabled(false);
await page.setRequestInterception(true);
page.on("request", (r) => (r.url().startsWith("data:") || r.url() === "about:blank" ? r.continue() : r.abort()));

const results = {};
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html")).sort()) {
  const html = fs.readFileSync(path.join(dir, file), "utf8");
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  results[file] = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const attr = (s, a) => q(s)?.getAttribute(a) ?? null;
    const clean = (t) => (t || "").replace(/\s+/g, " ").trim();
    const textOf = (el) => {
      if (!el) return "";
      const c = el.cloneNode(true);
      c.querySelectorAll("script,style,noscript,svg").forEach((n) => n.remove());
      // keep word boundaries between block elements
      c.querySelectorAll("*").forEach((n) => n.append(" "));
      return clean(c.textContent);
    };
    const main = q("main");
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
      try { return JSON.parse(s.textContent); } catch (e) { return { PARSE_ERROR: String(e) }; }
    });
    return {
      lang: document.documentElement.getAttribute("lang"),
      title: document.title,
      description: attr('meta[name="description"]', "content"),
      robots: attr('meta[name="robots"]', "content"),
      canonical: attr('link[rel="canonical"]', "href"),
      hreflang: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => [l.getAttribute("hreflang"), l.getAttribute("href")]),
      og: Object.fromEntries([...document.querySelectorAll('meta[property^="og:"]')].map((m) => [m.getAttribute("property"), m.getAttribute("content")])),
      ld,
      h1: [...document.querySelectorAll("h1")].map((h) => clean(h.textContent)),
      headings: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => [h.tagName, clean(h.textContent).slice(0, 90), !!h.closest("footer"), !!h.closest("main")]),
      rootEmpty: !q("#root")?.children.length,
      mainWords: textOf(main).split(" ").filter(Boolean).length,
      bodyWords: textOf(document.body).split(" ").filter(Boolean).length,
      mainText: textOf(main),
      bodyText: textOf(document.body),
      links: [...document.querySelectorAll("a[href]")].map((a) => ({
        href: a.getAttribute("href"), text: clean(a.textContent).slice(0, 60) || a.getAttribute("aria-label") || "",
        rel: a.getAttribute("rel"), hreflang: a.getAttribute("hreflang"), inFooter: !!a.closest("footer"), inNav: !!a.closest("header,nav"), inMain: !!a.closest("main"),
      })),
      images: [...document.querySelectorAll("img")].map((i) => ({ src: i.getAttribute("src"), alt: i.getAttribute("alt"), w: i.getAttribute("width"), h: i.getAttribute("height"), loading: i.getAttribute("loading"), inMain: !!i.closest("main") })),
      forms: [...document.querySelectorAll("form")].length,
    };
  });
  results[file].bytes = Buffer.byteLength(html);
}
await browser.close();
fs.writeFileSync(out, JSON.stringify(results, null, 1));
console.log("parsed", Object.keys(results).length);
