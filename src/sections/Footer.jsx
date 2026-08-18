import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { useI18n } from '../i18n';
import Logo from '../components/Logo';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const navHrefs = ['#top', '#services', '#why', '#booking', '#contact'];

  return (
    <footer className="relative border-t border-line pt-14 sm:pt-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-10 pb-12 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr] md:gap-12 md:pb-14">
          <div>
            <a href="#top" className="inline-flex items-center rounded-lg" aria-label="HinIT — naar boven">
              <Logo className="h-8" />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">{t.footer.tagline}</p>
          </div>

          <nav aria-label={t.footer.navTitle}>
            <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-mist/70">{t.footer.navTitle}</h2>
            <ul className="space-y-3">
              {t.footer.nav.map((n, i) => (
                <li key={n}>
                  <a href={navHrefs[i]} className="text-sm text-fog/80 transition-colors hover:text-accent">
                    {n}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-mist/70">{t.footer.contactTitle}</h2>
            <ul className="space-y-3 text-sm text-fog/80">
              <li>
                <a href="mailto:info@hinit.nl" className="flex items-center gap-2 transition-colors hover:text-accent">
                  <Mail className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} /> info@hinit.nl
                </a>
              </li>
              <li>
                <a href="tel:+31684018864" className="flex items-center gap-2 transition-colors hover:text-accent">
                  <Phone className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} /> +31 6 84018864
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} /> Amsterdam — NL
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-6 text-xs text-mist sm:flex-row sm:py-7">
          <span>
            © {year} HinIT. {t.footer.rights}
          </span>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">{t.footer.built} 🇳🇱</span>
            <a
              href="#top"
              className="flex items-center gap-1.5 transition-colors hover:text-accent"
              aria-label={t.footer.backToTop}
            >
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={2} />
              {t.footer.backToTop}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
