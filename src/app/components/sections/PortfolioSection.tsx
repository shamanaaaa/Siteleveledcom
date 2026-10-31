import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionStyle, type MotionValue } from "motion/react";
import { ExternalLink } from "lucide-react";
import { MagneticButton } from "../fx/MagneticButton";
import { SectionHeading } from "../fx/SectionHeading";
import { useIsMobile } from "../ui/use-mobile";
import { scrollToForm } from "../../lib/scroll";

interface Project {
  name: string;
  url: string;
  image: string;
  category: string;
  built: string;
  /** Card background and accent, taken from the client's own site */
  bg: string;
  accent: string;
  /** A recommendation the client left on the SiteLeveled Facebook page */
  review?: { text: string; author: string };
}

const projects: Project[] = [
  {
    name: "springnitra.sk",
    url: "https://www.springnitra.sk",
    image: "/springnitra-preview.webp",
    category: "Estetické štúdio, Nitra",
    built: "Prerábka webu salónu: služby, značky, stránka o Fusion Plasma a online rezervácia termínov.",
    bg: "#1D1913",
    accent: "#E3C27F",
    review: { text: "Vždy vedel poradiť a výsledok dopadol ešte lepšie, ako som čakala.", author: "Jaja Bieliková" },
  },
  {
    name: "jogaslaskou.sk",
    url: "https://www.jogaslaskou.sk",
    image: "/jogaslaskou-preview.webp",
    category: "Jogové štúdio, Pezinok",
    built: "Staršia webka dostala nový život: lekcie, eventy a pobyty, galéria a časté otázky.",
    bg: "#1A1B2E",
    accent: "#F2B8C6",
    review: {
      text: "Resuscitovali sme moju staršiu webku, všetko išlo hladko, skvelá komunikácia a rýchle reakcie na požiadavky.",
      author: "Zuzana Khala",
    },
  },
  {
    name: "sanifix.sk",
    url: "https://sanifix.sk",
    image: "/sanifix-preview.webp",
    category: "E-shop a servis kúpeľňového vybavenia",
    built: "E-shop s akciami značiek, online nahlásenie servisu a administrácia servisných zákaziek.",
    bg: "#15171C",
    accent: "#D7C29A",
  },
  {
    name: "zeriavynitra.sk",
    url: "https://www.zeriavynitra.sk",
    image: "/zeriavynitra-preview.webp",
    category: "Žeriavnícke práce, Nitra",
    built: "Technický nákres žeriavu, prehľad techniky, spolupráca v piatich krokoch a formulár na nezáväzný dopyt.",
    bg: "#0F1830",
    accent: "#7FA8FF",
  },
  {
    name: "mdfoto.sk",
    url: "https://www.mdfoto.sk",
    image: "/mdfoto-preview.webp",
    category: "Fotografické štúdio, Nitra",
    built: "Tmavý elegantný web s rýchlou galériou a výraznými tlačidlami na rezerváciu fotenia.",
    bg: "#1B1612",
    accent: "#D9B48C",
  },
  {
    name: "nosekrst.sk",
    url: "https://www.nosekrst.sk",
    image: "/nosekrst-preview.webp",
    category: "Preprava ťažkej techniky",
    built: "Firemná prezentácia, ktorá buduje dôveru u priemyselných klientov a uľahčuje prvý kontakt.",
    bg: "#1A170F",
    accent: "#F2B84B",
  },
  {
    name: "fotkynavyber.sk",
    url: "https://www.fotkynavyber.sk",
    image: "/fotkynavyber-preview.webp",
    category: "Webová aplikácia pre fotografov",
    built: "Online galérie, výber fotiek, automatické e-maily a export do CSV v jednom dashboarde.",
    bg: "#1C1612",
    accent: "#E8A877",
  },
  {
    name: "zuzu-photo.sk",
    url: "https://www.zuzu-photo.sk",
    image: "/zuzu-photo-preview.webp",
    category: "Fotografka",
    built: "Jednostránkové portfólio s galériou, kontaktom a napojením na sociálne siete.",
    bg: "#1D1617",
    accent: "#EDBBA6",
  },
];

// The first card sticks just below the floating navbar; every next one a little lower
const STACK_TOP = 104;
const STACK_STEP = 14;

function StackCard({
  index,
  total,
  progress,
  animate,
  className,
  style,
  children,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  animate: boolean;
  className: string;
  style: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  // Cards lower in the pile shrink a little while the rest slide over them
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * 0.025]);
  // Each card settles into place as it rises from below
  const { scrollYProgress: entry } = useScroll({ target: ref, offset: ["start end", "start 55%"] });
  const settleScale = useTransform(entry, [0, 1], [0.92, 1]);
  const settleOpacity = useTransform(entry, [0, 1], [0.35, 1]);

  return (
    <motion.article
      ref={ref}
      className={`origin-top overflow-hidden rounded-[1.75rem] border shadow-[0_-20px_60px_rgba(0,0,0,0.55)] md:sticky md:top-[var(--stack-top)] ${className}`}
      style={{ ...style, "--stack-top": `${STACK_TOP + index * STACK_STEP}px`, scale: animate ? scale : 1 } as MotionStyle}
    >
      {/* constant values when not animating, so nothing set earlier stays behind */}
      <motion.div style={{ scale: animate ? settleScale : 1, opacity: animate ? settleOpacity : 1 }}>{children}</motion.div>
    </motion.article>
  );
}

export function PortfolioSection() {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  // On phones the cards are taller than the screen, so they simply follow each other
  const animate = !reducedMotion && !isMobile;
  const total = projects.length + 1;

  return (
    <section id="portfolio" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Portfólio"
          segments={[
            { text: "Jeden web za druhým." },
            { text: "Scrollujte a stoh rastie.", className: "text-gradient-primary" },
          ]}
          sub="Každá karta je skutočný klient a skutočný web, ktorý si môžete hneď otvoriť."
          className="mb-16"
        />

        <div ref={stackRef} className="flex flex-col gap-10 md:gap-14">
          {projects.map((project, i) => (
            <StackCard
              key={project.name}
              index={i}
              total={total}
              progress={scrollYProgress}
              animate={animate}
              className="border-white/10"
              style={{ backgroundColor: project.bg }}
            >
              <div className="flex flex-col md:min-h-[520px] md:flex-row">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                  aria-hidden
                  className="block md:w-[57%] md:shrink-0 md:pl-7 md:pt-7"
                >
                  <img
                    src={project.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-64 w-full object-cover object-left-top sm:h-80 md:h-full md:max-h-[492px] md:rounded-tl-2xl"
                  />
                </a>
                <div className="flex flex-1 flex-col justify-center gap-4 p-7 md:p-10">
                  <p className="text-[0.95rem]" style={{ color: project.accent }}>
                    {project.category}
                  </p>
                  <h3 className="font-heading text-[2rem] font-bold leading-none text-[#F5F5F0] md:text-[2.4rem]">
                    {project.name}
                  </h3>
                  <p className="text-[1rem] leading-relaxed text-[#F5F5F0]/80">{project.built}</p>
                  {project.review && (
                    <blockquote className="rounded-2xl bg-white/[0.06] px-5 py-4 text-[0.95rem] leading-relaxed text-[#F5F5F0]">
                      &bdquo;{project.review.text}&ldquo;
                      <footer className="mt-2 text-[0.85rem] text-[#F5F5F0]/60">
                        {project.review.author}, odporúčanie na Facebooku
                      </footer>
                    </blockquote>
                  )}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-[46px] items-center gap-2 self-start rounded-full border border-white/25 px-5 text-[0.9rem] font-semibold text-[#F5F5F0] transition-colors hover:border-white/60"
                  >
                    <ExternalLink size={15} />
                    Pozrieť web naživo
                  </a>
                </div>
              </div>
            </StackCard>
          ))}

          {/* The top of the pile is kept free for the next client */}
          <StackCard
            index={projects.length}
            total={total}
            progress={scrollYProgress}
            animate={animate}
            className="border-2 border-dashed border-[#1AFF8C]"
            style={{ backgroundColor: "#0E1A14" }}
          >
            <div className="flex min-h-[360px] flex-col items-start justify-center gap-5 p-8 md:p-14">
              <p className="font-pixel text-[1.1rem] text-[#1AFF8C]">Karta číslo 9</p>
              <h3 className="font-heading text-[2rem] font-bold leading-none text-[#F5F5F0] md:text-[2.6rem]">
                Na vrch stohu patrí váš web.
              </h3>
              <p className="max-w-xl text-[1rem] leading-relaxed text-[#F5F5F0]/80">
                Návrh dostanete do 24 hodín zadarmo. Platíte až po spustení, bez zálohy.
              </p>
              <MagneticButton size="lg" onClick={scrollToForm}>
                Chcem návrh zadarmo
              </MagneticButton>
            </div>
          </StackCard>
        </div>
      </div>
    </section>
  );
}
