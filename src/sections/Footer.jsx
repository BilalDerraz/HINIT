import { Mail, Phone, MapPin } from 'lucide-react';
import { useI18n } from '../i18n';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line pt-16">
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
                  <a href={['#top', '#services', '#why', '#contact'][i]} className="text-sm text-fog/80 transition-colors hover:text-blue">
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
                <a href="mailto:info@hinit.nl" className="flex items-center gap-2 transition-colors hover:text-blue">
                  <Mail className="h-4 w-4 text-blue" strokeWidth={1.7} /> info@hinit.nl
                </a>
              </li>
              <li>
                <a href="tel:+31684018864" className="flex items-center gap-2 transition-colors hover:text-blue">
                  <Phone className="h-4 w-4 text-blue" strokeWidth={1.7} /> +31 6 84018864
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue" strokeWidth={1.7} /> Amsterdam — NL
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-line py-7 text-xs text-mist sm:flex-row">
          <span>© {year} HinIT. {t.footer.rights}</span>
          <span className="flex items-center gap-1.5">{t.footer.built} 🇳🇱</span>
        </div>
      </div>
    </footer>
  );
}
