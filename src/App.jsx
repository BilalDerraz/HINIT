import { I18nProvider } from './i18n';
import { ThemeProvider } from './theme';
import NetworkBackground from './components/NetworkBackground';

import Nav from './sections/Nav';
import Hero from './sections/Hero';
import TrustBar from './sections/TrustBar';
import Services from './sections/Services';
import WhyHinIT from './sections/WhyHinIT';
import Process from './sections/Process';
import Stats from './sections/Stats';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        {/* the one animation we keep: the calm "constellation" network */}
        <NetworkBackground />

        <div className="relative z-10">
          <Nav />
          <main>
            <Hero />
            <TrustBar />
            <Services />
            <WhyHinIT />
            <Process />
            <Stats />
            <Testimonials />
            <Contact />
          </main>
          <Footer />
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}
