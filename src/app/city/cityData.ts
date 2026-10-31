/*
 * The client city. Every client is a building; a new client is one more entry in CLIENTS
 * on one of the FREE_LOTS (move that lot over). The build also turns each client into a
 * share page /mesto/<id>/ with its own Open Graph image.
 *
 * Grid: 12×12 tiles, roads run along gx = 6 and gy = 6. Lots are 2×2 tiles (the depot 3×2).
 */

export type BuildingStyle = "glassTower" | "studio" | "house" | "depot" | "yoga" | "salon";

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
  /** A recommendation the client left on the SiteLeveled Facebook page */
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
    result: "Prezentačný + konverzný web",
    challenge:
      "Vytvoriť prémiový vizuálny zážitok, ktorý odzrkadľuje kvalitu fotografa a aktívne premieňa návštevníkov na rezervácie.",
    solution:
      "Dark-mode dizajn s elegantnou typografiou, optimalizovaná galéria s rýchlym načítaním, prominentné CTA pre rezervácie, lokálne SEO pre Nitru.",
    perks: ["Galéria s rýchlym načítaním", "Lokálne SEO pre Nitru", "Výrazné CTA na rezervácie"],
    building: { style: "studio", gx: 8, gy: 4 },
  },
  {
    id: "zuzu-photo",
    name: "zuzu-photo.sk",
    url: "https://www.zuzu-photo.sk",
    category: "Freelance fotografka",
    image: "/zuzu-photo-preview.webp",
    result: "Portfólio + kontakt",
    challenge:
      "Minimalistická, rýchla a osobná prezentácia — aby sa klientka sústredila na svoju prácu, nie na správu webu.",
    solution:
      "Čistý jednostránkový dizajn, optimalizovaná galéria, kontaktný formulár, napojenie na sociálne siete.",
    perks: ["Jednostránkový dizajn", "Kontaktný formulár", "Napojenie na sociálne siete"],
    testimonial: {
      text: "Mária vrelo odporúčam každému, kto túži po svojej vysnívanej webovej stránke 😊 Tá moja je podľa mňa úplne dokonalá 😊 veď posúďte sami: zuzu-photo.sk. Mário je kreatívny, trpezlivý a hlavne veľmi šikovný. Ďakujem! 🙏🙏🙏👏",
      author: "Zuzana Kondeková",
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
    building: { style: "depot", gx: 0, gy: 9 },
  },
  {
    id: "jogaslaskou",
    name: "jogaslaskou.sk",
    url: "https://www.jogaslaskou.sk",
    category: "Jogové štúdio v Pezinku",
    image: "/jogaslaskou-preview.webp",
    result: "Prezentačný web",
    challenge:
      "Predstaviť jogové štúdio a jeho ponuku – skupinové a súkromné lekcie, eventy a pobyty – tak, aby sa nový návštevník rýchlo zorientoval a vybral si, ako začať.",
    solution:
      "Ponuka rozdelená do troch jasných krokov, popis priebehu lekcie, predstavenie lektorky, galéria z lekcií a pobytov, referencie a časté otázky.",
    perks: ["Lekcie, eventy a pobyty", "Galéria z lekcií", "Časté otázky"],
    testimonial: {
      text: "Oceňujem ľudský a „polopatistický“ prístup, keďže nie som moc technický typ. Resuscitovali sme moju staršiu webku, všetko išlo hladko, skvelá komunikácia a rýchle reakcie na požiadavky. Som veľmi spokojná a môžem odporúčať ďalej 🙂",
      author: "Zuzana Khala",
    },
    building: { style: "yoga", gx: 8, gy: 1 },
  },
  {
    id: "springnitra",
    name: "springnitra.sk",
    url: "https://www.springnitra.sk",
    category: "Estetické štúdio v Nitre",
    image: "/springnitra-preview.webp",
    result: "Prezentačný web + rezervácie",
    challenge:
      "Predstaviť estetické štúdio, jeho ošetrenia a prémiovú dermokozmetiku tak, aby si klientka rýchlo rezervovala termín.",
    solution:
      "Elegantný dizajn v teplých tónoch, predstavenie zakladateľky, prehľad služieb a značiek, samostatná stránka o Fusion Plasma, galéria, recenzie klientiek a napojenie na online rezerváciu termínov.",
    perks: ["Online rezervácia termínov", "Stránka o Fusion Plasma", "Recenzie klientiek"],
    testimonial: {
      text: "Určite odporúčam každému, kto hľadá niekoho šikovného a spoľahlivého 👌 Pán mi robil prerábku mojej webovej stránky a všetko prebehlo super. Výborná komunikácia, ochota a profesionálny prístup. Vždy vedel poradiť a výsledok dopadol ešte lepšie, ako som čakala ☺️",
      author: "Jaja Bieliková",
    },
    building: { style: "salon", gx: 10, gy: 7 },
  },
];

export const HQ_LOT: Lot = { gx: 2, gy: 2 };
export const CONSTRUCTION_LOT: Lot = { gx: 7, gy: 7 };
export const FREE_LOTS: readonly Lot[] = [
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
