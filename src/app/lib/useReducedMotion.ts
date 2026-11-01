import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const media = matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

/**
 * Like motion's hook, but false while React attaches to a pre-rendered page: that HTML was built
 * without knowing the visitor's setting, and the first browser render has to match it.
 */
export const useReducedMotion = () => useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false);
