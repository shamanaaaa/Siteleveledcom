interface AuroraProps {
  variant?: "hero" | "section" | "cta";
  className?: string;
}

export function Aurora({ variant = "section", className = "" }: AuroraProps) {
  return <div aria-hidden className={`aurora aurora--${variant} ${className}`} />;
}
