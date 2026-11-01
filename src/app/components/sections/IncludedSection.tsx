import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "../../lib/useReducedMotion";
import { AnimateIn } from "../AnimateIn";
import { ProposalLayers } from "../fx/ProposalLayers";
import { SectionHeading } from "../fx/SectionHeading";

const whatsIncluded = [
  "Vizuálny návrh hlavnej stránky",
  "Kompletná štruktúra celého webu",
  "Základný koncept textov",
  "Odporúčania pre dizajn a funkcie",
  "Cenová ponuka realizácie",
];

const AUTOPLAY_MS = 2800;

export function IncludedSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { margin: "-20% 0px" });

  // Walks through the items on its own while visible, until someone points at one
  useEffect(() => {
    if (reducedMotion || paused || !inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % whatsIncluded.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reducedMotion, paused, inView]);

  const pick = (i: number) => {
    setActive(i);
    setPaused(true);
  };
  const release = () => setPaused(false);

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="left"
          eyebrow="Návrh zadarmo"
          segments={[
            { text: "Čo dostanete" },
            { text: "úplne zadarmo.", className: "text-gradient-primary" },
          ]}
          className="mb-12"
        />

        <div ref={gridRef} className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
          <AnimateIn className="mx-auto w-full max-w-xl lg:max-w-none">
            <ProposalLayers active={active} />
          </AnimateIn>

          <div className="flex flex-col gap-3">
            {whatsIncluded.map((item, i) => {
              const on = i === active;
              return (
                <AnimateIn key={item} delay={0.08 + i * 0.06} direction="right" className="flex flex-1">
                  <button
                    type="button"
                    aria-pressed={on}
                    onMouseEnter={() => pick(i)}
                    onFocus={() => pick(i)}
                    onClick={() => pick(i)}
                    onMouseLeave={release}
                    onBlur={release}
                    className={`flex w-full items-center gap-4 rounded-card border p-4 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9F97FF] sm:p-5 ${
                      on ? "border-[#1AFF8C]/45 bg-[#1AFF8C]/5" : "border-white/5 bg-surface-1 hover:border-border-strong"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.8rem] font-bold transition-colors duration-300 ${
                        on ? "bg-[#1AFF8C] text-[#06060B]" : "bg-[#1AFF8C]/12 text-[#1AFF8C]"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-[0.95rem] transition-colors duration-300 ${
                        on ? "text-[#F5F5F0]" : "text-[#F5F5F0]/75"
                      }`}
                    >
                      {item}
                    </span>
                  </button>
                </AnimateIn>
              );
            })}
            <AnimateIn delay={0.4} direction="right">
              <div className="rounded-card border border-[#6C63FF]/20 bg-[#6C63FF]/5 p-5">
                <p className="text-[0.9rem] italic leading-relaxed text-[#F5F5F0]/70">
                  "Nie je to skica. Je to reálny návrh, z ktorého môžete stavať."
                </p>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>
    </section>
  );
}
