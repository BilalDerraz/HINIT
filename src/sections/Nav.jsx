import { useEffect, useRef, useState, useMemo } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useI18n } from '../i18n';
import { useTheme } from '../theme';
import CTAButton from '../components/CTAButton';
import Logo from '../components/Logo';
import useActiveSection from '../components/useActiveSection';

const SECTION_IDS = ['top', 'services', 'why', 'process', 'booking', 'faq', 'contact'];

export default function Nav({ routePath = '/' }) {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle: toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const burgerRef = useRef(null);
  const seen = useActiveSection(useMemo(() => SECTION_IDS, []), routePath);
  // Those sections only exist on the home page — never highlight a link while
  // the visitor is reading a service page.
  const active = routePath === '/' ? seen : null;

  // A route change replaces the page under the sheet; close it so the visitor
  // is not left staring at a menu over unrelated content.
  useEffect(() => setOpen(false), [routePath]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock the page behind the mobile sheet, and close it on Escape, on an
  // outside click, or as soon as the layout grows to the desktop nav.
  useEffect(() => {
    document.body.dataset.lock = open ? 'true' : 'false';
    if (!open) return;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    const onClick = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !burgerRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const mq = window.matchMedia('(min-width: 1024px)');
    const onWide = (e) => e.matches && setOpen(false);

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onClick);
    mq.addEventListener('change', onWide);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onClick);
      mq.removeEventListener('change', onWide);
    };
  }, [open]);

  useEffect(() => () => { document.body.dataset.lock = 'false'; }, []);

  const links = [
    { href: '#services', id: 'services', label: t.nav.services },
    { href: '#why', id: 'why', label: t.nav.why },
    { href: '#process', id: 'process', label: t.nav.process },
    { href: '#booking', id: 'booking', label: t.nav.booking },
    { href: '#faq', id: 'faq', label: t.nav.faq },
  ];

  return (
    <header className="drop-in fixed inset-x-0 top-0 z-[900] flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      {/* The sheet below is positioned against this wrapper, so it always hangs
          exactly under the bar — the bar's height changes with the breakpoint
          (padding, logo size, 44px tap targets) and a fixed offset drifted into
          it on small screens. */}
      <div className="relative w-full max-w-6xl">
        <nav
          aria-label={t.nav.mainMenu}
          className={`flex w-full items-center justify-between rounded-full px-3 py-2 transition-all duration-300 sm:px-5 sm:py-2.5 ${
            scrolled || open ? 'glass shadow-[0_8px_40px_-12px_rgba(0,0,0,0.35)]' : 'border border-transparent'
          }`}
        >
          <a href="#top" className="flex shrink-0 items-center rounded-lg" aria-label={t.nav.toTop}>
            <Logo className="h-[26px] sm:h-[30px]" />
          </a>

          <div className="hidden items-center gap-0.5 lg:flex">
            {links.map((l) => {
              const isActive = active === l.id;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`group relative rounded-full px-3.5 py-2 text-sm transition-colors ${
                    isActive ? 'text-fog' : 'text-mist hover:text-fog'
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute inset-x-3.5 bottom-1 h-px origin-left bg-accent transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={toggleTheme}
              className="tap flex h-9 w-9 items-center justify-center rounded-full border border-line bg-raise text-fog transition-colors hover:text-accent"
              aria-label={theme === 'dark' ? t.theme.toLight : t.theme.toDark}
              title={theme === 'dark' ? t.theme.toLight : t.theme.toDark}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" strokeWidth={1.8} /> : <Moon className="h-4 w-4" strokeWidth={1.8} />}
            </button>

            {/* NL / EN — two real buttons so each is reachable and announced */}
            <div
              className="relative flex items-center rounded-full border border-line bg-raise p-0.5 text-[11px] font-medium"
              role="group"
              aria-label="Taal / Language"
            >
              {/* the pill that slides under the active language */}
              <span
                aria-hidden="true"
                className="bg-brand-gradient absolute bottom-0.5 top-0.5 w-[calc(50%-2px)] rounded-full transition-[left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ left: lang === 'nl' ? '2px' : '50%' }}
              />
              {['nl', 'en'].map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`relative z-10 rounded-full px-2.5 py-1 uppercase transition-colors ${
                    lang === code ? 'text-white' : 'text-mist hover:text-fog'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            <div className="hidden sm:block">
              <CTAButton href="#booking" className="px-4 py-2.5 text-[13px] lg:px-5">
                {t.nav.cta}
              </CTAButton>
            </div>

            <button
              ref={burgerRef}
              onClick={() => setOpen((v) => !v)}
              className="tap flex h-9 w-9 items-center justify-center rounded-full border border-line bg-raise text-fog lg:hidden"
              aria-label={open ? t.nav.close : t.nav.menu}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="h-4 w-4" strokeWidth={2} /> : <Menu className="h-4 w-4" strokeWidth={2} />}
            </button>
          </div>
        </nav>

        <div
          id="mobile-menu"
          ref={panelRef}
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'none' : 'translateY(-10px)',
            pointerEvents: open ? 'auto' : 'none',
          }}
          className="glass absolute left-0 right-0 top-full mt-2 rounded-3xl p-3 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden"
          aria-hidden={!open}
        >
          <div className="flex flex-col">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                aria-current={active === l.id ? 'true' : undefined}
                className={`tap flex items-center border-b border-line px-2 text-base transition-colors last:border-0 ${
                  active === l.id ? 'text-accent' : 'text-fog'
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="tap flex items-center border-t border-line px-2 text-base text-fog"
            >
              {t.nav.contact}
            </a>
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="bg-brand-gradient mt-3 rounded-full py-3.5 text-center text-sm font-medium text-white"
            >
              {t.nav.cta}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
