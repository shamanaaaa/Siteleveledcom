import type { CSSProperties, ReactNode } from "react";

const ACCENT = "#1AFF8C";

/** Short names beside the stack, top to bottom, in the order of the checklist next to it */
const LABELS = [["Vizuálny", "návrh"], ["Štruktúra", "webu"], ["Koncept", "textov"], ["Odporúčania"], ["Cenová", "ponuka"]];

// Each layer sits 13 % lower than the one above it; its label and leader line follow
const layerTop = (i: number) => 3 + i * 13;
const labelTop = (i: number) => 22 + i * 13;

/** A placeholder line of text; sizes are in cqw so the whole graphic scales with its card */
function Bar({ w, h = 1.2, alpha = 0.22, style }: { w: string; h?: number; alpha?: number; style?: CSSProperties }) {
  return (
    <span
      className="block shrink-0 rounded-full"
      style={{ width: w, height: `${h}cqw`, background: `rgba(255,255,255,${alpha})`, ...style }}
    />
  );
}

function Layer({
  index,
  active,
  className = "",
  style,
  children,
}: {
  index: number;
  active: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const on = index === active;
  return (
    <div
      className="absolute transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
      style={{
        left: "13.9%",
        top: `${layerTop(index)}%`,
        width: "38cqw",
        height: "38cqw",
        zIndex: on ? 10 : 5 - index,
        opacity: on ? 1 : 0.62,
        // The active layer slides out of the stack towards the viewer
        transform: on ? "translate(-3cqw, -3.5cqw)" : "translate(0, 0)",
      }}
    >
      <div
        className={`absolute inset-0 box-border rounded-[2.4cqw] border-[1.5px] transition-[border-color,box-shadow,background-color] duration-500 motion-reduce:transition-none ${className}`}
        style={{
          transform: "rotateX(55deg) rotateZ(-45deg)",
          borderColor: on ? ACCENT : "rgba(159,151,255,0.28)",
          backgroundColor: on ? "#191924" : "rgba(22,22,31,0.94)",
          boxShadow: on ? `0 0 0 1px ${ACCENT}40, 0 2cqw 6cqw ${ACCENT}33` : "0 1.5cqw 4cqw rgba(0,0,0,0.45)",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * The free proposal as an isometric stack of its five parts: homepage design, sitemap,
 * copy, design notes and the price quote. `active` (0–4) lifts one layer out of the stack.
 */
export function ProposalLayers({ active, className = "" }: { active: number; className?: string }) {
  return (
    <div
      role="img"
      aria-label="Návrh webu rozložený na päť vrstiev: vizuálny návrh, štruktúra, texty, odporúčania a cenová ponuka"
      className={`@container relative aspect-square overflow-hidden rounded-card border border-white/5 ${className}`}
      style={{
        background: "radial-gradient(55% 50% at 34% 52%, rgba(108,99,255,0.16), transparent 72%), var(--surface-1)",
      }}
    >
      {/* Centred in wide cards; narrow ones keep it left so the labels have room */}
      <div className="absolute inset-0 @md:translate-x-[5%]">
        <span
          className="absolute rounded-full bg-black/55"
          style={{ left: "10%", top: "86%", width: "46%", height: "6%", filter: "blur(2.5cqw)" }}
        />

        <div className="absolute inset-0 motion-safe:animate-float">
          {/* 5 · price quote: grey bars stand in for the amounts */}
          <Layer index={4} active={active} className="flex flex-col gap-[2.2cqw] p-[3.4cqw]">
            <span className="font-heading font-bold text-[#F5F5F0]" style={{ fontSize: "2.8cqw" }}>
              Cenová ponuka
            </span>
            {[
              [12, 7],
              [15, 6],
              [10, 8],
            ].map(([item, price], i) => (
              <div key={i} className="flex justify-between">
                <Bar w={`${item}cqw`} h={1.4} alpha={0.18} />
                <Bar w={`${price}cqw`} h={1.4} alpha={0.12} />
              </div>
            ))}
            <span className="h-px bg-white/10" />
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#F5F5F0]" style={{ fontSize: "2.2cqw" }}>
                Spolu
              </span>
              <Bar w="12cqw" h={2.4} style={{ background: "linear-gradient(90deg, #6C63FF, #9F97FF)" }} />
            </div>
          </Layer>

          {/* 4 · design recommendations: content blocks, palette, type */}
          <Layer index={3} active={active} className="grid grid-cols-2 gap-[2.4cqw] p-[3.4cqw]">
            <div className="flex flex-col gap-[1.2cqw] rounded-[1.4cqw] bg-[#9F97FF]/20 p-[2cqw]">
              <Bar w="80%" alpha={0.4} />
              <Bar w="60%" alpha={0.25} />
              <Bar w="70%" alpha={0.25} />
            </div>
            <div className="flex flex-col gap-[1.2cqw] rounded-[1.4cqw] bg-[#1AFF8C]/16 p-[2cqw]">
              <Bar w="70%" alpha={0.4} />
              <Bar w="85%" alpha={0.25} />
            </div>
            <div className="flex items-center gap-[1cqw]">
              {["#6C63FF", "#1AFF8C", "#F5F5F0"].map((c) => (
                <span key={c} className="rounded-full" style={{ width: "4.5cqw", height: "4.5cqw", background: c }} />
              ))}
            </div>
            <span className="font-heading font-bold leading-none text-[#F5F5F0]" style={{ fontSize: "7cqw" }}>
              Aa
            </span>
          </Layer>

          {/* 3 · copy: headings over body text */}
          <Layer index={2} active={active} className="flex flex-col gap-[1.6cqw] p-[3.4cqw]">
            <div className="flex items-center gap-[1.4cqw]">
              <span className="font-bold text-[#9F97FF]" style={{ fontSize: "1.8cqw" }}>
                H1
              </span>
              <Bar w="22cqw" h={2.6} alpha={0.75} style={{ borderRadius: "0.6cqw" }} />
            </div>
            <Bar w="92%" />
            <Bar w="84%" />
            <Bar w="70%" />
            <div className="mt-[1cqw] flex items-center gap-[1.4cqw]">
              <span className="font-bold text-[#9F97FF]" style={{ fontSize: "1.8cqw" }}>
                H2
              </span>
              <Bar w="15cqw" h={2} alpha={0.55} style={{ borderRadius: "0.6cqw" }} />
            </div>
            <Bar w="88%" />
            <Bar w="62%" />
          </Layer>

          {/* 2 · sitemap: homepage, four subpages, a few of their sections */}
          <Layer index={1} active={active} className="flex flex-col items-center p-[3.4cqw]">
            <span
              className="rounded-[1cqw] border-[1.5px] border-[#9F97FF] bg-[#6C63FF]/25"
              style={{ width: "14cqw", height: "6cqw" }}
            />
            <span className="w-[1.5px] bg-[#9F97FF]/60" style={{ height: "3.4cqw" }} />
            <span className="h-[1.5px] w-[76%] bg-[#9F97FF]/60" />
            <div className="grid w-full grid-cols-4 gap-[1.4cqw]">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="w-[1.5px] bg-[#9F97FF]/60" style={{ height: "2.6cqw" }} />
                  <span
                    className="w-full rounded-[0.8cqw] border border-white/25 bg-white/5"
                    style={{ height: "5cqw" }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-[2cqw] grid w-full grid-cols-4 gap-[1.4cqw]">
              {[true, true, false, true].map((shown, i) =>
                shown ? (
                  <span
                    key={i}
                    className="rounded-[0.6cqw] border border-dashed border-white/20"
                    style={{ height: "3.4cqw" }}
                  />
                ) : (
                  <span key={i} />
                ),
              )}
            </div>
          </Layer>

          {/* 1 · homepage design */}
          <Layer
            index={0}
            active={active}
            className="flex flex-col overflow-hidden"
            style={{ backgroundColor: "#06060B" }}
          >
            <div className="flex items-center gap-[1.6cqw] px-[3.4cqw] py-[2.6cqw]">
              <Bar w="7cqw" h={1.8} style={{ borderRadius: "0.5cqw", background: "linear-gradient(90deg, #6C63FF, #9F97FF)" }} />
              <span className="flex-1" />
              <Bar w="3.4cqw" h={1} alpha={0.3} />
              <Bar w="3.4cqw" h={1} alpha={0.3} />
              <Bar w="6cqw" h={2.6} style={{ background: "#6C63FF" }} />
            </div>
            <div className="grid flex-1 grid-cols-2 gap-[2.4cqw] px-[3.4cqw] pb-[3.4cqw]">
              <div className="flex flex-col justify-center gap-[1.4cqw]">
                <Bar w="95%" h={2.4} alpha={0.85} style={{ borderRadius: "0.5cqw" }} />
                <Bar w="70%" h={2.4} style={{ borderRadius: "0.5cqw", background: "linear-gradient(90deg, #6C63FF, #00D9FF)" }} />
                <Bar w="85%" h={1} alpha={0.25} />
                <Bar w="11cqw" h={3.6} style={{ marginTop: "1cqw", borderRadius: "1cqw", background: "#6C63FF" }} />
              </div>
              <div
                className="relative overflow-hidden rounded-[1.6cqw]"
                style={{ background: "linear-gradient(135deg, rgba(108,99,255,0.9), rgba(75,69,198,0.75) 55%, rgba(0,217,255,0.55))" }}
              >
                <span
                  className="absolute rounded-full bg-white/30"
                  style={{ left: "14%", top: "12%", width: "4cqw", height: "4cqw" }}
                />
                <span
                  className="absolute rounded-full bg-[#1AFF8C] font-bold text-[#06060B]"
                  style={{ right: "8%", bottom: "8%", padding: "0.4cqw 1cqw", fontSize: "1.3cqw" }}
                >
                  Nové
                </span>
              </div>
            </div>
          </Layer>
        </div>

        {/* Leader lines from the stack to the labels */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {LABELS.map((_, i) => (
            <path
              key={i}
              d={`M59.5 ${labelTop(i)} H66`}
              fill="none"
              stroke={i === active ? ACCENT : "rgba(159,151,255,0.3)"}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
              className="transition-[stroke] duration-500"
            />
          ))}
        </svg>

        {LABELS.map((lines, i) => {
          const on = i === active;
          return (
            <div
              key={i}
              aria-hidden
              className="absolute flex -translate-y-1/2 flex-col gap-[0.3cqw]"
              style={{ left: "67.5%", top: `${labelTop(i)}%` }}
            >
              <span
                className="hidden font-bold tracking-[0.14em] transition-colors duration-500 @min-[18rem]:block"
                style={{ fontSize: "max(1.4cqw, 9px)", color: on ? ACCENT : "rgba(159,151,255,0.6)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="font-heading font-bold leading-[1.15] transition-colors duration-500"
                style={{ fontSize: "max(2.1cqw, 11px)", color: on ? "#F5F5F0" : "rgba(245,245,240,0.45)" }}
              >
                {lines.map((line, j) => (
                  <span key={j} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
