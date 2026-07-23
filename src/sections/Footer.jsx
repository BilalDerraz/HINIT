import { Mail, Phone, MapPin } from 'lucide-react';
import { useI18n } from '../i18n';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-ink pt-16">
      {/* animated gradient line */}
      <div className="absolute inset-x-0 top-0 h-px overflow-hidden">
        <div className="animate-shimmer-line h-full w-full"
          style={{ background: 'linear-gradient(90deg, transparent, #3B5BFF, #00E0FF, #8B5CFF, transparent)' }} />
      </div>

      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-12 pb-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="font-display text-2xl font-semibold tracking-tight text-fog">
                Hin<span className="text-gradient">IT</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">{t.footer.tagline}</p>
          </div>

          <div>
            <div className="mb-4 text-xs uppercase tracking-[0.2em] text-mist/60">Navigatie</div>
            <ul className="space-y-3">
              {t.footer.nav.map((n, i) => (
                <li key={n}>
                  <a href={['#top', '#services', '#why', '#contact'][i]} className="text-sm text-fog/80 transition-colors hover:text-cyan">
                    {n}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-4 text-xs uppercase tracking-[0.2em] text-mist/60">Contact</div>
            <ul className="space-y-3 text-sm text-fog/80">
              <li>
                <a href="mailto:info@hinit.nl" className="flex items-center gap-2 transition-colors hover:text-cyan">
                  <Mail className="h-4 w-4 text-cyan" strokeWidth={1.7} /> info@hinit.nl
                </a>
              </li>
              <li>
                <a href="tel:+31684018864" className="flex items-center gap-2 transition-colors hover:text-cyan">
                  <Phone className="h-4 w-4 text-cyan" strokeWidth={1.7} /> +31 6 84018864
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan" strokeWidth={1.7} /> Amsterdam — NL
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] py-7 text-xs text-mist sm:flex-row">
          <span>© {year} HinIT. {t.footer.rights}</span>
          <span className="flex items-center gap-1.5">{t.footer.built} 🇳🇱</span>
        </div>
      </div>

      {/* giant faded wordmark */}
      <div className="pointer-events-none select-none overflow-hidden">
        <div className="translate-y-[30%] text-center font-display text-[24vw] font-bold leading-none tracking-tighter text-white/[0.02]">
          HinIT
        </div>
      </div>
    </footer>
  );
}
