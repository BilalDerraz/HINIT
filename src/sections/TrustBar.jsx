import { useI18n } from '../i18n';

// TODO: replace these placeholder wordmarks with real client logos (SVG).
const placeholderLogos = ['Northwind', 'Vaneers', 'Meridian', 'Kavara', 'Orbital', 'Delfland', 'Nova Health', 'Brightlab'];

export default function TrustBar() {
  const { t } = useI18n();

  return (
    <section className="relative border-y border-line py-10">
      <p className="mb-8 text-center text-[11px] uppercase tracking-[0.3em] text-mist">{t.trust.label}</p>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-5 px-5">
        {placeholderLogos.map((name) => (
          <span
            key={name}
            className="flex select-none items-center gap-2 font-display text-lg font-medium tracking-tight text-mist transition-colors hover:text-fog"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-br from-blue via-cyan to-violet" />
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
