import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const fixtures = fs.mkdtempSync(path.join(os.tmpdir(), 'siteleveled-audit-test-'));
process.env.NODE_ENV = 'production';
process.env.SEO_AUDIT_DIR = fixtures;
process.env.SEO_AUDIT_ACCESS_CODE = 'fixture-code';
process.env.SEO_AUDIT_ADMIN_TOKEN = '';
const id = '11111111-1111-4111-8111-111111111111';
const doneId = '22222222-2222-4222-8222-222222222222';
const legacy = 'Audit trval príliš dlho a bol zastavený. Skúste to prosím neskôr.';
for (const [jobId, status, error] of [[id, 'failed', legacy], [doneId, 'done']]) {
  fs.mkdirSync(path.join(fixtures, jobId, 'report'), { recursive: true });
  fs.writeFileSync(path.join(fixtures, jobId, 'job.json'), JSON.stringify({ id: jobId, site: 'https://example.test', status, error, createdAt: Date.now(), finishedAt: Date.now() }));
}
fs.writeFileSync(path.join(fixtures, doneId, 'report/ci-result.json'), JSON.stringify({ summary: {}, routes: [{ path: '/', score: 0.9 }] }));
// Fixture domain validation never contacts DNS or starts a live scan.
const dns = require('node:dns').promises;
const lookup = dns.lookup;
dns.lookup = async () => [{ address: '93.184.216.34', family: 4 }];
const { app, FORMS, buildConfirmationEmail } = require('../server/index.js');
const { publicError } = require('../server/publicErrors.js');
const formGuard = require('../server/formGuard.js');
let server, base;
const sent = [];
before(async () => {
  app.locals.mailTransport = { sendMail: async mail => { sent.push(mail); return { messageId: 'fixture' }; } };
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { dns.lookup = lookup; await new Promise(resolve => server.close(resolve)); fs.rmSync(fixtures, { recursive: true, force: true }); });
const post = (route, body, headers = {}) => fetch(base + route, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
test('missing locale remains Slovak; English confirmations, owner language, stable values, and escaping', async () => {
  const fields = { name: '<Alex>', email: 'alex@example.test', company: 'Test project', hasWeb: 'ano', webUrl: 'https://example.test', goal: ['Iné'], goalOther: 'Details', elapsed: 5000 };
  for (const locale of [undefined, 'sk', 'en']) for (const source of [undefined, 'kontakt']) {
    sent.length = 0;
    formGuard.reset();
    const response = await post('/api/navrh', { ...fields, locale, source });
    assert.equal(response.status, 200);
    assert.equal(sent.length, 2);
    assert.match(sent[0].html, locale === 'en' ? /English \(en\)/ : /Slovenčina \(sk\)/);
    assert.match(sent[0].html, /Iné – Details/);
    assert.match(sent[1].html, locale === 'en' ? /<html lang="en">/ : /<html lang="sk">/);
    assert.match(sent[1].html, /&lt;Alex&gt;/);
    assert.ok(!sent[1].html.includes('<Alex>'));
    assert.match(sent[1].html, locale === 'en' ? /en\/privacy/ : /ochrana-osobnych-udajov/);
    assert.match(sent[1].subject, locale === 'en' ? /We received/ : /Dostali sme/);
    if (locale === 'en') { assert.ok(!sent[1].html.includes('24')); assert.match(sent[1].html, /by email/); }
  }
});
test('invalid locale and form validation return stable codes, without email', async () => {
  sent.length = 0;
  for (const locale of ['fr', null, 5, {}]) {
    const response = await post('/api/navrh', { locale });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).code, 'INVALID_LOCALE');
  }
  assert.equal((await (await post('/api/navrh', { locale: 'en' })).json()).code, 'REQUIRED_FIELDS');
  const invalid = await post('/api/navrh', { locale: 'en', name: 'Alex', company: 'Test', email: 'bad' });
  assert.equal((await invalid.json()).error, 'Enter a valid email address.');
  assert.equal(sent.length, 0);
});
test('bots get a silent success when sent too fast, nothing is emailed', async () => {
  const warn = console.warn;
  console.warn = () => {};
  try {
    for (const extra of [{ elapsed: 600 }, { website: 'https://spam.test', elapsed: 600 }]) {
      sent.length = 0;
      formGuard.reset();
      const response = await post('/api/navrh', { locale: 'en', name: 'Alex', company: 'Example', email: 'alex@example.test', source: 'kontakt', ...extra });
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { ok: true });
      assert.equal(sent.length, 0);
    }
  } finally { console.warn = warn; }
});
test('suspicious enquiries reach the owner marked, without a confirmation to the address typed in', async () => {
  formGuard.reset();
  // The 2026-11-11 spam: "..." in the address is not valid at all
  const spam = { locale: 'en', source: 'kontakt', name: 'YtGulMDpoAWikzOn', company: 'Srcipqucg LLC', notes: 'mCroDxXDLqOeFPzBqHhPyZEW', elapsed: 5000 };
  sent.length = 0;
  const invalid = await post('/api/navrh', { ...spam, email: 'de.v.i.n...r.uet.z.el@gmail.com' });
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).code, 'INVALID_EMAIL');
  for (const body of [{ ...spam, email: 'de.v.i.n.r.uet.z.el@gmail.com' }, { locale: 'sk', name: 'Alex', company: 'Example', email: 'alex@example.test' }]) {
    sent.length = 0;
    const response = await post('/api/navrh', body);
    assert.equal(response.status, 200);
    assert.equal(sent.length, 1);
    assert.match(sent[0].subject, /^\[Možný spam\] /);
    assert.match(sent[0].html, /Možný spam/);
  }
  assert.match(sent[0].html, /odoslané mimo formulára/);
  // The 2026-11-12 owner test: autofill put their address into the hidden field
  sent.length = 0;
  const autofilled = await post('/api/navrh', { locale: 'sk', source: 'kontakt', name: 'Mário Doman', company: 'SiteLeveled', email: 'info@siteleveled.com', website: 'info@siteleveled.com', elapsed: 40000 });
  assert.equal(autofilled.status, 200);
  assert.equal(sent.length, 1);
  assert.match(sent[0].subject, /^\[Možný spam\] /);
  assert.match(sent[0].html, /vyplnené skryté pole/);
  for (const value of ['Mário Doman', 'SiteLeveled', 'McDonald', 'JavaScriptDev', 'Zuzana Kondeková', 'Srcipqucg LLC']) assert.equal(formGuard.looksRandom(value), false, value);
  for (const value of ['YtGulMDpoAWikzOn', 'mCroDxXDLqOeFPzBqHhPyZEW']) assert.equal(formGuard.looksRandom(value), true, value);
});
test('more than five enquiries an hour from one address are refused with a localized error', async () => {
  formGuard.reset();
  const body = { locale: 'en', name: 'Alex', company: 'Example', email: 'alex@example.test', elapsed: 5000 };
  for (let i = 0; i < 5; i++) assert.equal((await post('/api/navrh', body)).status, 200);
  sent.length = 0;
  const limited = await post('/api/navrh', body);
  assert.equal(limited.status, 429);
  const json = await limited.json();
  assert.equal(json.code, 'FORM_LIMIT');
  assert.match(json.error, /Too many messages/);
  assert.equal(sent.length, 0);
  formGuard.reset();
});
test('mail transport failure returns the localized stable error', async () => {
  const transport = app.locals.mailTransport;
  const log = console.error;
  console.error = () => {};
  app.locals.mailTransport = { sendMail: async () => { throw new Error('fixture transport failure'); } };
  try {
    formGuard.reset();
    const response = await post('/api/navrh', { locale: 'en', name: 'Alex', company: 'Example', email: 'alex@example.test', elapsed: 5000 });
    assert.equal(response.status, 500);
    assert.equal((await response.json()).code, 'MAIL_FAILED');
  } finally { app.locals.mailTransport = transport; console.error = log; }
});
test('persisted audit failures and reused results are localized per request, without changing the stored job', async () => {
  for (const locale of ['en', 'sk', 'en']) {
    const failed = await (await fetch(`${base}/api/seo-audit/${id}`, { headers: { 'X-Site-Locale': locale } })).json();
    assert.equal(failed.code, 'AUDIT_TIMEOUT');
    assert.match(failed.error, locale === 'en' ? /too long/ : /príliš dlho/);
    const reused = await (await post('/api/seo-audit', { url: 'https://example.test', accessCode: 'fixture-code' }, { 'X-Site-Locale': locale })).json();
    assert.equal(reused.id, doneId);
    assert.equal(reused.result.pages.length, 1);
  }
  const persisted = JSON.parse(fs.readFileSync(path.join(fixtures, id, 'job.json')));
  assert.equal(persisted.error, legacy);
  assert.equal(persisted.locale, undefined);
});
test('public audit validation, access, expiry, and historical errors expose codes', async () => {
  const bad = await post('/api/seo-audit', { url: 'example.test', accessCode: 'wrong' }, { 'X-Site-Locale': 'en' });
  assert.equal(bad.status, 403);
  assert.deepEqual(await bad.json(), { error: 'Incorrect access code.', code: 'AUDIT_ACCESS' });
  const missing = await fetch(base + '/api/seo-audit/unknown', { headers: { 'X-Site-Locale': 'en' } });
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).code, 'AUDIT_EXPIRED');
  for (const [url, code] of [['', 'URL_REQUIRED'], ['ftp://example.test', 'URL_PROTOCOL'], ['http://user:pass@example.test', 'URL_CREDENTIALS'], ['http://example.test:8080', 'URL_PORT'], ['http://127.0.0.1', 'URL_DOMAIN']]) {
    const response = await post('/api/seo-audit', { url, accessCode: 'fixture-code' }, { 'X-Site-Locale': 'en' });
    assert.equal(response.status, 400); assert.equal((await response.json()).code, code);
  }
  for (const code of ['AUDIT_BUSY', 'AUDIT_RESTARTED', 'AUDIT_TIMEOUT', 'AUDIT_START_FAILED', 'AUDIT_UNREACHABLE', 'AUDIT_ROBOTS', 'AUDIT_RESULT']) {
    assert.equal(publicError(code, 'en').code, code);
    assert.notEqual(publicError(code, 'en').error, publicError(code, 'sk').error);
  }
  assert.match(publicError('AUDIT_LIMIT', 'en', { waitMs: 3600000 }).error, /1 h 0 min/);
});
test('static production serving returns language-specific real 404s and slash redirects', async () => {
  for (const [route, status, language] of [['/en/', 200, 'en'], ['/sluzby/', 200, 'sk'], ['/en/not-real/', 404, 'en'], ['/missing/', 404, 'sk'], ['/en/city/missing/', 404, 'en']]) {
    const response = await fetch(base + route);
    assert.equal(response.status, status, route);
    assert.match(await response.text(), new RegExp(`<html lang="${language}"`));
  }
  assert.equal((await fetch(base + '/en/services', { redirect: 'manual' })).status, 301);
  assert.equal((await fetch(base + '/api/seo-audit/config')).headers.get('x-robots-tag'), 'noindex, nofollow');
});
