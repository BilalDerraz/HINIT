import { Check, ArrowRight, ArrowDown } from 'lucide-react';
import { useI18n } from '../i18n';
import CTAButton from '../components/CTAButton';

/**
 * The hero is already on screen at load, so it animates on a timer rather than
 * on scroll. One CSS keyframe with a delay — see `.rise-in` in index.css.
 */
function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <div className={`rise-in ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

export default function Hero() {
  const { t } = useI18n();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* one soft, static glow — no moving background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 45% at 50% 0%, rgba(50,91,213,0.18) 0%, transparent 70%), radial-gradient(45% 40% at 82% 18%, rgba(34,184,230,0.10) 0%, transparent 70%)',
        }}
      />

      <div className="container-page relative z-10 flex max-w-4xl flex-col items-center pb-20 pt-28 text-center sm:pt-32">
        <FadeIn delay={0.05}>
          <h1 className="type-display font-display font-semibold text-fog">
            {t.hero.titleStatic} <span className="text-gradient">{t.hero.titleAccent}</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="type-lead mt-6 max-w-2xl text-mist sm:mt-7">{t.hero.sub}</p>
        </FadeIn>

        <FadeIn delay={0.23} className="mt-8 flex w-full flex-col items-center gap-3 sm:mt-9 sm:w-auto sm:flex-row">
          <CTAButton href="#booking" className="w-full sm:w-auto">
            {t.hero.ctaPrimary}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </CTAButton>
          <CTAButton href="#services" variant="ghost" className="w-full sm:w-auto">
            {t.hero.ctaSecondary}
          </CTAButton>
        </FadeIn>

        <FadeIn delay={0.33} className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 sm:mt-10">
          {t.hero.chips.map((c) => (
            <span key={c} className="flex items-center gap-2 text-xs text-mist sm:text-sm">
              <Check className="h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
              {c}
            </span>
          ))}
        </FadeIn>
      </div>

      {/* scroll hint — hidden on short screens where it would collide */}
      <a
        href="#services"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-mist transition-colors hover:text-fog sm:flex"
        aria-label={t.hero.scroll}
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">{t.hero.scroll}</span>
        <ArrowDown className="h-4 w-4" />
      </a>
    </section>
  );
}
