import { motion } from 'motion/react';

const dirMap = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

/** Simple scroll-triggered reveal wrapper. */
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  className = '',
  once = true,
  amount = 0.3,
  as = 'div',
}) {
  const M = motion[as] || motion.div;
  const offset = dirMap[direction] || dirMap.up;
  return (
    <M
      className={className}
      initial={{ opacity: 0, ...offset, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}
