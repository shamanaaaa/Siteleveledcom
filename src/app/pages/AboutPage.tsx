import { Eye, Gem, HeartHandshake } from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { GlowCard } from "../components/fx/GlowCard";
import { MagneticButton } from "../components/fx/MagneticButton";
import { Marquee } from "../components/fx/Marquee";
import { PageHero } from "../components/fx/PageHero";
import { SectionHeading } from "../components/fx/SectionHeading";

const values = [
  {
    icon: Eye,
    title: "Transparentnosť",
    text: "Vždy vieš, čo platíš a prečo. Žiadne skryté poplatky.",
  },
  {
    icon: Gem,
    title: "Remeselná kvalita",
    text: "Každý projekt dostáva plnú pozornosť. Nie assembly line.",
  },
  {
    icon: HeartHandshake,
    title: "Dlhodobé partnerstvo",
    text: "Náš úspech závisí od tvojho úspechu. To nie je klišé — je to obchodný model.",
  },
];

const techStack = [
  "React",
  "Next.js",
  "Tailwind CSS",
  "Figma",
  "TypeScript",
  "Node.js",
  "Sanity",
  "Vercel",
];

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="O nás"
        segments={[
          { text: "Za siteleveled.com stoja ľudia.", br: true },
          { text: "Nie anonymná agentúra.", className: "text-gradient-primary" },
        ]}
      />

      {/* Main content */}
      <section className="pb-24 pt-4">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Photo side */}
            <AnimateIn direction="left">
              <div className="relative">
                <div className="rounded-card bg-gradient-to-br from-[#6C63FF] via-[#9F97FF]/60 to-[#00D9FF]/50 p-[2px]">
                  <div className="overflow-hidden rounded-[calc(1.25rem-2px)]">
                    <img
                      src="/profile.jpg"
                      alt="Mário Doman, vývojár SiteLeveled"
                      className="aspect-[4/5] w-full object-cover"
                    />
                  </div>
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-6 -right-2 rounded-xl border border-white/10 bg-surface-1/90 p-4 backdrop-blur-xl md:right-6">
                  <p className="mb-1 text-[0.75rem] text-[#F5F5F0]/40">Tech Stack</p>
                  <div className="flex max-w-[200px] flex-wrap gap-2">
                    {techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-[#6C63FF]/10 px-2 py-0.5 text-[0.7rem] text-[#9F97FF]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimateIn>

            {/* Text side */}
            <AnimateIn direction="right">
              <div>
                <h2 className="mb-6 font-heading text-[1.25rem] text-[#F5F5F0]/60">
                  Mário Doman — vývojár. Mária Domanová — konateľka DOMAN s.r.o.
                </h2>

                <div className="mb-8 space-y-5 text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">
                  <p>
                    Siteleveled.com vzniklo z presvedčenia, že malé a stredné firmy si zaslúžia
                    weby rovnakej kvality ako veľké korporácie — bez nafúknutých cien a anonymných
                    account managerov.
                  </p>
                  <p>
                    Weby, e-shopy a webové aplikácie navrhuje a programuje{" "}
                    <span className="text-[#F5F5F0]/80">Mário Doman</span>. Každý projekt vedie
                    osobne — od prvého hovoru po finálne spustenie. Zavolať mu môžeš priamo na{" "}
                    <a href="tel:+421910803993" className="text-[#9F97FF] hover:underline">
                      0910 803 993
                    </a>
                    .
                  </p>
                  <p>
                    Za siteleveled.com stojí spoločnosť{" "}
                    <span className="text-[#F5F5F0]/80">DOMAN s.r.o.</span>, ktorú vedie konateľka{" "}
                    <span className="text-[#F5F5F0]/80">Mária Domanová</span>. Naša misia:
                    pomáhať podnikateľom rásť cez silnú digitálnu prítomnosť.
                  </p>
                </div>

                {/* Company info */}
                <GlowCard className="mb-8 p-5">
                  <p className="mb-3 text-[0.75rem] uppercase tracking-wider text-[#F5F5F0]/30">
                    Firemné údaje
                  </p>
                  <div className="space-y-1 text-[0.85rem] text-[#F5F5F0]/50">
                    <p className="text-[#F5F5F0]/80">DOMAN s.r.o.</p>
                    <p>IČO: 47 912 383</p>
                    <p>Ulica Funduše 1165/26, Cabaj-Čápor 951 17</p>
                    <p>
                      <span className="text-[#F5F5F0]/80">Mária Domanová</span> — konateľka (od 27. 09. 2014)
                    </p>
                    <p>
                      <span className="text-[#F5F5F0]/80">Mário Doman</span> — vývojár,{" "}
                      <a href="tel:+421910803993" className="text-[#9F97FF] hover:underline">
                        0910 803 993
                      </a>
                    </p>
                  </div>
                </GlowCard>

                <MagneticButton to="/kontakt" size="lg">
                  Porozprávajme sa
                </MagneticButton>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Tech marquee */}
      <section className="border-y border-white/5 bg-[#0c0c12] py-8">
        <Marquee duration={26} rowClassName="gap-10 pr-10">
          {techStack.map((tech) => (
            <span key={tech} className="flex items-center gap-10 whitespace-nowrap">
              <span className="font-heading text-[0.9rem] uppercase tracking-[0.15em] text-[#F5F5F0]/35">
                {tech}
              </span>
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#6C63FF]/60" />
            </span>
          ))}
        </Marquee>
      </section>

      {/* Values */}
      <section className="bg-[#0d0d14] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Hodnoty"
            segments={[
              { text: "Hodnoty, na ktorých" },
              { text: "staviame.", className: "text-gradient-primary" },
            ]}
            className="mb-16"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((value, i) => (
              <AnimateIn key={i} delay={i * 0.1} className="h-full">
                <GlowCard className="h-full p-8 text-center">
                  <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#6C63FF]/10">
                    <value.icon size={22} className="text-[#6C63FF]" />
                  </div>
                  <h3 className="mb-3 font-heading text-[1.1rem] font-bold text-[#F5F5F0]">
                    {value.title}
                  </h3>
                  <p className="text-[0.875rem] leading-relaxed text-[#F5F5F0]/50">{value.text}</p>
                </GlowCard>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
