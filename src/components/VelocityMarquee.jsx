import { useRef, useLayoutEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from 'motion/react';

function useElementWidth(ref) {
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const update = () => ref.current && setW(ref.current.offsetWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [ref]);
  return w;
}

/**
 * Marquee whose speed + direction react to scroll velocity, and which keeps
 * drifting when the user is idle. (Adapted from react-bits ScrollVelocity.)
 */
export default function VelocityMarquee({ children, baseVelocity = 40, direction = 1, className = '', copies = 4 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });

  const copyRef = useRef(null);
  const copyWidth = useElementWidth(copyRef);
  const dir = useRef(direction);

  const wrap = (min, max, v) => {
    const range = max - min;
    return ((((v - min) % range) + range) % range) + min;
  };
  const x = useTransform(baseX, (v) => (copyWidth === 0 ? '0px' : `${wrap(-copyWidth, 0, v)}px`));

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    if (factor.get() < 0) dir.current = -direction;
    else if (factor.get() > 0) dir.current = direction;
    move += dir.current * move * factor.get();
    baseX.set(baseX.get() + move);
  });

  const items = [];
  for (let i = 0; i < copies; i++) {
    items.push(
      <div className="flex flex-shrink-0 items-center" key={i} ref={i === 0 ? copyRef : null} aria-hidden={i > 0}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {items}
      </motion.div>
    </div>
  );
}
