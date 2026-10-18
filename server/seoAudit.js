const express = require("express");
const crypto = require("crypto");
const dns = require("dns").promises;
const fs = require("fs");
const net = require("net");
const path = require("path");
const { spawn } = require("child_process");

// ── Config ──────────────────────────────────────────────────
const AUDIT_DIR = path.resolve(process.env.SEO_AUDIT_DIR || path.join(__dirname, "audits"));
const DAILY_LIMIT = Number(process.env.SEO_AUDIT_DAILY_LIMIT) || 1;
const MAX_QUEUE = Number(process.env.SEO_AUDIT_MAX_QUEUE) || 10;
const TIMEOUT_MS = (Number(process.env.SEO_AUDIT_TIMEOUT_MIN) || 10) * 60 * 1000;
const RETENTION_MS = (Number(process.env.SEO_AUDIT_RETENTION_DAYS) || 30) * 24 * 60 * 60 * 1000;
const REUSE_MS = 60 * 60 * 1000; // same site scanned within the last hour → reuse result
const ACCESS_CODE = process.env.SEO_AUDIT_ACCESS_CODE || "";
const ADMIN_TOKEN = process.env.SEO_AUDIT_ADMIN_TOKEN || "";
const ROUTE_PREFIX = "/api/seo-audit";
const CLI_BIN = path.join(__dirname, "node_modules", ".bin", "unlighthouse-ci");
const CONFIG_FILE = path.join(__dirname, "unlighthouse.config.mjs");

const ID_RE = /^[0-9a-f-]{36}$/;

fs.mkdirSync(AUDIT_DIR, { recursive: true });

// ── Job store (memory + job.json on disk) ───────────────────
/** @type {Map<string, {id:string, site:string, status:string, createdAt:number, startedAt?:number, finishedAt?:number, error?:string}>} */
const jobs = new Map();
const queue = [];
let running = null;

const jobDir = (id) => path.join(AUDIT_DIR, id);
// Unlighthouse insists on owning its output folder, so it gets a subfolder next to job.json
const reportDir = (id) => path.join(jobDir(id), "report");

function saveJob(job) {
  fs.writeFileSync(path.join(jobDir(job.id), "job.json"), JSON.stringify(job));
}

function loadJobs() {
  for (const id of fs.readdirSync(AUDIT_DIR)) {
    if (!ID_RE.test(id)) continue;
    try {
      const job = JSON.parse(fs.readFileSync(path.join(jobDir(id), "job.json"), "utf8"));
      if (job.status === "queued" || job.status === "running") {
        job.status = "failed";
        job.error = "Audit bol prerušený reštartom servera. Spusti ho prosím znova.";
        saveJob(job);
      }
      jobs.set(id, job);
    } catch {
      // incomplete/corrupt job dir – cleanup() removes it once old enough
    }
  }
}

function cleanup() {
  const cutoff = Date.now() - RETENTION_MS;
  for (const id of fs.readdirSync(AUDIT_DIR)) {
    if (!ID_RE.test(id)) continue;
    const job = jobs.get(id);
    const created = job ? job.createdAt : fs.statSync(jobDir(id)).mtimeMs;
    if (created < cutoff && (!job || (job.status !== "queued" && job.status !== "running"))) {
      fs.rmSync(jobDir(id), { recursive: true, force: true });
      jobs.delete(id);
    }
  }
}

loadJobs();
cleanup();
setInterval(cleanup, 6 * 60 * 60 * 1000).unref();

// ── URL validation (no scanning of private / internal hosts) ─
const blocked = new net.BlockList();
[
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8],
  ["169.254.0.0", 16], ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.168.0.0", 16],
  ["198.18.0.0", 15], ["224.0.0.0", 4], ["240.0.0.0", 4],
].forEach(([addr, prefix]) => blocked.addSubnet(addr, prefix, "ipv4"));
[["::", 128], ["::1", 128], ["fc00::", 7], ["fe80::", 10], ["ff00::", 8]].forEach(([addr, prefix]) =>
  blocked.addSubnet(addr, prefix, "ipv6"),
);

function isBlockedIp(ip) {
  const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (mapped) return blocked.check(mapped[1], "ipv4");
  return blocked.check(ip, net.isIPv6(ip) ? "ipv6" : "ipv4");
}

async function normaliseSite(input) {
  let raw = String(input || "").trim();
  if (!raw) throw new Error("Zadaj adresu webu.");
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) {
    if (!/^https?:\/\//i.test(raw)) throw new Error("Podporujeme len http a https.");
  } else {
    raw = `https://${raw}`;
  }

  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Neplatná adresa webu.");
  }
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Podporujeme len http a https.");
  if (url.username || url.password) throw new Error("Adresa nesmie obsahovať prihlasovacie údaje.");
  if (url.port && !["80", "443"].includes(url.port)) throw new Error("Podporujeme len štandardné porty.");
  if (net.isIP(url.hostname.replace(/^\[|\]$/g, "")) || !url.hostname.includes(".")) {
    throw new Error("Zadaj doménu webu, napr. mojafirma.sk.");
  }

  let addresses;
  try {
    addresses = await dns.lookup(url.hostname, { all: true });
  } catch {
    throw new Error("Doménu sa nepodarilo nájsť. Skontroluj, či je adresa správna.");
  }
  if (!addresses.length || addresses.some((a) => isBlockedIp(a.address))) {
    throw new Error("Túto adresu nie je možné skontrolovať.");
  }

  return url.origin;
}

// ── Rate limit (per IP, rolling 24h) ────────────────────────
const hits = new Map();

const DAY_MS = 24 * 60 * 60 * 1000;

/** ms until this IP may start another audit (0 = allowed now) */
function waitTime(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => t > now - DAY_MS);
  hits.set(ip, recent);
  return recent.length >= DAILY_LIMIT ? recent[recent.length - DAILY_LIMIT] + DAY_MS - now : 0;
}

function formatWait(ms) {
  const mins = Math.ceil(ms / 60000);
  const h = Math.floor(mins / 60);
  return h ? `${h} h ${mins % 60} min` : `${mins} min`;
}

function secretMatches(given, expected) {
  const a = crypto.createHash("sha256").update(String(given || "")).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

// Slow down password guessing on the owner overview: 10 wrong tokens per IP per hour
const adminFailures = new Map();

function adminLocked(ip) {
  const since = Date.now() - 60 * 60 * 1000;
  const recent = (adminFailures.get(ip) || []).filter((t) => t > since);
  adminFailures.set(ip, recent);
  return recent.length >= 10;
}

// ── Runner (one scan at a time) ─────────────────────────────
function runNext() {
  if (running || !queue.length) return;
  const job = jobs.get(queue.shift());
  if (!job) return runNext();

  running = job;
  job.status = "running";
  job.startedAt = Date.now();
  saveJob(job);

  const args = [
    "--site", job.site,
    "--root", __dirname,
    "--config-file", CONFIG_FILE,
    "--output-path", reportDir(job.id),
    "--router-prefix", `${ROUTE_PREFIX}/report/${job.id}/`,
    "--reporter", "jsonExpanded",
    "--build-static",
    "--no-cache",
  ];
  // detached → own process group, so a timeout can kill Chrome along with the CLI
  const child = spawn(CLI_BIN, args, { cwd: __dirname, detached: true, stdio: ["ignore", "ignore", "pipe"] });

  let stderr = "";
  child.stderr.on("data", (chunk) => {
    stderr = (stderr + chunk).slice(-4000);
  });

  const timer = setTimeout(() => {
    job.error = "Audit trval príliš dlho a bol zastavený. Skús to prosím neskôr.";
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch {}
  }, TIMEOUT_MS);

  const finish = (ok, fallbackError) => {
    clearTimeout(timer);
    job.finishedAt = Date.now();
    job.status = ok ? "done" : "failed";
    if (!ok) {
      job.error = job.error || fallbackError;
      console.error(`SEO audit ${job.id} (${job.site}) failed:`, stderr);
    }
    saveJob(job);
    running = null;
    runNext();
  };

  child.on("error", (err) => {
    console.error("Unlighthouse could not start:", err);
    finish(false, "Audit sa nepodarilo spustiť.");
  });
  child.on("exit", (code) => {
    if (running !== job) return; // already handled by 'error'
    if (code !== 0 || !fs.existsSync(path.join(reportDir(job.id), "ci-result.json"))) {
      return finish(false, "Web sa nepodarilo skontrolovať. Je verejne dostupný?");
    }
    // Sites that block automated visitors still "succeed", just with zero pages
    const pages = readResult(job).pages.length;
    finish(pages > 0, "Web neumožnil automatickú kontrolu (pravdepodobne blokuje roboty). Skús inú adresu alebo nám napíš.");
  });
}

// ── Response shaping ────────────────────────────────────────
const pct = (score) => (typeof score === "number" ? Math.round(score * 100) : null);
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const METRICS = ["largest-contentful-paint", "cumulative-layout-shift", "total-blocking-time", "first-contentful-paint"];

function categoryScores(categories = {}) {
  return Object.fromEntries(CATEGORIES.map((c) => [c, pct(categories[c]?.score)]));
}

// The summary's `score` / `displayValue` hold the last scanned page, not the site – use the averages
function formatMetric(name, value) {
  if (typeof value !== "number") return null;
  if (name === "cumulative-layout-shift") return value.toFixed(3);
  if (name === "total-blocking-time") return `${Math.round(value)} ms`;
  return `${(value / 1000).toFixed(1)} s`;
}

function readResult(job) {
  const result = JSON.parse(fs.readFileSync(path.join(reportDir(job.id), "ci-result.json"), "utf8"));
  const summary = result.summary || {};
  return {
    categories: Object.fromEntries(
      CATEGORIES.map((c) => [c, pct(summary.categories?.[c]?.averageScore ?? summary.categories?.[c]?.score)]),
    ),
    metrics: Object.fromEntries(
      METRICS.map((m) => [m, formatMetric(m, summary.metrics?.[m]?.averageNumericValue)]),
    ),
    pages: (result.routes || []).map((r) => ({
      path: r.path,
      score: pct(r.score),
      categories: categoryScores(r.categories),
    })),
  };
}

function publicJob(job) {
  const body = {
    id: job.id,
    site: job.site,
    status: job.status,
    createdAt: job.createdAt,
    startedAt: job.startedAt ?? null,
    finishedAt: job.finishedAt ?? null,
  };
  if (job.status === "queued") body.position = queue.indexOf(job.id) + 1;
  if (job.status === "failed") body.error = job.error;
  if (job.status === "done") {
    try {
      body.result = readResult(job);
      body.reportUrl = `${ROUTE_PREFIX}/report/${job.id}/`;
    } catch {
      body.status = "failed";
      body.error = "Výsledok auditu sa nepodarilo načítať.";
    }
  }
  return body;
}

// ── Routes ──────────────────────────────────────────────────
const router = express.Router();

router.get("/config", (_req, res) => {
  res.json({
    requiresCode: Boolean(ACCESS_CODE),
    maxPages: Number(process.env.SEO_AUDIT_MAX_PAGES) || 15,
    dailyLimit: DAILY_LIMIT,
    retentionDays: RETENTION_MS / (24 * 60 * 60 * 1000),
  });
});

router.post("/", async (req, res) => {
  const { url, accessCode } = req.body || {};

  if (ACCESS_CODE && !secretMatches(accessCode, ACCESS_CODE)) {
    return res.status(403).json({ error: "Nesprávny prístupový kód." });
  }

  let site;
  try {
    site = await normaliseSite(url);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  // Same site already in progress or freshly scanned → hand back that job
  const existing = [...jobs.values()].find(
    (j) =>
      j.site === site &&
      (j.status === "queued" || j.status === "running" ||
        (j.status === "done" && Date.now() - j.finishedAt < REUSE_MS)),
  );
  if (existing) return res.json(publicJob(existing));

  const wait = waitTime(req.ip);
  if (wait > 0) {
    return res.status(429).json({
      error: `Denný limit auditov pre tvoju IP adresu je vyčerpaný. Ďalší audit môžeš spustiť o ${formatWait(wait)}.`,
    });
  }
  if (queue.length >= MAX_QUEUE) {
    return res.status(503).json({ error: "Práve prebieha veľa auditov. Skús to o pár minút." });
  }

  const job = { id: crypto.randomUUID(), site, status: "queued", createdAt: Date.now() };
  fs.mkdirSync(jobDir(job.id), { recursive: true });
  saveJob(job);
  jobs.set(job.id, job);
  queue.push(job.id);
  hits.get(req.ip).push(Date.now());

  runNext();
  res.status(202).json(publicJob(job));
});

// Owner overview of every audit (disabled unless SEO_AUDIT_ADMIN_TOKEN is set)
router.get("/admin/audits", (req, res) => {
  if (!ADMIN_TOKEN) return res.status(404).json({ error: "Prehľad auditov nie je zapnutý (SEO_AUDIT_ADMIN_TOKEN)." });
  if (adminLocked(req.ip)) return res.status(429).json({ error: "Príliš veľa nesprávnych pokusov. Skús to o hodinu." });

  const token = (req.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!secretMatches(token, ADMIN_TOKEN)) {
    adminFailures.get(req.ip).push(Date.now());
    return res.status(401).json({ error: "Nesprávne heslo." });
  }

  const audits = [...jobs.values()]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((job) => {
      const { result, ...rest } = publicJob(job);
      return result ? { ...rest, categories: result.categories, pageCount: result.pages.length } : rest;
    });
  res.json({ audits });
});

router.get("/:id", (req, res) => {
  const job = ID_RE.test(req.params.id) && jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: "Audit sa nenašiel alebo už vypršal." });
  res.json(publicJob(job));
});

// Static Unlighthouse report – the unguessable id is the access token
router.use("/report/:id", (req, res, next) => {
  if (!ID_RE.test(req.params.id)) return next();
  express.static(reportDir(req.params.id))(req, res, next);
});

module.exports = router;
