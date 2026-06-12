import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

interface AnimatedCounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  /** e.g. sk-SK thousands: (n) => n.toLocaleString("sk-SK") */
  format?: (n: number) => string;
}

export function AnimatedCounter({
  end,
  prefix = "",
  suffix = "",
  duration = 1.4,
  format,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reducedMotion = useReducedMotion();
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => {
    const n = Math.round(v);
    return `${prefix}${format ? format(n) : n}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      value.set(end);
      return;
    }
    const controls = animate(value, end, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, end, duration, reducedMotion, value]);

  return <motion.span ref={ref}>{text}</motion.span>;
}
