import { createRoot } from "react-dom/client";
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
  // nginx serves the home page for /index.html as well
  if (location.pathname === "/index.html") history.replaceState(null, "", "/");

  // The first page's code before the first render, so the router has something to show
  const pending = matchRoutes(routes, location)?.filter(({ route }) => route.lazy) ?? [];
  await Promise.all(
    pending.map(async ({ route }) => {
      Object.assign(route, await (route.lazy as () => Promise<object>)(), { lazy: undefined });
    }),
  );

  router = createBrowserRouter(routes);
  createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
}

start();
