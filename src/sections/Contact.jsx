import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, ArrowRight, Loader2, Check } from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({ label, value, onChange, error, textarea, ...rest }) {
  const [focused, setFocused] = useState(false);
  const float = focused || String(value).length > 0;
  const base =
    'peer w-full rounded-xl border border-line bg-raise px-4 text-sm text-fog outline-none transition-colors duration-200 focus:border-blue/60';
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
          className={`pointer-events-none absolute left-4 origin-left transition-all duration-200 ${
            float ? 'top-2 text-[10px] font-medium uppercase tracking-wide text-blue' : 'top-4 text-sm text-mist'
          }`}
        >
          {label}
        </span>
      </div>
      {error && <span className="mt-1.5 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

export default function Contact() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

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
    setTimeout(() => setStatus('success'), 1200);
  };

  const details = [
    { icon: Mail, label: 'info@hinit.nl', href: 'mailto:info@hinit.nl' },
    { icon: Phone, label: '+31 6 84018864', href: 'tel:+31684018864' },
    { icon: MapPin, label: 'Amsterdam — NL', href: '#' },
  ];

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <Reveal>
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-blue">
              {t.contact.kicker}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-[clamp(2.1rem,5.5vw,4rem)] font-semibold leading-[1] text-fog">
              {t.contact.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-mist sm:text-lg">{t.contact.sub}</p>
          </Reveal>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-5">
          <Reveal delay={0.05} className="lg:col-span-2">
            <div className="card flex h-full flex-col justify-between rounded-3xl p-8">
              <div className="space-y-3">
                {details.map((d) => (
                  <a
                    key={d.label}
                    href={d.href}
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-raise p-4 transition-colors hover:border-blue/40"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue/10 text-blue">
                      <d.icon style={{ width: 18, height: 18 }} strokeWidth={1.7} />
                    </span>
                    <span className="text-sm text-fog">{d.label}</span>
                  </a>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {t.contact.chips.map((c) => (
                  <span key={c} className="rounded-full border border-line bg-raise px-3 py-1.5 text-xs text-mist">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="card h-full rounded-3xl p-8">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-full min-h-[320px] flex-col items-center justify-center text-center"
                  >
                    <div
                      className="mb-5 flex h-16 w-16 items-center justify-center rounded-full text-white"
                      style={{ background: 'linear-gradient(135deg,#3B5BFF,#00E0FF)' }}
                    >
                      <Check className="h-8 w-8" strokeWidth={2.5} />
                    </div>
                    <p className="max-w-sm text-lg text-fog">{t.contact.success}</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submit} exit={{ opacity: 0 }} noValidate className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label={t.contact.name} value={form.name} onChange={set('name')} error={errors.name} />
                      <Field label={t.contact.email} value={form.email} onChange={set('email')} error={errors.email} />
                    </div>
                    <Field label={t.contact.message} value={form.message} onChange={set('message')} error={errors.message} textarea />
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-white shadow-[0_10px_30px_-10px_rgba(59,91,255,0.7)] transition-all hover:-translate-y-0.5 disabled:opacity-70"
                      style={{ background: 'linear-gradient(100deg,#3B5BFF 0%,#00E0FF 55%,#8B5CFF 100%)' }}
                    >
                      {status === 'sending' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> {t.contact.sending}
                        </>
                      ) : (
                        <>
                          {t.contact.send}
                          <ArrowRight className="h-4 w-4" />
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
