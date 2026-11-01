// Used by the customer SEO audit (server/seoAudit.js) for every scan.
export default {
  scanner: {
    // Hard cap so one audit can't tie up the server crawling a huge site
    maxRoutes: Number(process.env.SEO_AUDIT_MAX_PAGES) || 15,
    samples: 1,
    device: "mobile",
    // Run JavaScript from the start. By default Unlighthouse only switches when the raw home page has
    // no links, and it then forgets what it queued: on a client-rendered site with a sitemap every
    // sitemap page is scanned twice (siteleveled.com: 23 scans instead of 14, up to the audit timeout)
    skipJavascript: false,
  },
  puppeteerClusterOptions: {
    maxConcurrency: Number(process.env.SEO_AUDIT_CONCURRENCY) || 1,
  },
};
