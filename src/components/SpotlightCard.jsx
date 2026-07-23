import { useRef } from 'react';

/**
 * Card with a cursor-following radial spotlight + a gradient border that
 * lights up on hover. Tracks the pointer via CSS custom properties.
 */
export default function SpotlightCard({ children, className = '', spotColor = 'rgba(0,224,255,0.14)' }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-panel/60 transition-all duration-500 hover:border-white/[0.16] ${className}`}
      style={{ '--mx': '50%', '--my': '50%' }}
    >
      {/* spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(340px circle at var(--mx) var(--my), ${spotColor}, transparent 65%)`,
        }}
      />
      {/* top edge glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
