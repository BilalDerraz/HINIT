import { motion } from 'motion/react';

/**
 * Splits a headline into words that rise from behind a mask, staggered,
 * when scrolled into view. Renders inline so it composes with gradients.
 */
export default function SplitText({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.06,
  once = true,
  as = 'h2',
}) {
  const words = text.split(' ');
  const Tag = motion[as] || motion.h2;

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.4 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" style={{ paddingBottom: '0.08em' }}>
          <motion.span
            className={`inline-block ${wordClassName}`}
            variants={{
              hidden: { y: '110%', opacity: 0 },
              show: { y: '0%', opacity: 1 },
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}
