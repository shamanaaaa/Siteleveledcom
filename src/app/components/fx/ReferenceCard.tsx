import { ExternalLink } from "lucide-react";
import { IMAGE_SIZES, imageSrcSet, projectPreviewDimensions } from "../../lib/images";
import { GlowCard } from "./GlowCard";

export interface Reference {
  name: string;
  url: string;
  /** A preview in public/ with a -720 version beside it */
  image: string;
  category: string;
  text: string;
  /** A recommendation the client left on the SiteLeveled Facebook page, quoted as written */
  review?: { text: string; author: string };
}

// One client project with its screenshot, for the Slovak-only pages (the texts are not translated)
export function ReferenceCard({ project }: { project: Reference }) {
  return (
    <GlowCard>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-[16/10] overflow-hidden bg-bg-deep lg:aspect-auto lg:min-h-[20rem]"
        >
          <img
            src={project.image}
            srcSet={imageSrcSet(project.image, 1200)}
            sizes={IMAGE_SIZES}
            {...projectPreviewDimensions(project.image, "sk")}
            alt={`Ukážka webu ${project.name}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/60 to-transparent" />
        </a>
        <div className="flex flex-col justify-center p-8 md:p-10">
          <p className="mb-2 text-[0.75rem] uppercase tracking-wider text-[#9F97FF]">{project.category}</p>
          <h3 className="mb-4 font-heading text-[1.5rem] font-bold text-[#F5F5F0] sm:text-[1.75rem]">{project.name}</h3>
          <p className="mb-6 text-[0.9rem] leading-relaxed text-[#F5F5F0]/60">{project.text}</p>
          {project.review && (
            <figure className="mb-6">
              <blockquote className="text-[0.9rem] italic leading-relaxed text-[#F5F5F0]/75">„{project.review.text}“</blockquote>
              <figcaption className="mt-2 text-[0.8rem] text-[#F5F5F0]/60">— {project.review.author}</figcaption>
            </figure>
          )}
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[0.9rem] text-[#9F97FF] transition-colors hover:text-[#F5F5F0]"
          >
            Pozrieť {project.name} <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </GlowCard>
  );
}
