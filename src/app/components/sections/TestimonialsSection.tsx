import { Facebook } from "lucide-react";
import { AnimateIn } from "../AnimateIn";
import { GlowCard } from "../fx/GlowCard";
import { SectionHeading } from "../fx/SectionHeading";

// Recommendations from the SiteLeveled Facebook page, quoted as written
const testimonials = [
  {
    text: "Mária vrelo odporúčam každému, kto túži po svojej vysnívanej webovej stránke 😊 Tá moja je podľa mňa úplne dokonalá 😊 veď posúďte sami: zuzu-photo.sk. Mário je kreatívny, trpezlivý a hlavne veľmi šikovný. Ďakujem! 🙏🙏🙏👏",
    author: "Zuzana Kondeková",
    site: "zuzu-photo.sk",
  },
  {
    text: "Oceňujem ľudský a „polopatistický“ prístup, keďže nie som moc technický typ. Resuscitovali sme moju staršiu webku, všetko išlo hladko, skvelá komunikácia a rýchle reakcie na požiadavky. Som veľmi spokojná a môžem odporúčať ďalej 🙂",
    author: "Zuzana Khala",
    site: "jogaslaskou.sk",
  },
  {
    text: "Určite odporúčam každému, kto hľadá niekoho šikovného a spoľahlivého 👌 Pán mi robil prerábku mojej webovej stránky a všetko prebehlo super. Výborná komunikácia, ochota a profesionálny prístup. Vždy vedel poradiť a výsledok dopadol ešte lepšie, ako som čakala ☺️",
    author: "Jaja Bieliková",
    site: "springnitra.sk",
  },
];

export function TestimonialsSection() {
  return (
    <section id="referencie" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Referencie"
          segments={[
            { text: "Čo hovoria" },
            { text: "naši klienti.", className: "text-gradient-primary" },
          ]}
          className="mb-16"
        />

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <AnimateIn key={t.author} delay={i * 0.1} className="h-full">
              <GlowCard className="flex h-full flex-col p-8">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-3 left-5 select-none font-heading text-[5.5rem] leading-none text-[#6C63FF]/10"
                >
                  &ldquo;
                </span>
                <p className="mb-6 flex items-center gap-2 text-[0.75rem] text-[#9F97FF]">
                  <Facebook size={14} />
                  Odporúča SiteLeveled na Facebooku
                </p>
                <blockquote className="mb-6 flex-1 text-[0.9rem] italic leading-relaxed text-[#F5F5F0]/70">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#9F97FF] font-heading text-[0.7rem] text-white">
                    {t.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-[0.85rem] text-[#F5F5F0]">{t.author}</p>
                    <a
                      href={`https://www.${t.site}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.75rem] text-[#9F97FF] hover:underline"
                    >
                      {t.site}
                    </a>
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
