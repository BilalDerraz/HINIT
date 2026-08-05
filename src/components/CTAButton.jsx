/**
 * Call-to-action button.
 * variant="primary" -> bold gradient (grabs attention).
 * variant="ghost"   -> outlined, follows the theme.
 */
export default function CTAButton({
  children,
  href = '#',
  variant = 'primary',
  onClick,
  className = '',
  type,
  as = 'a',
}) {
  const base =
    'group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-tight transition-all duration-300';

  const styles =
    variant === 'primary'
      ? 'text-white shadow-[0_10px_30px_-10px_rgba(59,91,255,0.7)] hover:shadow-[0_14px_36px_-10px_rgba(59,91,255,0.85)] hover:-translate-y-0.5'
      : 'text-fog border border-line bg-raise hover:border-blue/50';

  const primaryStyle =
    variant === 'primary' ? { background: 'linear-gradient(100deg,#3B5BFF 0%,#00E0FF 55%,#8B5CFF 100%)' } : undefined;

  const cls = `${base} ${styles} ${className}`;

  if (as === 'button') {
    return (
      <button type={type || 'button'} onClick={onClick} className={cls} style={primaryStyle}>
        {children}
      </button>
    );
  }
  return (
    <a href={href} onClick={onClick} className={cls} style={primaryStyle}>
      {children}
    </a>
  );
}
