import { ShieldCheck } from 'lucide-react';
import { useI18n } from '../i18n';
import CountUp from '../components/CountUp';
import Reveal from '../components/Reveal';
import Section, { SectionHeading } from '../components/Section';

export default function Stats() {
  const { t } = useI18n();

  return (
    <Section id="stats" size="sm" aria-labelledby="stats-title">
      <SectionHeading
        kicker={t.stats.kicker}
        title={t.stats.title}
        titleId="stats-title"
        align="center"
      />

      <div className="card grid grid-cols-2 overflow-hidden rounded-3xl lg:grid-cols-4">
        {t.stats.items.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className="flex flex-col items-center justify-center border-line px-4 py-10 text-center [&:nth-child(n+3)]:border-t sm:py-12 lg:border-t-0 lg:[&:nth-child(n+2)]:border-l"
          >
            {s.static ? (
              <span className="text-gradient font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {`${s.prefix || ''}${s.v}${s.suffix || ''}`}
              </span>
            ) : (
              <CountUp
                to={s.v}
                decimals={s.dec}
                prefix={s.prefix || ''}
                suffix={s.suffix || ''}
                className="text-gradient font-display text-4xl font-semibold tracking-tight sm:text-5xl"
              />
            )}
            <span className="mt-3 text-sm text-mist">{s.label}</span>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {t.stats.badges.map((b) => (
            <span
              key={b}
              className="flex items-center gap-2 rounded-full border border-line bg-raise px-3.5 py-2 text-xs font-medium text-mist transition-colors hover:text-fog sm:px-4"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-accent" strokeWidth={2} aria-hidden="true" />
              {b}
            </span>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
