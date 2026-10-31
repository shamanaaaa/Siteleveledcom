import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Send } from "lucide-react";
import { AnimateIn } from "../AnimateIn";

const inputClass = (error?: string) =>
  `w-full px-4 py-3 rounded-xl bg-surface-2 border text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/60 focus:ring-2 focus:ring-[#6C63FF]/15 transition-colors text-[0.9rem] ${
    error ? "border-red-500/50" : "border-white/8"
  }`;

export function LeadFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    webUrl: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Povinné pole";
    if (!formData.email.trim()) {
      newErrors.email = "Povinné pole";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Neplatný email";
    }
    if (!formData.company.trim()) newErrors.company = "Povinné pole";
    return newErrors;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitError("");
    setIsLoading(true);
    // The admin email links the address, so "www.firma.sk" needs a scheme
    const url = formData.webUrl.trim();
    const webUrl = url && !/^https?:\/\//i.test(url) ? `https://${url}` : url;
    try {
      const res = await fetch("/api/navrh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          hasWeb: webUrl ? "ano" : "",
          webUrl,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Server error");
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Odoslanie zlyhalo. Skúste znova alebo napíšte na domansro@gmail.com"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="formular" className="py-24 md:py-32 bg-[#0d0d14]">
      <div className="max-w-3xl mx-auto px-6">
        <AnimateIn className="text-center mb-12">
          <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-tight mb-4">
            Chcete návrh{" "}
            <span className="text-[#6C63FF]">zadarmo?</span>
          </h2>
          <p className="text-[1rem] text-[#F5F5F0]/50">
            Stačí meno, email a pár slov o vašej firme. Zvyšok doladíme spolu.
          </p>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="relative space-y-5 overflow-hidden rounded-card border border-white/8 bg-surface-1 p-8"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6C63FF]/60 to-transparent"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="lead-name" className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                      Meno *
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Ján Novák"
                      className={inputClass(errors.name)}
                    />
                    {errors.name && (
                      <p className="text-[0.75rem] text-red-400 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lead-email" className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                      Email *
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="jan@firma.sk"
                      className={inputClass(errors.email)}
                    />
                    {errors.email && (
                      <p className="text-[0.75rem] text-red-400 mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lead-company" className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                      Firma a čomu sa venujete *
                    </label>
                    <input
                      id="lead-company"
                      type="text"
                      autoComplete="organization"
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      placeholder="Napr. Kaderníctvo Anna, Nitra"
                      className={inputClass(errors.company)}
                    />
                    {errors.company && (
                      <p className="text-[0.75rem] text-red-400 mt-1">{errors.company}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lead-web" className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                      Súčasný web <span className="text-[#F5F5F0]/25">(ak máte)</span>
                    </label>
                    <input
                      id="lead-web"
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      value={formData.webUrl}
                      onChange={(e) => handleChange("webUrl", e.target.value)}
                      placeholder="www.vasweb.sk"
                      className={inputClass()}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#6C63FF] hover:bg-[#5b53e8] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(108,99,255,0.3)] text-[0.95rem]"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                        </svg>
                        Odosielam...
                      </>
                    ) : (
                      <>Odoslať a získať návrh zadarmo <Send size={16} /></>
                    )}
                  </button>
                  {submitError && (
                    <p className="mt-3 text-[0.8rem] text-red-400">
                      {submitError}
                    </p>
                  )}
                  {!submitError && (
                    <p className="mt-3 text-[0.75rem] text-[#F5F5F0]/30">
                      Do 24 hodín vás kontaktujeme. Žiadny spam, žiadne záväzky.
                    </p>
                  )}
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center p-8 rounded-card border border-white/8 bg-surface-1"
              >
                <div className="w-16 h-16 rounded-full bg-[#1AFF8C]/10 flex items-center justify-center mb-6">
                  <CheckCircle2 size={32} className="text-[#1AFF8C]" />
                </div>
                <h3 className="font-heading text-[1.5rem] text-[#F5F5F0] mb-3">
                  Ďakujeme!
                </h3>
                <p className="text-[0.9rem] text-[#F5F5F0]/50 max-w-sm leading-relaxed">
                  Váš formulár bol odoslaný. Do 24 hodín sa vám ozveme s profesionálnym návrhom vašej webstránky.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimateIn>
      </div>
    </section>
  );
}
