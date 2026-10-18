import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Check, ExternalLink, Link2, Loader2, RotateCcw, Search } from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { Aurora } from "../components/fx/Aurora";
import { FaqAccordion } from "../components/fx/FaqAccordion";
import { GlowCard } from "../components/fx/GlowCard";
import { MagneticButton } from "../components/fx/MagneticButton";
import { PageHero } from "../components/fx/PageHero";
import { SectionHeading } from "../components/fx/SectionHeading";
import { inputBase, inputDefaultBorder, inputErrorBorder, labelBase } from "../components/forms/fieldStyles";

type Category = "performance" | "accessibility" | "best-practices" | "seo";
type Scores = Record<Category, number | null>;

interface AuditJob {
  id: string;
  site: string;
  status: "queued" | "running" | "done" | "failed";
  startedAt: number | null;
  position?: number;
  error?: string;
  reportUrl?: string;
  result?: {
    categories: Scores;
    metrics: Record<string, string | null>;
    pages: { path: string; score: number | null; categories: Scores }[];
  };
}

const categories: { key: Category; label: string }[] = [
  { key: "seo", label: "SEO" },
  { key: "performance", label: "Výkon" },
  { key: "accessibility", label: "Prístupnosť" },
  { key: "best-practices", label: "Osvedčené postupy" },
];

const metrics = [
  { key: "largest-contentful-paint", label: "Načítanie hlavného obsahu", abbr: "LCP" },
  { key: "first-contentful-paint", label: "Prvé vykreslenie", abbr: "FCP" },
  { key: "total-blocking-time", label: "Blokovanie interakcie", abbr: "TBT" },
  { key: "cumulative-layout-shift", label: "Posun rozloženia", abbr: "CLS" },
];

interface AuditConfig {
  requiresCode: boolean;
  maxPages: number;
  retentionDays: number;
  dailyLimit: number;
}

const auditsPerDay = (n: number) =>
  n === 1 ? "1 audit denne" : n < 5 ? `${n} audity denne` : `${n} auditov denne`;

const faqs = ({ maxPages, retentionDays }: AuditConfig) => [
  {
    q: "Čo presne audit kontroluje?",
    a: `Prejdeme až ${maxPages} podstránok tvojho webu nástrojom Google Lighthouse (cez Unlighthouse) a pre každú zmeriame SEO, rýchlosť načítania, prístupnosť a technické osvedčené postupy. Meriame ako na mobile.`,
  },
  {
    q: "Ako dlho to trvá?",
    a: "Zvyčajne 1–5 minút podľa veľkosti a rýchlosti webu. Stránku môžeš nechať otvorenú, alebo si skopírovať odkaz a vrátiť sa neskôr.",
  },
  {
    q: "Prečo mám iné skóre ako v PageSpeed Insights?",
    a: "Lighthouse meria v simulovaných podmienkach a výsledok sa medzi meraniami mierne líši. Ber skóre ako orientačné – dôležitý je trend a konkrétne odporúčania v detailnom reporte.",
  },
  {
    q: "Ako dlho je report dostupný?",
    a: `Odkaz na výsledky platí ${retentionDays} dní. Kto má odkaz, report uvidí – zdieľaj ho len s kým chceš.`,
  },
];

const scoreColor = (score: number | null) =>
  score === null ? "#F5F5F0" : score >= 90 ? "#1AFF8C" : score >= 50 ? "#f59e0b" : "#ef4444";

function ScoreRing({ score, label }: { score: number | null; label: string }) {
  const r = 34;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - (score ?? 0) / 100);
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <motion.circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center font-heading text-[1.6rem] font-bold"
          style={{ color }}
        >
          {score ?? "–"}
        </span>
      </div>
      <span className="text-[0.85rem] text-[#F5F5F0]/60">{label}</span>
    </div>
  );
}

function ScoreCell({ score }: { score: number | null }) {
  return (
    <td className="px-3 py-3 text-center font-heading font-semibold tabular-nums" style={{ color: scoreColor(score) }}>
      {score ?? "–"}
    </td>
  );
}

function useElapsed(since: number | null) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!since) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [since]);
  if (!since) return null;
  const s = Math.max(0, Math.floor((now - since) / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function Progress({ job }: { job: AuditJob }) {
  const elapsed = useElapsed(job.status === "running" ? job.startedAt : null);
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <Loader2 size={40} className="mb-6 animate-spin text-[#9F97FF]" />
      <p className="mb-2 font-heading text-[1.2rem] font-bold text-[#F5F5F0]">
        {job.status === "queued" ? "Čakáš v rade" : "Kontrolujeme tvoj web"}
      </p>
      <p className="mb-1 text-[0.9rem] text-[#F5F5F0]/50">{job.site}</p>
      <p className="text-[0.85rem] text-[#F5F5F0]/40">
        {job.status === "queued"
          ? `Počet auditov pred tebou: ${job.position ?? 1}. Začneme hneď, ako sa uvoľní miesto.`
          : `Prechádzame podstránky a meriame každú z nich. Zvyčajne 1–5 minút${elapsed ? ` · ${elapsed}` : ""}.`}
      </p>
    </div>
  );
}

function Results({ job, onReset }: { job: AuditJob; onReset: () => void }) {
  const [copied, setCopied] = useState(false);
  const result = job.result!;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked – the URL is still in the address bar
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="mb-1 text-[0.75rem] uppercase tracking-wider text-[#9F97FF]">Výsledok auditu</p>
          <h3 className="break-all font-heading text-[1.3rem] font-bold text-[#F5F5F0]">{job.site}</h3>
          <p className="text-[0.8rem] text-[#F5F5F0]/40">
            Skontrolovaných podstránok: {result.pages.length} · meranie na mobile
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[0.8rem] text-[#F5F5F0]/70 transition-colors hover:border-[#6C63FF]/40 hover:text-white"
          >
            {copied ? <Check size={14} /> : <Link2 size={14} />}
            {copied ? "Skopírované" : "Kopírovať odkaz"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[0.8rem] text-[#F5F5F0]/70 transition-colors hover:border-[#6C63FF]/40 hover:text-white"
          >
            <RotateCcw size={14} /> Nový audit
          </button>
        </div>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
        {categories.map((c) => (
          <ScoreRing key={c.key} score={result.categories[c.key]} label={c.label} />
        ))}
      </div>

      <div className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.key} className="rounded-xl border border-white/5 bg-surface-2 p-4">
            <p className="mb-1 text-[0.75rem] text-[#F5F5F0]/40">
              {m.label} <span className="text-[#F5F5F0]/25">({m.abbr})</span>
            </p>
            <p className="font-heading text-[1.25rem] font-bold text-[#F5F5F0]">{result.metrics[m.key] ?? "–"}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full min-w-[520px] text-[0.85rem]">
          <thead>
            <tr className="border-b border-white/5 bg-surface-2 text-[0.75rem] text-[#F5F5F0]/40">
              <th className="px-4 py-3 text-left font-normal">Podstránka</th>
              {categories.map((c) => (
                <th key={c.key} className="px-3 py-3 text-center font-normal">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.pages.map((p) => (
              <tr key={p.path} className="border-b border-white/5 last:border-0">
                <td className="max-w-[240px] truncate px-4 py-3 text-[#F5F5F0]/70" title={p.path}>
                  {p.path}
                </td>
                {categories.map((c) => (
                  <ScoreCell key={c.key} score={p.categories[c.key]} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {job.reportUrl && (
        <a
          href={job.reportUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-[#9F97FF] transition-colors hover:text-white"
        >
          Otvoriť detailný report s odporúčaniami <ExternalLink size={15} />
        </a>
      )}
      <p className="mt-1 text-[0.75rem] text-[#F5F5F0]/30">Detailný report je v angličtine (Unlighthouse).</p>
    </div>
  );
}

// Remember the visitor's last audit so leaving the page (e.g. via the menu,
// which drops ?audit=) and coming back still shows it
const LAST_AUDIT_KEY = "seoAudit.lastId";

const lastAudit = {
  get: () => {
    try {
      return localStorage.getItem(LAST_AUDIT_KEY);
    } catch {
      return null;
    }
  },
  set: (id: string) => {
    try {
      localStorage.setItem(LAST_AUDIT_KEY, id);
    } catch {}
  },
  clear: () => {
    try {
      localStorage.removeItem(LAST_AUDIT_KEY);
    } catch {}
  },
};

export function SeoAuditPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const auditId = searchParams.get("audit");

  const [config, setConfig] = useState<AuditConfig>({
    requiresCode: false,
    maxPages: 15,
    retentionDays: 30,
    dailyLimit: 1,
  });
  const [url, setUrl] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [job, setJob] = useState<AuditJob | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/seo-audit/config")
      .then((r) => r.json())
      .then((c) => setConfig((prev) => ({ ...prev, ...c })))
      .catch(() => {});
  }, []);

  // Poll the audit named in the URL until it finishes
  useEffect(() => {
    if (!auditId) {
      const remembered = lastAudit.get();
      if (remembered) setSearchParams({ audit: remembered }, { replace: true });
      else setJob(null);
      return;
    }
    lastAudit.set(auditId);
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      let res: Response;
      let body: any;
      try {
        res = await fetch(`/api/seo-audit/${auditId}`);
        body = await res.json();
      } catch {
        // Network hiccup or server restarting – keep the audit and try again
        if (!cancelled) timer = setTimeout(poll, 5000);
        return;
      }
      if (cancelled) return;
      if (res.status === 404) {
        lastAudit.clear();
        setJob(null);
        setError(body.error || "Audit sa nenašiel.");
        setSearchParams({}, { replace: true });
        return;
      }
      if (!res.ok) {
        timer = setTimeout(poll, 5000);
        return;
      }
      setJob(body);
      if (body.status === "queued" || body.status === "running") timer = setTimeout(poll, 3000);
    };
    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [auditId, setSearchParams]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Zadaj adresu webu.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, accessCode }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Audit sa nepodarilo spustiť.");
      setJob(body);
      setSearchParams({ audit: body.id });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audit sa nepodarilo spustiť.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    lastAudit.clear();
    setJob(null);
    setError("");
    setSearchParams({});
  };

  const view = !job ? "form" : job.status === "done" ? "done" : job.status === "failed" ? "failed" : "progress";

  return (
    <>
      <PageHero
        eyebrow="SEO audit zadarmo"
        segments={[
          { text: "Ako na tom je" },
          { text: "tvoj web?", className: "text-gradient-primary" },
        ]}
        sub="Zadaj adresu svojej stránky a do pár minút uvidíš skóre SEO, rýchlosti a prístupnosti pre každú podstránku – rovnakými nástrojmi, aké používa Google."
      />

      <section className="pb-24 pt-4">
        <div className="mx-auto max-w-4xl px-6">
          <AnimateIn>
            <GlowCard className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {view === "form" && (
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                        <div className="flex-1">
                          <label htmlFor="audit-url" className={labelBase}>
                            Adresa webu
                          </label>
                          <input
                            id="audit-url"
                            type="text"
                            inputMode="url"
                            autoComplete="url"
                            placeholder="mojafirma.sk"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className={`${inputBase} ${error ? inputErrorBorder : inputDefaultBorder}`}
                          />
                        </div>
                        {config.requiresCode && (
                          <div className="sm:w-48">
                            <label htmlFor="audit-code" className={labelBase}>
                              Prístupový kód
                            </label>
                            <input
                              id="audit-code"
                              type="text"
                              autoComplete="off"
                              value={accessCode}
                              onChange={(e) => setAccessCode(e.target.value)}
                              className={`${inputBase} ${inputDefaultBorder}`}
                            />
                          </div>
                        )}
                        <MagneticButton type="submit" disabled={submitting} arrow={false} className="shrink-0">
                          {submitting ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                          Spustiť audit
                        </MagneticButton>
                      </div>
                      {error && (
                        <p role="alert" className="mt-3 text-[0.85rem] text-red-400">
                          {error}
                        </p>
                      )}
                      <p className="mt-4 text-[0.8rem] text-[#F5F5F0]/35">
                        Skontrolujeme až {config.maxPages} podstránok. Audit trvá zvyčajne 1–5 minút. Z jednej
                        IP adresy je možný {auditsPerDay(config.dailyLimit)}.
                      </p>
                    </form>
                  )}

                  {view === "progress" && job && <Progress job={job} />}

                  {view === "failed" && job && (
                    <div className="flex flex-col items-center py-10 text-center">
                      <p className="mb-2 font-heading text-[1.2rem] font-bold text-[#F5F5F0]">Audit sa nepodaril</p>
                      <p className="mb-6 max-w-md text-[0.9rem] text-[#F5F5F0]/50">{job.error}</p>
                      <MagneticButton variant="ghost" onClick={reset} arrow={false}>
                        <RotateCcw size={16} /> Skúsiť znova
                      </MagneticButton>
                    </div>
                  )}

                  {view === "done" && job && <Results job={job} onReset={reset} />}
                </motion.div>
              </AnimatePresence>
            </GlowCard>
          </AnimateIn>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-bg-deep py-20">
        <Aurora variant="cta" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <AnimateIn>
            <p className="mb-2 text-[1.1rem] text-[#F5F5F0]/70">Skóre nie je také, aké by si chcel?</p>
            <p className="mb-8 text-[0.95rem] text-[#F5F5F0]/40">
              Pripravíme ti návrh rýchlejšieho a lepšie dohľadateľného webu – do 24 hodín, zadarmo.
            </p>
            <MagneticButton to="/#formular" size="lg">
              Chcem návrh zadarmo
            </MagneticButton>
          </AnimateIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow="FAQ"
            segments={[{ text: "Časté" }, { text: "otázky.", className: "text-gradient-primary" }]}
            className="mb-12"
          />
          <AnimateIn>
            <FaqAccordion items={faqs(config)} />
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
