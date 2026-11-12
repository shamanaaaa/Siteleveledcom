# Visit statistics: Umami on the VPS

The site counts visits with [Umami](https://umami.is), self-hosted on the same VPS at `https://stats.siteleveled.com`. It sets no cookies and stores no IP addresses, so the privacy page (`src/app/pages/PrivacyPage.tsx`, "Štatistika návštevnosti") stays true without a consent banner. Keep this setup and that text in step: the policy promises **2 years of retention** (step 5) and that the tool **runs on our own server**.

What the site sends: page views, the referrer, UTM parameters, Core Web Vitals (`data-performance`), and one `dopyt` event when `/api/navrh` accepts an enquiry, with `formular` (`uvod`, `kontakt` or `eshop`) and `jazyk` (`sk` or `en`). The tag lives in `index.html`, and the event in `src/app/lib/analytics.ts`. The `audit` id from `/seo-audit/?audit=…` is removed before anything is sent, because it opens someone's audit results.

Pinned version: **Umami 3.4.1** (`ghcr.io/umami-software/umami:3.4.1`) with PostgreSQL 15. 3.5.0 came out on 2026-11-12, the day this was written. Upgrade once it has been out a few weeks (see "Updating").

## This server (set up 2026-11-12)

- `/opt/umami` is owned by `shamanaaaa` (mode 700), so run `docker compose` there as that user, without sudo. `.env` is mode 600.
- There's no anacron, so `/etc/crontab` runs the retention job from step 5 as root on the 1st of each month at 06:52.
- The certificate came from `certbot --nginx --redirect`, with the same `renew_hook` (reload nginx) as the server's other certificates.
- The admin password is in `/root/umami-admin-password` (root, 600).
- Backups: `backup-all-services.sh` does **not** cover the `umami_umami-db-data` volume or `/opt/umami`. The owner decided on 2026-11-12 not to back them up, so losing the disk means losing the statistics and `.env`. If that happens, make a new `.env` and set Umami up again from step 1.

## Before you start

- `docker compose version` works. If Docker isn't installed, install Docker Engine with the compose plugin from docker.com first.
- `free -h` shows at least about 400 MB available for Umami and its database, on top of the site and the SEO audit's Chrome.
- `df -h /var/lib/docker` shows at least 2 GB free. The Umami image alone is about 1 GB, and PostgreSQL about 0.3 GB.
- `ss -ltn | grep ':3002 '` prints nothing (Express uses 3001; Umami will listen on 127.0.0.1:3002 only).
- DNS: nothing to do. `*.siteleveled.com` already points to this server.

## 1. Files

```sh
sudo mkdir -p /opt/umami && cd /opt/umami
sudo sh -c 'umask 077; printf "APP_SECRET=%s\nPOSTGRES_PASSWORD=%s\nTWO_FACTOR_ENCRYPTION_KEY=%s\n" \
  "$(openssl rand -hex 32)" "$(openssl rand -hex 24)" "$(openssl rand -hex 32)" > .env'
```

Hex passwords keep `DATABASE_URL` valid. Don't lose `.env`: `APP_SECRET` signs logins, and the 2FA key decrypts 2FA secrets.

`/opt/umami/compose.yaml`:

```yaml
services:
  umami:
    image: ghcr.io/umami-software/umami:3.4.1
    ports:
      - "127.0.0.1:3002:3000" # loopback only: Docker would otherwise bypass the firewall
    environment:
      DATABASE_URL: postgresql://umami:${POSTGRES_PASSWORD:?}@db:5432/umami
      APP_SECRET: ${APP_SECRET:?}
      TWO_FACTOR_ENCRYPTION_KEY: ${TWO_FACTOR_ENCRYPTION_KEY:?}
      # nginx always overwrites X-Real-IP. Without this, Umami 3.4.1 would believe headers such as
      # CF-Connecting-IP that any visitor can send
      CLIENT_IP_HEADER: x-real-ip
      DISABLE_TELEMETRY: 1
    depends_on:
      db:
        condition: service_healthy
    init: true
    restart: always
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?}
    volumes:
      - umami-db-data:/var/lib/postgresql/data
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U umami -d umami"]
      interval: 5s
      timeout: 5s
      retries: 5
volumes:
  umami-db-data:
```

## 2. Start

```sh
cd /opt/umami && sudo docker compose up -d
sudo docker compose logs -f umami   # wait until it reports it is ready, then Ctrl+C
curl -s http://127.0.0.1:3002/api/heartbeat   # answers once Umami is up
```

The first start creates the tables.

## 3. First login, before the site is public

Umami starts with the login **admin / umami**. Change it before step 4 makes the dashboard reachable from the internet. From your own computer, open a tunnel:

```sh
ssh -L 3002:127.0.0.1:3002 <you>@<vps>
```

Then, at `http://localhost:3002`:

1. Log in as admin / umami. In your profile (the user menu), **change the password** to a long, unique one. Optionally turn on 2FA there too.
2. Under **Websites**, add a website: name `SiteLeveled`, domain `siteleveled.com`.
3. Open that website's settings and copy its **Website ID** (a UUID). It goes into `index.html` in step 7.

## 4. nginx and HTTPS

`/etc/nginx/sites-available/stats.siteleveled.com`, linked into `sites-enabled/` (or the equivalent in `conf.d/`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name stats.siteleveled.com;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```sh
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d stats.siteleveled.com   # same Let's Encrypt setup as the main site; choose redirect to HTTPS
curl -sI https://stats.siteleveled.com/script.js | head -1   # HTTP/2 200
```

Access logs for this host fall under the existing "Technické záznamy servera" rule (15 days), so keep it on the same logrotate setup as the main site.

## 5. Delete statistics after 2 years (the privacy page promises this)

`/etc/cron.monthly/umami-retention` (no dot in the name, or `run-parts` skips it):

```sh
#!/bin/sh
# Privacy policy: visit statistics are kept 2 years (PrivacyPage.tsx, "Ako dlho údaje uchovávame")
cd /opt/umami && docker compose exec -T db psql -U umami -d umami -q -c "
DELETE FROM event_data    WHERE created_at < now() - interval '2 years';
DELETE FROM session_data  WHERE created_at < now() - interval '2 years';
DELETE FROM website_event WHERE created_at < now() - interval '2 years';
DELETE FROM session       WHERE created_at < now() - interval '2 years';"
```

```sh
sudo chmod 755 /etc/cron.monthly/umami-retention
sudo /etc/cron.monthly/umami-retention && echo OK   # runs fine on an empty database too
```

## 6. Leave your own visits out

On siteleveled.com, in each browser you use (DevTools → Console):

```js
localStorage.setItem("umami.disabled", "1")
```

Clearing the site's data undoes it. The Umami docs also offer `IGNORE_IP`, but home IPs change.

## 7. Turn it on in the site

Put the Website ID from step 3 into `data-website-id` in `index.html` (done: `21496767-d9b3-47a6-ac41-f7a0c60fc229`). Set the "Aktualizované" date in the privacy page's `sub` text to the day it goes live, in both `PrivacyPage.tsx` and `en.json` plus `docs/english-copy/inventory.json`. Then build, test and deploy as usual.

Check it from a private window, where step 6 doesn't apply:

1. Open `https://siteleveled.com/` and click to two other pages. **Realtime** in Umami shows the visit, with all three pages.
2. Open `/seo-audit/?audit=test&utm_source=check`. Umami shows `/seo-audit/` with `utm_source=check`, and no `audit`.
3. For the enquiry event, either send yourself a real enquiry, or run `umami.track("dopyt", { formular: "test", jazyk: "sk" })` in the console. **Events** then shows `dopyt`. The website's settings can reset its data, which wipes everything, so do that only before real visits are counted.

## Updating

Read the release notes (github.com/umami-software/umami/releases) for the versions in between. Then change the image tag in `compose.yaml` and run:

```sh
cd /opt/umami && sudo docker compose pull && sudo docker compose up -d
```

Database migrations run on start. Take a dump first (below). Don't use the `latest` tag: an unreviewed major version could start collecting more than the privacy page says.

## Backups

The data lives in the Docker volume `umami_umami-db-data`. The server backups cover it only if they include `/var/lib/docker/volumes`. A dump is the safer copy:

```sh
cd /opt/umami && sudo docker compose exec -T db pg_dump -U umami umami | gzip > /root/umami-$(date +%F).sql.gz
```

Restored backups must still respect the 2 years. The cron job handles that on its next run.
