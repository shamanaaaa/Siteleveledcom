# SEO audit: siteleveled.com

**Date:** 2026-11-01 · **Scope:** the repository at `806df2a` and the live site at `https://siteleveled.com` · **Type:** an audit only. Nothing in the product was changed.

All evidence is under `audit/seo/raw/` and every script used is in `audit/seo/scripts/`. File references use `path:line` against the repository.

> **Status, updated 2026-11-01 after the audit.** Most fixes are live. Line references below still point at `806df2a`, before the fixes.
>
> | | Findings |
> |---|---|
> | **Done in code** (`293d710` and later) | F-05 (every page pre-rendered at build, except `/seo-audit/admin/` and `/mesto/*`), F-19 (each page loads its own code; `motion` stays in the main bundle), F-01, F-02, F-03, F-06, F-10, F-11, F-12, F-13 (hero cap), F-14, F-15, F-16 (noindex), F-17 (privacy policy at `/ochrana-osobnych-udajov/`, dead links removed), F-18 (fonts self-hosted), F-22, F-25, F-27 (alt text), F-29; F-08 (home h1 "Tvorba webstránok na mieru. Návrh zadarmo do 24 hodín."); F-20 on `/cennik/`, `/proces/` and `/seo-audit/`; F-21's e-shop page at `/tvorba-eshopu/`; F-26 in the footer; F-31 (one free offer, the proposal, plus a plain phone call); F-30 (the "68 %" claim, "Mesačné reporty a sledovanie pozícií" and the "Výkonnostný marketing" service removed, "načítajú sa za sekundu" reworded; the owner confirmed "Lokálne SEO" and "Preklad SK/EN") |
> | **Done in nginx** (§5.3, hand-edited vhost on the VPS) | F-04, F-09, real 404s for F-03, F-28; old `/mesto/fotkynavyber/` links 301 to `/` |
> | **Still open** | F-07 (analytics), F-21 case studies (need client consent), image `width`/`height` (F-27), F-23, F-24 and the rest of §9 (owner decisions) |
>
> nginx no longer falls back to `index.html`, so every route needs an entry in `src/app/seo/pages.ts`. The build fails without one.
>
> **Re-measured 2026-11-01 after the fixes** (Lighthouse on production, same 9 pages and machine, canonical URLs; `raw/after-2026-11-01/`). Medians: mobile performance 61 → 93, FCP 6.43 → 1.96 s, LCP 6.48 → 2.96 s, page weight 846 → 380 kB; desktop performance 91 → 100; SEO 91 → 100, except `/blog` at 66 because of its intended noindex. Forcing reduced motion on `/`, `/cennik/`, `/sluzby/` and `/kontakt/` brings mobile LCP to about 2.03 s, so the entrance animations cost about 0.9 s. These are lab numbers from one machine, and single runs vary (one `/blog/` re-run had 1,341 ms of blocking time; the others had 52 and 57 ms).
>
> **Under real throttling** (`--throttling-method=devtools`, on a local HTTP/2 copy of the site), the old build also showed CLS 0.11–0.26 on `/`, `/cennik/` and `/sluzby/` as the web fonts swapped in. Lighthouse's default simulated mode doesn't see this. First-screen fades were then removed and width-matched fallback fonts added (`src/styles/fonts.css`): on pages whose largest element is text, LCP now equals FCP (about 2.6–3.3 s, from 3.6–4.0 s) and CLS is at most 0.031. `/portfolio/`, `/blog/` and `/o-nas/` have an image as their largest element and did not improve (6.75, 4.73 and 3.85 s in single runs).
>
> **Live check of those fixes** (`da9b3f3`, `raw/after-fades-2026-11-01/`). Default mode, 9 pages: mobile performance median 93 → 96, LCP 2.96 → 2.46 s. Real throttling: `/`, `/cennik/` and `/sluzby/` have LCP 2.8–3.5 s and CLS 0.031, 0.000 and 0.001; `/portfolio/` is still 6.3 s.
>
> **Pages led by an image, and the home heading** (real throttling, local copy, two runs each). The HTML now names the first image so it downloads from the start, phones get 720 px versions, and images below the fold load lazily. LCP: `/portfolio/` 6.2 → 3.0–3.2 s, `/blog/` 4.75 → 2.8–2.9 s, `/o-nas/` 3.83 → 2.9–3.1 s. First paint on these pages is up to 0.3 s later, because the image shares the connection with the JavaScript. Keeping "úplne zadarmo." on one line took home CLS from 0.031 to 0.002 (0.081 → 0.004 at the emulated phone size without throttling). LCP under real throttling is still above 2.5 s; what remains is mainly the JavaScript bundle (F-05, F-19).
>
> **Live check of the image fix** (`1e12458`, `raw/after-images-2026-11-01/`). Default mode, 9 pages: mobile performance median 96 → 97, LCP 2.46 → 2.19 s, largest CLS 0.081 → 0.004. Real throttling, three runs each: LCP on `/portfolio/` 3.0–3.1 s, `/blog/` 2.8–3.0 s, `/o-nas/` 3.1–3.3 s, `/` 3.0–3.3 s, `/cennik/` 2.8–2.9 s with one slow run at 4.1 s.
>
> **Pre-rendering and code splitting** (real throttling, local copy, two runs each, against the build then live). LCP: `/` 3.02 → 1.91–1.94 s, `/sluzby/` 2.67–2.74 → 1.63–1.65 s, `/cennik/` 2.67 → 1.63–1.66 s, `/portfolio/` 2.84–2.85 → 1.76–1.86 s, `/o-nas/` 2.91–3.17 → 1.76–1.81 s, `/blog/` 2.78–2.99 → 1.67–1.72 s, `/kontakt/` 2.65–2.77 → 1.61–1.64 s, `/seo-audit/` 2.68–2.74 → 1.66–1.68 s. JavaScript 176 → 133–140 kB on inner pages, 163 kB on home. Blocking time rose on every page, because the same work now happens after first paint, where it counts: home 65–187 → 210–358 ms, the other pages 0–46 ms → 81–190 ms, except `/blog/` at 289 ms and `/portfolio/` at 720 ms in one run each. On home, removing the city animation and attaching React section by section both made no clear difference.
>
> **Live check of pre-rendering** (`08c43c0`, `raw/after-prerender-2026-11-01/`; real throttling, three runs each). LCP: `/` 2.2 s, `/sluzby/` 1.8 s, `/cennik/` 1.8–2.2 s, `/portfolio/` 1.9 s, `/o-nas/` 1.9–2.0 s, `/blog/` 1.8–2.1 s, `/kontakt/` 1.8–1.9 s, `/seo-audit/` 1.8–1.9 s. Blocking time: `/` 524–804 ms, the others 99–502 ms; a later batch read `/` at 323–508 ms live and 395–562 ms on an identical local copy, so this varies by batch and live isn't really slower. Performance scores: `/` 77–83, the others 86–98. Default mode, 9 pages: mobile performance median 97, desktop 100, SEO 100 (`/blog` 66 = intended noindex). Home's blocking time is the main remaining speed problem.
>
> **What blocks the home page** (traces, 2026-11-02). Mainly React attaching to about 1,450 layout objects (one task of about 190–270 ms), then the whole page being laid out again as each of the 6 font files arrives ("Fonts changed", about 1,400 of 1,454 objects each time). `motion` is about a quarter of the attach task. Removing the city's animation frames or the hero parallax made no clear difference. `content-visibility` on sections cut main-thread work by 27–35 % but sent `#referencie` and `#faq` links 4,000–5,000 px off target, so it needs an anchor fix first.
>
> **One font file per family** (`src/styles/fonts.css`; real throttling, local copy, four runs each). Fonts 198 → 94 kB, `/` 397 → 290 kB, `/cennik/` 345 → 245 kB. Median blocking time on `/` 368 → 300 ms, within this machine's noise, and LCP unchanged. Shared code no longer sits inside other pages' files.

---

## 1. Executive summary

The site is fast to load on desktop, technically clean (HTTPS, HTTP/2, valid `lang="sk"`, good accessibility scores), and it has things many small-studio sites lack: real people, real client sites and three genuine reviews. As a search property, though, it is close to invisible beyond the home page. Six of the nine public pages have **no crawlable internal link pointing to them and there is no sitemap**, so search engines have no way to find them. Apart from the `/mesto/*` share pages, every URL, including made-up ones, returns **the same `<title>`, description and empty HTML shell with HTTP 200**, so even pages that are found all claim to be the home page. On mobile the page stays blank for about 6 s in lab tests, mainly because nginx serves the 546 kB JavaScript bundle **uncompressed**. The audit also found a serious non-SEO bug: **the contact form on `/kontakt` throws away every submission**, and all pricing CTAs lead to it.

**The 5 issues that matter most**

1. **Orphaned pages, no sitemap** (F-01): `/sluzby`, `/portfolio`, `/proces`, `/o-nas`, `/cennik` and `/blog` have 0 inbound links in the rendered DOM. *Fix in code (nav/footer links) plus a build-time `sitemap.xml`.*
2. **One `<head>` for every URL** (F-02, F-03): identical title, description and OG tags, no canonical, and soft 404s for any path. *Fix at build time: a static `index.html` per route, extending the existing `scripts/cityPages.ts` approach.*
3. **Uncompressed, uncached JS/CSS** (F-04): lab mobile LCP is 6.3–7.7 s, 91 % of it render delay. *Fix in nginx (owner): `gzip_types` plus `Cache-Control` on `/assets/` saves about 470 kB per first visit.*
4. **Lost leads and missing trust and measurement basics** (F-06, F-17, F-07): the dead `/kontakt` form, no privacy policy, `href="#"` links, and no analytics or conversion tracking.
5. **Content crawlers can't see or can't match** (F-05, F-08, F-11, F-12, F-16): the raw HTML is empty, FAQ answers are never in the DOM, prices render as "0 €" until scrolled into view, h1s are slogans with no service keyword, and the blog is a placeholder.

**Expected impact.** Items 1–2 are what decide whether the inner pages can be indexed and ranked for their own queries ("cena webstránky", "tvorba e-shopu", "SEO audit zadarmo" and so on). Today only the home page can realistically rank. Item 3 cuts about 470 kB from every first visit (Lighthouse's own measurement), and that download is the bulk of the 6 s mobile render delay. The resulting score wasn't measured, because the change can only be made on the VPS. Item 4 stops leads being lost and makes every later change measurable. No ranking or traffic numbers are promised: none were measured (see §10).

> **Fix first, outside SEO:** `ContactPage.tsx:53-62` validates the form and shows "Ďakujeme!" but never sends the data anywhere. Every "Mám záujem" button on `/cennik` and "Rezervovať konzultáciu" lead there. See F-06.

---

## 2. Scorecard

| Area | Status | Reason |
|---|---|---|
| A. Crawlability and indexability | **Critical** | 6 orphaned content pages, no sitemap, robots.txt is HTML, every path returns 200 (soft 404s), www and apex both serve 200 |
| B. Rendering | Needs work | Pure client rendering: the raw HTML has no text, links or h1. FAQ answers never enter the DOM, prices start at 0, and most home sections stay at opacity 0 under a tall viewport |
| C. On-page | **Critical** | All 10 routes share one title and description, no canonicals, no `og:url`, and the h1s are slogans with no service keywords |
| D. Content and keywords | Needs work | No dedicated e-shop or case-study pages, a placeholder blog, thin pages (63–189 words), and an informal "ty" voice on 8 pages |
| E. Structured data | Needs work | No JSON-LD anywhere. Ready-to-paste markup is in §7 |
| F. Performance and CWV | Needs work | Mobile 57–62 / desktop 85–94 (lab). JS and CSS not compressed, render-blocking font `@import`, one 546 kB chunk |
| G. Mobile, a11y and UX | **Critical** | The `/kontakt` form discards submissions. Otherwise solid: a11y 90–96, reduced motion supported, contrast failures on low-opacity text |
| H. Trust, E-E-A-T and local | Needs work | Real people, IČO and reviews are present, but there's no privacy policy, social links are dead, the Facebook link goes to a personal profile, and the address and IČO aren't owner-confirmed |
| I. Off-page and SERP | Not measured / needs work | No Google SERP access from this environment. None of the 8 portfolio sites links back in raw HTML |
| J. Measurement | **Critical** | No analytics and no conversion tracking in the code. Two `google-site-verification` TXT records exist, so Search Console may already be set up |
| K. Security and hygiene | Needs work | HTTPS, HTTP/2 and the certificate (apex + www) are fine. No HSTS or other security headers; `/favicon.ico` returns HTML. `lang="sk"` is correct and hreflang isn't needed |

---

## 3. Findings

### 3.1 Findings table

Severity follows the brief: **Critical** stops important pages from being crawled, indexed or ranked; **High** is a clear ranking or CTR loss on key pages; **Medium** is a smaller loss or a risk; **Low** is polish. F-06 is rated for its business impact and marked as such.

| ID | Severity | Area | URL(s) | Evidence | Why it matters | Recommended fix | Where the fix lives | Files | Effort |
|---|---|---|---|---|---|---|---|---|---|
| F-01 | **Critical** | A, C | `/sluzby` `/portfolio` `/proces` `/o-nas` `/cennik` `/blog` | 0 inbound links in rendered DOM (`raw/link-graph.json`). Navbar links only to home anchors and `/seo-audit`; the footer adds `/kontakt`. No sitemap (`/sitemap.xml` = HTML). Unlighthouse's JS crawler discovered 8 routes and none of these six (`raw/unlighthouse/ci-result.json`) | Crawlers find pages through links and sitemaps. With neither, these pages are unlikely to be crawled or indexed, so the pricing, services and portfolio pages can't rank | Add `/sluzby/`, `/cennik/`, `/portfolio/`, `/o-nas/` and `/kontakt/` to the footer navigation, and the most important 3–4 to the navbar. Link contextually (home "Transparentné ceny" → `/cennik/`, portfolio section → `/portfolio/`, Bio → `/o-nas/`). Generate `sitemap.xml` at build (§5). Keep the home anchors (`#ako-to-funguje`, `#formular`, `#portfolio`, `#referencie`, `#faq`) unchanged | code + build | `src/app/components/layout/Navbar.tsx:8-14`, `src/app/components/layout/Footer.tsx:8-15`, `scripts/cityPages.ts` | S |
| F-02 | **Critical** | C | all routes | Raw and rendered `<title>` = "SiteLeveled — Weby, ktoré predávajú \| Návrh zadarmo do 24h" and the same 142-char description on all 10 routes. No `<link rel="canonical">`. No `og:url`. The same `og:image` | Every page tells search engines it is the home page. Inner pages can't compete for their own queries, Google will rewrite titles, and duplicates (`/sluzby` vs `/sluzby/`, `?utm=`, `/index.html`, www) have no canonical to consolidate on | Write a static `dist/<route>/index.html` per route at build time with its own title, description, canonical (apex, trailing slash), `og:url`, `og:title`, `og:description` and JSON-LD. Add a small client hook so SPA navigation updates `document.title`. Proposed copy is in §6 | build (+ small code hook) | `index.html:11-31`, `scripts/cityPages.ts:88-144`, `src/app/components/layout/Layout.tsx` | M |
| F-03 | High | A | any unknown path, `/robots.txt`, `/sitemap.xml`, `/favicon.ico`, `/index.html` | All return `200 text/html` with the home ETag (`raw/headers/status.csv`). The router's `*` renders the whole HomePage (`routes.ts:31-34`) | Unlimited duplicate copies of the home page on junk URLs (soft 404s). Google may report them in Search Console and they dilute signals. A mistyped URL never shows the user a "not found" message | Build: emit `404.html` (noindex, "Stránka sa nenašla") and render a NotFound component for `*` that adds `<meta name="robots" content="noindex">`, which Google documents for SPAs. nginx (owner): once every route has a file, switch the fallback to a real 404 (`try_files $uri $uri/ =404; error_page 404 /404.html;`) | code + build + nginx/VPS (owner) | `src/app/routes.ts:31-34` | S (code) / S (nginx) |
| F-04 | High | F | all | `index--NA2e9g2.js` 545,793 B and `index-DLn2T6Lq.css` 132,971 B served with **no `content-encoding`** even when gzip is requested. No `Cache-Control` on `/assets/*` (`raw/headers-assets/`). Lighthouse flags "enable text compression" on all 18 runs: 363 kB (JS) + 109 kB (CSS) to save | The bundle has to download before anything paints (empty `#root`). On the Lighthouse mobile profile this is most of the 6.3–7.7 s LCP. Without long caching, repeat visits revalidate every asset | nginx: `gzip_types text/css application/javascript application/json image/svg+xml;`, plus `Cache-Control: public, max-age=31536000, immutable` for `/assets/` and `no-cache` for HTML. Optionally pre-compress at build and use `gzip_static on` | nginx/VPS (owner) | (VPS nginx config) | S |
| F-05 | High | B, F | all | `curl` / JS disabled: body text length 0, 0 links, 0 h1 on every route (`raw/render/_summary.json`, `nojs`). LCP breakdown, home mobile: TTFB 628 ms, **render delay 6,044 ms (91 %)** | Google renders JS, but in a second, deferred step. Bing, social previews, AI crawlers and many SEO tools read the raw HTML and see an empty page. Paint waits for JS | Short term: F-04 and F-02. Medium term: pre-render the body of each route into its static file at build (Puppeteer with reduced motion emulated). `createRoot` simply replaces the markup, so no hydration work is needed (§5, option B) | build | `src/main.tsx`, `scripts/cityPages.ts` | M |
| F-06 | **High (business)** | G, J | `/kontakt` (and every CTA that points there: `/cennik` ×4, `/sluzby` ×6, `/proces`) | `handleSubmit` validates and calls `setSubmitted(true)`. There is no `fetch`, no `action`, nothing leaves the browser (`ContactPage.tsx:53-62`). Its inputs also have no `name` attributes (`raw/render/kontakt.json`, `forms`). Read in code only; nothing was submitted | Leads from organic visitors on the pricing and services pages are silently lost while the user sees "Ďakujeme! Ozveme sa do 24 hodín" | Either send the form to the backend, or replace it with a link to the home `#formular`. If it goes to `/api/navrh`, map it to that endpoint's field contract (`name`, `email` and `company` are required; there is no `phone` or `service` field, so put them in `notes`/`goal`). Don't rename the 13 existing field names in `server/index.js:157-162` | code | `src/app/pages/ContactPage.tsx:53-62`, `server/index.js:157-162` | S |
| F-07 | Medium | J | all | No analytics, tag manager, pixel or verification meta in `index.html`, `src/` or `scripts/` (grep returns nothing). DNS has two `google-site-verification` TXT records (`raw/dns.txt`) | Without data, the effect of any change in this report can't be measured, and lead-form conversions aren't counted | Confirm who owns the Search Console Domain property and grant access. Add a cookieless, privacy-friendly analytics script (or GA4 with consent) and send one conversion event on a successful `/api/navrh` response. Submit the sitemap in Search Console | code + content (owner) | `index.html`, `src/app/components/sections/LeadFormSection.tsx:60` | S |
| F-08 | High | C, D | `/` `/sluzby` `/cennik` `/portfolio` `/proces` `/o-nas` `/kontakt` | Rendered h1s: "Čo robíme. A robíme to poriadne.", "Investícia, nie náklad.", "Výsledky hovoria za nás.", "Porozprávajme sa." The home h1 doesn't contain "tvorba webstránok", "web" + "na mieru", "e-shop" or any location | Titles and h1s are the strongest on-page relevance signals. Slogans match no query, so even indexed pages won't rank for "cena webstránky" and similar | Keep the slogans as visual sub-lines, but give each page a descriptive h1 and title (§6). The h1 comes from `PageHero` / `KineticHeading`, so only the `segments` text changes | code + content (owner) | `src/app/pages/*Page.tsx` (PageHero `segments`), `src/app/components/sections/HeroSection.tsx:56-59` | S |
| F-09 | Medium | A, K | `https://www.siteleveled.com/*`, `http://www.siteleveled.com/*` | www returns 200 with the same content. `http://www.` 301s to `https://www.` (`raw/headers/27_*`, `31_*`). The certificate covers both names (`raw/tls-cert.txt`) | Two hosts for every page split links and signals until Google picks one | nginx: one `server` block for `www.siteleveled.com` (80 and 443) that returns `301 https://siteleveled.com$request_uri`. The canonicals from F-02 back this up | nginx/VPS (owner) | (VPS nginx config) | S |
| F-10 | Medium | A | `/robots.txt` | Returns the HTML shell. Lighthouse SEO `robots-txt` fails on all 18 runs (the only failing SEO audit) | Crawlers parse HTML as robots rules. Harmless today, but there's no `Sitemap:` line and no way to keep crawlers out of `/api/` | Write `dist/robots.txt` at build: `User-agent: *`, `Disallow: /api/`, `Sitemap: https://siteleveled.com/sitemap.xml`. Don't disallow `/seo-audit/admin` or `/mesto/`: their noindex has to stay crawlable | build | `scripts/cityPages.ts` (or a new plugin) | S |
| F-11 | Medium | B, D | `/` (6 Q&As), `/cennik` (5), `/seo-audit` (4) | `FaqAccordion` mounts the answer only while it is open (`AnimatePresence` + `{open && …}`). Rendered DOM: the question "Koľko stojí kompletná webstránka?" is present but its answer is not (`raw/render/home.json`, `cennik.json`) | The answers carry prices, delivery times and payment terms, and crawlers never see them. They are also required for any FAQPage markup | Always render answers and collapse them with CSS (`grid-template-rows` / `hidden` via `aria-expanded`), or use `<details>/<summary>` | code | `src/app/components/fx/FaqAccordion.tsx:40-54` | S |
| F-12 | Medium | B | `/cennik` | First viewport, no scroll: "E-shop od **0 €**", "SEO audit **0 €**", "správa od **0 €**/mesiac" (`raw/render/cennik.json`, `first.mainTextVisible`). Correct only after the counter scrolls into view | Any crawler or preview that doesn't scroll or stretch the viewport records wrong prices, and snippets can quote them | Render the final value as text and animate only visually (count up inside an `aria-hidden` span, with the real number in an sr-only span), or drop the counter for prices | code | `src/app/components/fx/AnimatedCounter.tsx:30-46`, `src/app/pages/PricingPage.tsx:105,192` | S |
| F-13 | Medium | B | `/` (and `/mesto/*`, the 404 route) | The hero is `min-h-screen`. With the viewport stretched to 5,000 or 12,000 px (the way renderers often stretch it), the hero grows to the same height and 8 of 11 home sections keep their text at `opacity: 0` (`raw/vh-probe-home.txt`, `scripts/vh-probe.mjs`) | The text stays in the DOM, so it should still be indexed, but a renderer's snapshot may treat most of the home page as hidden. Google's exact viewport behaviour can't be measured from here | Cap the hero (`min-h-[min(100svh,960px)]`) and make `AnimateIn` content visible by default (animate from `opacity: 0.001`, or skip the fade when `navigator.webdriver` or the UA is a bot). Verify with Search Console's URL Inspection → "View tested page" screenshot | code | `src/app/components/sections/HeroSection.tsx:20`, `src/app/components/AnimateIn.tsx:21-46` | S |
| F-14 | Medium | E | all | No JSON-LD anywhere | No entity markup for the business, people, services and prices. Organization and breadcrumbs help Google understand and display the site | Add the JSON-LD from §7 to each static route head at build. No review stars are possible for the business's own reviews, and FAQ rich results are restricted to government and health sites, so FAQPage is optional | build | `scripts/cityPages.ts` | S |
| F-15 | Medium | A | `/seo-audit/admin`, `/api/seo-audit/report/<uuid>/`, `/seo-audit?audit=<uuid>` | Admin page: 200, no robots meta or header. Customer reports are served by Express with no `X-Robots-Tag` (`server/seoAudit.js:398-401`). Shared result links add `?audit=` to `/seo-audit` (`SeoAuditPage.tsx:280-281`) | A login page in the index is untidy. Customer reports about *other* sites can be indexed under siteleveled.com if a customer shares the link publicly. `?audit=` URLs duplicate `/seo-audit` | Build: write `dist/seo-audit/admin/index.html` with `noindex, nofollow`. Code: `res.setHeader("X-Robots-Tag", "noindex")` in the `/api/seo-audit` router. This **does** reach production because `/api/*` is proxied to Express. A canonical on `/seo-audit/` removes the `?audit=` duplicates | build + code | `server/seoAudit.js:398-401`, `scripts/cityPages.ts` | S |
| F-16 | Medium | D, H | `/blog` | 5 placeholder posts with no URLs, a no-op newsletter button, Unsplash hotlinks. Topics ("Koľko stojí dobrý web v roku 2026?") promise articles that don't exist | Thin content that visitors notice and that weakens trust ("Čítať ďalej" goes nowhere). It can't rank and links nowhere | Until real articles exist: remove `/blog` from any navigation and give it `noindex` in its static head (or remove the route). Then publish real articles at `/blog/<slug>/`, each as a static route (§6) | content (owner) + build | `src/app/pages/BlogPage.tsx` | S (noindex) / L (articles) |
| F-17 | Medium | H | every page (footer), `/kontakt` | `href="#"`: Ochrana osobných údajov, Podmienky používania, Instagram (footer); LinkedIn, Instagram, GitHub (`/kontakt`). No privacy-policy page, while two forms collect name, email, company and phone | Under GDPR (Art. 13) people must be told how their data is processed when it's collected. Dead links look unfinished, and the brief lists trust as a concern | Publish `/ochrana-osobnych-udajov/` (and terms if needed), link it in the footer and next to both forms. Remove icons that have no real profile, or point them to real ones | content (owner) + code | `src/app/components/layout/Footer.tsx:144-180`, `src/app/pages/ContactPage.tsx:289-298` | S (links) / M (policy text) |
| F-18 | Medium | F | all | Google Fonts loaded through CSS `@import`: CSS → fonts.googleapis.com CSS → 6 woff2 (about 198 kB). Lighthouse flags it as render-blocking (about 780 ms) on every mobile run. Inter is requested in 7 weights (300–900) | A three-step chain before text can paint in the right font | Self-host only the weights actually used (woff2, `font-display: swap`) and `<link rel="preload">` the 1–2 critical files in `index.html`. At minimum, replace the `@import` with `<link rel="stylesheet">` in `index.html` | code | `src/styles/fonts.css:1`, `index.html:15-16` | S |
| F-19 | Medium | F | all | One 546 kB chunk. Source share (`raw/bundle-composition.txt`): motion-dom + framer-motion 39 %, react-router 27 %, react-dom 10 %, app pages under 10 %. Lighthouse: 235–289 kB unused JS per page | Parse and execute cost on mid-range phones (mobile TBT up to 231 ms) | Route-level `lazy` in `createBrowserRouter` (`SeoAuditAdminPage`, `SeoAuditPage`, `BlogPage` and the other inner pages). Move motion to `LazyMotion` + `m` components to load its features on demand. Compression (F-04) comes first; it's the bigger win | code | `src/app/routes.ts`, `src/app/components/**` | M |
| F-20 | Medium | D | `/kontakt` (63 words), `/seo-audit` (96), `/proces` (145), `/o-nas` (169), `/cennik` (189) | Rendered word counts in `<main>` (`raw/render/*.json`, `mainWordsVisible`) | Too little text to show topical relevance, especially for `/cennik` and `/proces`, which target informational queries | Add real content: a price breakdown with what's included and examples on `/cennik`, the steps in detail with timelines on `/proces`, and a methodology note (what is checked and why) on `/seo-audit` | content (owner) | `src/app/pages/*` | M |
| F-21 | Medium | D | (missing pages) | No e-shop page, while e-shop is a separate service at a separate price. No case-study pages, although 3 clients have reviews. A local service area isn't decided | Separate search intents ("tvorba e-shopu", "referencie") have no landing page | Create `/tvorba-eshopu/` and `/portfolio/<client>/` case studies (with the client's consent). Create location pages only if the owner confirms a real service area (area H, §9). Avoid doorway pages | content (owner) + build | `src/app/routes.ts` | M |
| F-22 | Medium | D, H | 8 pages + footer | Informal "ty" forms: "tvojom biznise" (`ProcessPage.tsx:21`), "platíš" (`PricingPage.tsx:151`), "Tvoj web v dobrých rukách" (`ServicesPage.tsx:61`), "tvoj web?" (`SeoAuditPage.tsx:388`), "Vyleveluj svoju stránku" (`Footer.tsx:35`) and more (lead 10) | Inconsistent voice within one visit undermines a professional B2B tone, and it contradicts the formal home page | Rewrite to "vy" (for example "Vylevelujte svoju stránku", "Ako je na tom váš web?") | content (owner) + code | see lead 10 | S |
| F-23 | Low | H | `/` | Testimonials say "Odporúča SiteLeveled na Facebooku", but the only Facebook link goes to a personal profile, `facebook.com/mario.doman` (`Footer.tsx:158`). The recommendations can't be checked | Reviews you can verify carry more trust. A business page is also a citation | Link to the Facebook business page's reviews tab once the owner gives the URL (§9) | content (owner) + code | `src/app/components/layout/Footer.tsx:158`, `src/app/components/sections/TestimonialsSection.tsx` | S |
| F-24 | Low | H | `/`, `/portfolio` | mdfoto.sk names "Prevádzkovateľ: DOMAN s.r.o." and fotkynavyber.sk names "DOMAN s.r.o." as its Organization (`raw/client-backlinks/summary.txt`). Both are shown as client projects. fotkynavyber.sk is not in the owner-confirmed reference list | Showing your own company's properties as client work without saying so is a transparency risk if a visitor notices | Label them honestly ("vlastný projekt" / "náš SaaS"). This strengthens E-E-A-T rather than weakening it. Confirm whether fotkynavyber.sk should be listed (§9) | content (owner) | `src/app/components/sections/PortfolioSection.tsx`, `src/app/pages/PortfolioPage.tsx` | S |
| F-25 | Low | C, G | `/sluzby`, `/proces`, `/cennik`, `/kontakt`, `/portfolio` | `/sluzby` and `/proces` go h1 → h3 with no h2. Lighthouse `heading-order` fails on `/cennik`, `/kontakt` and `/portfolio`. The footer has h3 + h4 on every page | A clean outline helps assistive tech and topical structure | Promote the section headings to h2. Make the footer headings non-heading elements, or h2 | code | `src/app/pages/ServicesPage.tsx`, `src/app/pages/ProcessPage.tsx`, `src/app/components/layout/Footer.tsx:32,81,115,129` | S |
| F-26 | Low | G | all | Lighthouse `color-contrast` fails on every run: 15–33 elements per page (text at `/30`–`/40` opacity, e.g. footer company details) | Readability on mobile in daylight. It's an accessibility (WCAG AA) issue | Raise low-opacity text to at least `/60` on the dark background | code | `src/app/components/layout/Footer.tsx:70-76`, others | S |
| F-27 | Low | G, C | `/`, all pages with images | Portfolio images `alt=""` (`PortfolioSection.tsx:188`). No `width`/`height` attributes on any `<img>` (`raw/render/home.json`). Desktop CLS is 0.093 on `/o-nas` and 0.072 on `/proces` (under 0.1 but close) | Lost image-search context. Reserving space avoids layout shift | `alt="Ukážka webu springnitra.sk"` and so on, with the duplicate `aria-hidden` link removed so there's one link per card. Add `width`/`height` (or `aspect-ratio`) to images | code | `src/app/components/sections/PortfolioSection.tsx:178-192`, `src/app/pages/AboutPage.tsx:59` | S |
| F-28 | Low | K | all | No `Strict-Transport-Security`, `X-Content-Type-Options` or `Referrer-Policy`. `server: nginx/1.24.0 (Ubuntu)` exposes the version | Not a ranking factor. Basic hardening and trust | nginx: add HSTS (start with `max-age=86400`, then `31536000`), `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `server_tokens off` | nginx/VPS (owner) | (VPS nginx config) | S |
| F-29 | Low | K | `/favicon.ico`, `public/*.png` | `/favicon.ico` returns 200 HTML. No web manifest. About 10 MB of unused PNG originals are published (`mdfoto-preview.png` 3.0 MB, `zuzu-photo-preview.png` 3.0 MB, `nosekrst-preview.png` 2.6 MB, `fotkynavyber-preview.png` 1.8 MB); only the `.webp` files are referenced | Small hygiene items. Some clients request `/favicon.ico` directly | Add a real `favicon.ico`. Remove the unused PNGs from `public/` | code | `public/` | S |
| F-30 | Low | D, H | `/sluzby` | "68 % zákazníkov začína hľadanie online" has no source. The services list includes items not in the confirmed facts ("Mesačné reporty a sledovanie pozícií", "Preklad SK/EN", "Lokálne SEO (Google Business, mapy)") | Unsourced statistics and unconfirmed offers are E-E-A-T and consumer-protection risks | Source the statistic or remove it. Confirm the listed services (§9) | content (owner) | `src/app/pages/ServicesPage.tsx:36-50` | S |
| F-31 | Low | D, G | `/kontakt`, `/cennik`, `/proces` vs `/` | Two different free offers: "Bezplatná 30-minútová konzultácia" (contact, pricing, process) and "Návrh zadarmo do 24 hodín" (home, nav CTA) | A split message and two funnels (one of them broken, F-06) | Pick one primary offer per page and make all CTAs on that page point to the matching form | content (owner) + code | `src/app/pages/ContactPage.tsx:83`, `src/app/pages/PricingPage.tsx:206-212` | S |

### 3.2 Verification of the pre-scan leads (§4 of the brief)

| # | Lead | Verdict | Evidence |
|---|---|---|---|
| 1 | robots.txt and sitemap.xml return 200 text/html | **Confirmed** | `raw/headers/status.csv`: both return `200 text/html` with the home ETag `W/"6ae6266b-7e8"`. Lighthouse `robots-txt` fails on all 18 runs. Unlighthouse also "found" a robots.txt (the HTML) and reported `Sitemaps: 0` (`raw/unlighthouse.log`) |
| 2 | Same raw title, description and OG on every route | **Confirmed** | Raw HTML is byte-identical on all routes (same ETag). The rendered title is unchanged too (`raw/render/*.json`, field `title`). Only `/mesto/<id>/` differs, because it is a static file from `scripts/cityPages.ts:88-112`. `CityPanel.tsx` sets `document.title` on the client only |
| 3 | No canonical; www returns 200; http → https is fine | **Confirmed, plus one detail** | `canonical: null` on every route. `https://www.siteleveled.com/` returns 200. `http://siteleveled.com/` 301s to `https://siteleveled.com/` in one hop, but `http://www.siteleveled.com/` 301s to **`https://www.`**, not the apex (`raw/headers/31_*.txt`) |
| 4 | Soft 404s | **Confirmed** | `/toto-neexistuje-xyz-404`, `/blog/neexistujuci-clanok`, `/favicon.ico` and `/manifest.webmanifest` all return 200 HTML. The rendered DOM of a made-up URL is the complete HomePage (785 words, the same h1): `raw/render/toto-neexistuje-xyz-404.json` |
| 5 | No structured data | **Confirmed** | `jsonLd: 0` on every rendered route. No `ld+json` in `src/`, `index.html` or `scripts/` |
| 6 | `/seo-audit/admin` has no noindex and the architecture can't serve one | **Partly true** | No robots meta and no `X-Robots-Tag` (confirmed). But the architecture **can** serve one: the same build step that writes `dist/mesto/<id>/index.html` with `noindex` can write `dist/seo-audit/admin/index.html` (see §5) |
| 7 | Orphan pages | **Confirmed, and worse than stated** | Rendered-DOM link graph (`raw/internal-links.csv`, `raw/link-graph.json`): `/sluzby`, `/portfolio`, `/proces`, `/o-nas`, `/cennik` and `/blog` have **0** linking pages. The `/portfolio` and `/blog` links exist only in the contact form's *success* state (`ContactPage.tsx:221-227`), which is never in the DOM unless someone submits. `/o-nas` is linked only from a CityPanel window opened by clicking the canvas (`CityPanel.tsx:198`). **Independent check:** Unlighthouse found no links in the raw HTML ("No internal links discovered on home page"), switched to its JavaScript crawler, and still discovered only 8 routes: `/`, `/kontakt`, `/seo-audit` and five `/mesto/*` pages. It never reached any of the six content pages (`raw/unlighthouse.log`, `raw/unlighthouse/ci-result.json`) |
| 8 | Dead `href="#"` links and no privacy policy | **Confirmed, and wider** | Footer: privacy, terms and Instagram, on every page (`Footer.tsx:144,175,178`). `/kontakt` adds three more `#` icons: LinkedIn, Instagram, GitHub (`ContactPage.tsx:289-298`). No privacy or terms route exists in `routes.ts` |
| 9 | Placeholder blog | **Confirmed** | 5 posts with no URLs. "Čítať ďalej" is not a link. The newsletter "Odoberať" is a `<button>` outside any form, with no handler. 5 images are hotlinked from `images.unsplash.com` with `utm_source=figma` (`BlogPage.tsx:22-66`) |
| 10 | Inconsistent tone in About, Contact and Blog | **Partly true (understated)** | The informal "ty" voice appears on **8** pages: `/sluzby`, `/proces`, `/cennik`, `/portfolio`, `/o-nas`, `/kontakt`, `/blog` and `/seo-audit`. It's also in the footer h3 "Vyleveluj svoju stránku." shown on every page (`Footer.tsx:35`). Only the home sections and the lead form use "vy". See F-22 |
| 11 | Google Fonts through a CSS `@import` | **Confirmed** | `dist/assets/index-DLn2T6Lq.css` begins with `@import"https://fonts.googleapis.com/css2?family=Inter:wght@300;…900&family=Syne…&family=Pixelify+Sans…"`. Lighthouse lists it as render-blocking (about 780 ms) on every mobile run. 6 woff2 files load, about 198 kB |
| 12 | 546 kB main bundle, one chunk | **Confirmed** | `index--NA2e9g2.js` = 545,793 B (174 kB gzip at build). Only `CityPanel` (40.6 kB) is split out. Lighthouse reports 235–289 kB unused JS per page |
| 13 | No Cache-Control, Content-Encoding or HSTS on HTML | **Partly true** | HTML **is** gzip-compressed when the client sends `Accept-Encoding` (`content-encoding: gzip`, `raw/headers/01_*.txt`). No Cache-Control and no HSTS: confirmed. Worse on assets: **JS and CSS are not compressed at all** (`raw/headers-assets/*.txt`: no `content-encoding`, 545,793 B transferred with `Accept-Encoding: gzip`) and have no `Cache-Control` |
| 14 | Portfolio images use `alt=""` | **Partly true** | Confirmed at `PortfolioSection.tsx:188`. For accessibility, "decorative" is defensible: the image link is `aria-hidden` and `tabIndex={-1}`, and is duplicated by the h3 and the "Pozrieť web naživo" link. For image search and context, a short alt is better. See F-27 |

---

## 4. Per-URL table

Measured 2026-11-01. Status codes come from production (`raw/headers/status.csv`). Titles, h1s and word counts come from the rendered DOM with a Googlebot smartphone UA (`raw/render/*.json`, run against a local `vite preview` of a build whose `index.html` is byte-identical to production's). Lighthouse numbers are production, mobile preset (`raw/lighthouse-summary.csv`).

The **raw `<title>` on every route** is "SiteLeveled — Weby, ktoré predávajú | Návrh zadarmo do 24h" (58 chars). The **raw description on every route** is "Moderné weby, ktoré predávajú. Návrh vašej novej stránky zadarmo do 24 hodín – bez záväzkov. Webdizajn, SEO a správa webu pre slovenské firmy." (142 chars).

| URL | Status | Raw title | Rendered title | Meta description | h1 (rendered) | Canonical | Robots | Words in `<main>` | Inbound internal links (linking pages) | LH mobile perf | LH mobile SEO | LH mobile LCP |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | 200 | default | default | default | Získajte návrh vašej novej webstránky do 24 hodín – úplne zadarmo. | none | none | 785 | 9 | 59 | 92 | 6.67 s |
| `/sluzby` | 200 | default | default | default | Čo robíme. A robíme to poriadne. | none | none | 327 | **0** | 57 | 91 | 6.45 s |
| `/portfolio` | 200 | default | default | default | Výsledky hovoria za nás. | none | none | 494 | **0** | 61 | 92 | 6.48 s |
| `/proces` | 200 | default | default | default | Od nápadu po spustenie. Bez prekvapení. | none | none | 145 | **0** | 62 | 91 | 6.34 s |
| `/o-nas` | 200 | default | default | default | Za siteleveled.com stoja ľudia. Nie anonymná agentúra. | none | none | 169 | **0** | 61 | 92 | 6.71 s |
| `/cennik` | 200 | default | default | default | Investícia, nie náklad. | none | none | 189 | **0** | 60 | 91 | 6.67 s |
| `/blog` | 200 | default | default | default | Poznatky z praxe. Nie teória. | none | none | 190 | **0** | 59 | 92 | 7.69 s |
| `/kontakt` | 200 | default | default | default | Porozprávajme sa. | none | none | 63 | 9 | 61 | 91 | 6.43 s |
| `/seo-audit` | 200 | default | default | default | Ako na tom je tvoj web? | none | none | 96 | 9 | 62 | 91 | 6.41 s |
| `/seo-audit/admin` *(should not be indexed)* | 200 | default | default | default | Prehľad SEO auditov. | none | **none (should be noindex)** | 19 | 0 | – | – | – |
| `/mesto/jogaslaskou/` *(noindex on purpose)* | 200 (301 from no-slash) | own | own | own | same as home | none | `noindex, follow` | 785 | – | – | – | – |
| `/toto-neexistuje-xyz-404` *(made-up)* | **200** | default | default | default | same as home | none | none | 785 | – | – | – | – |

Desktop Lighthouse (production): performance 85–94, LCP 1.41–2.10 s, CLS ≤ 0.093, SEO 91–92, accessibility 90–96, best practices 100 on every route. The full table is in `raw/lighthouse-summary.csv`.

*Inbound links count distinct linking pages in the default rendered DOM. `/`, `/kontakt` and `/seo-audit` get theirs from the global navbar and footer.*

---

## 5. Technical fix plan for this architecture

**Constraint.** nginx serves `dist/` statically with `try_files $uri $uri/ /index.html`, and only `/api/*` reaches Express. Anything a crawler should see in `<head>` must therefore exist **as a file in `dist/` at build time**, or be added in nginx by the owner. Injecting HTML in Express (`server/index.js`) will never reach production. The one exception is the `/api/seo-audit/report/*` pages, which Express does serve.

### 5.1 Options compared

| | A. Extend the build plugin (head only) | B. A pre-render step (head + body) | C. nginx rules only |
|---|---|---|---|
| What it does | In `closeBundle`, write `dist/<route>/index.html` for every route with its own head, plus `robots.txt`, `sitemap.xml` and `404.html`, exactly like `/mesto/<id>/` today | After A, load each route in headless Chrome (reduced motion emulated), capture the DOM and put it in that file's `#root` | `sub_filter` or `map` blocks injecting meta per location, and a `map` of known routes to return 404 |
| Fixes | titles, descriptions, canonical, `og:url`, JSON-LD, noindex for admin/404, robots, sitemap | everything in A, plus body text and links in raw HTML (Bing, social, AI crawlers) and a much earlier first paint | canonical host, compression, caching, real 404 status, HSTS |
| Can't fix | the empty body (F-05) | n/a | per-page content without unmaintainable config. Can't be tested in the repo |
| Risk | low: same pattern as `cityPages.ts`, no new dependency | medium: the build needs Chrome on the VPS (also pending for `/seo-audit`), and counters and animations must render final state | config lives outside git; only the owner can deploy it |
| Effort | S–M | M | S (but owner-only) |

**Recommendation.** Do **A now** (it removes F-02, F-03 at the HTML level, F-10, F-14 and F-15), ask the owner for the **small nginx change in C** (F-04, F-09, real 404s, F-28), then add **B** once Chrome is on the VPS. Keep one route table as the single source of truth so `routes.ts`, the static files and the sitemap can't drift apart.

**URL format.** With today's nginx, a file at `dist/sluzby/index.html` makes `/sluzby` 301 to `/sluzby/`, exactly as `/mesto/jogaslaskou` does now. So make the **trailing-slash URL canonical** (`https://siteleveled.com/sluzby/`) and update internal links to the slash form to avoid redirect hops. React Router matches both. The home anchors (`/#formular` and the rest) don't change.

### 5.2 Sample: route table and build plugin (sketch, not applied)

```ts
// src/app/seo/pages.ts: single source of truth (also usable by a client-side title hook)
export interface PageMeta {
  path: string;          // canonical path, trailing slash
  title: string;
  description: string;
  robots?: string;       // default "index, follow"
  sitemap?: boolean;     // default true
  jsonLd?: object[];
}

export const PAGES: PageMeta[] = [
  { path: "/", title: "Tvorba webstránok a e-shopov na mieru | SiteLeveled",
    description: "Tvorba webstránok od 300 € a e-shopov od 1 000 € pre slovenské firmy. Návrh vášho nového webu dostanete zadarmo do 24 hodín, bez zálohy." },
  { path: "/cennik/", title: "Cenník: koľko stojí webstránka a e-shop | SiteLeveled",
    description: "Web od 300 € (do 7 dní), e-shop od 1 000 € (do 14 dní), SEO audit 199 €, správa webu od 30 €/mesiac. Bez zálohy – platíte až po spustení." },
  // … the rest from §6.2
  { path: "/blog/", title: "…", description: "…", robots: "noindex, follow", sitemap: false }, // until real posts exist
  { path: "/seo-audit/admin/", title: "Prehľad SEO auditov | SiteLeveled", description: "",
    robots: "noindex, nofollow", sitemap: false },
];
```

```ts
// scripts/staticPages.ts: runs after cityPages, reads the pristine template once
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { PAGES } from "../src/app/seo/pages";

const SITE = "https://siteleveled.com";
const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function headFor(template: string, p: (typeof PAGES)[number]) {
  const url = SITE + p.path;
  const indexable = !p.robots?.includes("noindex");
  const tags = [
    ...(indexable ? [`<link rel="canonical" href="${url}" />`] : []), // no canonical on noindex pages (admin, blog, 404)
    `<meta name="robots" content="${p.robots ?? "index, follow"}" />`,
    `<meta property="og:url" content="${url}" />`,
    ...(p.jsonLd ?? []).map((d) => `<script type="application/ld+json">${JSON.stringify(d)}</script>`),
  ];
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(p.title)}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(p.description)}" />`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(p.title)}`)
    .replace(/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${esc(p.description)}" />`)
    .replace("</head>", `  ${tags.join("\n    ")}\n  </head>`);
}

export function staticPages(): Plugin {
  let outDir = "";
  return {
    name: "siteleveled-static-pages",
    apply: "build",
    enforce: "post",
    configResolved(c) { outDir = path.resolve(c.root, c.build.outDir); },
    closeBundle() {
      const template = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      for (const p of PAGES) {
        const dir = path.join(outDir, p.path);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), headFor(template, p));
      }
      const today = new Date().toISOString().slice(0, 10);
      const urls = PAGES.filter((p) => p.sitemap !== false && !p.robots?.includes("noindex"));
      fs.writeFileSync(path.join(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls.map((p) => `  <url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod></url>`).join("\n") + `\n</urlset>\n`);
      fs.writeFileSync(path.join(outDir, "robots.txt"),
        `User-agent: *\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`);
      fs.writeFileSync(path.join(outDir, "404.html"), headFor(template, {
        path: "/404/", title: "Stránka sa nenašla | SiteLeveled", description: "", robots: "noindex, follow" }));
    },
  };
}
```

Points to watch when implementing:
- **Order with `cityPages.ts`.** `cityPages` reads `dist/index.html` in its own `closeBundle` and copies everything except title, description and OG tags. If the home `index.html` gains a canonical or JSON-LD first, every `/mesto/<id>/` page would inherit the **home canonical next to its `noindex`**, which is contradictory. Rollup runs `closeBundle` hooks in parallel. Because both bodies are synchronous they still execute in plugin order, so `enforce: "post"` works today. The more robust fix is to merge the two plugins, or to make `cityPages` strip `canonical`, `robots` and `ld+json` from the template it copies.
- **The `og:image` dimensions** in `index.html` stay valid (1200×630 confirmed for `dist/og/siteleveled.png`). Per-page OG images can come later, with `renderOgPng()` already available.
- **Client navigation.** Add a small `useEffect` in `Layout.tsx` that looks up `PAGES` by `location.pathname` and sets `document.title` and the description meta, so tabs, history and analytics show the right page after in-app navigation.
- **Soft 404 in the SPA.** Make the `*` route render a `NotFound` page that inserts `<meta name="robots" content="noindex">` with JS. Google's JavaScript SEO guide documents this for single-page apps. `/mesto/:slug` must keep rendering HomePage.

### 5.3 Sample: nginx changes for the owner (not applied)

Keep the existing `/api/` proxy block exactly as it is. Note that `add_header` inside a `location` replaces all server-level `add_header`s, so repeat the security headers in any location that sets its own.

```nginx
# 1. One canonical host
server {
    listen 80;
    listen [::]:80;
    server_name siteleveled.com www.siteleveled.com;
    return 301 https://siteleveled.com$request_uri;
}
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.siteleveled.com;
    # ssl_certificate … (same certificate; it already covers www)
    return 301 https://siteleveled.com$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name siteleveled.com;
    root /path/to/dist;
    server_tokens off;

    # 2. Compression for JS/CSS/SVG/JSON (text/html is already on by default)
    gzip on;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_types text/css application/javascript application/json image/svg+xml text/plain application/xml;

    # 3. Security headers
    add_header Strict-Transport-Security "max-age=86400" always;   # raise to 31536000 after a week
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # 4. Hashed assets: cache for a year
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Strict-Transport-Security "max-age=86400" always;
        add_header X-Content-Type-Options "nosniff" always;
        try_files $uri =404;
    }

    # location /api/ { … existing proxy_pass to 127.0.0.1:3001, unchanged … }

    # 5. Real 404s. Switch ONLY after the build writes a file per route (6.2),
    #    otherwise every route would 404
    location / {
        add_header Cache-Control "no-cache";
        add_header Strict-Transport-Security "max-age=86400" always;
        add_header X-Content-Type-Options "nosniff" always;
        try_files $uri $uri/ =404;          # was: $uri $uri/ /index.html
    }
    error_page 404 /404.html;
}
```

Until step 5 is live, the build-side `404.html` does nothing, but the client-side `noindex` on the `*` route still covers Google.

### 5.4 Rendering fixes that don't need a new architecture (code, S each)

1. `FaqAccordion`: always render answers and collapse them with CSS (F-11).
2. `AnimatedCounter`: put the final number in the DOM and animate only visually (F-12).
3. `HeroSection`: cap `min-h-screen`. `AnimateIn`: don't hide content from non-interactive renderers (F-13).
4. Footer and nav: add the orphaned routes as real `<Link>`s (F-01).

---

## 6. Content and keyword plan

**Caveat.** No search-volume, ranking or competitor tool was available (§10). The intents below are hypotheses based on how Slovak users phrase these services. Validate them with Search Console queries once it's connected, and with a keyword tool if you have one.

### 6.1 Target intent per page

| Page | Primary intent (hypothesis) | Secondary | Notes |
|---|---|---|---|
| `/` | "tvorba webstránok" / "tvorba web stránok" | "web na mieru", "návrh webu zadarmo", brand | The home page carries the commercial core plus the free-proposal offer |
| `/sluzby/` | "tvorba webu a SEO služby" | "správa webu", "copywriting web" | Hub that links out to each service |
| `/cennik/` | "cena webstránky", "koľko stojí webstránka" | "cena e-shopu", "cena správy webu" | The strongest informational-commercial page; needs more text (F-20) |
| `/portfolio/` | "referencie tvorba webu" | client names | Link to each case study (new) |
| `/proces/` | "ako prebieha tvorba webu" | "ako dlho trvá tvorba webu" | Informational; supports `/cennik/` |
| `/o-nas/` | brand + "Mário Doman", "DOMAN s.r.o." | — | E-E-A-T page |
| `/kontakt/` | brand + "kontakt" | — | Navigational |
| `/seo-audit/` | "SEO audit zadarmo", "kontrola webu zadarmo" | "test rýchlosti webu" | The free tool. Make clear how it differs from the paid 199 € audit to avoid cannibalising it |
| `/blog/` | noindex until there are real articles | — | F-16 |
| **new** `/tvorba-eshopu/` | "tvorba e-shopu", "e-shop na mieru" | "cena e-shopu" | A separate service at a separate price that deserves its own page |
| **new** `/portfolio/<client>/` | client brand + "web" | — | Case studies with the real Facebook review (with the client's consent) |
| **new** `/ochrana-osobnych-udajov/` | (legal) | — | F-17. Not a ranking page but needed for trust |

There are no location pages for now: the site says "Slovensko (pracujeme remote, celá SR)" (`ContactPage.tsx:266`), and the brief lists the service area as undecided. If the owner wants local targeting (the clients are in Nitra and Pezinok), start with a Google Business Profile and one genuinely local page. Don't create city-swap doorway pages.

### 6.2 Proposed titles and meta descriptions (Slovak, formal "vy")

All titles are 47–54 characters and all descriptions 123–142 characters, measured.

| Page | `<title>` | Meta description |
|---|---|---|
| `/` | Tvorba webstránok a e-shopov na mieru \| SiteLeveled | Tvorba webstránok od 300 € a e-shopov od 1 000 € pre slovenské firmy. Návrh vášho nového webu dostanete zadarmo do 24 hodín, bez zálohy. |
| `/sluzby/` | Tvorba webu, e-shopu, SEO a správa webu \| SiteLeveled | Navrhneme a naprogramujeme váš web alebo e-shop, nastavíme SEO a postaráme sa o správu webu. Web od 300 €, e-shop od 1 000 €, SEO audit 199 €. |
| `/cennik/` | Cenník: koľko stojí webstránka a e-shop \| SiteLeveled | Web od 300 € (do 7 dní), e-shop od 1 000 € (do 14 dní), SEO audit 199 €, správa webu od 30 €/mesiac. Bez zálohy – platíte až po spustení. |
| `/portfolio/` | Portfólio a referencie: naše weby \| SiteLeveled | Weby a e-shopy, ktoré sme navrhli a naprogramovali pre slovenské firmy – od fotografiek po e-shop. Každý projekt si môžete otvoriť naživo. |
| `/proces/` | Ako prebieha tvorba webu krok za krokom \| SiteLeveled | Návrh dostanete do 24 hodín, jednoduchý web je hotový do 7 dní, e-shop do 14 dní. Pozrite si, ako prebieha spolupráca od návrhu po spustenie. |
| `/o-nas/` | O nás: Mário Doman a DOMAN s.r.o. \| SiteLeveled | Za SiteLeveled stojí vývojár Mário Doman a spoločnosť DOMAN s.r.o. Každý projekt vedie osobne – zavolajte mu priamo na 0910 803 993. |
| `/kontakt/` | Kontakt – návrh webu zadarmo do 24 hodín \| SiteLeveled | Napíšte na domansro@gmail.com alebo zavolajte na 0910 803 993. Návrh vašej novej webstránky pripravíme zadarmo do 24 hodín. |
| `/seo-audit/` | SEO audit webu zadarmo – online kontrola \| SiteLeveled | Zadajte adresu webu a o pár minút uvidíte skóre SEO, rýchlosti a prístupnosti pre až 15 podstránok. Bezplatná kontrola nástrojom Lighthouse. |
| `/blog/` (once it has posts) | Blog o tvorbe webu a SEO pre malé firmy \| SiteLeveled | Praktické rady o tvorbe webstránok, cenách, SEO a správe webu pre slovenských podnikateľov – z projektov, ktoré sme naozaj robili. |

**Proposed h1s.** The current slogans can stay as the second, gradient line.

| Page | h1 |
|---|---|
| `/` | Tvorba webstránok na mieru – návrh vášho webu do 24 hodín zadarmo. |
| `/sluzby/` | Tvorba webstránok, e-shopov a SEO pod jednou strechou. |
| `/cennik/` | Cenník tvorby webstránok a e-shopov. |
| `/portfolio/` | Portfólio: weby, ktoré sme vytvorili. |
| `/proces/` | Ako prebieha tvorba vášho webu. |
| `/o-nas/` | Kto stojí za SiteLeveled. |
| `/kontakt/` | Kontaktujte nás. |
| `/seo-audit/` | Bezplatný SEO audit vášho webu. |

### 6.3 A realistic first set of blog topics

Each article should come from real project experience, link to the matching money page, and be published as its own static route.

1. **Koľko stojí webstránka na Slovensku? Čo ovplyvňuje cenu** → `/cennik/`
2. **Prerábka starého webu: kedy sa oplatí a ako pri nej nestratiť pozície v Google** (from the jogaslaskou.sk and springnitra.sk redesigns) → `/sluzby/`
3. **E-shop alebo jednoduchý web? Ako sa rozhodnúť** → `/tvorba-eshopu/`
4. **Čo skontrolovať na webe pred spustením: SEO checklist pre malé firmy** → `/seo-audit/`
5. **Google Business Profile krok za krokom pre malé firmy** → `/sluzby/`
6. **Ako prebieha tvorba webu za 7 dní: od návrhu po spustenie** → `/proces/`

### 6.4 Fact consistency (against §2 of the brief)

- Prices are consistent everywhere they appear (hero, FAQ, WhySection, `/sluzby`, `/cennik`): web from 300 € in 7 days, e-shop from 1 000 € in 14 days, SEO audit 199 €, care from 30 €/month, no deposit. The **only** inconsistency is the counter rendering "0 €" before scroll (F-12).
- Phone (`0910 803 993` / `tel:+421910803993`) and email (`domansro@gmail.com`) are consistent in the footer, `/kontakt`, `/o-nas` and BioSection.
- The 3 reviews match §2 exactly (`TestimonialsSection.tsx:7-23`).
- **Not in §2 but shown on the site:** IČO 47 912 383, the address "Ulica Funduše 1165/26, Cabaj-Čápor 951 17" (footer, `/kontakt`, `/o-nas`), "konateľka od 27. 09. 2014" (`AboutPage.tsx:122`), fotkynavyber.sk as a reference, the statistic "68 %", and some service items. None of these went into the proposed structured data. See §9.

---

## 7. Structured data (ready to paste)

Rules followed: only facts from §2; no `aggregateRating` or `review` (Google doesn't show self-serving review stars for a business's own reviews on its own site); no address or IČO until the owner confirms them. All blocks below passed the schema.org validator with **0 errors and 0 warnings** (`raw/jsonld/*.validator.txt`).

Put each block in the static head of its route (§5.2, `jsonLd`). URLs follow the trailing-slash canonical form.

**Every page (or at least `/`): Organization, WebSite, Person** (`raw/jsonld/sitewide-home.json`)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://siteleveled.com/#organization",
      "name": "SiteLeveled",
      "legalName": "DOMAN s.r.o.",
      "url": "https://siteleveled.com/",
      "logo": { "@type": "ImageObject", "url": "https://siteleveled.com/apple-touch-icon.png", "width": 180, "height": 180 },
      "image": "https://siteleveled.com/og/siteleveled.png",
      "description": "Tvorba webstránok a e-shopov pre slovenské firmy. Návrh webu zadarmo do 24 hodín.",
      "email": "domansro@gmail.com",
      "telephone": "+421910803993",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+421910803993",
        "email": "domansro@gmail.com",
        "availableLanguage": "sk"
      },
      "founder": { "@id": "https://siteleveled.com/o-nas/#mario-doman" },
      "employee": [
        { "@id": "https://siteleveled.com/o-nas/#mario-doman" },
        { "@id": "https://siteleveled.com/o-nas/#maria-domanova" }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://siteleveled.com/#website",
      "name": "SiteLeveled",
      "url": "https://siteleveled.com/",
      "inLanguage": "sk",
      "publisher": { "@id": "https://siteleveled.com/#organization" }
    },
    {
      "@type": "Person",
      "@id": "https://siteleveled.com/o-nas/#mario-doman",
      "name": "Mário Doman",
      "jobTitle": "Vývojár",
      "telephone": "+421910803993",
      "image": "https://siteleveled.com/profile.jpg",
      "worksFor": { "@id": "https://siteleveled.com/#organization" }
    },
    {
      "@type": "Person",
      "@id": "https://siteleveled.com/o-nas/#maria-domanova",
      "name": "Mária Domanová",
      "jobTitle": "Konateľka",
      "worksFor": { "@id": "https://siteleveled.com/#organization" }
    }
  ]
}
```

> `founder` assumes Mário founded the studio. Drop that line if that isn't right. The 180 px apple-touch icon meets Google's 112 px minimum for logos. A dedicated square logo file would be better. Once the owner confirms the address and a Google Business Profile, `Organization` can become `ProfessionalService` with `address` (and `sameAs` to the business profile).

**`/sluzby/` and `/cennik/`: Service + Offer + BreadcrumbList** (`raw/jsonld/sluzby.json`)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://siteleveled.com/sluzby/#tvorba-webu",
      "name": "Tvorba webstránky na mieru",
      "serviceType": "Tvorba webstránok",
      "provider": { "@id": "https://siteleveled.com/#organization" },
      "areaServed": { "@type": "Country", "name": "Slovensko" },
      "offers": {
        "@type": "Offer",
        "url": "https://siteleveled.com/cennik/",
        "priceCurrency": "EUR",
        "priceSpecification": { "@type": "PriceSpecification", "minPrice": 300, "priceCurrency": "EUR" },
        "description": "Web od 300 €, hotový do 7 dní. Bez zálohy, platíte až po spustení."
      }
    },
    {
      "@type": "Service",
      "@id": "https://siteleveled.com/sluzby/#tvorba-eshopu",
      "name": "Tvorba e-shopu na mieru",
      "serviceType": "Tvorba e-shopov",
      "provider": { "@id": "https://siteleveled.com/#organization" },
      "areaServed": { "@type": "Country", "name": "Slovensko" },
      "offers": {
        "@type": "Offer",
        "url": "https://siteleveled.com/cennik/",
        "priceCurrency": "EUR",
        "priceSpecification": { "@type": "PriceSpecification", "minPrice": 1000, "priceCurrency": "EUR" },
        "description": "E-shop od 1 000 €, hotový do 14 dní. Bez zálohy, platíte až po spustení."
      }
    },
    {
      "@type": "Service",
      "@id": "https://siteleveled.com/sluzby/#seo-audit",
      "name": "SEO audit webu",
      "serviceType": "SEO audit",
      "provider": { "@id": "https://siteleveled.com/#organization" },
      "offers": { "@type": "Offer", "url": "https://siteleveled.com/cennik/", "price": 199, "priceCurrency": "EUR" }
    },
    {
      "@type": "Service",
      "@id": "https://siteleveled.com/sluzby/#sprava-webu",
      "name": "Správa webu",
      "serviceType": "Správa a údržba webu",
      "provider": { "@id": "https://siteleveled.com/#organization" },
      "offers": {
        "@type": "Offer",
        "url": "https://siteleveled.com/cennik/",
        "priceCurrency": "EUR",
        "priceSpecification": { "@type": "UnitPriceSpecification", "minPrice": 30, "priceCurrency": "EUR", "unitCode": "MON", "unitText": "mesiac" }
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Domov", "item": "https://siteleveled.com/" },
        { "@type": "ListItem", "position": 2, "name": "Služby", "item": "https://siteleveled.com/sluzby/" }
      ]
    }
  ]
}
```

> `areaServed: Slovensko` reflects the site's own "pracujeme remote, celá SR". Remove it if the owner decides otherwise. Google has no Service rich result; this markup is for understanding the entity, not for a SERP feature. On `/cennik/`, reuse the same graph with the breadcrumb changed to "Cenník".

**`/o-nas/`: AboutPage + BreadcrumbList** (`raw/jsonld/o-nas.json`)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://siteleveled.com/o-nas/#webpage",
      "url": "https://siteleveled.com/o-nas/",
      "name": "O nás – kto stojí za SiteLeveled",
      "inLanguage": "sk",
      "isPartOf": { "@id": "https://siteleveled.com/#website" },
      "about": { "@id": "https://siteleveled.com/#organization" },
      "mainEntity": { "@id": "https://siteleveled.com/o-nas/#mario-doman" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Domov", "item": "https://siteleveled.com/" },
        { "@type": "ListItem", "position": 2, "name": "O nás", "item": "https://siteleveled.com/o-nas/" }
      ]
    }
  ]
}
```

**`/kontakt/`: ContactPage + BreadcrumbList** (`raw/jsonld/kontakt.json`)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://siteleveled.com/kontakt/#webpage",
      "url": "https://siteleveled.com/kontakt/",
      "name": "Kontakt – SiteLeveled",
      "inLanguage": "sk",
      "isPartOf": { "@id": "https://siteleveled.com/#website" },
      "about": { "@id": "https://siteleveled.com/#organization" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Domov", "item": "https://siteleveled.com/" },
        { "@type": "ListItem", "position": 2, "name": "Kontakt", "item": "https://siteleveled.com/kontakt/" }
      ]
    }
  ]
}
```

**Other inner pages** (`/portfolio/`, `/proces/`, `/seo-audit/`): the same BreadcrumbList pattern with the page name ("Portfólio", "Proces", "SEO audit").

**FAQPage (optional, low value)** (`raw/jsonld/faq-home-optional.json`): valid, but since 2023 Google shows FAQ rich results only for well-known government and health sites, so it won't produce a SERP feature here. If used, the answers must first be present in the page (F-11), and the markup must list all six home Q&As word for word. The validated sample has two of them.

---

## 8. Roadmap

**Quick wins (under a day each, no owner input needed)**
1. Footer and nav links to `/sluzby/`, `/cennik/`, `/portfolio/`, `/o-nas/` (F-01). *code, S*
2. Fix or replace the `/kontakt` form (F-06). *code, S*
3. `FaqAccordion` always renders its answers. `AnimatedCounter` shows the real number (F-11, F-12). *code, S*
4. `noindex` client meta on the `*` route; `X-Robots-Tag: noindex` on `/api/seo-audit` responses (F-03, F-15). *code, S*
5. Replace `href="#"` icons with real profiles or remove them (F-17). *code, S*
6. Replace the font `@import` with `<link>` and trim Inter to the weights used (F-18). *code, S*
7. Convert the "ty" copy to "vy" (F-22). *content + code, S*

**Next 2–4 weeks**
1. The build plugin from §5.2: per-route head, canonical, `og:url`, JSON-LD, `robots.txt`, `sitemap.xml`, `404.html`, noindex for admin and blog (F-02, F-10, F-14, F-15, F-16). *build, M*
2. New titles, descriptions and h1s from §6.2 (F-08). *content + code, S*
3. Content depth for `/cennik/`, `/proces/` and `/seo-audit/` (F-20). *content, M*
4. Route-level code splitting and `LazyMotion` (F-19). *code, M*
5. Hero height cap and visible-by-default `AnimateIn` (F-13). *code, S*
6. Analytics plus a lead conversion event; submit the sitemap in Search Console (F-07). *code + owner, S*
7. Pre-render bodies at build once Chrome is available on the VPS (F-05, option B). *build, M*

**Needs an owner decision**
- A privacy policy (and terms) text (F-17).
- Keep `/blog` with real articles, or noindex/remove it (F-16).
- One primary free offer: proposal or consultation (F-31).
- Whether mdfoto.sk and fotkynavyber.sk are shown as own projects or client work (F-24).
- A service area and whether to pursue local SEO / Google Business Profile (§6.1).
- An e-shop landing page and case studies, with client consent (F-21).

**Needs VPS access (owner)**
- `gzip_types` and `Cache-Control` for `/assets/` (F-04): the biggest single performance win.
- www → apex 301 (F-09).
- Real 404s after the build plugin ships (F-03).
- HSTS and security headers, `server_tokens off` (F-28).
- Chrome on the VPS for build-time pre-rendering (and for `/seo-audit`).

---

## 9. Open questions for the owner

1. **Address and IČO.** The footer, `/kontakt` and `/o-nas` already show **IČO 47 912 383** and **"Ulica Funduše 1165/26, Cabaj-Čápor 951 17"**, but the brief lists both as unknown. Are these correct and OK to use in structured data and a Google Business Profile? (mdfoto.sk shows the same IČO.) What is the DIČ?
2. **Service area.** `/kontakt` says "Slovensko (pracujeme remote, celá SR)". Is that the intended positioning, or should Nitra / Pezinok be targeted locally?
3. **Google Business Profile.** Does one exist? If yes, what is its URL?
4. **Search Console.** DNS has two `google-site-verification` TXT records. Who owns that property, and can access be shared? What do the Pages / Indexing reports show for the inner pages today?
5. **Analytics.** Is any analytics running outside the code (for example on the VPS)? Is a cookie-banner-free setup preferred?
6. **Facebook business page.** What is the URL of the page that holds the three recommendations? The site only links to `facebook.com/mario.doman`. Also: do Instagram or GitHub profiles exist for the icons?
7. **References.** Should `fotkynavyber.sk` be listed (it isn't in the confirmed reference list), and should mdfoto.sk and fotkynavyber.sk be labelled as DOMAN s.r.o.'s own projects?
8. **Services and claims.** Are "Mesačné reporty a sledovanie pozícií", "Preklad SK/EN", "Lokálne SEO (Google Business, mapy)" and the "Bezplatná 30-minútová konzultácia" real offers? What is the source of "68 % zákazníkov začína hľadanie online"?
9. **Founder.** May the JSON-LD state Mário Doman as founder? "Konateľka od 27. 09. 2014" refers to the company; when did the SiteLeveled studio start?
10. **Back-links.** Would clients agree to a "Web: SiteLeveled" footer credit? None of the 8 portfolio sites links back today.
11. **Blog.** Who will write articles, and how often? This decides whether `/blog` stays.

---

## 10. Method and limits

**Tools and versions:** Lighthouse 12.6.1 (production, mobile preset = Moto G Power profile with 150 ms RTT, 1.6 Mbps and 4× CPU slowdown, plus the desktop preset, `*/api/*` blocked); headless Chrome 155.0.8059.79 through Puppeteer from `server/node_modules` (Googlebot smartphone UA, `/api/` requests aborted); Unlighthouse CI 0.19.1 (run locally against `vite preview` with `server/unlighthouse.config.mjs`. Used for route discovery only: its performance scores are unthrottled local numbers and aren't reported); Vite 6.3.5 build; curl over HTTP/2; Node 24.13.0; DNS and TLS checks; the schema.org validator for the JSON-LD samples. Date: 2026-11-01, repository at `806df2a`.

**Process:**
1. Header and status probe of 32 production URLs at 1 request/s (`scripts/probe-headers.sh`).
2. A local build, confirmed byte-identical to production's `index.html` and asset hashes, served with `vite preview`. All rendered-DOM work (12 routes, two viewport passes, JS-disabled pass, screenshots) ran against it to keep load off production (`scripts/render.mjs`).
3. Link graph from the rendered DOM (`scripts/link-graph.mjs`).
4. 18 Lighthouse runs on production, one at a time with 5 s pauses (`scripts/lighthouse.sh`, `scripts/lh-summary.mjs`).
5. Bundle composition from a sourcemap build written to `raw/build-sourcemap/` (`scripts/bundle-composition.mjs`).
6. An Unlighthouse crawl of the local preview, to see which routes a crawler can discover by following links.
7. A raw-HTML check of the 8 portfolio sites for links back (`raw/client-backlinks/`).
8. Code reading for everything else.

**Housekeeping:** under WSL, Lighthouse's chrome-launcher wrote its 18 temporary Chrome profiles into the repository root as `C:\Users\…\lighthouse.*` folders. They were deleted after the runs, and `scripts/lighthouse.sh` now removes them itself.

**Hard rules kept:** no form was submitted and no `/api/*` URL was requested on the live site (blocked in Puppeteer and Lighthouse). `server/.env` was not opened. Nothing was committed, pushed or edited in tracked files. Everything is under `audit/seo/`.

**Not measured, and what it would take:**
- **CrUX / field Core Web Vitals:** the PageSpeed Insights API returned `429 quota exceeded` without a key. A small site may not have CrUX data anyway. *Needs:* a PSI/CrUX API key, or Search Console's Core Web Vitals report.
- **Indexed pages, brand SERP, rankings, competitors:** the only search tool available here is US-based and not Google. `site:siteleveled.com` returned nothing, which proves nothing about Google.sk. No Slovak competitors are named, to avoid guessing. *Needs:* Search Console access, a manual check on google.sk, and a keyword/rank tool for the queries in §6.1.
- **Backlinks:** no backlink index was available. Only the 8 portfolio sites were checked: none links to siteleveled.com in raw HTML, and `zuzu-photo.sk`, which renders client-side, has no credit after rendering either (35 links, none to SiteLeveled; `raw/client-backlinks/summary.txt`). *Needs:* Ahrefs, Semrush or Majestic, or Search Console → Links.
- **Facebook and LinkedIn NAP:** both require a login. Not checked.
- **How Google's renderer treats `opacity: 0` sections and the tall viewport** (F-13): simulated only. *Needs:* URL Inspection → "View tested page" in Search Console.

**Lab-data caveat:** all performance numbers come from this WSL machine and are indicative only. They are useful for comparing pages and spotting causes (compression, render delay), not as the numbers real visitors see. Field data should replace them once available.
