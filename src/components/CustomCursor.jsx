import { useEffect, useRef, useState } from 'react';

/**
 * Glowing dot cursor that grows + labels on hover and eases toward the pointer.
 * Falls back to the native cursor on touch devices.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  // 1) detect a fine pointer, then mount the cursor elements
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fine) setEnabled(true);
  }, []);

  // 2) once mounted, wire up the animation (refs now exist)
  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf;

    const state = { hover: false, down: false };

    const render = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      const scale = (state.hover ? 2.4 : 1) * (state.down ? 0.7 : 1);
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const tones = {
      cyan: '#00E0FF',
      violet: '#8B5CFF',
      blue: '#3B5BFF',
    };
    let curTone = 'cyan';

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const target = e.target.closest('[data-cursor]');
      const text = target?.getAttribute('data-cursor');
      const interactive = e.target.closest('a, button, input, textarea, [data-hover]');
      state.hover = !!interactive || !!text;
      if (text) {
        label.textContent = text;
        label.style.opacity = '1';
      } else {
        label.style.opacity = '0';
      }
      // per-section tone
      const toneEl = e.target.closest('[data-tone]');
      const tone = toneEl?.getAttribute('data-tone') || 'cyan';
      if (tone !== curTone) {
        curTone = tone;
        const c = tones[tone] || tones.cyan;
        dot.style.background = c;
        dot.style.boxShadow = `0 0 10px 2px ${c}`;
        ring.style.borderColor = c;
        label.style.color = c;
      }
    };
    const onDown = () => (state.down = true);
    const onUp = () => (state.down = false);
    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };
    const onEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-cyan"
        style={{ boxShadow: '0 0 10px 2px rgba(0,224,255,0.9)', transition: 'opacity .3s' }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-cyan/60"
        style={{
          background: 'radial-gradient(circle, rgba(0,224,255,0.10) 0%, transparent 70%)',
          transition: 'opacity .3s',
        }}
      >
        <span
          ref={labelRef}
          className="whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.2em] text-cyan opacity-0"
          style={{ transition: 'opacity .2s' }}
        />
      </div>
    </div>
  );
}
