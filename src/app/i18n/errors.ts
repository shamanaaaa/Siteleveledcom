import messages from "../../../server/publicMessages.json";
import type { Locale } from "./routes";
type ErrorCode = keyof typeof messages;
export interface PublicFailure { code?: string; error?: string; data?: { waitMs?: number; wait?: string } }
export function errorMessage(failure: PublicFailure, locale: Locale, fallback: string) {
  // Exact historical Slovak messages are accepted during staggered frontend/backend releases.
  const code = (failure.code && failure.code in messages ? failure.code : Object.keys(messages).find(key => {
    const message = messages[key as ErrorCode];
    return message.sk === failure.error || message.en === failure.error;
  })) as ErrorCode | undefined;
  if (!code) {
    const oldLimit = failure.error?.match(/^Denný limit auditov.* o (.+)\.$/);
    if (oldLimit) return messages.AUDIT_LIMIT[locale].replace("{wait}", oldLimit[1]);
    return locale === "sk" ? failure.error || fallback : fallback;
  }
  const minutes = Math.ceil(Math.max(0, failure.data?.waitMs || 0) / 60000);
  const hours = Math.floor(minutes / 60);
  const wait = failure.data?.wait ?? (hours ? `${hours} h ${minutes % 60} min` : `${minutes} min`);
  return messages[code][locale].replace("{wait}", wait);
}
