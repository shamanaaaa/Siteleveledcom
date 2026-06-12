import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";

interface FaqAccordionProps {
  items: { q: string; a: string }[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-white/8 border-y border-white/8">
      {items.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="group flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span
                className={`font-heading text-[0.98rem] transition-colors ${
                  open ? "text-[#F5F5F0]" : "text-[#F5F5F0]/75 group-hover:text-[#F5F5F0]"
                }`}
              >
                {faq.q}
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  open
                    ? "rotate-45 border-[#6C63FF]/50 bg-[#6C63FF]/15 text-[#9F97FF]"
                    : "border-white/10 text-[#F5F5F0]/40 group-hover:border-white/25"
                }`}
              >
                <Plus size={14} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pr-11 text-[0.875rem] leading-relaxed text-[#F5F5F0]/50">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
