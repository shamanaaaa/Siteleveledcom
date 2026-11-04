import { LanguageSwitch } from "../layout/LanguageSwitch";
import { pathFor } from "../../i18n/routes";
import { cityMeta } from "../../seo/city";
import { useI18n } from "../../i18n/LocaleContext";
import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, ExternalLink, Facebook, Linkedin, Share2, Trophy, X } from "lucide-react";
import { MagneticButton } from "../fx/MagneticButton";
import { findClient, type CityClient } from "../../city/cityData";
import { scrollToForm } from "../../lib/scroll";
import { IMAGE_SIZES, imageSrcSet, localizedImage } from "../../lib/images";

export type PanelTarget = { kind: "client"; id: string } | { kind: "hq" | "construction" | "plot" };

const QUESTS = [
  { title: "Vyplníte formulár", sub: "menej ako minúta" },
  { title: "Do 24h dostanete návrh", sub: "profesionálny, na mieru" },
  { title: "Rozhodnete sa", sub: "bez záväzkov" },
];

const linkButton =
  "inline-flex items-center gap-1.5 border border-white/10 bg-white/[0.03] px-3 py-2 text-[0.8rem] text-[#F5F5F0]/75 transition-colors hover:border-[#1AFF8C]/50 hover:text-[#1AFF8C]";

function Window({ kicker, children }: { kicker: string; children: ReactNode }) {
  const { t: tr } = useI18n();
  return (
    <>
      <div className="flex items-center gap-2 border-b-2 border-[#6C63FF]/40 bg-[#6C63FF]/10 px-5 py-2.5 pr-12 font-pixel text-[0.8rem] uppercase tracking-wider text-[#9F97FF]">
        <span className="h-2 w-2 bg-[#1AFF8C]" />
        {tr(kicker)}
        <div className="ml-auto normal-case"><LanguageSwitch /></div>
      </div>
      <div className="p-5 sm:p-6">{tr(children)}</div>
    </>
  );
}

function Cta({ prompt, onClose }: { prompt: string; onClose: () => void }) {
  const { t: tr } = useI18n();
  return (
    <div className="mt-6 border-t border-white/10 pt-5">
      <p className="mb-4 text-[0.9rem] text-[#F5F5F0]/70">{tr(prompt)}</p>
      <MagneticButton
        onClick={() => {
          onClose();
          // wait for the dialog to release the page scroll
          setTimeout(scrollToForm, 60);
        }}
      >{tr("Chcem návrh zadarmo")}</MagneticButton>
    </div>
  );
}

function ShareButtons({ client }: { client: CityClient }) {
  const { t: tr, link: localLink, locale: language } = useI18n();
  const [copied, setCopied] = useState(false);
  const url = `${typeof window === "undefined" ? "https://siteleveled.com" : window.location.origin}${pathFor("cityClient", language, client.id)}`;
  const title = cityMeta(client, language).title;

  const share = async () => {
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      // the visitor may dismiss the share sheet; nothing to do then
      await navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked: the link stays visible below for manual copying
    }
  };

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-2">
        <a href={localLink(client.url)} target="_blank" rel="noopener noreferrer" className={linkButton}>
          <ExternalLink size={14} />{tr("Navštíviť web")}</a>
        <button type="button" onClick={share} className={linkButton}>
          {copied ? <Check size={14} /> : typeof navigator !== "undefined" && navigator.share ? <Share2 size={14} /> : <Copy size={14} />}
          {tr(copied ? "Odkaz skopírovaný" : "Zdieľať budovu")}
        </button>
        <a
          href={localLink(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkButton}
          aria-label={tr("Zdieľať na LinkedIn")}
        >
          <Linkedin size={14} />
        </a>
        <a
          href={localLink(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkButton}
          aria-label={tr("Zdieľať na Facebooku")}
        >
          <Facebook size={14} />
        </a>
      </div>
      <p className="mt-2 select-all font-pixel text-[0.75rem] text-[#F5F5F0]/50">{tr(url.replace(/^https?:\/\//, ""))}</p>
    </div>
  );
}

function ClientWindow({ client, onClose }: { client: CityClient; onClose: () => void }) {
  const { t: tr, link: localLink, locale: language } = useI18n();


  return (
    <Window kicker={tr("Budova v meste klientov")}>
      <Dialog.Title className="font-heading text-[1.6rem] font-bold leading-tight text-[#F5F5F0]">
        {tr(client.name)}
      </Dialog.Title>
      <Dialog.Description className="mt-1 text-[0.85rem] text-[#F5F5F0]/50">{tr(client.category)}</Dialog.Description>

      <a
        href={localLink(client.url)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block overflow-hidden border border-white/10"
      >
        <img
          src={localizedImage(client.image, language)}
          srcSet={imageSrcSet(localizedImage(client.image, language), 1200)}
          sizes={IMAGE_SIZES}
          alt={language === "en" ? `Preview of ${client.name}` : tr(`Screenshot ${client.name}`)}
          className="aspect-[2/1] w-full object-cover object-top"
        />
      </a>
      {language === "en" && client.id !== "nosekrst" && <p className="mt-1.5 text-[0.75rem] text-[#F5F5F0]/60">Preview text translated into English.</p>}

      <span className="mt-4 inline-flex rounded-full bg-[#1AFF8C]/10 px-3 py-1 text-[0.75rem] text-[#1AFF8C]">
        {tr(client.result)}
      </span>

      <dl className="mt-4 space-y-3 text-[0.85rem] leading-relaxed">
        <div>
          <dt className="font-pixel text-[0.75rem] uppercase tracking-wider text-[#9F97FF]">{tr("Výzva")}</dt>
          <dd className="text-[#F5F5F0]/70">{tr(client.challenge)}</dd>
        </div>
        <div>
          <dt className="font-pixel text-[0.75rem] uppercase tracking-wider text-[#9F97FF]">{tr("Riešenie")}</dt>
          <dd className="text-[#F5F5F0]/70">{tr(client.solution)}</dd>
        </div>
      </dl>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label={tr("Odomknuté vylepšenia")}>
        {client.perks.map((perk) => (
          <li
            key={perk}
            className="inline-flex items-center gap-1.5 border border-[#FFD93D]/30 bg-[#FFD93D]/5 px-2.5 py-1 font-pixel text-[0.75rem] text-[#FFD93D]"
          >
            <Trophy size={12} />
            {tr(perk)}
          </li>
        ))}
      </ul>

      {client.testimonial && (
        <blockquote className="mt-5 border-l-2 border-[#6C63FF] pl-3 text-[0.85rem] italic leading-relaxed text-[#F5F5F0]/60">{"“"}{tr(client.testimonial.text)}{"”"}<footer className="mt-1 not-italic text-[#F5F5F0]/50">{"— "}{tr(client.testimonial.author)}{tr(", odporúčanie na Facebooku")}</footer>
        </blockquote>
      )}

      <ShareButtons client={client} />
      <Cta prompt={tr("Chcete v meste aj svoju budovu?")} onClose={onClose} />
    </Window>
  );
}

export function CityPanel({ target, onClose }: { target: PanelTarget; onClose: () => void }) {
  const { t: tr, link: localLink } = useI18n();
  const client = target.kind === "client" ? findClient(target.id) : undefined;

  const content =
    client ? (
      <ClientWindow client={client} onClose={onClose} />
    ) : target.kind === "hq" ? (
      <Window kicker={tr("Centrála")}>
        <Dialog.Title className="font-heading text-[1.6rem] font-bold text-[#F5F5F0]">{tr("SiteLeveled HQ")}</Dialog.Title>
        <Dialog.Description className="mt-2 text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">{tr("Tu vznikajú návrhy pre celé mesto. Váš môže byť ďalší – stačia tri kroky:")}</Dialog.Description>
        <ol className="mt-4 space-y-2">
          {QUESTS.map((quest, i) => (
            <li key={quest.title} className="flex items-center gap-3 border border-white/10 bg-white/[0.03] p-3">
              <span className="font-pixel text-[0.9rem] text-[#1AFF8C]">{tr("Q")}{tr(i + 1)}</span>
              <div>
                <p className="text-[0.9rem] text-[#F5F5F0]">{tr(quest.title)}</p>
                <p className="text-[0.75rem] text-[#F5F5F0]/50">{tr(quest.sub)}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link to={localLink("/o-nas/")} className="mt-4 inline-block text-[0.85rem] text-[#9F97FF] hover:text-[#1AFF8C]">{tr("Kto za tým stojí →")}</Link>
        <Cta prompt={tr("Začnite prvým krokom – formulár zaberie menej ako minútu.")} onClose={onClose} />
      </Window>
    ) : target.kind === "construction" ? (
      <Window kicker={tr("Stavenisko")}>
        <Dialog.Title className="font-heading text-[1.6rem] font-bold text-[#F5F5F0]">{tr("Vo výstavbe")}</Dialog.Title>
        <Dialog.Description className="mt-2 text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">{tr("Takto vzniká každý návrh: najprv skica rozloženia, potom dizajn – a do 24 hodín je hotovo. Bez záväzkov, bez skrytých poplatkov.")}</Dialog.Description>
        <Cta prompt={tr("Ďalšia budova môže byť vaša.")} onClose={onClose} />
      </Window>
    ) : (
      <Window kicker={tr("Voľný pozemok")}>
        <Dialog.Title className="font-heading text-[1.6rem] font-bold text-[#F5F5F0]">{tr("Tu môže stáť váš web")}</Dialog.Title>
        <Dialog.Description className="mt-2 text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">{tr("Návrh dostanete do 24 hodín zadarmo. Ak sa vám zapáči, postavíme ho – a vaša firma pribudne do mesta ako ďalšia budova.")}</Dialog.Description>
        <Cta prompt={tr("Pozemok si zarezervujete vyplnením krátkeho formulára.")} onClose={onClose} />
      </Window>
    );

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto border-2 border-[#6C63FF] bg-[#0b0b14] shadow-[6px_6px_0_0_rgba(108,99,255,0.35)] duration-200 focus:outline-none">
          {tr(content)}
          <Dialog.Close
            aria-label={tr("Zavrieť")}
            className="absolute right-3 top-2 p-1 text-[#F5F5F0]/50 transition-colors hover:text-[#1AFF8C] focus-visible:outline-2 focus-visible:outline-[#1AFF8C]"
          >
            <X size={18} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
