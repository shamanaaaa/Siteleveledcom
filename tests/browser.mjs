// Local browser journeys against the production Express server; all form/audit traffic is stubbed.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const require = createRequire(path.resolve('server/package.json'));
const puppeteer = require('puppeteer');
const auditDir = fs.mkdtempSync(path.join(os.tmpdir(), 'siteleveled-browser-audits-'));
process.env.NODE_ENV = 'production';
process.env.SEO_AUDIT_DIR = auditDir;
const { app } = require('./index.js');
const server = app.listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
// Before React takes over, a form without a method would send its fields as a GET into the URL
for (const [route, form] of [['/', 'lead-form'], ['/kontakt/', 'contact-form'], ['/seo-audit/', 'audit-form'], ['/en/', 'lead-form']]) {
  const html = await (await fetch(base + route)).text();
  const formHtml = html.slice(html.indexOf(`id="${form}"`));
  const button = formHtml.match(/<button[^>]*type="submit"[^>]*>/)?.[0] || '';
  assert.match(button, /\sdisabled(=""|\s|>)/, `${route} #${form}: pre-rendered submit button must be disabled`);
}
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const failures = [];
const submitted = [];
let formMode = 'success', auditMode = 'start';
const jobId = '11111111-1111-4111-8111-111111111111';
async function newPage(width = 1440, preferences = { languages: ['en-GB', 'sk-SK'], language: 'en-GB' }, context = browser) {
  const page = await context.newPage();
  await page.setViewport({ width, height: 1000, isMobile: width < 768, hasTouch: width < 768 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.evaluateOnNewDocument(preferences => {
    for (const key of ['languages', 'language']) Object.defineProperty(navigator, key, { get() {
      if (preferences.throws) throw new Error('Browser language preferences unavailable');
      return preferences[key];
    } });
  }, preferences);
  page.on('pageerror', error => failures.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && /hydration|Minified React|did not match|server HTML/i.test(message.text())) failures.push(message.text()); });
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = new URL(request.url());
    if (!url.pathname.startsWith('/api/')) return request.continue();
    const respond = (body, status = 200) => request.respond({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (url.pathname === '/api/navrh') {
      submitted.push(JSON.parse(request.postData()));
      return formMode === 'success' ? respond({ ok: true }) : respond({ code: 'MAIL_FAILED', error: 'Odoslanie emailu zlyhalo.' }, 500);
    }
    if (url.pathname.endsWith('/config')) return respond({ requiresCode: true, maxPages: 15, dailyLimit: 1, retentionDays: 30 });
    if (request.method() === 'POST') {
      if (auditMode === 'limit') return respond({ code: 'AUDIT_LIMIT', error: 'Denný limit auditov', data: { waitMs: 3600000 } }, 429);
      if (auditMode === 'busy') return respond({ code: 'AUDIT_BUSY', error: 'Práve prebieha veľa auditov. Skúste to o pár minút.' }, 503);
      if (auditMode === 'access') return respond({ code: 'AUDIT_ACCESS', error: 'Nesprávny prístupový kód.' }, 403);
      return respond({ id: jobId, site: 'https://example.test', status: 'queued', position: 2, startedAt: null });
    }
    if (auditMode === 'timeout') return respond({ id: jobId, site: 'https://example.test', status: 'failed', code: 'AUDIT_TIMEOUT', error: 'Audit trval príliš dlho a bol zastavený. Skúste to prosím neskôr.', startedAt: null });
    if (auditMode === 'done') return respond({ id: jobId, site: 'https://example.test', status: 'done', startedAt: null, reportUrl: '/api/seo-audit/report/fixture/', result: { categories: { seo: 90, performance: 80, accessibility: 95, 'best-practices': 100 }, metrics: {}, pages: [{ path: '/', categories: { seo: 90, performance: 80, accessibility: 95, 'best-practices': 100 } }] } });
    return respond({ code: 'AUDIT_EXPIRED', error: 'Audit sa nenašiel alebo už vypršal.' }, 404);
  });
  return page;
}
async function ready(page, route) {
  const response = await page.goto(base + route, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => !!document.querySelector('main'));
  return response;
}
async function clickLink(page, href) {
  await page.waitForSelector(`a[href="${href}"]`);
  await page.$eval(`a[href="${href}"]`, el => el.click());
  await page.waitForFunction(href => location.pathname + location.search + location.hash === href, {}, href);
  await page.waitForNetworkIdle();
}
async function text(page) { return page.$eval('body', el => el.innerText); }
async function checkHomePreviewProportions(page) {
  const previews = await page.$$eval('#portfolio img', async images => {
    images.forEach(image => { image.loading = 'eager'; });
    await Promise.all(images.map(image => image.decode()));
    return Promise.all(images.map(async image => {
      // naturalWidth/naturalHeight are rounded after srcset density correction.
      const bitmap = await createImageBitmap(await (await fetch(image.currentSrc)).blob());
      const naturalRatio = bitmap.width / bitmap.height;
      bitmap.close();
      const box = image.getBoundingClientRect();
      const card = image.closest('article').getBoundingClientRect();
      return { src: image.currentSrc, displayedRatio: box.width / box.height, naturalRatio, clippedByCard: box.bottom > card.bottom + 1 };
    }));
  });
  assert.equal(previews.length, 8);
  for (const preview of previews) {
    assert.ok(Math.abs(preview.displayedRatio - preview.naturalRatio) < 0.005, `Cropped screenshot: ${preview.src}`);
    assert.equal(preview.clippedByCard, false, `Screenshot exceeds its card: ${preview.src}`);
  }
}
async function submitContact(page) {
  await page.type('#contact-name', 'Alex Example');
  await page.type('#contact-company', 'Example Co');
  await page.type('#contact-email', 'alex@example.test');
  await page.click('button[aria-pressed="false"]');
  await page.$eval('#contact-form button[type="submit"]', el => el.click());
}
async function checkContrast() {
  // Measures every page in both languages: text and placeholders must stay readable, and links inside text must not rely on colour alone.
  const axe = require.resolve('axe-core/axe.min.js');
  const routes = ['/en/', '/en/services/', '/en/online-stores/', '/en/pricing/', '/en/portfolio/', '/en/process/', '/en/about/', '/en/contact/', '/en/seo-audit/', '/en/privacy/', '/en/city/springnitra/', '/', '/sluzby/', '/tvorba-eshopu/', '/cennik/', '/portfolio/', '/proces/', '/o-nas/', '/kontakt/', '/seo-audit/', '/ochrana-osobnych-udajov/', '/blog/', '/blog/kolko-stoji-webstranka/', '/blog/eshop-alebo-web/'];
  const problems = [];
  for (const width of [1440, 390]) {
    const context = await browser.createBrowserContext();
    const page = await newPage(width, undefined, context);
    for (const route of routes) {
      await ready(page, route);
      await page.$$eval('main button[aria-expanded="false"]', buttons => buttons.forEach(button => button.click()));
      await page.addScriptTag({ path: axe });
      const found = await page.evaluate(async () => {
        const result = await window.axe.run(document, { runOnly: ['color-contrast', 'link-in-text-block'], resultTypes: ['violations'] });
        const placeholders = [...document.querySelectorAll('input[placeholder], textarea[placeholder]')].filter(field => {
          const alpha = getComputedStyle(field, '::placeholder').color.match(/[\d.]+/g)[3];
          return alpha !== undefined && Number(alpha) < 0.5;
        }).map(field => `placeholder ${field.id || field.name}`);
        return [...result.violations.flatMap(rule => rule.nodes.map(node => `${rule.id}: ${node.target[0]}`)), ...placeholders];
      });
      problems.push(...found.map(problem => `${route} @${width}: ${problem}`));
    }
    await context.close();
  }
  assert.deepEqual(problems, []);
}
async function checkUnavailableBrowserPreferences() {
  // Optional browser preferences must never replace the page with a router error.
  for (const [scenario, preferences] of [
    ['missing', {}],
    ['empty', { languages: [], language: '' }],
    ['throwing', { throws: true }],
  ]) {
    const context = await browser.createBrowserContext();
    try {
      const unavailable = await newPage(390, preferences, context);
      await unavailable.goto(base + '/en/', { waitUntil: 'networkidle0' });
      assert.ok(await unavailable.$('main'), `${scenario} preferences: English page must remain usable`);
      assert.match(await text(unavailable), /Custom websites for your business/);
      assert.equal(await unavailable.$eval('html', el => el.lang), 'en');
      assert.equal(await unavailable.$('aside[aria-label="Language suggestion"]'), null);
      await ready(unavailable, '/');
      assert.equal(await unavailable.$eval('html', el => el.lang), 'sk');
      await unavailable.waitForSelector('aside[aria-label="Language suggestion"]');
      await unavailable.$eval('aside a[hreflang="en"]', el => el.click());
      await unavailable.waitForFunction(() => location.pathname === '/en/' && document.documentElement.lang === 'en');
      assert.equal(await unavailable.$eval('html', el => el.lang), 'en');
      assert.equal(await unavailable.evaluate(() => localStorage.getItem('siteleveled-language')), 'en');
      await clickLink(unavailable, '/');
      assert.equal(await unavailable.$eval('html', el => el.lang), 'sk');
      assert.ok(await unavailable.$('main'), `${scenario} preferences: language switch must keep the page usable`);
    } finally {
      await context.close();
    }
  }
}
try {
  const page = await newPage();
  // Direct English entry cannot flash Slovak, regardless of a saved preference.
  await page.evaluateOnNewDocument(() => localStorage.setItem('siteleveled-language', 'sk'));
  await ready(page, '/en/');
  assert.equal(await page.$eval('html', el => el.lang), 'en');
  assert.match(await text(page), /Custom websites for your business/);
  assert.equal(await page.$$eval('link[hreflang]', els => els.length), 3);
  assert.equal(await page.$eval('link[hreflang="x-default"]', el => new URL(el.href).pathname), '/en/');
  // Home/city opening and closing keep the same canvas and scroll position.
  await ready(page, '/en/#portfolio');
  await page.evaluate(() => { window.savedCanvas = document.querySelector('canvas'); });
  // A real wheel event cancels any pending anchor scroll, as it does for a visitor.
  await page.mouse.move(100, 200);
  await page.mouse.wheel({ deltaY: 200 - await page.evaluate(() => scrollY) });
  await page.waitForFunction(() => Math.abs(scrollY - 200) < 5, { timeout: 3000 });
  await page.$eval('nav[aria-label="Buildings in our client city"] a', el => el.click());
  await page.waitForSelector('[role="dialog"]');
  assert.match(page.url(), /\/en\/city\//);
  assert.match(await page.title(), /SiteLeveled client city/);
  assert.equal(await page.$eval('meta[property="og:image"]', el => el.content.includes('en-mesto-')), true);
  assert.equal(await page.$eval('[role="dialog"] img', el => new URL(el.src).pathname.startsWith('/images/en/')), true);
  assert.equal(await page.evaluate(() => window.savedCanvas === document.querySelector('canvas')), true);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));
  assert.equal(new URL(page.url()).pathname, '/en/');
  assert.equal(new URL(page.url()).hash, '#portfolio');
  await page.waitForFunction(() => Math.abs(scrollY - 200) < 5, { timeout: 3000 });
  assert.ok(Math.abs(await page.evaluate(() => scrollY) - 200) < 5);
  assert.equal(await page.evaluate(() => window.savedCanvas === document.querySelector('canvas')), true);
  // Switch keeps the selected city and sets an explicit preference.
  await ready(page, '/en/city/zuzu-photo/');
  await page.waitForSelector('[role="dialog"]');
  await page.keyboard.press('Escape');
  await ready(page, '/en/city/zuzu-photo/');
  // The dialog traps focus; its own language switch is keyboard accessible and retains the selected client.
  await page.focus('[role="dialog"] a[hreflang="sk"]');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => location.pathname === '/mesto/zuzu-photo/');
  await page.waitForSelector('[role="dialog"]');
  assert.equal(await page.$eval('html', el => el.lang), 'sk');
  assert.equal(await page.$eval('[role="dialog"] img', el => new URL(el.src).pathname), '/zuzu-photo-preview.webp');
  assert.equal(await page.evaluate(() => localStorage.getItem('siteleveled-language')), 'sk');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => location.pathname === '/');
  await clickLink(page, '/en/');
  assert.equal(await page.evaluate(() => localStorage.getItem('siteleveled-language')), 'en');
  // Client navigation refreshes schema and social metadata.
  await clickLink(page, '/en/services/');
  assert.equal(await page.$eval('link[rel="canonical"]', el => new URL(el.href).pathname), '/en/services/');
  assert.equal(await page.$eval('meta[property="og:locale"]', el => el.content), 'en_US');
  assert.match(await page.$eval('script[type="application/ld+json"]', el => el.textContent), /Custom website/);
  await clickLink(page, '/en/pricing/');
  assert.match(await text(page), /pay after launch/i);
  // Contact option labels are translated while payload values remain compatible.
  await ready(page, '/en/contact/');
  assert.equal(await page.$('#contact-phone'), null);
  await submitContact(page);
  await page.waitForFunction(() => document.body.innerText.includes('Thank you!'));
  assert.equal(submitted.at(-1).locale, 'en');
  assert.equal(submitted.at(-1).source, 'kontakt');
  assert.match(submitted.at(-1).notes, /Nový web/);
  assert.equal(submitted.at(-1).website, '');
  assert.ok(Number.isInteger(submitted.at(-1).elapsed) && submitted.at(-1).elapsed > 0);
  formMode = 'failure';
  await ready(page, '/en/contact/');
  await submitContact(page);
  await page.waitForFunction(() => document.querySelector('[role="alert"]')?.innerText.includes('could not be sent'));
  formMode = 'success';
  await ready(page, '/kontakt/');
  await submitContact(page);
  await page.waitForFunction(() => document.body.innerText.includes('Ďakujeme!'));
  assert.equal(submitted.at(-1).locale, 'sk');
  // Proposal form submits in English.
  await ready(page, '/en/');
  await page.type('#lead-name', 'Alex Example');
  await page.type('#lead-email', 'alex@example.test');
  await page.type('#lead-company', 'Example Co');
  await page.$eval('#lead-form button[type="submit"]', el => el.click());
  await page.waitForFunction(() => document.body.innerText.includes('Your brief has been sent'));
  assert.equal(submitted.at(-1).locale, 'en');
  // Audit controls and failures use the viewing language.
  auditMode = 'access';
  await ready(page, '/en/seo-audit/');
  await page.type('#audit-url', 'example.test');
  await page.$eval('#audit-form button[type="submit"]', el => el.click());
  await page.waitForFunction(() => document.querySelector('[role="alert"]')?.innerText.includes('Incorrect access code'));
  for (const [mode, expected] of [['limit', '1 h 0 min'], ['busy', 'queue is busy']]) {
    auditMode = mode;
    await page.$eval('#audit-form button[type="submit"]', el => el.click());
    await page.waitForFunction(expected => document.querySelector('[role="alert"]')?.innerText.includes(expected), {}, expected);
  }
  auditMode = 'timeout';
  await ready(page, `/en/seo-audit/?audit=${jobId}`);
  await page.waitForFunction(() => document.body.innerText.includes('took too long'));
  await clickLink(page, `/seo-audit/?audit=${jobId}`);
  await page.waitForFunction(() => document.body.innerText.includes('príliš dlho'));
  auditMode = 'done';
  await ready(page, `/en/seo-audit/?audit=${jobId}`);
  await page.waitForFunction(() => document.body.innerText.includes('Pages checked:'));
  assert.match(await text(page), /Accessibility/);
  for (const route of ['/en/online-stores/', '/en/portfolio/', '/en/process/', '/en/about/', '/en/privacy/']) {
    await ready(page, route);
    const wrongLinks = await page.$$eval('a[href]', links => links.filter(a => a.origin === location.origin && !a.hreflang && !a.pathname.startsWith('/en/') && !a.pathname.startsWith('/api/')).map(a => a.href));
    assert.deepEqual(wrongLinks, [], route);
    assert.equal(await page.$eval('html', el => el.lang), 'en');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
  // Headings joined from translated parts, English price format, and data-driven city copy.
  await ready(page, '/en/pricing/');
  const pricing = await text(page);
  assert.match(pricing, /How much does a website cost\?/i);
  for (const price of [/from\s*€300/i, /from\s*€1,000/i, /€199/, /from\s*€30\s*\/ month/i]) assert.match(pricing, price);
  assert.ok(!/\d\s*€|\bEUR\b/.test(pricing), 'English prices lead with the euro sign');
  await ready(page, '/en/city/springnitra/');
  await page.waitForSelector('[role="dialog"]');
  assert.match(await page.$eval('[role="dialog"]', el => el.innerText), /Client reviews/);
  await ready(page, '/en/city/jogaslaskou/');
  await page.waitForSelector('[role="dialog"]');
  assert.match(await page.$eval('[role="dialog"]', el => el.innerText), /Classes, events, and retreats/);
  // English contact is email only: no phone icon or link. The Slovak pages keep the phone.
  for (const route of ['/en/', '/en/contact/', '/en/about/', '/en/pricing/', '/en/privacy/']) {
    await ready(page, route);
    assert.equal(await page.$$eval('a[href^="tel:"], a svg.lucide-phone', els => els.length), 0, route);
    assert.ok(await page.$$eval('a[hreflang][aria-label]', els => els.length > 0 && els.every(el => el.getAttribute('aria-label').toLowerCase().includes(el.innerText.trim().toLowerCase()))), `Language switch name: ${route}`);
  }
  await ready(page, '/kontakt/');
  assert.ok(await page.$('a[href^="tel:"] svg.lucide-phone'));
  // The lead form announces a send failure, as the contact form does.
  formMode = 'failure';
  await ready(page, '/en/about/');
  await ready(page, '/en/');
  await page.type('#lead-name', 'Alex Example');
  await page.type('#lead-email', 'alex@example.test');
  await page.type('#lead-company', 'Example Co');
  await page.$eval('#lead-form button[type="submit"]', el => el.click());
  await page.waitForFunction(() => document.querySelector('#lead-form [role="alert"]')?.innerText.includes('could not be sent'));
  formMode = 'success';
  // Labels beside the proposal layers stay inside their card on narrow phones.
  for (const width of [320, 390]) {
    const narrow = await newPage(width);
    await ready(narrow, '/en/');
    const clipped = await narrow.$eval('[class*="@container"][class*="aspect-square"]', box => {
      const edge = box.getBoundingClientRect().right;
      return [...box.querySelectorAll('span.block')].filter(label => label.getBoundingClientRect().right > edge + 0.5).map(label => label.textContent);
    });
    assert.deepEqual(clipped, [], `Clipped labels at ${width}px`);
    const overlapping = await narrow.$eval('[class*="@container"][class*="aspect-square"]', box => {
      const labels = [...box.querySelectorAll('div[aria-hidden].absolute.flex')].map(label => label.getBoundingClientRect()).sort((a, b) => a.top - b.top);
      return labels.filter((label, i) => i > 0 && label.top < labels[i - 1].bottom - 0.5).length;
    });
    assert.equal(overlapping, 0, `Overlapping labels at ${width}px`);
    await narrow.close();
  }
  assert.equal((await ready(page, '/en/this-does-not-exist/')).status(), 404);
  assert.match(await text(page), /could not be found/);
  // No JS: the initial English document contains meaningful content and usable switching.
  const noJs = await newPage(); await noJs.setJavaScriptEnabled(false); await ready(noJs, '/en/');
  assert.match(await text(noJs), /Custom websites for your business/);
  assert.equal(await noJs.$eval('a[hreflang="sk"]', el => new URL(el.href).pathname), '/');
  await noJs.close();
  // Browser language suggestion, dismissal persistence, and denied storage.
  const mobile = await newPage(390);
  await mobile.evaluateOnNewDocument(() => {
    if (!sessionStorage.getItem('fixture-session-init')) {
      localStorage.clear(); sessionStorage.clear(); sessionStorage.setItem('fixture-session-init', '1');
    }
  });
  await ready(mobile, '/');
  await mobile.waitForSelector('aside[aria-label="Language suggestion"]');
  await mobile.click('button[aria-label="Dismiss language suggestion"]');
  assert.equal(await mobile.evaluate(() => sessionStorage.getItem('siteleveled-language-dismissed')), '1');
  await clickLink(mobile, '/sluzby/');
  assert.equal(await mobile.$('aside[aria-label="Language suggestion"]'), null);
  await mobile.reload({ waitUntil: 'networkidle0' });
  assert.equal(await mobile.$('aside[aria-label="Language suggestion"]'), null);
  await ready(mobile, '/en/');
  await mobile.click('button[aria-label="Open menu"]');
  await mobile.waitForSelector('a[href="/en/services/"]');
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await mobile.click('.fixed.inset-0.z-40 a[href="/en/services/"]');
  await mobile.waitForFunction(() => location.pathname === '/en/services/');
  await ready(mobile, '/en/');
  await checkHomePreviewProportions(mobile);
  await mobile.screenshot({ path: '/tmp/siteleveled-english-mobile.png' });
  await mobile.close();
  const blocked = await newPage(390);
  await blocked.evaluateOnNewDocument(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('denied'); } });
    Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('denied'); } });
  });
  await ready(blocked, '/en/contact/');
  await clickLink(blocked, '/kontakt/');
  assert.equal(await blocked.$eval('html', el => el.lang), 'sk');
  await blocked.close();
  await checkUnavailableBrowserPreferences();
  await checkContrast();
  assert.deepEqual(failures, []);
  await ready(page, '/en/');
  await checkHomePreviewProportions(page);
  await page.waitForFunction(() => { const canvas = document.querySelector('canvas'); if (!canvas) return false; let el = canvas; while (el && el.tagName !== 'MAIN') { if (parseFloat(getComputedStyle(el).opacity) < 1) return false; el = el.parentElement; } return true; });
  await page.screenshot({ path: '/tmp/siteleveled-english-desktop.png' });
  console.log('Browser journeys passed: English/SK direct loads, hydration, city identity, switching, navigation/head, forms, audit fixtures, 404s, mobile, reduced motion, no JS, denied storage, unavailable browser preferences.');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
  fs.rmSync(auditDir, { recursive: true, force: true });
}
