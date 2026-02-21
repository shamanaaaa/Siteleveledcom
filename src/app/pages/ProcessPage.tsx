import { Link } from "react-router";
import {
  MessageCircle,
  Lightbulb,
  Code2,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";

const steps = [
  {
    num: "01",
    icon: MessageCircle,
    title: "Konzultácia (zdarma)",
    text: "Rozprávame sa o tvojom biznise, cieľoch a predstavách. Bez záväzku. Bez salespitchu.",
    output: "Vzájomné pochopenie + hrubý odhad rozsahu",
    color: "#6C63FF",
  },
  {
    num: "02",
    icon: Lightbulb,
    title: "Stratégia & Návrh",
    text: "Vypracujeme štruktúru webu, wireframy a vizuálny dizajn. Nič nekódujeme, kým si s dizajnom spokojný.",
    output: "Schválený Figma prototyp",
    color: "#6C63FF",
  },
  {
    num: "03",
    icon: Code2,
    title: "Vývoj & Obsah",
    text: "Programujeme web, integrujeme CMS, píšeme alebo finalizujeme texty. Pravidelné aktualizácie cez zdieľaný workspace.",
    output: "Funkčný web na testovacej doméne",
    color: "#6C63FF",
  },
  {
    num: "04",
    icon: CheckCircle2,
    title: "Testovanie & Spustenie",
    text: "Testujeme na všetkých zariadeniach a prehliadačoch. SEO check. Rýchlostný audit. Spúšťame len keď je všetko na 100 %.",
    output: "Live web + odovzdávací checklist",
    color: "#6C63FF",
  },
  {
    num: "05",
    icon: TrendingUp,
    title: "Správa & Rast (voliteľné)",
    text: "Nezmizíme po odovzdaní. Staráme sa o web, sledujeme výkon, navrhujeme zlepšenia.",
    output: "Mesačné reporty + priebežná optimalizácia",
    color: "#1AFF8C",
  },
];

export function ProcessPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-[#6C63FF]/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <AnimateIn className="max-w-3xl">
            <p className="text-[0.85rem] text-[#6C63FF] mb-4 tracking-wide uppercase">
              Proces
            </p>
            <h1 className="font-heading text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] leading-[1.1] mb-6">
              Od nápadu po spustenie.{" "}
              <span className="text-[#6C63FF]">Bez prekvapení.</span>
            </h1>
            <p className="text-[1.05rem] text-[#F5F5F0]/50 leading-relaxed max-w-2xl">
              Vieme, že prvý kontakt s agentúrou môže byť stresujúci. Preto máme
              jasný, transparentný proces — vždy vieš, kde sme a čo bude ďalej.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#6C63FF]/30 via-[#6C63FF]/10 to-[#1AFF8C]/20 hidden sm:block" />

            <div className="space-y-12 md:space-y-16">
              {steps.map((step, i) => (
                <AnimateIn
                  key={i}
                  delay={i * 0.1}
                  direction={i % 2 === 0 ? "left" : "right"}
                >
                  <div
                    className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-12 ${
                      i % 2 !== 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Number dot */}
                    <div className="hidden sm:flex absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 items-center justify-center bg-[#0A0A0F] z-10" style={{ borderColor: step.color }}>
                      <span
                        className="font-heading text-[0.85rem]"
                        style={{ color: step.color }}
                      >
                        {step.num}
                      </span>
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 ${
                        i % 2 === 0
                          ? "md:pr-16 md:text-right"
                          : "md:pl-16 md:text-left"
                      }`}
                    >
                      <div
                        className={`p-6 md:p-8 rounded-2xl border border-white/5 bg-[#111118] hover:border-[#6C63FF]/15 transition-all duration-300 ${
                          i % 2 === 0 ? "md:ml-0 md:mr-auto" : "md:mr-0 md:ml-auto"
                        } max-w-md`}
                      >
                        <div className={`flex items-center gap-3 mb-4 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: `${step.color}15`,
                            }}
                          >
                            <step.icon
                              size={20}
                              style={{ color: step.color }}
                            />
                          </div>
                          <span className="sm:hidden font-heading text-[0.85rem]" style={{ color: step.color }}>
                            {step.num}
                          </span>
                        </div>
                        <h3 className="font-heading text-[1.15rem] text-[#F5F5F0] mb-3">
                          {step.title}
                        </h3>
                        <p className="text-[0.875rem] text-[#F5F5F0]/50 leading-relaxed mb-4">
                          {step.text}
                        </p>
                        <div
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.8rem]"
                          style={{
                            backgroundColor: `${step.color}10`,
                            color: step.color,
                          }}
                        >
                          Výstup: {step.output}
                        </div>
                      </div>
                    </div>

                    {/* Spacer for opposite side */}
                    <div className="hidden md:block flex-1" />
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Duration note + CTA */}
      <section className="py-24 bg-[#0d0d14]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <p className="text-[1rem] text-[#F5F5F0]/50 mb-8">
              Priemerný projekt trvá{" "}
              <span className="text-[#6C63FF]">3–6 týždňov</span>. Chceš začať?
            </p>
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#6C63FF] hover:bg-[#5b53e8] text-white rounded-xl transition-all duration-200 hover:shadow-[0_0_40px_rgba(108,99,255,0.3)]"
            >
              Dohodnúť konzultáciu <ArrowRight size={16} />
            </Link>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
