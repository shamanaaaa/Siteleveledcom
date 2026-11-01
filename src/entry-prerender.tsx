import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import { routes } from "./app/routes";
import { SITE } from "./app/seo/pages";

const handler = createStaticHandler(routes);

/** A page as HTML, at build time (scripts/seoPages.ts). main.tsx then attaches React to it in the browser */
export async function render(path: string) {
  const context = await handler.query(new Request(SITE + path));
  if (context instanceof Response) throw new Error(`${path} redirects`);
  // The router would otherwise render its error page, and that HTML would be published as the page
  if (context.errors) throw Object.values(context.errors)[0];
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(<StaticRouterProvider router={router} context={context} hydrate={false} />);
}
