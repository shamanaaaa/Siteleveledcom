import { Link } from "react-router";
import { ArrowRight, Star, ExternalLink } from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const projects = [
  {
    id: "mdfoto",
    title: "mdfoto.sk",
    category: "Fotografické štúdio",
    tags: ["Fotografi"],
    type: "Prezentačný + konverzný web",
    challenge:
      "Vytvoriť prémiový vizuálny zážitok, ktorý odzrkadľuje kvalitu fotografa a aktívne premieňa návštevníkov na rezervácie.",
    solution:
      "Dark-mode dizajn s elegantnou typografiou, optimalizovaná galéria s rýchlym načítaním, prominentné CTA pre rezervácie, lokálne SEO pre Nitru.",
    results: "Organická návštevnosť ↑ | Priame rezervácie cez web ↑",
    image:
      "https://images.unsplash.com/photo-1627890458144-4c0c481bf4b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMHN0dWRpbyUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3NzE2OTY5NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "zuzu",
    title: "zuzu-photo.sk",
    category: "Freelance fotografka",
    tags: ["Fotografi"],
    type: "Portfólio + kontakt",
    challenge:
      "Minimalistická, rýchla a osobná prezentácia — aby sa klientka sústredila na svoju prácu, nie na správu webu.",
    solution:
      "Čistý jednostránkový dizajn, optimalizovaná galéria, kontaktný formulár, napojenie na sociálne siete.",
    results: "",
    image:
      "https://images.unsplash.com/photo-1718964312269-9f8942618cf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaHklMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzE2OTY5NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "nosekrst",
    title: "nosekrst.sk",
    category: "B2B logistika a ťažká technika",
    tags: ["B2B"],
    type: "Firemná prezentácia",
    challenge:
      "Profesionálna B2B prezentácia firmy, ktorá buduje dôveru u priemyselných klientov a uľahčuje prvý kontakt.",
    solution:
      "Štruktúrovaný obsah s dôrazom na služby a kontakt, technické SEO, schema markup pre lokálne vyhľadávanie.",
    results: "",
    image:
      "https://images.unsplash.com/photo-1761519609120-0f0a84a9932b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbG9naXN0aWNzJTIwaGVhdnklMjBtYWNoaW5lcnl8ZW58MXx8fHwxNzcxNjk2OTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

const filterOptions = ["Všetky", "Fotografi", "B2B"];

export function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("Všetky");

  const filtered =
    activeFilter === "Všetky"
      ? projects
      : projects.filter((p) => p.tags.includes(activeFilter));

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-[#6C63FF]/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <AnimateIn className="max-w-3xl">
            <p className="text-[0.85rem] text-[#6C63FF] mb-4 tracking-wide uppercase">
              Portfólio
            </p>
            <h1 className="font-heading text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] leading-[1.1] mb-6">
              Výsledky hovoria{" "}
              <span className="text-[#6C63FF]">za nás.</span>
            </h1>
            <p className="text-[1.05rem] text-[#F5F5F0]/50 leading-relaxed">
              Každý projekt je iný. Každý má jeden spoločný cieľ: rast tvojho
              biznisu.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-[0.85rem] transition-all duration-200 border ${
                  activeFilter === f
                    ? "bg-[#6C63FF] border-[#6C63FF] text-white"
                    : "border-white/10 text-[#F5F5F0]/50 hover:border-white/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-12">
            {filtered.map((project, i) => (
              <AnimateIn key={project.id} delay={i * 0.1}>
                <div className="group rounded-2xl border border-white/5 bg-[#111118] overflow-hidden hover:border-[#6C63FF]/15 transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Image */}
                    <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[0.75rem] text-white/80">
                          {project.type}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                      <span className="text-[0.75rem] text-[#6C63FF] uppercase tracking-wider mb-2">
                        {project.category}
                      </span>
                      <h3 className="font-heading text-[1.5rem] sm:text-[1.75rem] text-[#F5F5F0] mb-4">
                        {project.title}
                      </h3>

                      <div className="space-y-4 mb-6">
                        <div>
                          <p className="text-[0.75rem] text-[#F5F5F0]/30 uppercase tracking-wider mb-1">
                            Výzva
                          </p>
                          <p className="text-[0.85rem] text-[#F5F5F0]/60 leading-relaxed">
                            {project.challenge}
                          </p>
                        </div>
                        <div>
                          <p className="text-[0.75rem] text-[#F5F5F0]/30 uppercase tracking-wider mb-1">
                            Riešenie
                          </p>
                          <p className="text-[0.85rem] text-[#F5F5F0]/60 leading-relaxed">
                            {project.solution}
                          </p>
                        </div>
                        {project.results && (
                          <div>
                            <p className="text-[0.75rem] text-[#1AFF8C] uppercase tracking-wider mb-1">
                              Výsledky
                            </p>
                            <p className="text-[0.85rem] text-[#F5F5F0]/60">
                              {project.results}
                            </p>
                          </div>
                        )}
                      </div>

                      <a
                        href="#"
                        className="inline-flex items-center gap-2 text-[#6C63FF] hover:text-[#9F97FF] transition-colors text-[0.9rem]"
                      >
                        Pozri projekt <ExternalLink size={15} />
                      </a>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-[#0d0d14]">
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

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] leading-tight mb-6">
              Chceš podobné výsledky?
            </h2>
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
