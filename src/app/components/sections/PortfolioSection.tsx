import { ExternalLink, Globe } from "lucide-react";
import { AnimateIn } from "../AnimateIn";
import { GlowCard } from "../fx/GlowCard";
import { SectionHeading } from "../fx/SectionHeading";

const portfolioProjects = [
  {
    name: "mdfoto.sk",
    type: "Fotografická galéria",
    result: "Nárast dopytov o 60%",
    accent: "#6C63FF",
    bars: [0.8, 0.5, 0.9, 0.4, 0.7],
    image: "/mdfoto-preview.webp" as string | null,
    url: "https://www.mdfoto.sk" as string | null,
  },
  {
    name: "zuzu-photo.sk",
    type: "Fotoportfólio",
    result: "Zvýšenie rezervácií o 40%",
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
        </div>
      </div>
    </section>
  );
}
