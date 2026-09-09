import { Quote } from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';

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
    <section id="testimonials" aria-labelledby="testimonials-title" className="relative py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12 max-w-2xl sm:mb-14">
          <Reveal>
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              {t.testimonials.kicker}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="testimonials-title" className="font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-semibold leading-[1.03] text-fog">
              {t.testimonials.title}
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {t.testimonials.items.map((item, i) => (
            <Reveal key={item.n} delay={i * 0.08}>
              <figure className="card flex h-full flex-col rounded-3xl p-6 sm:p-8">
                <Quote className="h-8 w-8 text-accent/45" strokeWidth={1.5} />
                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-fog/90">“{item.q}”</blockquote>
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
      </div>
    </section>
  );
}
