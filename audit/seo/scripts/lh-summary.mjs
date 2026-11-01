// Summarise the Lighthouse JSON reports into one CSV + console table.
// Usage: node audit/seo/scripts/lh-summary.mjs audit/seo/raw/lighthouse
import fs from "node:fs";
import path from "node:path";

const DIR = process.argv[2] ?? "audit/seo/raw/lighthouse";
const rows = [];
const details = {};
for (const f of fs.readdirSync(DIR).filter((f) => f.endsWith(".report.json")).sort()) {
  const r = JSON.parse(fs.readFileSync(path.join(DIR, f)));
  const a = r.audits;
  const score = (c) => (r.categories[c]?.score == null ? "" : Math.round(r.categories[c].score * 100));
  const num = (k, d = 0) => (a[k]?.numericValue == null ? "" : (a[k].numericValue / (d ? 1000 : 1)).toFixed(d ? 2 : 0));
  const lcpEl = a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node;
  const failing = (cat) =>
    r.categories[cat].auditRefs
      .filter((ref) => ref.weight > 0 && a[ref.id].score !== null && a[ref.id].score < 0.9)
      .map((ref) => ref.id);
  const row = {
    report: f.replace(".report.json", ""),
    url: r.finalDisplayedUrl,
    perf: score("performance"),
    a11y: score("accessibility"),
    bp: score("best-practices"),
    seo: score("seo"),
    FCP_s: num("first-contentful-paint", 1),
    LCP_s: num("largest-contentful-paint", 1),
    TBT_ms: num("total-blocking-time"),
    CLS: a["cumulative-layout-shift"]?.numericValue?.toFixed(3),
    SI_s: num("speed-index", 1),
    weight_kB: Math.round((a["total-byte-weight"]?.numericValue ?? 0) / 1024),
    requests: a["network-requests"]?.details?.items?.length,
    lcpElement: lcpEl ? `${lcpEl.nodeLabel ?? ""} <${lcpEl.selector ?? ""}>`.slice(0, 90) : "",
  };
  rows.push(row);
  details[row.report] = {
    failingPerf: failing("performance"),
    failingA11y: failing("accessibility"),
    failingSeo: failing("seo"),
    failingBp: failing("best-practices"),
    renderBlocking: a["render-blocking-resources"]?.details?.items?.map((i) => `${i.url} (${Math.round(i.wastedMs)} ms)`) ??
      a["render-blocking-insight"]?.details?.items?.map((i) => `${i.url} (${Math.round(i.wastedMs ?? 0)} ms)`),
    textCompression: a["uses-text-compression"]?.details?.items?.map((i) => `${i.url} save ${Math.round(i.wastedBytes / 1024)} kB`) ??
      a["document-latency-insight"]?.details,
    unusedJs: a["unused-javascript"]?.details?.items?.map((i) => `${i.url} unused ${Math.round(i.wastedBytes / 1024)} kB of ${Math.round(i.totalBytes / 1024)} kB`),
    cacheTtl: a["uses-long-cache-ttl"]?.details?.items?.length ?? a["cache-insight"]?.details?.items?.length,
    mainThread: a["mainthread-work-breakdown"]?.displayValue,
    bootup: a["bootup-time"]?.displayValue,
    seoAudits: Object.fromEntries(
      r.categories.seo.auditRefs.map((ref) => [ref.id, a[ref.id].score])
    ),
    colorContrast: a["color-contrast"]?.details?.items?.length ?? 0,
    tapTargets: a["target-size"]?.score,
  };
}
const keys = Object.keys(rows[0]);
fs.writeFileSync(
  path.join(DIR, "..", "lighthouse-summary.csv"),
  [keys.join(","), ...rows.map((r) => keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n")
);
fs.writeFileSync(path.join(DIR, "..", "lighthouse-details.json"), JSON.stringify(details, null, 2));
console.table(rows.map(({ lcpElement, url, ...r }) => r));
for (const r of rows) console.log(r.report, "LCP:", r.lcpElement);
