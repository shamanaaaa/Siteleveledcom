import { AnimateIn } from "../AnimateIn";
import { KineticHeading, KineticSegment } from "./KineticHeading";

interface SectionHeadingProps {
  eyebrow?: string;
  segments: KineticSegment[];
  sub?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  segments,
  sub,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignClasses = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignClasses} ${className}`}>
      {eyebrow && (
        <AnimateIn>
          <span className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary-soft">
            <span className="h-px w-6 bg-primary/60" />
            {eyebrow}
            {align === "center" && <span className="h-px w-6 bg-primary/60" />}
          </span>
        </AnimateIn>
      )}
      <KineticHeading
        as="h2"
        segments={segments}
        className="font-heading text-title font-bold tracking-tight"
      />
      {sub && (
        <AnimateIn delay={0.15}>
          <p className={`mt-4 max-w-2xl text-[#8888a0] ${align === "center" ? "mx-auto" : ""}`}>
            {sub}
          </p>
        </AnimateIn>
      )}
    </div>
  );
}
