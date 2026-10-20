import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { ExternalLink, Loader2, LogOut, RefreshCw, Search } from "lucide-react";
import { GlowCard } from "../components/fx/GlowCard";
import { MagneticButton } from "../components/fx/MagneticButton";
import { PageHero } from "../components/fx/PageHero";
import { inputBase, inputDefaultBorder, inputErrorBorder, labelBase } from "../components/forms/fieldStyles";
import { categories, scoreColor, Scores } from "./SeoAuditPage";

interface AdminAudit {
  id: string;
  site: string;
  status: "queued" | "running" | "done" | "failed";
  createdAt: number;
  finishedAt: number | null;
  error?: string;
  byOwner: boolean;
  categories?: Scores;
  pageCount?: number;
  reportUrl?: string;
}

const TOKEN_KEY = "seoAudit.adminToken";

const storedToken = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY) || "";
    } catch {
      return "";
    }
  },
  set: (t: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, t);
    } catch {}
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  },
};

const statusLabels: Record<AdminAudit["status"], { label: string; className: string }> = {
  done: { label: "Hotový", className: "bg-[#1AFF8C]/10 text-[#1AFF8C]" },
  running: { label: "Prebieha", className: "bg-[#6C63FF]/15 text-[#9F97FF]" },
  queued: { label: "V rade", className: "bg-white/5 text-[#F5F5F0]/60" },
  failed: { label: "Zlyhal", className: "bg-red-500/10 text-red-400" },
};

const formatDate = (ts: number) =>
  new Date(ts).toLocaleString("sk-SK", { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/5 bg-surface-2 p-4">
      <p className="mb-1 text-[0.75rem] text-[#F5F5F0]/40">{label}</p>
      <p className="font-heading text-[1.5rem] font-bold text-[#F5F5F0]">{value}</p>
    </div>
  );
}

export function SeoAuditAdminPage() {
  const [token, setToken] = useState(storedToken.get);
  const [input, setInput] = useState("");
  const [audits, setAudits] = useState<AdminAudit[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [site, setSite] = useState("");
  const [startError, setStartError] = useState("");
  const [starting, setStarting] = useState(false);

  const load = useCallback(async (t: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/seo-audit/admin/audits", { headers: { Authorization: `Bearer ${t}` } });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          storedToken.clear();
          setToken("");
        }
        throw new Error(body.error || "Prehľad sa nepodarilo načítať.");
      }
      storedToken.set(t);
      setToken(t);
      setError("");
      setAudits(body.audits);
    } catch (err) {
      setAudits(null);
      setError(err instanceof Error ? err.message : "Prehľad sa nepodarilo načítať.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) load(token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep refreshing while something is still queued or running
  const active = audits?.some((a) => a.status === "queued" || a.status === "running");
  useEffect(() => {
    if (!active || !token) return;
    const t = setTimeout(() => load(token), 10000);
    return () => clearTimeout(t);
  }, [audits, active, token, load]);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) load(input.trim());
  };

  const logout = () => {
    storedToken.clear();
    setToken("");
    setAudits(null);
    setInput("");
  };

  // The owner's own audits skip the access code, daily limit and queue cap
  const startAudit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!site.trim()) {
      setStartError("Zadaj adresu webu.");
      return;
    }
    setStartError("");
    setStarting(true);
    try {
      const res = await fetch("/api/seo-audit/admin/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ url: site }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 401) {
        logout();
        setError(body.error || "Nesprávne heslo.");
        return;
      }
      if (!res.ok) throw new Error(body.error || "Audit sa nepodarilo spustiť.");
      setSite("");
      load(token);
    } catch (err) {
      setStartError(err instanceof Error ? err.message : "Audit sa nepodarilo spustiť.");
    } finally {
      setStarting(false);
    }
  };

  const now = Date.now();
  const stats = audits && {
    today: audits.filter((a) => new Date(a.createdAt).toDateString() === new Date().toDateString()).length,
    week: audits.filter((a) => now - a.createdAt < 7 * 24 * 60 * 60 * 1000).length,
    total: audits.length,
    failed: audits.filter((a) => a.status === "failed").length,
  };

  return (
    <>
      <PageHero
        eyebrow="Pre majiteľa"
        segments={[{ text: "Prehľad" }, { text: "SEO auditov.", className: "text-gradient-primary" }]}
        sub="Všetky audity za posledné obdobie. Vlastné audity tu spustíš bez limitov."
      />

      <section className="pb-24 pt-4">
        <div className="mx-auto max-w-7xl px-6">
          {!audits ? (
            <GlowCard className="mx-auto max-w-md p-6 sm:p-8">
              {loading && token ? (
                <div className="flex justify-center py-6">
                  <Loader2 size={32} className="animate-spin text-[#9F97FF]" />
                </div>
              ) : (
                <form onSubmit={handleLogin} noValidate>
                  <label htmlFor="admin-token" className={labelBase}>
                    Heslo
                  </label>
                  <input
                    id="admin-token"
                    type="password"
                    autoComplete="current-password"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={`${inputBase} ${error ? inputErrorBorder : inputDefaultBorder} mb-4`}
                  />
                  {error && (
                    <p role="alert" className="mb-4 text-[0.85rem] text-red-400">
                      {error}
                    </p>
                  )}
                  <MagneticButton type="submit" disabled={loading} className="w-full">
                    Zobraziť audity
                  </MagneticButton>
                </form>
              )}
            </GlowCard>
          ) : (
            <>
              <GlowCard className="mb-6 p-5 sm:p-6">
                <form onSubmit={startAudit} noValidate>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <label htmlFor="admin-audit-url" className={labelBase}>
                        Nový audit
                      </label>
                      <input
                        id="admin-audit-url"
                        type="text"
                        inputMode="url"
                        autoComplete="url"
                        placeholder="mojafirma.sk"
                        value={site}
                        onChange={(e) => setSite(e.target.value)}
                        className={`${inputBase} ${startError ? inputErrorBorder : inputDefaultBorder}`}
                      />
                    </div>
                    <MagneticButton type="submit" disabled={starting} arrow={false} className="shrink-0">
                      {starting ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                      Spustiť audit
                    </MagneticButton>
                  </div>
                  {startError && (
                    <p role="alert" className="mt-3 text-[0.85rem] text-red-400">
                      {startError}
                    </p>
                  )}
                  <p className="mt-3 text-[0.8rem] text-[#F5F5F0]/35">
                    Bez prístupového kódu a denného limitu. Web skontrolovaný nedávno sa zmeria znova.
                  </p>
                </form>
              </GlowCard>

              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div className="grid flex-1 grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-4">
                  <Stat label="Dnes" value={stats!.today} />
                  <Stat label="Posledných 7 dní" value={stats!.week} />
                  <Stat label="Spolu" value={stats!.total} />
                  <Stat label="Zlyhané" value={stats!.failed} />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => load(token)}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[0.8rem] text-[#F5F5F0]/70 transition-colors hover:border-[#6C63FF]/40 hover:text-white disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Obnoviť
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[0.8rem] text-[#F5F5F0]/70 transition-colors hover:border-[#6C63FF]/40 hover:text-white"
                  >
                    <LogOut size={14} /> Odhlásiť
                  </button>
                </div>
              </div>

              {error && <p className="mb-4 text-[0.85rem] text-red-400">{error}</p>}

              {audits.length === 0 ? (
                <GlowCard className="p-10 text-center text-[0.9rem] text-[#F5F5F0]/50">
                  Zatiaľ nikto nespustil žiadny audit.
                </GlowCard>
              ) : (
                <div className="overflow-x-auto rounded-card border border-white/5 bg-surface-1">
                  <table className="w-full min-w-[900px] text-[0.85rem]">
                    <thead>
                      <tr className="border-b border-white/5 bg-surface-2 text-[0.75rem] text-[#F5F5F0]/40">
                        <th className="px-4 py-3 text-left font-normal">Spustený</th>
                        <th className="px-4 py-3 text-left font-normal">Web</th>
                        <th className="px-3 py-3 text-left font-normal">Stav</th>
                        {categories.map((c) => (
                          <th key={c.key} className="px-3 py-3 text-center font-normal">
                            {c.label}
                          </th>
                        ))}
                        <th className="px-3 py-3 text-center font-normal">Podstránky</th>
                        <th className="px-4 py-3 text-right font-normal">Výsledok</th>
                      </tr>
                    </thead>
                    <tbody>
                      {audits.map((a) => (
                        <tr key={a.id} className="border-b border-white/5 last:border-0">
                          <td className="whitespace-nowrap px-4 py-3 text-[#F5F5F0]/50">{formatDate(a.createdAt)}</td>
                          <td className="max-w-[260px] truncate px-4 py-3">
                            <a
                              href={a.site}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#F5F5F0]/80 transition-colors hover:text-[#9F97FF]"
                              title={a.site}
                            >
                              {a.site.replace(/^https?:\/\//, "")}
                            </a>
                            {a.byOwner && (
                              <span className="ml-2 rounded-full bg-white/5 px-2 py-0.5 text-[0.7rem] text-[#F5F5F0]/50">
                                admin
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <span
                              className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[0.75rem] ${statusLabels[a.status].className}`}
                              title={a.error}
                            >
                              {statusLabels[a.status].label}
                            </span>
                          </td>
                          {categories.map((c) => {
                            const score = a.categories?.[c.key] ?? null;
                            return (
                              <td
                                key={c.key}
                                className="px-3 py-3 text-center font-heading font-semibold tabular-nums"
                                style={{ color: a.categories ? scoreColor(score) : undefined }}
                              >
                                {a.categories ? (score ?? "–") : <span className="text-[#F5F5F0]/20">–</span>}
                              </td>
                            );
                          })}
                          <td className="px-3 py-3 text-center text-[#F5F5F0]/60">{a.pageCount ?? "–"}</td>
                          <td className="px-4 py-3 text-right">
                            {a.status === "done" ? (
                              <span className="inline-flex gap-3 whitespace-nowrap">
                                <Link
                                  to={`/seo-audit?audit=${a.id}`}
                                  className="text-[#9F97FF] transition-colors hover:text-white"
                                >
                                  Výsledky
                                </Link>
                                {a.reportUrl && (
                                  <a
                                    href={a.reportUrl}
                                    target="_blank"
                                    rel="noopener"
                                    className="inline-flex items-center gap-1 text-[#9F97FF] transition-colors hover:text-white"
                                  >
                                    Report <ExternalLink size={12} />
                                  </a>
                                )}
                              </span>
                            ) : a.status === "failed" ? (
                              <span className="ml-auto block max-w-[240px] text-[0.75rem] text-[#F5F5F0]/40">{a.error}</span>
                            ) : (
                              <Loader2 size={14} className="ml-auto animate-spin text-[#9F97FF]" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
