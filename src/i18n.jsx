import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Lightweight i18n. Copy is Dutch-first (NL default) with an English mirror.
 * Tone: plain and simple — a 12-year-old should get what HinIT does.
 */
export const translations = {
  nl: {
    nav: { services: 'Wat we doen', why: 'Waarom HinIT', process: 'Zo werkt het', contact: 'Contact', cta: 'Plan een gesprek' },
    theme: { toLight: 'Licht thema', toDark: 'Donker thema' },
    hero: {
      badge: 'IT-hulp uit Amsterdam',
      titleStatic: 'IT die gewoon',
      titleAccent: 'werkt.',
      sub: 'Wij houden de computers, het internet en de beveiliging van uw bedrijf draaiend. U werkt door, wij lossen de rest op.',
      ctaPrimary: 'Plan een gratis gesprek',
      ctaSecondary: 'Bekijk wat we doen',
      chips: ['Binnen 15 minuten reactie', 'Altijd hetzelfde team', 'Geen moeilijke praat'],
      scroll: 'Scroll',
    },
    trust: { label: 'Vertrouwd door groeiende bedrijven' },
    services: {
      kicker: 'Wat we doen',
      title: 'Alles voor uw IT, op één plek.',
      sub: 'U hoeft niet meer met vijf bedrijven te bellen. Wij regelen alles rond computers, internet en veiligheid.',
      link: 'Meer weten',
      items: [
        { t: 'IT-beheer', d: 'Wij houden al uw computers en systemen in de gaten en up-to-date.' },
        { t: 'Beveiliging', d: 'Wij beschermen u tegen hackers, virussen en nep-mails.' },
        { t: 'Netwerk & apparatuur', d: 'Snel, stabiel internet en apparaten die het gewoon doen.' },
        { t: 'Hulp bij problemen', d: 'Loopt iets vast? Eén belletje en wij helpen u meteen.' },
        { t: 'Slimmer werken', d: 'Wij nemen saai, herhalend werk uit handen met slimme tools.' },
        { t: 'Werkplekken', d: 'Veilige laptops en accounts voor uw hele team, waar ze ook werken.' },
      ],
    },
    why: {
      kicker: 'Waarom HinIT',
      title: 'IT-zorgen? Die nemen wij over.',
      body: 'Wij zijn uw vaste IT-team. We lossen problemen vaak al op voordat u ze merkt, praten in gewone taal en zijn altijd bereikbaar. Zo kunt u zich bezighouden met uw werk.',
      pillars: [
        { t: 'Vóór op problemen', d: 'We lossen dingen op nog voordat u er last van heeft.' },
        { t: 'Een vast team', d: 'Altijd dezelfde mensen die u en uw bedrijf kennen.' },
        { t: 'Altijd aan', d: 'Uw systemen blijven werken, dag en nacht.' },
        { t: 'Groeit met u mee', d: 'Wordt uw bedrijf groter? Uw IT groeit gewoon mee.' },
      ],
    },
    process: {
      kicker: 'Zo werkt het',
      title: 'In 3 simpele stappen geregeld.',
      steps: [
        { n: '01', t: 'Kennismaken', d: 'We kijken samen naar uw computers en systemen en wat beter kan.' },
        { n: '02', t: 'Plan maken', d: 'We vertellen u helder wat we als eerste oppakken en waarom.' },
        { n: '03', t: 'Regelen & bewaken', d: 'Wij voeren het uit en houden alles in de gaten. U heeft er geen omkijken naar.' },
      ],
    },
    stats: {
      kicker: 'In cijfers',
      title: 'Cijfers waar u op kunt rekenen.',
      items: [
        { v: 99.9, suffix: '%', label: 'Altijd online', dec: 1 },
        { v: 15, prefix: '< ', suffix: ' min', label: 'Snel antwoord', dec: 0 },
        { v: 24, suffix: '/7', label: 'We letten op', dec: 0 },
        { v: 50, suffix: '+', label: 'Blije klanten', dec: 0 },
      ],
      badges: ['ISO 27001', 'Microsoft Partner', 'GDPR', 'SOC 2', 'NIS2'],
      note: 'TODO: cijfers en certificeringen verifiëren vóór livegang.',
    },
    testimonials: {
      kicker: 'Klanten',
      title: 'Klanten die rustig slapen.',
      items: [
        { q: 'Sinds HinIT onze IT regelt, werkt gewoon alles. En ze denken met ons mee. Eindelijk een IT-partner die luistert.', n: 'Sanne de Vries', r: 'COO, groeiend bedrijf' },
        { q: 'Zo snel! Een probleem is vaak al opgelost voordat wij het goed en wel doorgeven. En altijd een bekend gezicht.', n: 'Marco Jansen', r: 'Directeur, MKB' },
        { q: 'Van een chaos aan losse tools naar één veilig systeem. HinIT bracht rust en overzicht.', n: 'Amir El Haddad', r: 'Hoofd Operations, non-profit' },
      ],
      note: 'TODO: echte quotes, namen en logo’s toevoegen.',
    },
    contact: {
      kicker: 'Contact',
      title: 'Klaar voor IT zonder zorgen?',
      sub: 'Plan een gratis gesprek. We denken graag met u mee — in gewone taal en zonder verkooppraat.',
      name: 'Uw naam',
      email: 'Uw e-mail',
      message: 'Waar kunnen we mee helpen?',
      send: 'Verstuur',
      sending: 'Versturen…',
      success: 'Bedankt! We nemen binnen één werkdag contact met u op.',
      chips: ['Persoonlijk', 'Duidelijk', 'Veilig'],
      errors: { name: 'Vul uw naam in.', email: 'Vul een geldig e-mailadres in.', message: 'Vertel kort waar we mee kunnen helpen.' },
    },
    footer: {
      tagline: 'Uw IT, veilig en zonder zorgen geregeld.',
      nav: ['Home', 'Wat we doen', 'Waarom HinIT', 'Contact'],
      built: 'Gemaakt in Amsterdam',
      rights: 'Alle rechten voorbehouden.',
    },
  },

  en: {
    nav: { services: 'What we do', why: 'Why HinIT', process: 'How it works', contact: 'Contact', cta: 'Book a call' },
    theme: { toLight: 'Light theme', toDark: 'Dark theme' },
    hero: {
      badge: 'IT help from Amsterdam',
      titleStatic: 'IT that just',
      titleAccent: 'works.',
      sub: 'We keep your computers, internet and security up and running. You keep working, we handle the rest.',
      ctaPrimary: 'Book a free call',
      ctaSecondary: 'See what we do',
      chips: ['Reply within 15 minutes', 'Always the same team', 'No tech jargon'],
      scroll: 'Scroll',
    },
    trust: { label: 'Trusted by growing companies' },
    services: {
      kicker: 'What we do',
      title: 'Everything for your IT, in one place.',
      sub: 'No more calling five different companies. We take care of everything around computers, internet and security.',
      link: 'Learn more',
      items: [
        { t: 'IT management', d: 'We keep all your computers and systems watched and up to date.' },
        { t: 'Security', d: 'We protect you from hackers, viruses and fake emails.' },
        { t: 'Network & devices', d: 'Fast, stable internet and devices that simply work.' },
        { t: 'Help when stuck', d: 'Something broken? One call and we help you right away.' },
        { t: 'Work smarter', d: 'We take boring, repetitive work off your hands with smart tools.' },
        { t: 'Workplaces', d: 'Safe laptops and accounts for your whole team, wherever they work.' },
      ],
    },
    why: {
      kicker: 'Why HinIT',
      title: 'IT worries? We take them off your plate.',
      body: 'We are your dedicated IT team. We often fix problems before you even notice them, we speak plain language and we are always reachable. So you can focus on your work.',
      pillars: [
        { t: 'Ahead of problems', d: 'We fix things before they ever bother you.' },
        { t: 'A dedicated team', d: 'Always the same people who know you and your business.' },
        { t: 'Always on', d: 'Your systems keep running, day and night.' },
        { t: 'Grows with you', d: 'Business getting bigger? Your IT simply grows along.' },
      ],
    },
    process: {
      kicker: 'How it works',
      title: 'Sorted in 3 simple steps.',
      steps: [
        { n: '01', t: 'Get to know you', d: 'Together we look at your computers and systems and what can be better.' },
        { n: '02', t: 'Make a plan', d: 'We tell you clearly what we tackle first and why.' },
        { n: '03', t: 'Run & watch it', d: 'We carry it out and keep an eye on everything. You never have to worry.' },
      ],
    },
    stats: {
      kicker: 'By the numbers',
      title: 'Numbers you can count on.',
      items: [
        { v: 99.9, suffix: '%', label: 'Always online', dec: 1 },
        { v: 15, prefix: '< ', suffix: ' min', label: 'Fast reply', dec: 0 },
        { v: 24, suffix: '/7', label: 'We keep watch', dec: 0 },
        { v: 50, suffix: '+', label: 'Happy clients', dec: 0 },
      ],
      badges: ['ISO 27001', 'Microsoft Partner', 'GDPR', 'SOC 2', 'NIS2'],
      note: 'TODO: verify figures and certifications before launch.',
    },
    testimonials: {
      kicker: 'Clients',
      title: 'Clients who sleep easy.',
      items: [
        { q: 'Since HinIT runs our IT, everything just works. And they think along with us. Finally an IT partner that listens.', n: 'Sanne de Vries', r: 'COO, growing company' },
        { q: 'So fast! A problem is often fixed before we even finish reporting it. And always a familiar face.', n: 'Marco Jansen', r: 'Director, SME' },
        { q: 'From a mess of separate tools to one safe system. HinIT brought calm and clarity.', n: 'Amir El Haddad', r: 'Head of Operations, non-profit' },
      ],
      note: 'TODO: add real quotes, names and logos.',
    },
    contact: {
      kicker: 'Contact',
      title: 'Ready for IT without the worries?',
      sub: 'Book a free call. We’re happy to think along — in plain language and with no sales pitch.',
      name: 'Your name',
      email: 'Your email',
      message: 'What can we help you with?',
      send: 'Send',
      sending: 'Sending…',
      success: 'Thank you! We’ll get back to you within one business day.',
      chips: ['Personal', 'Clear', 'Secure'],
      errors: { name: 'Please enter your name.', email: 'Please enter a valid email address.', message: 'Tell us briefly what we can help with.' },
    },
    footer: {
      tagline: 'Your IT, secure and worry-free.',
      nav: ['Home', 'What we do', 'Why HinIT', 'Contact'],
      built: 'Made in Amsterdam',
      rights: 'All rights reserved.',
    },
  },
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('nl');
  const toggle = useCallback(() => setLang((l) => (l === 'nl' ? 'en' : 'nl')), []);
  const t = translations[lang];
  return <I18nContext.Provider value={{ lang, setLang, toggle, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
