import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCookie, setCookie, COOKIE_LANG } from './lib/cookies';

/**
 * Lightweight i18n. Copy is Dutch-first (NL default) with an English mirror.
 * Tone: plain and simple — a 12-year-old should get what HinIT does.
 * The chosen language is remembered in a first-party cookie.
 */
export const translations = {
  nl: {
    htmlLang: 'nl',
    locale: 'nl-NL',
    nav: {
      services: 'Wat we doen',
      why: 'Waarom HinIT',
      process: 'Zo werkt het',
      booking: 'Afspraak',
      faq: 'Vragen',
      contact: 'Contact',
      cta: 'Plan een gesprek',
      menu: 'Menu openen',
      close: 'Menu sluiten',
      skip: 'Direct naar de inhoud',
    },
    theme: { toLight: 'Licht thema', toDark: 'Donker thema' },
    hero: {
      badge: 'IT-hulp uit Nederland',
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
      sub: 'Geen lange trajecten of dikke rapporten. Binnen twee weken draait alles zoals het hoort.',
      steps: [
        {
          n: '01',
          t: 'Kennismaken',
          d: 'We kijken samen naar uw computers en systemen en wat beter kan.',
          duration: '30 minuten',
          points: ['Gratis en vrijblijvend', 'Bij u op kantoor of via videobellen', 'U hoeft niets voor te bereiden'],
        },
        {
          n: '02',
          t: 'Plan maken',
          d: 'We vertellen u helder wat we als eerste oppakken en waarom.',
          duration: 'Binnen 3 dagen',
          points: ['Eén overzicht, geen dik rapport', 'Vaste prijs per maand', 'U bepaalt wat er gebeurt'],
        },
        {
          n: '03',
          t: 'Regelen & bewaken',
          d: 'Wij voeren het uit en houden alles in de gaten. U heeft er geen omkijken naar.',
          duration: 'Doorlopend',
          points: ['Overstap zonder stilstand', '24/7 in de gaten gehouden', 'Vast aanspreekpunt'],
        },
      ],
    },
    booking: {
      kicker: 'Afspraak plannen',
      title: 'Kies zelf een moment dat u uitkomt.',
      sub: 'Pak een dag en tijd die u schikt. Het gesprek duurt een half uur, is gratis en u zit nergens aan vast.',
      perks: [
        { t: 'Duurt 30 minuten', d: 'Kort en concreet, geen verkooppraat.' },
        { t: 'Gratis en vrijblijvend', d: 'U beslist daarna zelf of het klikt.' },
        { t: 'Bij u of online', d: 'Op kantoor in de Randstad, of gewoon via videobellen.' },
      ],
      pickDate: 'Kies een dag',
      pickTime: 'Kies een tijd',
      pickTimeHint: 'Kies eerst een dag in de kalender.',
      prevMonth: 'Vorige maand',
      nextMonth: 'Volgende maand',
      today: 'Vandaag',
      unavailable: 'Niet beschikbaar',
      morning: 'Ochtend',
      afternoon: 'Middag',
      confirm: 'Afspraak bevestigen',
      confirming: 'Bezig…',
      nameLabel: 'Uw naam',
      emailLabel: 'Uw e-mail',
      errors: { name: 'Vul uw naam in.', email: 'Vul een geldig e-mailadres in.' },
      successTitle: 'Afspraak staat genoteerd.',
      successBody: 'U ontvangt een bevestiging per e-mail met een link voor het videogesprek.',
      again: 'Andere tijd kiezen',
      weekdays: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],
      weekdaysFull: ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'],
      months: [
        'januari', 'februari', 'maart', 'april', 'mei', 'juni',
        'juli', 'augustus', 'september', 'oktober', 'november', 'december',
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
    },
    testimonials: {
      kicker: 'Klanten',
      title: 'Klanten die rustig slapen.',
      items: [
        { q: 'Sinds HinIT onze IT regelt, werkt gewoon alles. En ze denken met ons mee. Eindelijk een IT-partner die luistert.', n: 'Sanne de Vries', r: 'COO, groeiend bedrijf' },
        { q: 'Zo snel! Een probleem is vaak al opgelost voordat wij het goed en wel doorgeven. En altijd een bekend gezicht.', n: 'Marco Jansen', r: 'Directeur, MKB' },
        { q: 'Van een chaos aan losse tools naar één veilig systeem. HinIT bracht rust en overzicht.', n: 'Amir El Haddad', r: 'Hoofd Operations, non-profit' },
      ],
    },
    faq: {
      kicker: 'Veelgestelde vragen',
      title: 'Nog vragen? Dit horen we vaak.',
      items: [
        {
          q: 'Wij hebben al iemand die onze IT doet. Wat dan?',
          a: 'Prima. We werken vaak samen met een vaste ICT-er of leverancier. Wij nemen dan de dingen over die blijven liggen, zoals beveiliging en het in de gaten houden van systemen.',
        },
        {
          q: 'Hoe snel zijn jullie er als er iets kapot is?',
          a: 'We reageren binnen 15 minuten op een melding. Het meeste lossen we meteen op afstand op. Is het echt nodig, dan komen we langs.',
        },
        {
          q: 'Wat kost het?',
          a: 'Een vast bedrag per maand per medewerker, zodat u nooit voor verrassingen staat. Wat het precies wordt, hangt af van uw situatie. Dat rekenen we in het kennismakingsgesprek gewoon samen uit.',
        },
        {
          q: 'Zitten we ergens aan vast?',
          a: 'Nee. We werken met een opzegtermijn van één maand. We willen dat u blijft omdat het goed gaat, niet omdat het moet.',
        },
        {
          q: 'Wij zijn maar klein. Zijn we niet te klein voor jullie?',
          a: 'Zeker niet. We werken met bedrijven vanaf ongeveer vijf medewerkers. Juist daar valt vaak het meest te winnen.',
        },
        {
          q: 'Hoe zit het met onze gegevens?',
          a: 'Alles blijft binnen Europa en we werken volgens de AVG. U krijgt van ons zwart op wit welke gegevens we zien en wat we ermee doen.',
        },
      ],
    },
    contact: {
      kicker: 'Contact',
      title: 'Klaar voor IT zonder zorgen?',
      sub: 'Stuur een bericht of plan meteen een gesprek in. We denken graag met u mee — in gewone taal en zonder verkooppraat.',
      name: 'Uw naam',
      email: 'Uw e-mail',
      message: 'Waar kunnen we mee helpen?',
      send: 'Verstuur',
      sending: 'Versturen…',
      success: 'Bedankt! We nemen binnen één werkdag contact met u op.',
      successAgain: 'Nog een bericht sturen',
      chips: ['Persoonlijk', 'Duidelijk', 'Veilig'],
      orBook: 'Liever meteen een moment kiezen?',
      orBookLink: 'Plan een afspraak',
      hours: 'Ma t/m vr, 08:00 – 18:00',
      errors: { name: 'Vul uw naam in.', email: 'Vul een geldig e-mailadres in.', message: 'Vertel kort waar we mee kunnen helpen.' },
    },
    footer: {
      tagline: 'Uw IT, veilig en zonder zorgen geregeld.',
      navTitle: 'Navigatie',
      contactTitle: 'Contact',
      nav: ['Home', 'Wat we doen', 'Waarom HinIT', 'Afspraak', 'Contact'],
      built: 'Gemaakt in Amsterdam',
      rights: 'Alle rechten voorbehouden.',
      backToTop: 'Terug naar boven',
    },
  },

  en: {
    htmlLang: 'en',
    locale: 'en-GB',
    nav: {
      services: 'What we do',
      why: 'Why HinIT',
      process: 'How it works',
      booking: 'Book',
      faq: 'FAQ',
      contact: 'Contact',
      cta: 'Book a call',
      menu: 'Open menu',
      close: 'Close menu',
      skip: 'Skip to content',
    },
    theme: { toLight: 'Light theme', toDark: 'Dark theme' },
    hero: {
      badge: 'IT help from the Netherlands',
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
      sub: 'No drawn-out projects or thick reports. Within two weeks everything runs the way it should.',
      steps: [
        {
          n: '01',
          t: 'Get to know you',
          d: 'Together we look at your computers and systems and what can be better.',
          duration: '30 minutes',
          points: ['Free, no strings attached', 'At your office or over video', 'Nothing to prepare'],
        },
        {
          n: '02',
          t: 'Make a plan',
          d: 'We tell you clearly what we tackle first and why.',
          duration: 'Within 3 days',
          points: ['One overview, not a thick report', 'Fixed monthly price', 'You decide what happens'],
        },
        {
          n: '03',
          t: 'Run & watch it',
          d: 'We carry it out and keep an eye on everything. You never have to worry.',
          duration: 'Ongoing',
          points: ['Switch over without downtime', 'Watched 24/7', 'One familiar contact'],
        },
      ],
    },
    booking: {
      kicker: 'Book a call',
      title: 'Pick a moment that suits you.',
      sub: 'Grab a day and time that works. The call takes half an hour, is free, and commits you to nothing.',
      perks: [
        { t: 'Takes 30 minutes', d: 'Short and concrete, no sales pitch.' },
        { t: 'Free, no strings', d: 'Afterwards you decide whether it clicks.' },
        { t: 'At your place or online', d: 'At your office in the Randstad, or simply over video.' },
      ],
      pickDate: 'Pick a day',
      pickTime: 'Pick a time',
      pickTimeHint: 'Choose a day in the calendar first.',
      prevMonth: 'Previous month',
      nextMonth: 'Next month',
      today: 'Today',
      unavailable: 'Unavailable',
      morning: 'Morning',
      afternoon: 'Afternoon',
      confirm: 'Confirm appointment',
      confirming: 'Working…',
      nameLabel: 'Your name',
      emailLabel: 'Your email',
      errors: { name: 'Please enter your name.', email: 'Please enter a valid email address.' },
      successTitle: 'Your appointment is booked.',
      successBody: 'You will get a confirmation by email with a link for the video call.',
      again: 'Pick another time',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weekdaysFull: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
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
    },
    testimonials: {
      kicker: 'Clients',
      title: 'Clients who sleep easy.',
      items: [
        { q: 'Since HinIT runs our IT, everything just works. And they think along with us. Finally an IT partner that listens.', n: 'Sanne de Vries', r: 'COO, growing company' },
        { q: 'So fast! A problem is often fixed before we even finish reporting it. And always a familiar face.', n: 'Marco Jansen', r: 'Director, SME' },
        { q: 'From a mess of separate tools to one safe system. HinIT brought calm and clarity.', n: 'Amir El Haddad', r: 'Head of Operations, non-profit' },
      ],
    },
    faq: {
      kicker: 'Frequently asked',
      title: 'Questions? These come up a lot.',
      items: [
        {
          q: 'We already have someone doing our IT. What then?',
          a: 'That is fine. We often work alongside an in-house IT person or existing supplier. We pick up what tends to be left behind, such as security and keeping an eye on systems.',
        },
        {
          q: 'How fast are you there when something breaks?',
          a: 'We respond to a report within 15 minutes. Most things we fix remotely straight away. If it really needs hands on site, we come over.',
        },
        {
          q: 'What does it cost?',
          a: 'A fixed amount per month per employee, so you never get a surprise bill. What that comes to depends on your situation — we simply work it out together during the intro call.',
        },
        {
          q: 'Are we tied into anything?',
          a: 'No. We work with a one-month notice period. We want you to stay because things are going well, not because you have to.',
        },
        {
          q: 'We are quite small. Are we too small for you?',
          a: 'Not at all. We work with companies from around five employees up. That is often where the most can be gained.',
        },
        {
          q: 'What about our data?',
          a: 'Everything stays within Europe and we work according to the GDPR. You get it in writing which data we can see and what we do with it.',
        },
      ],
    },
    contact: {
      kicker: 'Contact',
      title: 'Ready for IT without the worries?',
      sub: 'Send a message or book a call straight away. We’re happy to think along — in plain language and with no sales pitch.',
      name: 'Your name',
      email: 'Your email',
      message: 'What can we help you with?',
      send: 'Send',
      sending: 'Sending…',
      success: 'Thank you! We’ll get back to you within one business day.',
      successAgain: 'Send another message',
      chips: ['Personal', 'Clear', 'Secure'],
      orBook: 'Rather pick a moment right away?',
      orBookLink: 'Book an appointment',
      hours: 'Mon–Fri, 08:00 – 18:00',
      errors: { name: 'Please enter your name.', email: 'Please enter a valid email address.', message: 'Tell us briefly what we can help with.' },
    },
    footer: {
      tagline: 'Your IT, secure and worry-free.',
      navTitle: 'Navigation',
      contactTitle: 'Contact',
      nav: ['Home', 'What we do', 'Why HinIT', 'Book', 'Contact'],
      built: 'Made in Amsterdam',
      rights: 'All rights reserved.',
      backToTop: 'Back to top',
    },
  },
};

const I18nContext = createContext(null);

const isLang = (v) => v === 'nl' || v === 'en';

function initialLang() {
  const saved = getCookie(COOKIE_LANG);
  if (isLang(saved)) return saved;
  // Dutch-first business: only switch to English if the browser clearly is.
  if (typeof navigator !== 'undefined') {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const l of langs) {
      if (!l) continue;
      const code = l.toLowerCase().slice(0, 2);
      if (code === 'nl') return 'nl';
      if (code === 'en') return 'en';
    }
  }
  return 'nl';
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  const setLang = useCallback((next) => {
    if (!isLang(next)) return;
    setCookie(COOKIE_LANG, next);
    setLangState(next);
  }, []);

  const toggle = useCallback(() => setLang(lang === 'nl' ? 'en' : 'nl'), [lang, setLang]);

  // keep the document language in sync for screen readers and search engines
  useEffect(() => {
    document.documentElement.setAttribute('lang', translations[lang].htmlLang);
  }, [lang]);

  const t = translations[lang];
  return <I18nContext.Provider value={{ lang, setLang, toggle, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
