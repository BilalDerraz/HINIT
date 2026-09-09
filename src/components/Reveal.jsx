import useInView from './useInView';

/**
 * Subtle scroll-triggered reveal: a small fade + rise, nothing more.
 * Pure CSS transition driven by one IntersectionObserver — no animation
 * library. Respects prefers-reduced-motion (see useInView and index.css).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 16,
  className = '',
  as: Tag = 'div',
  ...rest
}) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? ' is-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s`, '--reveal-y': `${y}px` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
