# English release verification and deployment

Implementation date: 3 November 2026. Local implementation is complete; live verification follows the first deploy. **A push to `main` deploys to production:** `.github/workflows/deploy.yml` runs `/usr/local/bin/deploy-siteleveledcom.sh` on the VPS, which builds there and restarts Express. The script and the nginx vhost live on the VPS, not in this repository. The prior production configuration is described in `audit/seo/REPORT.md`; that report is not a current vhost dump.

## Content decisions

The owner confirmed in this session:

- Existing prices, no-deposit/payment-after-launch terms, and no-VAT wording apply internationally: websites from €300, stores from €1,000, manual audit €199, maintenance from €30/month. DOMAN s.r.o. is not a VAT payer. It is registered under section 7a only (since 22 April 2015, IČ DPH SK2024140217), so the site must not say "not VAT registered".
- English contact is by email only, with no phone-call or fixed reply-time promise. English telephone CTAs now lead to email; Slovak phone numbers use +421.
- Email brief and feedback, design/copy approval, preview URL, testing, launch, and access details by email.
- Seven/fourteen-day development descriptions retain design-approval and supplied-material dependencies. English copy does not promise a fixed proposal/reply deadline.

The reviewable homepage draft, terminology, original text inventory, and owner decisions are in `docs/english-copy/`. Projects remain identified as Slovak businesses; translated Facebook recommendations retain authors and source labels.

English portfolio screenshots use translated in-image text from `public/images/en/`, with 1200 px and 720 px WebP variants. The homepage portfolio, portfolio page, online-store reference, and city dialogs select the screenshot language from the URL locale. Original Slovak screenshots remain in `public/`; portrait photos, icons, and already-English stock photos are shared. These are localized portfolio previews, not a claim that every linked client website offers an English version. The image prompts and asset inventory are recorded in [image-localization.json](english-copy/image-localization.json). Builds reject missing English variants, and the generated-HTML and browser checks verify the selected image language.

NOSEK RST uses the owner-provided original English screenshot, preserved at `docs/english-copy/assets/nosekrst-original-en.png`, with 1200 × 624 and 720 × 374 WebP exports. Its original wording, background photo, and full framing are preserved.

Image-load checks at 1440 px and 390 px verified that all eight homepage/portfolio previews and the online-store reference decode successfully, select the 1200 px or 720 px resource as appropriate, and introduce no horizontal overflow. The 16 localized WebP files total 815,448 bytes. Local visual checks are saved at `/tmp/siteleveled-english-portfolio-1440.png` and `/tmp/siteleveled-english-portfolio-390.png`.

Homepage stack cards preserve each screenshot's natural aspect ratio instead of clipping it to a fixed height. Explicit image dimensions reserve space before lazy loading. Browser checks cover all eight preview proportions on desktop and mobile; the reported nosekrst.sk card was also checked with normal motion at 1503 px and 390 px, including its full bottom statistics row. Visual checks are saved at `/tmp/siteleveled-nosekrst-card-1503.png` and `/tmp/siteleveled-nosekrst-card-390.png`.

## Local verification

Run from the repository root after both dependency sets are available:

```sh
npm run build
npm test
npm run test:browser
```

`npm test` uses Node's test runner. Backend tests import the application with a temporary audit directory, fixture results, fake DNS, and an in-memory mail transport. No customer email is sent and no live audit is started. Browser checks use the existing Puppeteer/Chrome installation under `server/node_modules`, an ephemeral production Express server, intercepted API responses, and temporary browser profiles. These checks require permission to bind loopback ports and launch Chrome in restricted environments.

Verified locally: `npm run build` passed, all 13 Node tests passed, and `npm run test:browser` passed. The build emits 34 HTML documents (16 English) and 20 indexable sitemap URLs.

Coverage includes URL language, regional browser preferences, reciprocal route mapping, supported audit query/anchor retention, translation coverage, English static content, lazy preloads, head metadata, sitemap/noindex rules, localized historical audit failures, reuse of one job in both languages, form validation and transport failure, both confirmation templates and legacy submissions, escaped customer content, real 404 statuses, mobile navigation, reduced motion, denied storage, city canvas/anchor/scroll preservation, and English content with JavaScript disabled.

Browser-preference regression checks cover missing and empty values, getters that throw, the English fallback suggestion on Slovak pages, and working manual language switching. The locale helper also skips malformed entries while preserving supported-language order and saved choices. The missing-value unit and browser checks were confirmed to fail before the fallback fix.

Browser screenshots are temporary QA artifacts at `/tmp/siteleveled-english-desktop.png` and `/tmp/siteleveled-english-mobile.png`. The prior HEAD source and generated build were retained at `/tmp/siteleveled-baseline/` for text/layout/performance comparison. These temporary files are not durable production rollback backups.

## Fixes after validation (4 November 2026)

An independent review of the rendered English site found defects the original checks could not see. All of the following are fixed locally and covered by tests where a test is practical:

- Joined headings now read correctly ("How much does a website cost?", "Online store or website?").
- City perks that reach the page as data are translated. A new test walks the city data, because the literal `tr("...")` scan cannot see values passed as variables.
- English is email only throughout: no phone icon beside an email address, one footer email row, and a corrected privacy sentence. Slovak pages keep the phone.
- Layer labels no longer clip or overlap on 320 px phones. Home portfolio quotes use English quote marks. English prices lead with the euro sign.
- The SK/EN links' accessible names now contain their visible text, and the lead form announces send failures.
- `hreflang="x-default"` points to the English page. Czech browser preferences now map to Slovak, so Czech visitors are not offered English on the Slovak site.
- Copy and titles: pricing and portfolio page titles, an unattributed quote, redundant or inconsistent wording, and a clearer time zone.

Portfolio previews:

- Spring now uses its original photograph, wall sign, and logo subtitle. Interface text stays translated.
- The SaniFIX label reads "CONTRACT PARTNER", matching the original "ZMLUVNÝ PARTNER", instead of the generated "AUTHORIZED PARTNER". It was re-typeset in the live site's font.
- The fotkynavyber preview is cropped to 980 px to remove a garbled partial row.
- Alt text says "Preview of", and the home, portfolio, online-store, and city views state that preview text is translated. NOSEK RST is an original English screenshot, so its city dialog has no such note.

A before/after comparison of all 18 Slovak HTML documents found identical visible text. The only differences are the SK/EN accessible names and the added `x-default` link.

## Colour contrast (4 November 2026, applies to both languages)

The owner asked for the contrast failures to be fixed site-wide. An axe-core scan of 107 page and state combinations went from 121 distinct failures to none:

- Solid purple backgrounds with white text use `#665DFA` (was `#6C63FF`, 4.3:1). Their hover states go darker to `#5b53e8` instead of lighter.
- Muted text and placeholders use at least `/50` opacity on `#F5F5F0`. Do not go below that tier for text.
- Small purple text on cards uses `#8F87FF` or `#9F97FF`. `#6C63FF` remains for icons, borders, large headings, and logos.
- Links inside running text are underlined.
- Portfolio badges use a dark pill, so they stay readable on any screenshot.

`npm run test:browser` now fails if a page in either language regresses. Text inside the decorative layer illustration on the home page is intentionally exempt, as an incidental part of a picture, and axe does not flag it.

## Performance and Slovak baseline comparison

The English dictionary is a separate lazy chunk, preloaded only by English HTML (about 26 kB gzipped). The shared entry grows from about 128 to 135 kB gzipped; Slovak visitors do not download the English catalogue. Lazy page chunks remain separate.

Local Lighthouse comparisons used gzip, devtools throttling, the existing Chrome/Lighthouse tools, and blocked API requests. Three baseline, two SK, and three EN home runs are recorded in [performance.json](english-copy/performance.json). LCP ranges: baseline 1.95–2.12 s, SK 1.97–2.01 s, EN 2.05–2.34 s. All measured SEO scores were 100 and accessibility 96, matching baseline; the existing contrast issue remains. Blocking time varied substantially (baseline 327–597 ms, EN 363–927 ms). A follow-up pair measured EN 363 ms vs baseline 327 ms; the larger result was not repeated. English adds translated content and download weight; production/field performance should still be monitored after deployment. These are local lab observations, not visitor performance claims.

The baseline source revision is `602debb5d68cf0ef6f6695d2b174d0eed2485b2d`. The visible Slovak text matches the preserved baseline except for +421 phone formatting, language controls, and the deliberate privacy disclosure/date update. Previously empty city share HTML now includes meaningful Slovak or English homepage content. The known-good baseline build archive is `/tmp/siteleveled-before-english-build.tar.gz` (SHA-256 `b1f76a70e0b9bf212969eeee40fbb6deba13b8e71bb71db1813b3e0f76742ecc`). Copy durable production rollback artifacts before deployment; `/tmp` is temporary.

## nginx change to review on the actual VPS

Obtain the actual vhost with the project's normal administrative access. Preserve its existing TLS, compression, cache, API proxy, and logging settings. Merge these static-serving/error rules into the appropriate server block, avoiding conflicting existing locations:

```nginx
location = /en { return 301 /en/; }

location /en/ {
    try_files $uri $uri/ =404;
    error_page 404 /en/404.html;
}
location = /en/404.html { internal; }

location / {
    try_files $uri $uri/ =404;
    error_page 404 /404.html;
}
location = /404.html { internal; }
```

The site root must be the completed `dist/` directory. `/api/` must continue to proxy to Express and preserve `X-Robots-Tag`; never serve an SPA fallback for arbitrary frontend paths. nginx error_page without an `=200` override preserves HTTP 404. Validate with `nginx -t` before the usual reload. English known routes with and without trailing slashes must resolve to their own HTML; unknown `/en/...` routes must return the English error document and HTTP 404. Express production serving implements the same localized 404 behavior when used directly.

The exact live vhost could not be inspected here, so nginx-specific acceptance remains a deployment prerequisite. The checked Express behavior does not prove the live nginx configuration.

## Deployment order

Backend and frontend ship together in one deploy, so there is no separate staging step. Dependencies are unchanged.

1. Before the push, record the deployed revision and save the active nginx vhost.
2. Merge to `main` and push. This is the deploy. Watch the GitHub Action, then confirm the VPS build finished and `dist/en/` is new. The backend needs about 7 seconds to listen after the restart, and the forms show a fallback message during that window.
3. Merge and validate the nginx rules above, then reload through the existing process. Until then, unknown `/en/` paths show the Slovak 404 page.
4. Smoke-check the URLs below and verify one controlled SK and EN confirmation using an owner-controlled test address. Check city sharing on a social debugger. This last mail check is manual; automated checks never send real mail.
5. Submit/check `https://siteleveled.com/sitemap.xml` in Search Console when authorized access is available.

Representative live checks: `/`, `/sluzby/`, `/kontakt/`, `/en/`, `/en/services`, `/en/contact/`, `/en/seo-audit/`, `/en/city/zuzu-photo/`, and an unknown path in each language. Confirm HTTP statuses, initial content/lang, canonical/alternates, title/description/schema after navigation, city preview images, forms, and audit polling. Blog/admin/city routes must remain excluded from the sitemap; public indexable counterpart pages must have reciprocal SK/EN alternates.

## Rollback

Revert the release commit on `main` and push; the same Action redeploys the previous code. Restore the saved vhost if it was changed, validate, and reload. The old frontend remains compatible with the new backend while rolling back, because locale is optional and old values are preserved. Do not delete inquiry mail, persisted audit jobs, or runtime configuration.

## Remaining release work

- Inspect the actual nginx vhost and merge the English 404 rules.
- Record the deployed revision after the push to `main`.
- Perform live HTTP, email, city-preview, and public-audit smoke checks.
- Check the sitemap in Search Console when access is available.

No nginx edit, real mail send, live SEO scan, or Search Console submission has been performed by this implementation.
