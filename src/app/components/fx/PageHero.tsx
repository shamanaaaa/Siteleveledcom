import type { ReactNode } from "react";
import { Aurora } from "./Aurora";
import { KineticHeading, KineticSegment } from "./KineticHeading";

interface PageHeroProps {
  /** The page's h1, worded the way people search ("Cenník tvorby webstránok"); shown as the small eyebrow */
  title: string;
  /** The big slogan under it */
  segments: KineticSegment[];
  sub?: string;
  /** Under the intro, for a call to action */
  children?: ReactNode;
}

// No fade on the h1 and intro: the intro is usually the page's largest text, and fading it from
// opacity 0 delays LCP by about a second on phones. The slogan's reveal only moves the words
export function PageHero({ title, segments, sub, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 md:pb-20 md:pt-44">
      <Aurora variant="hero" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6C63FF]/25 to-transparent" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="max-w-4xl">
          <h1 className="mb-5 inline-flex items-center gap-3 font-body text-xs font-semibold uppercase tracking-[0.22em] text-primary-soft">
            <span aria-hidden className="h-px w-6 shrink-0 bg-primary/60" />
            {title}
          </h1>
          <KineticHeading
            as="p"
            inView={false}
            delay={0.1}
            segments={segments}
            className="mb-6 font-heading text-display-2 font-bold"
          />
          {sub && <p className="max-w-2xl text-[1.05rem] leading-relaxed text-[#F5F5F0]/50">{sub}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
