# Security headers (nginx on the VPS)

The nginx vhosts are hand-edited on the VPS, not deployed from this repo. This file records what they should contain.
These steps come from an external security review on 2026-11-13. The code side (`/api/csp-report`, sandboxed audit reports, no `X-Powered-By`, no inline scripts) ships with the normal push to `main`.

**Order:** push the code first, then do the nginx steps. The policy reports to `/api/csp-report`, and the stats filter must already be loaded from a file.

## 1. Content-Security-Policy for siteleveled.com

The policy was tested in Chrome on 2026-11-13, enforced, on all 35 built pages, including forms with a live Turnstile widget, Umami sends and the admin page. It produced no violations. Turnstile logs a `connect-src data:` error from inside its own iframe; that comes from Cloudflare's own policy and shows up even without ours.

At the top of `/etc/nginx/sites-available/siteleveled.com`, **outside** every `server { }` block:

```nginx
# /api/ gets no site policy: audit reports send their own sandbox policy, and two policies would both apply
map $uri $siteleveled_csp {
    ~^/api/  "";
    default  "default-src 'self'; script-src 'self' https://stats.siteleveled.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://stats.siteleveled.com; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; report-uri /api/csp-report";
}
```

Put this in the `listen 443` server block, right next to the existing `add_header Strict-Transport-Security` line. That line may sit inside a `location`. If so, put this one in that same location, because nginx drops inherited `add_header` lines once a block has its own:

```nginx
add_header Content-Security-Policy-Report-Only $siteleveled_csp always;
```

```sh
sudo nginx -t && sudo systemctl reload nginx
curl -sI https://siteleveled.com/ | grep -i content-security          # the policy
curl -sI https://siteleveled.com/api/seo-audit/config | grep -i content-security   # nothing
```

**After about a week:** check what real visitors' browsers reported. Browser-extension noise is already filtered out:

```sh
sudo journalctl --since "7 days ago" | grep "CSP violation"
```

If nothing points at the site's own pages, switch to enforcing by renaming the header to `Content-Security-Policy`, then run `nginx -t` and reload.

**When it has to change:** a new third-party script, iframe, font, image host or API means updating the policy here and on the VPS. The page must also keep having no inline `<script>` (see the comment in `index.html`); styles may be inline.

## 2. stats.siteleveled.com

In `/etc/nginx/sites-available/stats.siteleveled.com`, inside the `listen 443 ssl` server block (the one certbot rewrote), outside `location /`:

```nginx
add_header Strict-Transport-Security "max-age=15552000" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
proxy_hide_header X-Powered-By;
```

```sh
curl -sI https://stats.siteleveled.com/script.js | grep -iE "strict-transport|nosniff|referrer|powered"
```

Don't add `includeSubDomains` to the main site's HSTS until every subdomain has been checked to work on HTTPS, including the client previews and roomgame.

## 3. Version banner and updates

In `/etc/nginx/nginx.conf`, inside `http { }`, uncomment or add `server_tokens off;`.

The review linked an October 2026 Ubuntu nginx security update. Check that it is installed:

```sh
apt list --upgradable 2>/dev/null | grep -i nginx      # nothing listed = up to date
sudo apt update && sudo apt install --only-upgrade nginx   # only if it was listed
systemctl is-enabled unattended-upgrades               # "enabled" = security updates install by themselves
```
