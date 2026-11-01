import { useReveal } from "../../lib/useReveal";

export interface KineticSegment {
  text: string;
  className?: string;
  /** Insert a line break after this segment */
  br?: boolean;
}

interface KineticHeadingProps {
  as?: "h1" | "h2" | "h3" | "p";
  segments: KineticSegment[];
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate when scrolled into view (default) instead of on mount */
  inView?: boolean;
}

export function KineticHeading({
  as: Tag = "h2",
  segments,
  className = "",
  delay = 0,
  stagger = 0.055,
  inView = true,
}: KineticHeadingProps) {
  const ref = useReveal<HTMLElement>(inView);
  const label = segments.map((s) => s.text).join(" ");
  // A paragraph can't be named with aria-label, so there the words are read as they are
  const labelled = Tag !== "p";
  let wordIndex = 0;

  return (
    // The reveal is CSS (theme.css). On the first screen data-shown is there from the start,
    // so a pre-rendered heading animates in without waiting for the JavaScript
    <Tag
      // Every tag this can be is an HTMLElement
      ref={ref as never}
      data-kinetic=""
      data-shown={inView ? undefined : ""}
      className={className}
      aria-label={labelled ? label : undefined}
    >
      {segments.map((segment, si) => (
        <span key={si} aria-hidden={labelled || undefined}>
          {segment.text.split(" ").map((word, wi, words) => (
            <span
              key={wi}
              // Overshoot padding so Slovak diacritics and descenders are not
              // clipped by the overflow mask (Ž, Š, ť, ľ, g, j, y)
              className="inline-block overflow-hidden align-bottom pt-[0.1em] -mt-[0.1em] pb-[0.12em] -mb-[0.12em]"
            >
              {/* segment className (e.g. text-gradient-primary) must sit on the word:
                  background-clip:text cannot paint through transformed child layers.
                  whitespace-pre: the browser would otherwise drop the space at the end of the word */}
              <span
                className={`kinetic-word inline-block whitespace-pre ${segment.className ?? ""}`}
                style={{ animationDelay: `${delay + stagger * wordIndex++}s` }}
              >
                {word}
                {wi < words.length - 1 ? " " : ""}
              </span>
            </span>
          ))}
          {segment.br ? <br /> : si < segments.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
