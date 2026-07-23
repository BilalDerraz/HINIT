import { useEffect, useRef } from 'react';

/**
 * Full-page flowing aurora mesh. Big blurred gradient blobs drift on infinite
 * loops (ambient) and the whole layer hue-rotates + parallaxes with scroll
 * (scrubbed) so the backdrop never settles and shifts tone per section.
 */
export default function AuroraField() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.body.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        el.style.filter = `hue-rotate(${p * 90}deg)`;
        el.style.transform = `translateY(${p * -8}%)`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="aurora-blob absolute -left-[10%] top-[2%] h-[55vh] w-[55vw] rounded-full opacity-[0.28] blur-[120px]"
        style={{ background: 'radial-gradient(circle, #3B5BFF, transparent 66%)', animationDelay: '0s' }}
      />
      <div
        className="aurora-blob absolute right-[-8%] top-[24%] h-[50vh] w-[48vw] rounded-full opacity-[0.22] blur-[130px]"
        style={{ background: 'radial-gradient(circle, #8B5CFF, transparent 66%)', animationDelay: '-7s' }}
      />
      <div
        className="aurora-blob absolute left-[18%] top-[52%] h-[52vh] w-[52vw] rounded-full opacity-[0.18] blur-[140px]"
        style={{ background: 'radial-gradient(circle, #00E0FF, transparent 66%)', animationDelay: '-14s' }}
      />
      <div
        className="aurora-blob absolute right-[10%] bottom-[2%] h-[48vh] w-[46vw] rounded-full opacity-[0.16] blur-[130px]"
        style={{ background: 'radial-gradient(circle, #3B5BFF, transparent 66%)', animationDelay: '-4s' }}
      />
    </div>
  );
}
