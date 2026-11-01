import { createBrowserRouter, redirect } from "react-router";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { ProcessPage } from "./pages/ProcessPage";
import { AboutPage } from "./pages/AboutPage";
import { PricingPage } from "./pages/PricingPage";
import { BlogPage } from "./pages/BlogPage";
import { ContactPage } from "./pages/ContactPage";
import { SeoAuditPage } from "./pages/SeoAuditPage";
import { SeoAuditAdminPage } from "./pages/SeoAuditAdminPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Every route here needs an entry in src/app/seo/pages.ts: production nginx 404s paths without
// a static file, and the build fails without one

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "sluzby", Component: ServicesPage },
      { path: "portfolio", Component: PortfolioPage },
      { path: "proces", Component: ProcessPage },
      { path: "o-nas", Component: AboutPage },
      { path: "cennik", Component: PricingPage },
      { path: "blog", Component: BlogPage },
      { path: "kontakt", Component: ContactPage },
      { path: "seo-audit", Component: SeoAuditPage },
      { path: "seo-audit/admin", Component: SeoAuditAdminPage },
      // Share link of a client's building in the hero city: the home page with it opened
      { path: "mesto/:slug", Component: HomePage },
      // nginx serves dist/index.html for /index.html as well
      { path: "index.html", loader: () => redirect("/") },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
