import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';
import { Search, ListChecks, TrendingUp } from 'lucide-react';
import { useI18n } from '../i18n';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const stepIcons = [Search, ListChecks, TrendingUp];

export default function Process() {
  const { t } = useI18n();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const hueRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current;
        const cards = gsap.utils.toArray('.proc-card', track);
        const shift = () => track.scrollWidth - window.innerWidth + window.innerWidth * 0.12;
        const endVal = () => '+=' + shift() * 1.15;

        const tween = gsap.to(track, {
          x: () => -shift(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: endVal,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card) => {
          ScrollTrigger.create({
            trigger: card,
            containerAnimation: tween,
            start: 'left center',
            end: 'right center',
            onToggle: (self) => card.classList.toggle('is-active', self.isActive),
          });
        });

        const commonST = {
          trigger: sectionRef.current,
          start: 'top top',
          end: endVal,
          scrub: 1,
        };

        // connector line draws + traveling dot travels + progress bar fills + hue shifts
        gsap.fromTo('.proc-connector', { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', scrollTrigger: commonST });
        gsap.fromTo('.proc-progress', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: commonST });
        gsap.fromTo('.proc-dot-travel', { left: '0%' }, { left: '100%', ease: 'none', scrollTrigger: commonST });
        gsap.fromTo(
          hueRef.current,
          { filter: 'hue-rotate(0deg)' },
          { filter: 'hue-rotate(120deg)', ease: 'none', scrollTrigger: commonST }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="process"
      data-tone="cyan"
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:min-h-screen md:py-0"
    >
      {/* per-step hue-shifting ambient wash */}
      <div
        ref={hueRef}
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: 'radial-gradient(60% 50% at 50% 40%, rgba(59,91,255,0.12), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-7xl px-5 pt-4 md:pt-28">
        <Reveal>
          <span className="mb-4 inline-block text-xs uppercase tracking-[0.3em] text-cyan">{t.process.kicker}</span>
        </Reveal>
        <SplitText
          text={t.process.title}
          as="h2"
          className="max-w-4xl font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-semibold leading-[1.04] text-fog"
        />
      </div>

      <div className="relative md:flex md:h-[62vh] md:items-center">
        <div ref={trackRef} className="relative mt-12 flex flex-col gap-6 px-5 md:mt-0 md:flex-row md:gap-10 md:px-[6vw]">
          {/* drawn connector line behind the cards (desktop) */}
          <svg
            className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-2 w-full -translate-y-1/2 md:block"
            preserveAspectRatio="none"
            viewBox="0 0 100 2"
          >
            <defs>
              <linearGradient id="proc-grad-line" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B5BFF" />
                <stop offset="0.5" stopColor="#00E0FF" />
                <stop offset="1" stopColor="#8B5CFF" />
              </linearGradient>
            </defs>
            <line className="proc-connector" x1="0" y1="1" x2="100" y2="1" stroke="url(#proc-grad-line)" strokeWidth="2" opacity="0.5" />
          </svg>

          {t.process.steps.map((s, i) => {
            const Icon = stepIcons[i];
            return (
              <div
                key={s.n}
                className="proc-card group relative flex w-full shrink-0 flex-col justify-between rounded-[2rem] border border-white/[0.08] bg-panel/60 p-8 backdrop-blur-sm transition-all duration-500 md:w-[46vw] md:p-12 lg:w-[38vw]"
              >
                <div
                  className="proc-glow pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 transition-opacity duration-500"
                  style={{ boxShadow: '0 0 0 1px rgba(0,224,255,0.35), 0 30px 80px -20px rgba(0,224,255,0.35)' }}
                />
                <div
                  className="proc-grad pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(120% 90% at 0% 0%, rgba(59,91,255,0.12), transparent 60%)' }}
                />
                <div className="relative flex items-start justify-between">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                    <Icon className="h-6 w-6 text-cyan" strokeWidth={1.6} />
                  </div>
                  <span className="font-display text-6xl font-semibold leading-none text-white/[0.07] md:text-7xl">{s.n}</span>
                </div>
                <div className="relative mt-16 md:mt-24">
                  <h3 className="font-display text-3xl font-semibold text-fog md:text-4xl">{s.t}</h3>
                  <p className="mt-3 max-w-sm text-base leading-relaxed text-mist">{s.d}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* progress bar with traveling dot */}
      <div className="relative mx-auto mt-10 hidden h-px w-[70%] max-w-3xl bg-white/10 md:block">
        <div className="proc-progress h-full origin-left bg-gradient-to-r from-blue via-cyan to-violet" style={{ transform: 'scaleX(0)' }} />
        <div
          className="proc-dot-travel absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan"
          style={{ left: '0%', boxShadow: '0 0 16px 4px rgba(0,224,255,0.8)' }}
        />
      </div>
    </section>
  );
}
