import { errorMessage } from "../i18n/errors";
import { useI18n } from "../i18n/LocaleContext";
import { FormEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Check, ExternalLink, Link2, Loader2, RotateCcw, Search } from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { Aurora } from "../components/fx/Aurora";
import { FaqAccordion } from "../components/fx/FaqAccordion";
import { GlowCard } from "../components/fx/GlowCard";
import { MagneticButton } from "../components/fx/MagneticButton";
import { PageHero } from "../components/fx/PageHero";
import { SectionHeading } from "../components/fx/SectionHeading";
import { useTypedBeforeLoad } from "../lib/useTypedBeforeLoad";
import { inputBase, inputDefaultBorder, inputErrorBorder, labelBase } from "../components/forms/fieldStyles";

export type Category = "performance" | "accessibility" | "best-practices" | "seo";
export type Scores = Record<Category, number | null>;

interface AuditJob {
  id: string;
  site: string;
  status: "queued" | "running" | "done" | "failed";
  startedAt: number | null;
  position?: number;
  error?: string;
  code?: string;
  reportUrl?: string;
  result?: {
    categories: Scores;
    metrics: Record<string, string | null>;
    pages: { path: string; score: number | null; categories: Scores }[];
  };
}

export const categories: { key: Category; label: string }[] = [
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

// Worded from the audits Lighthouse 12 runs in each category: keep in step when it's upgraded
const checks = [
  {
    title: "SEO",
    text: "Či môže Google stránku indexovať, či má titulok a popis, správnu kanonickú adresu, funkčné odkazy s výstižným textom a popisy obrázkov. Bez toho vás Google ťažšie nájde a horšie pochopí, o čom stránka je.",
  },
  {
    title: "Rýchlosť",
    text: "Ako rýchlo sa na mobile zobrazí obsah, kedy stránka začne reagovať a či počas načítania neposkakuje. Pomalá stránka odrádza návštevníkov.",
  },
  {
    title: "Prístupnosť",
    text: "Kontrast textu, popisy obrázkov, názvy tlačidiel a formulárových polí a veľkosť prvkov, na ktoré sa kliká. Dobre čitateľný a ovládateľný web pomáha každému návštevníkovi.",
  },
  {
    title: "Osvedčené postupy",
    text: "HTTPS, chyby v prehliadači, zastarané technológie a správne zobrazenie na mobile vrátane veľkosti písma a obrázkov.",
  },
];

const scoreBands = [
  { range: "90–100", label: "V poriadku", color: "#1AFF8C" },
  { range: "50–89", label: "Je čo zlepšiť", color: "#f59e0b" },
  { range: "0–49", label: "Treba riešiť", color: "#ef4444" },
];

const faqs = ({ maxPages, retentionDays }: AuditConfig, language: "sk" | "en") => [
  {
    q: "Čo presne audit kontroluje?",
    a: language === "en" ? `We check up to ${maxPages} pages using Google Lighthouse through Unlighthouse. Each page is measured for SEO, performance, accessibility, and best practices, with mobile simulation.` : `Prejdeme až ${maxPages} podstránok vášho webu nástrojom Google Lighthouse (cez Unlighthouse) a pre každú zmeriame SEO, rýchlosť načítania, prístupnosť a technické osvedčené postupy. Meriame ako na mobile.`,
  },
  {
    q: "Ako dlho to trvá?",
    a: "Zvyčajne 1–5 minút podľa veľkosti a rýchlosti webu. Stránku môžete nechať otvorenú alebo si skopírovať odkaz a vrátiť sa neskôr.",
  },
  {
    q: "Prečo mám iné skóre ako v PageSpeed Insights?",
    a: "Lighthouse meria v simulovaných podmienkach a výsledok sa medzi meraniami mierne líši. Berte skóre ako orientačné – dôležitý je trend a konkrétne odporúčania v detailnom reporte.",
  },
  {
    q: "Ako dlho je report dostupný?",
    a: language === "en" ? `The results link is available for ${retentionDays} days. Anyone with the link can view it, so share it only with people you choose.` : `Odkaz na výsledky platí ${retentionDays} dní. Kto má odkaz, report uvidí – zdieľajte ho len s tým, s kým chcete.`,
  },
];

export const scoreColor = (score: number | null) =>
  score === null ? "#F5F5F0" : score >= 90 ? "#1AFF8C" : score >= 50 ? "#f59e0b" : "#ef4444";

function ScoreRing({ score, label }: { score: number | null; label: string }) {
  const { t: tr } = useI18n();
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
          {tr(score ?? "–")}
        </span>
      </div>
      <span className="text-[0.85rem] text-[#F5F5F0]/60">{tr(label)}</span>
    </div>
  );
}

function ScoreCell({ score }: { score: number | null }) {
  const { t: tr } = useI18n();
  return (
    <td className="px-3 py-3 text-center font-heading font-semibold tabular-nums" style={{ color: scoreColor(score) }}>
      {tr(score ?? "–")}
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
  const { t: tr, locale: language } = useI18n();
  const elapsed = useElapsed(job.status === "running" ? job.startedAt : null);
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <Loader2 size={40} className="mb-6 animate-spin text-[#9F97FF]" />
      <p className="mb-2 font-heading text-[1.2rem] font-bold text-[#F5F5F0]">
        {tr(job.status === "queued" ? "Čakáte v rade" : "Kontrolujeme váš web")}
      </p>
      <p className="mb-1 text-[0.9rem] text-[#F5F5F0]/50">{tr(job.site)}</p>
      <p className="text-[0.85rem] text-[#F5F5F0]/50">
        {tr(job.status === "queued"
          ? language === "en" ? `Queue position: ${job.position ?? 1}. We will start when a slot is free.` : `Počet auditov pred vami: ${job.position ?? 1}. Začneme hneď, ako sa uvoľní miesto.`
          : language === "en" ? `Checking your pages. Usually 1–5 minutes${elapsed ? ` · ${elapsed}` : ""}.` : `Prechádzame podstránky a meriame každú z nich. Zvyčajne 1–5 minút${elapsed ? ` · ${elapsed}` : ""}.`)}
      </p>
    </div>
  );
}

function Results({ job, onReset }: { job: AuditJob; onReset: () => void }) {
  const { t: tr, link: localLink, locale: language } = useI18n();
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
          <p className="mb-1 text-[0.75rem] uppercase tracking-wider text-[#9F97FF]">{tr("Výsledok auditu")}</p>
          <h3 className="break-all font-heading text-[1.3rem] font-bold text-[#F5F5F0]">{tr(job.site)}</h3>
          <p className="text-[0.8rem] text-[#F5F5F0]/50">{tr("Skontrolovaných podstránok: ")}{tr(result.pages.length)}{tr(" · meranie na mobile")}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[0.8rem] text-[#F5F5F0]/70 transition-colors hover:border-[#6C63FF]/40 hover:text-white"
          >
            {copied ? <Check size={14} /> : <Link2 size={14} />}
            {tr(copied ? "Skopírované" : "Kopírovať odkaz")}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[0.8rem] text-[#F5F5F0]/70 transition-colors hover:border-[#6C63FF]/40 hover:text-white"
          >
            <RotateCcw size={14} />{tr(" Nový audit")}</button>
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
            <p className="mb-1 text-[0.75rem] text-[#F5F5F0]/50">
              {tr(m.label)} <span className="text-[#F5F5F0]/50">{"("}{tr(m.abbr)}{")"}</span>
            </p>
            <p className="font-heading text-[1.25rem] font-bold text-[#F5F5F0]">{tr(result.metrics[m.key] ?? "–")}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full min-w-[520px] text-[0.85rem]">
          <thead>
            <tr className="border-b border-white/5 bg-surface-2 text-[0.75rem] text-[#F5F5F0]/50">
              <th className="px-4 py-3 text-left font-normal">{tr("Podstránka")}</th>
              {categories.map((c) => (
                <th key={c.key} className="px-3 py-3 text-center font-normal">
                  {tr(c.label)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.pages.map((p) => (
              <tr key={p.path} className="border-b border-white/5 last:border-0">
                <td className="max-w-[240px] truncate px-4 py-3 text-[#F5F5F0]/70" title={tr(p.path)}>
                  {tr(p.path)}
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
          href={localLink(job.reportUrl)}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-[#9F97FF] transition-colors hover:text-white"
        >{tr("Otvoriť detailný report s odporúčaniami ")}<ExternalLink size={15} />
        </a>
      )}
      {language !== "en" && <p className="mt-1 text-[0.75rem] text-[#F5F5F0]/50">{tr("Detailný report je v angličtine (Unlighthouse).")}</p>}
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
  const { t: tr, link: localLink, locale: language } = useI18n();
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
  useTypedBeforeLoad("audit-form", (name, value) => (name === "url" ? setUrl(value) : setAccessCode(value)));

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
        res = await fetch(`/api/seo-audit/${auditId}`, { headers: { "X-Site-Locale": language } });
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
        setError(errorMessage(body, language, tr("Audit sa nenašiel.")));
        setSearchParams({}, { replace: true });
        return;
      }
      if (!res.ok) {
        timer = setTimeout(poll, 5000);
        return;
      }
      setJob({ ...body, error: body.error ? errorMessage(body, language, tr("Audit sa nepodarilo spustiť.")) : undefined });
      if (body.status === "queued" || body.status === "running") timer = setTimeout(poll, 3000);
    };
    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [auditId, setSearchParams, language, tr]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Zadajte adresu webu.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Site-Locale": language },
        body: JSON.stringify({ url, accessCode }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(errorMessage(body, language, tr("Audit sa nepodarilo spustiť.")));
      setJob({ ...body, error: body.error ? errorMessage(body, language, tr("Audit sa nepodarilo spustiť.")) : undefined });
      setSearchParams({ audit: body.id });
    } catch (err) {
      setError(err instanceof Error && !(err instanceof TypeError) ? err.message : tr("Audit sa nepodarilo spustiť."));
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
        title={tr("Bezplatný SEO audit webu")}
        segments={tr([
          { text: "Ako na tom je" },
          { text: "váš web?", className: "text-gradient-primary" },
        ])}
        sub={tr("Zadajte adresu svojej stránky a do pár minút uvidíte skóre SEO, rýchlosti a prístupnosti pre každú podstránku – rovnakými nástrojmi, aké používa Google.")}
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
                    <form id="audit-form" onSubmit={handleSubmit} noValidate>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                        <div className="flex-1">
                          <label htmlFor="audit-url" className={labelBase}>{tr("Adresa webu")}</label>
                          <input
                            id="audit-url"
                            name="url"
                            type="text"
                            inputMode="url"
                            autoComplete="url"
                            placeholder={tr("mojafirma.sk")}
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className={`${inputBase} ${error ? inputErrorBorder : inputDefaultBorder}`}
                          />
                        </div>
                        {config.requiresCode && (
                          <div className="sm:w-48">
                            <label htmlFor="audit-code" className={labelBase}>{tr("Prístupový kód")}</label>
                            <input
                              id="audit-code"
                              name="accessCode"
                              type="text"
                              autoComplete="off"
                              value={accessCode}
                              onChange={(e) => setAccessCode(e.target.value)}
                              className={`${inputBase} ${inputDefaultBorder}`}
                            />
                          </div>
                        )}
                        <MagneticButton type="submit" disabled={submitting} arrow={false} className="shrink-0">
                          {submitting ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}{tr("Spustiť audit")}</MagneticButton>
                      </div>
                      {error && (
                        <p role="alert" className="mt-3 text-[0.85rem] text-red-400">
                          {tr(error)}
                        </p>
                      )}
                      <p className="mt-4 text-[0.8rem] text-[#F5F5F0]/50">{tr("Skontrolujeme až ")}{tr(config.maxPages)}{tr(" podstránok. Audit trvá zvyčajne 1–5 minút. Z jednej IP adresy je možný ")}{language === "en" ? `${config.dailyLimit} audit${config.dailyLimit === 1 ? "" : "s"} per day` : auditsPerDay(config.dailyLimit)}{tr(". Výsledky uchovávame")}{" "}
                        {tr(config.retentionDays)}{tr(" dní.")}{" "}
                        <Link to={localLink("/ochrana-osobnych-udajov/")} className="underline transition-colors hover:text-[#9F97FF]">{tr("Ochrana osobných údajov")}</Link>
                      </p>
                    </form>
                  )}

                  {view === "progress" && job && <Progress job={job} />}

                  {view === "failed" && job && (
                    <div className="flex flex-col items-center py-10 text-center">
                      <p className="mb-2 font-heading text-[1.2rem] font-bold text-[#F5F5F0]">{tr("Audit sa nepodaril")}</p>
                      <p className="mb-6 max-w-md text-[0.9rem] text-[#F5F5F0]/50">{tr(job.error)}</p>
                      <MagneticButton variant="ghost" onClick={reset} arrow={false}>
                        <RotateCcw size={16} />{tr(" Skúsiť znova")}</MagneticButton>
                    </div>
                  )}

                  {view === "done" && job && <Results job={job} onReset={reset} />}
                </motion.div>
              </AnimatePresence>
            </GlowCard>
          </AnimateIn>
        </div>
      </section>

      {/* Method */}
      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading
            eyebrow={tr("Metodika")}
            segments={tr([{ text: "Čo audit kontroluje" }, { text: "a prečo.", className: "text-gradient-primary" }])}
            className="mb-12"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {checks.map((check, i) => (
              <AnimateIn key={check.title} delay={i * 0.08} className="h-full">
                <GlowCard className="h-full p-6">
                  <h3 className="mb-2 font-heading text-[1.05rem] font-bold text-[#F5F5F0]">{tr(check.title)}</h3>
                  <p className="text-[0.875rem] leading-relaxed text-[#F5F5F0]/50">{tr(check.text)}</p>
                </GlowCard>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn className="mt-12 space-y-8 text-[0.95rem] leading-relaxed text-[#F5F5F0]/60">
            <div>
              <h3 className="mb-3 font-heading text-[1.05rem] font-bold text-[#F5F5F0]">{tr("Ako čítať skóre")}</h3>
              <ul className="flex flex-wrap gap-x-8 gap-y-2">
                {scoreBands.map((band) => (
                  <li key={band.range}>
                    <span className="font-semibold" style={{ color: band.color }}>
                      {tr(band.range)}
                    </span>{" "}
                    {tr(band.label)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-heading text-[1.05rem] font-bold text-[#F5F5F0]">{tr("Čo automatická kontrola nezistí")}</h3>
              <p>{tr("Nástroj hodnotí technickú stránku webu. Neposúdi kvalitu textov, kľúčové slová, konkurenciu ani spätné odkazy a nepovie vám, na akej pozícii v Google ste. Skóre 100 preto neznamená prvé miesto vo vyhľadávaní – znamená, že nástroj nenašiel chyby, ktoré vie odhaliť.")}</p>
            </div>
            <div>
              <h3 className="mb-3 font-heading text-[1.05rem] font-bold text-[#F5F5F0]">{tr("Bezplatná kontrola a SEO audit za 199 €")}</h3>
              <p>{tr("Bezplatná kontrola je automatické skóre. SEO audit za 199 € robíme ručne: prejdeme indexovanie, štruktúru a odkazy, titulky a nadpisy aj to, či texty zodpovedajú tomu, čo ľudia hľadajú. Dostanete písomnú správu a zoznam opráv zoradený podľa dôležitosti.")}{" "}
                <Link to={localLink("/cennik/")} className="text-[#9F97FF] underline underline-offset-2 hover:text-[#F5F5F0]">{tr("Pozrieť cenník →")}</Link>
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-bg-deep py-20">
        <Aurora variant="cta" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <AnimateIn>
            <p className="mb-2 text-[1.1rem] text-[#F5F5F0]/70">{tr("Skóre nie je také, aké by ste chceli?")}</p>
            <p className="mb-8 text-[0.95rem] text-[#F5F5F0]/50">{tr("Pripravíme vám návrh rýchlejšieho a lepšie dohľadateľného webu – do 24 hodín, zadarmo.")}</p>
            <MagneticButton to={localLink("/#formular")} size="lg">{tr("Chcem návrh zadarmo")}</MagneticButton>
          </AnimateIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow={tr("FAQ")}
            segments={tr([{ text: "Časté" }, { text: "otázky.", className: "text-gradient-primary" }])}
            className="mb-12"
          />
          <AnimateIn>
            <FaqAccordion items={tr(faqs(config, language))} />
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
