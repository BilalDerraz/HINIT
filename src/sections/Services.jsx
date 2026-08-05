import { ServerCog, ShieldCheck, Network, LifeBuoy, Workflow, MonitorSmartphone, ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';

const icons = [ServerCog, ShieldCheck, Network, LifeBuoy, Workflow, MonitorSmartphone];

// bento layout: the first card is the big, gradient "feature" card
const spanClasses = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
];

export default function Services() {
  const { t } = useI18n();

  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="mb-14 max-w-3xl">
          <Reveal>
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-blue">
              {t.services.kicker}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-semibold leading-[1.02] text-fog">
              {t.services.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">{t.services.sub}</p>
          </Reveal>
        </div>

        <div className="grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {t.services.items.map((item, i) => {
            const Icon = icons[i];
            const feature = i === 0;
            return (
              <Reveal key={item.t} delay={Math.min(i, 3) * 0.06} className={spanClasses[i]}>
                <a
                  href="#contact"
                  className={`card-pop group ${feature ? 'card-pop-feature' : ''} flex h-full flex-col justify-between rounded-3xl p-7`}
                >
                  <div>
                    <div
                      className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
                        feature ? 'bg-white/20 text-white' : 'bg-blue/10 text-blue'
                      }`}
                    >
                      <Icon style={{ width: 22, height: 22 }} strokeWidth={1.8} />
                    </div>
                    <h3 className={`font-display font-semibold ${feature ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
                      {item.t}
                    </h3>
                    <p className={`mt-2 ${feature ? 'max-w-md text-base text-white/85' : 'text-sm text-[#3a4160]'}`}>
                      {item.d}
                    </p>
                  </div>
                  <span
                    className={`mt-6 flex items-center gap-1.5 text-sm font-medium ${
                      feature ? 'text-white' : 'text-blue'
                    }`}
                  >
                    {t.services.link}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
