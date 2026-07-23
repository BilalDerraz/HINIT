import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft, ChevronRight, CalendarDays, Clock, Video, Check, Loader2, ArrowRight, Timer, BadgeEuro, MapPin,
  RefreshCw, ExternalLink,
} from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';
import Section, { SectionHeading } from '../components/Section';
import { fetchAvailability, bookSlot } from '../lib/calendar';
import {
  monthMatrix, isBookable, splitSlots, sameDay, startOfDay, toKey, formatLongDate, BOOKING_HORIZON_DAYS,
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
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [submitError, setSubmitError] = useState(null);
  const [booked, setBooked] = useState(null); // { meetLink } once confirmed
  const gridRef = useRef(null);
  const slotsRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const doneRef = useRef(null);

  /* Live availability from the owner's diary: { 'YYYY-MM-DD': ['09:00', …] }.
     Loaded once for the whole horizon, refreshed after a clash. */
  const [avail, setAvail] = useState({ state: 'loading', days: {} });
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    const ctrl = new AbortController();
    setAvail((a) => ({ ...a, state: 'loading' }));
    fetchAvailability({ signal: ctrl.signal })
      .then((days) => setAvail({ state: 'ready', days }))
      .catch((err) => {
        if (err?.name !== 'AbortError') setAvail({ state: 'error', days: {} });
      });
    return () => ctrl.abort();
  }, [reloadKey]);
  const reload = () => setReloadKey((k) => k + 1);

  /* Late in the month every remaining day can already be past or full, which
     left the visitor staring at an empty grid. Once the diary answers, open
     on the first month that actually has a free slot — only while nothing is
     picked, so a reload after a clash never yanks the view away. */
  const skipped = useRef(false);
  useEffect(() => {
    if (avail.state !== 'ready' || date || skipped.current) return;
    skipped.current = true;
    const first = Object.keys(avail.days)
      .filter((k) => avail.days[k]?.length)
      .sort()[0];
    if (!first) return;
    const [y, m] = first.split('-').map(Number);
    setCursor((c) => (c.getFullYear() === y && c.getMonth() === m - 1 ? c : new Date(y, m - 1, 1)));
  }, [avail, date]);

  const weeks = useMemo(() => monthMatrix(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const slots = useMemo(() => splitSlots(date ? avail.days[toKey(date)] : []), [date, avail.days]);

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
    (d) => isBookable(d, today) && (avail.days[toKey(d)]?.length ?? 0) > 0,
    [today, avail.days]
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
    setSubmitError(null);
    if (d.getMonth() !== cursor.getMonth()) setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
    // on mobile the slots sit below the fold — bring them into view
    requestAnimationFrame(() => {
      if (window.matchMedia('(max-width: 1023px)').matches) {
        slotsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  };

  const pickTime = (t) => {
    setTime(t);
    setSubmitError(null);
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

  const submit = async (e) => {
    e.preventDefault();
    if (form.website) return; // honeypot: silently drop bots
    const err = {};
    if (form.name.trim().length < 2) err.name = tb.errors.name;
    if (!emailRe.test(form.email)) err.email = tb.errors.email;
    setErrors(err);
    if (err.name) return nameRef.current?.focus();
    if (err.email) return emailRef.current?.focus();

    setStatus('sending');
    setSubmitError(null);
    try {
      const result = await bookSlot({
        name: form.name.trim(),
        email: form.email.trim(),
        date: toKey(date),
        time,
        message: form.message.trim(),
        website: form.website,
      });
      setBooked({ meetLink: result.meetLink });
      setStatus('sent');
      // the form the visitor was in is gone — land them on the confirmation
      requestAnimationFrame(() => doneRef.current?.focus());
    } catch (err) {
      setStatus('idle');
      if (err?.code === 'slot_unavailable') {
        // someone else got there first: drop the time and show the fresh diary
        setTime(null);
        setSubmitError(tb.slotTaken);
        reload();
      } else {
        setSubmitError(tb.submitError);
      }
    }
  };

  const reset = () => {
    setStatus('idle');
    setSubmitError(null);
    setBooked(null);
    setTime(null);
    setDate(null);
    setErrors({});
    reload(); // the slot just booked is busy now
  };

  const monthLabel = `${tb.months[cursor.getMonth()]} ${cursor.getFullYear()}`;
  const ready = date && time;
  const done = status === 'sent';
  const loading = avail.state === 'loading';

  return (
    <Section id="booking" aria-labelledby="booking-title">
      <SectionHeading
        kicker={tb.kicker}
        title={tb.title}
        titleId="booking-title"
        sub={tb.sub}
      />

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
              {done ? (
                <div
                  role="status"
                  className="panel-in flex h-full min-h-[420px] flex-col items-center justify-center px-4 text-center"
                >
                  <div className="bg-brand-gradient mb-5 flex h-16 w-16 items-center justify-center rounded-full text-white">
                    <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden="true" />
                  </div>
                  <h3 ref={doneRef} tabIndex={-1} className="font-display text-2xl font-semibold text-fog outline-none">
                    {tb.successTitle}
                  </h3>
                  <p className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-fog">
                    <span className="rounded-full border border-line bg-raise px-3 py-1.5">
                      {formatLongDate(date, tb)}
                    </span>
                    <span className="rounded-full border border-line bg-raise px-3 py-1.5">{time}</span>
                  </p>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">{tb.successBody}</p>
                  {booked?.meetLink && (
                    <a
                      href={booked.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-brand/5 px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:border-accent/70"
                    >
                      <Video className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                      {tb.meetLink}
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-7 text-sm font-medium text-accent underline underline-offset-4"
                  >
                    {tb.again}
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 md:gap-7">
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

                    {avail.state === 'error' ? (
                      <div role="alert" className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
                        <p className="text-sm text-mist">{tb.loadError}</p>
                        <button
                          type="button"
                          onClick={reload}
                          className="tap mt-3 inline-flex items-center gap-2 rounded-full border border-line bg-raise px-4 text-sm font-medium text-fog transition-colors hover:text-accent"
                        >
                          <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                          {tb.retry}
                        </button>
                      </div>
                    ) : (
                    <div
                      ref={gridRef}
                      onKeyDown={onGridKeyDown}
                      aria-busy={loading}
                      className={`grid grid-cols-7 gap-1 transition-opacity duration-300 ${loading ? 'pointer-events-none opacity-50' : ''}`}
                    >
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
                    )}

                    <p className="mt-3 flex items-center gap-1.5 text-[11px] text-mist" aria-live="polite">
                      {loading ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                          {tb.loading}
                        </>
                      ) : (
                        <>
                          <span className="h-1 w-1 rounded-full bg-accent" />
                          {tb.today}
                        </>
                      )}
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
                        {!loading && !slots.morning.length && !slots.afternoon.length && (
                          <p className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-sm text-mist">
                            {tb.noSlots}
                          </p>
                        )}
                        <SlotGroup label={tb.morning} icon={Clock} slots={slots.morning} selected={time} onPick={pickTime} />
                        <SlotGroup label={tb.afternoon} icon={Clock} slots={slots.afternoon} selected={time} onPick={pickTime} />
                      </>
                    )}

                    {/* ------------------------------------------ details form */}
                    <form
                      onSubmit={submit}
                      noValidate
                      style={{ opacity: ready ? 1 : 0.6 }}
                      className="mt-auto space-y-3 border-t border-line pt-5 transition-opacity duration-300"
                    >
                      {/* The fields below are disabled until a slot is picked.
                          Dimming them without saying why just looks broken. */}
                      {!ready && !submitError && (
                        <p className="text-xs text-mist" role="status">
                          {tb.formHint}
                        </p>
                      )}
                      {submitError && (
                        <p className="rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger" role="alert">
                          {submitError}
                        </p>
                      )}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-mist">
                            {tb.nameLabel}
                          </span>
                          <input
                            ref={nameRef}
                            value={form.name}
                            onChange={(e) => {
                              setForm((f) => ({ ...f, name: e.target.value }));
                              if (errors.name) setErrors((x) => ({ ...x, name: undefined }));
                            }}
                            disabled={!ready}
                            autoComplete="name"
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? 'booking-name-err' : undefined}
                            className={`w-full rounded-xl border ${errors.name ? 'border-danger/70' : 'border-line'} bg-raise px-3 py-2.5 text-sm text-fog outline-none transition-colors focus:border-accent/70 disabled:cursor-not-allowed`}
                          />
                          {errors.name && (
                            <span id="booking-name-err" className="mt-1 block text-xs text-danger">
                              {errors.name}
                            </span>
                          )}
                        </label>
                        <label className="block">
                          <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-mist">
                            {tb.emailLabel}
                          </span>
                          <input
                            ref={emailRef}
                            type="email"
                            value={form.email}
                            onChange={(e) => {
                              setForm((f) => ({ ...f, email: e.target.value }));
                              if (errors.email) setErrors((x) => ({ ...x, email: undefined }));
                            }}
                            disabled={!ready}
                            autoComplete="email"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'booking-email-err' : undefined}
                            className={`w-full rounded-xl border ${errors.email ? 'border-danger/70' : 'border-line'} bg-raise px-3 py-2.5 text-sm text-fog outline-none transition-colors focus:border-accent/70 disabled:cursor-not-allowed`}
                          />
                          {errors.email && (
                            <span id="booking-email-err" className="mt-1 block text-xs text-danger">
                              {errors.email}
                            </span>
                          )}
                        </label>
                      </div>

                      {/* What the call should be about. Optional: a visitor
                          who just wants to talk should not be stopped. */}
                      <label className="block">
                        <span className="mb-1.5 flex items-baseline justify-between gap-3 text-[11px] font-medium uppercase tracking-wide text-mist">
                          {tb.messageLabel}
                          <span className="normal-case tracking-normal text-mist/70">{tb.optional}</span>
                        </span>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                          disabled={!ready}
                          rows={3}
                          maxLength={2000}
                          placeholder={tb.messagePlaceholder}
                          className="w-full resize-none rounded-xl border border-line bg-raise px-3 py-2.5 text-sm text-fog outline-none transition-colors placeholder:text-mist/50 focus:border-accent/70 disabled:cursor-not-allowed"
                        />
                      </label>

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
                    </form>
                  </div>
                </div>
              )}
          </div>
        </Reveal>
    </div>
    </Section>
  );
}
