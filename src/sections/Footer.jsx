import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { useI18n } from '../i18n';
import Logo from '../components/Logo';
import { pageHref } from '../lib/router';
import { CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL, LOCATION_LABEL } from '../lib/company';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const navHrefs = ['#top', '#services', '#why', '#booking', '#contact'];

  return (
    <footer className="relative border-t border-line pt-14 sm:pt-16">
      <div className="container-page">
        <div className="grid gap-10 pb-12 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr] md:gap-12 md:pb-14">
          <div>
            <a href="#top" className="inline-flex items-center rounded-lg" aria-label={t.nav.toTop}>
              <Logo className="h-8" />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">{t.footer.tagline}</p>
          </div>

          <nav aria-label={t.footer.navTitle}>
            <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-mist/70">{t.footer.navTitle}</h2>
            <ul className="space-y-3">
              {t.footer.nav.map((n, i) => (
                <li key={n}>
                  <a
                    href={navHrefs[i]}
                    className="inline-flex min-h-[24px] items-center text-sm text-fog/80 transition-colors hover:text-accent"
                  >
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
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex min-h-[24px] items-center gap-2 transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} /> {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={PHONE_TEL}
                  className="flex min-h-[24px] items-center gap-2 transition-colors hover:text-accent"
                >
                  <Phone className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} /> {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} /> {LOCATION_LABEL}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-6 text-xs text-mist sm:flex-row sm:py-7">
          <div className="flex flex-col items-center gap-x-5 gap-y-2 sm:flex-row">
            <span>
              © {year} HinIT. {t.footer.rights}
            </span>
            <nav aria-label={t.footer.legalTitle} className="flex items-center gap-x-5">
              <a
                href={pageHref('privacy')}
                className="flex min-h-[24px] items-center transition-colors hover:text-accent"
              >
                {t.legal.privacy.nav}
              </a>
              <a
                href={pageHref('cookies')}
                className="flex min-h-[24px] items-center transition-colors hover:text-accent"
              >
                {t.legal.cookies.nav}
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-5">
            {/* The Dutch flag as two spans rather than 🇳🇱: Windows ships no
                glyph for regional-indicator pairs, so the emoji renders there
                as the bare letters "NL". */}
            <span className="flex items-center gap-2">
              {t.footer.built}
              <span
                aria-hidden="true"
                className="inline-block h-3 w-[18px] shrink-0 rounded-[2px] ring-1 ring-black/10"
                style={{
                  background:
                    'linear-gradient(180deg, #ae1c28 0 33.34%, #ffffff 33.34% 66.67%, #21468b 66.67% 100%)',
                }}
              />
            </span>
            <a
              href="#top"
              className="flex min-h-[24px] items-center gap-1.5 transition-colors hover:text-accent"
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
