import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, ExternalLink, Facebook, Linkedin, Share2, Trophy, X } from "lucide-react";
import { MagneticButton } from "../fx/MagneticButton";
import { findClient, type CityClient } from "../../city/cityData";
import { scrollToForm } from "../../lib/scroll";

export type PanelTarget = { kind: "client"; id: string } | { kind: "hq" | "construction" | "plot" };

const QUESTS = [
  { title: "Vyplníte formulár", sub: "menej ako minúta" },
  { title: "Do 24h dostanete návrh", sub: "profesionálny, na mieru" },
  { title: "Rozhodnete sa", sub: "bez záväzkov" },
];

const linkButton =
  "inline-flex items-center gap-1.5 border border-white/10 bg-white/[0.03] px-3 py-2 text-[0.8rem] text-[#F5F5F0]/75 transition-colors hover:border-[#1AFF8C]/50 hover:text-[#1AFF8C]";

function Window({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <>
      <div className="flex items-center gap-2 border-b-2 border-[#6C63FF]/40 bg-[#6C63FF]/10 px-5 py-2.5 pr-12 font-pixel text-[0.8rem] uppercase tracking-wider text-[#9F97FF]">
        <span className="h-2 w-2 bg-[#1AFF8C]" />
        {kicker}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </>
  );
}

function Cta({ prompt, onClose }: { prompt: string; onClose: () => void }) {
  return (
    <div className="mt-6 border-t border-white/10 pt-5">
      <p className="mb-4 text-[0.9rem] text-[#F5F5F0]/70">{prompt}</p>
      <MagneticButton
        onClick={() => {
          onClose();
          // wait for the dialog to release the page scroll
          setTimeout(scrollToForm, 60);
        }}
      >
        Chcem návrh zadarmo
      </MagneticButton>
    </div>
  );
}

function ShareButtons({ client }: { client: CityClient }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/mesto/${client.id}/`;
  const title = `${client.name} — budova v meste klientov SiteLeveled`;

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
        <a href={client.url} target="_blank" rel="noopener noreferrer" className={linkButton}>
          <ExternalLink size={14} />
          Navštíviť web
        </a>
        <button type="button" onClick={share} className={linkButton}>
          {copied ? <Check size={14} /> : navigator.share ? <Share2 size={14} /> : <Copy size={14} />}
          {copied ? "Odkaz skopírovaný" : "Zdieľať budovu"}
        </button>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={linkButton}
          aria-label="Zdieľať na LinkedIn"
        >
          <Linkedin size={14} />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={linkButton}
          aria-label="Zdieľať na Facebooku"
        >
          <Facebook size={14} />
        </a>
      </div>
      <p className="mt-2 select-all font-pixel text-[0.75rem] text-[#F5F5F0]/35">{url.replace(/^https?:\/\//, "")}</p>
    </div>
  );
}

function ClientWindow({ client, onClose }: { client: CityClient; onClose: () => void }) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${client.name} — budova v meste klientov SiteLeveled`;
    return () => {
      document.title = previous;
    };
  }, [client]);

  return (
    <Window kicker="Budova v meste klientov">
      <Dialog.Title className="font-heading text-[1.6rem] font-bold leading-tight text-[#F5F5F0]">
        {client.name}
      </Dialog.Title>
      <Dialog.Description className="mt-1 text-[0.85rem] text-[#F5F5F0]/50">{client.category}</Dialog.Description>

      <a
        href={client.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block overflow-hidden border border-white/10"
      >
        <img
          src={client.image}
          alt={`Screenshot ${client.name}`}
          className="aspect-[2/1] w-full object-cover object-top"
        />
      </a>

      <span className="mt-4 inline-flex rounded-full bg-[#1AFF8C]/10 px-3 py-1 text-[0.75rem] text-[#1AFF8C]">
        {client.result}
      </span>

      <dl className="mt-4 space-y-3 text-[0.85rem] leading-relaxed">
        <div>
          <dt className="font-pixel text-[0.75rem] uppercase tracking-wider text-[#9F97FF]">Výzva</dt>
          <dd className="text-[#F5F5F0]/70">{client.challenge}</dd>
        </div>
        <div>
          <dt className="font-pixel text-[0.75rem] uppercase tracking-wider text-[#9F97FF]">Riešenie</dt>
          <dd className="text-[#F5F5F0]/70">{client.solution}</dd>
        </div>
      </dl>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Odomknuté vylepšenia">
        {client.perks.map((perk) => (
          <li
            key={perk}
            className="inline-flex items-center gap-1.5 border border-[#FFD93D]/30 bg-[#FFD93D]/5 px-2.5 py-1 font-pixel text-[0.75rem] text-[#FFD93D]"
          >
            <Trophy size={12} />
            {perk}
          </li>
        ))}
      </ul>

      {client.testimonial && (
        <blockquote className="mt-5 border-l-2 border-[#6C63FF] pl-3 text-[0.85rem] italic leading-relaxed text-[#F5F5F0]/60">
          &ldquo;{client.testimonial.text}&rdquo;
          <footer className="mt-1 not-italic text-[#F5F5F0]/40">
            — {client.testimonial.author}, odporúčanie na Facebooku
          </footer>
        </blockquote>
      )}

      <ShareButtons client={client} />
      <Cta prompt="Chcete v meste aj svoju budovu?" onClose={onClose} />
    </Window>
  );
}

export function CityPanel({ target, onClose }: { target: PanelTarget; onClose: () => void }) {
  const client = target.kind === "client" ? findClient(target.id) : undefined;

  const content =
    client ? (
      <ClientWindow client={client} onClose={onClose} />
    ) : target.kind === "hq" ? (
      <Window kicker="Centrála">
        <Dialog.Title className="font-heading text-[1.6rem] font-bold text-[#F5F5F0]">SiteLeveled HQ</Dialog.Title>
        <Dialog.Description className="mt-2 text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">
          Tu vznikajú návrhy pre celé mesto. Váš môže byť ďalší – stačia tri kroky:
        </Dialog.Description>
        <ol className="mt-4 space-y-2">
          {QUESTS.map((quest, i) => (
            <li key={quest.title} className="flex items-center gap-3 border border-white/10 bg-white/[0.03] p-3">
              <span className="font-pixel text-[0.9rem] text-[#1AFF8C]">Q{i + 1}</span>
              <div>
                <p className="text-[0.9rem] text-[#F5F5F0]">{quest.title}</p>
                <p className="text-[0.75rem] text-[#F5F5F0]/45">{quest.sub}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link to="/o-nas/" className="mt-4 inline-block text-[0.85rem] text-[#9F97FF] hover:text-[#1AFF8C]">
          Kto za tým stojí →
        </Link>
        <Cta prompt="Začnite prvým krokom – formulár zaberie menej ako minútu." onClose={onClose} />
      </Window>
    ) : target.kind === "construction" ? (
      <Window kicker="Stavenisko">
        <Dialog.Title className="font-heading text-[1.6rem] font-bold text-[#F5F5F0]">Vo výstavbe</Dialog.Title>
        <Dialog.Description className="mt-2 text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">
          Takto vzniká každý návrh: najprv skica rozloženia, potom dizajn – a do 24 hodín je hotovo. Bez
          záväzkov, bez skrytých poplatkov.
        </Dialog.Description>
        <Cta prompt="Ďalšia budova môže byť vaša." onClose={onClose} />
      </Window>
    ) : (
      <Window kicker="Voľný pozemok">
        <Dialog.Title className="font-heading text-[1.6rem] font-bold text-[#F5F5F0]">
          Tu môže stáť váš web
        </Dialog.Title>
        <Dialog.Description className="mt-2 text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">
          Návrh dostanete do 24 hodín zadarmo. Ak sa vám zapáči, postavíme ho – a vaša firma pribudne do
          mesta ako ďalšia budova.
        </Dialog.Description>
        <Cta prompt="Pozemok si zarezervujete vyplnením krátkeho formulára." onClose={onClose} />
      </Window>
    );

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto border-2 border-[#6C63FF] bg-[#0b0b14] shadow-[6px_6px_0_0_rgba(108,99,255,0.35)] duration-200 focus:outline-none">
          {content}
          <Dialog.Close
            aria-label="Zavrieť"
            className="absolute right-3 top-2 p-1 text-[#F5F5F0]/50 transition-colors hover:text-[#1AFF8C] focus-visible:outline-2 focus-visible:outline-[#1AFF8C]"
          >
            <X size={18} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
