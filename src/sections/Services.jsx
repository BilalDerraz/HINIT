import { motion } from 'motion/react';
import { ServerCog, ShieldCheck, Network, LifeBuoy, Workflow, MonitorSmartphone, ArrowUpRight } from 'lucide-react';
import { useI18n } from '../i18n';
import TiltSpotlightCard from '../components/TiltSpotlightCard';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';
import Parallax from '../components/Parallax';

const icons = [ServerCog, ShieldCheck, Network, LifeBuoy, Workflow, MonitorSmartphone];
const spanClasses = [
  'md:col-span-3 md:row-span-2',
  'md:col-span-3',
  'md:col-span-3',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-2',
];

// each card flies in from a different direction with 3D rotation
const entrances = [
  { x: -80, rotateY: -18 },
  { y: -70, rotateX: 18 },
  { x: 80, rotateY: 18 },
  { y: 70, rotateX: -18 },
  { scale: 0.85, y: 40 },
  { x: 80, rotateY: 22 },
];

const floats = [
  { dur: 7, delay: 0 },
  { dur: 6.2, delay: 0.6 },
  { dur: 6.8, delay: 1.1 },
  { dur: 5.6, delay: 0.3 },
  { dur: 6.4, delay: 0.9 },
  { dur: 7.2, delay: 1.4 },
];

function FeatureVisual() {
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
            whileInView={{ scale: [0, 1.4, 1] }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 + i * 0.2, duration: 0.6, repeat: Infinity, repeatDelay: 2.4 }}
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
    <section id="services" data-tone="cyan" className="relative py-24 sm:py-32">
      {/* drifting decorative orb (scrubbed parallax) */}
      <Parallax speed={26} className="pointer-events-none absolute right-[6%] top-[10%] -z-0">
        <div className="h-72 w-72 rounded-full opacity-30 blur-[90px]" style={{ background: 'radial-gradient(circle,#8B5CFF,transparent 70%)' }} />
      </Parallax>

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="mb-14 max-w-3xl">
          <Reveal>
            <span className="mb-4 inline-block text-xs uppercase tracking-[0.3em] text-cyan">{t.services.kicker}</span>
          </Reveal>
          <div className="vel-skew">
            <SplitText
              text={t.services.title}
              as="h2"
              className="font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-semibold leading-[1.02] text-fog"
            />
          </div>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">{t.services.sub}</p>
          </Reveal>
        </div>

        <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-6" style={{ perspective: '1400px' }}>
          {t.services.items.map((item, i) => {
            const Icon = icons[i];
            const feature = i === 0;
            return (
              <motion.div
                key={item.t}
                className={spanClasses[i]}
                initial={{ opacity: 0, ...entrances[i], filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <TiltSpotlightCard floatDur={floats[i].dur} floatDelay={floats[i].delay} className="h-full">
                  <a href="#contact" data-hover className="flex h-full flex-col justify-between p-6 sm:p-7">
                    {feature && <FeatureVisual />}
                    <div className="relative">
                      <div className="group/icon mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-500 group-hover:border-cyan/40 group-hover:shadow-[0_0_24px_-4px_rgba(0,224,255,0.5)]">
                        <Icon
                          className="h-5.5 w-5.5 text-cyan transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                          style={{ width: 22, height: 22 }}
                          strokeWidth={1.6}
                        />
                      </div>
                      <h3 className={`font-display font-semibold text-fog ${feature ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
                        {item.t}
                      </h3>
                      <p className={`mt-2 text-mist ${feature ? 'max-w-md text-base' : 'text-sm'}`}>{item.d}</p>
                    </div>
                    <div className="relative mt-6 flex items-center gap-1.5 text-sm font-medium text-fog/80 transition-colors group-hover:text-cyan">
                      {t.services.link}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </a>
                </TiltSpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
