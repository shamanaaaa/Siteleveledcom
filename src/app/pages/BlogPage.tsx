import { Link } from "react-router";
import { ArrowRight, Clock } from "lucide-react";
import { GlowCard } from "../components/fx/GlowCard";
import { PageHero } from "../components/fx/PageHero";
import { POSTS, formatDate, postPath } from "../blog/posts";

// Slovak only. Lists the published articles from posts.ts, newest first
export function BlogPage() {
  return (
    <>
      <PageHero
        title="Blog o tvorbe webu a SEO"
        segments={[
          { text: "Poznatky z praxe." },
          { text: "Nie teória.", className: "text-gradient-primary" },
        ]}
        sub="Praktické rady o cenách, tvorbe webu a SEO pre slovenské firmy a živnostníkov."
      />

      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {POSTS.map((post) => (
              <li key={post.slug} className="h-full">
                <Link to={postPath(post.slug)} className="block h-full rounded-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9F97FF]">
                  <GlowCard className="h-full">
                    <div className="flex h-full flex-col p-7">
                      <p className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] text-[#F5F5F0]/60">
                        <time dateTime={post.published}>{formatDate(post.published)}</time>
                        <span className="flex items-center gap-1"><Clock size={12} /> {post.readMinutes} min čítania</span>
                      </p>
                      <h2 className="mb-3 font-heading text-[1.2rem] font-bold leading-snug text-[#F5F5F0] transition-colors group-hover/glow:text-[#9F97FF]">
                        {post.heading}
                      </h2>
                      <p className="mb-6 flex-1 text-[0.9rem] leading-relaxed text-[#F5F5F0]/65">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-1.5 text-[0.9rem] text-[#9F97FF]">
                        Čítať článok <ArrowRight size={15} />
                      </span>
                    </div>
                  </GlowCard>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
