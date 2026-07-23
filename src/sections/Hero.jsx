import { motion } from 'motion/react';
import { Check, ArrowRight, ArrowDown } from 'lucide-react';
import { useI18n } from '../i18n';
import Particles from '../lib/reactbits/Particles';
import RotatingWord from '../components/RotatingWord';
import CTAButton from '../components/CTAButton';

const ease = [0.16, 1, 0.3, 1];
const BASE = 1.75; // sync entrance with the preloader wipe

function Word({ children, i }) {
  return (
    <span className="inline-block overflow-hidden align-bottom" style={{ paddingBottom: '0.1em' }}>
      <motion.span
        className="inline-block"
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ delay: BASE + 0.15 + i * 0.12, duration: 0.9, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const { t } = useI18n();
  const staticWords = t.hero.titleStatic.split(' ');

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* WebGL particle depth layer */}
      <div className="absolute inset-0">
        <Particles
          particleColors={['#3B5BFF', '#00E0FF', '#8B5CFF', '#EDEDF2']}
          particleCount={220}
          particleSpread={12}
          speed={0.08}
          particleBaseSize={90}
          moveParticlesOnHover
          particleHoverFactor={1.4}
          alphaParticles
          sizeRandomness={1.2}
          className="!absolute inset-0"
        />
      </div>

      {/* colored radial glow + grid */}
      <div className="hero-radial pointer-events-none absolute inset-0" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000_20%,transparent_80%)]" />

      {/* content */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: BASE, duration: 0.8, ease }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-mist backdrop-blur-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
          </span>
          {t.hero.badge}
        </motion.div>

        <h1 className="font-display text-[clamp(2.8rem,9vw,7rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-fog">
          <span className="block">
            {staticWords.map((w, i) => (
              <span key={i}>
                <Word i={i}>{w}</Word>{' '}
              </span>
            ))}
          </span>
          <span className="mt-1 block">
            <RotatingWord words={t.hero.rotating} />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: BASE + 0.5, duration: 0.9, ease }}
          className="mt-7 max-w-2xl text-base leading-relaxed text-mist sm:text-lg"
        >
          {t.hero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: BASE + 0.65, duration: 0.9, ease }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <CTAButton href="#contact" cursor="Boek nu">
            {t.hero.ctaPrimary}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </CTAButton>
          <CTAButton href="#services" variant="ghost" cursor="Bekijk">
            {t.hero.ctaSecondary}
          </CTAButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: BASE + 0.9, duration: 1 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {t.hero.chips.map((c) => (
            <span key={c} className="flex items-center gap-2 text-xs text-mist sm:text-sm">
              <Check className="h-3.5 w-3.5 text-cyan" strokeWidth={2.5} />
              {c}
            </span>
          ))}
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.a
        href="#services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: BASE + 1.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-mist"
        aria-label="Scroll"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">{t.hero.scroll}</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/15 pt-1.5">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-cyan"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>

      {/* bottom fade into next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink" />
    </section>
  );
}
