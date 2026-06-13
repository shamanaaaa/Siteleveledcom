import { useState } from "react";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Linkedin,
  Instagram,
  Github,
  Send,
  CheckCircle2,
} from "lucide-react";
import { AnimateIn } from "../components/AnimateIn";
import { motion, AnimatePresence } from "motion/react";
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

const serviceOptions = ["Nový web", "Audit", "Správa", "Konzultácia", "Iné"];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
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

  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        segments={[
          { text: "Porozprávajme" },
          { text: "sa.", className: "text-gradient-primary" },
        ]}
        sub="Bezplatná 30-minútová konzultácia. Bez záväzku. Len úprimný rozhovor o tvojom projekte."
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
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <div>
                            <label className={labelBase}>Meno a priezvisko *</label>
                            <input
                              type="text"
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
                            <label className={labelBase}>Firma / projekt *</label>
                            <input
                              type="text"
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
                            <label className={labelBase}>Email *</label>
                            <input
                              type="email"
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
                            <label className={labelBase}>Telefón</label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleChange("phone", e.target.value)}
                              className={`${inputBase} ${inputDefaultBorder}`}
                              placeholder="+421 ..."
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelBase}>Čo potrebuješ?</label>
                          <div className="flex flex-wrap gap-2">
                            {serviceOptions.map((opt) => (
                              <button
                                key={opt}
                                type="button"
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
                          <label className={labelBase}>Povedz nám viac...</label>
                          <textarea
                            value={formData.message}
                            onChange={(e) => handleChange("message", e.target.value)}
                            rows={5}
                            className={`${inputBase} ${inputDefaultBorder} resize-none`}
                            placeholder="Opíš nám svoj projekt, ciele, alebo akékoľvek otázky..."
                          />
                        </div>

                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-full bg-[#6C63FF] px-8 py-4 text-[0.95rem] font-semibold text-white shadow-[0_8px_32px_rgba(108,99,255,0.35)] transition-all duration-200 hover:bg-[#7B73FF] hover:shadow-[0_8px_44px_rgba(108,99,255,0.5)]"
                        >
                          Odoslať <Send size={16} />
                        </button>
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
                        <h3 className="mb-3 font-heading text-[1.5rem] font-bold text-[#F5F5F0]">
                          Ďakujeme!
                        </h3>
                        <p className="max-w-sm text-[0.9rem] text-[#F5F5F0]/50">
                          Ozveme sa do 24 hodín v pracovný deň. Medzitým si môžeš pozrieť naše{" "}
                          <a href="/portfolio" className="text-[#9F97FF] hover:underline">
                            projekty
                          </a>{" "}
                          alebo{" "}
                          <a href="/blog" className="text-[#9F97FF] hover:underline">
                            blog
                          </a>
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
                    <h3 className="mb-5 font-heading text-[1rem] font-bold text-[#F5F5F0]">
                      Kontaktné údaje
                    </h3>
                    <div className="space-y-4">
                      <a
                        href="mailto:domansro@gmail.com"
                        className="flex items-center gap-3 text-[0.875rem] text-[#F5F5F0]/60 transition-colors hover:text-[#9F97FF]"
                      >
                        <Mail size={18} className="shrink-0 text-[#6C63FF]" />
                        domansro@gmail.com
                      </a>
                      <div className="flex items-center gap-3 text-[0.875rem] text-[#F5F5F0]/60">
                        <Phone size={18} className="shrink-0 text-[#6C63FF]" />
                        +421 XXX XXX XXX
                      </div>
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
                    <h3 className="mb-4 font-heading text-[1rem] font-bold text-[#F5F5F0]">
                      Fakturačné údaje
                    </h3>
                    <div className="space-y-1 text-[0.85rem] text-[#F5F5F0]/50">
                      <p className="text-[#F5F5F0]/80">doman s.r.o.</p>
                      <p>Konateľka: Mária Domanová</p>
                      <p>Ulica Funduše 1165/26</p>
                      <p>Cabaj-Čápor 951 17</p>
                    </div>
                  </GlowCard>

                  <GlowCard className="p-6">
                    <h3 className="mb-4 font-heading text-[1rem] font-bold text-[#F5F5F0]">
                      Sociálne siete
                    </h3>
                    <div className="flex gap-4">
                      {[
                        { icon: Linkedin, label: "LinkedIn" },
                        { icon: Instagram, label: "Instagram" },
                        { icon: Github, label: "GitHub" },
                      ].map(({ icon: Icon, label }) => (
                        <a
                          key={label}
                          href="#"
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
