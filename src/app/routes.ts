import type { RouteObject } from "react-router";
import { Layout } from "./components/layout/Layout";

// Every route here needs an entry in src/app/seo/pages.ts: production nginx 404s paths without
// a static file, and the build fails without one.
// Each page's code loads only when it's needed. scripts/seoPages.ts reads these lines to name
// that file in the page's HTML, so keep them in this form

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, lazy: () => import("./pages/HomePage").then((m) => ({ Component: m.HomePage })) },
      { path: "sluzby", lazy: () => import("./pages/ServicesPage").then((m) => ({ Component: m.ServicesPage })) },
      { path: "tvorba-eshopu", lazy: () => import("./pages/EshopPage").then((m) => ({ Component: m.EshopPage })) },
      { path: "portfolio", lazy: () => import("./pages/PortfolioPage").then((m) => ({ Component: m.PortfolioPage })) },
      { path: "proces", lazy: () => import("./pages/ProcessPage").then((m) => ({ Component: m.ProcessPage })) },
      { path: "o-nas", lazy: () => import("./pages/AboutPage").then((m) => ({ Component: m.AboutPage })) },
      { path: "cennik", lazy: () => import("./pages/PricingPage").then((m) => ({ Component: m.PricingPage })) },
      { path: "blog", lazy: () => import("./pages/BlogPage").then((m) => ({ Component: m.BlogPage })) },
      { path: "kontakt", lazy: () => import("./pages/ContactPage").then((m) => ({ Component: m.ContactPage })) },
      { path: "seo-audit", lazy: () => import("./pages/SeoAuditPage").then((m) => ({ Component: m.SeoAuditPage })) },
      { path: "seo-audit/admin", lazy: () => import("./pages/SeoAuditAdminPage").then((m) => ({ Component: m.SeoAuditAdminPage })) },
      { path: "ochrana-osobnych-udajov", lazy: () => import("./pages/PrivacyPage").then((m) => ({ Component: m.PrivacyPage })) },
      // Share link of a client's building in the hero city: the home page with it opened
      { path: "mesto/:slug", lazy: () => import("./pages/HomePage").then((m) => ({ Component: m.HomePage })) },
      { path: "*", lazy: () => import("./pages/NotFoundPage").then((m) => ({ Component: m.NotFoundPage })) },
    ],
  },
];
