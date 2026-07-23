import { Quote } from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';
import Section, { SectionHeading } from '../components/Section';
import { testimonials } from '../data/testimonials';

function Avatar({ name }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
  return (
    <div
      aria-hidden="true"
      className="bg-brand-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
    >
      {initials}
    </div>
  );
}

/** A field may be a plain string or { nl, en }; prefer the active language. */
function pick(value, lang) {
  if (!value || typeof value === 'string') return value || '';
  return value[lang] || value.nl || value.en || '';
}

/* Quotes come from src/data/testimonials.js — real clients only. Nothing is
   rendered until there is at least one. */
export default function Testimonials() {
  const { t, lang } = useI18n();

  if (!testimonials.length) return null;

  return (
    <Section id="testimonials" aria-labelledby="testimonials-title">
      <SectionHeading
        kicker={t.testimonials.kicker}
        title={t.testimonials.title}
        titleId="testimonials-title"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {testimonials.map((item, i) => {
          const role = [pick(item.role, lang), item.company].filter(Boolean).join(', ');
          return (
            <Reveal key={item.name} delay={i * 0.08}>
              <figure className="card flex h-full flex-col rounded-3xl p-6 sm:p-8">
                <Quote className="h-8 w-8 text-accent/45" strokeWidth={1.5} aria-hidden="true" />
                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-fog/90">
                  &ldquo;{pick(item.quote, lang)}&rdquo;
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3 border-t border-line pt-5">
                  <Avatar name={item.name} />
                  <div>
                    <div className="text-sm font-semibold text-fog">{item.name}</div>
                    {role && <div className="text-xs text-mist">{role}</div>}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
