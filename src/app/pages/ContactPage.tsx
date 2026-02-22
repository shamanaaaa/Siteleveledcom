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

const serviceOptions = [
  "Nový web",
  "Audit",
  "Správa",
  "Konzultácia",
  "Iné",
];

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

  const handleChange = (
    field: string,
    value: string
  ) => {
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
      {/* Hero */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-[#6C63FF]/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <AnimateIn className="max-w-3xl">
            <p className="text-[0.85rem] text-[#6C63FF] mb-4 tracking-wide uppercase">
              Kontakt
            </p>
            <h1 className="font-heading text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] leading-[1.1] mb-6">
              Porozprávajme sa.
            </h1>
            <p className="text-[1.05rem] text-[#F5F5F0]/50 leading-relaxed">
              Bezplatná 30-minútová konzultácia. Bez záväzku. Len úprimný
              rozhovor o tvojom projekte.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Form + Contact info */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <AnimateIn>
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-5"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                            Meno a priezvisko *
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              handleChange("name", e.target.value)
                            }
                            className={`w-full px-4 py-3 rounded-xl bg-[#111118] border text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/40 transition-colors text-[0.9rem] ${
                              errors.name
                                ? "border-red-500/50"
                                : "border-white/8"
                            }`}
                            placeholder="Ján Novák"
                          />
                          {errors.name && (
                            <p className="text-[0.75rem] text-red-400 mt-1">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                            Firma / projekt *
                          </label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) =>
                              handleChange("company", e.target.value)
                            }
                            className={`w-full px-4 py-3 rounded-xl bg-[#111118] border text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/40 transition-colors text-[0.9rem] ${
                              errors.company
                                ? "border-red-500/50"
                                : "border-white/8"
                            }`}
                            placeholder="Názov firmy"
                          />
                          {errors.company && (
                            <p className="text-[0.75rem] text-red-400 mt-1">
                              {errors.company}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleChange("email", e.target.value)
                            }
                            className={`w-full px-4 py-3 rounded-xl bg-[#111118] border text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/40 transition-colors text-[0.9rem] ${
                              errors.email
                                ? "border-red-500/50"
                                : "border-white/8"
                            }`}
                            placeholder="jan@firma.sk"
                          />
                          {errors.email && (
                            <p className="text-[0.75rem] text-red-400 mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                            Telefón
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              handleChange("phone", e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-xl bg-[#111118] border border-white/8 text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/40 transition-colors text-[0.9rem]"
                            placeholder="+421 ..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                          Čo potrebuješ?
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {serviceOptions.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                handleChange(
                                  "service",
                                  formData.service === opt ? "" : opt
                                )
                              }
                              className={`px-4 py-2 rounded-lg text-[0.85rem] transition-all duration-200 border ${
                                formData.service === opt
                                  ? "bg-[#6C63FF] border-[#6C63FF] text-white"
                                  : "border-white/8 text-[#F5F5F0]/40 hover:border-white/15"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                          Povedz nám viac...
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) =>
                            handleChange("message", e.target.value)
                          }
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl bg-[#111118] border border-white/8 text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/40 transition-colors text-[0.9rem] resize-none"
                          placeholder="Opíš nám svoj projekt, ciele, alebo akékoľvek otázky..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#6C63FF] hover:bg-[#5b53e8] text-white rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(108,99,255,0.3)] text-[0.95rem]"
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
                      <div className="w-16 h-16 rounded-full bg-[#1AFF8C]/10 flex items-center justify-center mb-6">
                        <CheckCircle2 size={32} className="text-[#1AFF8C]" />
                      </div>
                      <h3 className="font-heading text-[1.5rem] text-[#F5F5F0] mb-3">
                        Ďakujeme!
                      </h3>
                      <p className="text-[0.9rem] text-[#F5F5F0]/50 max-w-sm">
                        Ozveme sa do 24 hodín v pracovný deň. Medzitým si môžeš
                        pozrieť naše{" "}
                        <a href="/portfolio" className="text-[#6C63FF] hover:underline">
                          projekty
                        </a>{" "}
                        alebo{" "}
                        <a href="/blog" className="text-[#6C63FF] hover:underline">
                          blog
                        </a>
                        .
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </AnimateIn>
            </div>

            {/* Contact info sidebar */}
            <div className="lg:col-span-2">
              <AnimateIn delay={0.2} direction="right">
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-white/5 bg-[#111118]">
                    <h3 className="font-heading text-[1rem] text-[#F5F5F0] mb-5">
                      Kontaktné údaje
                    </h3>
                    <div className="space-y-4">
                      <a
                        href="mailto:info@siteleveled.com"
                        className="flex items-center gap-3 text-[0.875rem] text-[#F5F5F0]/60 hover:text-[#6C63FF] transition-colors"
                      >
                        <Mail size={18} className="text-[#6C63FF] shrink-0" />
                        info@siteleveled.com
                      </a>
                      <div className="flex items-center gap-3 text-[0.875rem] text-[#F5F5F0]/60">
                        <Phone size={18} className="text-[#6C63FF] shrink-0" />
                        +421 XXX XXX XXX
                      </div>
                      <div className="flex items-center gap-3 text-[0.875rem] text-[#F5F5F0]/60">
                        <Clock size={18} className="text-[#6C63FF] shrink-0" />
                        Odpovieme do 24 hodín v pracovný deň
                      </div>
                      <div className="flex items-center gap-3 text-[0.875rem] text-[#F5F5F0]/60">
                        <MapPin size={18} className="text-[#6C63FF] shrink-0" />
                        Slovensko (pracujeme remote, celá SR)
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border border-white/5 bg-[#111118]">
                    <h3 className="font-heading text-[1rem] text-[#F5F5F0] mb-4">
                      Fakturačné údaje
                    </h3>
                    <div className="space-y-1 text-[0.85rem] text-[#F5F5F0]/50">
                      <p className="text-[#F5F5F0]/80">doman s.r.o.</p>
                      <p>Konateľka: Mária Domanová</p>
                      <p>Ulica Funduše 1165/26</p>
                      <p>Cabaj-Čápor 951 17</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border border-white/5 bg-[#111118]">
                    <h3 className="font-heading text-[1rem] text-[#F5F5F0] mb-4">
                      Sociálne siete
                    </h3>
                    <div className="flex gap-4">
                      <a
                        href="#"
                        className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#F5F5F0]/40 hover:text-[#6C63FF] hover:bg-[#6C63FF]/10 transition-all"
                      >
                        <Linkedin size={18} />
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#F5F5F0]/40 hover:text-[#6C63FF] hover:bg-[#6C63FF]/10 transition-all"
                      >
                        <Instagram size={18} />
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#F5F5F0]/40 hover:text-[#6C63FF] hover:bg-[#6C63FF]/10 transition-all"
                      >
                        <Github size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
