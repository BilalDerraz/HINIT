import { useId, useState } from 'react';
import { Plus, MessageCircleQuestion } from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';
import Section, { SectionHeading } from '../components/Section';

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
          and away from screen readers. The open/close is a CSS grid-row
          transition (see `.collapse`), which animates to the answer's natural
          height without measuring it. */}
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        inert={!open}
        data-open={open}
        className="collapse"
      >
        <div>
          <p className="px-5 pb-5 text-[15px] leading-relaxed text-mist sm:px-6">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { t } = useI18n();
  const [open, setOpen] = useState(0);

  return (
    <Section id="faq" aria-labelledby="faq-title">
      <SectionHeading
        kicker={t.faq.kicker}
        kickerIcon={MessageCircleQuestion}
        title={t.faq.title}
        titleId="faq-title"
        align="center"
      />

      <div className="mx-auto max-w-3xl space-y-3">
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
    </Section>
  );
}
