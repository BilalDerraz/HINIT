import { Quote } from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';
import Section, { SectionHeading } from '../components/Section';

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

export default function Testimonials() {
  const { t } = useI18n();

  return (
    <Section id="testimonials" aria-labelledby="testimonials-title">
      <SectionHeading
        kicker={t.testimonials.kicker}
        title={t.testimonials.title}
        titleId="testimonials-title"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {t.testimonials.items.map((item, i) => (
          <Reveal key={item.n} delay={i * 0.08}>
            <figure className="card flex h-full flex-col rounded-3xl p-6 sm:p-8">
              <Quote className="h-8 w-8 text-accent/45" strokeWidth={1.5} aria-hidden="true" />
              <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-fog/90">
                &ldquo;{item.q}&rdquo;
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-line pt-5">
                <Avatar name={item.n} />
                <div>
                  <div className="text-sm font-semibold text-fog">{item.n}</div>
                  <div className="text-xs text-mist">{item.r}</div>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
