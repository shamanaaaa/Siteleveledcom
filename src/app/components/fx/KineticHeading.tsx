import { motion, useReducedMotion } from "motion/react";

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

const motionTags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p } as const;

const containerVariants = (stagger: number, delay: number) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

const wordVariants = {
  hidden: { y: "115%" },
  visible: {
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function KineticHeading({
  as = "h2",
  segments,
  className = "",
  delay = 0,
  stagger = 0.055,
  inView = true,
}: KineticHeadingProps) {
  const reducedMotion = useReducedMotion();
  const label = segments.map((s) => s.text).join(" ");

  if (reducedMotion) {
    const StaticTag = as;
    return (
      <StaticTag className={className}>
        {segments.map((s, i) => (
          <span key={i} className={s.className}>
            {s.text}
            {s.br ? <br /> : i < segments.length - 1 ? " " : null}
          </span>
        ))}
      </StaticTag>
    );
  }

  const MotionTag = motionTags[as];
  const viewProps = inView
    ? { whileInView: "visible" as const, viewport: { once: true, margin: "-60px" } }
    : { animate: "visible" as const };

  return (
    <MotionTag
      className={className}
      aria-label={label}
      initial="hidden"
      variants={containerVariants(stagger, delay)}
      {...viewProps}
    >
      {segments.map((segment, si) => (
        <span key={si} aria-hidden className={segment.className}>
          {segment.text.split(" ").map((word, wi, words) => (
            <span
              key={wi}
              // Overshoot padding so Slovak diacritics and descenders are not
              // clipped by the overflow mask (Ž, Š, ť, ľ, g, j, y)
              className="inline-block overflow-hidden align-bottom pt-[0.1em] -mt-[0.1em] pb-[0.12em] -mb-[0.12em]"
            >
              <motion.span variants={wordVariants} className="inline-block will-change-transform">
                {word}
                {wi < words.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
          {segment.br ? <br /> : si < segments.length - 1 ? " " : null}
        </span>
      ))}
    </MotionTag>
  );
}
