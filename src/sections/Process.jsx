import { Search, ListChecks, ShieldCheck, Check, Clock } from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';
import CTAButton from '../components/CTAButton';
import Section, { SectionHeading } from '../components/Section';

const stepIcons = [Search, ListChecks, ShieldCheck];

export default function Process() {
  const { t } = useI18n();

  return (
    <Section id="process" aria-labelledby="process-title">
      <SectionHeading
        kicker={t.process.kicker}
        title={t.process.title}
        titleId="process-title"
        sub={t.process.sub}
      />

      {/* The rail: a vertical spine on mobile, a horizontal one on desktop.
          It sits behind the step markers and is purely decorative, so it
          lives outside the <ol> — an ordered list may only contain <li>. */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 left-[27px] top-4 w-px bg-gradient-to-b from-brand/50 via-sky/40 to-violet/10 md:bottom-auto md:left-0 md:right-0 md:top-[27px] md:h-px md:w-auto md:bg-gradient-to-r md:from-brand/50 md:via-sky/45 md:to-violet/25"
        />

        <ol className="grid list-none grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {t.process.steps.map((s, i) => {
            const Icon = stepIcons[i % stepIcons.length];
            /* The <li> is a stretched grid item. From md up the marker becomes
               part of the flow above the card, so the card must fill the
               *remaining* space (flex-1) rather than claim the li's full height
               (h-full) — with h-full it overhung the li by the height of the
               marker and covered the CTA below, swallowing its clicks. */
            return (
              <Reveal key={s.n} delay={i * 0.09} as="li" className="relative flex flex-col pl-16 md:pl-0">
                <div className="absolute left-0 top-0 md:relative md:mb-7 md:shrink-0">
                  <div className="bg-brand-gradient relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[0_10px_26px_-10px_rgba(50,87,213,0.75)] ring-4 ring-[var(--color-ink)]">
                    <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                  </div>
                </div>

                <div className="card flex-1 rounded-3xl p-6 sm:p-7">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="font-display text-sm font-semibold tracking-[0.2em] text-accent">{s.n}</span>
                    <span className="flex items-center gap-1.5 rounded-full border border-line bg-raise px-3 py-1 text-[11px] font-medium text-mist">
                      <Clock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                      {s.duration}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-semibold text-fog">{s.t}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-mist">{s.d}</p>

                  <ul className="mt-6 space-y-2.5 border-t border-line pt-5">
                    {s.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-fog/85">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-12 flex justify-center">
          <CTAButton href="#booking">{t.hero.ctaPrimary}</CTAButton>
        </div>
      </Reveal>
    </Section>
  );
}
