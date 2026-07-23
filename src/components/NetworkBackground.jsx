import { useEffect, useRef } from 'react';

/**
 * Persistent "living digital infrastructure" layer.
 * A field of drifting nodes connected by fading lines — a secure network,
 * humming and alive. Reacts subtly to the cursor (nodes lean toward it and
 * links light up near the pointer) and to scroll (slow parallax drift).
 * Pure canvas 2D so it stays smooth on laptops and phones.
 */
export default function NetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: -9999, y: -9999, active: false };
    let scrollY = window.scrollY;

    const palette = [
      [59, 91, 255], // blue
      [0, 224, 255], // cyan
      [139, 92, 255], // violet
    ];

    let nodes = [];
    const build = () => {
      const area = width * height;
      // density scales with viewport, capped for performance
      const count = Math.min(90, Math.max(34, Math.floor(area / 20000)));
      nodes = new Array(count).fill(0).map(() => {
        const c = palette[Math.floor(Math.random() * palette.length)];
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.6 + 0.8,
          pulse: Math.random() * Math.PI * 2,
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
    const onScroll = () => (scrollY = window.scrollY);

    const LINK_DIST = 140;
    let raf;
    let t = 0;

    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, width, height);
      const drift = (scrollY * 0.02) % height;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // gentle cursor attraction
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y + drift - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 200 * 200) {
            const f = (1 - Math.sqrt(d2) / 200) * 0.4;
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
        const ay = a.y - drift;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const by = b.y - drift;
          const dx = a.x - b.x;
          const dy = ay - by;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            let alpha = (1 - dist / LINK_DIST) * 0.5;
            // brighten links near the cursor
            if (mouse.active) {
              const mx = (a.x + b.x) / 2 - mouse.x;
              const my = (ay + by) / 2 - mouse.y;
              const md = Math.sqrt(mx * mx + my * my);
              if (md < 180) alpha += (1 - md / 180) * 0.55;
            }
            const c = a.c;
            ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${Math.min(alpha, 0.9)})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, ay);
            ctx.lineTo(b.x, by);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const ny = n.y - drift;
        const pulse = 0.6 + 0.4 * Math.sin(t * 2 + n.pulse);
        const [r, g, bl] = n.c;
        ctx.beginPath();
        ctx.arc(n.x, ny, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${bl},${0.85})`;
        ctx.shadowColor = `rgba(${r},${g},${bl},${pulse})`;
        ctx.shadowBlur = 8 * pulse;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });

    if (prefersReduced) {
      // one static frame, no animation loop
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
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ opacity: 0.55 }}
      aria-hidden="true"
    />
  );
}
