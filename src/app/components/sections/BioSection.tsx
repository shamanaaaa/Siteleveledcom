import { AnimateIn } from "../AnimateIn";
import { AnimatedCounter } from "../fx/AnimatedCounter";
import { KineticHeading } from "../fx/KineticHeading";

export function BioSection() {
  return (
    <section className="bg-[#0d0d14] py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-5 md:gap-16">
          <AnimateIn className="flex justify-center md:col-span-2">
            <div className="relative">
              <div className="rounded-2xl bg-gradient-to-br from-[#6C63FF] via-[#9F97FF] to-[#00D9FF] p-[2px]">
                <div className="h-48 w-48 overflow-hidden rounded-[calc(1rem-1px)]">
                  <img
                    src="/profile.jpg"
                    alt="Mário Doman"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 rounded-lg border border-white/8 bg-surface-1 px-3 py-1.5 text-[0.75rem] text-[#F5F5F0]/60">
                Mário Doman
              </div>
            </div>
          </AnimateIn>

          <div className="md:col-span-3">
            <KineticHeading
              as="h2"
              segments={[
                { text: "Za každým projektom" },
                { text: "je reálny človek.", className: "text-gradient-primary" },
              ]}
              className="mb-5 font-heading text-[1.5rem] font-bold leading-tight sm:text-[2rem]"
            />
            <AnimateIn delay={0.15}>
              <div className="space-y-4 text-[0.95rem] leading-relaxed text-[#F5F5F0]/60">
                <p>
                  Webstránky robíme pre firmy, ktoré chcú rásť. Za DOMAN s.r.o. sme doteraz
                  vytvorili <span className="text-[#F5F5F0]/90">40+ webov</span> pre slovenských
                  podnikateľov.
                </p>
                <p>
                  Každý projekt berieme osobne – preto ponúkame návrh zadarmo. Nechceme predávať.
                  Chceme, aby ste videli, čo pre vás vieme spraviť.
                </p>
              </div>
              <div className="mt-7 flex items-center gap-5">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-heading text-[1.6rem] font-bold text-[#F5F5F0]">
                    <AnimatedCounter end={40} suffix="+" />
                  </span>
                  <span className="text-[0.8rem] text-[#F5F5F0]/40">projektov</span>
                </div>
                <div className="h-5 w-px bg-white/10" />
                <div className="flex items-baseline gap-1.5">
                  <span className="font-heading text-[1.6rem] font-bold text-[#F5F5F0]">
                    <AnimatedCounter end={5} suffix="+" />
                  </span>
                  <span className="text-[0.8rem] text-[#F5F5F0]/40">rokov</span>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>
    </section>
  );
}
