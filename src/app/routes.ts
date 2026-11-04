import { loadMessages } from "./i18n/messages";
import { CLIENTS } from "./city/cityData";
import type { RouteObject } from "react-router";
import { Layout } from "./components/layout/Layout";
import { LOCALES, ROUTES } from "./i18n/routes";

// Explicit imports retain separate lazy chunks. The catalogue supplies paths for both languages.
const loaders = {
  HomePage: () => import("./pages/HomePage").then(m => ({ Component: m.HomePage })),
  ServicesPage: () => import("./pages/ServicesPage").then(m => ({ Component: m.ServicesPage })),
  EshopPage: () => import("./pages/EshopPage").then(m => ({ Component: m.EshopPage })),
  PricingPage: () => import("./pages/PricingPage").then(m => ({ Component: m.PricingPage })),
  PortfolioPage: () => import("./pages/PortfolioPage").then(m => ({ Component: m.PortfolioPage })),
  ProcessPage: () => import("./pages/ProcessPage").then(m => ({ Component: m.ProcessPage })),
  AboutPage: () => import("./pages/AboutPage").then(m => ({ Component: m.AboutPage })),
  ContactPage: () => import("./pages/ContactPage").then(m => ({ Component: m.ContactPage })),
  SeoAuditPage: () => import("./pages/SeoAuditPage").then(m => ({ Component: m.SeoAuditPage })),
  PrivacyPage: () => import("./pages/PrivacyPage").then(m => ({ Component: m.PrivacyPage })),
  BlogPage: () => import("./pages/BlogPage").then(m => ({ Component: m.BlogPage })),
  SeoAuditAdminPage: () => import("./pages/SeoAuditAdminPage").then(m => ({ Component: m.SeoAuditAdminPage })),
  NotFoundPage: () => import("./pages/NotFoundPage").then(m => ({ Component: m.NotFoundPage })),
};
const localized = (locale: "sk" | "en", module: keyof typeof loaders) => async () => {
  await loadMessages(locale);
  return loaders[module]();
};
export const routes: RouteObject[] = [{
  path: "/",
  Component: Layout,
  children: [
    ...ROUTES.flatMap(route => LOCALES.flatMap(locale => {
      if (route.id === "cityClient") return CLIENTS.map(client => ({
        path: route[locale].replace(":slug", client.id), lazy: localized(locale, route.module),
      }));
      return [{ path: route[locale], lazy: localized(locale, route.module) }];
    })),
    { path: "/blog/", lazy: loaders.BlogPage },
    { path: "/seo-audit/admin/", lazy: loaders.SeoAuditAdminPage },
    { path: "/en/*", lazy: localized("en", "NotFoundPage") },
    { path: "*", lazy: loaders.NotFoundPage },
  ],
}];
