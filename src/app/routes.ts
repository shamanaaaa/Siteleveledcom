import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { ProcessPage } from "./pages/ProcessPage";
import { AboutPage } from "./pages/AboutPage";
import { PricingPage } from "./pages/PricingPage";
import { BlogPage } from "./pages/BlogPage";
import { ContactPage } from "./pages/ContactPage";

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
      {
        path: "*",
        Component: HomePage,
      },
    ],
  },
]);
