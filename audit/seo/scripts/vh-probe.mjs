// Does the min-h-screen hero grow with the viewport and push the rest of the page out of view?
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
for (const height of [915, 5000, 12000]) {
  await page.setViewport({ width: 412, height, isMobile: true, hasTouch: true });
  await page.goto(process.argv[2] ?? "http://localhost:4173/", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 3000));
  const m = await page.evaluate(() => {
    const hero = document.querySelector("main section");
    const all = [...document.querySelectorAll("main section")];
    const invisible = all.filter((s) => [...s.querySelectorAll("*")].some((e) => parseFloat(getComputedStyle(e).opacity) === 0 && e.textContent.trim().length > 20)).length;
    return { heroHeight: Math.round(hero.getBoundingClientRect().height), pageHeight: document.documentElement.scrollHeight, sections: all.length, sectionsWithHiddenText: invisible };
  });
  console.log(JSON.stringify({ viewportHeight: height, ...m }));
}
await browser.close();
