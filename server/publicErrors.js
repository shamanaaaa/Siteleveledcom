const messages = require("./publicMessages.json");
function errorCode(error) {
  return Object.keys(messages).find(code => code === error || messages[code].sk === error || messages[code].en === error)
    || (String(error).startsWith("Denný limit auditov") ? "AUDIT_LIMIT" : "PUBLIC_ERROR");
}
function formatWait(ms) {
  const minutes = Math.ceil(Math.max(0, Number(ms) || 0) / 60000);
  const hours = Math.floor(minutes / 60);
  return hours ? `${hours} h ${minutes % 60} min` : `${minutes} min`;
}
function publicError(error, locale = "sk", data = {}) {
  const code = errorCode(error);
  let message = code === "PUBLIC_ERROR" && locale !== "en" && error !== "PUBLIC_ERROR" ? String(error) : messages[code][locale === "en" ? "en" : "sk"];
  message = message.replace("{wait}", data.wait || formatWait(data.waitMs));
  return { code, error: message, ...(Object.keys(data).length ? { data } : {}) };
}
// Response-time localization: shared persisted audit jobs never acquire a visitor's language.
function localizedErrors(req, res, next) {
  if (res.locals.localizedErrors) return next();
  res.locals.localizedErrors = true;
  const json = res.json.bind(res);
  res.json = body => {
    if (body && typeof body === "object" && body.error) {
      const locale = req.body?.locale === "en" || req.get("X-Site-Locale") === "en" ? "en" : "sk";
      let data = body.data || {};
      if (errorCode(body.error) === "AUDIT_LIMIT" && !data.waitMs) {
        const wait = String(body.error).match(/ o (.+)\.$/)?.[1];
        if (wait) data = { ...data, wait };
      }
      body = { ...body, ...publicError(body.code || body.error, locale, data) };
    }
    return json(body);
  };
  next();
}
module.exports = { errorCode, publicError, localizedErrors };
