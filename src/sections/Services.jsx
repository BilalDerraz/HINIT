import { motion } from 'motion/react';
import { ServerCog, ShieldCheck, Network, LifeBuoy, Workflow, MonitorSmartphone, ArrowUpRight } from 'lucide-react';
import { useI18n } from '../i18n';
import SpotlightCard from '../components/SpotlightCard';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';

const icons = [ServerCog, ShieldCheck, Network, LifeBuoy, Workflow, MonitorSmartphone];
const spanClasses = [
  'md:col-span-3 md:row-span-2', // Managed IT (feature)
  'md:col-span-3',
  'md:col-span-3',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-2',
];

function FeatureVisual() {
  // animated "network health" motif for the big tile
  return (
    <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden opacity-70">
      <svg viewBox="0 0 400 260" className="absolute right-0 top-6 h-[70%] w-[85%]" fill="none">
        <defs>
          <linearGradient id="svc-line" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B5BFF" />
            <stop offset="0.5" stopColor="#00E0FF" />
            <stop offset="1" stopColor="#8B5CFF" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 190 C 60 190, 70 90, 130 90 S 210 150, 260 120 S 330 40, 400 60"
          stroke="url(#svc-line)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />
        {[
          [130, 90],
          [260, 120],
          [400, 60],
        ].map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="#00E0FF"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 + i * 0.2, type: 'spring' }}
            style={{ filter: 'drop-shadow(0 0 6px #00E0FF)' }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function Services() {
  const { t } = useI18n();

  return (
    <section id="services" className="relative mx-auto max-w-7xl px-5 py-24 sm:py-32">
      <div className="mb-14 max-w-3xl">
        <Reveal>
          <span className="mb-4 inline-block text-xs uppercase tracking-[0.3em] text-cyan">{t.services.kicker}</span>
        </Reveal>
        <SplitText
          text={t.services.title}
          as="h2"
          className="font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-semibold leading-[1.02] text-fog"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">{t.services.sub}</p>
        </Reveal>
      </div>

      <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-6">
        {t.services.items.map((item, i) => {
          const Icon = icons[i];
          const feature = i === 0;
          return (
            <Reveal key={item.t} delay={i * 0.06} className={spanClasses[i]}>
              <SpotlightCard className="h-full">
                <a href="#contact" data-hover className="flex h-full flex-col justify-between p-6 sm:p-7">
                  {feature && <FeatureVisual />}
                  <div className="relative">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                      <Icon className="h-5.5 w-5.5 text-cyan" style={{ width: 22, height: 22 }} strokeWidth={1.6} />
                    </div>
                    <h3
                      className={`font-display font-semibold text-fog ${
                        feature ? 'text-2xl sm:text-3xl' : 'text-xl'
                      }`}
                    >
                      {item.t}
                    </h3>
                    <p className={`mt-2 text-mist ${feature ? 'max-w-md text-base' : 'text-sm'}`}>{item.d}</p>
                  </div>
                  <div className="relative mt-6 flex items-center gap-1.5 text-sm font-medium text-fog/80 transition-colors group-hover:text-cyan">
                    {t.services.link}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
