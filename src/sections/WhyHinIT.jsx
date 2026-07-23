import { useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';
import { Radar, HeartHandshake, ShieldCheck, GitBranch } from 'lucide-react';
import { useI18n } from '../i18n';
import ScrambleHeading from '../components/ScrambleHeading';
import Reveal from '../components/Reveal';
import Parallax from '../components/Parallax';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const pillarIcons = [Radar, HeartHandshake, ShieldCheck, GitBranch];

/** Lucide icon whose strokes draw themselves on scroll-in, then pulse gently. */
function DrawIcon({ icon: Icon }) {
  const ref = useRef(null);
  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
      const strokes = ref.current.querySelectorAll('path, line, circle, polyline, rect, polygon');
      gsap.set(strokes, { drawSVG: '0%' });
      gsap.to(strokes, {
        drawSVG: '100%',
        duration: 1.1,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
      });
    },
    { scope: ref }
  );
  return (
    <span ref={ref} className="animate-pulse-soft text-cyan">
      <Icon className="h-5 w-5" strokeWidth={1.7} />
    </span>
  );
}

export default function WhyHinIT() {
  const { t } = useI18n();

  return (
    <section id="why" data-tone="violet" className="relative overflow-hidden py-24 sm:py-32">
      <Parallax speed={30} className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
        <div className="h-[420px] w-[820px] rounded-full opacity-40 blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(139,92,255,0.35), transparent 70%)' }} />
      </Parallax>

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <span className="mb-4 inline-block text-xs uppercase tracking-[0.3em] text-cyan">{t.why.kicker}</span>
            </Reveal>
            <ScrambleHeading
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
          {t.why.pillars.map((p, i) => (
            <Parallax key={p.t} speed={i % 2 === 0 ? 10 : 20}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -70 : 70, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.85, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                data-hover
                className="group relative h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-panel/40 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-cyan/30"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                <div
                  className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, rgba(59,91,255,0.2), rgba(139,92,255,0.12))', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <DrawIcon icon={pillarIcons[i]} />
                </div>
                <div className="mb-1 font-display text-3xl font-semibold text-white/[0.06] transition-colors group-hover:text-white/10">
                  0{i + 1}
                </div>
                <h3 className="font-display text-xl font-semibold text-fog">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{p.d}</p>
              </motion.div>
            </Parallax>
          ))}
        </div>
      </div>
    </section>
  );
}
