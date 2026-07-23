import { Quote } from 'lucide-react';
import { useI18n } from '../i18n';
import SpotlightCard from '../components/SpotlightCard';
import Reveal from '../components/Reveal';
import SplitText from '../components/SplitText';

function Avatar({ name }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white"
      style={{ background: 'linear-gradient(135deg,#3B5BFF,#8B5CFF)' }}>
      {initials}
    </div>
  );
}

export default function Testimonials() {
  const { t } = useI18n();

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <span className="mb-4 inline-block text-xs uppercase tracking-[0.3em] text-cyan">{t.testimonials.kicker}</span>
          </Reveal>
          <SplitText
            text={t.testimonials.title}
            as="h2"
            className="font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-semibold leading-[1.03] text-fog"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {t.testimonials.items.map((item, i) => (
            <Reveal key={item.n} delay={i * 0.1} className={i === 1 ? 'md:mt-10' : ''}>
              <SpotlightCard className="h-full" spotColor="rgba(139,92,255,0.16)">
                <div className="flex h-full flex-col p-7">
                  <Quote className="h-8 w-8 text-cyan/40" strokeWidth={1.5} />
                  <p className="mt-5 flex-1 text-[15px] leading-relaxed text-fog/90">“{item.q}”</p>
                  <div className="mt-7 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                    <Avatar name={item.n} />
                    <div>
                      <div className="text-sm font-semibold text-fog">{item.n}</div>
                      <div className="text-xs text-mist">{item.r}</div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-[11px] text-mist/50">{t.testimonials.note}</p>
      </div>
    </section>
  );
}
