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
      className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white"
      style={{ background: 'linear-gradient(135deg,#3B5BFF,#8B5CFF)' }}
    >
      {initials}
    </div>
  );
}

export default function Testimonials() {
  const { t } = useI18n();

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-blue">
              {t.testimonials.kicker}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-semibold leading-[1.03] text-fog">
              {t.testimonials.title}
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {t.testimonials.items.map((item, i) => (
            <Reveal key={item.n} delay={i * 0.08}>
              <figure className="card flex h-full flex-col rounded-3xl p-7 sm:p-8">
                <Quote className="h-8 w-8 text-blue/40" strokeWidth={1.5} />
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
        <p className="mt-8 text-center text-[11px] text-mist/50">{t.testimonials.note}</p>
      </div>
    </section>
  );
}
