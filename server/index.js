require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
const seoAudit = require("./seoAudit");

const app = express();
const PORT = process.env.PORT || 3001;

// Behind a reverse proxy on the same host: take the client IP from X-Forwarded-For
app.set("trust proxy", "loopback");

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
// Nothing under /api belongs in search results, least of all customers' SEO reports about other sites
app.use("/api", (_req, res, next) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  next();
});

// ── Nodemailer transporter ──────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ── Helper: build HTML email ────────────────────────────────
// Everything a visitor typed goes through escapeHtml before it reaches an email's HTML
const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const text = (value) => (value ? escapeHtml(value) : null);
const list = (value) => (Array.isArray(value) ? value : value ? [value] : []);
// Only http(s) addresses become links: "javascript:…" or "data:…" stays plain text
const link = (url) =>
  /^https?:\/\//i.test(url)
    ? `<a href="${escapeHtml(url)}" style="color:#6C63FF;">${escapeHtml(url)}</a>`
    : escapeHtml(url);

// The home page's free-proposal form (default) and the general /kontakt form share /api/navrh
const FORMS = {
  navrh: {
    adminHeading: "Nový dopyt o návrh webu",
    adminSubject: "Nový dopyt",
    replySubject: "Re: Návrh webu",
    clientSubject: "Dostali sme váš formulár – siteleveled.com",
    received: "Váš formulár sme dostali.",
    promise: `Do <strong style="color:#6C63FF;">24 hodín</strong> sa vám ozveme s profesionálnym návrhom vašej webstránky.`,
  },
  kontakt: {
    adminHeading: "Nová správa z kontaktného formulára",
    adminSubject: "Nová správa",
    replySubject: "Re: Vaša správa",
    clientSubject: "Dostali sme vašu správu – siteleveled.com",
    received: "Vašu správu sme dostali.",
    promise: `Ozveme sa vám do <strong style="color:#6C63FF;">24 hodín</strong> v pracovný deň.`,
  },
};

function buildAdminEmail(data, form) {
  // `value` is HTML: pass it through text(), link() or escapeHtml() first
  const row = (label, value) =>
    value
      ? `<tr>
           <td style="padding:8px 12px;font-weight:600;color:#888;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
           <td style="padding:8px 12px;color:#f5f5f0;font-size:14px;">${value}</td>
         </tr>`
      : "";

  const goals = list(data.goal).map((g) => (g === "Iné" && data.goalOther ? `Iné – ${data.goalOther}` : g));
  const goalDisplay = goals.length ? goals.map(escapeHtml).join(", ") : null;
  const colors = list(data.colors);

  return `<!DOCTYPE html>
<html lang="sk">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#111118;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6C63FF20,#9F97FF10);padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.07);">
      <p style="margin:0 0 4px;font-size:12px;color:#6C63FF;letter-spacing:2px;text-transform:uppercase;">siteleveled.com</p>
      <h1 style="margin:0;font-size:22px;color:#f5f5f0;font-weight:700;">${form.adminHeading}</h1>
      <p style="margin:6px 0 0;font-size:13px;color:#888;">
        ${new Date().toLocaleString("sk-SK", { dateStyle: "full", timeStyle: "short" })}
      </p>
    </div>

    <!-- Kontaktné údaje -->
    <div style="padding:24px 32px 16px;">
      <p style="margin:0 0 12px;font-size:11px;color:#6C63FF;letter-spacing:2px;text-transform:uppercase;">Kontakt</p>
      <table style="width:100%;border-collapse:collapse;background:#0d0d14;border-radius:10px;overflow:hidden;">
        ${row("Meno", text(data.name))}
        ${row("Email", `<a href="mailto:${escapeHtml(data.email)}" style="color:#6C63FF;">${escapeHtml(data.email)}</a>`)}
        ${row("Firma / projekt", text(data.company))}
        ${row("Čo robia", text(data.about))}
      </table>
    </div>

    <!-- Web -->
    <div style="padding:8px 32px 16px;">
      <p style="margin:0 0 12px;font-size:11px;color:#6C63FF;letter-spacing:2px;text-transform:uppercase;">Web & Cieľ</p>
      <table style="width:100%;border-collapse:collapse;background:#0d0d14;border-radius:10px;overflow:hidden;">
        ${row("Má web?", data.hasWeb === "ano" ? `Áno${data.webUrl ? ` – ${link(data.webUrl)}` : ""}` : data.hasWeb === "nie" ? "Nie" : null)}
        ${row("Cieľ webu", goalDisplay)}
        ${row("Štýl", text(data.style))}
        ${row("Farebná paleta", colors.length ? colors.map(escapeHtml).join(", ") : null)}
      </table>
    </div>

    <!-- Doplnkové info -->
    <div style="padding:8px 32px 24px;">
      <p style="margin:0 0 12px;font-size:11px;color:#6C63FF;letter-spacing:2px;text-transform:uppercase;">Doplnkové info</p>
      <table style="width:100%;border-collapse:collapse;background:#0d0d14;border-radius:10px;overflow:hidden;">
        ${row("Inšpirácia", data.inspiration ? link(data.inspiration) : null)}
        ${row("Sociálne siete", text(data.socialMedia))}
        ${row("Poznámky", data.notes ? escapeHtml(data.notes).replace(/\n/g, "<br>") : null)}
      </table>
    </div>

    <!-- CTA -->
    <div style="padding:0 32px 28px;">
      <a href="mailto:${escapeHtml(data.email)}?subject=${encodeURIComponent(`${form.replySubject} – ${data.company}`)}"
         style="display:inline-block;padding:12px 24px;background:#6C63FF;color:#fff;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;">
        Odpovedať klientovi →
      </a>
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.07);text-align:center;">
      <p style="margin:0;font-size:12px;color:#555;">siteleveled.com · DOMAN s.r.o.</p>
    </div>
  </div>
</body>
</html>`;
}

function buildConfirmationEmail(name, form) {
  return `<!DOCTYPE html>
<html lang="sk">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:32px auto;background:#111118;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">

    <div style="background:linear-gradient(135deg,#6C63FF20,#9F97FF10);padding:32px;border-bottom:1px solid rgba(255,255,255,0.07);text-align:center;">
      <p style="margin:0 0 8px;font-size:12px;color:#6C63FF;letter-spacing:2px;text-transform:uppercase;">siteleveled.com</p>
      <h1 style="margin:0;font-size:22px;color:#f5f5f0;">Ďakujeme, ${escapeHtml(name)}!</h1>
    </div>

    <div style="padding:32px;text-align:center;">
      <div style="width:56px;height:56px;background:#1AFF8C15;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:28px;">✓</span>
      </div>
      <p style="margin:0 0 16px;font-size:16px;color:#f5f5f0;line-height:1.6;">
        ${form.received}
      </p>
      <p style="margin:0;font-size:14px;color:#888;line-height:1.7;">
        ${form.promise}
        Žiadny spam, žiadne záväzky.
      </p>
    </div>

    <div style="padding:0 32px 28px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#555;">
        Otázky? Napíšte nám na
        <a href="mailto:domansro@gmail.com" style="color:#6C63FF;">domansro@gmail.com</a>
      </p>
    </div>

    <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.07);text-align:center;">
      <p style="margin:0;font-size:12px;color:#555;">siteleveled.com · DOMAN s.r.o.</p>
    </div>
  </div>
</body>
</html>`;
}

// ── POST /api/navrh ─────────────────────────────────────────
app.post("/api/navrh", async (req, res) => {
  const {
    name, email, company, about,
    hasWeb, webUrl,
    goal, goalOther, style, colors,
    inspiration, socialMedia, notes,
    source,
  } = req.body;
  const form = source === "kontakt" ? FORMS.kontakt : FORMS.navrh;

  // Basic validation
  if (!name || !email || !company) {
    return res.status(400).json({ error: "Chýbajú povinné polia." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Neplatný email." });
  }

  // Check env config
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("SMTP not configured – check server/.env");
    return res.status(500).json({ error: "Server nie je nakonfigurovaný." });
  }

  try {
    const transporter = createTransporter();
    const data = { name, email, company, about, hasWeb, webUrl, goal, goalOther, style, colors, inspiration, socialMedia, notes };

    // 1. Email to site owner
    await transporter.sendMail({
      from: `"SiteLeveled" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO || process.env.SMTP_USER,
      replyTo: email,
      subject: `${form.adminSubject} – ${name} (${company})`,
      html: buildAdminEmail(data, form),
    });

    // 2. Confirmation email to client
    await transporter.sendMail({
      from: `"SiteLeveled" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: form.clientSubject,
      html: buildConfirmationEmail(name, form),
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    console.error("Form data was:", req.body);
    console.error("SMTP config:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER ? "configured" : "missing",
      pass: process.env.SMTP_PASS ? "configured" : "missing",
    });
    res.status(500).json({ error: "Odoslanie emailu zlyhalo." });
  }
});

// ── /api/seo-audit (customer SEO audit via Unlighthouse) ────
app.use("/api/seo-audit", seoAudit);

// ── Serve built frontend in production ──────────────────────
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
}

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV === "production") {
    console.log("Serving built frontend from ../dist");
  }
});
