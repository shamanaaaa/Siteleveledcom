import { ArrowRight, Clock } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { AnimateIn } from "../components/AnimateIn";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Aurora } from "../components/fx/Aurora";
import { GlowCard } from "../components/fx/GlowCard";
import { KineticHeading } from "../components/fx/KineticHeading";
import { PageHero } from "../components/fx/PageHero";
import { IMAGE_SIZES, imageSrcSet } from "../lib/images";

const categories = ["Všetky", "SEO", "Dizajn", "Marketing", "Case Studies"];

const posts = [
  {
    id: 1,
    title: "5 dôvodov, prečo váš web stráca zákazníkov (a ako to opraviť)",
    excerpt:
      "Väčšina webov má rovnaké problémy: pomalá rýchlosť, slabé CTA, neprehľadná navigácia. Tu je konkrétny návod, ako ich odstrániť.",
    category: "Dizajn",
    readTime: "5 min",
    image: "/blog-1.webp",
    featured: true,
  },
  {
    id: 2,
    title: `Koľko stojí dobrý web v roku ${new Date().getFullYear()}? Úprimný pohľad bez salespitchu`,
    excerpt:
      "Rozložíme si reálne náklady na tvorbu webu — od jednoduchej vizitky po e-commerce. Bez skrytých poplatkov.",
    category: "Marketing",
    readTime: "7 min",
    image: "/blog-2.webp",
    featured: false,
  },
  {
    id: 3,
    title: "Prečo rýchlosť webu ovplyvňuje vaše tržby (s číslami)",
    excerpt:
      "Každá sekunda načítavania vás stojí zákazníkov. Pozrite si konkrétne dáta a zistite, ako je na tom váš web.",
    category: "SEO",
    readTime: "4 min",
    image: "/blog-3.webp",
    featured: false,
  },
  {
    id: 4,
    title: "Lokálne SEO pre malé firmy: sprievodca krok za krokom",
    excerpt:
      "Google Business profil, lokálne kľúčové slová, recenzie — kompletný návod na to, ako sa zobrazíte zákazníkom vo svojom okolí.",
    category: "SEO",
    readTime: "8 min",
    image: "/blog-4.webp",
    featured: false,
  },
  {
    id: 5,
    title: "WordPress vs. vlastný kód: Čo je lepšie pre váš biznis?",
    excerpt:
      "Porovnávame výhody a nevýhody oboch prístupov. Kedy sa oplatí šablóna a kedy investovať do custom riešenia.",
    category: "Dizajn",
    readTime: "6 min",
    image: "/blog-5.webp",
    featured: false,
  },
];

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Všetky");

  const filtered =
    activeCategory === "Všetky"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <>
      <PageHero
        title="Blog o tvorbe webu a SEO"
        segments={[
          { text: "Poznatky z praxe." },
          { text: "Nie teória.", className: "text-gradient-primary" },
        ]}
        sub="Praktické tipy o weboch, SEO, dizajne a digitálnom marketingu pre podnikateľov."
      />

      {/* Filters */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="inline-flex flex-wrap gap-1 rounded-2xl border border-white/8 bg-surface-1 p-1.5">
            {categories.map((c) => {
              const active = activeCategory === c;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`relative rounded-xl px-5 py-2 text-[0.85rem] transition-colors duration-200 ${
                    active ? "text-white" : "text-[#F5F5F0]/50 hover:text-[#F5F5F0]/80"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="blog-filter"
                      className="absolute inset-0 rounded-xl bg-[#665DFA] shadow-[0_4px_16px_rgba(108,99,255,0.35)]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{c}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-6">
            <div>
              <GlowCard>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="aspect-[16/10] overflow-hidden lg:aspect-auto">
                    <ImageWithFallback
                      src={featured.image}
                      srcSet={imageSrcSet(featured.image, 1080)}
                      sizes={IMAGE_SIZES}
                      alt={featured.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover/glow:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8 md:p-10">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="rounded-full bg-[#6C63FF]/10 px-3 py-1 text-[0.75rem] text-[#9F97FF]">
                        {featured.category}
                      </span>
                      <span className="flex items-center gap-1 text-[0.75rem] text-[#F5F5F0]/50">
                        <Clock size={12} /> {featured.readTime}
                      </span>
                    </div>
                    <h2 className="mb-4 font-heading text-[1.35rem] font-bold text-[#F5F5F0] transition-colors group-hover/glow:text-[#9F97FF] sm:text-[1.5rem]">
                      {featured.title}
                    </h2>
                    <p className="mb-6 text-[0.9rem] leading-relaxed text-[#F5F5F0]/50">
                      {featured.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[0.9rem] text-[#9F97FF]">
                      Čítať ďalej <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </GlowCard>
            </div>
          </div>
        </section>
      )}

      {/* Blog grid */}
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <AnimateIn key={post.id} delay={i * 0.08} className="h-full">
                <GlowCard className="h-full">
                  <div className="flex h-full flex-col">
                    <div className="aspect-[16/10] overflow-hidden">
                      <ImageWithFallback
                        src={post.image}
                        srcSet={imageSrcSet(post.image, 1080)}
                        sizes={IMAGE_SIZES}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover/glow:scale-[1.04]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3 flex items-center gap-3">
                        <span className="rounded-full bg-[#6C63FF]/10 px-3 py-1 text-[0.7rem] text-[#9F97FF]">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1 text-[0.7rem] text-[#F5F5F0]/50">
                          <Clock size={11} /> {post.readTime}
                        </span>
                      </div>
                      <h3 className="mb-3 font-heading text-[1.05rem] font-bold text-[#F5F5F0] transition-colors group-hover/glow:text-[#9F97FF]" suppressHydrationWarning>
                        {post.title}
                      </h3>
                      <p className="mb-4 flex-1 text-[0.8rem] leading-relaxed text-[#F5F5F0]/50">
                        {post.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[0.8rem] text-[#9F97FF]">
                        Čítať ďalej <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </GlowCard>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative overflow-hidden bg-bg-deep py-24">
        <Aurora variant="cta" />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <KineticHeading
            as="h2"
            segments={[
              { text: "Dostávajte tipy" },
              { text: "priamo do mailu.", className: "text-gradient-primary" },
            ]}
            className="mb-4 font-heading text-title font-bold"
          />
          <AnimateIn delay={0.15}>
            <p className="mb-8 text-[0.9rem] text-[#F5F5F0]/50">
              Praktické poznatky o weboch a digitálnom marketingu. Žiadny spam.
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="vas@email.sk"
                className="flex-1 rounded-full border border-white/10 bg-surface-1 px-5 py-3 text-[0.9rem] text-[#F5F5F0] placeholder:text-[#F5F5F0]/50 focus:border-[#6C63FF]/40 focus:outline-none"
              />
              <button className="whitespace-nowrap rounded-full bg-[#665DFA] px-6 py-3 text-[0.9rem] font-semibold text-white transition-all hover:bg-[#5b53e8] hover:shadow-[0_4px_24px_rgba(108,99,255,0.4)]">
                Odoberať
              </button>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
