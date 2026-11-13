// Umami calls this before each send (data-before-send in index.html).
// /seo-audit/?audit=<id> opens someone's audit results, so that id never reaches the statistics.
// A file, not an inline script, so the site's Content-Security-Policy needs no hash (docs/security-headers.md).
window.slStatsFilter = function (type, payload) {
  var strip = function (url) { return url && url.replace(/([?&])audit=[^&#]*&?/, "$1").replace(/[?&]$/, ""); };
  if (payload) { payload.url = strip(payload.url); payload.referrer = strip(payload.referrer); }
  return payload;
};
