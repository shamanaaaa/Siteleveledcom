import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createServer } from 'vite';
const require = createRequire(import.meta.url);
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
let vite, routes, copy, metadata, errors;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true } });
  routes = await vite.ssrLoadModule('/src/app/i18n/routes.ts');
  copy = await vite.ssrLoadModule('/src/app/i18n/LocaleContext.tsx');
  await copy.loadMessages('en');
  metadata = await vite.ssrLoadModule('/src/app/seo/pages.ts');
  errors = await vite.ssrLoadModule('/src/app/i18n/errors.ts');
});
after(async () => vite?.close());

test('catalogue provides reciprocal routes, city identity, safe query and anchor handling', () => {
  for (const route of routes.ROUTES) {
    for (const locale of routes.LOCALES) {
      const url = routes.pathFor(route.id, locale, 'zuzu-photo');
      assert.equal(routes.localeForPath(url), locale);
      assert.equal(routes.routeMatch(url)?.route.id, route.id);
      assert.equal(routes.counterpart(url, locale === 'sk' ? 'en' : 'sk'), routes.pathFor(route.id, locale === 'sk' ? 'en' : 'sk', 'zuzu-photo'));
    }
  }
  const id = '11111111-1111-4111-8111-111111111111';
  assert.equal(routes.counterpart('/seo-audit/', 'en', `?audit=${id}&token=secret&utm_source=test`, '#unknown'), `/en/seo-audit/?audit=${id}`);
  assert.equal(routes.localizeLink('/#formular', 'en'), '/en/#formular');
  assert.equal(routes.counterpart('/o-nas/', 'en', '', '#unsupported'), '/en/about/');
  assert.equal(routes.localizeLink('/portfolio/', 'en'), '/en/portfolio/');
  assert.equal(routes.localizeLink('https://example.com', 'en'), 'https://example.com');
  assert.equal(routes.counterpart('/blog/', 'en'), '/en/');
  assert.equal(routes.counterpart('/en/city/missing/', 'sk'), '/');
});
test('URL language and ordered regional browser preferences are independent', () => {
  assert.equal(routes.localeForPath('/en/services/'), 'en');
  assert.equal(routes.localeForPath('/enough/'), 'sk');
  assert.equal(routes.preferredLocale(['de-DE', 'en-GB', 'sk-SK']), 'en');
  assert.equal(routes.preferredLocale(['sk-SK', 'en-US']), 'sk');
  assert.equal(routes.preferredLocale(['de-DE']), 'en');
  assert.equal(routes.preferredLocale(['en-US'], 'sk'), 'sk');
  assert.equal(routes.preferredLocale([], 'invalid'), 'en');
  // Czech visitors read Slovak: no English prompt on the Slovak site, and a stated preference still wins.
  assert.equal(routes.preferredLocale(['cs-CZ', 'en-US']), 'sk');
  assert.equal(routes.preferredLocale(['en-US', 'cs-CZ']), 'en');
  assert.equal(routes.preferredLocale(['cs-CZ'], 'en'), 'en');
});
test('missing or malformed browser language entries preserve fallback, preference order, and saved choices', () => {
  const unavailable = [undefined, null, '', 42, {}];
  assert.equal(routes.preferredLocale(unavailable), 'en');
  assert.equal(routes.preferredLocale([...unavailable, 'sk-SK', 'en-GB']), 'sk');
  assert.equal(routes.preferredLocale([...unavailable, 'en-US', 'sk-SK']), 'en');
  assert.equal(routes.preferredLocale(unavailable, 'sk'), 'sk');
});
test('message keys match, every literal translation call has a nonempty translation', () => {
  assert.deepEqual(Object.keys(copy.dictionaries.sk).sort(), Object.keys(copy.dictionaries.en).sort());
  for (const value of Object.values(copy.dictionaries.en)) assert.ok(value.trim());
  for (const {sk} of JSON.parse(fs.readFileSync("docs/english-copy/inventory.json", "utf8"))) assert.ok(copy.dictionaries.en[sk], `Missing English content: ${sk}`);
  const folders = ['src/app/pages', 'src/app/components/sections', 'src/app/components/layout', 'src/app/components/city', 'src/app/components/fx'];
  const missing = [];
  for (const folder of folders) for (const file of fs.readdirSync(folder).filter(f => f.endsWith('.tsx'))) {
    const ast = parser.parse(fs.readFileSync(path.join(folder, file), 'utf8'), { sourceType: 'module', plugins: ['typescript', 'jsx'] });
    traverse(ast, { CallExpression(p) {
      if (p.node.callee.name !== 'tr' || p.node.arguments[0]?.type !== 'StringLiteral') return;
      const key = p.node.arguments[0].value.replace(/\s+/g, ' ').trim();
      if (/[A-Za-z\u00c0-\u024f]/.test(key) && !copy.dictionaries.en[key]) missing.push(`${file}: ${key}`);
    } });
  }
  assert.deepEqual(missing, []);
  assert.equal(copy.translate('Povinné pole', 'en'), 'Required field');
  assert.equal(copy.translate('Povinné pole', 'sk'), 'Povinné pole');
  assert.equal(copy.translate('Customer input untouched', 'en'), 'Customer input untouched');
});
test('city data shown through tr(value) has English content', async () => {
  // These reach the page as variables, so the literal tr("...") scan above cannot see them.
  const { CLIENTS } = await vite.ssrLoadModule('/src/app/city/cityData.ts');
  const missing = [];
  for (const client of CLIENTS) {
    const shown = [client.category, client.result, client.challenge, client.solution, ...client.perks, client.testimonial?.text];
    for (const value of shown.filter(Boolean)) {
      const key = value.replace(/\s+/g, ' ').trim();
      if (!copy.dictionaries.en[key]) missing.push(`${client.id}: ${key}`);
    }
  }
  assert.deepEqual(missing, []);
});
test('legacy errors and stable error codes both display in the active language', () => {
  const failure = { error: 'Audit bol prerušený reštartom servera. Spustite ho prosím znova.' };
  assert.match(errors.errorMessage(failure, 'en', 'fallback'), /server restart/);
  assert.match(errors.errorMessage(failure, 'sk', 'fallback'), /reštartom/);
  assert.match(errors.errorMessage({ code: 'AUDIT_LIMIT', data: { waitMs: 3660000 } }, 'en', 'fallback'), /1 h 1 min/);
  assert.equal(errors.errorMessage({ error: 'private unknown error' }, 'en', 'Safe fallback'), 'Safe fallback');
});
test('built files have localized body, metadata, alternates, preloads, and sitemap coverage', () => {
  const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
  for (const page of metadata.PAGES) {
    const html = fs.readFileSync(path.join('dist', page.path, 'index.html'), 'utf8');
    assert.ok(html.includes(`<html lang="${page.locale}"`), page.path);
    assert.ok(html.includes(`<title>${page.title.replaceAll('&', '&amp;')}</title>`), page.path);
    assert.match(html, /rel="modulepreload"/);
    for (const src of html.match(/\/(?:images\/en\/)?[a-z-]+-preview(?:-720)?\.webp/g) || []) {
      assert.equal(src.startsWith('/images/en/'), page.locale === 'en', `${page.path}: screenshot language ${src}`);
      assert.ok(fs.existsSync(path.join('dist', src)), `Missing screenshot: ${src}`);
    }
    if (!page.robots) {
      assert.ok(html.includes(`rel="canonical" href="${metadata.SITE}${page.path}"`), page.path);
      assert.ok(sitemap.includes(metadata.SITE + page.path));
      assert.equal((html.match(/rel="alternate" hreflang=/g) || []).length, 3);
      assert.match(html, new RegExp(`hreflang="x-default" href="${metadata.SITE}/en/`), page.path);
      assert.match(html, /"@type":"WebPage"|"@type":"AboutPage"|"@type":"ContactPage"/);
    } else assert.ok(!sitemap.includes(metadata.SITE + page.path));
    if (page.locale === 'sk') assert.ok(!/rel="modulepreload" href="\/assets\/en-/.test(html), page.path);
    if (page.locale === 'en') {
      assert.match(html, /rel="modulepreload" href="\/assets\/en-/);
      assert.ok(!html.includes(`"image":"${metadata.SITE}/og/siteleveled.png"`), `Slovak schema image: ${page.path}`);
      assert.ok(!html.includes('to="/sluzby/"'));
      assert.ok(!html.includes('href="tel:'));
      assert.ok(!html.includes('0910 803 993'), `English phone promise: ${page.path}`);
      assert.ok(!html.includes('Návrh zadarmo'), page.path);
      const visible = html.slice(html.indexOf('<body')).replace(/<script[\s\S]*?<\/script>/g, '');
      assert.ok(!visible.includes('„'), `Slovak quote marks: ${page.path}`);
      const footer = visible.slice(visible.lastIndexOf('<footer'));
      assert.equal((footer.match(/href="mailto:/g) || []).length, 1, `Footer email rows: ${page.path}`);
    }
  }
  const home = fs.readFileSync('dist/en/index.html', 'utf8');
  const portfolio = fs.readFileSync('dist/en/portfolio/index.html', 'utf8');
  for (const preview of fs.readdirSync('public').filter(file => file.endsWith('-preview.webp'))) {
    const src = `/images/en/${preview}`;
    for (const html of [home, portfolio]) {
      assert.ok(html.includes(`src="${src}"`), `Missing English preview: ${src}`);
      assert.ok(html.includes(`${src.replace('.webp', '-720.webp')} 720w`), `Missing mobile English preview: ${src}`);
    }
  }
  assert.match(home, /Custom websites for your business/);
  assert.match(fs.readFileSync('dist/en/pricing/index.html', 'utf8'), /How much does a website cost\?/);
  assert.match(fs.readFileSync('dist/en/online-stores/index.html', 'utf8'), /How much does an online store cost\?/);
  assert.match(fs.readFileSync('dist/en/privacy/index.html', 'utf8'), /For personal data questions, email/);
  assert.ok(!fs.readFileSync('dist/en/privacy/index.html', 'utf8').includes('or email'));
  assert.match(home, /translated from Slovak/);
  assert.match(home, /design approval and receipt of/);
  const city = fs.readFileSync('dist/en/city/zuzu-photo/index.html', 'utf8');
  assert.match(city, /zuzu-photo.sk — SiteLeveled client city/);
  assert.match(city, /en-mesto-zuzu-photo.png/);
  assert.match(city, /noindex, follow/);
  assert.ok(!city.includes('hreflang='));
  assert.ok(!city.includes('application/ld+json'));
  assert.ok(fs.existsSync('dist/og/en-mesto-zuzu-photo.png'));
  assert.match(fs.readFileSync('dist/en/404.html', 'utf8'), /Page not found/);
  assert.match(fs.readFileSync('dist/en/privacy/index.html', 'utf8'), /siteleveled-language-dismissed/);
});
