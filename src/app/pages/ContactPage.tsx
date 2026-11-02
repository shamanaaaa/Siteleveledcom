import { useState } from "react";
import { Link } from "react-router";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Linkedin,
  Facebook,
  Send,
  CheckCircle2,
} from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { motion, AnimatePresence } from "motion/react";
import { useTypedBeforeLoad } from "../lib/useTypedBeforeLoad";
import { GlowCard } from "../components/fx/GlowCard";
import { PageHero } from "../components/fx/PageHero";
import {
  chipActive,
  chipBase,
  chipIdle,
  inputBase,
  inputDefaultBorder,
  inputErrorBorder,
  labelBase,
} from "../components/forms/fieldStyles";

const SEND_FAILED = "Odoslanie zlyhalo. Skúste to o chvíľu znova alebo napíšte na info@siteleveled.com.";

const serviceOptions = ["Nový web", "E-shop", "Audit", "Správa", "Iné"];

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Povinné pole";
    if (!formData.company.trim()) newErrors.company = "Povinné pole";
    if (!formData.email.trim()) {
      newErrors.email = "Povinné pole";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Neplatný email";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitError("");
    setIsLoading(true);
    // /api/navrh has no phone or service field, so both go into the notes of the admin email
    const notes = [
      formData.phone.trim() && `Telefón: ${formData.phone.trim()}`,
      formData.service && `Záujem: ${formData.service}`,
      formData.message.trim(),
    ]
      .filter(Boolean)
      .join("\n");
    try {
      const res = await fetch("/api/navrh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          notes,
          // Tells the server to send the contact wording, not the free-proposal one
          source: "kontakt",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        // While the backend restarts (a few seconds per deploy) nginx answers 502 with HTML, not JSON
        throw new Error(body.error || SEND_FAILED);
      }
      setSubmitted(true);
    } catch (err) {
      // fetch itself fails with an English TypeError ("Failed to fetch") when the connection drops
      setSubmitError(err instanceof Error && !(err instanceof TypeError) ? err.message : SEND_FAILED);
    } finally {
      setIsLoading(false);
    }
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
  useTypedBeforeLoad("contact-form", handleChange);

  return (
    <>
      <PageHero
        title="Kontaktujte nás"
        segments={[
          { text: "Porozprávajme" },
          { text: "sa.", className: "text-gradient-primary" },
        ]}
        sub="Napíšte nám alebo zavolajte. Ozveme sa vám do 24 hodín v pracovný deň."
      />

      {/* Form + Contact info */}
      <section className="pb-32 pt-4">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <AnimateIn>
                <GlowCard className="p-6 sm:p-8">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6C63FF]/60 to-transparent"
                  />
                  <AnimatePresence mode="wait">
                    {!submitted ? (
                      <motion.form
                        key="form"
                        id="contact-form"
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <div>
                            <label htmlFor="contact-name" className={labelBase}>
                              Meno a priezvisko *
                            </label>
                            <input
                              id="contact-name"
                              name="name"
                              type="text"
                              autoComplete="name"
                              value={formData.name}
                              onChange={(e) => handleChange("name", e.target.value)}
                              className={`${inputBase} ${
                                errors.name ? inputErrorBorder : inputDefaultBorder
                              }`}
                              placeholder="Ján Novák"
                            />
                            {errors.name && (
                              <p className="mt-1 text-[0.75rem] text-red-400">{errors.name}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="contact-company" className={labelBase}>
                              Firma / projekt *
                            </label>
                            <input
                              id="contact-company"
                              name="company"
                              type="text"
                              autoComplete="organization"
                              value={formData.company}
                              onChange={(e) => handleChange("company", e.target.value)}
                              className={`${inputBase} ${
                                errors.company ? inputErrorBorder : inputDefaultBorder
                              }`}
                              placeholder="Názov firmy"
                            />
                            {errors.company && (
                              <p className="mt-1 text-[0.75rem] text-red-400">{errors.company}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <div>
                            <label htmlFor="contact-email" className={labelBase}>
                              Email *
                            </label>
                            <input
                              id="contact-email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              value={formData.email}
                              onChange={(e) => handleChange("email", e.target.value)}
                              className={`${inputBase} ${
                                errors.email ? inputErrorBorder : inputDefaultBorder
                              }`}
                              placeholder="jan@firma.sk"
                            />
                            {errors.email && (
                              <p className="mt-1 text-[0.75rem] text-red-400">{errors.email}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="contact-phone" className={labelBase}>
                              Telefón
                            </label>
                            <input
                              id="contact-phone"
                              name="phone"
                              type="tel"
                              autoComplete="tel"
                              value={formData.phone}
                              onChange={(e) => handleChange("phone", e.target.value)}
                              className={`${inputBase} ${inputDefaultBorder}`}
                              placeholder="+421 ..."
                            />
                          </div>
                        </div>

                        <div>
                          <p id="contact-service" className={labelBase}>
                            Čo potrebujete?
                          </p>
                          <div role="group" aria-labelledby="contact-service" className="flex flex-wrap gap-2">
                            {serviceOptions.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                aria-pressed={formData.service === opt}
                                onClick={() =>
                                  handleChange("service", formData.service === opt ? "" : opt)
                                }
                                className={`${chipBase} ${
                                  formData.service === opt ? chipActive : chipIdle
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="contact-message" className={labelBase}>
                            Povedzte nám viac...
                          </label>
                          <textarea
                            id="contact-message"
                            name="message"
                            value={formData.message}
                            onChange={(e) => handleChange("message", e.target.value)}
                            rows={5}
                            className={`${inputBase} ${inputDefaultBorder} resize-none`}
                            placeholder="Opíšte nám svoj projekt, ciele alebo akékoľvek otázky..."
                          />
                        </div>

                        {submitError && (
                          <p role="alert" className="text-[0.85rem] text-red-400">
                            {submitError}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="inline-flex items-center gap-2 rounded-full bg-[#6C63FF] px-8 py-4 text-[0.95rem] font-semibold text-white shadow-[0_8px_32px_rgba(108,99,255,0.35)] transition-all duration-200 hover:bg-[#7B73FF] hover:shadow-[0_8px_44px_rgba(108,99,255,0.5)] disabled:cursor-wait disabled:opacity-60"
                        >
                          {isLoading ? "Odosielam…" : "Odoslať"} <Send size={16} />
                        </button>

                        <p className="text-[0.75rem] text-[#F5F5F0]/50">
                          Údaje použijeme len na odpoveď na váš dopyt.{" "}
                          <Link to="/ochrana-osobnych-udajov/" className="underline transition-colors hover:text-[#9F97FF]">
                            Ochrana osobných údajov
                          </Link>
                        </p>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                      >
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#1AFF8C]/10">
                          <CheckCircle2 size={32} className="text-[#1AFF8C]" />
                        </div>
                        <h2 className="mb-3 font-heading text-[1.5rem] font-bold text-[#F5F5F0]">
                          Ďakujeme!
                        </h2>
                        <p className="max-w-sm text-[0.9rem] text-[#F5F5F0]/60">
                          Ozveme sa do 24 hodín v pracovný deň. Medzitým si môžete pozrieť naše{" "}
                          <Link to="/portfolio/" className="text-[#9F97FF] hover:underline">
                            projekty
                          </Link>{" "}
                          alebo{" "}
                          <Link to="/cennik/" className="text-[#9F97FF] hover:underline">
                            cenník
                          </Link>
                          .
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlowCard>
              </AnimateIn>
            </div>

            {/* Contact info sidebar */}
            <div className="lg:col-span-2">
              <AnimateIn delay={0.2} direction="right">
                <div className="space-y-6">
                  <GlowCard className="p-6">
                    <h2 className="mb-5 font-heading text-[1rem] font-bold text-[#F5F5F0]">
                      Kontaktné údaje
                    </h2>
                    <div className="space-y-4">
                      <a
                        href="mailto:info@siteleveled.com"
                        className="flex items-center gap-3 text-[0.875rem] text-[#F5F5F0]/60 transition-colors hover:text-[#9F97FF]"
                      >
                        <Mail size={18} className="shrink-0 text-[#6C63FF]" />
                        info@siteleveled.com
                      </a>
                      <a
                        href="tel:+421910803993"
                        className="flex items-center gap-3 text-[0.875rem] text-[#F5F5F0]/60 transition-colors hover:text-[#9F97FF]"
                      >
                        <Phone size={18} className="shrink-0 text-[#6C63FF]" />
                        0910 803 993 (Mário Doman, vývojár)
                      </a>
                      <div className="flex items-center gap-3 text-[0.875rem] text-[#F5F5F0]/60">
                        <Clock size={18} className="shrink-0 text-[#6C63FF]" />
                        Odpovieme do 24 hodín v pracovný deň
                      </div>
                      <div className="flex items-center gap-3 text-[0.875rem] text-[#F5F5F0]/60">
                        <MapPin size={18} className="shrink-0 text-[#6C63FF]" />
                        Slovensko (pracujeme remote, celá SR)
                      </div>
                    </div>
                  </GlowCard>

                  <GlowCard className="p-6">
                    <h2 className="mb-4 font-heading text-[1rem] font-bold text-[#F5F5F0]">
                      Fakturačné údaje
                    </h2>
                    <div className="space-y-1 text-[0.85rem] text-[#F5F5F0]/50">
                      <p className="text-[#F5F5F0]/80">DOMAN s.r.o.</p>
                      <p>IČO: 47 912 383</p>
                      <p>Konateľka: Mária Domanová</p>
                      <p>Ulica Funduše 1165/26</p>
                      <p>Cabaj-Čápor 951 17</p>
                    </div>
                  </GlowCard>

                  <GlowCard className="p-6">
                    <h2 className="mb-4 font-heading text-[1rem] font-bold text-[#F5F5F0]">
                      Sociálne siete
                    </h2>
                    <div className="flex gap-4">
                      {[
                        {
                          icon: Linkedin,
                          label: "LinkedIn",
                          href: "https://www.linkedin.com/in/m%C3%A1rio-doman-65b08663/",
                        },
                        { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/mario.doman" },
                      ].map(({ icon: Icon, label, href }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-[#F5F5F0]/40 transition-all hover:bg-[#6C63FF]/10 hover:text-[#9F97FF]"
                        >
                          <Icon size={18} />
                        </a>
                      ))}
                    </div>
                  </GlowCard>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
