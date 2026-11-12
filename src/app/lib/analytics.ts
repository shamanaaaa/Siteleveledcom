/*
 * Visit statistics: Umami on our own server (stats.siteleveled.com), no cookies. The tracker tag is in
 * index.html; this only reports the one event the pages count. What it collects is described in
 * PrivacyPage.tsx ("Štatistika návštevnosti"), so change that text when this sends anything new.
 * No personal data from the form goes here.
 */
declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string>) => unknown };
  }
}

/** Call once /api/navrh has accepted an enquiry. Does nothing when the tracker is blocked or not loaded */
export function trackEnquiry(form: "uvod" | "kontakt" | "eshop", locale: string) {
  try {
    window.umami?.track("dopyt", { formular: form, jazyk: locale });
  } catch {
    // Statistics must never break a form that was already sent
  }
}
