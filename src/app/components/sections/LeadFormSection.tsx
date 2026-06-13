import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Send } from "lucide-react";
import { AnimateIn } from "../AnimateIn";

const goalOptions = ["Predaj", "Prezentácia", "Rezervácie", "Iné"];
const styleOptions = ["Moderný", "Minimalistický", "Luxusný", "Neviem"];
const colorOptions = [
  { label: "Tmavá", hex: "#1a1a2e" },
  { label: "Svetlá", hex: "#f5f5f0" },
  { label: "Fialová", hex: "#6C63FF" },
  { label: "Modrá", hex: "#3b82f6" },
  { label: "Zelená", hex: "#1AFF8C" },
  { label: "Červená", hex: "#ef4444" },
  { label: "Zlatá", hex: "#f59e0b" },
  { label: "Neutralná", hex: "#9ca3af" },
];

export function LeadFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    about: "",
    hasWeb: "" as "ano" | "nie" | "",
    webUrl: "",
    goal: [] as string[],
    goalOther: "",
    style: "",
    colors: [] as string[],
    inspiration: "",
    socialMedia: "",
    notes: "",
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

  const toggleGoal = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      goal: prev.goal.includes(val)
        ? prev.goal.filter((g) => g !== val)
        : [...prev.goal, val],
    }));
  };

  const toggleColor = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(val)
        ? prev.colors.filter((c) => c !== val)
        : [...prev.colors, val],
    }));
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
    try {
      const res = await fetch("/api/navrh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6C63FF]/20 bg-[#6C63FF]/5 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#1AFF8C] animate-pulse" />
            <span className="text-[0.8rem] text-[#F5F5F0]/60">
              Voľné termíny tento týždeň: 3
            </span>
          </div>
          <h2 className="font-heading text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-tight mb-4">
            Chcete návrh{" "}
            <span className="text-[#6C63FF]">zadarmo?</span>
          </h2>
          <p className="text-[1rem] text-[#F5F5F0]/50">
            Vyplňte formulár – trvá to 2–3 minúty.
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
                {/* Row 1: name + email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                      Meno a priezvisko *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Ján Novák"
                      className={`w-full px-4 py-3 rounded-xl bg-surface-2 border text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/60 focus:ring-2 focus:ring-[#6C63FF]/15 transition-colors text-[0.9rem] ${
                        errors.name ? "border-red-500/50" : "border-white/8"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[0.75rem] text-red-400 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="jan@firma.sk"
                      className={`w-full px-4 py-3 rounded-xl bg-surface-2 border text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/60 focus:ring-2 focus:ring-[#6C63FF]/15 transition-colors text-[0.9rem] ${
                        errors.email ? "border-red-500/50" : "border-white/8"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[0.75rem] text-red-400 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: company */}
                <div>
                  <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                    Názov firmy / projektu *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    placeholder="Moja firma s.r.o."
                    className={`w-full px-4 py-3 rounded-xl bg-surface-2 border text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/60 focus:ring-2 focus:ring-[#6C63FF]/15 transition-colors text-[0.9rem] ${
                      errors.company ? "border-red-500/50" : "border-white/8"
                    }`}
                  />
                  {errors.company && (
                    <p className="text-[0.75rem] text-red-400 mt-1">{errors.company}</p>
                  )}
                </div>

                {/* Row 3: about */}
                <div>
                  <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                    Čomu sa venujete?
                  </label>
                  <input
                    type="text"
                    value={formData.about}
                    onChange={(e) => handleChange("about", e.target.value)}
                    placeholder="Napr. fotografia, reštaurácia, online obchod..."
                    className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/8 text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/60 focus:ring-2 focus:ring-[#6C63FF]/15 transition-colors text-[0.9rem]"
                  />
                </div>

                {/* Row 4: has web */}
                <div>
                  <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                    Máte už web?
                  </label>
                  <div className="flex gap-3">
                    {(["Áno", "Nie"] as const).map((opt) => {
                      const val = opt === "Áno" ? "ano" : "nie";
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleChange("hasWeb", formData.hasWeb === val ? "" : val)}
                          className={`px-5 py-2.5 rounded-xl text-[0.875rem] border transition-all duration-200 ${
                            formData.hasWeb === val
                              ? "bg-[#6C63FF] border-[#6C63FF] text-white"
                              : "border-white/8 text-[#F5F5F0]/40 hover:border-white/15"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {formData.hasWeb === "ano" && (
                    <input
                      type="text"
                      value={formData.webUrl}
                      onChange={(e) => handleChange("webUrl", e.target.value)}
                      placeholder="https://váš-web.sk"
                      className="w-full mt-3 px-4 py-3 rounded-xl bg-surface-2 border border-white/8 text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/60 focus:ring-2 focus:ring-[#6C63FF]/15 transition-colors text-[0.9rem]"
                    />
                  )}
                </div>

                {/* Row 5: goal */}
                <div>
                  <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                    Aký je cieľ webu?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {goalOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleGoal(opt)}
                        className={`px-4 py-2 rounded-lg text-[0.85rem] border transition-all duration-200 ${
                          formData.goal.includes(opt)
                            ? "bg-[#6C63FF] border-[#6C63FF] text-white"
                            : "border-white/8 text-[#F5F5F0]/40 hover:border-white/15"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {formData.goal.includes("Iné") && (
                    <input
                      type="text"
                      value={formData.goalOther}
                      onChange={(e) => handleChange("goalOther", e.target.value)}
                      placeholder="Opíšte cieľ..."
                      className="w-full mt-3 px-4 py-3 rounded-xl bg-surface-2 border border-white/8 text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/60 focus:ring-2 focus:ring-[#6C63FF]/15 transition-colors text-[0.9rem]"
                    />
                  )}
                </div>

                {/* Row 6: style */}
                <div>
                  <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                    Predstava o štýle?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {styleOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          handleChange("style", formData.style === opt ? "" : opt)
                        }
                        className={`px-4 py-2 rounded-lg text-[0.85rem] border transition-all duration-200 ${
                          formData.style === opt
                            ? "bg-[#6C63FF] border-[#6C63FF] text-white"
                            : "border-white/8 text-[#F5F5F0]/40 hover:border-white/15"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 7: colors */}
                <div>
                  <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                    Farebná paleta{" "}
                    <span className="text-[#F5F5F0]/25">(voliteľné)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((c) => {
                      const selected = formData.colors.includes(c.label);
                      return (
                        <button
                          key={c.label}
                          type="button"
                          onClick={() => toggleColor(c.label)}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[0.82rem] border transition-all duration-200 ${
                            selected
                              ? "border-[#6C63FF]/60 bg-[#6C63FF]/10 text-[#F5F5F0]/90"
                              : "border-white/8 text-[#F5F5F0]/40 hover:border-white/15"
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                            style={{ background: c.hex }}
                          />
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 8: inspiration */}
                <div>
                  <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                    Web, ktorý sa vám páči{" "}
                    <span className="text-[#F5F5F0]/25">(inšpirácia – voliteľné)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.inspiration}
                    onChange={(e) => handleChange("inspiration", e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/8 text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/60 focus:ring-2 focus:ring-[#6C63FF]/15 transition-colors text-[0.9rem]"
                  />
                </div>

                {/* Row 9: social media */}
                <div>
                  <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                    Sociálne siete{" "}
                    <span className="text-[#F5F5F0]/25">(voliteľné)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.socialMedia}
                    onChange={(e) => handleChange("socialMedia", e.target.value)}
                    placeholder="Napr. instagram.com/váš-profil, facebook.com/..."
                    className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/8 text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/60 focus:ring-2 focus:ring-[#6C63FF]/15 transition-colors text-[0.9rem]"
                  />
                </div>

                {/* Row 10: notes */}
                <div>
                  <label className="block text-[0.8rem] text-[#F5F5F0]/40 mb-2">
                    Poznámky{" "}
                    <span className="text-[#F5F5F0]/25">(voliteľné)</span>
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    rows={3}
                    placeholder="Čokoľvek ďalšie, čo by sme mali vedieť..."
                    className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/8 text-[#F5F5F0] placeholder:text-[#F5F5F0]/15 focus:outline-none focus:border-[#6C63FF]/60 focus:ring-2 focus:ring-[#6C63FF]/15 transition-colors text-[0.9rem] resize-none"
                  />
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
