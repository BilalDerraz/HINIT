import { useI18n } from '../i18n';

/* Placeholder wordmarks, not real clients. Swap these for actual customer
   logos (SVG) before the site is used to make a claim about who HinIT works
   for — the section heading reads as a client list. */
const placeholderLogos = ['Northwind', 'Vaneers', 'Meridian', 'Kavara', 'Orbital', 'Delfland', 'Nova Health', 'Brightlab'];

export default function TrustBar() {
  const { t } = useI18n();

  return (
    <section className="relative border-y border-line py-8 sm:py-10" aria-label={t.trust.label}>
      <p className="mb-6 text-center text-[11px] uppercase tracking-[0.3em] text-mist sm:mb-8">{t.trust.label}</p>

      {/* scrolls sideways on narrow screens instead of wrapping into a tall block */}
      <div className="no-scrollbar overflow-x-auto">
        <div className="mx-auto flex w-max max-w-6xl items-center gap-x-8 px-5 sm:w-auto sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-5">
          {placeholderLogos.map((name) => (
            <span
              key={name}
              className="flex shrink-0 select-none items-center gap-2 font-display text-base font-medium tracking-tight text-mist transition-colors hover:text-fog sm:text-lg"
            >
              <span className="bg-brand-gradient inline-block h-2 w-2 shrink-0 rounded-full" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
