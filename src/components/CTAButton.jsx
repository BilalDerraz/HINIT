/**
 * Call-to-action button.
 * variant="primary" -> bold brand gradient (grabs attention).
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
    'tap group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-tight transition-all duration-300';

  const styles =
    variant === 'primary'
      ? 'bg-brand-gradient text-white shadow-[0_10px_30px_-10px_rgba(50,87,213,0.75)] hover:shadow-[0_14px_36px_-10px_rgba(50,87,213,0.9)] hover:-translate-y-0.5'
      : 'text-fog border border-line bg-raise hover:border-accent/60 hover:text-accent';

  const cls = `${base} ${styles} ${className}`;

  if (as === 'button') {
    return (
      <button type={type || 'button'} onClick={onClick} className={cls}>
        {children}
      </button>
    );
  }
  return (
    <a href={href} onClick={onClick} className={cls}>
      {children}
    </a>
  );
}
