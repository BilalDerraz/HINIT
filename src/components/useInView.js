import { useEffect, useRef, useState } from 'react';

/**
 * Fires once when the element scrolls into view.
 *
 * Deliberately uses threshold 0 plus a bottom rootMargin instead of a
 * percentage threshold: an element taller than the viewport can never satisfy
 * a 0.3 threshold, which would leave it stuck invisible forever.
 *
 * Anyone who asked for reduced motion is marked visible immediately.
 */
export default function useInView({ rootMargin = '0px 0px -10% 0px', once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: 0, rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, once]);

  return [ref, inView];
}
