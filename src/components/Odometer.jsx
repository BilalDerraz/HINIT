import { useRef } from 'react';
import { useInView } from 'motion/react';

const REPEAT = 3; // how many 0-9 cycles a digit spins through before landing

function DigitColumn({ digit, inView, delay }) {
  // stack REPEAT copies of 0-9, land on the last occurrence => multi-spin
  const target = (REPEAT - 1) * 10 + digit;
  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-bottom" style={{ width: '0.62em' }}>
      <span
        className="flex flex-col"
        style={{
          transform: inView ? `translateY(-${target}em)` : 'translateY(0em)',
          transition: `transform 1.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        }}
      >
        {Array.from({ length: REPEAT * 10 }, (_, i) => (
          <span key={i} className="text-gradient flex h-[1em] items-center justify-center leading-[1em]">
            {i % 10}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * Slot-machine / odometer number. Each digit column spins into place on
 * scroll-in with a cascading delay. Non-digit chars (comma, %, /, spaces)
 * render statically.
 */
export default function Odometer({ value, decimals = 0, prefix = '', suffix = '', className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const fixed = Number(value).toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const str = decimals > 0 ? `${intPart},${decPart}` : intPart;

  let digitIndex = 0;
  const chars = str.split('').map((ch, i) => {
    if (ch >= '0' && ch <= '9') {
      const d = digitIndex;
      digitIndex += 1;
      return <DigitColumn key={i} digit={Number(ch)} inView={inView} delay={d * 0.12} />;
    }
    return (
      <span key={i} className="text-gradient inline-block">
        {ch}
      </span>
    );
  });

  return (
    <span ref={ref} className={`inline-flex items-baseline tabular-nums ${className}`}>
      {prefix && <span className="text-gradient">{prefix}</span>}
      {chars}
      {suffix && <span className="text-gradient">{suffix}</span>}
    </span>
  );
}
