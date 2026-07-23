import { useI18n } from '../i18n';
import VelocityMarquee from '../components/VelocityMarquee';

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
    <div data-hover className="group mx-8 [perspective:600px]">
      <div className="relative transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateX(360deg)]">
        <span className="flex select-none items-center gap-2 font-display text-lg font-medium tracking-tight text-mist/70 grayscale transition-all duration-300 group-hover:text-fog group-hover:grayscale-0">
          <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-br from-blue via-cyan to-violet" />
          {name}
        </span>
      </div>
    </div>
  );
}

export default function TrustBar() {
  const { t } = useI18n();

  return (
    <section data-tone="blue" className="relative overflow-hidden border-y border-white/[0.06] bg-ink/40 py-10">
      <p className="mb-8 text-center text-[11px] uppercase tracking-[0.3em] text-mist">{t.trust.label}</p>

      <div className="relative">
        <VelocityMarquee baseVelocity={38} direction={1}>
          {placeholderLogos.map((name) => (
            <LogoMark key={name} name={name} />
          ))}
        </VelocityMarquee>

        {/* looping glow beam sweeping across the row */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="animate-beam absolute inset-y-0 w-1/3"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,224,255,0.14), transparent)' }}
          />
        </div>

        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-ink to-transparent" />
      </div>
    </section>
  );
}
