import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useI18n } from '../i18n';
import { useTheme } from '../theme';
import CTAButton from '../components/CTAButton';

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <span className="relative flex h-8 w-8 items-center justify-center">
        <svg viewBox="0 0 32 32" className="h-8 w-8">
          <defs>
            <linearGradient id="navg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B5BFF" />
              <stop offset="0.5" stopColor="#00E0FF" />
              <stop offset="1" stopColor="#8B5CFF" />
            </linearGradient>
          </defs>
          <g stroke="url(#navg)" strokeWidth="1.1" opacity="0.7">
            <line x1="9" y1="9" x2="16" y2="16" />
            <line x1="23" y1="9" x2="16" y2="16" />
            <line x1="9" y1="23" x2="16" y2="16" />
            <line x1="23" y1="23" x2="16" y2="16" />
          </g>
          <g fill="url(#navg)">
            <circle cx="9" cy="9" r="2.2" />
            <circle cx="23" cy="9" r="2.2" />
            <circle cx="16" cy="16" r="2.8" />
            <circle cx="9" cy="23" r="2.2" />
            <circle cx="23" cy="23" r="2.2" />
          </g>
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-fog">
        Hin<span className="text-gradient">IT</span>
      </span>
    </a>
  );
}

export default function Nav() {
  const { t, lang, toggle } = useI18n();
  const { theme, toggle: toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#services', label: t.nav.services },
    { href: '#why', label: t.nav.why },
    { href: '#process', label: t.nav.process },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-[900] flex justify-center px-4 pt-3 sm:pt-4"
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 sm:px-5 ${
          scrolled ? 'glass shadow-[0_8px_40px_-12px_rgba(0,0,0,0.35)]' : 'border border-transparent'
        }`}
      >
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative rounded-full px-4 py-2 text-sm text-mist transition-colors hover:text-fog"
            >
              {l.label}
              <span className="absolute inset-x-4 bottom-1 h-px scale-x-0 bg-gradient-to-r from-blue via-cyan to-violet transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-raise text-fog transition-colors hover:text-blue"
            aria-label={theme === 'dark' ? t.theme.toLight : t.theme.toDark}
            title={theme === 'dark' ? t.theme.toLight : t.theme.toDark}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" strokeWidth={1.8} /> : <Moon className="h-4 w-4" strokeWidth={1.8} />}
          </button>

          {/* NL / EN toggle */}
          <button
            onClick={toggle}
            className="relative flex items-center rounded-full border border-line bg-raise p-0.5 text-[11px] font-medium"
            aria-label="Language toggle"
          >
            <span className={`relative z-10 rounded-full px-2.5 py-1 transition-colors ${lang === 'nl' ? 'text-white' : 'text-mist'}`}>
              NL
            </span>
            <span className={`relative z-10 rounded-full px-2.5 py-1 transition-colors ${lang === 'en' ? 'text-white' : 'text-mist'}`}>
              EN
            </span>
            <motion.span
              layout
              className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full"
              style={{ background: 'linear-gradient(100deg,#3B5BFF,#8B5CFF)' }}
              animate={{ left: lang === 'nl' ? '2px' : 'calc(50% + 0px)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          </button>

          <div className="hidden sm:block">
            <CTAButton href="#contact" className="px-5 py-2.5 text-[13px]">
              {t.nav.cta}
            </CTAButton>
          </div>

          {/* mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-raise lg:hidden"
            aria-label="Menu"
          >
            <div className="flex flex-col gap-1">
              <span className={`h-px w-4 bg-fog transition-all ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
              <span className={`h-px w-4 bg-fog transition-all ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* mobile dropdown */}
      <motion.div
        initial={false}
        animate={open ? { opacity: 1, y: 0, pointerEvents: 'auto' } : { opacity: 0, y: -10, pointerEvents: 'none' }}
        transition={{ duration: 0.25 }}
        className="glass absolute top-[68px] left-4 right-4 rounded-3xl p-4 lg:hidden"
      >
        <div className="flex flex-col">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-3 text-base text-fog last:border-0"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-3 rounded-full py-3 text-center text-sm font-medium text-white"
            style={{ background: 'linear-gradient(100deg,#3B5BFF,#00E0FF,#8B5CFF)' }}
          >
            {t.nav.cta}
          </a>
        </div>
      </motion.div>
    </motion.header>
  );
}
