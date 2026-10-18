// Used by the customer SEO audit (server/seoAudit.js) for every scan.
export default {
  scanner: {
    // Hard cap so one audit can't tie up the server crawling a huge site
    maxRoutes: Number(process.env.SEO_AUDIT_MAX_PAGES) || 15,
    samples: 1,
    device: "mobile",
  },
  puppeteerClusterOptions: {
    maxConcurrency: Number(process.env.SEO_AUDIT_CONCURRENCY) || 1,
  },
};
