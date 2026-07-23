import { useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { useGSAP } from '@gsap/react';
import { Quote } from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';
import SplitText from '../components/SplitText';

gsap.registerPlugin(Draggable, InertiaPlugin);

function Avatar({ name }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#3B5BFF,#8B5CFF)' }}>
      {initials}
    </div>
  );
}

export default function Testimonials() {
  const { t } = useI18n();
  const items = t.testimonials.items;
  const n = items.length;

  const stageRef = useRef(null);
  const proxyRef = useRef(null);
  const cardRefs = useRef([]);
  const ringRef = useRef(null);
  const pos = useRef(0);
  const dragVel = useRef(0);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const spacing = Math.min(340, window.innerWidth * 0.72);
      const proxy = proxyRef.current;
      let autoplay;
      let ringTween;

      const layout = () => {
        const p = pos.current;
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          const off = i - p;
          const x = off * spacing;
          const rot = gsap.utils.clamp(-55, 55, -off * 40 + dragVel.current * 0.6);
          const z = -Math.abs(off) * 280;
          const scale = Math.max(0.68, 1 - Math.abs(off) * 0.18);
          const op = Math.max(0.12, 1 - Math.abs(off) * 0.5);
          el.style.transform = `translate(-50%,-50%) translateX(${x}px) translateZ(${z}px) rotateY(${rot}deg) scale(${scale})`;
          el.style.opacity = op;
          el.style.zIndex = String(100 - Math.round(Math.abs(off) * 10));
          el.style.filter = Math.abs(off) > 0.5 ? 'brightness(0.6)' : 'brightness(1)';
        });
        setActive(Math.round(gsap.utils.clamp(0, n - 1, p)));
      };

      const startRing = () => {
        if (ringRef.current) {
          gsap.set(ringRef.current, { strokeDashoffset: 126 });
          ringTween = gsap.to(ringRef.current, { strokeDashoffset: 0, duration: 5, ease: 'none' });
        }
      };

      const goTo = (idx, dur = 0.9) => {
        const clamped = gsap.utils.clamp(0, n - 1, idx);
        gsap.to(pos, {
          current: clamped,
          duration: dur,
          ease: 'power3.out',
          onUpdate: layout,
          onComplete: () => {
            gsap.set(proxy, { x: -clamped * spacing });
            if (drag) drag.update();
          },
        });
      };

      const stopAuto = () => {
        autoplay?.kill();
        ringTween?.kill();
      };
      const startAuto = () => {
        stopAuto();
        startRing();
        autoplay = gsap.delayedCall(5, () => {
          const next = (Math.round(pos.current) + 1) % n;
          goTo(next);
          startAuto();
        });
      };

      const [drag] = Draggable.create(proxy, {
        type: 'x',
        inertia: true,
        allowNativeTouchScrolling: true,
        bounds: { minX: -(n - 1) * spacing - spacing * 0.4, maxX: spacing * 0.4 },
        onPressInit: stopAuto,
        onDrag() {
          dragVel.current = this.deltaX;
          pos.current = -this.x / spacing;
          layout();
        },
        onThrowUpdate() {
          dragVel.current *= 0.9;
          pos.current = -this.x / spacing;
          layout();
        },
        snap: { x: (v) => Math.round(v / spacing) * spacing },
        onThrowComplete() {
          dragVel.current = 0;
          pos.current = gsap.utils.clamp(0, n - 1, -this.x / spacing);
          gsap.set(proxy, { x: -Math.round(pos.current) * spacing });
          layout();
          startAuto();
        },
        onDragEnd() {
          if (!this.tween || !this.tween.isActive()) startAuto();
        },
      });

      layout();
      startAuto();

      // expose goTo for dot nav
      stageRef.current._goTo = (i) => {
        stopAuto();
        goTo(i);
        gsap.delayedCall(0.9, startAuto);
      };

      return () => {
        stopAuto();
        drag?.kill();
      };
    },
    { scope: stageRef, dependencies: [n] }
  );

  return (
    <section data-tone="violet" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <span className="mb-4 inline-block text-xs uppercase tracking-[0.3em] text-cyan">{t.testimonials.kicker}</span>
          </Reveal>
          <div className="vel-skew">
            <SplitText text={t.testimonials.title} as="h2" className="font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-semibold leading-[1.03] text-fog" />
          </div>
        </div>

        {/* coverflow stage */}
        <div
          ref={stageRef}
          data-cursor="Sleep"
          className="relative h-[420px] select-none"
          style={{ perspective: '1400px' }}
        >
          {/* invisible drag proxy */}
          <div ref={proxyRef} className="absolute left-0 top-0 h-1 w-1 opacity-0" />

          {items.map((item, i) => (
            <div
              key={item.n}
              ref={(el) => (cardRefs.current[i] = el)}
              className="absolute left-1/2 top-1/2 w-[86vw] max-w-[440px] will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="conic-border relative overflow-hidden rounded-3xl border border-white/[0.08] bg-panel/70 p-7 backdrop-blur-md sm:p-9">
                <Quote className="h-8 w-8 text-cyan/40" strokeWidth={1.5} />
                <p className="mt-5 text-[15px] leading-relaxed text-fog/90 sm:text-base">“{item.q}”</p>
                <div className="mt-7 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                  <Avatar name={item.n} />
                  <div>
                    <div className="text-sm font-semibold text-fog">{item.n}</div>
                    <div className="text-xs text-mist">{item.r}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* dots + auto-advance progress ring */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => stageRef.current?._goTo?.(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${active === i ? 'w-7 bg-cyan' : 'w-2 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
          <svg width="34" height="34" viewBox="0 0 46 46" className="-rotate-90">
            <circle cx="23" cy="23" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <circle
              ref={ringRef}
              cx="23"
              cy="23"
              r="20"
              fill="none"
              stroke="#00E0FF"
              strokeWidth="2"
              strokeDasharray="126"
              strokeDashoffset="126"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="mt-6 text-center text-[11px] text-mist/50">{t.testimonials.note}</p>
      </div>
    </section>
  );
}
