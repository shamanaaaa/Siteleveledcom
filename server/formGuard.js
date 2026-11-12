// Bot checks for /api/navrh. A bot that trips a hard check still gets { ok: true }, so it learns
// nothing to adapt to. A single soft sign only holds back the confirmation email: the owner still
// gets the enquiry, marked, and a real visitor caught by mistake is never lost. Two or more soft
// signs together are a bot: the 2026-11-12 flood filled the hidden field AND typed random letters.

// Humans need longer than this to load the page and fill in three fields, even with autofill
const MIN_FILL_MS = 2000;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// One run of 10+ letters with 3+ capitals after the first, like "YtGulMDpoAWikzOn"
function looksRandom(value) {
  const v = typeof value === "string" ? value.trim() : "";
  return /^[A-Za-z]{10,}$/.test(v) && (v.slice(1).match(/[A-Z]/g) || []).length >= 3;
}

// Returns { drop, reasons }: drop for a certain bot, otherwise the soft sign found, if any
function inspect(body) {
  const elapsed = Number(body.elapsed);
  const timed = body.elapsed !== undefined && body.elapsed !== null && Number.isFinite(elapsed);
  if (timed && elapsed < MIN_FILL_MS) return { drop: true, reasons: ["odoslané príliš rýchlo"] };

  const reasons = [];
  // Browser autofill and password managers fill the hidden field too, ignoring autocomplete="off"
  // (the 2026-11-12 owner test got "https://www.aaa.sk"), so it doesn't count once Cloudflare vouched
  if (body.website && body.turnstile !== "ok") reasons.push("vyplnené skryté pole");
  // The site's own forms always send the time; a direct POST to the API doesn't
  if (!timed) reasons.push("odoslané mimo formulára na webe");
  // Cloudflare didn't answer, so nobody vouched for the visitor (see verifyHuman)
  if (body.turnstile === "error") reasons.push("overenie Cloudflare neodpovedalo");
  if (["name", "company", "notes"].some((field) => looksRandom(body[field]))) reasons.push("náhodné znaky");
  const [local, domain = ""] = body.email.toLowerCase().split("@");
  if (/^(gmail|googlemail)\.com$/.test(domain) && (local.match(/\./g) || []).length >= 3) reasons.push("Gmail adresa s množstvom bodiek");
  return { drop: reasons.length >= 2, reasons };
}

// Cloudflare Turnstile, on when TURNSTILE_SECRET_KEY is set (the site key is in src/app/lib/turnstile.ts).
// Returns "ok", "fail" (no token, or Cloudflare says no), "off", or "error" when Cloudflare can't be
// reached: that enquiry still goes through, marked. The visitor's IP is not sent to Cloudflare.
async function verifyHuman(token) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return "off";
  if (typeof token !== "string" || !token || token.length > 2048) return "fail";
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return "error";
    return (await res.json()).success === true ? "ok" : "fail";
  } catch {
    return "error";
  }
}

// Per-IP count of accepted submissions, held in memory only and forgotten after the window
const recent = new Map();
const sweep = setInterval(() => {
  const since = Date.now() - WINDOW_MS;
  for (const [ip, times] of recent) {
    const left = times.filter((t) => t > since);
    if (left.length) recent.set(ip, left);
    else recent.delete(ip);
  }
}, WINDOW_MS);
sweep.unref();

function overLimit(ip, now = Date.now()) {
  const times = (recent.get(ip) || []).filter((t) => t > now - WINDOW_MS);
  if (times.length >= MAX_PER_WINDOW) {
    recent.set(ip, times);
    return true;
  }
  recent.set(ip, [...times, now]);
  return false;
}

module.exports = { inspect, verifyHuman, overLimit, looksRandom, reset: () => recent.clear() };
