import { motion, useReducedMotion } from "motion/react";
import { ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
  duration?: number;
  blur?: boolean;
}

export function AnimateIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
  duration = 0.6,
  blur = false,
}: AnimateInProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const initial: Record<string, number | string> = { opacity: 0 };
  if (direction === "up") initial.y = 30;
  if (direction === "left") initial.x = -30;
  if (direction === "right") initial.x = 30;
  if (blur) initial.filter = "blur(8px)";

  const animate: Record<string, number | string> = { opacity: 1, y: 0, x: 0 };
  if (blur) animate.filter = "blur(0px)";

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
