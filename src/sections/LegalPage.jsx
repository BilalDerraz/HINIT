import { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Cookie } from 'lucide-react';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';
import Section from '../components/Section';
import { pageHref } from '../lib/router';
import { useDocumentHead, SITE_NAME, SITE_URL } from '../lib/head';

const ICONS = { privacy: ShieldCheck, cookies: Cookie };

/**
 * The privacy and cookie statements.
 *
 * Both are the same shape — a lead paragraph and a list of sections that may
 * carry prose, a bullet list or a small table — so one renderer covers them
 * and the copy stays entirely in i18n, where it can be kept in step with what
 * the site actually does.
 */
export default function LegalPage({ slug }) {
  const { t, lang } = useI18n();
  const legal = t.legal;
  const doc = legal[slug];
  const Icon = ICONS[slug] ?? ShieldCheck;

  // A route change is a page change: start at the top, as a real navigation would.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [slug]);

  useDocumentHead({
    title: doc ? `${doc.title} — ${SITE_NAME}` : t.meta.title,
    description: doc?.meta || t.meta.description,
    canonical: doc ? `${SITE_URL}#/${slug}` : SITE_URL,
    ogLocale: t.ogLocale,
  });

  if (!doc) return null;

  const updated = new Date(legal.updated);
  const updatedLabel = Number.isNaN(updated.valueOf())
    ? legal.updated
    : updated.toLocaleDateString(t.locale, { day: 'numeric', month: 'long', year: 'numeric' });

  // the sibling statement — the two are always read together
  const other = slug === 'privacy' ? 'cookies' : 'privacy';

  return (
    <article className="relative" lang={lang}>
      <header className="relative overflow-hidden pb-6 pt-32 sm:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(60% 50% at 50% 0%, rgba(50,87,213,0.16) 0%, transparent 70%)' }}
        />
        <div className="container-page container-prose relative">
          <Reveal>
            <nav aria-label={t.servicePage.breadcrumb} className="mb-8">
              <a
                href="#/"
                className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-line bg-raise px-4 py-2 text-xs font-medium text-mist transition-colors hover:text-fog"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                {legal.backHome}
              </a>
            </nav>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="bg-brand-gradient mb-7 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[0_12px_30px_-12px_rgba(50,87,213,0.7)]">
              <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="type-page font-display font-semibold text-fog">{doc.title}</h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="type-lead mt-5 text-mist">{doc.lead}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-xs text-mist/80">
              {legal.updatedLabel}: <time dateTime={legal.updated}>{updatedLabel}</time>
            </p>
          </Reveal>
        </div>
      </header>

      <Section size="sm" prose>
        <div className="space-y-10">
          {doc.sections.map((sec, i) => (
            <Reveal key={sec.h} delay={Math.min(i, 4) * 0.04} as="section">
              <h2 className="font-display text-xl font-semibold text-fog sm:text-2xl">{sec.h}</h2>

              {sec.body?.map((para) => (
                <p key={para} className="mt-4 text-[15px] leading-relaxed text-mist">
                  {para}
                </p>
              ))}

              {sec.list && (
                <ul className="mt-4 space-y-2.5">
                  {sec.list.map((li) => (
                    <li key={li} className="flex gap-3 text-[15px] leading-relaxed text-mist">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {li}
                    </li>
                  ))}
                </ul>
              )}

              {sec.table && (
                /* narrow phones cannot fit four columns — let the table scroll
                   inside its own card rather than pushing the page sideways */
                <div className="card mt-5 overflow-x-auto rounded-2xl">
                  <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-line">
                        {sec.table.head.map((th) => (
                          <th key={th} scope="col" className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-mist">
                            {th}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sec.table.rows.map((row) => (
                        <tr key={row[0]} className="border-b border-line last:border-0">
                          <th scope="row" className="whitespace-nowrap px-4 py-3 font-mono text-[13px] font-medium text-accent">
                            {row[0]}
                          </th>
                          {row.slice(1).map((cell) => (
                            <td key={cell} className="px-4 py-3 align-top leading-relaxed text-mist">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {sec.after?.map((para) => (
                <p key={para} className="mt-4 text-[15px] leading-relaxed text-mist">
                  {para}
                </p>
              ))}
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-line pt-8">
            <a
              href={pageHref(other)}
              className="tap inline-flex items-center gap-2 rounded-full border border-line bg-raise px-5 py-2.5 text-sm font-medium text-fog transition-colors hover:border-accent/60 hover:text-accent"
            >
              {legal[other].nav}
            </a>
            <a
              href="#contact"
              className="tap inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-mist transition-colors hover:text-fog"
            >
              {t.nav.contact}
            </a>
          </div>
        </Reveal>
      </Section>
    </article>
  );
}
