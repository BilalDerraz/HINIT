import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-scrubbed parallax. Element drifts on the Y axis (and optional rotate)
 * as it crosses the viewport — tied to scroll position, so it never stops
 * responding. Great for decorative orbs/blobs and depth layers.
 */
export default function Parallax({ children, speed = 20, rotate = 0, className = '', style }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
      gsap.fromTo(
        ref.current,
        { yPercent: speed, rotate: -rotate },
        {
          yPercent: -speed,
          rotate,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
