import { motion } from 'motion/react';
import { Radar, HeartHandshake, ShieldCheck, GitBranch } from 'lucide-react';
import { useI18n } from '../i18n';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';

const pillarIcons = [Radar, HeartHandshake, ShieldCheck, GitBranch];

export default function WhyHinIT() {
  const { t } = useI18n();

  return (
    <section id="why" className="relative overflow-hidden py-24 sm:py-32">
      {/* section ambience */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(59,91,255,0.35), transparent 70%)' }} />

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <span className="mb-4 inline-block text-xs uppercase tracking-[0.3em] text-cyan">{t.why.kicker}</span>
            </Reveal>
            <SplitText
              text={t.why.title}
              as="h2"
              className="font-display text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-[1.02] text-fog"
            />
          </div>
          <Reveal delay={0.15} className="flex items-end">
            <p className="text-base leading-relaxed text-mist sm:text-lg">{t.why.body}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.why.pillars.map((p, i) => {
            const Icon = pillarIcons[i];
            return (
              <Reveal key={p.t} delay={i * 0.08}>
                <div
                  data-hover
                  className="group relative h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-panel/40 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-cyan/30"
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <motion.div
                    className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: 'linear-gradient(135deg, rgba(59,91,255,0.2), rgba(139,92,255,0.12))', border: '1px solid rgba(255,255,255,0.08)' }}
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="h-5 w-5 text-cyan" strokeWidth={1.7} />
                  </motion.div>
                  <div className="mb-1 font-display text-3xl font-semibold text-white/[0.06] transition-colors group-hover:text-white/10">
                    0{i + 1}
                  </div>
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
