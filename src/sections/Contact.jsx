import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useI18n } from '../i18n';
import Particles from '../lib/reactbits/Particles';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-mist">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 block text-xs text-red-400"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-fog placeholder-mist/50 outline-none transition-all duration-300 focus:border-cyan/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-cyan/20';

export default function Contact() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = t.contact.errors.name;
    if (!emailRe.test(form.email)) e.email = t.contact.errors.email;
    if (form.message.trim().length < 5) e.message = t.contact.errors.message;
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus('sending');
    // fake network round-trip — no backend needed for this showcase
    setTimeout(() => setStatus('success'), 1400);
  };

  const details = [
    { icon: Mail, label: 'info@hinit.nl', href: 'mailto:info@hinit.nl' },
    { icon: Phone, label: '+31 6 84018864', href: 'tel:+31684018864' },
    { icon: MapPin, label: 'Amsterdam — NL', href: '#' },
  ];

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      {/* swelling WebGL + glow backdrop */}
      <div className="absolute inset-0">
        <Particles
          particleColors={['#3B5BFF', '#00E0FF', '#8B5CFF']}
          particleCount={160}
          particleSpread={16}
          speed={0.06}
          particleBaseSize={80}
          alphaParticles
          moveParticlesOnHover
          className="!absolute inset-0"
        />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-50 blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(59,91,255,0.4), rgba(139,92,255,0.15) 50%, transparent 72%)' }} />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <Reveal>
            <span className="mb-4 inline-block text-xs uppercase tracking-[0.3em] text-cyan">{t.contact.kicker}</span>
          </Reveal>
          <SplitText
            text={t.contact.title}
            as="h2"
            className="justify-center font-display text-[clamp(2.1rem,5.5vw,4.2rem)] font-semibold leading-[1] text-fog"
          />
          <Reveal delay={0.15}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-mist sm:text-lg">{t.contact.sub}</p>
          </Reveal>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-5">
          {/* details column */}
          <Reveal direction="right" className="lg:col-span-2">
            <div className="glass flex h-full flex-col justify-between rounded-3xl p-8">
              <div className="space-y-3">
                {details.map((d) => (
                  <a
                    key={d.label}
                    href={d.href}
                    data-hover
                    className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-cyan/30 hover:bg-white/[0.05]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-cyan transition-colors group-hover:border-cyan/40">
                      <d.icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} strokeWidth={1.7} />
                    </span>
                    <span className="text-sm text-fog">{d.label}</span>
                  </a>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {t.contact.chips.map((c) => (
                  <span key={c} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-mist">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* form column */}
          <Reveal direction="left" delay={0.1} className="lg:col-span-3">
            <div className="glass relative h-full overflow-hidden rounded-3xl p-8">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-full min-h-[340px] flex-col items-center justify-center text-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                      className="mb-5 flex h-16 w-16 items-center justify-center rounded-full"
                      style={{ background: 'linear-gradient(135deg,#3B5BFF,#00E0FF)', boxShadow: '0 0 40px rgba(0,224,255,0.5)' }}
                    >
                      <CheckCircle2 className="h-8 w-8 text-white" />
                    </motion.div>
                    <p className="max-w-sm text-lg text-fog">{t.contact.success}</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    noValidate
                    className="space-y-5"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label={t.contact.name} error={errors.name}>
                        <input className={inputCls} value={form.name} onChange={set('name')} placeholder="Jane Janssen" />
                      </Field>
                      <Field label={t.contact.email} error={errors.email}>
                        <input className={inputCls} value={form.email} onChange={set('email')} placeholder="jane@bedrijf.nl" />
                      </Field>
                    </div>
                    <Field label={t.contact.message} error={errors.message}>
                      <textarea rows={4} className={`${inputCls} resize-none`} value={form.message} onChange={set('message')} placeholder="…" />
                    </Field>
                    <button
                      type="submit"
                      data-cursor="Versturen"
                      disabled={status === 'sending'}
                      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium text-white glow-blue transition-all disabled:opacity-70 sm:w-auto"
                      style={{ background: 'linear-gradient(100deg,#3B5BFF 0%,#00E0FF 55%,#8B5CFF 100%)' }}
                    >
                      <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
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
