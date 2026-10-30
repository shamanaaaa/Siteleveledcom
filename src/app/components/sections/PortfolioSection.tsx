import { ArrowRight, ExternalLink, Globe, Plus } from "lucide-react";
import { AnimateIn } from "../AnimateIn";
import { GlowCard } from "../fx/GlowCard";
import { SectionHeading } from "../fx/SectionHeading";
import { scrollToForm } from "../../lib/scroll";

const portfolioProjects = [
  {
    name: "mdfoto.sk",
    type: "Fotografická galéria",
    result: "Prezentačný + konverzný web",
    accent: "#6C63FF",
    bars: [0.8, 0.5, 0.9, 0.4, 0.7],
    image: "/mdfoto-preview.webp" as string | null,
    url: "https://www.mdfoto.sk" as string | null,
  },
  {
    name: "zuzu-photo.sk",
    type: "Fotoportfólio",
    result: "Portfólio + kontakt",
    accent: "#1AFF8C",
    bars: [0.6, 0.85, 0.4, 0.75, 0.55],
    image: "/zuzu-photo-preview.webp" as string | null,
    url: "https://www.zuzu-photo.sk" as string | null,
  },
  {
    name: "nosekrst.sk",
    type: "Preprava a žeriavové práce",
    result: "Moderný firemný web",
    accent: "#6C63FF",
    bars: [0.7, 0.45, 0.8, 0.6, 0.9],
    image: "/nosekrst-preview.webp" as string | null,
    url: "https://www.nosekrst.sk" as string | null,
  },
  {
    name: "fotkynavyber.sk",
    type: "Webová aplikácia pre fotografov",
    result: "Automatizovaný výber fotiek",
    accent: "#1AFF8C",
    bars: [0.55, 0.8, 0.5, 0.85, 0.65],
    image: "/fotkynavyber-preview.webp" as string | null,
    url: "https://www.fotkynavyber.sk" as string | null,
  },
  {
    name: "sanifix.sk",
    type: "Kúpeľňové vybavenie a servis",
    result: "E-shop + objednávanie servisu",
    accent: "#6C63FF",
    bars: [0.75, 0.5, 0.85, 0.45, 0.7],
    image: "/sanifix-preview.webp" as string | null,
    url: "https://sanifix.sk" as string | null,
  },
  {
    name: "zeriavynitra.sk",
    type: "Žeriavnícke práce",
    result: "Firemný web s dopytom",
    accent: "#1AFF8C",
    bars: [0.5, 0.8, 0.6, 0.9, 0.55],
    image: "/zeriavynitra-preview.webp" as string | null,
    url: "https://www.zeriavynitra.sk" as string | null,
  },
  {
    name: "jogaslaskou.sk",
    type: "Jogové štúdio",
    result: "Prezentačný web",
    accent: "#6C63FF",
    bars: [0.65, 0.4, 0.8, 0.55, 0.75],
    image: "/jogaslaskou-preview.webp" as string | null,
    url: "https://www.jogaslaskou.sk" as string | null,
  },
  {
    name: "springnitra.sk",
    type: "Estetické štúdio",
    result: "Prezentačný web + rezervácie",
    accent: "#1AFF8C",
    bars: [0.7, 0.55, 0.85, 0.5, 0.65],
    image: "/springnitra-preview.webp" as string | null,
    url: "https://www.springnitra.sk" as string | null,
  },
];

export function PortfolioSection() {
  return (
    <section id="portfolio" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Portfólio"
          segments={[
            { text: "Príklady návrhov, ktoré sme vytvorili pre našich" },
            { text: "predošlých klientov.", className: "text-gradient-primary" },
          ]}
          sub="Ukážky návrhov, ktoré sa stali našimi projektmi."
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {portfolioProjects.map((project, i) => (
            <AnimateIn key={project.name} delay={i * 0.1} className="h-full">
              <GlowCard className="h-full">
                <div className="flex h-full flex-col">
                  {/* Screenshot with slow vertical pan on hover */}
                  <a
                    href={project.url ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block h-52 overflow-hidden bg-bg-deep"
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`Screenshot ${project.name}`}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-x-0 top-0 w-full min-h-full object-cover object-top transition-transform duration-[2800ms] ease-linear group-hover/glow:translate-y-[calc(-100%+13rem)]"
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
                        <div className="absolute left-3 right-3 top-3">
                          <div
                            className="mb-1.5 h-2 w-24 rounded"
                            style={{ background: `${project.accent}40` }}
                          />
                          <div className="h-1.5 w-36 rounded bg-white/10" />
                        </div>
                      </>
                    )}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#101018] to-transparent"
                    />
                  </a>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <Globe size={14} className="text-[#F5F5F0]/30" />
                      <span className="text-[0.8rem] text-[#F5F5F0]/30">{project.type}</span>
                    </div>
                    <h3 className="mb-3 font-heading text-[1.1rem] font-bold text-[#F5F5F0] transition-colors group-hover/glow:text-[#9F97FF]">
                      {project.name}
                    </h3>
                    <div className="mb-5 flex-1">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1AFF8C]/10 px-3 py-1 text-[0.75rem] text-[#1AFF8C]">
                        {project.result}
                      </span>
                    </div>
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[0.8rem] text-[#F5F5F0]/30 transition-colors hover:text-[#9F97FF]"
                      >
                        <ExternalLink size={13} />
                        Pozrieť stránku
                      </a>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-[0.8rem] text-[#F5F5F0]/30">
                        <ExternalLink size={13} />
                        Pozrieť detail
                      </div>
                    )}
                  </div>
                </div>
              </GlowCard>
            </AnimateIn>
          ))}

          {/* A full-width "free lot" after the projects invites the next client */}
          <AnimateIn delay={portfolioProjects.length * 0.1} className="h-full sm:col-span-2 lg:col-span-4">
            <button
              type="button"
              onClick={scrollToForm}
              className="group flex h-full min-h-[22rem] w-full flex-col items-center justify-center gap-4 rounded-card sm:min-h-0 sm:flex-row sm:gap-6 sm:py-8 border border-dashed border-[#1AFF8C]/30 bg-[#1AFF8C]/[0.03] p-6 text-center transition-colors hover:border-[#1AFF8C]/60 hover:bg-[#1AFF8C]/[0.06]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1AFF8C]/10">
                <Plus size={22} className="text-[#1AFF8C]" />
              </span>
              <span className="font-heading text-[1.1rem] font-bold text-[#F5F5F0]">Tu môže byť váš web</span>
              <span className="text-[0.85rem] text-[#F5F5F0]/50">Návrh dostanete do 24 hodín zadarmo.</span>
              <span className="inline-flex items-center gap-1.5 text-[0.85rem] text-[#1AFF8C]">
                Chcem návrh zadarmo
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
