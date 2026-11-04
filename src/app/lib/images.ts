import type { Locale } from "../i18n/routes";

const PROJECT_PREVIEWS = [
  { src: "/mdfoto-preview.webp", skHeight: 897, enHeight: 896 },
  { src: "/zuzu-photo-preview.webp", skHeight: 1079, enHeight: 1078 },
  { src: "/nosekrst-preview.webp", skHeight: 972, enHeight: 624 },
  { src: "/fotkynavyber-preview.webp", skHeight: 1020, enHeight: 980 },
  { src: "/sanifix-preview.webp", skHeight: 1000, enHeight: 1000 },
  { src: "/zeriavynitra-preview.webp", skHeight: 1000, enHeight: 1000 },
  { src: "/jogaslaskou-preview.webp", skHeight: 1000, enHeight: 1000 },
  { src: "/springnitra-preview.webp", skHeight: 1000, enHeight: 1000 },
] as const;
export const PROJECT_PREVIEW_IMAGES = PROJECT_PREVIEWS.map(preview => preview.src);

/** Reserve each screenshot's natural proportions before lazy loading finishes. */
export function projectPreviewDimensions(src: string, locale: Locale) {
  const preview = PROJECT_PREVIEWS.find(preview => preview.src === src);
  return preview ? { width: 1200, height: locale === "en" ? preview.enHeight : preview.skHeight } : {};
}

/** English portfolio screenshots use translated lettering and retain the original project branding. */
export function localizedImage(src: string, locale: Locale) {
  return locale === "en" && PROJECT_PREVIEW_IMAGES.some(image => image === src)
    ? `/images/en${src}`
    : src;
}

// Phones always get the 720 px file: that is still about 2x on a 3x screen, at about half the weight.
// "240px" is what makes 3x screens choose it (240 × 3 = 720)
export const IMAGE_SIZES = "(max-width: 767px) 240px, 800px";

/** srcset for an image in public/ that has a -720 version beside it: /a.webp also offers /a-720.webp */
export const imageSrcSet = (src: string, width: number) =>
  `${src.replace(/(\.\w+)$/, "-720$1")} 720w, ${src} ${width}w`;
