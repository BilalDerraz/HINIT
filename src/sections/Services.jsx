import { useCallback, useEffect, useRef } from 'react';
import { ServerCog, ShieldCheck, Network, LifeBuoy, Workflow, MonitorSmartphone, ArrowRight, Check } from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';
import Section, { SectionHeading } from '../components/Section';
import { serviceHref } from '../lib/router';

/* Icon and colour per service, keyed by slug so the order of the copy in
   i18n can change (security leads now) without the art sliding out of step.
   The accents sweep blue → teal → violet through the brand family. Unlike the
   cursor spotlight they are always visible, so the cards stay distinguishable
   on touch devices too — and every one clears WCAG AA (>=4.5:1) as text on
   the white card. */
export const art = {
  beveiliging: { icon: ShieldCheck, accent: '#2563c9' },
  'it-beheer': { icon: ServerCog, accent: '#3257d5' },
  netwerk: { icon: Network, accent: '#1d6fb8' },
  support: { icon: LifeBuoy, accent: '#0d7a94' },
  automatisering: { icon: Workflow, accent: '#4a54d6' },
  werkplekken: { icon: MonitorSmartphone, accent: '#6a4fd8' },
};

/** Art for a slug; a service added to the copy without art gets the brand look. */
export const artFor = (slug) => art[slug] ?? { icon: ServerCog, accent: '#3257d5' };

// bento layout: the first card is the big, gradient "feature" card
const spanClasses = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
];

/* The spotlight ramp. Every stop sits in the brand family — blue through
   azure and sky to violet — so the colour shifts with the cursor without the
   grid ever turning into a rainbow. */
const RAMP = [
  [50, 87, 213], // #3257D5 brand
  [47, 127, 224], // #2F7FE0 azure
  [34, 184, 230], // #22B8E6 sky
  [123, 108, 240], // #7B6CF0 violet
];

/** Sample RAMP at t (0…1) and return a css rgb() string. */
function rampColor(t) {
  const clamped = Math.min(1, Math.max(0, t));
  const span = clamped * (RAMP.length - 1);
  const i = Math.min(RAMP.length - 2, Math.floor(span));
  const f = span - i;
  const a = RAMP[i];
  const b = RAMP[i + 1];
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * f)} ${Math.round(a[1] + (b[1] - a[1]) * f)} ${Math.round(
    a[2] + (b[2] - a[2]) * f
  )})`;
}

// how far past a card's edge the light still reaches
const FALLOFF = 460;

export default function Services() {
  const { t } = useI18n();
  const gridRef = useRef(null);
  const frame = useRef(0);
  const pending = useRef(null);

  /**
   * One listener for the whole grid. Every card gets the pointer position in
   * its own coordinate space plus an intensity based on how close the pointer
   * is, so the light reads as a single source sweeping across the bento —
   * not six unrelated hover states.
   *
   * Styles are written straight to the DOM (never through state) so moving
   * the mouse cannot trigger a React render.
   */
  const paint = useCallback(() => {
    frame.current = 0;
    const grid = gridRef.current;
    const point = pending.current;
    if (!grid) return;

    const cards = grid.querySelectorAll('[data-spot-card]');

    if (!point) {
      cards.forEach((c) => c.style.setProperty('--spot-on', '0'));
      return;
    }

    const gridRect = grid.getBoundingClientRect();
    const color = rampColor((point.x - gridRect.left) / gridRect.width);

    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      const mx = point.x - r.left;
      const my = point.y - r.top;

      // distance from the pointer to the nearest edge of this card
      const dx = Math.max(r.left - point.x, 0, point.x - r.right);
      const dy = Math.max(r.top - point.y, 0, point.y - r.bottom);
      const dist = Math.hypot(dx, dy);
      const intensity = Math.max(0, 1 - dist / FALLOFF);

      card.style.setProperty('--mx', `${mx}px`);
      card.style.setProperty('--my', `${my}px`);
      card.style.setProperty('--spot', color);
      card.style.setProperty('--spot-on', intensity.toFixed(3));
    });
  }, []);

  const schedule = useCallback(
    (point) => {
      pending.current = point;
      if (!frame.current) frame.current = requestAnimationFrame(paint);
    },
    [paint]
  );

  const onPointerMove = useCallback(
    (e) => {
      // Coarse pointers (touch) have no meaningful hover — skip the effect so
      // a tap doesn't leave a card stuck lit.
      if (e.pointerType === 'touch') return;
      schedule({ x: e.clientX, y: e.clientY });
    },
    [schedule]
  );

  const onPointerLeave = useCallback(() => schedule(null), [schedule]);

  /* Cards move under the cursor while the page scrolls, so the cached pointer
     position has to be re-applied or the wrong card stays lit. */
  useEffect(() => {
    const onScroll = () => pending.current && schedule(pending.current);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [schedule]);

  // Keyboard users get the same cue: light the card that has focus.
  const onFocus = useCallback(
    (e) => {
      const card = e.target.closest('[data-spot-card]');
      if (!card) return;
      const r = card.getBoundingClientRect();
      schedule({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    },
    [schedule]
  );

  useEffect(() => () => frame.current && cancelAnimationFrame(frame.current), []);

  return (
    <Section id="services" aria-labelledby="services-title">
      <SectionHeading
        kicker={t.services.kicker}
        title={t.services.title}
        titleId="services-title"
        sub={t.services.sub}
      />

      <div
        ref={gridRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onFocus={onFocus}
        onBlur={onPointerLeave}
        className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
      >
        {t.services.items.map((item, i) => {
          const { icon: Icon, accent } = artFor(item.slug);
          // the first service in the copy is the big feature tile
          const feature = i === 0;
          return (
            <Reveal key={item.slug} delay={Math.min(i, 3) * 0.06} className={spanClasses[i] ?? 'md:col-span-1'}>
              <a
                data-spot-card
                href={serviceHref(item.slug)}
                style={{ '--card-accent': accent }}
                aria-label={`${item.t} — ${t.services.link}`}
                className={`card-pop group ${feature ? 'card-pop-feature' : ''} flex h-full flex-col justify-between rounded-3xl p-6 sm:p-7`}
              >
                <div>
                  <div
                    className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
                      feature ? 'bg-white/20 text-white' : 'card-pop-chip'
                    }`}
                  >
                    <Icon style={{ width: 22, height: 22 }} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <h3 className={`font-display font-semibold ${feature ? 'type-sub' : 'text-xl'}`}>{item.t}</h3>
                  <p
                    className={`mt-2 ${
                      feature ? 'max-w-md text-base leading-relaxed text-white/90' : 'text-sm leading-relaxed text-mist'
                    }`}
                  >
                    {item.d}
                  </p>
                  {/* The feature tile spans two rows from md up. Three of its
                      own outcomes fill that height with something useful
                      instead of leaving half the card empty. */}
                  {feature && item.detail?.outcomes && (
                    <ul className="mt-7 hidden list-none space-y-2.5 md:block">
                      {item.detail.outcomes.slice(0, 3).map((o) => (
                        <li key={o} className="flex items-start gap-2.5 text-sm text-white/85">
                          <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <span
                  className={`mt-6 flex items-center gap-1.5 text-sm font-medium ${
                    feature ? 'text-white' : 'card-pop-link'
                  }`}
                >
                  {t.services.link}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </a>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
