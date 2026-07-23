import { I18nProvider } from './i18n';
import SmoothScroll from './components/SmoothScroll';
import MotionSystems from './components/MotionSystems';
import CustomCursor from './components/CustomCursor';
import NetworkBackground from './components/NetworkBackground';
import AuroraField from './components/AuroraField';
import Noise from './lib/reactbits/Noise';
import Preloader from './components/Preloader';

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
    <I18nProvider>
      <Preloader />
      <CustomCursor />
      <MotionSystems />

      {/* persistent living-infrastructure background layers */}
      <AuroraField />
      <NetworkBackground />

      {/* cinematic overlays */}
      <div className="animate-grain pointer-events-none fixed inset-0 z-[500] mix-blend-soft-light">
        <Noise patternAlpha={13} patternRefreshInterval={3} />
      </div>
      <div className="vignette pointer-events-none fixed inset-0 z-[400]" />

      <SmoothScroll>
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
      </SmoothScroll>
    </I18nProvider>
  );
}
