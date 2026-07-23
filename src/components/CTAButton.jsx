import Magnet from '../lib/reactbits/Magnet';

/**
 * Magnetic call-to-action button.
 * variant="primary" -> glowing gradient. variant="ghost" -> outlined.
 */
export default function CTAButton({
  children,
  href = '#',
  variant = 'primary',
  onClick,
  className = '',
  cursor = '',
  type,
  as = 'a',
}) {
  const base =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-tight transition-all duration-300';

  const styles =
    variant === 'primary'
      ? 'text-white glow-blue'
      : 'text-fog border border-white/15 bg-white/[0.03] hover:border-cyan/50 hover:bg-white/[0.06]';

  const inner = (
    <span className={`${base} ${styles} ${className}`}>
      {variant === 'primary' && (
        <>
          <span
            className="absolute inset-0 -z-10"
            style={{ background: 'linear-gradient(100deg,#3B5BFF 0%,#00E0FF 55%,#8B5CFF 100%)' }}
          />
          {/* sheen sweep */}
          <span className="absolute inset-0 -z-10 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
        </>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </span>
  );

  const common = {
    'data-cursor': cursor || undefined,
    onClick,
    className: 'inline-block',
  };

  return (
    <Magnet padding={80} magnetStrength={4}>
      {as === 'button' ? (
        <button type={type || 'button'} {...common}>
          {inner}
        </button>
      ) : (
        <a href={href} {...common}>
          {inner}
        </a>
      )}
    </Magnet>
  );
}
