import { Link } from "react-router";
import { ArrowRight, Clock } from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState } from "react";

const categories = ["Všetky", "SEO", "Dizajn", "Marketing", "Case Studies"];

const posts = [
  {
    id: 1,
    title: "5 dôvodov, prečo tvoj web stráca zákazníkov (a ako to opraviť)",
    excerpt:
      "Väčšina webov má rovnaké problémy: pomalá rýchlosť, slabé CTA, neprehľadná navigácia. Tu je konkrétny návod, ako ich odstrániť.",
    category: "Dizajn",
    readTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1760548425425-e42e77fa38f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWIlMjBkZXNpZ24lMjBkYXJrJTIwc2NyZWVufGVufDF8fHx8MTc3MTY5Njk2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    featured: true,
  },
  {
    id: 2,
    title: "Koľko stojí dobrý web v roku 2025? Úprimný pohľad bez salespitchu",
    excerpt:
      "Rozložíme si reálne náklady na tvorbu webu — od jednoduchej vizitky po e-commerce. Bez skrytých poplatkov.",
    category: "Marketing",
    readTime: "7 min",
    image:
      "https://images.unsplash.com/photo-1532617754634-819393ff5106?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwY3JlYXRpdmUlMjBzdHJhdGVneXxlbnwxfHx8fDE3NzE2OTY5NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    featured: false,
  },
  {
    id: 3,
    title: "Prečo rýchlosť webu ovplyvňuje tvoje tržby (s číslami)",
    excerpt:
      "Každá sekunda načítavania ťa stojí zákazníkov. Pozri si konkrétne dáta a zisti, ako je na tom tvoj web.",
    category: "SEO",
    readTime: "4 min",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTRU8lMjBhbmFseXRpY3MlMjBkYXNoYm9hcmQlMjBzY3JlZW58ZW58MXx8fHwxNzcxNjk2OTYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    featured: false,
  },
  {
    id: 4,
    title: "Lokálne SEO pre malé firmy: sprievodca krok za krokom",
    excerpt:
      "Google Business profil, lokálne kľúčové slová, recenzie — kompletný návod na to, ako sa zobraziš zákazníkom vo svojom okolí.",
    category: "SEO",
    readTime: "8 min",
    image:
      "https://images.unsplash.com/photo-1753998943228-73470750c597?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwcHJvZ3JhbW1pbmclMjBkYXJrJTIwdGhlbWV8ZW58MXx8fHwxNzcxNjk2OTYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    featured: false,
  },
  {
    id: 5,
    title: "WordPress vs. vlastný kód: Čo je lepšie pre tvoj biznis?",
    excerpt:
      "Porovnávame výhody a nevýhody oboch prístupov. Kedy sa oplatí šablóna a kedy investovať do custom riešenia.",
    category: "Dizajn",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1634836023845-eddbfe9937da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGRldmVsb3BlciUyMHdvcmtzcGFjZSUyMGxhcHRvcCUyMGRhcmt8ZW58MXx8fHwxNzcxNjk2OTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
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
      {/* Hero */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#6C63FF]/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <AnimateIn className="max-w-3xl">
            <p className="text-[0.85rem] text-[#6C63FF] mb-4 tracking-wide uppercase">
              Blog
            </p>
            <h1 className="font-heading text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] leading-[1.1] mb-6">
              Poznatky z praxe.{" "}
              <span className="text-[#6C63FF]">Nie teória.</span>
            </h1>
            <p className="text-[1.05rem] text-[#F5F5F0]/50 leading-relaxed">
              Praktické tipy o weboch, SEO, dizajne a digitálnom marketingu pre
              podnikateľov.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-5 py-2 rounded-full text-[0.85rem] transition-all duration-200 border ${
                  activeCategory === c
                    ? "bg-[#6C63FF] border-[#6C63FF] text-white"
                    : "border-white/10 text-[#F5F5F0]/50 hover:border-white/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <AnimateIn>
              <div className="group rounded-2xl border border-white/5 bg-[#111118] overflow-hidden hover:border-[#6C63FF]/15 transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
                    <ImageWithFallback
                      src={featured.image}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] text-[0.75rem]">
                        {featured.category}
                      </span>
                      <span className="flex items-center gap-1 text-[0.75rem] text-[#F5F5F0]/30">
                        <Clock size={12} /> {featured.readTime}
                      </span>
                    </div>
                    <h2 className="font-heading text-[1.35rem] sm:text-[1.5rem] text-[#F5F5F0] mb-4 group-hover:text-[#6C63FF] transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-[0.9rem] text-[#F5F5F0]/50 leading-relaxed mb-6">
                      {featured.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[#6C63FF] text-[0.9rem]">
                      Čítať ďalej <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>
      )}

      {/* Blog grid */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <AnimateIn key={post.id} delay={i * 0.08}>
                <div className="group rounded-2xl border border-white/5 bg-[#111118] overflow-hidden hover:border-[#6C63FF]/15 transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-[16/10] overflow-hidden">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] text-[0.7rem]">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-[0.7rem] text-[#F5F5F0]/30">
                        <Clock size={11} /> {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-heading text-[1.05rem] text-[#F5F5F0] mb-3 group-hover:text-[#6C63FF] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[0.8rem] text-[#F5F5F0]/40 leading-relaxed flex-1 mb-4">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[#6C63FF] text-[0.8rem]">
                      Čítať ďalej <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-[#0d0d14]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <AnimateIn>
            <h2 className="font-heading text-[1.5rem] sm:text-[1.75rem] leading-tight mb-4">
              Dostávaj tipy priamo do mailu
            </h2>
            <p className="text-[0.9rem] text-[#F5F5F0]/40 mb-8">
              Praktické poznatky o weboch a digitálnom marketingu. Žiadny spam.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tvoj@email.sk"
                className="flex-1 px-4 py-3 rounded-xl bg-[#111118] border border-white/10 text-[#F5F5F0] placeholder:text-[#F5F5F0]/20 focus:outline-none focus:border-[#6C63FF]/30 text-[0.9rem]"
              />
              <button className="px-6 py-3 bg-[#6C63FF] hover:bg-[#5b53e8] text-white rounded-xl transition-all text-[0.9rem] whitespace-nowrap">
                Odoberať
              </button>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
