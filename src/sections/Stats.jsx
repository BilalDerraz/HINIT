import { ShieldCheck } from 'lucide-react';
import { useI18n } from '../i18n';
import CountUp from '../components/CountUp';
import Reveal from '../components/Reveal';

export default function Stats() {
  const { t } = useI18n();

  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Reveal>
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-blue">
              {t.stats.kicker}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.05] text-fog">
              {t.stats.title}
            </h2>
          </Reveal>
        </div>

        <div className="card grid grid-cols-2 overflow-hidden rounded-3xl lg:grid-cols-4">
          {t.stats.items.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <CountUp
                to={s.v}
                decimals={s.dec}
                prefix={s.prefix || ''}
                suffix={s.suffix || ''}
                className="text-gradient font-display text-4xl font-semibold tracking-tight sm:text-5xl"
              />
              <span className="mt-3 text-sm text-mist">{s.label}</span>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {t.stats.badges.map((b) => (
              <span
                key={b}
                className="flex items-center gap-2 rounded-full border border-line bg-raise px-4 py-2 text-xs font-medium text-mist transition-colors hover:text-fog"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-blue" strokeWidth={2} />
                {b}
              </span>
            ))}
          </div>
        </Reveal>
        <p className="mt-6 text-center text-[11px] text-mist/50">{t.stats.note}</p>
      </div>
    </section>
  );
}
