import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Mail, Phone, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { useI18n } from '../i18n';
import Particles from '../lib/reactbits/Particles';
import Reveal from '../components/Reveal';
import Magnet from '../lib/reactbits/Magnet';

gsap.registerPlugin(ScrollTrigger);

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FloatingField({ label, value, onChange, error, textarea, ...rest }) {
  const [focused, setFocused] = useState(false);
  const float = focused || String(value).length > 0;
  const base =
    'peer w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-fog outline-none transition-all duration-300 focus:border-cyan/40 focus:bg-white/[0.05]';
  return (
    <label className="block">
      <div className="relative">
        {textarea ? (
          <textarea
            rows={4}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`${base} resize-none pb-3 pt-7`}
            {...rest}
          />
        ) : (
          <input
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`${base} pb-2 pt-6`}
            {...rest}
          />
        )}
        <span
          className={`pointer-events-none absolute left-4 origin-left transition-all duration-300 ${
            float ? 'top-2 text-[10px] font-medium uppercase tracking-wide text-cyan' : 'top-4 text-sm text-mist'
          }`}
        >
          {label}
        </span>
        {/* border-draw on focus */}
        <span
          className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-blue via-cyan to-violet transition-transform duration-500"
          style={{ transform: focused ? 'scaleX(1)' : 'scaleX(0)' }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 block text-xs text-red-400">
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

function SuccessBurst() {
  const dots = Array.from({ length: 18 });
  return (
    <div className="pointer-events-none absolute left-1/2 top-[40%] -translate-x-1/2">
      {dots.map((_, i) => {
        const a = (i / dots.length) * Math.PI * 2;
        const d = 70 + (i % 3) * 34;
        return (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ background: i % 2 ? '#00E0FF' : '#8B5CFF', boxShadow: '0 0 8px rgba(0,224,255,0.8)' }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
            transition={{ duration: 1.1, delay: 0.15 + (i % 4) * 0.04, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}

export default function Contact() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const sectionRef = useRef(null);
  const swellRef = useRef(null);

  // WebGL glow swells as you scroll into the closer
  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
      gsap.fromTo(
        swellRef.current,
        { scale: 0.7, opacity: 0.25 },
        {
          scale: 1.25,
          opacity: 0.65,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'center center', scrub: true },
        }
      );
    },
    { scope: sectionRef }
  );

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (form.name.trim().length < 2) e.name = t.contact.errors.name;
    if (!emailRe.test(form.email)) e.email = t.contact.errors.email;
    if (form.message.trim().length < 5) e.message = t.contact.errors.message;
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus('sending');
    setTimeout(() => setStatus('success'), 1400);
  };

  const details = [
    { icon: Mail, label: 'info@hinit.nl', href: 'mailto:info@hinit.nl' },
    { icon: Phone, label: '+31 6 84018864', href: 'tel:+31684018864' },
    { icon: MapPin, label: 'Amsterdam — NL', href: '#' },
  ];

  return (
    <section id="contact" data-tone="blue" ref={sectionRef} className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0">
        <Particles
          particleColors={['#3B5BFF', '#00E0FF', '#8B5CFF']}
          particleCount={180}
          particleSpread={16}
          speed={0.07}
          particleBaseSize={80}
          alphaParticles
          moveParticlesOnHover
          particleHoverFactor={2}
          className="!absolute inset-0"
        />
      </div>
      <div
        ref={swellRef}
        className="pointer-events-none absolute left-1/2 top-1/4 h-[560px] w-[900px] -translate-x-1/2 rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(59,91,255,0.4), rgba(139,92,255,0.15) 50%, transparent 72%)' }}
      />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <Reveal>
            <span className="mb-4 inline-block text-xs uppercase tracking-[0.3em] text-cyan">{t.contact.kicker}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-gradient-flow font-display text-[clamp(2.1rem,5.5vw,4.2rem)] font-semibold leading-[1]">
              {t.contact.title}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-mist sm:text-lg">{t.contact.sub}</p>
          </Reveal>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-5">
          <Reveal direction="right" className="lg:col-span-2">
            <div className="glass flex h-full flex-col justify-between rounded-3xl p-8">
              <div className="space-y-3">
                {details.map((d) => (
                  <a key={d.label} href={d.href} data-hover className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-cyan/30 hover:bg-white/[0.05]">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-cyan transition-colors group-hover:border-cyan/40">
                      <d.icon style={{ width: 18, height: 18 }} strokeWidth={1.7} />
                    </span>
                    <span className="text-sm text-fog">{d.label}</span>
                  </a>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {t.contact.chips.map((c) => (
                  <span key={c} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-mist">{c}</span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.1} className="lg:col-span-3">
            <div className="glass conic-border relative h-full overflow-hidden rounded-3xl p-8">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative flex h-full min-h-[340px] flex-col items-center justify-center text-center">
                    <SuccessBurst />
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                      className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full"
                      style={{ background: 'linear-gradient(135deg,#3B5BFF,#00E0FF)', boxShadow: '0 0 40px rgba(0,224,255,0.5)' }}
                    >
                      <svg viewBox="0 0 52 52" className="h-8 w-8">
                        <motion.path d="M14 27 l8 8 l16 -18" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }} />
                      </svg>
                    </motion.div>
                    <p className="max-w-sm text-lg text-fog">{t.contact.success}</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submit} exit={{ opacity: 0 }} noValidate className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FloatingField label={t.contact.name} value={form.name} onChange={set('name')} error={errors.name} />
                      <FloatingField label={t.contact.email} value={form.email} onChange={set('email')} error={errors.email} />
                    </div>
                    <FloatingField label={t.contact.message} value={form.message} onChange={set('message')} error={errors.message} textarea />
                    <Magnet padding={70} magnetStrength={5}>
                      <button
                        type="submit"
                        data-cursor="Versturen"
                        disabled={status === 'sending'}
                        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium text-white glow-blue transition-all disabled:opacity-70 sm:w-auto"
                        style={{ background: 'linear-gradient(100deg,#3B5BFF 0%,#00E0FF 55%,#8B5CFF 100%)' }}
                      >
                        <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
                        {status === 'sending' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> {t.contact.sending}
                          </>
                        ) : (
                          <>
                            {t.contact.send}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </Magnet>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
