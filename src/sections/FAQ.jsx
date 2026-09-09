import { useId, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, MessageCircleQuestion } from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';

function Item({ q, a, open, onToggle }) {
  const id = useId();
  return (
    <div className="card overflow-hidden rounded-2xl">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          className="tap flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
        >
          <span className="font-display text-[15px] font-semibold text-fog sm:text-base">{q}</span>
          <span
            aria-hidden="true"
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-300 ${
              open ? 'rotate-45 border-transparent bg-brand-gradient text-white' : 'text-accent'
            }`}
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
          </span>
        </button>
      </h3>
      {/* The panel stays mounted so the button's aria-controls always points at
          a real element; `inert` keeps the collapsed answer out of the tab order
          and away from screen readers. */}
      <motion.div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        inert={!open}
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-[15px] leading-relaxed text-mist sm:px-6">{a}</p>
      </motion.div>
    </div>
  );
}

export default function FAQ() {
  const { t } = useI18n();
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative py-20 sm:py-28 lg:py-32">
      <div className="relative mx-auto max-w-5xl px-5">
        <div className="mb-12 text-center">
          <Reveal>
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              <MessageCircleQuestion className="h-4 w-4" strokeWidth={2} />
              {t.faq.kicker}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mx-auto max-w-2xl font-display text-[clamp(1.8rem,4.2vw,3.1rem)] font-semibold leading-[1.05] text-fog">
              {t.faq.title}
            </h2>
          </Reveal>
        </div>

        <div className="space-y-3">
          {t.faq.items.map((item, i) => (
            <Reveal key={item.q} delay={Math.min(i, 4) * 0.05}>
              <Item
                q={item.q}
                a={item.a}
                open={open === i}
                onToggle={() => setOpen((cur) => (cur === i ? -1 : i))}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
