import { useI18n } from "../../i18n/LocaleContext";
import { Marquee } from "../fx/Marquee";

const items = [
  "Návrh do 24 hodín",
  "Web do 7 dní",
  "E-shop do 14 dní",
  "Platba až po spustení",
  "Bez záväzkov",
  "Žiadne skryté poplatky",
  "mdfoto.sk",
  "zuzu-photo.sk",
  "nosekrst.sk",
  "fotkynavyber.sk",
  "sanifix.sk",
  "zeriavynitra.sk",
  "jogaslaskou.sk",
  "springnitra.sk",
];

export function TrustStrip() {
  const { t: tr } = useI18n();
  return (
    <section aria-label={tr("Referencie v skratke")} className="border-y border-white/5 bg-[#0c0c12] py-7">
      <Marquee duration={34} rowClassName="gap-12 pr-12">
        {items.map((item) => (
          <span key={item} className="flex items-center gap-12 whitespace-nowrap">
            <span className="font-heading text-[0.82rem] uppercase tracking-[0.18em] text-[#F5F5F0]/50">
              {tr(item)}
            </span>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#6C63FF]/60" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
