// Which text blocks on a page are still at opacity 0 after the viewport covers the whole page?
// Usage: node audit/seo/scripts/opacity-probe.mjs <url>
import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire(path.resolve("server/package.json"));
const puppeteer = require("puppeteer");
const browser = await puppeteer.launch({
  executablePath: `${process.env.HOME}/.cache/puppeteer/chrome/linux-155.0.8059.79/chrome-linux64/chrome`,
  headless: true, args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setRequestInterception(true);
page.on("request", (r) => (/\/api\//.test(r.url()) ? r.abort() : r.continue()));
await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
await page.goto(process.argv[2], { waitUntil: "networkidle0" });
const h = await page.evaluate(() => document.documentElement.scrollHeight);
await page.setViewport({ width: 412, height: Math.min(h, 16000), isMobile: true, hasTouch: true });
await new Promise((r) => setTimeout(r, 3500));
const out = await page.evaluate(() => {
  const seen = new Set();
  const res = [];
  for (const el of document.querySelectorAll("main *")) {
    if (parseFloat(getComputedStyle(el).opacity) !== 0) continue;
    if ([...seen].some((s) => s.contains(el))) continue;
    seen.add(el);
    const sec = el.closest("section");
    res.push({ section: sec?.id || sec?.querySelector("h2")?.getAttribute("aria-label") || "?", tag: el.tagName, text: el.textContent.replace(/\s+/g, " ").trim().slice(0, 90) });
  }
  return res;
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
