// Internal link graph from the rendered-DOM snapshots written by render.mjs.
// Usage: node audit/seo/scripts/link-graph.mjs audit/seo/raw/render
import fs from "node:fs";
import path from "node:path";
const DIR = process.argv[2] ?? "audit/seo/raw/render";
const PAGES = ["/", "/sluzby", "/portfolio", "/proces", "/o-nas", "/cennik", "/blog", "/kontakt", "/seo-audit", "/seo-audit/admin"];
const slug = (r) => (r === "/" ? "home" : r.replace(/^\/|\/$/g, "").replace(/\//g, "_"));
const rows = [["source", "target", "anchor", "region", "href"]];
const inbound = Object.fromEntries(PAGES.map((p) => [p, { pages: new Set(), count: 0, anchors: new Set() }]));
const external = new Map();
const dead = [];
for (const src of PAGES) {
  const rec = JSON.parse(fs.readFileSync(path.join(DIR, `${slug(src)}.json`)));
  for (const l of rec.tall.links) {
    if (!l.href || l.href === "#") { dead.push({ src, text: l.text, region: l.where, href: l.href }); continue; }
    const u = new URL(l.abs);
    if (u.hostname !== "localhost" && u.hostname !== "siteleveled.com") {
      if (/^https?:/.test(u.protocol)) external.set(u.origin + u.pathname, (external.get(u.origin + u.pathname) ?? 0) + 1);
      continue;
    }
    const target = u.pathname.replace(/\/$/, "") || "/";
    rows.push([src, target + (u.hash || ""), l.text, l.where, l.href]);
    if (inbound[target] && target !== src) {
      inbound[target].pages.add(src);
      inbound[target].count++;
      inbound[target].anchors.add(l.text);
    }
  }
}
const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
fs.writeFileSync(path.join(DIR, "..", "internal-links.csv"), csv);
const table = PAGES.map((p) => ({ page: p, linkingPages: inbound[p].pages.size, from: [...inbound[p].pages].join(" "), anchors: [...inbound[p].anchors].join(" | ") }));
console.table(table);
console.log("Dead/placeholder links:", JSON.stringify([...new Map(dead.map((d) => [d.text + d.region, d])).values()], null, 1));
console.log("External link targets:", JSON.stringify([...external.entries()], null, 1));
fs.writeFileSync(path.join(DIR, "..", "link-graph.json"), JSON.stringify({ table, dead, external: [...external.entries()] }, null, 2));
