import { useI18n } from "../../i18n/LocaleContext";
import { Link } from "react-router";
import { Mail, Phone } from "lucide-react";
import { AnimateIn } from "../AnimateIn";
import { KineticHeading } from "../fx/KineticHeading";

export function BioSection() {
  const { t: tr, link: localLink, locale } = useI18n();
  return (
    <section className="bg-[#0d0d14] py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-5 md:gap-16">
          <AnimateIn className="flex justify-center md:col-span-2">
            <div className="relative">
              <div className="rounded-2xl bg-gradient-to-br from-[#6C63FF] via-[#9F97FF] to-[#00D9FF] p-[2px]">
                <div className="h-48 w-48 overflow-hidden rounded-[calc(1rem-1px)]">
                  <img
                    src="/profile.webp"
                    width={600}
                    height={899}
                    alt={tr("Mário Doman")}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 rounded-lg border border-white/8 bg-surface-1 px-3 py-1.5 text-[0.75rem] text-[#F5F5F0]/60">{tr("Mário Doman · vývojár")}</div>
            </div>
          </AnimateIn>

          <div className="md:col-span-3">
            <KineticHeading
              as="h2"
              segments={tr([
                { text: "Za každým projektom" },
                { text: "je reálny človek.", className: "text-gradient-primary" },
              ])}
              className="mb-5 font-heading text-[1.5rem] font-bold leading-tight sm:text-[2rem]"
            />
            <AnimateIn delay={0.15}>
              <div className="space-y-4 text-[0.95rem] leading-relaxed text-[#F5F5F0]/60">
                <p>{tr("Webstránky a e-shopy robíme pre firmy, ktoré chcú rásť. Navrhuje a programuje ich")}{" "}
                  <span className="text-[#F5F5F0]/90">{tr("Mário Doman")}</span>{tr(", spoločnosť DOMAN s.r.o. vedie konateľka ")}<span className="text-[#F5F5F0]/90">{tr("Mária Domanová")}</span>{"."}</p>
                <p>{tr("Sídlo máme v Cabaji-Čápore pri Nitre a pracujeme pre firmy z celého Slovenska.")}</p>
                <p>{tr("Každý projekt berieme osobne – preto ponúkame návrh zadarmo. Nechceme predávať. Chceme, aby ste videli, čo pre vás vieme spraviť.")}</p>
              </div>
              <div className="mt-7 flex items-center gap-5">
                <a
                  href={localLink("tel:+421910803993")}
                  className="flex items-center gap-2 font-heading text-[1.1rem] font-bold text-[#F5F5F0] transition-colors hover:text-[#9F97FF]"
                >
                  {locale === "en" ? <Mail size={18} className="text-[#6C63FF]" /> : <Phone size={18} className="text-[#6C63FF]" />}{tr("+421 910 803 993")}</a>
                <Link
                  to={localLink("/o-nas/")}
                  className="text-[0.9rem] text-[#9F97FF] transition-colors hover:text-[#F5F5F0]"
                >{tr("Viac o nás →")}</Link>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>
    </section>
  );
}
