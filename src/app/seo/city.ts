import type { CityClient } from "../city/cityData";
import { pathFor, type Locale } from "../i18n/routes";
import { translate } from "../i18n/messages";
import type { PageMeta } from "./pages";
export function cityMeta(client: CityClient, locale: Locale): PageMeta {
  return {
    id: "cityClient", locale, path: pathFor("cityClient", locale, client.id), robots: "noindex, follow",
    title: locale === "en" ? `${client.name} — SiteLeveled client city` : `${client.name} — budova v meste klientov SiteLeveled`,
    description: locale === "en" ? `${client.name}: ${translate(client.category, locale)}. Explore this Slovak business project in the SiteLeveled pixel city.` : `${client.name} (${client.category}) má svoju budovu v pixelovom meste klientov SiteLeveled. Pozrite si projekt a postavte tam aj svoj web — návrh zadarmo do 24 hodín.`,
    image: `/og/${locale === "en" ? "en-" : ""}mesto-${client.id}.png`,
    imageAlt: locale === "en" ? `${client.name} in the SiteLeveled client city` : `Budova ${client.name} v pixelovom meste klientov SiteLeveled`,
  };
}
