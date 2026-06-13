import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check, MousePointer2 } from "lucide-react";

type Phase = "skeleton" | "painting" | "finished";

const PHASE_MS: Record<Phase, number> = {
  skeleton: 2400,
  painting: 2800,
  finished: 3200,
};

const EASE = [0.22, 1, 0.36, 1] as const;

/* Wireframe blocks: draw in during "skeleton", dim while being painted over */
const skelBlock = {
  hidden: { opacity: 0, scaleX: 0 },
  skeleton: { opacity: 1, scaleX: 1, transition: { duration: 0.4, ease: EASE } },
  painting: { opacity: 0.16, scaleX: 1, transition: { duration: 0.6 } },
  finished: { opacity: 0.08, scaleX: 1 },
};

const skelLine = {
  hidden: { pathLength: 0, opacity: 0 },
  skeleton: { pathLength: 1, opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
  painting: { pathLength: 1, opacity: 0.15, transition: { duration: 0.6 } },
  finished: { pathLength: 1, opacity: 0 },
};

/* Painted blocks: crossfade in during "painting" */
const paintBlock = {
  hidden: { opacity: 0, scale: 0.96 },
  skeleton: { opacity: 0, scale: 0.96 },
  painting: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE } },
  finished: { opacity: 1, scale: 1 },
};

const skelLayer = {
  hidden: {},
  skeleton: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  painting: { transition: { staggerChildren: 0.04 } },
  finished: {},
};

const paintLayer = {
  hidden: {},
  skeleton: {},
  painting: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
  finished: {},
};

const CARD_ACCENTS = ["#6C63FF", "#1AFF8C", "#00D9FF"];

function MockLayout({ mode, compact }: { mode: "skeleton" | "paint"; compact: boolean }) {
  const v = mode === "skeleton" ? skelBlock : paintBlock;
  const skel = mode === "skeleton";

  return (
    <div className={`absolute inset-0 flex flex-col ${compact ? "gap-3 p-4" : "gap-4 p-4 sm:p-6"}`}>
      {/* mock navbar */}
      <div className="flex items-center gap-2">
        <motion.div
          variants={v}
          className={`h-2.5 w-14 origin-left rounded ${
            skel ? "bg-white/12" : "bg-gradient-to-r from-[#6C63FF] to-[#9F97FF]"
          }`}
        />
        <div className="flex-1" />
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={v}
            className={`h-1.5 w-7 origin-left rounded-full ${skel ? "bg-white/10" : "bg-white/25"}`}
          />
        ))}
        <motion.div
          variants={v}
          className={`ml-1 h-5 w-12 origin-left rounded-full ${skel ? "bg-white/10" : "bg-[#6C63FF]"}`}
        />
      </div>

      {/* mock hero: text column + image cell */}
      <div className="grid min-h-0 flex-1 grid-cols-5 gap-3 sm:gap-4">
        <div className="col-span-3 flex flex-col justify-center gap-2 sm:gap-2.5">
          <motion.div
            variants={v}
            className={`h-3.5 w-[92%] origin-left rounded sm:h-4 ${skel ? "bg-white/12" : "bg-white/80"}`}
          />
          <motion.div
            variants={v}
            className={`h-3.5 w-[68%] origin-left rounded sm:h-4 ${
              skel ? "bg-white/12" : "bg-gradient-to-r from-[#6C63FF] to-[#00D9FF]"
            }`}
          />
          <div className="mt-1 space-y-1.5">
            <motion.div
              variants={v}
              className={`h-1.5 w-[85%] origin-left rounded-full ${skel ? "bg-white/8" : "bg-white/25"}`}
            />
            <motion.div
              variants={v}
              className={`h-1.5 w-[60%] origin-left rounded-full ${skel ? "bg-white/8" : "bg-white/25"}`}
            />
          </div>
          <motion.div
            variants={v}
            className={`mt-2 flex h-7 w-24 origin-left items-center justify-center rounded-lg ${
              skel ? "border border-dashed border-white/20 bg-white/[0.03]" : "bg-[#6C63FF] shadow-[0_4px_16px_rgba(108,99,255,0.45)]"
            }`}
          >
            {!skel && <div className="h-1.5 w-12 rounded-full bg-white/85" />}
          </motion.div>
        </div>

        <div className="relative col-span-2">
          {skel ? (
            <motion.div
              variants={v}
              className="absolute inset-0 origin-left rounded-lg border border-dashed border-white/20 bg-white/[0.02]"
            >
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <motion.line
                  variants={skelLine}
                  x1="0" y1="0" x2="100" y2="100"
                  stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" vectorEffect="non-scaling-stroke"
                />
                <motion.line
                  variants={skelLine}
                  x1="100" y1="0" x2="0" y2="100"
                  stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" vectorEffect="non-scaling-stroke"
                />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              variants={v}
              className="absolute inset-0 origin-left overflow-hidden rounded-lg bg-gradient-to-br from-[#6C63FF]/80 via-[#4B45C6]/70 to-[#00D9FF]/50"
            >
              <div className="absolute left-3 top-3 h-5 w-5 rounded-full bg-white/30" />
              <div className="absolute -bottom-4 -left-2 h-12 w-[120%] rotate-[-8deg] bg-white/10" />
              <div className="absolute bottom-2 right-2 rounded-full bg-[#1AFF8C] px-1.5 py-0.5 text-[0.45rem] font-bold leading-none text-black">
                NOVÉ
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* mock cards row */}
      {!compact && (
        <div className="grid grid-cols-3 gap-3">
          {CARD_ACCENTS.map((accent, i) => (
            <motion.div
              key={i}
              variants={v}
              className={`origin-left rounded-lg p-2.5 ${
                skel
                  ? "border border-dashed border-white/15 bg-white/[0.02]"
                  : "border border-white/10 bg-white/[0.06]"
              }`}
            >
              <div
                className={`mb-2 h-4 w-4 rounded-md ${skel ? "bg-white/10" : ""}`}
                style={skel ? undefined : { background: accent }}
              />
              <div className={`mb-1 h-1.5 w-[80%] rounded-full ${skel ? "bg-white/8" : "bg-white/30"}`} />
              <div className={`h-1.5 w-[55%] rounded-full ${skel ? "bg-white/8" : "bg-white/15"}`} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function TypewriterUrl({ animate, cycle }: { animate: boolean; cycle: number }) {
  const full = "siteleveled.com/vas-navrh";
  const [length, setLength] = useState(animate ? 0 : full.length);

  useEffect(() => {
    if (!animate) {
      setLength(full.length);
      return;
    }
    setLength(0);
    const id = setInterval(() => {
      setLength((l) => {
        if (l >= full.length) {
          clearInterval(id);
          return l;
        }
        return l + 1;
      });
    }, 55);
    return () => clearInterval(id);
  }, [animate, cycle, full.length]);

  return (
    <span>
      {full.slice(0, length)}
      {animate && length < full.length && <span className="animate-pulse">|</span>}
    </span>
  );
}

const STATUS: Record<Phase, string> = {
  skeleton: "Skicujem layout…",
  painting: "Navrhujem dizajn…",
  finished: "Hotovo",
};

interface SelfBuildingSiteProps {
  /** Tighter layout without the cards row (mobile hero, bento tile) */
  compact?: boolean;
  /** Render the finished design with no animation (also used as reduced-motion fallback) */
  staticFinal?: boolean;
  className?: string;
}

export function SelfBuildingSite({
  compact = false,
  staticFinal = false,
  className = "",
}: SelfBuildingSiteProps) {
  const reducedMotion = useReducedMotion();
  const isStatic = staticFinal || !!reducedMotion;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.25 });
  const [phase, setPhase] = useState<Phase>(isStatic ? "finished" : "skeleton");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (isStatic || !inView) return;
    const firstRun = cycle === 0 && phase === "skeleton";
    const timer = setTimeout(
      () => {
        if (phase === "finished") {
          setCycle((c) => c + 1);
          setPhase("skeleton");
        } else {
          setPhase(phase === "skeleton" ? "painting" : "finished");
        }
      },
      PHASE_MS[phase] + (firstRun ? 600 : 0)
    );
    return () => clearTimeout(timer);
  }, [phase, cycle, inView, isStatic]);

  const displayPhase: Phase = isStatic ? "finished" : phase;

  return (
    <div
      ref={rootRef}
      className={`overflow-hidden rounded-2xl border border-white/8 bg-surface-1 shadow-[0_24px_80px_rgba(108,99,255,0.18)] ${className}`}
    >
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/40" />
        </div>
        <div className="mx-3 flex-1 rounded-md bg-white/5 px-3 py-1 text-[0.65rem] text-[#F5F5F0]/30">
          <TypewriterUrl animate={!isStatic} cycle={cycle} />
        </div>
      </div>

      {/* canvas */}
      <div className={`relative bg-bg-deep ${compact ? "aspect-[16/10]" : "aspect-[16/11]"}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={cycle}
            className="absolute inset-0"
            exit={isStatic ? undefined : { opacity: 0, transition: { duration: 0.45 } }}
          >
            {/* wireframe layer */}
            <motion.div
              className="absolute inset-0"
              variants={skelLayer}
              initial={isStatic ? false : "hidden"}
              animate={displayPhase}
            >
              <MockLayout mode="skeleton" compact={compact} />
            </motion.div>

            {/* painted layer */}
            <motion.div
              className="absolute inset-0"
              variants={paintLayer}
              initial={isStatic ? false : "hidden"}
              animate={displayPhase}
            >
              <MockLayout mode="paint" compact={compact} />
            </motion.div>

            {/* paint sweep */}
            {!isStatic && displayPhase === "painting" && (
              <motion.div
                aria-hidden
                className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-[#6C63FF]/12 to-transparent"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{
                  x: ["-100%", "500%"],
                  opacity: [0, 1, 1, 0],
                  transition: { duration: 2.4, ease: "easeInOut", times: [0, 0.15, 0.85, 1] },
                }}
              />
            )}

            {/* designer cursor */}
            {!isStatic && !compact && (
              <AnimatePresence>
                {displayPhase === "painting" && (
                  <motion.div
                    key="cursor"
                    className="pointer-events-none absolute z-10"
                    initial={{ left: "72%", top: "96%", opacity: 0 }}
                    animate={{
                      left: ["72%", "28%", "14%", "68%", "46%"],
                      top: ["96%", "26%", "52%", "34%", "82%"],
                      opacity: [0, 1, 1, 1, 1],
                      transition: { duration: 2.7, times: [0, 0.22, 0.48, 0.72, 1], ease: "easeInOut" },
                    }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  >
                    <MousePointer2
                      size={16}
                      className="fill-white/90 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
                    />
                    <motion.span
                      aria-hidden
                      className="absolute -left-1.5 -top-1.5 h-7 w-7 rounded-full border-2 border-white/70"
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{
                        scale: [0.3, 0.3, 1.7, 0.3, 0.3, 1.7, 0.3],
                        opacity: [0, 0, 0.8, 0, 0, 0.8, 0],
                        transition: { duration: 2.7, times: [0, 0.2, 0.32, 0.42, 0.66, 0.78, 1] },
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        </AnimatePresence>

        {/* status chip */}
        <div className="absolute bottom-3 right-3 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={displayPhase}
              initial={isStatic ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] ${
                displayPhase === "finished"
                  ? "border-[#1AFF8C]/30 bg-[#1AFF8C]/10 text-[#1AFF8C]"
                  : "border-white/10 bg-black/40 text-[#F5F5F0]/50"
              }`}
            >
              {displayPhase === "finished" ? (
                <Check size={11} />
              ) : (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6C63FF]" />
              )}
              {STATUS[displayPhase]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
