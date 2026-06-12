import { ReactNode, useEffect, useState, PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const MotionLink = motion.create(Link);

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  /** react-router target */
  to?: string;
  /** plain anchor target (hash links, external) */
  href?: string;
  type?: "button" | "submit";
  strength?: number;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  arrow?: boolean;
  disabled?: boolean;
  className?: string;
}

const variantClasses = {
  primary:
    "bg-primary text-white shadow-[0_8px_32px_rgba(108,99,255,0.35)] hover:shadow-[0_8px_44px_rgba(108,99,255,0.5)] hover:bg-[#7B73FF]",
  ghost:
    "border border-white/10 bg-white/[0.03] text-foreground hover:bg-white/[0.07] hover:border-border-strong",
};

const sizeClasses = {
  md: "px-6 py-3",
  lg: "px-8 py-4 text-lg",
};

export function MagneticButton({
  children,
  onClick,
  to,
  href,
  type = "button",
  strength = 0.25,
  variant = "primary",
  size = "md",
  arrow = true,
  disabled = false,
  className = "",
}: MagneticButtonProps) {
  const reducedMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    setFinePointer(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 220, damping: 18 });
  const springY = useSpring(my, { stiffness: 220, damping: 18 });
  const labelX = useTransform(springX, (v) => v * 0.35);
  const labelY = useTransform(springY, (v) => v * 0.35);

  const magnetic = finePointer && !reducedMotion && !disabled;

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!magnetic) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    my.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handlePointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const baseClassName = `group relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-[box-shadow,background-color,border-color] duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const sharedProps = {
    className: baseClassName,
    style: { x: springX, y: springY },
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
    onClick,
  };

  const inner = (
    <motion.span style={{ x: labelX, y: labelY }} className="inline-flex items-center gap-2">
      {children}
      {arrow && (
        <ArrowRight className="h-[1.1em] w-[1.1em] transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </motion.span>
  );

  if (to) {
    return (
      <MotionLink to={to} {...sharedProps}>
        {inner}
      </MotionLink>
    );
  }

  if (href) {
    return (
      <motion.a href={href} {...sharedProps}>
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} disabled={disabled} {...sharedProps}>
      {inner}
    </motion.button>
  );
}
