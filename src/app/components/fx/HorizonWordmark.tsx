import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView } from "motion/react";

const WORD = "SITELEVELED";
// SITE in white, LEVELED in the brand violet running into cyan, as in the logo
const SITE_FILL = "linear-gradient(180deg, #FFFFFF 15%, #E4E2F0 55%, #A9A6C6 100%)";
const LEVELED_FILL = "linear-gradient(180deg, #E6E3FF 0%, #9F97FF 40%, #6C63FF 75%, #00D9FF 125%)";
const STAGGER_S = 0.06;

/** The word standing on the horizon; each letter rises out of the floor once `risen` turns on */
function Letters({ risen, className = "", style }: { risen: boolean; className?: string; style?: CSSProperties }) {
  return (
    <div className={`absolute inset-x-0 bottom-[42%] flex justify-center ${className}`} style={style}>
      {WORD.split("").map((ch, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pt-[0.06em] font-heading font-extrabold leading-[0.82] tracking-[-0.02em]"
          style={{ fontSize: "8cqw" }}
        >
          <span
            className={`inline-block bg-clip-text text-transparent transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:transition-none ${
              risen ? "translate-y-0" : "translate-y-[112%]"
            }`}
            style={{ backgroundImage: i < 4 ? SITE_FILL : LEVELED_FILL, transitionDelay: `${i * STAGGER_S}s` }}
          >
            {ch}
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * The footer's closing wordmark: SITELEVELED on a glowing horizon over a perspective grid
 * floor, with its reflection below. Sized in cqw so the whole word fits any width.
 */
export function HorizonWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const [risen, setRisen] = useState(false);

  useEffect(() => {
    if (inView) setRisen(true);
  }, [inView]);

  return (
    <div ref={ref} aria-hidden className="@container pointer-events-none relative select-none overflow-hidden">
      <div
        className="relative"
        style={{ height: "30cqw", background: "linear-gradient(180deg, #0A0A0F 0%, #0D0B20 58%, #130F2E 100%)" }}
      >
        {/* Glow rising from the horizon */}
        <span
          className="absolute inset-x-[12%] top-[30%] h-[28%]"
          style={{ background: "radial-gradient(50% 100% at 50% 100%, rgba(108,99,255,0.32), rgba(108,99,255,0))" }}
        />

        {/* Grid floor; the drift is a transform, so it never repaints and pauses off screen */}
        <div
          className="absolute inset-x-0 top-[58%] bottom-0 overflow-hidden"
          style={{ perspective: "22cqw", perspectiveOrigin: "50% 0%" }}
        >
          <div
            className={`absolute -inset-x-[80%] top-0 h-[300%] origin-top motion-safe:animate-grid-drift ${
              inView ? "" : "[animation-play-state:paused]"
            }`}
            style={{
              transform: "rotateX(70deg)",
              backgroundImage:
                "linear-gradient(rgba(124,116,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(124,116,255,0.55) 1px, transparent 1px)",
              backgroundSize: "2.4cqw 2.4cqw",
            }}
          />
          <span
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, #0D0B20 0%, rgba(13,11,32,0) 55%)" }}
          />
        </div>

        {/* Reflection on the floor */}
        <Letters
          risen={risen}
          className="origin-bottom -scale-y-100 opacity-[0.22]"
          style={{
            maskImage: "linear-gradient(0deg, #000 0%, transparent 75%)",
            WebkitMaskImage: "linear-gradient(0deg, #000 0%, transparent 75%)",
          }}
        />

        {/* Horizon */}
        <span
          className="absolute inset-x-0 top-[58%] h-px"
          style={{
            background: "linear-gradient(90deg, rgba(108,99,255,0), #6C63FF 22%, #00D9FF 50%, #6C63FF 78%, rgba(108,99,255,0))",
            boxShadow: "0 0 1.6cqw 0.3cqw rgba(108,99,255,0.55)",
          }}
        />

        <Letters risen={risen} />
      </div>
    </div>
  );
}
