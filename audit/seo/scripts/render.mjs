// Rendered-DOM snapshot of every route, as a Googlebot smartphone would see it.
// Usage: node audit/seo/scripts/render.mjs <baseUrl> <outDir>
// Every request matching /api/ is aborted before any page loads (audit rule 1).
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(path.resolve("server/package.json"));
const puppeteer = require("puppeteer");

const BASE = process.argv[2] ?? "http://localhost:4173";
const OUT = process.argv[3] ?? "audit/seo/raw/render";
const CHROME = `${process.env.HOME}/.cache/puppeteer/chrome/linux-155.0.8059.79/chrome-linux64/chrome`;
const UA =
  "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const ROUTES = [
  "/",
  "/sluzby",
  "/portfolio",
  "/proces",
  "/o-nas",
  "/cennik",
  "/blog",
  "/kontakt",
  "/seo-audit",
  "/seo-audit/admin",
  "/mesto/jogaslaskou/",
  "/toto-neexistuje-xyz-404",
];

fs.mkdirSync(OUT, { recursive: true });
const slug = (r) => (r === "/" ? "home" : r.replace(/^\/|\/$/g, "").replace(/\//g, "_"));

// Runs in the page: everything an indexer cares about
function extract() {
  const norm = (s) => (s ?? "").replace(/\s+/g, " ").trim();
  const meta = (sel) => document.querySelector(sel)?.getAttribute("content") ?? null;
  const headingText = (h) => norm(h.getAttribute("aria-label") || h.textContent);
  const main = document.querySelector("main");
  const where = (el) =>
    el.closest("nav") ? "nav" : el.closest("footer#site-footer") ? "footer" : el.closest("main") ? "main" : "other";
  const words = (t) => norm(t).split(" ").filter((w) => /\p{L}/u.test(w)).length;
  const hiddenText = [...(main?.querySelectorAll("p, h1, h2, h3, li, blockquote, span") ?? [])].filter((el) => {
    if (!norm(el.textContent) || el.children.length > 3) return false;
    let n = el;
    while (n && n !== document.body) {
      if (parseFloat(getComputedStyle(n).opacity) === 0) return true;
      n = n.parentElement;
    }
    return false;
  }).length;
  return {
    url: location.href,
    lang: document.documentElement.lang,
    title: document.title,
    description: meta('meta[name="description"]'),
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
    robots: meta('meta[name="robots"]'),
    og: Object.fromEntries(
      [...document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]')].map((m) => [
        m.getAttribute("property") ?? m.getAttribute("name"),
        m.getAttribute("content"),
      ])
    ),
    jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
    h1: [...document.querySelectorAll("h1")].map(headingText),
    headings: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
      level: Number(h.tagName[1]),
      text: headingText(h),
      where: where(h),
    })),
    mainWordsDom: words(main?.textContent),
    mainWordsVisible: words(main?.innerText),
    mainTextVisible: norm(main?.innerText),
    textNodesInsideOpacity0: hiddenText,
    links: [...document.querySelectorAll("a")].map((a) => ({
      href: a.getAttribute("href"),
      abs: a.href,
      text: norm(a.innerText || a.getAttribute("aria-label") || a.textContent),
      ariaLabel: a.getAttribute("aria-label"),
      rel: a.getAttribute("rel"),
      target: a.getAttribute("target"),
      where: where(a),
      ariaHidden: a.getAttribute("aria-hidden"),
    })),
    buttons: [...document.querySelectorAll("button")].map((b) => norm(b.innerText || b.getAttribute("aria-label"))),
    images: [...document.querySelectorAll("img")].map((i) => ({
      src: i.getAttribute("src"),
      alt: i.getAttribute("alt"),
      loading: i.getAttribute("loading"),
      widthAttr: i.getAttribute("width"),
      heightAttr: i.getAttribute("height"),
      natural: `${i.naturalWidth}x${i.naturalHeight}`,
      rendered: `${Math.round(i.getBoundingClientRect().width)}x${Math.round(i.getBoundingClientRect().height)}`,
    })),
    canvases: document.querySelectorAll("canvas").length,
    landmarks: {
      header: document.querySelectorAll("header").length,
      nav: document.querySelectorAll("nav").length,
      main: document.querySelectorAll("main").length,
      footer: document.querySelectorAll("footer").length,
    },
    forms: [...document.querySelectorAll("form")].map((f) => ({
      action: f.getAttribute("action"),
      fields: [...f.querySelectorAll("input,select,textarea")].map((x) => x.name || x.id || x.type),
    })),
  };
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const summary = [];
for (const route of ROUTES) {
  const page = await browser.newPage();
  await page.setUserAgent(UA);
  await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await page.setRequestInterception(true);
  const blocked = [];
  const requests = [];
  const consoleErrors = [];
  page.on("request", (req) => {
    if (/\/api\//.test(req.url())) {
      blocked.push(req.url());
      return req.abort();
    }
    requests.push(req.url());
    req.continue();
  });
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(String(e)));

  const res = await page.goto(BASE + route, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));
  // Pass 1: the first viewport, no scrolling (what a non-scrolling renderer sees)
  const first = await page.evaluate(extract);
  await page.screenshot({ path: path.join(OUT, `${slug(route)}_mobile_fold.png`) });

  // Pass 2: viewport stretched to the whole page, as Google's renderer is known to do
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewport({ width: 412, height: Math.min(height, 16000), isMobile: true, hasTouch: true });
  await new Promise((r) => setTimeout(r, 3000));
  const tall = await page.evaluate(extract);
  await page.screenshot({ path: path.join(OUT, `${slug(route)}_mobile_full.png`), fullPage: true });

  const record = { route, status: res.status(), blockedApi: blocked, requestCount: requests.length, consoleErrors, first, tall };
  fs.writeFileSync(path.join(OUT, `${slug(route)}.json`), JSON.stringify(record, null, 2));
  fs.writeFileSync(path.join(OUT, `${slug(route)}_dom.html`), await page.content());
  await page.close();

  // No-JS pass: what a non-rendering crawler can read
  const nojs = await browser.newPage();
  await nojs.setJavaScriptEnabled(false);
  await nojs.setUserAgent(UA);
  await nojs.goto(BASE + route, { waitUntil: "load", timeout: 30000 });
  const nojsInfo = await nojs.evaluate(() => ({
    textLength: document.body.innerText.trim().length,
    links: document.querySelectorAll("a[href]").length,
    h1: document.querySelectorAll("h1").length,
  }));
  await nojs.close();

  summary.push({
    route,
    status: res.status(),
    title: tall.title,
    h1: tall.h1.join(" | "),
    canonical: tall.canonical,
    robots: tall.robots,
    words: tall.mainWordsDom,
    visibleWordsFirstPass: first.mainWordsVisible,
    opacity0First: first.textNodesInsideOpacity0,
    opacity0Tall: tall.textNodesInsideOpacity0,
    links: tall.links.length,
    images: tall.images.length,
    jsonLd: tall.jsonLd,
    blockedApi: blocked.length,
    consoleErrors: consoleErrors.length,
    nojs: nojsInfo,
  });
  console.log(JSON.stringify(summary.at(-1)));
}
fs.writeFileSync(path.join(OUT, "_summary.json"), JSON.stringify(summary, null, 2));
await browser.close();
