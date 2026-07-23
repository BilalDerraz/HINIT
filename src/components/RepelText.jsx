import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

/**
 * Headline whose letters rise in on mount (entrance) and then scatter away
 * from the cursor with eased spring-back (continuous interaction). Entrance
 * lives on an inner span, repel on the outer span — so they never fight.
 */
export default function RepelText({
  text,
  className = '',
  charClassName = '',
  radius = 95,
  strength = 34,
  baseDelay = 0,
  stagger = 0.05,
}) {
  const charsRef = useRef([]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const chars = charsRef.current.filter(Boolean);
    const targets = chars.map(() => ({ x: 0, y: 0 }));
    let mx = -9999;
    let my = -9999;
    let raf;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    const tick = () => {
      for (let i = 0; i < chars.length; i++) {
        const el = chars[i];
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - mx;
        const dy = cy - my;
        const dist = Math.hypot(dx, dy) || 1;
        let tx = 0;
        let ty = 0;
        if (dist < radius) {
          const f = 1 - dist / radius;
          tx = (dx / dist) * strength * f;
          ty = (dy / dist) * strength * f;
        }
        const t = targets[i];
        t.x += (tx - t.x) * 0.16;
        t.y += (ty - t.y) * 0.16;
        el.style.transform = `translate(${t.x.toFixed(2)}px, ${t.y.toFixed(2)}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, [text, radius, strength]);

  const words = text.split(' ');
  let idx = 0;
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split('').map((ch, ci) => {
            const i = idx++;
            return (
              <span
                key={ci}
                ref={(el) => (charsRef.current[i] = el)}
                className={`inline-block will-change-transform ${charClassName}`}
              >
                <span className="inline-block overflow-hidden align-bottom" style={{ paddingBottom: '0.12em' }}>
                  <motion.span
                    className="inline-block"
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ delay: baseDelay + i * stagger, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {ch}
                  </motion.span>
                </span>
              </span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
