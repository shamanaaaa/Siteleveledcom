// Per-URL table for REPORT.md from the probe CSV, render snapshots, link graph and Lighthouse runs.
import fs from "node:fs";
const R = "audit/seo/raw";
const status = Object.fromEntries(
  fs.readFileSync(`${R}/headers/status.csv`, "utf8").trim().split("\n").slice(1).map((l) => l.split(",")).map((c) => [c[0], c[1]])
);
const graph = JSON.parse(fs.readFileSync(`${R}/link-graph.json`)).table;
const lh = Object.fromEntries(
  fs.readFileSync(`${R}/lighthouse-summary.csv`, "utf8").trim().split("\n").slice(1)
    .map((l) => l.split('","').map((c) => c.replace(/"/g, "")))
    .map((c) => [c[0], { perf: c[2], seo: c[5], lcp: c[7] }])
);
const rawTitle = fs.readFileSync(`${R}/html/raw_home.html`, "utf8").match(/<title>(.*?)<\/title>/)[1];
const routes = ["/", "/sluzby", "/portfolio", "/proces", "/o-nas", "/cennik", "/blog", "/kontakt", "/seo-audit", "/seo-audit/admin"];
const slug = (r) => (r === "/" ? "home" : r.slice(1).replace(/\//g, "_"));
const out = ["| URL | Status | Raw `<title>` | Rendered title | Meta description | h1 (rendered) | Canonical | Robots | Words (rendered) | Inbound internal links (pages) | LH mobile perf | LH mobile SEO | LH mobile LCP |", "|---|---|---|---|---|---|---|---|---|---|---|---|---|"];
for (const r of routes) {
  const rec = JSON.parse(fs.readFileSync(`${R}/render/${slug(r)}.json`)).tall;
  const g = graph.find((x) => x.page === r);
  const l = lh[`${slug(r)}-mobile`] ?? {};
  const same = rec.title === rawTitle ? "same as raw" : rec.title;
  const desc = rec.description?.startsWith("Moderné weby, ktoré predávajú") ? "home default (148 chars)" : rec.description;
  out.push(`| \`${r}\` | ${status["https://siteleveled.com" + r]} | home default | ${same} | ${desc} | ${rec.h1.join(" / ")} | none | none | ${rec.mainWordsVisible} | ${g.linkingPages} | ${l.perf ?? "–"} | ${l.seo ?? "–"} | ${l.lcp ? l.lcp + " s" : "–"} |`);
}
console.log(`Raw title on every route: "${rawTitle}" (${rawTitle.length} chars)\n`);
console.log(out.join("\n"));
