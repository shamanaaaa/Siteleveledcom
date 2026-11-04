import type english from "./en.json";
import type { Locale } from "./routes";
export type MessageKey = keyof typeof english;
export type Messages = Record<MessageKey, string>;
export const dictionaries: Record<Locale, Messages> = { sk: {} as Messages, en: {} as Messages };
let englishReady: Promise<void> | undefined;
export function loadMessages(locale: Locale): Promise<void> {
  if (locale === "sk") return Promise.resolve();
  return englishReady ??= import("./en.json").then(module => {
    dictionaries.en = module.default;
    dictionaries.sk = Object.fromEntries(Object.keys(module.default).map(key => [key, key])) as Messages;
  });
}
/** Translate display content only. Original Slovak strings remain stable keys in shared content. */
export function translate<T>(value: T, locale: Locale): T {
  if (locale === "sk") return value;
  if (typeof value === "string") {
    const key = value.replace(/\s+/g, " ").trim() as MessageKey;
    const translated = dictionaries.en[key];
    if (!translated) return value;
    return ((value.match(/^\s*/)?.[0] ?? "") + translated + (value.match(/\s*$/)?.[0] ?? "")) as T;
  }
  if (Array.isArray(value)) return value.map(item => translate(item, locale)) as T;
  // Content records are localized, React elements and callbacks remain intact.
  if (value && typeof value === "object" && !("$$typeof" in value) && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translate(item, locale)])) as T;
  }
  return value;
}
