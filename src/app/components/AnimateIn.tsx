import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
}

export function AnimateIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: AnimateInProps) {
  const initial: Record<string, number> = { opacity: 0 };
  if (direction === "up") initial.y = 30;
  if (direction === "left") initial.x = -30;
  if (direction === "right") initial.x = 30;

  const animate: Record<string, number> = { opacity: 1, y: 0, x: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
