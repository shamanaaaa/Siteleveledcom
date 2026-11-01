import { useEffect, useRef } from "react";

// One observer for all reveals on a page. The attribute is set directly, so a reveal never re-renders React
let observer: IntersectionObserver | undefined;

function observe(el: Element) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        target.setAttribute("data-shown", "");
        observer?.unobserve(target);
      }
    },
    { rootMargin: "-50px" },
  );
  observer.observe(el);
  return () => observer?.unobserve(el);
}

/** Marks the element with data-shown once it scrolls into view; the animation itself is CSS (theme.css) */
export function useReveal<T extends Element>(enabled = true) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (enabled && ref.current) return observe(ref.current);
  }, [enabled]);
  return ref;
}
