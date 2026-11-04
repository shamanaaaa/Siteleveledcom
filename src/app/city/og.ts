import { translate as translateCopy } from "../i18n/messages";
import type { Locale } from "../i18n/routes";
import { CLIENTS } from "./cityData";
import { drawText, textWidth, FONT_ASCENT } from "./font";
import { hash, translate, type Surface } from "./pixel";
import { CITY_H, CITY_W, HOTSPOTS, STILL_T, drawCity, drawGround } from "./render";

/*
 * Open Graph share cards (1200×630 once scaled ×3): the city on the right, pixel text on
 * the left. Rendered at build time for the home page and for every client's share page.
 */

export const OG_W = 400;
export const OG_H = 210;
export const OG_SCALE = 3;

const PANEL_W = 168;

function wrap(text: string, maxWidth: number) {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(" ")) {
    const next = current ? `${current} ${word}` : word;
    if (current && textWidth(next) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function drawOgCard(s: Surface, clientId?: string, locale: Locale = "sk") {
  // Night sky with a few stars and a purple haze towards the bottom right
  for (let i = 0; i < 140; i++) {
    const x = Math.floor(hash(i, 1) * OG_W);
    const y = Math.floor(hash(i, 2) * OG_H);
    s.fill(x, y, 1, 1, hash(i, 3) > 0.8 ? "#9a93ff" : "#2a2850");
  }
  for (let y = OG_H - 70; y < OG_H; y++) {
    for (let x = PANEL_W; x < OG_W; x++) {
      if ((x + y) % 2 === 0 && hash(x, y) < (y - (OG_H - 70)) / 140) s.fill(x, y, 1, 1, "#1d1940");
    }
  }

  const spot = clientId ? HOTSPOTS.find((h) => h.id === clientId) : undefined;
  const focusX = spot ? spot.anchor[0] : CITY_W / 2;
  const focusY = spot ? (spot.anchor[1] + Math.max(...spot.hull.map((p) => p[1]))) / 2 : CITY_H / 2 + 6;
  // Centre the focus, but never let the island drift away from either edge of the picture
  const dx = Math.round(Math.min(PANEL_W - 8, Math.max(OG_W - CITY_W + 8, PANEL_W + (OG_W - PANEL_W) / 2 - focusX)));
  const dy = Math.round(Math.min(10, Math.max(OG_H - CITY_H, OG_H / 2 + 8 - focusY)));
  const city = translate(s, dx, dy);
  drawGround(city);
  drawCity(city, { locale, t: STILL_T, intro: Infinity, hovered: spot?.id ?? null });

  // Text panel with a dithered edge so the city fades out behind it
  s.fill(0, 0, PANEL_W - 8, OG_H, "#06060B");
  for (let x = PANEL_W - 8; x < PANEL_W + 4; x++) {
    for (let y = 0; y < OG_H; y++) {
      if (hash(x, y, 5) * 12 > x - (PANEL_W - 8)) s.fill(x, y, 1, 1, "#06060B");
    }
  }

  const left = 16;
  drawText(s, "SITELEVELED CITY", left, 18, "#9F97FF");
  s.fill(left, 30, textWidth("SITELEVELED CITY"), 1, "#3a3486");

  const client = CLIENTS.find((c) => c.id === clientId);
  if (client) {
    const name = client.name.toUpperCase();
    const scale = textWidth(name, 2) <= PANEL_W - left - 8 ? 2 : 1;
    drawText(s, name, left + 1, 48 + 1, "#2a2560", scale);
    drawText(s, name, left, 48, "#F5F5F0", scale);
    let y = 48 + 7 * scale + 10 + FONT_ASCENT;
    for (const row of wrap(translateCopy(client.category, locale), PANEL_W - left - 8)) {
      drawText(s, row, left, y, "#b8b4d6");
      y += 11;
    }
    drawText(s, locale === "en" ? "> A BUILDING IN OUR" : "> BUDOVA V MESTE", left, y + 10, "#1AFF8C");
    drawText(s, locale === "en" ? "CLIENT CITY" : "KLIENTOV SITELEVELED", left, y + 21, "#1AFF8C");
  } else {
    drawText(s, locale === "en" ? "CUSTOM" : "WEBY, KTORÉ", left + 1, 52 + 1, "#2a2560", 2);
    drawText(s, locale === "en" ? "CUSTOM" : "WEBY, KTORÉ", left, 52, "#F5F5F0", 2);
    drawText(s, locale === "en" ? "WEBSITES." : "PREDÁVAJÚ.", left + 1, 52 + 24 + 1, "#0d4a30", 2);
    drawText(s, locale === "en" ? "WEBSITES." : "PREDÁVAJÚ.", left, 52 + 24, "#1AFF8C", 2);
    drawText(s, locale === "en" ? "CLICK A BUILDING" : "KLIKNITE NA BUDOVU", left, 116, "#b8b4d6");
    drawText(s, locale === "en" ? "TO EXPLORE OUR WORK" : "A POZRITE SI NAŠE WEBY", left, 127, "#b8b4d6");
  }

  drawText(s, locale === "en" ? "FREE DESIGN PROPOSAL" : "NÁVRH WEBU ZADARMO", left, OG_H - 40, "#F5F5F0");
  drawText(s, locale === "en" ? "SITELEVELED.COM/EN/" : "DO 24 H · SITELEVELED.COM", left, OG_H - 28, "#9F97FF");

  // Pixel frame
  s.fill(0, 0, OG_W, 2, "#6C63FF");
  s.fill(0, OG_H - 2, OG_W, 2, "#6C63FF");
  s.fill(0, 0, 2, OG_H, "#6C63FF");
  s.fill(OG_W - 2, 0, 2, OG_H, "#6C63FF");
}
