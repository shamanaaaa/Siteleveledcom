import { ReactNode } from "react";
import { useReveal } from "../lib/useReveal";

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
}

export function AnimateIn({ children, delay = 0, className = "", direction = "up" }: AnimateInProps) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} data-reveal={direction} className={className} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  );
}
