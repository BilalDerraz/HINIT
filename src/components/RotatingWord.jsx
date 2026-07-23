import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/** Cycles through phrases, each rising in as the previous falls out. */
export default function RotatingWord({ words, interval = 2200, className = '' }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className={`relative inline-block overflow-hidden align-bottom ${className}`} style={{ paddingBottom: '0.12em' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          className="text-gradient inline-block"
          initial={{ y: '110%', opacity: 0, rotateX: -40 }}
          animate={{ y: '0%', opacity: 1, rotateX: 0 }}
          exit={{ y: '-110%', opacity: 0, rotateX: 40 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
