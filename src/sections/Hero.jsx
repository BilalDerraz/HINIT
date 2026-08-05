import { motion } from 'motion/react';
import { Check, ArrowRight, ArrowDown } from 'lucide-react';
import { useI18n } from '../i18n';
import CTAButton from '../components/CTAButton';

const ease = [0.16, 1, 0.3, 1];

function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const { t } = useI18n();

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* one soft, static glow — no moving background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 45% at 50% 0%, rgba(59,91,255,0.16) 0%, transparent 70%), radial-gradient(45% 40% at 82% 18%, rgba(139,92,255,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 pt-24 text-center">
        <FadeIn delay={0.05}>
          <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-raise px-4 py-1.5 text-xs text-mist">
            <span className="relative flex h-1.5 w-1.5">
              <span className="ping-dot absolute inline-flex h-full w-full rounded-full bg-blue opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue" />
            </span>
            {t.hero.badge}
          </span>
        </FadeIn>

        <FadeIn delay={0.12}>
          <h1 className="font-display text-[clamp(2.8rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-fog">
            {t.hero.titleStatic} <span className="text-gradient">{t.hero.titleAccent}</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.22}>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">{t.hero.sub}</p>
        </FadeIn>

        <FadeIn delay={0.3} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <CTAButton href="#contact">
            {t.hero.ctaPrimary}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </CTAButton>
          <CTAButton href="#services" variant="ghost">
            {t.hero.ctaSecondary}
          </CTAButton>
        </FadeIn>

        <FadeIn delay={0.4} className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {t.hero.chips.map((c) => (
            <span key={c} className="flex items-center gap-2 text-xs text-mist sm:text-sm">
              <Check className="h-4 w-4 text-blue" strokeWidth={2.5} />
              {c}
            </span>
          ))}
        </FadeIn>
      </div>

      {/* simple scroll hint */}
      <a
        href="#services"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-mist transition-colors hover:text-fog"
        aria-label={t.hero.scroll}
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">{t.hero.scroll}</span>
        <ArrowDown className="h-4 w-4" />
      </a>
    </section>
  );
}
