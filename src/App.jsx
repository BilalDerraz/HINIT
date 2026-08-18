import { I18nProvider, useI18n } from './i18n';
import { ThemeProvider } from './theme';
import NetworkBackground from './components/NetworkBackground';

import Nav from './sections/Nav';
import Hero from './sections/Hero';
import TrustBar from './sections/TrustBar';
import Services from './sections/Services';
import WhyHinIT from './sections/WhyHinIT';
import Process from './sections/Process';
import Booking from './sections/Booking';
import Stats from './sections/Stats';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

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

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        {/* the one animation we keep: the calm "constellation" network */}
        <NetworkBackground />

        <div className="relative z-10">
          <SkipLink />
          <Nav />
          <main id="main">
            <Hero />
            <TrustBar />
            <Services />
            <WhyHinIT />
            <Process />
            <Booking />
            <Stats />
            <Testimonials />
            <FAQ />
            <Contact />
          </main>
          <Footer />
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}
