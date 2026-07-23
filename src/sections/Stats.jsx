import { ShieldCheck } from 'lucide-react';
import { useI18n } from '../i18n';
import CountUp from '../components/CountUp';
import Reveal from '../components/Reveal';
import SplitText from '../components/SplitText';

export default function Stats() {
  const { t } = useI18n();

  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Reveal>
            <span className="mb-4 inline-block text-xs uppercase tracking-[0.3em] text-cyan">{t.stats.kicker}</span>
          </Reveal>
          <SplitText
            text={t.stats.title}
            as="h2"
            className="justify-center font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.05] text-fog"
          />
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] lg:grid-cols-4">
          {t.stats.items.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="bg-ink">
              <div className="group relative flex h-full flex-col items-center justify-center px-4 py-12 text-center transition-colors hover:bg-panel/50">
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CountUp
                  to={s.v}
                  decimals={s.dec}
                  prefix={s.prefix || ''}
                  suffix={s.suffix || ''}
                  className="text-gradient font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]"
                />
                <span className="mt-3 text-sm text-mist">{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* trust / security badges */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {t.stats.badges.map((b) => (
              <span
                key={b}
                data-hover
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-mist transition-all duration-300 hover:border-cyan/40 hover:text-fog"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-cyan" strokeWidth={2} />
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
