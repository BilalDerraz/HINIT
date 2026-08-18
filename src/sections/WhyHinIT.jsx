import { Radar, HeartHandshake, ShieldCheck, GitBranch } from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';

const pillarIcons = [Radar, HeartHandshake, ShieldCheck, GitBranch];

export default function WhyHinIT() {
  const { t } = useI18n();

  return (
    <section id="why" className="relative py-20 sm:py-28 lg:py-32">
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                {t.why.kicker}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.02] text-fog">
                {t.why.title}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="flex items-end">
            <p className="text-base leading-relaxed text-mist sm:text-lg">{t.why.body}</p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {t.why.pillars.map((p, i) => {
            const Icon = pillarIcons[i];
            return (
              <Reveal key={p.t} delay={i * 0.06}>
                <div className="card h-full rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-accent">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="mb-1 font-display text-2xl font-semibold text-mist/40">0{i + 1}</div>
                  <h3 className="font-display text-xl font-semibold text-fog">{p.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{p.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
