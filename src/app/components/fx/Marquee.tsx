import { ReactNode } from "react";
import { useReducedMotion } from "motion/react";

interface MarqueeProps {
  children: ReactNode;
  /** Seconds per loop */
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  /** Applied to each copy of the content row; must include the inter-item gap
   *  and a matching trailing padding so the -50% loop is seamless */
  rowClassName?: string;
}

export function Marquee({
  children,
  duration = 36,
  reverse = false,
  pauseOnHover = true,
  className = "",
  rowClassName = "gap-10 pr-10",
}: MarqueeProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={`overflow-x-hidden ${className}`}>
        <div className={`flex w-max items-center ${rowClassName}`}>{children}</div>
      </div>
    );
  }

  return (
    <div className={`group overflow-hidden marquee-mask ${className}`}>
      <div
        className={`flex w-max animate-marquee ${
          pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
        }`}
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className={`flex w-max items-center ${rowClassName}`}>{children}</div>
        <div className={`flex w-max items-center ${rowClassName}`} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
