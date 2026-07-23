import { useEffect, useRef } from 'react';
import { I18nProvider, useI18n } from './i18n';
import { ThemeProvider } from './theme';
import NetworkBackground from './components/NetworkBackground';
import { useRoute, serviceSlug, pageSlug, HOME } from './lib/router';
import { useDocumentHead, SITE_URL } from './lib/head';

import Nav from './sections/Nav';
import Hero from './sections/Hero';
import TrustBar from './sections/TrustBar';
import Services from './sections/Services';
import WhyHinIT from './sections/WhyHinIT';
import Process from './sections/Process';
import Booking from './sections/Booking';
import Stats from './sections/Stats';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import ServiceDetail from './sections/ServiceDetail';
import LegalPage from './sections/LegalPage';

function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="bg-brand-gradient sr-only rounded-full px-5 py-3 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000]"
    >
      {t.nav.skip}
    </a>
  );
}

function Home() {
  const { t } = useI18n();
  useDocumentHead({
    title: t.meta.title,
    description: t.meta.description,
    canonical: SITE_URL,
    ogLocale: t.ogLocale,
  });
  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <WhyHinIT />
      <Process />
      <Booking />
      <Stats />
      <Testimonials />
      {/* The FAQ (sections/FAQ.jsx, copy under `faq` in i18n) is parked, not
          deleted — undecided whether it stays. Mount it here and add the
          nav link back in Nav.jsx to bring it back. */}
      <Contact />
    </>
  );
}

function Site() {
  const { path, anchor } = useRoute();
  const isHome = path === HOME;
  const page = pageSlug(path);
  const prevPath = useRef(path);

  /**
   * Coming back to the home page from a service page, the target section did
   * not exist when the browser handled the hash, so it could not scroll there
   * itself. Do it once the sections are actually mounted.
   */
  useEffect(() => {
    const cameFromRoute = prevPath.current !== path && prevPath.current !== HOME;
    prevPath.current = path;
    if (!isHome || !cameFromRoute) return;

    const frame = requestAnimationFrame(() => {
      const el = anchor && document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
      else window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
    return () => cancelAnimationFrame(frame);
  }, [isHome, path, anchor]);

  return (
    <div className="relative z-10">
      <SkipLink />
      <Nav routePath={path} />
      {/* tabIndex -1 so the skip link actually moves focus here, not just the
          viewport — a plain #main target is not focusable on its own. */}
      <main id="main" tabIndex={-1}>
        {isHome ? <Home /> : page ? <LegalPage slug={page} /> : <ServiceDetail slug={serviceSlug(path)} />}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        {/* the one animation we keep: the calm "constellation" network */}
        <NetworkBackground />
        <Site />
      </I18nProvider>
    </ThemeProvider>
  );
}
