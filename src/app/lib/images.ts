// Phones always get the 720 px file: that is still about 2x on a 3x screen, at about half the weight.
// "240px" is what makes 3x screens choose it (240 × 3 = 720)
export const IMAGE_SIZES = "(max-width: 767px) 240px, 800px";

/** srcset for an image in public/ that has a -720 version beside it: /a.webp also offers /a-720.webp */
export const imageSrcSet = (src: string, width: number) =>
  `${src.replace(/(\.\w+)$/, "-720$1")} 720w, ${src} ${width}w`;
