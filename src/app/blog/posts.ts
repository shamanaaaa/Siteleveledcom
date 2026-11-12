/*
 * Published articles, newest first. Metadata only, so the SEO table can import it without the
 * article bodies. Each slug needs a body in src/app/blog/articles.tsx; the build writes
 * dist/blog/<slug>/index.html from src/app/seo/pages.ts. Articles are Slovak only, so they have
 * no hreflang pair. Every fact in a body must already be confirmed for the live pages.
 */
export interface BlogPost {
  slug: string;
  /** The h1 and the breadcrumb label */
  heading: string;
  /** <title>, with the brand */
  title: string;
  description: string;
  /** Teaser on /blog/ */
  excerpt: string;
  /** ISO dates. Change `modified` only when the content changes */
  published: string;
  modified: string;
  readMinutes: number;
}

export const POSTS: BlogPost[] = [
  {
    slug: "eshop-alebo-web",
    heading: "E-shop alebo jednoduchý web? Ako sa rozhodnúť",
    title: "E-shop alebo jednoduchý web? Ako sa rozhodnúť | SiteLeveled",
    description:
      "Kedy stačí web od 300 € a kedy sa oplatí e-shop od 1 000 €. Rozdiel v cene, čase a práci po spustení, medzikrok s katalógom a čo si pripraviť.",
    excerpt:
      "Kedy stačí jednoduchý web, kedy sa oplatí e-shop a kedy pomôže katalóg s nezáväzným dopytom. Porovnanie ceny, času a práce, ktorá príde po spustení.",
    published: "2026-11-12",
    modified: "2026-11-12",
    readMinutes: 4,
  },
  {
    slug: "kolko-stoji-webstranka",
    heading: "Koľko stojí webstránka a od čoho závisí cena",
    title: "Koľko stojí webstránka a od čoho závisí cena | SiteLeveled",
    description:
      "Web od 300 €, e-shop od 1 000 €: čo je v cene, čo ju zvyšuje, koľko ročne stojí doména a správa a na čo sa opýtať, kým si web objednáte.",
    excerpt:
      "Čo dostanete za 300 €, prečo e-shop začína na 1 000 €, čo cenu zvyšuje a s akými ročnými nákladmi počítať. Na konci nájdete otázky, podľa ktorých porovnáte ponuky.",
    published: "2026-11-12",
    modified: "2026-11-12",
    readMinutes: 5,
  },
];

export const postPath = (slug: string) => `/blog/${slug}/`;
export const postForPath = (path: string) => POSTS.find(post => postPath(post.slug) === path);

/** "12. novembra 2026" */
export const formatDate = (iso: string) => {
  const months = ["januára", "februára", "marca", "apríla", "mája", "júna", "júla", "augusta", "septembra", "októbra", "novembra", "decembra"];
  const [year, month, day] = iso.split("-").map(Number);
  return `${day}. ${months[month - 1]} ${year}`;
};
