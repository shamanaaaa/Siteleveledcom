import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  ChevronDown,
  Send,
  Shield,
  Zap,
  MessageCircle,
  BadgeCheck,
  Users,
  Globe,
  ExternalLink,
} from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { useState, useEffect } from "react";

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

const whatsIncluded = [
  "Vizuálny návrh hlavnej stránky",
  "Kompletná štruktúra celého webu",
  "Základný koncept textov",
  "Odporúčania pre dizajn a funkcie",
  "Cenová ponuka realizácie",
];

const portfolioProjects = [
  {
    name: "mdfoto.sk",
    type: "Fotografická galéria",
    result: "Nárast dopytov o 60%",
    accent: "#6C63FF",
    bars: [0.8, 0.5, 0.9, 0.4, 0.7],
    image: "/mdfoto-preview.png" as string | null,
    url: "https://www.mdfoto.sk" as string | null,
  },
  {
    name: "zuzu-photo.sk",
    type: "Fotoportfólio",
    result: "Zvýšenie rezervácií o 40%",
    accent: "#1AFF8C",
    bars: [0.6, 0.85, 0.4, 0.75, 0.55],
    image: "/zuzu-photo-preview.png" as string | null,
    url: "https://www.zuzu-photo.sk" as string | null,
  },
  {
    name: "nosekrst.sk",
    type: "Preprava a žeriavové práce",
    result: "Moderný firemný web",
    accent: "#9F97FF",
    bars: [0.7, 0.45, 0.8, 0.6, 0.9],
    image: "/nosekrst-preview.png" as string | null,
    url: "https://www.nosekrst.sk" as string | null,
  },
];

const benefits = [
  {
    icon: Users,
    title: "Individuálny prístup",
    text: "Každý návrh robíme na mieru – žiadne šablóny.",
  },
  {
    icon: Zap,
    title: "Rýchlosť",
    text: "Návrh do 24 hodín, web do 2–3 týždňov.",
  },
  {
    icon: Shield,
    title: "Transparentné ceny",
    text: "Žiadne prekvapenia, všetko vopred.",
  },
  {
    icon: MessageCircle,
    title: "Komunikácia",
    text: "Vždy viete, kde sa projekt nachádza.",
  },
  {
    icon: BadgeCheck,
    title: "Skúsenosti",
    text: "40+ projektov, 5+ rokov v brandži.",
  },
];

const testimonials = [
  {
    text: "Návrh sme dostali na druhý deň a výsledná stránka nám priniesla viac objednávok hneď v prvom mesiaci.",
    author: "Peter M.",
    company: "mdfoto.sk",
  },
  {
    text: "Výborná komunikácia a profesionálny prístup. Presne to, čo sme hľadali – rýchlo, bez komplikácií.",
    author: "Zuzana K.",
    company: "zuzu-photo.sk",
  },
  {
    text: "Rýchlo, profesionálne a bez stresu. Odporúčam každému, kto chce naozaj dobrý web.",
    author: "Martin H.",
    company: "nosekrst.sk",
  },
];

const faqs = [
  {
    q: "Je návrh naozaj zadarmo?",
    a: "Áno, bez podmienok a bez skrytých poplatkov. Dostanete reálny návrh vašej webstránky – zdarma a bez záväzkov.",
  },
  {
    q: "Som niečím viazaný?",
    a: "Nie. Návrh vám pošleme a rozhodnutie je len na vás. Žiadny tlak, žiadne záväzky.",
  },
  {
    q: "Čo ak sa mi návrh nebude páčiť?",
    a: "Povieme si to. Radi upravíme alebo vysvetlíme naše rozhodnutia. Záleží nám na tom, aby ste boli spokojní.",
  },
  {
    q: "Ako prebieha realizácia?",
    a: "Po odsúhlasení návrhu dohodíme termín, cenu a podmienky spolupráce. Celý proces je transparentný.",
  },
  {
    q: "Koľko stojí kompletná webstránka?",
    a: "Závisí od rozsahu a požiadaviek. V návrhu dostanete aj orientačnú cenovú ponuku – vopred, bez prekvapení.",
  },
  {
    q: "Ako dlho trvá výroba webu?",
    a: "Štandardne 2–4 týždne od schválenia návrhu. Závisí od rozsahu projektu.",
  },
];

const goalOptions = ["Predaj", "Prezentácia", "Rezervácie", "Iné"];
const styleOptions = ["Moderný", "Minimalistický", "Luxusný", "Neviem"];
const colorOptions = [
  { label: "Tmavá", hex: "#1a1a2e" },
  { label: "Svetlá", hex: "#f5f5f0" },
  { label: "Fialová", hex: "#6C63FF" },
  { label: "Modrá", hex: "#3b82f6" },
  { label: "Zelená", hex: "#1AFF8C" },
  { label: "Červená", hex: "#ef4444" },
  { label: "Zlatá", hex: "#f59e0b" },
  { label: "Neutralná", hex: "#9ca3af" },
];

function scrollToForm() {
  document.getElementById("formular")?.scrollIntoView({ behavior: "smooth" });
}

export function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    about: "",
    hasWeb: "" as "ano" | "nie" | "",
    webUrl: "",
    goal: [] as string[],
    goalOther: "",
    style: "",
    colors: [] as string[],
    inspiration: "",
    socialMedia: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Povinné pole";
    if (!formData.email.trim()) {
      newErrors.email = "Povinné pole";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Neplatný email";
    }
    if (!formData.company.trim()) newErrors.company = "Povinné pole";
    return newErrors;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleGoal = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      goal: prev.goal.includes(val)
        ? prev.goal.filter((g) => g !== val)
        : [...prev.goal, val],
    }));
  };

  const toggleColor = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(val)
        ? prev.colors.filter((c) => c !== val)
        : [...prev.colors, val],
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <>
      {/* ── SECTION 1: HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#6C63FF]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#1AFF8C]/5 rounded-full blur-[100px]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6C63FF]/20 to-transparent" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
          {/* Urgency badge */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1AFF8C]/20 bg-[#1AFF8C]/5 mb-8">
              <div className="w-2 h-2 rounded-full bg-[#1AFF8C] animate-pulse" />
              <span className="text-[0.8rem] text-[#1AFF8C]">
                Voľné termíny tento týždeň: 3
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-heading text-[2.2rem] sm:text-[3rem] md:text-[4rem] lg:text-[4.75rem] leading-[1.05] tracking-tight mb-6 max-w-5xl mx-auto"
          >
            Získajte návrh vašej novej webstránky
            <br />
            <span className="bg-gradient-to-r from-[#6C63FF] to-[#9F97FF] bg-clip-text text-transparent">
              do 24 hodín – úplne zadarmo.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[1rem] sm:text-[1.15rem] text-[#F5F5F0]/60 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Vyplňte krátky formulár. My sa postaráme o zvyšok.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#6C63FF] hover:bg-[#5b53e8] text-white rounded-xl transition-all duration-200 hover:shadow-[0_0_40px_rgba(108,99,255,0.3)] text-[0.95rem]"
            >
              Chcem návrh zadarmo
              <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#0A0A0F] bg-gradient-to-br from-[#6C63FF] to-[#9F97FF] flex items-center justify-center text-[0.6rem] text-white font-heading"
                >
                  {["MF", "ZK", "MH", "PK"][i]}
                </div>
              ))}
            </div>
            <p className="text-[0.8rem] text-[#F5F5F0]/40">
              Dôveruje nám{" "}
              <span className="text-[#F5F5F0]/70">40+ spokojných klientov</span>
            </p>
          </motion.div>
        </div>

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

      {/* ── SECTION 2: AKO TO FUNGUJE ── */}
      <section
        id="ako-to-funguje"
        className="py-24 md:py-32 bg-[#0d0d14]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-tight mb-4">
              Ako to{" "}
              <span className="text-[#6C63FF]">funguje?</span>
            </h2>
            <p className="text-[1rem] text-[#F5F5F0]/50">
              Tri jednoduché kroky. Žiadna komplikácia.
            </p>
          </AnimateIn>

          {/* 3 steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                num: "1",
                title: "Vyplníte formulár",
                sub: "2–3 minúty",
                text: "Krátky formulár o vás a vašom projekte. Žiadne technické znalosti nie sú potrebné.",
                color: "#6C63FF",
              },
              {
                num: "2",
                title: "Do 24h dostanete návrh",
                sub: "profesionálny, na mieru",
                text: "Náš tím pripraví reálny vizuálny návrh vašej webstránky – šitý na mieru vášmu biznisu.",
                color: "#9F97FF",
              },
              {
                num: "3",
                title: "Rozhodnete sa",
                sub: "bez záväzkov",
                text: "Návrh sa vám páči? Spolupracujeme. Nepáči? Žiadny problém. Rozhodnutie je len na vás.",
                color: "#1AFF8C",
              },
            ].map((step, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="relative group p-8 rounded-2xl border border-white/5 bg-[#111118] hover:border-[#6C63FF]/20 transition-all duration-300 h-full text-center">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                      <ArrowRight size={20} className="text-[#F5F5F0]/15" />
                    </div>
                  )}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 text-[1.5rem] font-heading"
                    style={{ background: `${step.color}15`, color: step.color }}
                  >
                    {step.num}
                  </div>
                  <h3 className="font-heading text-[1.1rem] text-[#F5F5F0] mb-1">
                    {step.title}
                  </h3>
                  <p
                    className="text-[0.75rem] mb-3"
                    style={{ color: step.color }}
                  >
                    {step.sub}
                  </p>
                  <p className="text-[0.875rem] text-[#F5F5F0]/50 leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Key benefits */}
          <AnimateIn>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Shield, label: "Žiadne záväzky" },
                { icon: BadgeCheck, label: "Žiadne skryté poplatky" },
                { icon: CheckCircle2, label: "Bez rizika" },
              ].map((b, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/8 bg-[#111118] text-[0.875rem] text-[#F5F5F0]/60"
                >
                  <b.icon size={16} className="text-[#1AFF8C]" />
                  {b.label}
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── SECTION 3: ČO OBSAHUJE NÁVRH ── */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimateIn>
              <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-tight mb-6">
                Čo dostanete{" "}
                <span className="text-[#6C63FF]">úplne zadarmo.</span>
              </h2>
              <div className="space-y-4 mb-8">
                {whatsIncluded.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#1AFF8C]/15 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={12} className="text-[#1AFF8C]" />
                    </div>
                    <p className="text-[0.95rem] text-[#F5F5F0]/70">{item}</p>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-xl border border-[#6C63FF]/20 bg-[#6C63FF]/5">
                <p className="text-[0.9rem] text-[#F5F5F0]/70 italic leading-relaxed">
                  "Nie je to skica. Je to reálny návrh, z ktorého môžete stavať."
                </p>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.2} direction="right">
              {/* Mock browser preview */}
              <div className="rounded-2xl border border-white/8 bg-[#111118] overflow-hidden shadow-[0_0_60px_rgba(108,99,255,0.08)]">
                {/* Browser chrome */}
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                  </div>
                  <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-white/5 text-[0.65rem] text-[#F5F5F0]/20">
                    siteleveled.com/váš-návrh
                  </div>
                </div>
                {/* Mock content */}
                <div className="p-6 space-y-4">
                  <div className="h-8 w-2/3 rounded-lg bg-gradient-to-r from-[#6C63FF]/30 to-[#9F97FF]/20 animate-pulse" />
                  <div className="h-4 w-full rounded bg-white/5" />
                  <div className="h-4 w-5/6 rounded bg-white/5" />
                  <div className="h-4 w-4/6 rounded bg-white/5" />
                  <div className="mt-6 h-10 w-40 rounded-xl bg-[#6C63FF]/40" />
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-20 rounded-xl bg-white/3 border border-white/5"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: FORMULÁR ── */}
      <section id="formular" className="py-24 md:py-32 bg-[#0d0d14]">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6C63FF]/20 bg-[#6C63FF]/5 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#1AFF8C] animate-pulse" />
              <span className="text-[0.8rem] text-[#F5F5F0]/60">
                Voľné termíny tento týždeň: 3
              </span>
            </div>
            <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-tight mb-4">
              Chcete návrh{" "}
              <span className="text-[#6C63FF]">zadarmo?</span>
            </h2>
            <p className="text-[1rem] text-[#F5F5F0]/50">
              Vyplňte formulár – trvá to 2–3 minúty.
            </p>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5 p-8 rounded-2xl border border-white/5 bg-[#111118]"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Row 1: name + email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                        Meno a priezvisko *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Ján Novák"
                        className={`w-full px-4 py-3 rounded-xl bg-[#0d0d14] border text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/40 transition-colors text-[0.9rem] ${
                          errors.name ? "border-red-500/50" : "border-white/8"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[0.75rem] text-red-400 mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="jan@firma.sk"
                        className={`w-full px-4 py-3 rounded-xl bg-[#0d0d14] border text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/40 transition-colors text-[0.9rem] ${
                          errors.email ? "border-red-500/50" : "border-white/8"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[0.75rem] text-red-400 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: company */}
                  <div>
                    <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                      Názov firmy / projektu *
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      placeholder="Moja firma s.r.o."
                      className={`w-full px-4 py-3 rounded-xl bg-[#0d0d14] border text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/40 transition-colors text-[0.9rem] ${
                        errors.company ? "border-red-500/50" : "border-white/8"
                      }`}
                    />
                    {errors.company && (
                      <p className="text-[0.75rem] text-red-400 mt-1">{errors.company}</p>
                    )}
                  </div>

                  {/* Row 3: about */}
                  <div>
                    <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                      Čomu sa venujete?
                    </label>
                    <input
                      type="text"
                      value={formData.about}
                      onChange={(e) => handleChange("about", e.target.value)}
                      placeholder="Napr. fotografia, reštaurácia, online obchod..."
                      className="w-full px-4 py-3 rounded-xl bg-[#0d0d14] border border-white/8 text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/40 transition-colors text-[0.9rem]"
                    />
                  </div>

                  {/* Row 4: has web */}
                  <div>
                    <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                      Máte už web?
                    </label>
                    <div className="flex gap-3">
                      {(["Áno", "Nie"] as const).map((opt) => {
                        const val = opt === "Áno" ? "ano" : "nie";
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleChange("hasWeb", formData.hasWeb === val ? "" : val)}
                            className={`px-5 py-2.5 rounded-xl text-[0.875rem] border transition-all duration-200 ${
                              formData.hasWeb === val
                                ? "bg-[#6C63FF] border-[#6C63FF] text-white"
                                : "border-white/8 text-[#F5F5F0]/40 hover:border-white/15"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {formData.hasWeb === "ano" && (
                      <input
                        type="url"
                        value={formData.webUrl}
                        onChange={(e) => handleChange("webUrl", e.target.value)}
                        placeholder="https://váš-web.sk"
                        className="w-full mt-3 px-4 py-3 rounded-xl bg-[#0d0d14] border border-white/8 text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/40 transition-colors text-[0.9rem]"
                      />
                    )}
                  </div>

                  {/* Row 5: goal */}
                  <div>
                    <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                      Aký je cieľ webu?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {goalOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleGoal(opt)}
                          className={`px-4 py-2 rounded-lg text-[0.85rem] border transition-all duration-200 ${
                            formData.goal.includes(opt)
                              ? "bg-[#6C63FF] border-[#6C63FF] text-white"
                              : "border-white/8 text-[#F5F5F0]/40 hover:border-white/15"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {formData.goal.includes("Iné") && (
                      <input
                        type="text"
                        value={formData.goalOther}
                        onChange={(e) => handleChange("goalOther", e.target.value)}
                        placeholder="Opíšte cieľ..."
                        className="w-full mt-3 px-4 py-3 rounded-xl bg-[#0d0d14] border border-white/8 text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/40 transition-colors text-[0.9rem]"
                      />
                    )}
                  </div>

                  {/* Row 6: style */}
                  <div>
                    <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                      Predstava o štýle?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {styleOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            handleChange("style", formData.style === opt ? "" : opt)
                          }
                          className={`px-4 py-2 rounded-lg text-[0.85rem] border transition-all duration-200 ${
                            formData.style === opt
                              ? "bg-[#6C63FF] border-[#6C63FF] text-white"
                              : "border-white/8 text-[#F5F5F0]/40 hover:border-white/15"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Row 7: colors */}
                  <div>
                    <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                      Farebná paleta{" "}
                      <span className="text-[#F5F5F0]/25">(voliteľné)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((c) => {
                        const selected = formData.colors.includes(c.label);
                        return (
                          <button
                            key={c.label}
                            type="button"
                            onClick={() => toggleColor(c.label)}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[0.82rem] border transition-all duration-200 ${
                              selected
                                ? "border-[#6C63FF]/60 bg-[#6C63FF]/10 text-[#F5F5F0]/90"
                                : "border-white/8 text-[#F5F5F0]/40 hover:border-white/15"
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                              style={{ background: c.hex }}
                            />
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 8: inspiration */}
                  <div>
                    <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                      Web, ktorý sa vám páči{" "}
                      <span className="text-[#F5F5F0]/25">(inšpirácia – voliteľné)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.inspiration}
                      onChange={(e) => handleChange("inspiration", e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-3 rounded-xl bg-[#0d0d14] border border-white/8 text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/40 transition-colors text-[0.9rem]"
                    />
                  </div>

                  {/* Row 9: social media */}
                  <div>
                    <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                      Sociálne siete{" "}
                      <span className="text-[#F5F5F0]/25">(voliteľné)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.socialMedia}
                      onChange={(e) => handleChange("socialMedia", e.target.value)}
                      placeholder="Napr. instagram.com/váš-profil, facebook.com/..."
                      className="w-full px-4 py-3 rounded-xl bg-[#0d0d14] border border-white/8 text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/40 transition-colors text-[0.9rem]"
                    />
                  </div>

                  {/* Row 10: notes */}
                  <div>
                    <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                      Poznámky{" "}
                      <span className="text-[#F5F5F0]/25">(voliteľné)</span>
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      rows={3}
                      placeholder="Čokoľvek ďalšie, čo by sme mali vedieť..."
                      className="w-full px-4 py-3 rounded-xl bg-[#0d0d14] border border-white/8 text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/40 transition-colors text-[0.9rem] resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-[#6C63FF] hover:bg-[#5b53e8] text-white rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(108,99,255,0.3)] text-[0.95rem]"
                    >
                      Odoslať a získať návrh zadarmo <Send size={16} />
                    </button>
                    <p className="mt-3 text-[0.75rem] text-[#F5F5F0]/30">
                      Do 24 hodín vás kontaktujeme. Žiadny spam, žiadne záväzky.
                    </p>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center p-8 rounded-2xl border border-white/5 bg-[#111118]"
                >
                  <div className="w-16 h-16 rounded-full bg-[#1AFF8C]/10 flex items-center justify-center mb-6">
                    <CheckCircle2 size={32} className="text-[#1AFF8C]" />
                  </div>
                  <h3 className="font-heading text-[1.5rem] text-[#F5F5F0] mb-3">
                    Ďakujeme!
                  </h3>
                  <p className="text-[0.9rem] text-[#F5F5F0]/50 max-w-sm leading-relaxed">
                    Váš formulár bol odoslaný. Do 24 hodín sa vám ozveme s profesionálnym návrhom vašej webstránky.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </AnimateIn>
        </div>
      </section>

      {/* ── SECTION 5: PORTFÓLIO ── */}
      <section id="portfolio" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn className="text-center mb-16">
            <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-tight mb-4">
              Takto môžu vyzerať{" "}
              <span className="text-[#6C63FF]">aj vaše stránky.</span>
            </h2>
            <p className="text-[1rem] text-[#F5F5F0]/50">
              Ukážky reálnych projektov, ktoré sme dodali.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioProjects.map((project, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="group rounded-2xl border border-white/5 bg-[#111118] overflow-hidden hover:border-[#6C63FF]/20 transition-all duration-300 hover:shadow-[0_0_40px_rgba(108,99,255,0.06)] h-full flex flex-col">
                  {/* Screenshot – real image if available, else animated placeholder */}
                  <div className="relative h-48 bg-[#0d0d14] overflow-hidden">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`Screenshot ${project.name}`}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 flex items-end justify-center gap-2 px-6 pb-6">
                          {project.bars.map((h, j) => (
                            <div
                              key={j}
                              className="flex-1 rounded-t-sm"
                              style={{
                                height: `${h * 100}%`,
                                background: `linear-gradient(to top, ${project.accent}60, ${project.accent}20)`,
                              }}
                            />
                          ))}
                        </div>
                        <div className="absolute top-3 left-3 right-3">
                          <div
                            className="h-2 w-24 rounded mb-1.5"
                            style={{ background: `${project.accent}40` }}
                          />
                          <div className="h-1.5 w-36 rounded bg-white/10" />
                        </div>
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            background: `radial-gradient(circle at 50% 50%, ${project.accent}30, transparent 70%)`,
                          }}
                        />
                      </>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe size={14} className="text-[#F5F5F0]/30" />
                      <span className="text-[0.8rem] text-[#F5F5F0]/30">{project.type}</span>
                    </div>
                    <h3 className="font-heading text-[1.05rem] text-[#F5F5F0] mb-2 group-hover:text-[#6C63FF] transition-colors">
                      {project.name}
                    </h3>
                    <p
                      className="text-[0.8rem] mb-4 flex-1"
                      style={{ color: project.accent }}
                    >
                      Výsledok: {project.result}
                    </p>
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[0.8rem] text-[#F5F5F0]/30 group-hover:text-[#6C63FF] transition-colors"
                      >
                        <ExternalLink size={13} />
                        Pozrieť stránku
                      </a>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[0.8rem] text-[#F5F5F0]/30 group-hover:text-[#6C63FF] transition-colors">
                        <ExternalLink size={13} />
                        Pozrieť detail
                      </div>
                    )}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: PREČO PRÁVE SITELEVELED ── */}
      <section className="py-24 md:py-32 bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn className="text-center mb-16">
            <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-tight mb-4">
              Prečo práve{" "}
              <span className="text-[#6C63FF]">SiteLeveled?</span>
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {benefits.map((b, i) => (
              <AnimateIn key={i} delay={i * 0.08}>
                <div className="group p-6 rounded-2xl border border-white/5 bg-[#111118] hover:border-[#6C63FF]/20 transition-all duration-300 h-full text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#6C63FF]/20 transition-colors">
                    <b.icon size={22} className="text-[#6C63FF]" />
                  </div>
                  <h4 className="font-heading text-[0.95rem] text-[#F5F5F0] mb-2">
                    {b.title}
                  </h4>
                  <p className="text-[0.8rem] text-[#F5F5F0]/50 leading-relaxed">
                    {b.text}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: REFERENCIE ── */}
      <section id="referencie" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn className="text-center mb-16">
            <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-tight mb-4">
              Čo hovoria{" "}
              <span className="text-[#6C63FF]">naši klienti.</span>
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="p-8 rounded-2xl border border-white/5 bg-[#111118] h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={16}
                        className="text-[#FFD93D] fill-[#FFD93D]"
                      />
                    ))}
                  </div>
                  <blockquote className="text-[0.9rem] text-[#F5F5F0]/70 leading-relaxed italic flex-1 mb-6">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#9F97FF] flex items-center justify-center text-white text-[0.7rem] font-heading">
                      {t.author.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-[0.85rem] text-[#F5F5F0]">{t.author}</p>
                      <p className="text-[0.75rem] text-[#6C63FF]">{t.company}</p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: MINI BIO / O NÁS ── */}
      <section className="py-24 md:py-32 bg-[#0d0d14]">
        <div className="max-w-5xl mx-auto px-6">
          <AnimateIn>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16 items-center">
              <div className="md:col-span-2 flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-[#6C63FF]/20 to-[#9F97FF]/10 border border-white/8 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#9F97FF] flex items-center justify-center">
                      <span className="font-heading text-[1.5rem] text-white">DS</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-3 -right-3 px-3 py-1.5 rounded-lg bg-[#111118] border border-white/8 text-[0.75rem] text-[#F5F5F0]/50">
                    DOMAN s.r.o.
                  </div>
                </div>
              </div>
              <div className="md:col-span-3">
                <h2 className="font-heading text-[1.5rem] sm:text-[2rem] leading-tight mb-5">
                  Za každým projektom{" "}
                  <span className="text-[#6C63FF]">je reálny človek.</span>
                </h2>
                <div className="space-y-4 text-[0.95rem] text-[#F5F5F0]/60 leading-relaxed">
                  <p>
                    Webstránky robíme pre firmy, ktoré chcú rásť. Za DOMAN s.r.o. sme doteraz vytvorili{" "}
                    <span className="text-[#F5F5F0]/90">40+ webov</span> pre slovenských podnikateľov.
                  </p>
                  <p>
                    Každý projekt berieme osobne – preto ponúkame návrh zadarmo. Nechceme predávať. Chceme, aby ste videli, čo pre vás vieme spraviť.
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <div className="flex items-center gap-1.5">
                    <Counter end={40} suffix="+" />
                    <span className="text-[0.8rem] text-[#F5F5F0]/40"> projektov</span>
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <div className="flex items-center gap-1.5">
                    <Counter end={5} suffix="+" />
                    <span className="text-[0.8rem] text-[#F5F5F0]/40"> rokov</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── SECTION 9: FAQ ── */}
      <section id="faq" className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn className="text-center mb-12">
            <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-tight mb-4">
              Časté{" "}
              <span className="text-[#6C63FF]">otázky.</span>
            </h2>
          </AnimateIn>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <AnimateIn key={i} delay={i * 0.05}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 rounded-xl border border-white/5 bg-[#111118] hover:border-white/10 transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[0.9rem] text-[#F5F5F0]/80">{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#F5F5F0]/30 shrink-0 transition-transform duration-200 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {openFaq === i && (
                    <p className="mt-4 text-[0.875rem] text-[#F5F5F0]/50 leading-relaxed pr-8">
                      {faq.a}
                    </p>
                  )}
                </button>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 10: ZÁVEREČNÉ CTA ── */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-[#0d0d14]">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6C63FF]/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] md:text-[3rem] leading-tight mb-6">
              Získajte návrh vašej webstránky
              <br />
              <span className="text-[#6C63FF]">do 24 hodín – bez rizika.</span>
            </h2>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#6C63FF] hover:bg-[#5b53e8] text-white rounded-xl transition-all duration-200 hover:shadow-[0_0_40px_rgba(108,99,255,0.3)] text-[1rem] mb-8"
            >
              Chcem návrh zadarmo <ArrowRight size={18} />
            </button>
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/8 bg-[#111118]/80 text-[0.85rem] text-[#F5F5F0]/50">
              <Shield size={16} className="text-[#1AFF8C]" />
              Garancia: Ak návrh nedodáme do 24 hodín, dostanete mesiac hostovania zadarmo.
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
