import { useI18n } from '../i18n';
import { useTheme } from '../theme';
import { clients } from '../data/clients';

/* The heading reads as a client list, so the strip only exists once there are
   real clients to show — see src/data/clients.js. */
export default function TrustBar() {
  const { t } = useI18n();
  const { theme } = useTheme();

  if (!clients.length) return null;

  return (
    <section className="relative section-y-tight border-y border-line" aria-label={t.trust.label}>
      <p className="kicker mb-6 text-center sm:mb-8">{t.trust.label}</p>

      {/* scrolls sideways on narrow screens instead of wrapping into a tall block */}
      <div className="no-scrollbar overflow-x-auto">
        <ul className="mx-auto flex w-max max-w-6xl list-none items-center gap-x-10 px-5 sm:w-auto sm:flex-wrap sm:justify-center sm:gap-x-14 sm:gap-y-6">
          {clients.map((c) => {
            const src = theme === 'dark' && c.logoDark ? c.logoDark : c.logo;
            const inner = src ? (
              <img
                src={src}
                alt={c.name}
                loading="lazy"
                // no dark variant supplied: derive one from the light logo
                data-auto-dark={theme === 'dark' && !c.logoDark ? '' : undefined}
                className="client-logo h-7 w-auto max-w-[9rem] object-contain sm:h-8 sm:max-w-[11rem]"
              />
            ) : (
              <span className="font-display text-base font-medium tracking-tight text-mist transition-colors hover:text-fog sm:text-lg">
                {c.name}
              </span>
            );
            return (
              <li key={c.name} className="flex shrink-0 items-center">
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center rounded-lg"
                    aria-label={c.name}
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
