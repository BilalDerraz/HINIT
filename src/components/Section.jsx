import Reveal from './Reveal';

/**
 * The shell every section on the site sits in: one vertical rhythm, one page
 * gutter, one content measure.
 *
 * Sections used to spell out their own `py-20 sm:py-28 lg:py-32` and
 * `mx-auto max-w-7xl px-5`, which drifted apart — four container widths and
 * three spacing scales across eight sections. Everything now composes this.
 *
 *   size="default" — a full home-page section
 *   size="sm"      — a sub-section on a service or legal page
 *   size="tight"   — a rail or strip (the trust bar)
 *   prose          — narrows the measure for long-form reading
 */
const SIZES = {
  default: 'section-y',
  sm: 'section-y-sm',
  tight: 'section-y-tight',
};

export default function Section({
  children,
  id,
  size = 'default',
  prose = false,
  className = '',
  innerClassName = '',
  ...rest
}) {
  return (
    <section id={id} className={`relative ${SIZES[size] ?? SIZES.default} ${className}`} {...rest}>
      <div className={`container-page ${prose ? 'container-prose' : ''} ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
}

/**
 * The kicker / title / intro block that opens a section.
 *
 * `titleId` wires the heading to the section's aria-labelledby; `align`
 * switches between the left-aligned and centred variants the design already
 * used, without letting each section invent its own type size again.
 */
export function SectionHeading({
  kicker,
  kickerIcon: KickerIcon,
  title,
  titleId,
  sub,
  align = 'left',
  as: Tag = 'h2',
  className = '',
}) {
  const centred = align === 'center';
  return (
    <div className={`${centred ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'} mb-12 sm:mb-14 ${className}`}>
      {kicker && (
        <Reveal>
          <span className={`kicker mb-4 ${KickerIcon ? 'inline-flex items-center gap-2' : 'inline-block'}`}>
            {KickerIcon && <KickerIcon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
            {kicker}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <Tag id={titleId} className="type-section font-display font-semibold text-fog">
          {title}
        </Tag>
      </Reveal>
      {sub && (
        <Reveal delay={0.1}>
          <p className={`type-lead mt-5 text-mist ${centred ? 'mx-auto max-w-xl' : 'max-w-2xl'}`}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}
