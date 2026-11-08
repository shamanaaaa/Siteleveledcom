import { SITE, type PageMeta } from "./pages";
import { pathFor } from "../i18n/routes";

const ORG = `${SITE}/#organization`;
const MARIO = `${SITE}/o-nas/#mario-doman`;
const MARIA = `${SITE}/o-nas/#maria-domanova`;

// Only facts the pages already show. Address and IČO match the footer and the RPO registry
// (checked 2026-11-08). No review stars for our own reviews. sameAs waits for the Facebook
// business page URL and a Google Business Profile.
const SITEWIDE = [
  {
    "@type": "Organization",
    "@id": ORG,
    name: "SiteLeveled",
    legalName: "DOMAN s.r.o.",
    url: `${SITE}/`,
    logo: { "@type": "ImageObject", url: `${SITE}/apple-touch-icon.png`, width: 180, height: 180 },
    image: `${SITE}/og/siteleveled.png`,
    description: "Tvorba webstránok a e-shopov pre slovenské firmy. Návrh webu zadarmo do 24 hodín.",
    email: "info@siteleveled.com",
    telephone: "+421910803993",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ulica Funduše 1165/26",
      addressLocality: "Cabaj-Čápor",
      postalCode: "951 17",
      addressCountry: "SK",
    },
    identifier: { "@type": "PropertyValue", propertyID: "IČO", value: "47912383" },
    areaServed: { "@type": "Country", name: "Slovensko" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+421910803993",
      email: "info@siteleveled.com",
      availableLanguage: "sk",
    },
    employee: [{ "@id": MARIO }, { "@id": MARIA }],
  },
  {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: "SiteLeveled",
    url: `${SITE}/`,
    inLanguage: "sk",
    publisher: { "@id": ORG },
  },
  {
    "@type": "Person",
    "@id": MARIO,
    name: "Mário Doman",
    jobTitle: "Vývojár",
    telephone: "+421910803993",
    image: `${SITE}/profile.jpg`,
    sameAs: ["https://www.linkedin.com/in/m%C3%A1rio-doman-65b08663/"],
    worksFor: { "@id": ORG },
  },
  {
    "@type": "Person",
    "@id": MARIA,
    name: "Mária Domanová",
    jobTitle: "Konateľka",
    worksFor: { "@id": ORG },
  },
];

const offer = (priceSpecification: object, description?: string) => ({
  "@type": "Offer",
  url: `${SITE}/cennik/`,
  priceCurrency: "EUR",
  priceSpecification,
  ...(description ? { description } : {}),
});

const SERVICES = [
  {
    "@type": "Service",
    "@id": `${SITE}/sluzby/#tvorba-webu`,
    name: "Tvorba webstránky na mieru",
    serviceType: "Tvorba webstránok",
    provider: { "@id": ORG },
    areaServed: { "@type": "Country", name: "Slovensko" },
    offers: offer(
      { "@type": "PriceSpecification", minPrice: 300, priceCurrency: "EUR" },
      "Web od 300 €, hotový do 7 dní. Bez zálohy, platíte až po spustení."
    ),
  },
  {
    "@type": "Service",
    "@id": `${SITE}/sluzby/#tvorba-eshopu`,
    name: "Tvorba e-shopu na mieru",
    serviceType: "Tvorba e-shopov",
    provider: { "@id": ORG },
    areaServed: { "@type": "Country", name: "Slovensko" },
    offers: offer(
      { "@type": "PriceSpecification", minPrice: 1000, priceCurrency: "EUR" },
      "E-shop od 1 000 €, hotový do 14 dní. Bez zálohy, platíte až po spustení."
    ),
  },
  {
    "@type": "Service",
    "@id": `${SITE}/sluzby/#seo-audit`,
    name: "SEO audit webu",
    serviceType: "SEO audit",
    provider: { "@id": ORG },
    offers: { "@type": "Offer", url: `${SITE}/cennik/`, price: 199, priceCurrency: "EUR" },
  },
  {
    "@type": "Service",
    "@id": `${SITE}/sluzby/#sprava-webu`,
    name: "Správa webu",
    serviceType: "Správa a údržba webu",
    provider: { "@id": ORG },
    offers: offer({
      "@type": "UnitPriceSpecification",
      minPrice: 30,
      priceCurrency: "EUR",
      unitCode: "MON",
      unitText: "mesiac",
    }),
  },
];

function webPage(type: string, page: PageMeta, extra: object = {}) {
  return {
    "@type": type,
    "@id": `${SITE}${page.path}#webpage`,
    url: SITE + page.path,
    name: page.title,
    inLanguage: page.locale,
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": ORG },
    ...extra,
  };
}

export function jsonLd(page: PageMeta) {
  const graph: object[] = SITEWIDE.map(item => {
    if (page.locale === "sk") return item;
    const next: Record<string, unknown> = { ...item };
    if (next["@type"] === "Organization") {
      next.description = "Custom websites and online stores, with direct developer contact by email.";
      next.image = `${SITE}/og/en-siteleveled.png`;
      // English enquiries go by email only; the service area is not limited to Slovakia
      next.contactPoint = { "@type": "ContactPoint", contactType: "customer service", email: "info@siteleveled.com", availableLanguage: ["en", "sk"] };
      delete next.telephone;
      delete next.areaServed;
    }
    if (next["@type"] === "WebSite") { next.inLanguage = ["sk", "en"]; }
    if (next.jobTitle === "Vývojár") { next.jobTitle = "Developer"; delete next.telephone; }
    if (next.jobTitle === "Konateľka") next.jobTitle = "Managing director";
    return next;
  });
  if (page.name) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: page.locale === "en" ? "Home" : "Domov", item: SITE + pathFor("home", page.locale) },
        { "@type": "ListItem", position: 2, name: page.name, item: SITE + page.path },
      ],
    });
  }
  if (page.locale === "sk" && (page.path === "/sluzby/" || page.path === "/cennik/")) graph.push(...SERVICES);
  if (page.path === "/tvorba-eshopu/") graph.push(...SERVICES.filter((s) => s["@id"].endsWith("#tvorba-eshopu")));
  if (page.locale === "en" && ["services", "pricing", "onlineStores"].includes(page.id)) {
    const names = page.id === "onlineStores" ? ["Custom online store"] : ["Custom website", "Custom online store", "Manual SEO audit", "Website maintenance"];
    graph.push(...names.map((name, i) => {
      const monthly = name === "Website maintenance";
      const price = name === "Custom online store" ? 1000 : name === "Manual SEO audit" ? 199 : monthly ? 30 : 300;
      return {
        "@type": "Service", "@id": `${SITE}${page.path}#service-${i}`, name,
        provider: { "@id": ORG }, url: SITE + page.path,
        offers: {
          "@type": "Offer", url: SITE + pathFor("pricing", "en"), priceCurrency: "EUR",
          ...(name === "Manual SEO audit" ? { price } : {
            priceSpecification: {
              "@type": monthly ? "UnitPriceSpecification" : "PriceSpecification",
              minPrice: price, priceCurrency: "EUR",
              ...(monthly ? { unitCode: "MON", unitText: "month" } : {}),
            },
          }),
        },
      };
    }));
  }
  graph.push(webPage(page.id === "about" ? "AboutPage" : page.id === "contact" ? "ContactPage" : "WebPage", page, page.id === "about" ? { mainEntity: { "@id": MARIO } } : {}));
  return { "@context": "https://schema.org", "@graph": graph };
}

