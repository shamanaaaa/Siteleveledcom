// Does a client-rendered client site credit SiteLeveled once its JS has run?
// Usage: node audit/seo/scripts/rendered-credit.mjs <url>
import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire(path.resolve("server/package.json"));
const puppeteer = require("puppeteer");
const browser = await puppeteer.launch({
  executablePath: `${process.env.HOME}/.cache/puppeteer/chrome/linux-155.0.8059.79/chrome-linux64/chrome`,
  headless: true, args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.goto(process.argv[2], { waitUntil: "networkidle0", timeout: 60000 });
const res = await page.evaluate(() => ({
  links: [...document.querySelectorAll("a[href]")].map((a) => a.href).filter((h) => /siteleveled|doman/i.test(h)),
  text: (document.body.innerText.match(/.{0,60}(siteleveled|doman)[^\n]{0,40}/gi) ?? []),
  totalLinks: document.querySelectorAll("a[href]").length,
}));
console.log(JSON.stringify({ url: process.argv[2], ...res }));
await browser.close();
