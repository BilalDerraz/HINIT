import { useRef } from 'react';

/**
 * Showpiece card = 3 layers of motion at once:
 *  - ambient: gentle breathing float (CSS loop) + rotating conic border (loop)
 *  - interactive: 3D tilt toward the cursor + a spotlight that tracks the pointer
 *  - (entrance handled by the parent's scroll reveal)
 */
export default function TiltSpotlightCard({
  children,
  className = '',
  spotColor = 'rgba(0,224,255,0.16)',
  floatDur = 6,
  floatDelay = 0,
  max = 8,
}) {
  const outer = useRef(null);
  const inner = useRef(null);

  const onMove = (e) => {
    const el = inner.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rotX = (0.5 - py) * max * 2;
    const rotY = (px - 0.5) * max * 2;
    el.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const onLeave = () => {
    const el = inner.current;
    if (el) el.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div
      ref={outer}
      className={`animate-float h-full ${className}`}
      style={{ '--float-dur': `${floatDur}s`, '--float-delay': `${floatDelay}s`, perspective: '1000px' }}
    >
      <div
        ref={inner}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="conic-border group relative h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-panel/60 transition-[transform,border-color] duration-300 ease-out hover:border-white/[0.18]"
        style={{ transformStyle: 'preserve-3d', '--mx': '50%', '--my': '50%' }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(340px circle at var(--mx) var(--my), ${spotColor}, transparent 65%)` }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="relative z-10 h-full" style={{ transform: 'translateZ(40px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
