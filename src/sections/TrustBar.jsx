import { useI18n } from '../i18n';
import LogoLoop from '../lib/reactbits/LogoLoop';

// TODO: replace these placeholder wordmarks with real client logos (SVG).
const placeholderLogos = [
  'Northwind',
  'Vaneers',
  'Meridian',
  'Kavara',
  'Orbital',
  'Delfland',
  'Nova Health',
  'Brightlab',
  'Kompas Groep',
  'Havenstad',
];

function LogoMark({ name }) {
  return (
    <span
      data-hover
      className="flex select-none items-center gap-2 font-display text-lg font-medium tracking-tight text-mist grayscale transition-all duration-300 hover:text-fog hover:grayscale-0"
      style={{ opacity: 0.75 }}
    >
      <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-br from-blue via-cyan to-violet" />
      {name}
    </span>
  );
}

export default function TrustBar() {
  const { t } = useI18n();
  const logos = placeholderLogos.map((name) => ({ node: <LogoMark name={name} />, title: name }));

  return (
    <section className="relative border-y border-white/[0.06] bg-ink/60 py-10">
      <p className="mb-8 text-center text-[11px] uppercase tracking-[0.3em] text-mist">{t.trust.label}</p>
      <LogoLoop logos={logos} speed={55} gap={72} logoHeight={22} fadeOut fadeOutColor="#0A0A0F" pauseOnHover ariaLabel="Client logos" />
    </section>
  );
}
