# English version implementation plan

Created: 3 November 2026. Status: implemented and locally verified; production release and live smoke checks are pending.

Build an English version of SiteLeveled for international clients, using the existing React/Vite site. Work through the phases in order and mark tasks complete only when their acceptance checks pass. The English homepage establishes the copy direction; the first public release includes the complete customer journey described below.

## Direction and working defaults

- **Confirmed audience:** international clients. Use the existing small-business offer as the starting point for positioning.
- **Positioning:** custom websites and online stores, direct contact with the developer, a clear process and practical remote collaboration. Describe the real Slovak portfolio in English without implying previous international clients.
- **Structure:** preserve the existing Slovak URLs and add English pages under `/en/`. Share components and design, with separate language content.
- **Language selection:** the URL determines the language. Offer a visible SK / EN switch, remember an explicit choice, and use browser preferences for a dismissible suggestion. These defaults are now implemented.
- **Location:** country detection can be added later as a secondary suggestion signal. Version one needs no IP lookup service or forced location redirects.
- **Commercial baseline:** draft from the current repo offers: websites from €300, online stores from €1,000, a manual SEO audit at €199 and maintenance from €30/month. Use EUR and international phone formatting. The owner confirmed these prices, payment terms, and no-VAT wording for international work during implementation.
- **Content:** write natural English for businesses hiring remotely. Explain briefs, feedback, approvals and handover using the actual working process. Preserve verified qualifications on delivery times and scope.

## Release scope and URLs

Use stable page IDs to connect these counterparts. The following is the planned URL map; implementation should put it in one shared route catalogue.

| Page ID | Existing Slovak URL | Planned English URL |
| --- | --- | --- |
| home | `/` | `/en/` |
| services | `/sluzby/` | `/en/services/` |
| onlineStores | `/tvorba-eshopu/` | `/en/online-stores/` |
| pricing | `/cennik/` | `/en/pricing/` |
| portfolio | `/portfolio/` | `/en/portfolio/` |
| process | `/proces/` | `/en/process/` |
| about | `/o-nas/` | `/en/about/` |
| contact | `/kontakt/` | `/en/contact/` |
| seoAudit | `/seo-audit/` | `/en/seo-audit/` |
| privacy | `/ochrana-osobnych-udajov/` | `/en/privacy/` |
| cityClient | `/mesto/:slug/` | `/en/city/:slug/` |

Both languages also need a localized not-found experience. City links remain share pages with the existing `noindex` policy. The owner audit admin stays at `/seo-audit/admin/`; translating the admin is outside this release. The current blog contains placeholders and stays outside the English release until real articles exist. For a Slovak page without a translated counterpart, label any English-home link clearly instead of presenting it as an equivalent translation.

## Language-selection contract

1. `/en/` and its child pages render English on the server/build and in the browser. Existing Slovak URLs render Slovak, regardless of location, browser settings or a saved preference.
2. The switch links to the equivalent page. On a city share page, retain the selected client. Preserve supported anchors and meaningful supported query parameters; avoid copying query strings indiscriminately.
3. Switching language saves an explicit preference and keeps subsequent navigation in the selected language. Returning through a specific language URL still respects that URL.
4. After hydration, a saved preference can suggest the other version. Without a saved choice, normalize regional browser tags such as `en-US`, `en-GB` and `sk-SK` to their supported base language and use the first supported language in preference order. If neither `sk` nor `en` matches, suggest English on Slovak pages as the international fallback. Do not redirect automatically.
5. Make the suggestion dismissible and remember dismissal for the session. An English browser must never receive an initial Slovak render at an English URL.
6. If browser preferences or storage are unavailable, the page and switch still work. Document any new preference/session storage in both privacy pages.

## Phase 1 — establish the English copy direction

- [x] Inventory customer-facing text in pages, shared sections, navigation, footer, city panels, images, forms, email templates and audit responses.
- [x] Draft the English homepage first: hero, offer, process, portfolio context, testimonials, FAQs and primary CTA. Keep a reviewable copy draft under `docs/english-copy/` before integrating it.
- [x] Use consistent terms: “website”, “online store”, “free design proposal”, “quote” and “maintenance”. Choose one spelling convention and use it consistently.
- [x] Explain the existing Slovak projects through their actual business needs and delivered features. Label translated testimonials; preserve authors, meaning and source attribution. Add no unverified performance figures.
- [x] Record remaining owner inputs once, alongside the draft: international pricing/payment terms; actual English communication channels and availability; remote review/handover process; and appropriate international invoicing wording.
- [x] Carry supported existing offers into the draft with their scope and conditions. In particular, delivery times must retain the dependency on design approval and supplied materials.

**Acceptance:** there is one coherent homepage draft, a terminology list and a short list of unresolved factual inputs. Owner feedback can be incorporated while independent implementation continues; unresolved facts stay out of publication copy.

## Phase 2 — add shared locale and route foundations

- [x] Add a small typed localization layer, for example `src/app/i18n/`, containing the locale type, SK/EN dictionaries, content types, URL helpers and locale context. Keep shared components rather than duplicating whole pages.
- [x] Add one environment-independent route catalogue with stable page IDs and locale paths. Use it for counterpart lookup, links and metadata coverage.
- [x] Derive locale from the matched URL during prerender and initial hydration. Keep `window`, `navigator` and browser-storage reads out of server rendering; load the suggestion only after hydration.
- [x] Extract the original Slovak text before replacing component literals, so the Slovak version remains complete. Add checks for matching dictionary keys and required translated content.
- [x] Extend the React routes and page metadata together so builds remain valid while pages are migrated.
- [x] Update both route-parsing sections in `scripts/seoPages.ts`: metadata coverage and lazy-chunk preload discovery currently depend on regexes over literal route definitions. A nested or generated route tree needs explicit build support.
- [x] Keep lazy page loading and generate the required HTML files for every added route. English routes must work on direct requests, not just client-side navigation.

**Acceptance:** both homepages build and render in their URL language; direct reload works; there are no hydration warnings; missing translation coverage is detectable; all existing Slovak routes still build.

## Phase 3 — translate pages and complete navigation

- [x] Integrate the English homepage draft, then translate services, online stores, pricing, portfolio, process, about, contact and privacy.
- [x] Add the accessible SK / EN switch to desktop and mobile navigation. Implement the suggestion and remembered-choice behavior above.
- [x] Convert logo, navbar, footer, cards, inline links and all CTA destinations to locale-aware helpers. Keep stable section IDs where useful and route homepage anchors to the correct locale homepage.
- [x] Translate labels, placeholders, validation, loading/success/error states, accessibility labels, image alternatives and screen-reader text. Format prices and dates for the active language.
- [x] Show phone numbers with `+421`; communicate real business availability with a named time zone where relevant. Explain remote collaboration without promising unconfirmed round-the-clock availability or new tools.
- [x] Localize the city client descriptions, panels, hotspot labels, construction text and sharing controls. Retain shared client IDs, assets and geometry.
- [x] Update `PixelCity`, `CityPanel` and `Layout` so opening, closing, sharing or switching a building retains the language and selected client. Closing a building returns to that language's homepage without unnecessary remounts or scroll resets.
- [x] Add an English not-found page with working English navigation. Keep English navigation free of links to untranslated placeholder pages.

**Acceptance:** a visitor can explore the full English site and reach a form without unexpectedly switching to Slovak. Desktop/mobile layouts, city interactions, keyboard navigation and reduced-motion behavior remain usable in both languages.

## Phase 4 — localize forms, emails and the public audit

- [x] Add a validated `sk | en` locale to form submissions to `/api/navrh`; default older/missing-locale requests to Slovak. Keep the shared API endpoint.
- [x] Separate translated option labels from submitted field values. Preserve or map the current values and `source` discriminator so existing Slovak forms and older open tabs keep working.
- [x] Translate customer confirmation subjects, email bodies, HTML language and links. Include the inquiry language in the owner's notification; the owner template can remain Slovak.
- [x] Return stable error codes and interpolation data for public errors, with localized display text. Preserve compatibility while frontend and backend changes are rolled out.
- [x] Translate the public SEO audit controls, results labels, polling states, elapsed/wait times, validation, access-code errors, limits, busy states, expiry and failure messages.
- [x] Handle historical persisted audit errors. Audit jobs can be reused across visitors, so localize at response/display time using codes; do not assign one visitor's language to a shared job.
- [x] Update both privacy pages to describe new remembered-language/dismissal storage and any actual processing changes. Keep claims consistent with the implemented behavior.
- [x] Verify email rendering through fixtures or a stub mail transport. Exercise audit failures with fixtures instead of relying on expensive live scans for every state.

**Acceptance:** English submissions receive English customer messages; Slovak submissions retain Slovak messages; legacy submissions still work; both languages can view the same reused audit job correctly. Success and failure paths are covered without sending real customer emails during automated checks.

## Phase 5 — finish generated HTML, search and sharing

- [x] Extend the metadata model with page identity and locale. Supply translated titles, descriptions, breadcrumb labels and page-specific structured data.
- [x] Generate the correct HTML `lang`, Open Graph locale and social metadata for each language. English pages must contain meaningful English content before JavaScript runs.
- [x] Give each indexable page its own canonical URL. Add reciprocal `hreflang="sk"` and `hreflang="en"` links only between real indexable equivalents, including self-references, plus `hreflang="x-default"` pointing to the English page. There is no neutral language-selector page in this release; `x-default` can be omitted.
- [x] Add English indexable URLs to the sitemap. Preserve existing `noindex` rules for city sharing, admin and placeholder blog pages; API responses keep their current exclusion policy.
- [x] Localize JSON-LD descriptions, language values and service/page links while keeping the organization's identity stable. Add service-area or contact-language claims only when supported.
- [x] Update `applyHead` so client navigation and language switching maintain correct `lang`, metadata, alternate links and structured data, removing stale values from the previous page.
- [x] Extend `scripts/cityPages.ts` and the renderer in `src/app/city/og.ts` for English city share files and images. Some share-image text is painted into PNGs and needs translation too.
- [x] Preserve build-plugin ordering and ensure city files use a correctly localized template. Check that city share pages retain their own metadata after hydration.
- [ ] Verify production static-server behavior for English paths, trailing slashes and errors. The deployed nginx configuration is outside the tracked source shown here; locate and review it during implementation. The Express production fallback also needs explicit English/404 handling if used as the web server.

**Acceptance:** every intended English URL has a built HTML file with correct content and metadata. Static HTML and client navigation agree. Known city links share English previews; unknown English URLs return an English error document with HTTP 404 under production serving.

## Phase 6 — verify and release

- [x] Add focused automated checks for route counterparts, locale resolution, regional browser-language tags, dictionary coverage, locale-aware links and generated HTML/head metadata. Choose the runner during implementation; the repo currently has no test script.
- [x] Cover the backend contract: missing/invalid locale, stable form values, localized confirmations, public error codes and reused audit jobs in both languages.
- [x] Exercise browser journeys at desktop and mobile sizes: direct entry, navigation, switching, suggestion dismissal, unavailable storage, city sharing, form success/failure and unknown routes.
- [x] Compare the existing Slovak pages with the baseline. Check key layout widths and translated text wrapping, accessibility, reduced motion, initial render and lazy loading. Investigate material performance regressions with the existing SEO audit tooling.
- [x] Run `npm run build`. Inspect generated route files, sitemap, canonicals, alternates and social previews. Verify real HTTP status codes under production-like serving; the Vite SPA preview alone cannot prove production 404 behavior.
- [x] Resolve factual dependencies that affect launch copy and complete an English copy review. Confirm all customer-facing emails and errors are included.
- [x] Prepare a frontend/backend deployment sequence that preserves old request handling. Retain a known-good build and record how to revert both parts if required.
- [ ] Deploy through the project's actual release process when implementation and release are authorized, then smoke-check representative Slovak/English pages, forms, city previews and 404s. Submit/check the updated sitemap in Search Console when access is available.

**Acceptance:** all release-scope journeys pass in both languages, the build passes, generated pages are discoverable and production smoke checks pass. Mark the implementation complete only after recording the verification and any remaining follow-up items.

## Implementation record — 3 November 2026

The shared SK/EN implementation, copy review, backend compatibility, generated HTML, metadata, localized city images, and local verification are recorded in [release verification and deployment](english-version-release.md). Owner decisions are recorded in [the homepage copy draft](english-copy/homepage.md). Existing Slovak content was compared with a preserved HEAD build; intentional differences are the language controls, international phone formatting, privacy storage disclosure/date, and meaningful prerendered city share content.

All eight portfolio screenshots also have English in-image text, with separate desktop/mobile WebP variants selected on English pages and city dialogs. The original Slovak assets remain available for Slovak URLs. The translation prompts and asset inventory are recorded in [image localization](english-copy/image-localization.json).

The two unchecked release tasks remain open because this checkout does not contain the actual VPS nginx vhost or deployment/service process. Express production behavior has been verified with real HTTP statuses. The nginx merge instructions, compatible backend-first deployment sequence, rollback procedure, and live smoke checks are prepared in the release document. No live release or Search Console submission has been performed. The phase 6 release acceptance is therefore pending, even though local implementation checks pass.

## Suggested implementation checkpoints

Keep each checkpoint reviewable and buildable; these are work units, not a requirement to deploy partial English pages.

1. English homepage copy draft, terminology and factual inputs.
2. Shared locale/routes foundation, Slovak extraction and compatible build changes.
3. English homepage, navigation and language selection.
4. Remaining English content, city interactions and share generation.
5. Forms, customer emails and audit localization with backward compatibility.
6. Complete SEO metadata, verification and release preparation.

## Repository entry points

| Area | Current source |
| --- | --- |
| Routes and initial rendering | [routes.ts](../src/app/routes.ts), [main.tsx](../src/main.tsx), [entry-prerender.tsx](../src/entry-prerender.tsx) |
| Layout and navigation | [Layout.tsx](../src/app/components/layout/Layout.tsx), [Navbar.tsx](../src/app/components/layout/Navbar.tsx), [Footer.tsx](../src/app/components/layout/Footer.tsx) |
| Page content | [pages](../src/app/pages), [homepage sections](../src/app/components/sections) |
| Metadata and HTML generation | [pages.ts](../src/app/seo/pages.ts), [head.ts](../src/app/seo/head.ts), [seoPages.ts](../scripts/seoPages.ts), [index.html](../index.html) |
| City experience and previews | [PixelCity.tsx](../src/app/components/city/PixelCity.tsx), [CityPanel.tsx](../src/app/components/city/CityPanel.tsx), [cityData.ts](../src/app/city/cityData.ts), [cityPages.ts](../scripts/cityPages.ts), [og.ts](../src/app/city/og.ts) |
| Forms and customer emails | [LeadFormSection.tsx](../src/app/components/sections/LeadFormSection.tsx), [ContactPage.tsx](../src/app/pages/ContactPage.tsx), [server/index.js](../server/index.js) |
| Public SEO audit | [SeoAuditPage.tsx](../src/app/pages/SeoAuditPage.tsx), [server/seoAudit.js](../server/seoAudit.js) |
| Privacy and prior checks | [PrivacyPage.tsx](../src/app/pages/PrivacyPage.tsx), [SEO audit report](../audit/seo/REPORT.md) |

The existing code is evidence of current behavior and copy, not confirmation that every commercial claim applies to international work. Check it again when implementation starts.

## Reference guidance

- [Google: managing multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) — separate language URLs, visible switching and avoiding automatic language redirects.
- [Google: localized page versions](https://developers.google.com/search/docs/specialty/international/localized-versions) — reciprocal language annotations for equivalent pages.
- [MDN: browser language preferences](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages) — ordered preferences for the post-hydration suggestion.
- [Cloudflare: IP geolocation](https://developers.cloudflare.com/network/ip-geolocation/) — an optional future country signal if a compatible hosting setup is chosen.
