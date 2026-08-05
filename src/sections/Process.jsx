import { Search, ListChecks, TrendingUp } from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';

const stepIcons = [Search, ListChecks, TrendingUp];

export default function Process() {
  const { t } = useI18n();

  return (
    <section id="process" className="relative py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="mb-14 max-w-3xl">
          <Reveal>
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-blue">
              {t.process.kicker}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-2xl font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-semibold leading-[1.04] text-fog">
              {t.process.title}
            </h2>
          </Reveal>
        </div>

        <div className="relative grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* static connecting line on desktop */}
          <div className="pointer-events-none absolute left-0 right-0 top-[62px] hidden h-px bg-gradient-to-r from-blue/40 via-cyan/40 to-violet/40 md:block" />

          {t.process.steps.map((s, i) => {
            const Icon = stepIcons[i];
            return (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="card relative h-full rounded-3xl p-8">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue text-white">
                      <Icon className="h-6 w-6" strokeWidth={1.8} />
                    </div>
                    <span className="font-display text-5xl font-semibold leading-none text-mist/25">{s.n}</span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-fog">{s.t}</h3>
                  <p className="mt-3 text-base leading-relaxed text-mist">{s.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
