/*
 * The client city. Every client is a building; a new client is one more entry in CLIENTS
 * on one of the FREE_LOTS (move that lot over). The build also turns each client into a
 * share page /mesto/<id>/ with its own Open Graph image.
 *
 * Grid: 12×12 tiles, roads run along gx = 6 and gy = 6. Lots are 2×2 tiles (the depot 3×2).
 */

export type BuildingStyle = "glassTower" | "studio" | "house" | "depot";

export interface Lot {
  gx: number;
  gy: number;
}

export interface CityClient {
  /** URL slug of the share page /mesto/<id>/ */
  id: string;
  name: string;
  url: string;
  category: string;
  image: string;
  result: string;
  challenge: string;
  solution: string;
  perks: readonly string[];
  testimonial?: { text: string; author: string };
  building: Lot & { style: BuildingStyle };
}

export const CLIENTS: readonly CityClient[] = [
  {
    id: "mdfoto",
    name: "mdfoto.sk",
    url: "https://www.mdfoto.sk",
    category: "Fotografické štúdio",
    image: "/mdfoto-preview.webp",
    result: "Nárast dopytov o 60%",
    challenge:
      "Vytvoriť prémiový vizuálny zážitok, ktorý odzrkadľuje kvalitu fotografa a aktívne premieňa návštevníkov na rezervácie.",
    solution:
      "Dark-mode dizajn s elegantnou typografiou, optimalizovaná galéria s rýchlym načítaním, prominentné CTA pre rezervácie, lokálne SEO pre Nitru.",
    perks: ["Galéria s rýchlym načítaním", "Lokálne SEO pre Nitru", "Výrazné CTA na rezervácie"],
    testimonial: {
      text: "Návrh sme dostali na druhý deň a výsledná stránka nám priniesla viac objednávok hneď v prvom mesiaci.",
      author: "Peter M.",
    },
    building: { style: "studio", gx: 8, gy: 4 },
  },
  {
    id: "zuzu-photo",
    name: "zuzu-photo.sk",
    url: "https://www.zuzu-photo.sk",
    category: "Freelance fotografka",
    image: "/zuzu-photo-preview.webp",
    result: "Zvýšenie rezervácií o 40%",
    challenge:
      "Minimalistická, rýchla a osobná prezentácia — aby sa klientka sústredila na svoju prácu, nie na správu webu.",
    solution:
      "Čistý jednostránkový dizajn, optimalizovaná galéria, kontaktný formulár, napojenie na sociálne siete.",
    perks: ["Jednostránkový dizajn", "Kontaktný formulár", "Napojenie na sociálne siete"],
    testimonial: {
      text: "Výborná komunikácia a profesionálny prístup. Presne to, čo sme hľadali – rýchlo, bez komplikácií.",
      author: "Zuzana K.",
    },
    building: { style: "house", gx: 3, gy: 7 },
  },
  {
    id: "nosekrst",
    name: "nosekrst.sk",
    url: "https://www.nosekrst.sk",
    category: "Preprava a žeriavové práce",
    image: "/nosekrst-preview.webp",
    result: "Moderný firemný web",
    challenge:
      "Profesionálna B2B prezentácia firmy, ktorá buduje dôveru u priemyselných klientov a uľahčuje prvý kontakt.",
    solution:
      "Štruktúrovaný obsah s dôrazom na služby a kontakt, technické SEO, schema markup pre lokálne vyhľadávanie.",
    perks: ["Technické SEO", "Schema markup", "Dôraz na služby a kontakt"],
    testimonial: {
      text: "Rýchlo, profesionálne a bez stresu. Odporúčam každému, kto chce naozaj dobrý web.",
      author: "Martin H.",
    },
    building: { style: "depot", gx: 0, gy: 9 },
  },
  {
    id: "fotkynavyber",
    name: "fotkynavyber.sk",
    url: "https://www.fotkynavyber.sk",
    category: "Webová aplikácia pre fotografov",
    image: "/fotkynavyber-preview.webp",
    result: "Automatizovaný výber fotiek",
    challenge:
      "Fotografi strácali čas dohadovaním, koľko fotiek si klient nakoniec vyberie a doobjedná. Chýbal systém, ktorý celý proces výberu a platieb zautomatizuje.",
    solution:
      "Webová aplikácia s online galériami, výberom fotiek, transparentnými cenami, automatickými e-mailovými notifikáciami a exportom do CSV — fotograf všetko spravuje z jedného dashboardu.",
    perks: ["Online galérie a výber fotiek", "Automatické e-maily", "Export do CSV"],
    building: { style: "glassTower", gx: 8, gy: 1 },
  },
];

export const HQ_LOT: Lot = { gx: 2, gy: 2 };
export const CONSTRUCTION_LOT: Lot = { gx: 7, gy: 7 };
export const FREE_LOTS: readonly Lot[] = [
  { gx: 10, gy: 7 },
  { gx: 7, gy: 10 },
  { gx: 10, gy: 10 },
];

/** Tile coordinates of trees (drawn at the tile centre). */
export const TREES: readonly Lot[] = [
  { gx: 0, gy: 1 },
  { gx: 0, gy: 4 },
  { gx: 1, gy: 5 },
  { gx: 4, gy: 0 },
  { gx: 5, gy: 2 },
  { gx: 4, gy: 5 },
  { gx: 11, gy: 0 },
  { gx: 11, gy: 3 },
  { gx: 10, gy: 5 },
  { gx: 0, gy: 8 },
  { gx: 2, gy: 7 },
  { gx: 5, gy: 7 },
  { gx: 5, gy: 11 },
  { gx: 9, gy: 9 },
  { gx: 11, gy: 9 },
];

export function findClient(id: string | undefined) {
  return CLIENTS.find((c) => c.id === id);
}
