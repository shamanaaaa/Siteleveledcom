import { pathFor, routeMatch } from "../../i18n/routes";
import { useI18n } from "../../i18n/LocaleContext";
import { lazy, Suspense, useEffect, useRef, useState, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { useReducedMotion } from "../../lib/useReducedMotion";
import { CLIENTS, findClient } from "../../city/cityData";
import { canvasSurface } from "../../city/pixel";
import {
  CITY_H,
  CITY_W,
  HOTSPOTS,
  INTRO_MS,
  STILL_T,
  constructionPhase,
  drawCity,
  drawGround,
  type BuildPhase,
  type Hotspot,
} from "../../city/render";
import type { PanelTarget } from "./CityPanel";

const CityPanel = lazy(() => import("./CityPanel").then((m) => ({ default: m.CityPanel })));

/** ~20 fps is plenty for pixel art and keeps the CPU idle most of the time */
const FRAME_MS = 50;

const PHASE_LABEL: Record<BuildPhase, string> = {
  skeleton: "Skicujem layout…",
  painting: "Navrhujem dizajn…",
  finished: "Hotovo – ďalší web stojí",
};

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

/* Click areas: the hotspot outline as a clip-path, in percent so they scale with the canvas */
const AREAS = HOTSPOTS.map((spot) => {
  const xs = spot.hull.map((p) => p[0]);
  const ys = spot.hull.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  return {
    spot,
    style: {
      left: pct(x0, CITY_W),
      top: pct(y0, CITY_H),
      width: pct(x1 - x0, CITY_W),
      height: pct(y1 - y0, CITY_H),
      clipPath: `polygon(${spot.hull.map(([x, y]) => `${pct(x - x0, x1 - x0)} ${pct(y - y0, y1 - y0)}`).join(", ")})`,
    },
  };
});

const FIRST_PLOT = HOTSPOTS.find((spot) => spot.kind === "plot")!;

function label(spot: Hotspot, phase: BuildPhase) {
  if (spot.kind === "client") {
    const client = findClient(spot.id)!;
    return { title: client.name, sub: client.category };
  }
  if (spot.kind === "hq") return { title: "SiteLeveled HQ", sub: "Tu vznikajú návrhy" };
  if (spot.kind === "construction") return { title: "Vo výstavbe", sub: PHASE_LABEL[phase] };
  return { title: "Voľný pozemok", sub: "Tu môže stáť váš web" };
}

/** Fill the available width, snapped to whole device pixels unless that wastes too much room. */
function fitScale(available: number) {
  const dpr = window.devicePixelRatio || 1;
  const exact = available / CITY_W;
  const snapped = Math.floor(exact * dpr) / dpr;
  return snapped >= exact * 0.8 ? snapped : exact;
}

export function PixelCity({ className = "" }: { className?: string }) {
  const { t: tr, link: localLink, locale: language } = useI18n();
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();
  const slug = routeMatch(location.pathname)?.slug;
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredRef = useRef<string | null>(null);
  const repaintRef = useRef<(() => void) | null>(null);
  const [fit, setFit] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [phase, setPhase] = useState<BuildPhase>("finished");
  const [open, setOpen] = useState<PanelTarget | null>(null);

  // A shared link /mesto/<id>/ opens that client's building
  useEffect(() => {
    setOpen(slug && findClient(slug) ? { kind: "client", id: slug } : null);
  }, [slug]);

  useEffect(() => {
    hoveredRef.current = hovered;
    repaintRef.current?.();
  }, [hovered]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const update = () => {
      const { width, height } = box.getBoundingClientRect();
      const scale = fitScale(width);
      const w = Math.round(CITY_W * scale);
      const h = Math.round(CITY_H * scale);
      setFit({ x: Math.round((width - w) / 2), y: Math.round((height - h) / 2), w, h });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const ground = document.createElement("canvas");
    ground.width = CITY_W;
    ground.height = CITY_H;
    const groundCtx = ground.getContext("2d");
    if (groundCtx) drawGround(canvasSurface(groundCtx));
    const surface = canvasSurface(ctx);
    const paint = (t: number, intro: number) => {
      ctx.clearRect(0, 0, CITY_W, CITY_H);
      ctx.drawImage(ground, 0, 0);
      drawCity(surface, { locale: language, t, intro, hovered: hoveredRef.current });
    };

    if (reducedMotion) {
      repaintRef.current = () => paint(STILL_T, Infinity);
      repaintRef.current();
      return () => {
        repaintRef.current = null;
      };
    }

    // The city builds itself the first time it scrolls into view, then idles while hidden
    let raf = 0;
    let last = -Infinity;
    let introStart: number | null = null;
    let running = false;
    let inView = false;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < FRAME_MS) return;
      last = now;
      introStart ??= now;
      const intro = now - introStart;
      paint(now, intro >= INTRO_MS ? Infinity : intro);
      if (hoveredRef.current === "construction") setPhase(constructionPhase(now));
    };
    const start = () => {
      if (running || document.hidden || !inView) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    observer.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion, language]);

  const openSpot = (spot: Hotspot) => {
    if (spot.kind === "client") {
      setOpen({ kind: "client", id: spot.id });
      navigate(pathFor("cityClient", language, spot.id) + location.hash, { replace: true, preventScrollReset: true });
    } else {
      setOpen({ kind: spot.kind });
    }
  };

  // Let modified clicks open the share page in a new tab
  const onLinkClick = (event: MouseEvent, spot: Hotspot) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openSpot(spot);
  };

  const closePanel = () => {
    setOpen(null);
    setHovered(null);
    if (routeMatch(location.pathname)?.route.id === "cityClient") navigate(pathFor("home", language) + location.hash, { replace: true, preventScrollReset: true });
  };

  const hoverProps = (id: string) => ({
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered((current) => (current === id ? null : current)),
  });

  const hoveredSpot = HOTSPOTS.find((spot) => spot.id === hovered);
  const hoveredLabel = hoveredSpot && label(hoveredSpot, phase);
  const labelShift =
    hoveredSpot && hoveredSpot.anchor[0] < CITY_W * 0.25
      ? "-12%"
      : hoveredSpot && hoveredSpot.anchor[0] > CITY_W * 0.75
        ? "-88%"
        : "-50%";

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-3 font-pixel text-[0.8rem] uppercase tracking-wider">
        <span className="flex items-center gap-2 text-[#9F97FF]">
          <span className="h-2 w-2 animate-pulse bg-[#1AFF8C]" />{tr("SiteLeveled City")}</span>
        <span className="text-[#F5F5F0]/50">{tr("Kliknite na budovu")}</span>
      </div>

      <div ref={boxRef} className="relative w-full" style={{ aspectRatio: `${CITY_W} / ${CITY_H}` }}>
        <div
          className="absolute"
          style={fit ? { left: fit.x, top: fit.y, width: fit.w, height: fit.h } : { inset: 0 }}
        >
          <canvas
            ref={canvasRef}
            width={CITY_W}
            height={CITY_H}
            role="img"
            aria-label={language === "en" ? `SiteLeveled client city. Buildings: ${CLIENTS.map(c => c.name).join(", ")} and plots for future websites.` : `Pixelové mesto klientov SiteLeveled. Budovy: ${CLIENTS.map(c => c.name).join(", ")} a voľné pozemky pre ďalšie weby.`}
            className="block h-full w-full [image-rendering:pixelated]"
          />
          {AREAS.map(({ spot, style }) =>
            spot.kind === "client" ? (
              <a
                key={spot.id}
                href={localLink(`/mesto/${spot.id}/`)}
                aria-hidden
                tabIndex={-1}
                className="absolute cursor-pointer"
                style={style}
                onClick={(event) => onLinkClick(event, spot)}
                {...hoverProps(spot.id)}
              />
            ) : (
              <button
                key={spot.id}
                type="button"
                aria-hidden
                tabIndex={-1}
                className="absolute cursor-pointer"
                style={style}
                onClick={() => openSpot(spot)}
                {...hoverProps(spot.id)}
              />
            ),
          )}
          {hoveredSpot && hoveredLabel && (
            <div
              className="pointer-events-none absolute z-10"
              style={{
                left: pct(hoveredSpot.anchor[0], CITY_W),
                top: pct(hoveredSpot.anchor[1] - 10, CITY_H),
                transform: `translate(${labelShift}, -100%)`,
              }}
            >
              <div className="whitespace-nowrap border-2 border-[#1AFF8C] bg-[#0b0b14]/95 px-2.5 py-1.5 font-pixel leading-tight shadow-[3px_3px_0_0_rgba(26,255,140,0.25)]">
                <p className="text-[0.9rem] text-[#F5F5F0]">{tr(hoveredLabel.title)}</p>
                <p className="text-[0.75rem] text-[#1AFF8C]">{tr(hoveredLabel.sub)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <nav aria-label={tr("Budovy v meste klientov")} className="mt-4 flex flex-wrap justify-center gap-2">
        {CLIENTS.map((client) => {
          const spot = HOTSPOTS.find((h) => h.id === client.id)!;
          return (
            <a
              key={client.id}
              href={localLink(`/mesto/${client.id}/`)}
              onClick={(event) => onLinkClick(event, spot)}
              onFocus={() => setHovered(client.id)}
              onBlur={() => setHovered(null)}
              {...hoverProps(client.id)}
              className={`border px-3 py-1.5 font-pixel text-[0.8rem] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1AFF8C] ${
                hovered === client.id
                  ? "border-[#1AFF8C]/60 bg-[#1AFF8C]/10 text-[#1AFF8C]"
                  : "border-white/10 bg-white/[0.03] text-[#F5F5F0]/70"
              }`}
            >
              {tr(client.name)}
            </a>
          );
        })}
        <button
          type="button"
          onClick={() => openSpot(FIRST_PLOT)}
          onFocus={() => setHovered(FIRST_PLOT.id)}
          onBlur={() => setHovered(null)}
          {...hoverProps(FIRST_PLOT.id)}
          className={`border border-dashed px-3 py-1.5 font-pixel text-[0.8rem] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1AFF8C] ${
            hovered === FIRST_PLOT.id
              ? "border-[#1AFF8C] bg-[#1AFF8C]/10 text-[#1AFF8C]"
              : "border-[#1AFF8C]/40 text-[#1AFF8C]/80"
          }`}
        >{tr("+ Voľný pozemok")}</button>
      </nav>

      {/* Only while open: an idle boundary would make React re-render the city while attaching to a pre-rendered page */}
      {open && (
        <Suspense fallback={null}>
          <CityPanel target={open} onClose={closePanel} />
        </Suspense>
      )}
    </div>
  );
}
