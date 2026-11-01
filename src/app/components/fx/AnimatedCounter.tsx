import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

interface AnimatedCounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  /** e.g. sk-SK thousands: (n) => n.toLocaleString("sk-SK") */
  format?: (n: number) => string;
}

/**
 * Counts up to `end` once it scrolls into view. The DOM text is always the real number (these
 * are prices: a crawler or link preview must never record "0 €" or a value halfway up); the
 * count-up is drawn by ::before from data-count, which neither crawlers nor screen readers read.
 */
export function AnimatedCounter({
  end,
  prefix = "",
  suffix = "",
  duration = 1.4,
  format,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();
  const [counting, setCounting] = useState(false);
  const show = (n: number) => `${prefix}${format ? format(n) : n}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!inView || reducedMotion || !el) return;
    el.dataset.count = show(0);
    setCounting(true);
    const controls = animate(0, end, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => (el.dataset.count = show(Math.round(v))),
      onComplete: () => setCounting(false),
    });
    return () => controls.stop();
  }, [inView, end, duration, reducedMotion, prefix, suffix, format]);

  return (
    <span
      ref={ref}
      className={counting ? "relative before:absolute before:left-0 before:content-[attr(data-count)]" : undefined}
    >
      <span className={counting ? "invisible" : undefined}>{show(end)}</span>
    </span>
  );
}
