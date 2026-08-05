import { useEffect, useRef } from 'react';
import { useTheme } from '../theme';

/**
 * The "constellation" — a calm field of drifting nodes joined by fading lines.
 * This is the one animation we keep. It gently leans toward the cursor and
 * adapts its palette to the current theme. Pure canvas 2D, stays smooth
 * on laptops and phones.
 */
export default function NetworkBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: -9999, y: -9999, active: false };

    // darker, calmer palette on light backgrounds so lines stay visible
    const palette =
      theme === 'light'
        ? [
            [59, 91, 255],
            [99, 76, 240],
            [8, 145, 178],
          ]
        : [
            [59, 91, 255],
            [0, 224, 255],
            [139, 92, 255],
          ];
    const lineAlpha = theme === 'light' ? 0.28 : 0.4;
    const nodeAlpha = theme === 'light' ? 0.55 : 0.8;
    canvas.style.opacity = theme === 'light' ? '0.5' : '0.55';

    let nodes = [];
    const build = () => {
      const area = width * height;
      const count = Math.min(70, Math.max(28, Math.floor(area / 26000)));
      nodes = new Array(count).fill(0).map(() => {
        const c = palette[Math.floor(Math.random() * palette.length)];
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.5 + 0.8,
          c,
        };
      });
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => (mouse.active = false);

    const LINK_DIST = 150;
    let raf;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 180 * 180) {
            const f = (1 - Math.sqrt(d2) / 180) * 0.25;
            n.x += (dx / (Math.sqrt(d2) || 1)) * f;
            n.y += (dy / (Math.sqrt(d2) || 1)) * f;
          }
        }

        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * lineAlpha;
            const c = a.c;
            ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const [r, g, bl] = n.c;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${bl},${nodeAlpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);

    if (prefersReduced) {
      draw();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      aria-hidden="true"
    />
  );
}
