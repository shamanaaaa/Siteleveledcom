import { useCallback, useRef } from "react";

/*
 * Cloudflare Turnstile on the forms that send email (home, e-shop, /kontakt/). The check loads only
 * once the visitor starts filling in a form, so reading the site never contacts Cloudflare, as the
 * privacy page says ("Cookies a úložisko v prehliadači"). The server checks the token when
 * TURNSTILE_SECRET_KEY is set (server/formGuard.js). With no site key here the forms send no token.
 */
// Public by design (every visitor's page contains it): Cloudflare dashboard → Turnstile → siteleveled.com
export const TURNSTILE_SITE_KEY = "0x4AAAAAAF-ijjHtxiUxiTG9";
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface Turnstile {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
}
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let script: Promise<Turnstile> | null = null;
function loadScript() {
  script ??= new Promise<Turnstile>((resolve, reject) => {
    const el = document.createElement("script");
    // Blocked or stuck: forget the attempt, so the next send tries again
    const fail = () => {
      clearTimeout(timer);
      el.remove();
      script = null;
      reject(new Error("Turnstile did not load"));
    };
    const timer = setTimeout(fail, 15000);
    el.src = SCRIPT_URL;
    el.async = true;
    el.onload = () => {
      clearTimeout(timer);
      if (window.turnstile) resolve(window.turnstile);
      else fail();
    };
    el.onerror = fail;
    document.head.append(el);
  });
  return script;
}

interface State {
  el: HTMLDivElement | null;
  api?: Turnstile;
  id?: string;
  token?: Promise<string>;
  settle: (token: string) => void;
  failed: boolean;
}
const idle = (): State => ({ el: null, settle: () => {}, failed: false });

/**
 * box: ref for the element the widget goes in; it only shows when Cloudflare wants a click.
 * start: call when the visitor starts on the form, so the check runs while they type.
 * token: call on submit. Resolves to the token, or "" when the check failed or isn't set up, and
 *   the server's answer then tells the visitor what to do.
 * renew: call after a send that failed, because a token works only once.
 */
export function useTurnstile() {
  const state = useRef<State>(idle());

  // Each wait ends with the widget's next callback: a token, or "" on an error
  const wait = (s: State) => {
    s.failed = false;
    s.token = new Promise<string>((resolve) => (s.settle = resolve));
  };
  const fail = (s: State) => {
    s.failed = true;
    s.settle("");
  };

  const start = useCallback(() => {
    const s = state.current;
    if (!TURNSTILE_SITE_KEY || s.token) return;
    wait(s);
    loadScript()
      .then((api) => {
        if (!s.el) return fail(s);
        s.api = api;
        s.id = api.render(s.el, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "dark",
          size: "flexible",
          appearance: "interaction-only",
          // An error ends the wait at once; the next send starts a fresh check
          retry: "never",
          callback: (token: string) => s.settle(token),
          // A token lasts 5 minutes and the widget fetches the next one by itself
          "expired-callback": () => wait(s),
          "error-callback": () => fail(s),
          "timeout-callback": () => fail(s),
          "unsupported-callback": () => fail(s),
        });
      })
      .catch(() => fail(s));
  }, []);

  const renew = useCallback(() => {
    const s = state.current;
    if (!s.token) return;
    if (s.api && s.id !== undefined) {
      wait(s);
      s.api.reset(s.id);
    } else {
      // The script never loaded: start() loads it again
      s.token = undefined;
    }
  }, []);

  const token = useCallback(async () => {
    if (!TURNSTILE_SITE_KEY) return "";
    if (state.current.failed) renew();
    start();
    return state.current.token ?? "";
  }, [renew, start]);

  // The form leaves the page after a successful send: drop its widget, so a new form starts afresh
  const box = useCallback((el: HTMLDivElement | null) => {
    const s = state.current;
    if (el) {
      s.el = el;
      return;
    }
    s.el = null;
    s.settle("");
    if (s.api && s.id !== undefined) s.api.remove(s.id);
    state.current = idle();
  }, []);

  return { box, start, token, renew };
}
