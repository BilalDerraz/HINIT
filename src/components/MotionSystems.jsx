import { useEffect } from 'react';
import { scrollState } from './SmoothScroll';

/**
 * Global "always alive" driver. One rAF loop that:
 *  - turns scroll velocity into a skew + micro-blur (CSS vars → .vel-skew)
 *  - publishes a smoothed velocity for other components
 * Runs whether or not Lenis is active (falls back to raw scroll delta).
 */
export default function MotionSystems() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const root = document.documentElement;
    let lastScroll = window.scrollY;
    let smoothVel = 0;
    let raf;

    const loop = () => {
      // prefer Lenis velocity; else derive from window scroll
      let v = scrollState.velocity;
      if (!v) {
        v = window.scrollY - lastScroll;
        lastScroll = window.scrollY;
      }
      // smooth + clamp
      smoothVel += (v - smoothVel) * 0.12;
      const clamped = Math.max(-40, Math.min(40, smoothVel));
      const skew = (clamped / 40) * 2.4; // deg
      const blur = Math.min(Math.abs(clamped) / 40, 1) * 1.4; // px
      root.style.setProperty('--skew-y', skew.toFixed(2) + 'deg');
      root.style.setProperty('--vel-blur', blur.toFixed(2) + 'px');
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
