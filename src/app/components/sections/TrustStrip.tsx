import { Marquee } from "../fx/Marquee";

const items = [
  "Návrh do 24 hodín",
  "40+ projektov",
  "Bez záväzkov",
  "Žiadne skryté poplatky",
  "5+ rokov skúseností",
  "mdfoto.sk",
  "zuzu-photo.sk",
  "nosekrst.sk",
];

export function TrustStrip() {
  return (
    <section aria-label="Referencie v skratke" className="border-y border-white/5 bg-[#0c0c12] py-7">
      <Marquee duration={34} rowClassName="gap-12 pr-12">
        {items.map((item) => (
          <span key={item} className="flex items-center gap-12 whitespace-nowrap">
            <span className="font-heading text-[0.82rem] uppercase tracking-[0.18em] text-[#F5F5F0]/35">
              {item}
            </span>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#6C63FF]/60" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
