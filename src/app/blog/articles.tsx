import type { ComponentType } from "react";
import { A, Checklist, Contents, H2, H3, Numbered, P, Summary } from "./prose";

/*
 * Article bodies by slug (metadata in posts.ts). Only facts the live pages already state, plus
 * outside figures with their source and date in the text. Re-check those figures when you update
 * an article, and change its `modified` date.
 */

const PRICE_SECTIONS = [
  { id: "za-300-eur", label: "Čo dostanete za 300 €" },
  { id: "e-shop", label: "Prečo e-shop začína na 1 000 €" },
  { id: "co-zvysuje-cenu", label: "Čo cenu zvyšuje" },
  { id: "rocne-naklady", label: "S čím počítať každý rok" },
  { id: "stavebnica", label: "Stavebnica alebo web na mieru?" },
  { id: "otazky", label: "Na čo sa opýtať, kým porovnáte ponuky" },
  { id: "presna-cena", label: "Ako zistiť presnú cenu vášho webu" },
];

function KolkoStojiWebstranka() {
  return (
    <>
      <Summary>
        Jednoduchý firemný web do 5 podstránok u nás stojí od 300 € a je hotový do 7 dní. E-shop začína na 1 000 € a je
        hotový do 14 dní. Cenu zvyšujú hlavne väčší rozsah, funkcie navyše a pri e-shope produkty, platby a doprava. Okrem
        jednorazovej ceny počítajte s ročným poplatkom za doménu, s hostingom a podľa potreby so správou webu od 30 €
        mesačne.
      </Summary>

      <P>
        Na otázku, koľko stojí webstránka, sa nedá odpovedať jedným číslom. Cena závisí od toho, koľko stránok a funkcií web
        potrebuje a kto pripraví texty a podklady. V článku vychádzame z našich vlastných cien, lebo tie poznáme presne.
        Iní dodávatelia počítajú inak, preto na konci nájdete otázky, podľa ktorých porovnáte akúkoľvek ponuku.
      </P>

      <Contents items={PRICE_SECTIONS} />

      <H2 id="za-300-eur">Čo dostanete za 300 €</H2>
      <P>Za 300 € pripravíme jednoduchý web na mieru pre živnostníkov, freelancerov a malé firmy. V cene je:</P>
      <Checklist
        items={[
          "Web do 5 podstránok, napríklad úvod, služby, o nás, referencie a kontakt",
          "Kontaktný formulár",
          "Zobrazenie na mobile aj počítači",
          "Základné SEO nastavenie",
          "Texty, ktoré pripravíme z vášho zadania a vy ich schválite",
          "Úpravy do spustenia, kým nemeníme dohodnutý rozsah",
          "Testovacia adresa, na ktorej si web pozriete ešte pred spustením",
          "Testovanie na mobile a počítači a kontrola SEO a rýchlosti pred spustením",
        ]}
      />
      <P>
        Logo a fotky dodáte vy. Web je hotový do 7 dní od schválenia návrhu a dodania podkladov. Zálohu neplatíte, za web
        zaplatíte až po spustení. DOMAN s.r.o. nie je platiteľom DPH, takže k cene sa DPH nepripočítava.
      </P>
      <P>
        Slovo „od“ znamená najnižšiu cenu. Ak váš web potrebuje viac, presnú cenu uvidíte v návrhu. Ten dostanete zadarmo
        a k ničomu vás nezaväzuje. Všetky ceny na jednom mieste nájdete v <A to="/cennik/">cenníku</A>.
      </P>

      <H2 id="e-shop">Prečo e-shop začína na 1 000 €</H2>
      <P>
        E-shop má okrem bežných stránok aj katalóg produktov, košík, objednávky, platby a dopravu. Každú z týchto častí
        treba navrhnúť, naprogramovať a otestovať. Preto je e-shop drahší a trvá dlhšie: u nás začína na 1 000 € a je hotový
        do 14 dní od schválenia návrhu a dodania podkladov.
      </P>
      <P>
        Cenu e-shopu ovplyvňuje najmä počet produktov a ich variantov, napríklad veľkostí alebo farieb, a to, aké spôsoby
        platby a dopravy chcete ponúkať. Tie dohodneme pri návrhu a budú v cenovej ponuke. Viac o tom, ako e-shop
        pripravujeme, nájdete na stránke <A to="/tvorba-eshopu/">tvorba e-shopu</A>.
      </P>

      <H2 id="co-zvysuje-cenu">Čo cenu zvyšuje</H2>
      <P>Pri jednoduchom webe aj pri e-shope cenu zvyšujú najmä tieto veci:</P>
      <Checklist
        items={[
          <><strong className="font-semibold text-[#F5F5F0]">Viac ako 5 podstránok a viac obsahu.</strong> Každá stránka potrebuje text, rozloženie a kontrolu na mobile.</>,
          <><strong className="font-semibold text-[#F5F5F0]">Funkcie navyše,</strong> napríklad online rezervácie alebo napojenie na iné systémy, ktoré už vo firme používate.</>,
          <><strong className="font-semibold text-[#F5F5F0]">Druhý jazyk.</strong> Anglická verzia znamená druhú sadu textov a viac stránok. Preklad do angličtiny vieme pripraviť.</>,
          <><strong className="font-semibold text-[#F5F5F0]">Pri e-shope</strong> počet produktov a variantov a spôsoby platby a dopravy.</>,
        ]}
      />
      <P>
        Niekedy sa oplatí začať menším webom a ďalšie stránky pridať neskôr. Ako prebieha práca od zadania po spustenie,
        popisujeme v časti <A to="/proces/">proces spolupráce</A>.
      </P>

      <H2 id="rocne-naklady">S čím počítať každý rok</H2>
      <P>
        Jednorazová cena pokrýva návrh, programovanie a spustenie webu. Aby web fungoval aj ďalej, počítajte s týmito
        nákladmi.
      </P>
      <H3>Doména</H3>
      <P>
        Adresu webu, napríklad vasafirma.sk, platíte registrátorovi raz ročne. Predĺženie domény .sk stojí u slovenských
        registrátorov okolo 18 € ročne bez DPH a prvý rok býva v akcii lacnejší (cenníky Websupport a Webglobe, november
        2026). Doménu si registrujete na svoje meno. Vďaka tomu zostane vaša, aj keď raz zmeníte dodávateľa webu.
      </P>
      <H3>Hosting</H3>
      <P>
        Web musí bežať na serveri. Cena hostingu závisí od poskytovateľa a od toho, čo web potrebuje. S výberom radi
        pomôžeme a odporučíme rýchle a spoľahlivé riešenie.
      </P>
      <H3>Správa webu</H3>
      <P>
        Správu webu u nás mať nemusíte. Ak o ňu máte záujem, stojí od 30 € mesačne a zahŕňa aktualizácie, zálohy, monitoring
        a podporu. Oplatí sa najmä vtedy, keď sa o technickú stránku webu nechcete starať sami.
      </P>

      <H2 id="stavebnica">Stavebnica alebo web na mieru?</H2>
      <P>
        Web si môžete zložiť aj sami v online stavebnici. S vlastnou doménou za ňu zvyčajne platíte predplatné, web
        skladáte z jej hotových blokov a texty aj nastavenie robíte sami. Na úplný začiatok to môže stačiť.
      </P>
      <P>
        Pri webe na mieru platíte jednorazovo za návrh a prácu a web vznikne pre vaše služby a vaše texty. U nás je na mieru
        každý web, aj ten za 300 €.
      </P>

      <H2 id="otazky">Na čo sa opýtať, kým porovnáte ponuky</H2>
      <P>Dve ponuky s rovnakou cenou môžu obsahovať úplne iné veci. Preto sa pýtajte na toto:</P>
      <Numbered
        items={[
          { q: "Je v cene DPH?", a: "U nás sa DPH nepripočítava, lebo DOMAN s.r.o. nie je platiteľom DPH." },
          { q: "Platí sa záloha?", a: "U nás nie. Za web platíte až po spustení." },
          { q: "Kto pripraví texty?", a: "U nás ich pripravíme z vášho zadania a vy ich schválite." },
          { q: "Koľko úprav je v cene?", a: "U nás všetky úpravy do spustenia, kým nemeníme dohodnutý rozsah." },
          { q: "Od kedy plynie termín dodania?", a: "U nás od schválenia návrhu a dodania podkladov." },
          { q: "Uvidíte web pred spustením?", a: "U nás áno, na testovacej adrese." },
          { q: "Na koho bude zaregistrovaná doména?", a: "Mala by byť na vaše meno." },
          { q: "Budete si môcť obsah upravovať sami?", a: "Ak to chcete, pripravíme web so správou obsahu bez kódovania. Dohodneme sa na tom pri návrhu." },
          { q: "Koľko bude stáť správa po spustení?", a: "U nás od 30 € mesačne, ak o ňu máte záujem." },
        ]}
      />

      <H2 id="presna-cena">Ako zistiť presnú cenu vášho webu</H2>
      <P>
        Presnú cenu vám povieme, keď poznáme vaše zadanie. <A to="/#formular">Pošlite nám pár viet</A> o firme a o tom, čo má web robiť. Do 24 hodín
        dostanete zadarmo vizuálny návrh hlavnej stránky, štruktúru celého webu, základný koncept textov, odporúčania k
        dizajnu a cenovú ponuku. Návrh vás k ničomu nezaväzuje.
      </P>
      <P>
        Ak sa chcete radšej rovno porozprávať, zavolajte Máriovi na <A to="tel:+421910803993">0910 803 993</A> alebo
        napíšte na <A to="mailto:info@siteleveled.com">info@siteleveled.com</A>.
      </P>
    </>
  );
}

export const ARTICLES: Record<string, ComponentType> = {
  "kolko-stoji-webstranka": KolkoStojiWebstranka,
};
