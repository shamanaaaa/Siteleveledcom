
  # Webová stránka pre Site Leveled

  This is a code bundle for Webová stránka pre Site Leveled. The original project is available at https://www.figma.com/design/4fWzkVbbEGA7lQuiYKdCuc/Webov%C3%A1-str%C3%A1nka-pre-Site-Leveled.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Development plans

  [English version implementation plan](docs/english-version-plan.md) — international copy, language selection, routing, SEO, forms, verification and release checklist.

  English routes live under `/en/`; the URL determines the rendered language. See [release verification and deployment](docs/english-version-release.md) for copy decisions, local checks, nginx requirements, deployment order, and rollback.

  Run `npm run build`, `npm test`, and `npm run test:browser` to verify the bilingual build. Browser checks use the existing Puppeteer/Chrome installation from the server dependency set and never send real mail or run live audits.
