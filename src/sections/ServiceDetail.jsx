import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight } from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';
import CTAButton from '../components/CTAButton';
import { icons, accents } from './Services';
import { serviceHref } from '../lib/router';
import { useDocumentHead, SITE_NAME, SITE_URL } from '../lib/head';

/** Shown when a URL points at a service that does not exist. */
function NotFound({ sp, items }) {
  return (
    <section className="relative mx-auto max-w-3xl px-5 pb-24 pt-36 text-center sm:pt-44">
      <h1 className="font-display text-[clamp(1.9rem,5vw,3rem)] font-semibold leading-[1.05] text-fog">
        {sp.notFoundTitle}
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-mist">{sp.notFoundBody}</p>

      <ul className="mx-auto mt-10 grid list-none gap-3 sm:grid-cols-2">
        {items.map((s, i) => (
          <li key={s.slug}>
            <a
              href={serviceHref(s.slug)}
              style={{ '--card-accent': accents[i % accents.length] }}
              className="card-pop-link card flex items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left text-sm font-medium transition-colors hover:border-accent/50"
            >
              {s.t}
              <ChevronRight className="h-4 w-4 shrink-0" />
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-center">
        <CTAButton href="#/" variant="ghost">
          {sp.notFoundCta}
        </CTAButton>
      </div>
    </section>
  );
}

export default function ServiceDetail({ slug }) {
  const { t } = useI18n();
  const sp = t.servicePage;
  const items = t.services.items;
  const index = items.findIndex((s) => s.slug === slug);
  const service = index === -1 ? null : items[index];
  const d = service?.detail;

  // A route change is a page change: start at the top, as a real navigation would.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [slug]);

  useDocumentHead({
    title: service ? `${service.t} — ${SITE_NAME}` : t.meta.title,
    description: d?.meta || t.meta.description,
    canonical: service ? `${SITE_URL}#/services/${service.slug}` : SITE_URL,
    ogLocale: t.ogLocale,
  });

  if (!service) return <NotFound sp={sp} items={items} />;

  // wrap, so extra services added to the copy cannot index past the art
  const Icon = icons[index % icons.length];
  const accent = accents[index % accents.length];
  const others = items.filter((s) => s.slug !== slug);

  return (
    <article className="relative">
      {/* ------------------------------------------------------------ hero */}
      <header className="relative overflow-hidden pb-14 pt-32 sm:pb-16 sm:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(60% 50% at 50% 0%, ${accent}22 0%, transparent 70%)`,
          }}
        />
        <div className="relative mx-auto max-w-4xl px-5">
          <Reveal>
            <nav aria-label={sp.breadcrumb} className="mb-8">
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-raise px-4 py-2 text-xs font-medium text-mist transition-colors hover:text-fog"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
                {sp.back}
              </a>
            </nav>
          </Reveal>

          <Reveal delay={0.05}>
            <div
              className="mb-7 inline-flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-[0_12px_30px_-12px_rgba(50,87,213,0.7)]"
              style={{ background: `linear-gradient(140deg, ${accent} 0%, #2f7fe0 100%)` }}
            >
              <Icon className="h-7 w-7" strokeWidth={1.8} aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-display text-[clamp(2.2rem,6vw,4rem)] font-semibold leading-[1] tracking-[-0.02em] text-fog">
              {service.t}
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fog/90 sm:text-xl">{d.tagline}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist">{d.intro}</p>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <CTAButton href="#booking" className="w-full sm:w-auto">
                {sp.ctaPrimary}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </CTAButton>
              <CTAButton href="#contact" variant="ghost" className="w-full sm:w-auto">
                {sp.ctaSecondary}
              </CTAButton>
            </div>
          </Reveal>
        </div>
      </header>

      {/* -------------------------------------------------------- what you get */}
      <section className="relative py-14 sm:py-20" aria-labelledby="svc-includes">
        <div className="mx-auto max-w-4xl px-5">
          <Reveal>
            <h2
              id="svc-includes"
              className="font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold leading-[1.1] text-fog"
            >
              {sp.includes}
            </h2>
          </Reveal>

          <ul className="mt-8 grid list-none gap-4 sm:grid-cols-2">
            {d.includes.map((inc, i) => (
              <Reveal key={inc.t} as="li" delay={Math.min(i, 3) * 0.06}>
                <div className="card h-full rounded-3xl p-6">
                  <span
                    aria-hidden="true"
                    className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold text-white"
                    style={{ background: accent }}
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-fog">{inc.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{inc.d}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------------- outcomes */}
      <section className="relative py-14 sm:py-20" aria-labelledby="svc-outcomes">
        <div className="mx-auto max-w-4xl px-5">
          <Reveal>
            <div className="card rounded-3xl p-6 sm:p-9">
              <h2
                id="svc-outcomes"
                className="font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold leading-[1.1] text-fog"
              >
                {sp.outcomes}
              </h2>
              <ul className="mt-7 grid list-none gap-4 sm:grid-cols-2">
                {d.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-[15px] leading-relaxed text-fog/85">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ background: `${accent}26`, color: accent }}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------------- faq */}
      <section className="relative py-14 sm:py-20" aria-labelledby="svc-faq">
        <div className="mx-auto max-w-4xl px-5">
          <Reveal>
            <h2
              id="svc-faq"
              className="font-display text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold leading-[1.1] text-fog"
            >
              {sp.faq}
            </h2>
          </Reveal>
          <dl className="mt-8 space-y-4">
            {d.faq.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.06}>
                <div className="card rounded-2xl p-6">
                  <dt className="font-display text-base font-semibold text-fog">{f.q}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-mist">{f.a}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* -------------------------------------------------------------- cta */}
      <section className="relative py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-5">
          <Reveal>
            <div className="bg-brand-gradient relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-14">
              <h2 className="font-display text-[clamp(1.6rem,3.8vw,2.5rem)] font-semibold leading-[1.1] text-white">
                {sp.ctaTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85">{sp.ctaBody}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#booking"
                  className="tap inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[#22307a] transition-transform duration-300 hover:-translate-y-0.5 sm:w-auto"
                >
                  {sp.ctaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="tap inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
                >
                  {sp.ctaSecondary}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------- other services */}
      <section className="relative pb-20 pt-4 sm:pb-28" aria-labelledby="svc-other">
        <div className="mx-auto max-w-4xl px-5">
          <Reveal>
            <h2 id="svc-other" className="font-display text-xl font-semibold text-fog">
              {sp.other}
            </h2>
          </Reveal>
          <ul className="mt-6 grid list-none gap-3 sm:grid-cols-2">
            {others.map((s, i) => {
              const oi = items.findIndex((x) => x.slug === s.slug);
              const OtherIcon = icons[oi % icons.length];
              return (
                <Reveal key={s.slug} as="li" delay={Math.min(i, 3) * 0.05}>
                  <a
                    href={serviceHref(s.slug)}
                    className="card group flex h-full items-center gap-4 rounded-2xl p-5 transition-colors hover:border-accent/50"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${accents[oi % accents.length]}1f`, color: accents[oi % accents.length] }}
                    >
                      <OtherIcon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-base font-semibold text-fog">{s.t}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-mist">{s.d}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-mist transition-transform duration-300 group-hover:translate-x-0.5" />
                  </a>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>
    </article>
  );
}
