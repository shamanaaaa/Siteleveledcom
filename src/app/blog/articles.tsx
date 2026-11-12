import type { ComponentType } from "react";
import { A, Checklist, CompareTable, Contents, H2, H3, Numbered, P, Summary } from "./prose";

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
        pripravujeme, nájdete na stránke <A to="/tvorba-eshopu/">tvorba e-shopu</A>. Ak sa ešte rozhodujete, či e-shop
        vôbec potrebujete, prečítajte si <A to="/blog/eshop-alebo-web/">E-shop alebo jednoduchý web?</A>
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

const CHOICE_SECTIONS = [
  { id: "kedy-web", label: "Kedy stačí jednoduchý web" },
  { id: "kedy-eshop", label: "Kedy sa oplatí e-shop" },
  { id: "katalog", label: "Medzikrok: katalóg s nezáväzným dopytom" },
  { id: "porovnanie", label: "Web a e-shop vedľa seba" },
  { id: "eshop-vopred", label: "Na čo pri e-shope myslieť vopred" },
  { id: "neskor", label: "Začať webom a e-shop pridať neskôr?" },
  { id: "rozhodnutie", label: "Neviete sa rozhodnúť?" },
];

const strong = "font-semibold text-[#F5F5F0]";

function EshopAleboWeb() {
  return (
    <>
      <Summary>
        Jednoduchý web stačí, ak ponúkate najmä služby, máte len zopár produktov alebo chcete hlavne predstaviť firmu.
        U nás stojí od 300 € a je hotový do 7 dní. E-shop sa oplatí, keď si má zákazník sám vybrať tovar a objednať ho bez
        telefonátu, keď máte viac produktov alebo variantov a keď chcete mať objednávky na jednom mieste. Začína na 1 000 €
        a je hotový do 14 dní. Medzi nimi je katalóg produktov, z ktorého zákazník pošle nezáväzný dopyt.
      </Summary>

      <P>
        Či potrebujete e-shop, závisí hlavne od toho, ako u vás zákazník nakupuje: či si tovar vyberie a objedná sám,
        alebo sa vám najprv ozve. V článku porovnávame obe možnosti aj jednu medzi nimi, s našimi cenami a termínmi.
      </P>

      <Contents items={CHOICE_SECTIONS} />

      <H2 id="kedy-web">Kedy stačí jednoduchý web</H2>
      <Checklist
        items={[
          "Ponúkate najmä služby a chcete, aby sa vám zákazník ozval",
          "Máte len zopár produktov a predávate ich na dopyt",
          "Chcete hlavne predstaviť firmu",
        ]}
      />
      <P>
        Jednoduchý web u nás začína na 300 € a je hotový do 7 dní od schválenia návrhu a dodania podkladov. V cene je do
        5 podstránok, kontaktný formulár, zobrazenie na mobile aj počítači a základné SEO nastavenie. Zákazník si na ňom
        prečíta, čo robíte, a ozve sa cez formulár, e-mail alebo telefón.
      </P>
      <P>
        Ak už tovar alebo termíny predávate cez iný e-shop či rezervačný systém, web naň môže odkazovať. Vlastný e-shop
        potom nepotrebujete.
      </P>

      <H2 id="kedy-eshop">Kedy sa oplatí e-shop</H2>
      <Checklist
        items={[
          "Chcete, aby si zákazník sám vybral tovar a objednal ho bez telefonátu",
          "Predávate viac produktov alebo variantov a ponuka sa často mení",
          "Chcete mať objednávky prehľadne na jednom mieste",
        ]}
      />
      <P>
        E-shop u nás začína na 1 000 € a je hotový do 14 dní od schválenia návrhu a dodania podkladov. Zákazník si v
        katalógu prezrie ponuku, vyberie si a vloží tovar do košíka. Produkty aj objednávky spravujete sami, bez kódovania.
        Spôsoby platby a dopravy dohodneme pri návrhu a budú v cenovej ponuke. Viac nájdete na stránke{" "}
        <A to="/tvorba-eshopu/">tvorba e-shopu</A>.
      </P>

      <H2 id="katalog">Medzikrok: katalóg s nezáväzným dopytom</H2>
      <P>
        Niekedy chcete ukázať celú ponuku aj s cenami, ale predaj dotiahnuť osobne, napríklad keď tovar treba namontovať
        alebo cenu prispôsobiť zákazke. Vtedy pomôže katalóg produktov, v ktorom zákazník namiesto košíka pošle
        nezáväzný dopyt. Vy sa mu potom ozvete s konkrétnou ponukou.
      </P>
      <P>
        Takto sme to riešili pre SaniFIX s.r.o., autorizované servisné centrum kúpeľňového vybavenia. Web{" "}
        <A to="https://sanifix.sk">sanifix.sk</A> má produkty s cenami, variantmi a akciami značiek, nezáväzný dopyt na
        produkt a k tomu online nahlásenie servisu. Koľko by stál katalóg pre vás, závisí od rozsahu a presnú sumu uvidíte
        v návrhu.
      </P>

      <H2 id="porovnanie">Web a e-shop vedľa seba</H2>
      <CompareTable
        head={["Jednoduchý web", "E-shop"]}
        rows={[
          { label: "Cena", a: "od 300 €", b: "od 1 000 €" },
          { label: "Hotové", a: "do 7 dní", b: "do 14 dní" },
          {
            label: "Ako zákazník nakupuje",
            a: <>Ozve sa cez formulár, <span className="whitespace-nowrap">e-mail</span> alebo telefón</>,
            b: "Vyberie si tovar, vloží ho do košíka a objedná",
          },
          {
            label: "Čo dodáte vy",
            a: "Logo a fotky. Texty pripravíme z vášho zadania",
            b: "Zoznam produktov s cenami, fotky, popisy produktov, logo a predstavu o platbe a doprave",
          },
          {
            label: "Práca po spustení",
            a: "Upraviť obsah, keď sa niečo zmení",
            b: "Vybavovať objednávky, posielať tovar a udržiavať produkty a ceny",
          },
        ]}
      />
      <P>
        Termíny platia od schválenia návrhu a dodania podkladov. Pri oboch platíte až po spustení, bez zálohy, a DOMAN s.r.o.
        nie je platiteľom DPH, takže k cene sa DPH nepripočítava.
      </P>

      <H2 id="eshop-vopred">Na čo pri e-shope myslieť vopred</H2>
      <P>Okrem vyššej ceny prináša e-shop aj prácu a povinnosti, ktoré pri jednoduchom webe nemáte:</P>
      <Checklist
        items={[
          <><strong className={strong}>Objednávky treba vybavovať.</strong> Niekto musí tovar zabaliť, odoslať a odpovedať zákazníkom.</>,
          <><strong className={strong}>Ponuku treba udržiavať.</strong> Ceny, fotky a dostupnosť musia sedieť s tým, čo naozaj máte.</>,
          <><strong className={strong}>Produkty treba dostať do e-shopu.</strong> Dajú sa preniesť ručne alebo zo súboru od dodávateľa.</>,
          <><strong className={strong}>Pravidlá pre predaj spotrebiteľom.</strong> Budete potrebovať obchodné podmienky a informácie o reklamácii a odstúpení od zmluvy. Pri nákupe cez internet môže spotrebiteľ spravidla odstúpiť od zmluvy do 14 dní bez udania dôvodu.</>,
        ]}
      />
      <P>Ak vám niečo z podkladov chýba, povedzte nám to a dohodneme sa, ako to vyriešiť.</P>

      <H2 id="neskor">Začať webom a e-shop pridať neskôr?</H2>
      <P>
        Ak si nie ste istí, či sa vám predaj cez internet oplatí, môžete začať jednoduchým webom a o e-shope rozhodnúť,
        keď uvidíte, koľko dopytov prichádza. Ak e-shop plánujete do budúcna, spomeňte to pri návrhu.
      </P>
      <P>
        Z čoho sa skladá cena webu aj e-shopu a s čím počítať každý rok, píšeme v článku{" "}
        <A to="/blog/kolko-stoji-webstranka/">Koľko stojí webstránka a od čoho závisí cena</A>.
      </P>

      <H2 id="rozhodnutie">Neviete sa rozhodnúť?</H2>
      <P>
        Súčasťou návrhu zadarmo sú aj odporúčania pre funkcie, takže sa nemusíte rozhodnúť vopred.{" "}
        <A to="/#formular">Napíšte nám pár viet</A> o tom, čo predávate a ako k vám zákazníci chodia. Do 24 hodín dostanete
        návrh s cenovou ponukou a odporučíme vám, či stačí web, katalóg alebo e-shop. Návrh vás k ničomu nezaväzuje.
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
  "eshop-alebo-web": EshopAleboWeb,
};
