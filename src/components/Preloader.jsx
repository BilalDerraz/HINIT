import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const letters = ['H', 'i', 'n', 'I', 'T'];

/**
 * Sub-2s branded preloader: the HinIT wordmark assembles over a pulsing
 * node, a progress line fills, then two panels wipe away to reveal the hero.
 */
export default function Preloader({ onDone }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => setShow(false), reduce ? 300 : 1750);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = '';
        onDone?.();
      }}
    >
      {show && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-ink"
          exit={{ opacity: 1 }}
        >
          {/* wipe panels */}
          <motion.div
            className="absolute inset-0 z-20 origin-top bg-ink"
            initial={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
            style={{ transformOrigin: 'top' }}
          />
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-6 flex items-center gap-[0.02em]">
              {/* pulsing node behind wordmark */}
              <motion.div
                className="absolute -left-6 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full"
                style={{ background: '#00E0FF', boxShadow: '0 0 24px 6px rgba(0,224,255,0.7)' }}
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              />
              {letters.map((l, i) => (
                <motion.span
                  key={i}
                  className="font-display text-5xl font-semibold tracking-tight text-fog sm:text-6xl"
                  initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ delay: 0.15 + i * 0.09, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className={i >= 3 ? 'text-gradient' : ''}>{l}</span>
                </motion.span>
              ))}
            </div>
            <div className="h-px w-40 overflow-hidden bg-white/10">
              <motion.div
                className="h-full"
                style={{ background: 'linear-gradient(90deg,#3B5BFF,#00E0FF,#8B5CFF)' }}
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <motion.p
              className="mt-4 text-[10px] uppercase tracking-[0.35em] text-mist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Secure · Stabiel · Slim
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
