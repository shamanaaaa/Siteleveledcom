import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { GlowCard } from "../components/fx/GlowCard";
import { PageHero } from "../components/fx/PageHero";

// Every statement here describes what the code and the server actually do (forms → e-mail only,
// SEO audit results deleted after 30 days, no cookies). Change the text when that changes.

const summary = [
  "Údaje z formulárov použijeme len na odpoveď na váš dopyt a prípravu ponuky.",
  "Nepoužívame cookies, analytiku ani reklamné nástroje.",
  "Údaje nepredávame a nikomu ich nedávame na marketing.",
  "Dopyt, z ktorého nebola spolupráca, vymažeme do 12 mesiacov.",
];

const activities: { title: string; data: string; purpose: string; basis: string }[] = [
  {
    title: "Formulár „Návrh zadarmo“ na úvodnej stránke",
    data: "meno, e-mail, názov firmy alebo projektu a adresa vášho súčasného webu (nepovinné)",
    purpose: "pripraviť návrh vášho webu s cenovou ponukou a ozvať sa vám",
    basis: "opatrenia pred uzavretím zmluvy na vašu žiadosť (čl. 6 ods. 1 písm. b) GDPR)",
  },
  {
    title: "Kontaktný formulár",
    data: "meno, firma alebo projekt, e-mail, telefón (nepovinné), služba, o ktorú máte záujem, a text správy",
    purpose: "odpovedať na váš dopyt",
    basis: "opatrenia pred uzavretím zmluvy na vašu žiadosť (čl. 6 ods. 1 písm. b) GDPR)",
  },
  {
    title: "E-mail a telefón",
    data: "vaša e-mailová adresa alebo telefónne číslo a to, čo nám sami napíšete alebo poviete",
    purpose: "komunikovať s vami o vašom projekte alebo otázke",
    basis:
      "opatrenia pred uzavretím zmluvy (čl. 6 ods. 1 písm. b) GDPR), pri iných otázkach náš oprávnený záujem odpovedať vám (písm. f)",
  },
  {
    title: "SEO audit zadarmo",
    data: "adresa webu, ktorý kontrolujete, výsledky kontroly a vaša IP adresa",
    purpose:
      "vykonať audit, ktorý ste si vyžiadali; IP adresu používame len na obmedzenie počtu auditov za deň, aby nástroj nikto nezneužil",
    basis:
      "poskytnutie vyžiadanej služby (čl. 6 ods. 1 písm. b) GDPR), pri IP adrese oprávnený záujem chrániť nástroj (písm. f)",
  },
  {
    title: "Klienti",
    data: "kontaktné a fakturačné údaje a komunikácia k projektu",
    purpose: "plnenie zmluvy a vedenie účtovníctva",
    basis: "plnenie zmluvy (čl. 6 ods. 1 písm. b) GDPR) a zákonná povinnosť (písm. c)",
  },
  {
    title: "Technické záznamy servera",
    data: "IP adresa, dátum a čas, požadovaná stránka a typ prehliadača",
    purpose: "bezpečná prevádzka webu a riešenie chýb",
    basis: "oprávnený záujem na bezpečnej prevádzke (čl. 6 ods. 1 písm. f) GDPR)",
  },
];

const retention = [
  ["Dopyt, z ktorého nebola spolupráca", "12 mesiacov od poslednej komunikácie, potom ho vymažeme"],
  ["Klienti", "počas spolupráce; účtovné doklady 10 rokov podľa zákona č. 431/2002 Z. z. o účtovníctve"],
  ["SEO audit", "výsledky 30 dní, potom sa automaticky vymažú; IP adresa pre denný limit zostáva len v pamäti servera, najviac 24 hodín"],
  ["Zálohy servera", "denné zálohy celého servera uchováva Contabo 10 dní, naše týždenné zálohy najviac 3 týždne; údaje vymazané zo servera (napríklad výsledky SEO auditov alebo technické záznamy) v nich preto môžu zostať ešte najviac 3 týždne"],
  ["Technické záznamy servera", "prístupové záznamy 15 dní, chybové a systémové záznamy najviac 5 týždňov"],
];

const rights = [
  "prístup k údajom, ktoré o vás máme (čl. 15 GDPR)",
  "oprava nesprávnych údajov (čl. 16)",
  "vymazanie údajov (čl. 17)",
  "obmedzenie spracúvania (čl. 18)",
  "prenosnosť údajov (čl. 20)",
  "námietka proti spracúvaniu na základe oprávneného záujmu (čl. 21)",
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-white/8 py-10">
      <h2 className="mb-5 font-heading text-[1.35rem] font-bold text-[#F5F5F0]">{title}</h2>
      <div className="space-y-4 text-[0.95rem] leading-relaxed text-[#F5F5F0]/70">{children}</div>
    </section>
  );
}

const link = "text-[#9F97FF] hover:underline";

export function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Ochrana osobných údajov"
        segments={[{ text: "Len to, čo potrebujeme." }, { text: "Nič navyše.", className: "text-gradient-primary" }]}
        sub="Ako DOMAN s.r.o., prevádzkovateľ siteleveled.com, spracúva osobné údaje, keď nám napíšete alebo použijete SEO audit. Účinné od 1. novembra 2026."
      />

      <div className="mx-auto max-w-3xl px-6 pb-32">
        <GlowCard className="mb-6 p-6 sm:p-8">
          <p className="mb-4 text-[0.75rem] uppercase tracking-wider text-[#9F97FF]">V skratke</p>
          <ul className="space-y-3">
            {summary.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.95rem] text-[#F5F5F0]/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1AFF8C]/12">
                  <Check size={12} className="text-[#1AFF8C]" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </GlowCard>

        <Section title="Kto spracúva vaše údaje">
          <p>
            Prevádzkovateľom je <strong className="font-semibold text-[#F5F5F0]">DOMAN s.r.o.</strong>, Ulica
            Funduše 1165/26, 951 17 Cabaj-Čápor, IČO 47 912 383, ktorú zastupuje konateľka Mária Domanová.
          </p>
          <p>
            S otázkami o osobných údajoch sa obráťte na{" "}
            <a href="mailto:info@siteleveled.com" className={link}>
              info@siteleveled.com
            </a>{" "}
            alebo na{" "}
            <a href="tel:+421910803993" className={link}>
              0910 803 993
            </a>
            . Zodpovednú osobu sme nevymenovali, pretože nám to právne predpisy neukladajú.
          </p>
        </Section>

        <Section title="Aké údaje spracúvame a prečo">
          <div className="space-y-4">
            {activities.map((a) => (
              <GlowCard key={a.title} className="p-5 sm:p-6">
                <h3 className="mb-3 font-heading text-[1.05rem] font-bold text-[#F5F5F0]">{a.title}</h3>
                <dl className="space-y-2 text-[0.9rem]">
                  {[
                    ["Údaje", a.data],
                    ["Účel", a.purpose],
                    ["Právny základ", a.basis],
                  ].map(([term, value]) => (
                    <div key={term} className="sm:flex sm:gap-3">
                      <dt className="shrink-0 text-[#F5F5F0]/50 sm:w-32">{term}</dt>
                      <dd className="text-[#F5F5F0]/80">{value}</dd>
                    </div>
                  ))}
                </dl>
              </GlowCard>
            ))}
          </div>
          <p>
            Povinné polia formulárov potrebujeme, aby sme vám mohli odpovedať. Bez nich dopyt nevybavíme. Ostatné
            polia vypĺňate dobrovoľne. Z formulárov si na webe nič neukladáme: správa nám príde e-mailom a vám
            potvrdenie o jej prijatí.
          </p>
        </Section>

        <Section title="Ako dlho údaje uchovávame">
          <dl className="divide-y divide-white/8 rounded-card border border-white/8">
            {retention.map(([what, howLong]) => (
              <div key={what} className="gap-4 px-5 py-4 sm:flex">
                <dt className="shrink-0 font-semibold text-[#F5F5F0] sm:w-56">{what}</dt>
                <dd>{howLong}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Kto má k údajom prístup">
          <p>
            Údaje vidí len náš tím. Nepredávame ich a nikomu ich nedávame na marketing. Pri prevádzke nám pomáhajú
            títo sprostredkovatelia, ktorí s údajmi pracujú len podľa našich pokynov:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="font-semibold text-[#F5F5F0]">Contabo GmbH</strong> (Nemecko) prevádzkuje server v
              Európskej únii, na ktorom beží tento web aj SEO audit, a robí jeho denné zálohy.
            </li>
            <li>
              <strong className="font-semibold text-[#F5F5F0]">Google Ireland Limited</strong> (Írsko) poskytuje
              e-mailovú službu, cez ktorú odosielame správy z formulárov aj potvrdenia o ich prijatí a prijímame
              bežné e-maily, a úložisko (Google Drive) pre zálohy servera.
            </li>
          </ul>
          <p>Orgánom verejnej moci poskytneme údaje len vtedy, keď nám to ukladá zákon.</p>
        </Section>

        <Section title="Prenos mimo Európskej únie">
          <p>
            Google môže e-maily a zálohy spracúvať aj v USA. Takýto prenos chráni rámec ochrany údajov medzi EÚ a USA (EU-US
            Data Privacy Framework), v ktorom je spoločnosť Google certifikovaná, a štandardné zmluvné doložky
            schválené Európskou komisiou. Iné prenosy mimo EÚ nerobíme.
          </p>
        </Section>

        <Section title="Cookies a úložisko v prehliadači">
          <p>
            Nepoužívame cookies ani analytické a reklamné nástroje, preto u nás neuvidíte lištu so súhlasom s
            cookies. Písma a obrázky načítavame z vlastného servera, takže pri návšteve webu sa o vás nič
            nedozvedia tretie strany.
          </p>
          <p>
            SEO audit si v úložisku vášho prehliadača (localStorage) pamätá označenie vášho posledného auditu, aby
            ste sa k výsledkom mohli vrátiť. Zostáva len vo vašom zariadení. Vymaže ho tlačidlo „Nový audit“ alebo
            vymazanie údajov stránky v prehliadači.
          </p>
          <p>
            Odkazy na Facebook, LinkedIn a weby našich klientov sú obyčajné odkazy. Kým na ne nekliknete, tieto
            služby o vašej návšteve nič nevedia; po kliknutí platia ich pravidlá ochrany súkromia.
          </p>
        </Section>

        <Section title="Vaše práva">
          <p>Máte právo na:</p>
          <ul className="list-disc space-y-2 pl-5">
            {rights.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p>
            Stačí napísať na{" "}
            <a href="mailto:info@siteleveled.com" className={link}>
              info@siteleveled.com
            </a>
            . Odpovieme bez zbytočného odkladu, najneskôr do jedného mesiaca. Automatizované rozhodovanie ani
            profilovanie nepoužívame.
          </p>
          <p>
            Ak si myslíte, že s vašimi údajmi zaobchádzame v rozpore so zákonom, môžete podať sťažnosť Úradu na
            ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27,{" "}
            <a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer" className={link}>
              dataprotection.gov.sk
            </a>
            .
          </p>
        </Section>

        <Section title="Zmeny">
          <p>
            Údaje spracúvame podľa nariadenia (EÚ) 2016/679 (GDPR) a zákona č. 18/2018 Z. z. o ochrane osobných
            údajov. Keď začneme údaje spracúvať inak, napríklad pridáme analytiku, tento text upravíme a zmeníme
            dátum účinnosti na začiatku stránky.
          </p>
        </Section>
      </div>
    </>
  );
}
