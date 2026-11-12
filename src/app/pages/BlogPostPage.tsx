import { Link, useLocation } from "react-router";
import { ChevronRight } from "lucide-react";
import { ARTICLES } from "../blog/articles";
import { formatDate, postForPath } from "../blog/posts";
import { normalizePath } from "../i18n/routes";
import { Aurora } from "../components/fx/Aurora";

// Slovak only. No fades anywhere: the heading is the largest text, and readers scroll fast
export function BlogPostPage() {
  const { pathname } = useLocation();
  const post = postForPath(normalizePath(pathname));
  const Body = post && ARTICLES[post.slug];
  // Routes exist only for posts.ts entries, so this stops the build when a body is missing
  if (!post || !Body) throw new Error(`No article body for ${pathname}`);

  return (
    <article>
      <header className="relative overflow-hidden pb-10 pt-36 md:pb-12 md:pt-44">
        <Aurora variant="hero" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6C63FF]/25 to-transparent" />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <nav aria-label="Navigačná cesta" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.8rem] text-[#F5F5F0]/60">
              <li><Link to="/" className="hover:text-[#9F97FF]">Domov</Link></li>
              <li aria-hidden><ChevronRight size={13} /></li>
              <li><Link to="/blog/" className="hover:text-[#9F97FF]">Blog</Link></li>
            </ol>
          </nav>
          <h1 className="mb-6 font-heading text-title font-bold text-[#F5F5F0]">{post.heading}</h1>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.85rem] text-[#F5F5F0]/60">
            <Link to="/o-nas/" className="text-[#F5F5F0]/80 underline decoration-white/25 underline-offset-4 hover:text-[#9F97FF]">Mário Doman</Link>
            <span aria-hidden>·</span>
            <span>
              {post.modified === post.published ? "Publikované " : "Aktualizované "}
              <time dateTime={post.modified}>{formatDate(post.modified)}</time>
            </span>
            <span aria-hidden>·</span>
            <span>{post.readMinutes} min čítania</span>
          </p>
        </div>
      </header>

      {/* The footer's call to action follows directly, so the article doesn't repeat it */}
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <Body />
      </div>
    </article>
  );
}
