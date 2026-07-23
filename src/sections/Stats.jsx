import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { useI18n } from '../i18n';
import Odometer from '../components/Odometer';
import Reveal from '../components/Reveal';
import SplitText from '../components/SplitText';

/** Small radial burst of particles fired once when the section enters. */
function ParticleBurst({ trigger }) {
  const dots = Array.from({ length: 16 });
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0">
      {dots.map((_, i) => {
        const a = (i / dots.length) * Math.PI * 2;
        const dist = 120 + (i % 3) * 40;
        return (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-cyan"
            style={{ boxShadow: '0 0 8px rgba(0,224,255,0.8)' }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={trigger ? { x: Math.cos(a) * dist, y: Math.sin(a) * dist, opacity: [0, 1, 0], scale: [0, 1, 0] } : {}}
            transition={{ duration: 1.4, delay: 0.1 + (i % 4) * 0.05, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}

function StatCell({ s, i, burst }) {
  const isRadar = i === 2;
  return (
    <div className="group relative flex h-full flex-col items-center justify-center overflow-hidden px-4 py-12 text-center transition-colors hover:bg-panel/50">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {/* 24/7 gets a continuous radar / heartbeat pulse */}
      {isRadar && burst && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {[0, 1, 2].map((r) => (
            <span
              key={r}
              className="animate-radar absolute h-24 w-24 rounded-full border border-cyan/40"
              style={{ animationDelay: `${r * 0.86}s` }}
            />
          ))}
        </div>
      )}

      <div className="relative">
        <Odometer
          value={s.v}
          decimals={s.dec}
          prefix={s.prefix || ''}
          suffix={s.suffix || ''}
          className="font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]"
        />
      </div>
      <span className="relative mt-3 text-sm text-mist">{s.label}</span>

      {/* fill bar */}
      <div className="relative mt-4 h-[3px] w-16 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue via-cyan to-violet"
          initial={{ scaleX: 0, transformOrigin: 'left' }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

export default function Stats() {
  const { t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section ref={ref} data-tone="cyan" className="relative py-24 sm:py-28">
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

        <div className="relative">
          <ParticleBurst trigger={inView} />
          <div className="relative grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] backdrop-blur-sm lg:grid-cols-4">
            {t.stats.items.map((s, i) => (
              <div key={s.label} className="bg-ink/80">
                <StatCell s={s} i={i} burst={inView} />
              </div>
            ))}
          </div>
        </div>

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
