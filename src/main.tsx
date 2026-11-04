import { loadMessages } from "./app/i18n/messages";
import { localeForPath } from "./app/i18n/routes";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter, matchRoutes, RouterProvider } from "react-router";
import { routes } from "./app/routes";
import "./styles/index.css";

let router: ReturnType<typeof createBrowserRouter> | undefined;

// A deploy deletes the old code files, so a tab left open can fail to load a page it hasn't visited yet.
// A full load of that page gets the new version
window.addEventListener("vite:preloadError", (event) => {
  if (!router) return;
  event.preventDefault();
  const target = router.state.navigation.location;
  if (target) location.assign(target.pathname + target.search + target.hash);
  else location.reload();
});

async function start() {
  await loadMessages(localeForPath(location.pathname));
  // nginx serves the home page for /index.html as well
  if (location.pathname === "/index.html") history.replaceState(null, "", "/");

  // React can only attach to a pre-rendered page once that page's code is here
  const pending = matchRoutes(routes, location)?.filter(({ route }) => route.lazy) ?? [];
  await Promise.all(
    pending.map(async ({ route }) => {
      Object.assign(route, await (route.lazy as () => Promise<object>)(), { lazy: undefined });
    }),
  );

  router = createBrowserRouter(routes);
  const app = <RouterProvider router={router} />;
  const root = document.getElementById("root")!;
  // Only browser-dependent pages such as the owner admin omit prerendered content.
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
}

start();
