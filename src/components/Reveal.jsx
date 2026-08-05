import { motion } from 'motion/react';

/**
 * Subtle scroll-triggered reveal: a small fade + rise, nothing more.
 * Respects reduced-motion via the motion library defaults.
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 0.5,
  y = 16,
  className = '',
  once = true,
  amount = 0.3,
  as = 'div',
}) {
  const M = motion[as] || motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}
