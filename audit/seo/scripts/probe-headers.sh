#!/usr/bin/env bash
# Status codes + response headers for every route and host/slash variant on production.
# Polite: one request per second. Never touches /api/*.
set -u
OUT="${1:-raw/headers}"
mkdir -p "$OUT"
UA_GBOT='Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
URLS=(
  https://siteleveled.com/
  https://siteleveled.com/sluzby
  https://siteleveled.com/sluzby/
  https://siteleveled.com/portfolio
  https://siteleveled.com/portfolio/
  https://siteleveled.com/proces
  https://siteleveled.com/o-nas
  https://siteleveled.com/cennik
  https://siteleveled.com/blog
  https://siteleveled.com/kontakt
  https://siteleveled.com/seo-audit
  https://siteleveled.com/seo-audit/
  https://siteleveled.com/seo-audit/admin
  https://siteleveled.com/mesto/jogaslaskou
  https://siteleveled.com/mesto/jogaslaskou/
  https://siteleveled.com/robots.txt
  https://siteleveled.com/sitemap.xml
  https://siteleveled.com/toto-neexistuje-xyz-404
  https://siteleveled.com/blog/neexistujuci-clanok
  https://siteleveled.com/index.html
  https://siteleveled.com/favicon.ico
  https://siteleveled.com/favicon.svg
  https://siteleveled.com/manifest.webmanifest
  https://siteleveled.com/og/siteleveled.png
  https://siteleveled.com/profile.jpg
  https://siteleveled.com/zuzu-photo-preview.webp
  https://www.siteleveled.com/
  https://www.siteleveled.com/sluzby
  http://siteleveled.com/
  http://siteleveled.com/sluzby
  http://www.siteleveled.com/
  https://siteleveled.com/?utm_source=test
)
CSV="$OUT/status.csv"
echo "url,status,content_type,location,content_length,content_encoding,cache_control,hsts,x_robots_tag,etag,server" > "$CSV"
i=0
for u in "${URLS[@]}"; do
  i=$((i+1))
  f="$OUT/$(printf '%02d' $i)_$(echo "$u" | sed -E 's#https?://##; s#[^A-Za-z0-9._-]#_#g').txt"
  curl -s -o /dev/null -D "$f" -A "$UA_GBOT" -H 'Accept-Encoding: gzip, br' --max-time 20 "$u"
  st=$(head -1 "$f" | awk '{print $2}')
  h() { grep -i "^$1:" "$f" | head -1 | cut -d' ' -f2- | tr -d '\r' | tr ',' ';'; }
  echo "$u,$st,$(h content-type),$(h location),$(h content-length),$(h content-encoding),$(h cache-control),$(h strict-transport-security),$(h x-robots-tag),$(h etag),$(h server)" >> "$CSV"
  sleep 1
done
column -s, -t < "$CSV"
