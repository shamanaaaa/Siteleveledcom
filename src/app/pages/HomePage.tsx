import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Target,
  Zap,
  Handshake,
  ArrowRight,
  ArrowDown,
  Star,
} from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { useEffect, useState } from "react";

function Counter({
  end,
  suffix = "",
  prefix = "",
}: {
  end: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const step = Math.ceil(end / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setCount(current);
    }, 30);
    return () => clearInterval(timer);
  }, [started, end]);

  return (
    <motion.span
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true }}
    >
      {prefix}
      {count}
      {suffix}
    </motion.span>
  );
}

const pillars = [
  {
    icon: Target,
    title: "Stratégia pred dizajnom",
    text: "Pred spustením Figmy premýšľame. Kto je tvoj zákazník? Čo ho presvedčí? Kde klikne? Každý pixel slúži cieľu.",
  },
  {
    icon: Zap,
    title: "Kód, čo letí",
    text: "Žiadne pomalé WordPress šablóny. Píšeme čistý, rýchly kód. Google to ocení. Zákazník tiež.",
  },
  {
    icon: Handshake,
    title: "Partner, nie dodávateľ",
    text: "Nezmizíme po odovzdaní. Spravujeme, optimalizujeme, reportujeme. Rastieme s tebou.",
  },
];

const stats = [
  { value: 12, suffix: "+", label: "dokončených projektov" },
  { value: 100, suffix: "%", label: "klientov odporúča" },
  { value: 3, suffix: "+", label: "roky skúseností" },
];

export function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#6C63FF]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#1AFF8C]/5 rounded-full blur-[100px]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6C63FF]/20 to-transparent" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6C63FF]/20 bg-[#6C63FF]/5 mb-8">
              <div className="w-2 h-2 rounded-full bg-[#1AFF8C] animate-pulse" />
              <span className="text-[0.8rem] text-[#F5F5F0]/60">
                Digitálne štúdio pre rast biznisu
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="font-heading text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[1.05] tracking-tight mb-6"
          >
            Weby, ktoré pracujú.
            <br />
            <span className="bg-gradient-to-r from-[#6C63FF] to-[#9F97FF] bg-clip-text text-transparent">
              Biznis, ktorý rastie.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[1rem] sm:text-[1.15rem] text-[#F5F5F0]/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Tvoríme moderné webové stránky pre podnikateľov, ktorí chcú výsledky
            — nie len pekný dizajn.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#6C63FF] hover:bg-[#5b53e8] text-white rounded-xl transition-all duration-200 hover:shadow-[0_0_40px_rgba(108,99,255,0.3)] text-[0.95rem]"
            >
              Získaj bezplatnú konzultáciu
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 hover:border-white/20 text-[#F5F5F0]/80 rounded-xl transition-all duration-200 text-[0.95rem] hover:bg-white/5"
            >
              Pozri naše projekty
              <ArrowDown size={18} />
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-[0.75rem] text-[#F5F5F0]/30"
          >
            doman s.r.o. &bull; Slovensko &bull; Od návrhu po spustenie
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-[#6C63FF] rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-white/5 bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map((stat, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="font-heading text-[2.5rem] sm:text-[3rem] text-[#6C63FF]">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-[0.875rem] text-[#F5F5F0]/50 mt-1">
                  {stat.label}
                </p>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-tight mb-5">
              Väčšina webov nevydělává.{" "}
              <span className="text-[#6C63FF]">Tvoj bude.</span>
            </h2>
            <p className="text-[1rem] text-[#F5F5F0]/50 leading-relaxed">
              Rozdiel medzi webom, ktorý len existuje, a webom, ktorý predáva, nie
              je v cene — je v prístupe.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="group relative p-8 rounded-2xl border border-white/5 bg-[#111118] hover:border-[#6C63FF]/20 transition-all duration-300 hover:shadow-[0_0_40px_rgba(108,99,255,0.06)] h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center mb-6 group-hover:bg-[#6C63FF]/20 transition-colors">
                    <pillar.icon size={22} className="text-[#6C63FF]" />
                  </div>
                  <h3 className="font-heading text-[1.15rem] text-[#F5F5F0] mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-[0.875rem] text-[#F5F5F0]/50 leading-relaxed">
                    {pillar.text}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={0.3} className="text-center mt-12">
            <Link
              to="/sluzby"
              className="inline-flex items-center gap-2 text-[#6C63FF] hover:text-[#9F97FF] transition-colors text-[0.95rem]"
            >
              Chcem vedieť viac <ArrowRight size={16} />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-24 md:py-32 bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn className="text-center mb-16">
            <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-tight mb-5">
              Čo robíme.{" "}
              <span className="text-[#6C63FF]">A robíme to poriadne.</span>
            </h2>
            <p className="text-[1rem] text-[#F5F5F0]/50 max-w-2xl mx-auto">
              Od prvého nápadu po dlhodobú správu — všetko pod jednou strechou.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Webdizajn & Vývoj",
                desc: "Weby na mieru, ktoré vyzerajú skvele a konvertujú.",
              },
              {
                title: "SEO Optimalizácia",
                desc: "Buď tam, kde ťa zákazníci hľadajú.",
              },
              {
                title: "Copywriting & Obsah",
                desc: "Slová, ktoré predávajú a presvedčia.",
              },
              {
                title: "Správa & Údržba",
                desc: "Tvoj web v dobrých rukách, nonstop.",
              },
              {
                title: "Výkonnostný Marketing",
                desc: "Kampane, ktoré privádzajú reálnych zákazníkov.",
              },
              {
                title: "Konzultácia & Audit",
                desc: "Zisti, čo ti brzdí rast. Konkrétne riešenia.",
              },
            ].map((service, i) => (
              <AnimateIn key={i} delay={i * 0.08}>
                <Link
                  to="/sluzby"
                  className="group flex items-start gap-4 p-6 rounded-xl border border-white/5 hover:border-[#6C63FF]/20 bg-[#111118]/50 transition-all duration-300 h-full"
                >
                  <div className="w-2 h-2 rounded-full bg-[#6C63FF] mt-2 shrink-0 group-hover:bg-[#1AFF8C] transition-colors" />
                  <div>
                    <h4 className="font-heading text-[1rem] text-[#F5F5F0] mb-1 group-hover:text-[#6C63FF] transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-[0.8rem] text-[#F5F5F0]/40">
                      {service.desc}
                    </p>
                  </div>
                </Link>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={0.4} className="text-center mt-12">
            <Link
              to="/sluzby"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#6C63FF] hover:bg-[#5b53e8] text-white rounded-xl transition-all duration-200 text-[0.95rem]"
            >
              Pozri všetky služby <ArrowRight size={16} />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimateIn>
            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className="text-[#FFD93D] fill-[#FFD93D]"
                />
              ))}
            </div>
            <blockquote className="font-heading text-[1.25rem] sm:text-[1.5rem] text-[#F5F5F0]/80 leading-relaxed mb-6 italic">
              &ldquo;Mária nás prekvapila rýchlosťou a profesionalitou. Web sme
              spustili za 3 týždne a zákazníci si ho chvália.&rdquo;
            </blockquote>
            <p className="text-[0.875rem] text-[#F5F5F0]/40">
              — Klient, mdfoto.sk
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* PROCESS PREVIEW */}
      <section className="py-24 md:py-32 bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn className="text-center mb-16">
            <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-tight mb-5">
              Od nápadu po spustenie.{" "}
              <span className="text-[#6C63FF]">Bez prekvapení.</span>
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { num: "01", title: "Konzultácia", color: "#6C63FF" },
              { num: "02", title: "Stratégia & Návrh", color: "#6C63FF" },
              { num: "03", title: "Vývoj & Obsah", color: "#6C63FF" },
              { num: "04", title: "Testovanie", color: "#6C63FF" },
              { num: "05", title: "Správa & Rast", color: "#1AFF8C" },
            ].map((step, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="text-center p-6 rounded-xl border border-white/5 bg-[#111118]/50 h-full">
                  <div
                    className="font-heading text-[2rem] mb-3"
                    style={{ color: step.color }}
                  >
                    {step.num}
                  </div>
                  <p className="text-[0.85rem] text-[#F5F5F0]/70">
                    {step.title}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={0.4} className="text-center mt-12">
            <Link
              to="/proces"
              className="inline-flex items-center gap-2 text-[#6C63FF] hover:text-[#9F97FF] transition-colors text-[0.95rem]"
            >
              Celý proces krok za krokom <ArrowRight size={16} />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6C63FF]/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] md:text-[3rem] leading-tight mb-6">
              Vyleveluj svoj biznis.
            </h2>
            <p className="text-[1rem] text-[#F5F5F0]/50 mb-10 leading-relaxed">
              Bezplatná 30-minútová konzultácia. Bez záväzku. Len úprimný
              rozhovor o tvojom projekte.
            </p>
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#6C63FF] hover:bg-[#5b53e8] text-white rounded-xl transition-all duration-200 hover:shadow-[0_0_40px_rgba(108,99,255,0.3)] text-[1rem]"
            >
              Začnime spoluprácu <ArrowRight size={18} />
            </Link>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
