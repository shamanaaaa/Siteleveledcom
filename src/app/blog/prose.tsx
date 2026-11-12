import type { ReactNode } from "react";
import { Link } from "react-router";
import { Check } from "lucide-react";

// Article typography. Body text stays at 75 % opacity or more and links are underlined,
// so the contrast check in tests/browser.mjs passes on every article.

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mb-4 mt-14 scroll-mt-28 font-heading text-[1.5rem] font-bold leading-tight text-[#F5F5F0] sm:text-[1.75rem]">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mb-2 mt-8 font-heading text-[1.15rem] font-bold text-[#F5F5F0]">{children}</h3>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mb-5 text-[1.02rem] leading-[1.75] text-[#F5F5F0]/75">{children}</p>;
}

export function Checklist({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mb-6 space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-[1.02rem] leading-[1.65] text-[#F5F5F0]/75">
          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1AFF8C]/12">
            <Check size={12} className="text-[#1AFF8C]" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Numbered({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <ol className="mb-6 space-y-4">
      {items.map((item, i) => (
        <li key={item.q} className="flex items-start gap-4">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6C63FF]/15 font-heading text-[0.85rem] font-bold text-[#9F97FF]">
            {i + 1}
          </span>
          <span className="text-[1.02rem] leading-[1.65] text-[#F5F5F0]/75">
            <strong className="font-semibold text-[#F5F5F0]">{item.q}</strong> {item.a}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function A({ to, children }: { to: string; children: ReactNode }) {
  const className = "text-[#9F97FF] underline underline-offset-2 hover:text-[#F5F5F0]";
  if (/^(https?:|tel:|mailto:)/.test(to)) {
    return <a href={to} className={className} {...(to.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>{children}</a>;
  }
  return <Link to={to} className={className}>{children}</Link>;
}

export function Summary({ children }: { children: ReactNode }) {
  return (
    <div className="mb-10 rounded-card border border-[#6C63FF]/25 bg-surface-1 p-6 md:p-7">
      <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[#9F97FF]">Stručne</p>
      <p className="text-[1.05rem] leading-[1.7] text-[#F5F5F0]/85">{children}</p>
    </div>
  );
}

export function Contents({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="Obsah článku" className="mb-4 border-l border-white/10 pl-5">
      <p className="mb-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#F5F5F0]/60">Obsah</p>
      <ol className="space-y-2 text-[0.95rem]">
        {items.map(item => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="text-[#F5F5F0]/75 underline decoration-white/20 underline-offset-4 hover:text-[#9F97FF]">{item.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
