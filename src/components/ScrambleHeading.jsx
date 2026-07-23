import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

/**
 * Heading that decodes/scrambles into place when it scrolls into view, then
 * re-scrambles per-character when the cursor sweeps over it (ambient interaction).
 */
export default function ScrambleHeading({ text, className = '', as: Tag = 'h2' }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;

      const split = SplitText.create(el, { type: 'words,chars', charsClass: 'inline-block will-change-transform' });

      // entrance: decode on scroll-in
      gsap.from(split.chars, {
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        duration: 1,
        opacity: 0,
        y: 20,
        stagger: 0.012,
        ease: 'power3.out',
      });
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        duration: 1.1,
        scrambleText: { text, chars: 'upperCase', speed: 0.6, revealDelay: 0.2 },
        ease: 'none',
      });

      // interaction: cursor-proximity re-scramble
      split.chars.forEach((c) => gsap.set(c, { attr: { 'data-content': c.textContent } }));
      const onMove = (e) => {
        split.chars.forEach((c) => {
          const r = c.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          if (d < 60) {
            gsap.to(c, {
              overwrite: true,
              duration: 0.7 * (1 - d / 60),
              scrambleText: { text: c.dataset.content || '', chars: '01', speed: 0.8 },
              ease: 'none',
            });
          }
        });
      };
      el.addEventListener('pointermove', onMove);
      return () => el.removeEventListener('pointermove', onMove);
    },
    { scope: ref, dependencies: [text] }
  );

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
