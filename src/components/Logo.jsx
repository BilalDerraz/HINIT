/**
 * The HinIT wordmark.
 *
 * The source PNG is a single flat colour with the circuit traces knocked out
 * of the alpha channel, so we render it as a CSS mask filled with
 * --logo-color. That gives us one asset that recolours itself per theme and
 * never shows a white box behind it.
 *
 * Size it with a height utility (`h-7`, `h-[30px]`, …); the width follows
 * from the art's own aspect ratio.
 */
export default function Logo({ className = 'h-7' }) {
  return <span className={`logo-mark ${className}`} role="img" aria-label="HinIT" />;
}
