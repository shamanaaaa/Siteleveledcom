require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

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
function buildAdminEmail(data) {
  const row = (label, value) =>
    value
      ? `<tr>
           <td style="padding:8px 12px;font-weight:600;color:#888;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
           <td style="padding:8px 12px;color:#f5f5f0;font-size:14px;">${value}</td>
         </tr>`
      : "";

  const goalDisplay =
    data.goal && data.goal.length
      ? data.goal.map((g) => (g === "Iné" && data.goalOther ? `Iné – ${data.goalOther}` : g)).join(", ")
      : null;

  return `<!DOCTYPE html>
<html lang="sk">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#111118;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6C63FF20,#9F97FF10);padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.07);">
      <p style="margin:0 0 4px;font-size:12px;color:#6C63FF;letter-spacing:2px;text-transform:uppercase;">siteleveled.com</p>
      <h1 style="margin:0;font-size:22px;color:#f5f5f0;font-weight:700;">Nový dopyt o návrh webu</h1>
      <p style="margin:6px 0 0;font-size:13px;color:#888;">
        ${new Date().toLocaleString("sk-SK", { dateStyle: "full", timeStyle: "short" })}
      </p>
    </div>

    <!-- Kontaktné údaje -->
    <div style="padding:24px 32px 16px;">
      <p style="margin:0 0 12px;font-size:11px;color:#6C63FF;letter-spacing:2px;text-transform:uppercase;">Kontakt</p>
      <table style="width:100%;border-collapse:collapse;background:#0d0d14;border-radius:10px;overflow:hidden;">
        ${row("Meno", data.name)}
        ${row("Email", `<a href="mailto:${data.email}" style="color:#6C63FF;">${data.email}</a>`)}
        ${row("Firma / projekt", data.company)}
        ${row("Čo robia", data.about)}
      </table>
    </div>

    <!-- Web -->
    <div style="padding:8px 32px 16px;">
      <p style="margin:0 0 12px;font-size:11px;color:#6C63FF;letter-spacing:2px;text-transform:uppercase;">Web & Cieľ</p>
      <table style="width:100%;border-collapse:collapse;background:#0d0d14;border-radius:10px;overflow:hidden;">
        ${row("Má web?", data.hasWeb === "ano" ? `Áno${data.webUrl ? ` – <a href="${data.webUrl}" style="color:#6C63FF;">${data.webUrl}</a>` : ""}` : data.hasWeb === "nie" ? "Nie" : null)}
        ${row("Cieľ webu", goalDisplay)}
        ${row("Štýl", data.style)}
        ${row("Farebná paleta", data.colors && data.colors.length ? data.colors.join(", ") : null)}
      </table>
    </div>

    <!-- Doplnkové info -->
    <div style="padding:8px 32px 24px;">
      <p style="margin:0 0 12px;font-size:11px;color:#6C63FF;letter-spacing:2px;text-transform:uppercase;">Doplnkové info</p>
      <table style="width:100%;border-collapse:collapse;background:#0d0d14;border-radius:10px;overflow:hidden;">
        ${row("Inšpirácia", data.inspiration ? `<a href="${data.inspiration}" style="color:#6C63FF;">${data.inspiration}</a>` : null)}
        ${row("Sociálne siete", data.socialMedia)}
        ${row("Poznámky", data.notes ? data.notes.replace(/\n/g, "<br>") : null)}
      </table>
    </div>

    <!-- CTA -->
    <div style="padding:0 32px 28px;">
      <a href="mailto:${data.email}?subject=Re: Návrh webu – ${encodeURIComponent(data.company)}"
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

function buildConfirmationEmail(name) {
  return `<!DOCTYPE html>
<html lang="sk">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:32px auto;background:#111118;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">

    <div style="background:linear-gradient(135deg,#6C63FF20,#9F97FF10);padding:32px;border-bottom:1px solid rgba(255,255,255,0.07);text-align:center;">
      <p style="margin:0 0 8px;font-size:12px;color:#6C63FF;letter-spacing:2px;text-transform:uppercase;">siteleveled.com</p>
      <h1 style="margin:0;font-size:22px;color:#f5f5f0;">Ďakujeme, ${name}!</h1>
    </div>

    <div style="padding:32px;text-align:center;">
      <div style="width:56px;height:56px;background:#1AFF8C15;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:28px;">✓</span>
      </div>
      <p style="margin:0 0 16px;font-size:16px;color:#f5f5f0;line-height:1.6;">
        Váš formulár sme dostali.
      </p>
      <p style="margin:0 0 24px;font-size:14px;color:#888;line-height:1.7;">
        Do <strong style="color:#6C63FF;">24 hodín</strong> sa vám ozveme s profesionálnym návrhom vašej webstránky.
        Žiadny spam, žiadne záväzky.
      </p>
      <div style="padding:16px 20px;background:#0d0d14;border-radius:10px;border-left:3px solid #6C63FF;">
        <p style="margin:0;font-size:13px;color:#888;font-style:italic;">
          Garancia: Ak návrh nedodáme do 24 hodín, dostanete mesiac hostovania zadarmo.
        </p>
      </div>
    </div>

    <div style="padding:0 32px 28px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#555;">
        Otázky? Napíšte nám na
        <a href="mailto:info@siteleveled.com" style="color:#6C63FF;">info@siteleveled.com</a>
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
  } = req.body;

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
      subject: `Nový dopyt – ${name} (${company})`,
      html: buildAdminEmail(data),
    });

    // 2. Confirmation email to client
    await transporter.sendMail({
      from: `"SiteLeveled" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: "Dostali sme váš formulár – siteleveled.com",
      html: buildConfirmationEmail(name),
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Odoslanie emailu zlyhalo." });
  }
});

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
