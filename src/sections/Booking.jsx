import { useCallback, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, ChevronRight, CalendarDays, Clock, Video, Check, Loader2, ArrowRight, Timer, BadgeEuro, MapPin,
} from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';
import {
  monthMatrix, isBookable, hasFreeSlot, slotsFor, sameDay, startOfDay, toKey, formatLongDate, BOOKING_HORIZON_DAYS,
} from '../lib/schedule';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const perkIcons = [Timer, BadgeEuro, MapPin];

function SlotGroup({ label, icon: Icon, slots, selected, onPick }) {
  if (!slots.length) return null;
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        {label}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((s) => {
          const active = selected === s.time;
          return (
            <button
              key={s.time}
              type="button"
              disabled={s.taken}
              onClick={() => onPick(s.time)}
              aria-pressed={active}
              className={`tap rounded-xl border px-2 py-2 text-sm font-medium transition-all duration-200 ${
                s.taken
                  ? 'cursor-not-allowed border-line bg-transparent text-mist/35 line-through'
                  : active
                    ? 'border-transparent bg-brand-gradient text-white shadow-[0_8px_20px_-8px_rgba(50,87,213,0.8)]'
                    : 'border-line bg-raise text-fog hover:border-accent/60 hover:text-accent'
              }`}
            >
              {s.time}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Booking() {
  const { t } = useI18n();
  const tb = t.booking;
  const today = useMemo(() => startOfDay(new Date()), []);

  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', company: '', website: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const gridRef = useRef(null);
  const slotsRef = useRef(null);

  const weeks = useMemo(() => monthMatrix(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const slots = useMemo(() => slotsFor(date), [date]);

  // month navigation bounds
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const horizon = useMemo(() => {
    const h = new Date(today);
    h.setDate(h.getDate() + BOOKING_HORIZON_DAYS);
    return new Date(h.getFullYear(), h.getMonth(), 1);
  }, [today]);
  const canPrev = cursor > monthStart;
  const canNext = cursor < horizon;

  const shiftMonth = (delta) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));

  const available = useCallback(
    (d) => isBookable(d, today) && hasFreeSlot(d),
    [today]
  );

  /* Roving tabindex: exactly one day in the grid is in the tab order — the
     selected one, or the first bookable day of the month when nothing is
     picked yet. Without this, Tab either walks all 35 cells or (when today
     is not visible/bookable) cannot reach the grid at all. */
  const focusKey = useMemo(() => {
    if (date) return toKey(date);
    const first = weeks.flat().find(({ date: d, inMonth }) => inMonth && available(d));
    return first ? toKey(first.date) : null;
  }, [date, weeks, available]);

  const pickDate = (d) => {
    setDate(d);
    setTime(null);
    if (d.getMonth() !== cursor.getMonth()) setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
    // on mobile the slots sit below the fold — bring them into view
    requestAnimationFrame(() => {
      if (window.matchMedia('(max-width: 1023px)').matches) {
        slotsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  };

  /** Arrow-key navigation across the day grid, as a date picker should have. */
  const onGridKeyDown = (e) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!step) return;
    e.preventDefault();
    const from = date ?? today;
    // walk in the given direction until we land on a bookable day
    for (let i = 1; i <= 60; i++) {
      const next = new Date(from);
      next.setDate(next.getDate() + step * i);
      if (next < today || next > new Date(horizon.getFullYear(), horizon.getMonth() + 1, 0)) break;
      if (available(next)) {
        pickDate(next);
        requestAnimationFrame(() => {
          gridRef.current?.querySelector(`[data-day="${toKey(next)}"]`)?.focus();
        });
        return;
      }
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (form.website) return; // honeypot: silently drop bots
    const err = {};
    if (form.name.trim().length < 2) err.name = tb.errors.name;
    if (!emailRe.test(form.email)) err.email = tb.errors.email;
    setErrors(err);
    if (Object.keys(err).length) return;
    setStatus('sending');
    /* There is no scheduling backend yet, so no appointment is actually
       booked and no confirmation email is sent: this only simulates the round
       trip. Point this at the real endpoint before taking bookings. */
    setTimeout(() => setStatus('success'), 1100);
  };

  const reset = () => {
    setStatus('idle');
    setTime(null);
    setDate(null);
    setErrors({});
  };

  const monthLabel = `${tb.months[cursor.getMonth()]} ${cursor.getFullYear()}`;
  const ready = date && time;

  return (
    <section id="booking" className="relative py-20 sm:py-28 lg:py-32">
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="mb-12 max-w-3xl sm:mb-14">
          <Reveal>
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              {tb.kicker}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-semibold leading-[1.02] text-fog">
              {tb.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">{tb.sub}</p>
          </Reveal>
        </div>

        <div className="grid gap-5 lg:grid-cols-[340px_1fr] lg:gap-6">
          {/* ---------------------------------------------------- what to expect */}
          <Reveal delay={0.05}>
            <div className="card flex h-full flex-col gap-5 rounded-3xl p-6 sm:p-7">
              {tb.perks.map((p, i) => {
                const Icon = perkIcons[i];
                return (
                  <div key={p.t} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-accent">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <div>
                      <div className="font-display text-base font-semibold text-fog">{p.t}</div>
                      <p className="mt-1 text-sm leading-relaxed text-mist">{p.d}</p>
                    </div>
                  </div>
                );
              })}

              <div className="mt-auto flex items-center gap-3 rounded-2xl border border-line bg-raise p-4">
                <Video className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.8} />
                <p className="text-xs leading-relaxed text-mist">{tb.videoNote}</p>
              </div>
            </div>
          </Reveal>

          {/* ------------------------------------------------------- the picker */}
          <Reveal delay={0.1}>
            <div className="card h-full rounded-3xl p-5 sm:p-7">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-full min-h-[420px] flex-col items-center justify-center px-4 text-center"
                  >
                    <div className="bg-brand-gradient mb-5 flex h-16 w-16 items-center justify-center rounded-full text-white">
                      <Check className="h-8 w-8" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-fog">{tb.successTitle}</h3>
                    <p className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-fog">
                      <span className="rounded-full border border-line bg-raise px-3 py-1.5">
                        {formatLongDate(date, tb)}
                      </span>
                      <span className="rounded-full border border-line bg-raise px-3 py-1.5">{time}</span>
                    </p>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">{tb.successBody}</p>
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-7 text-sm font-medium text-accent underline underline-offset-4"
                    >
                      {tb.again}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="picker" exit={{ opacity: 0 }} className="grid gap-6 md:grid-cols-2 md:gap-7">
                    {/* ------------------------------------------------ calendar */}
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 font-display text-base font-semibold text-fog">
                          <CalendarDays className="h-4 w-4 text-accent" strokeWidth={2} />
                          {tb.pickDate}
                        </h3>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => shiftMonth(-1)}
                            disabled={!canPrev}
                            aria-label={tb.prevMonth}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-raise text-fog transition-colors hover:text-accent disabled:opacity-30 disabled:hover:text-fog"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => shiftMonth(1)}
                            disabled={!canNext}
                            aria-label={tb.nextMonth}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-raise text-fog transition-colors hover:text-accent disabled:opacity-30 disabled:hover:text-fog"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div aria-live="polite" className="mb-3 text-center font-display text-sm font-semibold capitalize text-fog">
                        {monthLabel}
                      </div>

                      <div className="mb-1.5 grid grid-cols-7 gap-1">
                        {tb.weekdays.map((w, i) => (
                          <abbr
                            key={w}
                            title={tb.weekdaysFull[i]}
                            className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-mist no-underline"
                          >
                            {w}
                          </abbr>
                        ))}
                      </div>

                      <div ref={gridRef} onKeyDown={onGridKeyDown} className="grid grid-cols-7 gap-1">
                        {weeks.flat().map(({ date: d, inMonth }) => {
                          const ok = inMonth && available(d);
                          const isSel = sameDay(d, date);
                          const isToday = sameDay(d, today);
                          return (
                            <button
                              key={toKey(d)}
                              type="button"
                              data-day={toKey(d)}
                              disabled={!ok}
                              onClick={() => pickDate(d)}
                              aria-label={`${formatLongDate(d, tb)}${ok ? '' : ` — ${tb.unavailable}`}`}
                              aria-pressed={isSel}
                              tabIndex={toKey(d) === focusKey ? 0 : -1}
                              className={`relative flex aspect-square items-center justify-center rounded-xl text-[13px] font-medium transition-all duration-200 ${
                                !inMonth
                                  ? 'invisible'
                                  : isSel
                                    ? 'bg-brand-gradient text-white shadow-[0_8px_20px_-8px_rgba(50,87,213,0.85)]'
                                    : ok
                                      ? 'text-fog hover:bg-brand/10 hover:text-accent'
                                      : 'cursor-not-allowed text-mist/30'
                              }`}
                            >
                              {d.getDate()}
                              {isToday && !isSel && (
                                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-accent" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-mist">
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        {tb.today}
                      </p>
                    </div>

                    {/* --------------------------------------------------- slots */}
                    <div ref={slotsRef} className="flex flex-col gap-5 md:border-l md:border-line md:pl-7">
                      <h3 className="flex items-center gap-2 font-display text-base font-semibold text-fog">
                        <Clock className="h-4 w-4 text-accent" strokeWidth={2} />
                        {tb.pickTime}
                      </h3>

                      {!date ? (
                        <p className="rounded-2xl border border-dashed border-line px-4 py-8 text-center text-sm text-mist">
                          {tb.pickTimeHint}
                        </p>
                      ) : (
                        <>
                          <p className="-mt-2 text-sm text-mist">
                            <span className="capitalize text-fog">{formatLongDate(date, tb)}</span>
                          </p>
                          <SlotGroup label={tb.morning} icon={Clock} slots={slots.morning} selected={time} onPick={setTime} />
                          <SlotGroup label={tb.afternoon} icon={Clock} slots={slots.afternoon} selected={time} onPick={setTime} />
                        </>
                      )}

                      {/* ------------------------------------------ details form */}
                      <motion.form
                        onSubmit={submit}
                        noValidate
                        initial={false}
                        animate={{ opacity: ready ? 1 : 0.45 }}
                        className="mt-auto space-y-3 border-t border-line pt-5"
                      >
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-mist">
                              {tb.nameLabel}
                            </span>
                            <input
                              value={form.name}
                              onChange={(e) => {
                                setForm((f) => ({ ...f, name: e.target.value }));
                                if (errors.name) setErrors((x) => ({ ...x, name: undefined }));
                              }}
                              disabled={!ready}
                              autoComplete="name"
                              aria-invalid={!!errors.name}
                              className="w-full rounded-xl border border-line bg-raise px-3 py-2.5 text-sm text-fog outline-none transition-colors focus:border-accent/70 disabled:cursor-not-allowed"
                            />
                            {errors.name && <span className="mt-1 block text-xs text-red-400">{errors.name}</span>}
                          </label>
                          <label className="block">
                            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-mist">
                              {tb.emailLabel}
                            </span>
                            <input
                              type="email"
                              value={form.email}
                              onChange={(e) => {
                                setForm((f) => ({ ...f, email: e.target.value }));
                                if (errors.email) setErrors((x) => ({ ...x, email: undefined }));
                              }}
                              disabled={!ready}
                              autoComplete="email"
                              aria-invalid={!!errors.email}
                              className="w-full rounded-xl border border-line bg-raise px-3 py-2.5 text-sm text-fog outline-none transition-colors focus:border-accent/70 disabled:cursor-not-allowed"
                            />
                            {errors.email && <span className="mt-1 block text-xs text-red-400">{errors.email}</span>}
                          </label>
                        </div>

                        {/* honeypot — hidden from people, catnip for bots */}
                        <input
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          aria-hidden="true"
                          value={form.website}
                          onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                          className="absolute left-[-9999px] h-0 w-0 opacity-0"
                        />

                        <button
                          type="submit"
                          disabled={!ready || status === 'sending'}
                          className="bg-brand-gradient tap inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-[0_10px_28px_-10px_rgba(50,87,213,0.8)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
                        >
                          {status === 'sending' ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" /> {tb.confirming}
                            </>
                          ) : (
                            <>
                              {tb.confirm}
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </motion.form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
