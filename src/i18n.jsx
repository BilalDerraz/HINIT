import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Lightweight i18n. Copy is Dutch-first (NL default) with an English mirror.
 * TODO: have a native EN copywriter polish the English strings before launch.
 */
export const translations = {
  nl: {
    nav: { services: 'Diensten', why: 'Waarom HinIT', process: 'Aanpak', contact: 'Contact', cta: 'Plan een gesprek' },
    hero: {
      badge: 'Managed IT · Cybersecurity · Infrastructuur',
      titleStatic: 'IT die niet',
      rotating: ['stilstaat.', 'vooruitdenkt.', 'onbreekbaar is.'],
      sub: 'Managed IT, cybersecurity en infrastructuur voor organisaties die niet kunnen wachten op morgen. Gevestigd in Amsterdam. Direct bereikbaar.',
      ctaPrimary: 'Plan een gesprek',
      ctaSecondary: 'Ontdek onze diensten',
      chips: ['Gevestigd in Amsterdam', 'Direct persoonlijk contact', 'Proactief beheer, geen verrassingen'],
      scroll: 'Scroll',
    },
    trust: { label: 'Vertrouwd door groeiende organisaties' },
    services: {
      kicker: 'Diensten',
      title: 'Van losse oplossingen naar één sterke IT-basis.',
      sub: 'Met de juiste mix van beheer, beveiliging en support blijft uw organisatie wendbaar, productief en klaar voor de volgende stap.',
      link: 'Bekijk dienst',
      items: [
        { t: 'Managed IT Services', d: 'Proactief beheer, monitoring en optimalisatie van uw IT-omgeving.' },
        { t: 'Cybersecurity', d: 'Bescherming tegen ransomware, phishing en moderne dreigingen.' },
        { t: 'Infrastructuur & Hardware', d: 'Een betrouwbare technische basis die met uw organisatie meegroeit.' },
        { t: 'IT Support', d: 'Persoonlijke hulp bij incidenten, storingen en dagelijkse vragen.' },
        { t: 'Automatisering', d: 'Verminder handmatig werk en versnel uw processen.' },
        { t: 'Werkplekbeheer', d: 'Veilige, moderne werkplekken voor hybride teams.' },
      ],
    },
    why: {
      kicker: 'Waarom HinIT',
      title: 'IT die vooruitdenkt, zodat u dat ook kunt.',
      body: 'HinIT is uw praktische IT-partner voor organisaties die niet willen wachten. We brengen technische diepgang, heldere communicatie en eigenaarschap samen — en bouwen aan een IT-basis die vandaag werkt en morgen meegroeit.',
      pillars: [
        { t: 'Proactief', d: 'We lossen problemen op voordat u ze merkt.' },
        { t: 'Persoonlijk', d: 'Een vast team dat uw organisatie écht kent.' },
        { t: 'Betrouwbaar', d: 'Stabiele systemen en heldere afspraken.' },
        { t: 'Gebouwd voor verandering', d: 'Een basis die met u meeschaalt.' },
      ],
    },
    process: {
      kicker: 'Aanpak',
      title: 'Van vraag naar blijvende verbetering in drie heldere stappen.',
      steps: [
        { n: '01', t: 'Begrijpen', d: 'We brengen uw omgeving, risico’s en doelen in kaart.' },
        { n: '02', t: 'Prioriteren', d: 'Samen bepalen we de veiligste en meest waardevolle volgende stap.' },
        { n: '03', t: 'Verbeteren', d: 'We voeren uit, monitoren continu en blijven verbeteren.' },
      ],
    },
    stats: {
      kicker: 'In cijfers',
      title: 'Betrouwbaarheid die u kunt meten.',
      items: [
        { v: 99.9, suffix: '%', label: 'Uptime', dec: 1 },
        { v: 15, prefix: '< ', suffix: ' min', label: 'Gem. responstijd', dec: 0 },
        { v: 24, suffix: '/7', label: 'Monitoring', dec: 0 },
        { v: 50, suffix: '+', label: 'Tevreden organisaties', dec: 0 },
      ],
      badges: ['ISO 27001', 'Microsoft Partner', 'GDPR Compliant', 'SOC 2', 'NIS2 Ready'],
      note: 'TODO: cijfers en certificeringen verifiëren vóór livegang.',
    },
    testimonials: {
      kicker: 'Klanten',
      title: 'Organisaties die rustiger slapen.',
      items: [
        { q: 'Sinds HinIT ons beheer overnam, draait alles stabieler en denken ze proactief met ons mee. Eindelijk een IT-partner die echt luistert.', n: 'Sanne de Vries', r: 'COO, groeiend scale-up' },
        { q: 'De responstijd is ongelooflijk. Een storing is opgelost voordat wij hem goed en wel melden. Persoonlijk contact zonder wachtrij.', n: 'Marco Jansen', r: 'Directeur, MKB-onderneming' },
        { q: 'Van een wirwar aan losse tools naar één heldere, veilige IT-basis. HinIT bracht rust, overzicht en grip.', n: 'Amir El Haddad', r: 'Hoofd Operations, non-profit' },
      ],
      note: 'TODO: echte quotes, namen en logo’s toevoegen.',
    },
    contact: {
      kicker: 'Contact',
      title: 'Klaar voor IT die met u meebeweegt?',
      sub: 'Plan een vrijblijvend gesprek. We denken graag met u mee — helder, persoonlijk en zonder verkooppraat.',
      name: 'Naam',
      email: 'E-mailadres',
      message: 'Waar kunnen we mee helpen?',
      send: 'Neem contact op',
      sending: 'Versturen…',
      success: 'Bedankt! We nemen binnen één werkdag contact met u op.',
      chips: ['Persoonlijk', 'Helder', 'Veilig'],
      errors: { name: 'Vul uw naam in.', email: 'Vul een geldig e-mailadres in.', message: 'Vertel ons kort waar we mee kunnen helpen.' },
    },
    footer: {
      tagline: 'Uw IT-fundament. Secure, stabiel en slim.',
      nav: ['Home', 'Diensten', 'Over ons', 'Contact'],
      built: 'Gebouwd in Amsterdam',
      rights: 'Alle rechten voorbehouden.',
    },
  },

  en: {
    nav: { services: 'Services', why: 'Why HinIT', process: 'Approach', contact: 'Contact', cta: 'Book a call' },
    hero: {
      badge: 'Managed IT · Cybersecurity · Infrastructure',
      titleStatic: 'IT that never',
      rotating: ['stands still.', 'thinks ahead.', 'stays unbreakable.'],
      sub: 'Managed IT, cybersecurity and infrastructure for organizations that can’t wait for tomorrow. Based in Amsterdam. Always reachable.',
      ctaPrimary: 'Book a call',
      ctaSecondary: 'Explore our services',
      chips: ['Based in Amsterdam', 'Direct personal contact', 'Proactive management, no surprises'],
      scroll: 'Scroll',
    },
    trust: { label: 'Trusted by growing organizations' },
    services: {
      kicker: 'Services',
      title: 'From scattered tools to one strong IT foundation.',
      sub: 'With the right mix of management, security and support, your organization stays agile, productive and ready for the next step.',
      link: 'View service',
      items: [
        { t: 'Managed IT Services', d: 'Proactive management, monitoring and optimization of your IT environment.' },
        { t: 'Cybersecurity', d: 'Protection against ransomware, phishing and modern threats.' },
        { t: 'Infrastructure & Hardware', d: 'A reliable technical foundation that grows with your organization.' },
        { t: 'IT Support', d: 'Personal help with incidents, outages and everyday questions.' },
        { t: 'Automation', d: 'Reduce manual work and accelerate your processes.' },
        { t: 'Workplace Management', d: 'Secure, modern workplaces for hybrid teams.' },
      ],
    },
    why: {
      kicker: 'Why HinIT',
      title: 'IT that thinks ahead, so you can too.',
      body: 'HinIT is your practical IT partner for organizations that won’t wait. We combine technical depth, clear communication and true ownership — building an IT foundation that works today and grows with you tomorrow.',
      pillars: [
        { t: 'Proactive', d: 'We solve problems before you notice them.' },
        { t: 'Personal', d: 'A dedicated team that truly knows your organization.' },
        { t: 'Dependable', d: 'Stable systems and crystal-clear agreements.' },
        { t: 'Built for change', d: 'A foundation that scales right alongside you.' },
      ],
    },
    process: {
      kicker: 'Approach',
      title: 'From question to lasting improvement in three clear steps.',
      steps: [
        { n: '01', t: 'Understand', d: 'We map your environment, risks and goals.' },
        { n: '02', t: 'Prioritize', d: 'Together we choose the safest, most valuable next step.' },
        { n: '03', t: 'Improve', d: 'We execute, monitor continuously and keep improving.' },
      ],
    },
    stats: {
      kicker: 'By the numbers',
      title: 'Reliability you can measure.',
      items: [
        { v: 99.9, suffix: '%', label: 'Uptime', dec: 1 },
        { v: 15, prefix: '< ', suffix: ' min', label: 'Avg. response time', dec: 0 },
        { v: 24, suffix: '/7', label: 'Monitoring', dec: 0 },
        { v: 50, suffix: '+', label: 'Happy organizations', dec: 0 },
      ],
      badges: ['ISO 27001', 'Microsoft Partner', 'GDPR Compliant', 'SOC 2', 'NIS2 Ready'],
      note: 'TODO: verify figures and certifications before launch.',
    },
    testimonials: {
      kicker: 'Clients',
      title: 'Organizations that sleep easier.',
      items: [
        { q: 'Since HinIT took over our management, everything runs more smoothly and they think ahead with us. Finally an IT partner that truly listens.', n: 'Sanne de Vries', r: 'COO, growing scale-up' },
        { q: 'The response time is incredible. An issue is fixed before we’ve even finished reporting it. Personal contact, no queue.', n: 'Marco Jansen', r: 'Director, SME' },
        { q: 'From a tangle of separate tools to one clear, secure IT foundation. HinIT brought calm, clarity and control.', n: 'Amir El Haddad', r: 'Head of Operations, non-profit' },
      ],
      note: 'TODO: add real quotes, names and logos.',
    },
    contact: {
      kicker: 'Contact',
      title: 'Ready for IT that moves with you?',
      sub: 'Book a no-obligation call. We’re happy to think along — clear, personal and without the sales pitch.',
      name: 'Name',
      email: 'Email address',
      message: 'What can we help you with?',
      send: 'Get in touch',
      sending: 'Sending…',
      success: 'Thank you! We’ll get back to you within one business day.',
      chips: ['Personal', 'Clear', 'Secure'],
      errors: { name: 'Please enter your name.', email: 'Please enter a valid email address.', message: 'Tell us briefly what we can help with.' },
    },
    footer: {
      tagline: 'Your IT foundation. Secure, stable and smart.',
      nav: ['Home', 'Services', 'About', 'Contact'],
      built: 'Built in Amsterdam',
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
