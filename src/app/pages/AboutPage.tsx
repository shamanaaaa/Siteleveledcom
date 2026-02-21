import { Link } from "react-router";
import { ArrowRight, Eye, Gem, HeartHandshake } from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

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
    text: "Môj úspech závisí od tvojho úspechu. To nie je klišé — je to obchodný model.",
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
      {/* Hero */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#6C63FF]/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <AnimateIn className="max-w-3xl">
            <p className="text-[0.85rem] text-[#6C63FF] mb-4 tracking-wide uppercase">
              O nás
            </p>
            <h1 className="font-heading text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] leading-[1.1] mb-6">
              Za siteleveled.com stojí človek.{" "}
              <span className="text-[#6C63FF]">Nie anonymná agentúra.</span>
            </h1>
          </AnimateIn>
        </div>
      </section>

      {/* Main content */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Photo side */}
            <AnimateIn direction="left">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden border border-white/5">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1634836023845-eddbfe9937da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGRldmVsb3BlciUyMHdvcmtzcGFjZSUyMGxhcHRvcCUyMGRhcmt8ZW58MXx8fHwxNzcxNjk2OTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Mária Domanová - workspace"
                    className="w-full aspect-[4/5] object-cover"
                  />
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-6 -right-2 md:right-6 p-4 rounded-xl border border-white/10 bg-[#111118]/90 backdrop-blur-xl">
                  <p className="text-[0.75rem] text-[#F5F5F0]/40 mb-1">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2 max-w-[200px]">
                    {techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-[#6C63FF]/10 text-[#6C63FF] text-[0.7rem]"
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
                <h2 className="font-heading text-[1.25rem] text-[#F5F5F0]/60 mb-6">
                  Mária Domanová — konateľka, vývojárka, stratégička.
                </h2>

                <div className="space-y-5 text-[0.9rem] text-[#F5F5F0]/60 leading-relaxed mb-8">
                  <p>
                    Siteleveled.com vzniklo z presvedčenia, že malé a stredné
                    firmy si zaslúžia weby rovnakej kvality ako veľké korporácie
                    — bez nafúknutých cien a anonymných account managerov.
                  </p>
                  <p>
                    Som technicky orientovaná profesionálka s rokmi skúseností vo
                    webovom vývoji, UX dizajne, SEO optimalizácii a
                    automatizácii. Každý projekt vediem osobne — od prvého hovoru
                    po finálne spustenie.
                  </p>
                  <p>
                    <span className="text-[#F5F5F0]/80">doman s.r.o.</span> je
                    právny základ projektu, ale siteleveled.com je moja osobná
                    misia: pomáhať podnikateľom rásť cez silnú digitálnu
                    prítomnosť.
                  </p>
                </div>

                {/* Company info */}
                <div className="p-5 rounded-xl border border-white/5 bg-[#111118] mb-8">
                  <p className="text-[0.75rem] text-[#F5F5F0]/30 uppercase tracking-wider mb-3">
                    Firemné údaje
                  </p>
                  <div className="space-y-1 text-[0.85rem] text-[#F5F5F0]/50">
                    <p>
                      <span className="text-[#F5F5F0]/80">
                        Mária Domanová
                      </span>{" "}
                      — konateľka
                    </p>
                    <p>Ulica Funduše 1165/26, Cabaj-Čápor 951 17</p>
                    <p>Vznik funkcie: 27. 09. 2014</p>
                    <p className="text-[#F5F5F0]/80">doman s.r.o.</p>
                  </div>
                </div>

                {/* Tech stack full */}
                <div className="mb-8">
                  <p className="text-[0.75rem] text-[#F5F5F0]/30 uppercase tracking-wider mb-3">
                    Technológie
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-lg border border-white/5 bg-[#111118] text-[0.8rem] text-[#F5F5F0]/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to="/kontakt"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#6C63FF] hover:bg-[#5b53e8] text-white rounded-xl transition-all duration-200 hover:shadow-[0_0_40px_rgba(108,99,255,0.3)]"
                >
                  Porozprávajme sa <ArrowRight size={16} />
                </Link>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn className="text-center mb-16">
            <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] leading-tight mb-5">
              Hodnoty, na ktorých staviam
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <div className="p-8 rounded-2xl border border-white/5 bg-[#111118] h-full text-center hover:border-[#6C63FF]/15 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center mx-auto mb-6">
                    <value.icon size={22} className="text-[#6C63FF]" />
                  </div>
                  <h3 className="font-heading text-[1.1rem] text-[#F5F5F0] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-[0.875rem] text-[#F5F5F0]/50 leading-relaxed">
                    {value.text}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
