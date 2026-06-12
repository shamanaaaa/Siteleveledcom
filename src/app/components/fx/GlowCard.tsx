import { HTMLAttributes, MouseEvent, ReactNode, useRef } from "react";

interface GlowCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  glow?: string;
}

/**
 * Universal card shell: glass surface + cursor-tracked radial glow.
 * Writes --mx/--my directly on the element (no React state, no re-renders);
 * touch devices never fire mousemove so the glow simply stays off.
 */
export function GlowCard({
  children,
  className = "",
  glow = "rgba(108, 99, 255, 0.14)",
  ...rest
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`group/glow relative overflow-hidden rounded-card border border-white/5 bg-surface-1 transition-colors duration-300 hover:border-border-strong ${className}`}
      {...rest}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/glow:opacity-100"
        style={{
          background: `radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), ${glow}, transparent 70%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
