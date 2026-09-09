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
    ogLocale: 'nl_NL',
    /* <title> and the description/OG tags. They have to live here too: the
       copy on the page switches language, so the tab title and anything a
       visitor shares must switch with it. index.html ships the Dutch pair as
       the pre-JS default. */
    meta: {
      title: 'HinIT — IT die gewoon werkt · Beheer, beveiliging & support',
      description:
        'HinIT regelt de computers, het internet en de beveiliging van uw bedrijf. Vast team, reactie binnen 15 minuten, vaste prijs per maand. Plan een gratis kennismaking.',
    },
    /* ------------------------------------------------------------------
       Legal pages. Written against what this site actually does: two
       functional cookies, no analytics, no third-party requests (the fonts
       are self-hosted), and forms that either POST to VITE_FORM_ENDPOINT or
       hand the message to the visitor's own mail client. Keep them in step
       with the code — a privacy statement that describes something the site
       does not do is worse than none.
       ------------------------------------------------------------------ */
    legal: {
      updatedLabel: 'Laatst bijgewerkt',
      updated: '2026-09-09',
      backHome: 'Terug naar de homepage',
      toc: 'Op deze pagina',
      privacy: {
        nav: 'Privacyverklaring',
        title: 'Privacyverklaring',
        lead: 'Deze verklaring legt uit welke persoonsgegevens HinIT verwerkt als u deze website bezoekt of contact met ons opneemt, waarom we dat doen en wat uw rechten zijn.',
        meta: 'Welke gegevens HinIT verwerkt, waarom, hoe lang we ze bewaren en welke rechten u heeft.',
        sections: [
          {
            h: 'Wie is verantwoordelijk',
            body: [
              'HinIT is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven op deze pagina. U bereikt ons op info@hinit.nl of +31 6 84018864. Ons werkgebied is Nederland; we zitten in Amsterdam.',
            ],
          },
          {
            h: 'Welke gegevens we verwerken',
            body: ['Deze site verzamelt niets op de achtergrond. Er zijn precies drie momenten waarop er gegevens langskomen:'],
            list: [
              'Contactformulier — uw naam, e-mailadres en het bericht dat u typt.',
              'Afspraak plannen — uw naam, e-mailadres en de dag en tijd die u kiest.',
              'Technische logs — onze hostingpartij legt standaard vast welk IP-adres welke pagina opvraagt en wanneer. Dat hoort bij het uitleveren van een website en gebeurt bij elke site die u bezoekt.',
            ],
            after: [
              'Er staan geen analytics, advertentie- of trackingscripts op deze site, en er wordt geen profiel van u opgebouwd. De lettertypen worden vanaf onze eigen server geladen, dus ook daarvoor gaat er niets naar een derde partij.',
            ],
          },
          {
            h: 'Waarom, en op welke grondslag',
            list: [
              'Om uw vraag te beantwoorden of een afspraak in te plannen — noodzakelijk voor (de aanloop naar) een overeenkomst, artikel 6 lid 1 sub b AVG.',
              'Om de site te leveren en misbruik tegen te gaan — ons gerechtvaardigd belang, artikel 6 lid 1 sub f AVG.',
              'Om te onthouden hoe u de site wilt zien — functionele cookies, zie de cookieverklaring.',
            ],
          },
          {
            h: 'Hoe lang we het bewaren',
            list: [
              'Berichten via het contactformulier: zolang nodig om uw vraag af te handelen, en daarna maximaal twaalf maanden.',
              'Afspraakgegevens: zolang we samenwerken. Facturen bewaren we zeven jaar, omdat de Belastingdienst dat voorschrijft.',
              'Technische logs: kort, doorgaans enkele weken bij onze hostingpartij.',
            ],
          },
          {
            h: 'Met wie we het delen',
            body: [
              'Alleen met partijen die het nodig hebben om ons werk mogelijk te maken: onze hosting- en e-mailprovider. Die handelen uitsluitend in onze opdracht en mogen uw gegevens nergens anders voor gebruiken. We verkopen niets door en geven niets aan advertentienetwerken.',
              'Uw gegevens worden binnen de Europese Economische Ruimte verwerkt.',
            ],
          },
          {
            h: 'Hoe we het beveiligen',
            body: [
              'Verkeer met deze site loopt over een versleutelde verbinding (https). Toegang tot e-mail en systemen bij ons is beveiligd met tweestapsverificatie, en alleen mensen die het voor hun werk nodig hebben kunnen erbij.',
            ],
          },
          {
            h: 'Uw rechten',
            body: ['U heeft het recht om:'],
            list: [
              'in te zien welke gegevens we van u hebben;',
              'die te laten corrigeren of verwijderen;',
              'de verwerking te laten beperken of er bezwaar tegen te maken;',
              'uw gegevens in een gangbaar bestandsformaat mee te krijgen.',
            ],
            after: [
              'Mail info@hinit.nl en we reageren binnen een maand. Bent u het niet eens met hoe we ermee omgaan, dan kunt u een klacht indienen bij de Autoriteit Persoonsgegevens.',
            ],
          },
          {
            h: 'Wijzigingen',
            body: [
              'Verandert er iets aan deze site of aan hoe we met gegevens omgaan, dan passen we deze verklaring aan. Bovenaan staat wanneer dat voor het laatst gebeurd is.',
            ],
          },
        ],
      },
      cookies: {
        nav: 'Cookieverklaring',
        title: 'Cookieverklaring',
        lead: 'Deze site plaatst twee cookies, allebei om te onthouden hoe u de site wilt zien. Geen analytics, geen advertenties, geen cookies van derden.',
        meta: 'Welke cookies HinIT plaatst, waarvoor ze dienen en hoe u ze weigert of verwijdert.',
        sections: [
          {
            h: 'Wat is een cookie?',
            body: [
              'Een cookie is een klein tekstbestand dat een website op uw computer of telefoon achterlaat. Bij de volgende keer leest de site dat bestand terug. Vaak worden cookies gebruikt om bezoekers te volgen; wij gebruiken ze alleen om te onthouden wat u zelf hebt ingesteld.',
            ],
          },
          {
            h: 'Welke cookies plaatsen wij',
            table: {
              head: ['Naam', 'Waarvoor', 'Bewaartermijn', 'Soort'],
              rows: [
                ['hinit_theme', 'Onthoudt of u de site licht of donker wilt zien.', '1 jaar', 'Functioneel'],
                ['hinit_lang', 'Onthoudt of u de site in het Nederlands of Engels leest.', '1 jaar', 'Functioneel'],
              ],
            },
            after: [
              'Allebei zijn het first-party cookies: ze worden door hinit.nl zelf geplaatst, bevatten alleen het woord dat u koos (light of dark, nl of en) en worden nooit meegestuurd naar een andere website.',
            ],
          },
          {
            h: 'Waarom we niet om toestemming vragen',
            body: [
              'Voor cookies die puur functioneel zijn — die alleen doen wat u zelf hebt gevraagd — is geen toestemming nodig. Dat staat in artikel 11.7a van de Telecommunicatiewet. Deze twee slaan geen persoonsgegevens op, bouwen geen profiel op en delen niets. Daarom ziet u hier geen cookiebanner.',
              'Zouden we later wél iets toevoegen dat u volgt, zoals statistieken of advertentiepixels, dan vragen we vooraf om uw toestemming en passen we deze pagina aan.',
            ],
          },
          {
            h: 'Cookies van derden',
            body: [
              'Die staan er niet. Er zit geen analytics op, geen advertentienetwerk, geen ingesloten video, kaart of socialmediaknop. Ook de lettertypen komen van onze eigen server, zodat uw browser tijdens het bezoek met niemand anders praat dan met ons.',
            ],
          },
          {
            h: 'Cookies weigeren of verwijderen',
            body: [
              'In elke browser kunt u cookies bekijken, blokkeren of wissen — meestal onder Instellingen, bij Privacy. De site blijft gewoon werken zonder deze twee: hij volgt dan het licht- of donkerthema van uw apparaat en de taal van uw browser, en onthoudt uw keuze alleen niet tot het volgende bezoek.',
            ],
          },
          {
            h: 'Vragen',
            body: ['Iets onduidelijk? Mail info@hinit.nl, dan leggen we het uit.'],
          },
        ],
      },
    },
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
      mainMenu: 'Hoofdmenu',
      toTop: 'HinIT — naar boven',
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
        {
          slug: 'it-beheer',
          t: 'IT-beheer',
          d: 'Wij houden al uw computers en systemen in de gaten en up-to-date.',
          detail: {
            tagline: 'Wij houden uw computers en systemen draaiend — voordat er iets misgaat.',
            intro:
              'Uw computers, servers en programma’s hebben onderhoud nodig. Updates, back-ups, opslag die volloopt. Wij houden dat allemaal in de gaten en pakken het op voordat u er last van heeft.',
            includes: [
              { t: 'Altijd in de gaten', d: 'Onze bewaking kijkt 24/7 mee. Loopt een schijf vol of hapert een server, dan zien wij dat als eerste.' },
              { t: 'Updates en patches', d: 'Windows, macOS en uw programma’s blijven bij. We plannen dat buiten werktijd, zodat niemand stilstaat.' },
              { t: 'Back-ups die werken', d: 'Elke dag een back-up én elke maand een echte hersteltest. Een back-up die u nooit terugzet is geen back-up.' },
              { t: 'Eén overzicht', d: 'U ziet in één rapport wat er draait, wat er is opgelost en wat eraan komt.' },
            ],
            outcomes: [
              'Minder storingen, en korter als er toch iets is',
              'Geen verrassingen door volle schijven of mislukte updates',
              'Altijd terug kunnen naar de situatie van gisteren',
              'Vaste prijs per maand, geen uurtje-factuurtje',
            ],
            faq: [
              { q: 'Draait dit op onze eigen servers of in de cloud?', a: 'Allebei kan. We werken met Microsoft 365 en Azure, met servers bij u op kantoor, of met een mix daarvan.' },
              { q: 'Merken wij iets van het onderhoud?', a: 'Zo min mogelijk. Updates plannen we ’s avonds of in het weekend. Moet er echt iets onder werktijd gebeuren, dan stemmen we dat vooraf met u af.' },
            ],
            meta: 'Onderhoud, updates, bewaking en back-ups van uw IT. Vaste prijs per maand, 24/7 in de gaten gehouden.',
          },
        },
        {
          slug: 'beveiliging',
          t: 'Beveiliging',
          d: 'Wij beschermen u tegen hackers, virussen en nep-mails.',
          detail: {
            tagline: 'Bescherming tegen hackers, virussen en nep-mails — zonder dat werken lastiger wordt.',
            intro:
              'De meeste inbraken beginnen met één verkeerde klik in een e-mail. Wij zetten de sloten goed, houden verdacht verkeer tegen en zorgen dat uw mensen weten waar ze op moeten letten.',
            includes: [
              { t: 'Nep-mails eruit filteren', d: 'Phishing en gevaarlijke bijlagen houden we tegen voordat ze in de inbox landen.' },
              { t: 'Tweestapsverificatie', d: 'Een gestolen wachtwoord alleen is dan niet genoeg om binnen te komen. We rollen het uit zonder dat inloggen omslachtig wordt.' },
              { t: 'Bescherming op elk apparaat', d: 'Laptops, telefoons en servers krijgen bewaking die ongewoon gedrag herkent en meteen ingrijpt.' },
              { t: 'Uw team scherp houden', d: 'Korte, praktische uitleg en af en toe een oefen-phishingmail. Geen schoolbank, wel effect.' },
            ],
            outcomes: [
              'Veel kleinere kans op gijzelsoftware en factuurfraude',
              'Duidelijk wie bij welke gegevens kan',
              'Aantoonbaar op orde voor uw verzekeraar of opdrachtgever',
              'Een draaiboek dat klaarligt voor als het tóch misgaat',
            ],
            faq: [
              { q: 'Wordt inloggen dan omslachtig?', a: 'Nee. Op vertrouwde apparaten en op kantoor merkt u er meestal niets van. De extra stap komt alleen als er iets afwijkt.' },
              { q: 'Wat doen jullie als we tóch gehackt worden?', a: 'Dan schakelen we direct: apparaten van het netwerk, vaststellen wat er is geraakt en terugzetten vanaf back-up. Dat draaiboek ligt vooraf klaar, niet pas op het moment zelf.' },
            ],
            meta: 'Bescherming tegen phishing, gijzelsoftware en datalekken. Tweestapsverificatie, apparaatbewaking en een draaiboek voor incidenten.',
          },
        },
        {
          slug: 'netwerk',
          t: 'Netwerk & apparatuur',
          d: 'Snel, stabiel internet en apparaten die het gewoon doen.',
          detail: {
            tagline: 'Internet en wifi die het altijd doen, en apparatuur die niet in de weg zit.',
            intro:
              'Haperend wifi in de vergaderruimte of een internetlijn die eruit ligt kost meteen een halve werkdag. Wij leggen het netwerk goed aan, meten na of het klopt en houden het daarna in de gaten.',
            includes: [
              { t: 'Wifi dat overal werkt', d: 'We meten uw pand door en hangen de punten waar ze nodig zijn — ook in die ene hoek waar het nooit deed.' },
              { t: 'Een verbinding die doorloopt', d: 'Een tweede internetlijn die het automatisch overneemt als de eerste wegvalt.' },
              { t: 'Gasten apart', d: 'Bezoekers op een eigen netwerk, los van uw eigen computers en bestanden.' },
              { t: 'Hardware zonder gedoe', d: 'Wij kiezen, bestellen en installeren, en houden bij wat waar staat en wanneer het aan vervanging toe is.' },
            ],
            outcomes: [
              'Geen klachten meer over traag of wegvallend wifi',
              'Doorwerken als de internetlijn eruit ligt',
              'Bezoekers online zonder risico voor uw gegevens',
              'Vervangingen gepland in plaats van als verrassing',
            ],
            faq: [
              { q: 'Moeten we alles vervangen?', a: 'Meestal niet. We kijken eerst wat er staat. Vaak lost een betere indeling of één extra accesspoint het probleem al op.' },
              { q: 'Regelen jullie ook het contract met de provider?', a: 'Ja. We vergelijken, zetten de aanvraag uit en begeleiden de oplevering. U heeft één aanspreekpunt, ook als de storing bij de provider zit.' },
            ],
            meta: 'Wifi, bekabeling, internetverbindingen en hardware. Aangelegd, doorgemeten en bewaakt.',
          },
        },
        {
          slug: 'support',
          t: 'Hulp bij problemen',
          d: 'Loopt iets vast? Eén belletje en wij helpen u meteen.',
          detail: {
            tagline: 'Loopt iets vast? Binnen 15 minuten heeft u een echt mens aan de lijn.',
            intro:
              'Een printer die niet wil, een bestand dat weg is, een laptop die niet opstart. Klein of groot: u belt of mailt en wij pakken het op. Geen keuzemenu, geen ticket dat blijft liggen.',
            includes: [
              { t: 'Reactie binnen 15 minuten', d: 'Tijdens kantooruren pakt iemand uw melding binnen een kwartier op.' },
              { t: 'Meestal meteen opgelost', d: 'Het grootste deel lossen we op afstand op terwijl u aan de lijn bent.' },
              { t: 'Langskomen als het nodig is', d: 'Kan het niet op afstand? Dan komen we langs — in de Randstad meestal dezelfde dag.' },
              { t: 'Bekende gezichten', d: 'U krijgt steeds dezelfde mensen. Die kennen uw situatie, dus u hoeft uw verhaal niet elke keer opnieuw te doen.' },
            ],
            outcomes: [
              'Minder stilstand als er iets kapot is',
              'Geen frustratie over wachten op antwoord',
              'Uw mensen kunnen doorwerken',
              'Terugkerende problemen worden echt opgelost, niet telkens opnieuw geplakt',
            ],
            faq: [
              { q: 'Mag iedereen bellen, of alleen één contactpersoon?', a: 'Iedereen mag bellen. Dat scheelt tijd en voorkomt dat een probleem blijft liggen omdat de contactpersoon net vrij is.' },
              { q: 'Zijn jullie ook buiten kantooruren bereikbaar?', a: 'Onze bewaking draait 24/7 en grijpt ’s nachts ook in. Voor telefonische hulp buiten kantooruren maken we aparte afspraken.' },
            ],
            meta: 'Helpdesk met reactie binnen 15 minuten. Hulp op afstand of op locatie, altijd door hetzelfde team.',
          },
        },
        {
          slug: 'automatisering',
          t: 'Slimmer werken',
          d: 'Wij nemen saai, herhalend werk uit handen met slimme tools.',
          detail: {
            tagline: 'Saai, herhalend werk laten we de computer doen.',
            intro:
              'Elke week dezelfde lijstjes overtypen, mappen aanmaken of facturen doorsturen? Dat kan automatisch. We beginnen klein, bij het werk waar uw team de meeste tijd aan kwijt is.',
            includes: [
              { t: 'Eerst kijken waar de tijd blijft', d: 'We lopen een paar dagdelen mee en zoeken het handwerk dat het vaakst terugkomt.' },
              { t: 'Automatisch laten lopen', d: 'Met de tools die u al heeft — Microsoft 365, Power Automate, SharePoint — laten we stappen vanzelf gebeuren.' },
              { t: 'Systemen aan elkaar knopen', d: 'Uw boekhouding, agenda en klantsysteem wisselen gegevens uit, zodat u niets dubbel invoert.' },
              { t: 'Uitleg en overdracht', d: 'U krijgt kort op papier wat er draait en waarom, zodat het geen zwarte doos wordt.' },
            ],
            outcomes: [
              'Uren per week terug voor uw team',
              'Minder overtypfouten',
              'Werk dat doorloopt als iemand ziek of op vakantie is',
              'Beter zicht op wat er precies gebeurt',
            ],
            faq: [
              { q: 'Moeten we hiervoor nieuwe software kopen?', a: 'Meestal niet. In Microsoft 365 zit al veel dat bedrijven niet gebruiken. We kijken eerst wat u al in huis heeft.' },
              { q: 'Wat als het proces later verandert?', a: 'Dan passen we het aan. We bouwen bewust in kleine stukjes, zodat een wijziging geen verbouwing wordt.' },
            ],
            meta: 'Herhalend werk automatiseren met Microsoft 365 en Power Automate. Uren per week terug en minder fouten.',
          },
        },
        {
          slug: 'werkplekken',
          t: 'Werkplekken',
          d: 'Veilige laptops en accounts voor uw hele team, waar ze ook werken.',
          detail: {
            tagline: 'Een nieuwe collega is binnen een dag startklaar — waar diegene ook werkt.',
            intro:
              'Laptops, accounts, telefoons en de juiste rechten. Wij richten het één keer goed in, zodat iemand aanmelden of afmelden een kwestie van minuten is in plaats van dagen.',
            includes: [
              { t: 'Laptop klaar op dag één', d: 'De laptop komt voorgeïnstalleerd aan bij de nieuwe collega. Inloggen en werken.' },
              { t: 'Eén account voor alles', d: 'Eén keer inloggen voor e-mail, bestanden en uw andere programma’s. Minder wachtwoorden, minder gedoe.' },
              { t: 'Rechten die kloppen', d: 'Mensen zien wat ze nodig hebben en niet meer dan dat. Bij vertrek gaat alles in één handeling dicht.' },
              { t: 'Thuis net zo veilig', d: 'Op kantoor, thuis of onderweg werkt alles hetzelfde en even veilig.' },
            ],
            outcomes: [
              'Nieuwe mensen meteen productief',
              'Geen vergeten accounts van oud-medewerkers',
              'Minder wachtwoordgedoe en minder vragen',
              'Overal dezelfde werkplek, dus makkelijker te helpen',
            ],
            faq: [
              { q: 'Mogen mensen hun eigen laptop gebruiken?', a: 'Dat kan, met een aparte, afgeschermde werkomgeving. Zakelijke gegevens blijven dan gescheiden van hun privéspullen.' },
              { q: 'Hoe snel staat een nieuwe medewerker klaar?', a: 'Geeft u het een paar dagen vooraf door, dan is alles klaar op de eerste werkdag. Account en rechten zijn een kwestie van minuten.' },
            ],
            meta: 'Laptops, accounts en rechten voor uw hele team. Nieuwe collega’s binnen een dag startklaar, thuis net zo veilig als op kantoor.',
          },
        },
      ],
    },
    servicePage: {
      breadcrumb: 'Kruimelpad',
      back: 'Alle diensten',
      home: 'Home',
      includes: 'Wat u krijgt',
      outcomes: 'Wat het u oplevert',
      faq: 'Vragen over deze dienst',
      ctaTitle: 'Benieuwd wat dit voor uw bedrijf betekent?',
      ctaBody:
        'Plan een gratis gesprek van 30 minuten. We kijken samen naar uw situatie en u hoort meteen wat er mogelijk is.',
      ctaPrimary: 'Plan een gratis gesprek',
      ctaSecondary: 'Stuur een bericht',
      other: 'Andere diensten',
      notFoundTitle: 'Deze pagina bestaat niet.',
      notFoundBody: 'We konden deze dienst niet vinden. Bekijk hieronder wat we wél doen.',
      notFoundCta: 'Terug naar de homepage',
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
      videoNote: 'Online? U krijgt een link voor het videogesprek. Installeren hoeft niet.',
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
      formHint: 'Kies hierboven eerst een dag en een tijd.',
      nameLabel: 'Uw naam',
      emailLabel: 'Uw e-mail',
      errors: { name: 'Vul uw naam in.', email: 'Vul een geldig e-mailadres in.' },
      successTitle: 'Aanvraag verstuurd.',
      successBody: 'We bevestigen uw afspraak per e-mail, meestal binnen één werkdag, met een link voor het videogesprek.',
      mailTitle: 'Uw e-mailprogramma is geopend.',
      mailBody:
        'De aanvraag staat klaar in een concept-e-mail. Verstuur die om de afspraak vast te leggen. Werkt dat niet? Mail ons dan rechtstreeks op info@hinit.nl.',
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
        // not a quantity: counting it up flashes "22/7", which reads as broken
        { v: 24, suffix: '/7', label: 'We letten op', dec: 0, static: true },
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
          a: 'Prima. We werken vaak naast een vaste ICT-er of uw huidige leverancier. Wij pakken dan op wat blijft liggen — meestal beveiliging, back-ups en het bewaken van systemen. Wie wat doet zetten we vooraf op één A4, zodat niemand langs elkaar heen werkt.',
        },
        {
          q: 'Hoe snel zijn jullie er als er iets kapot is?',
          a: 'Tijdens kantooruren pakken we uw melding binnen 15 minuten op. Het meeste lossen we meteen op afstand op. Moet er iemand langskomen, dan staan we in de Randstad meestal dezelfde dag bij u.',
        },
        {
          q: 'Hoe verloopt de overstap van onze huidige IT-partij?',
          a: 'In twee tot vier weken, zonder dat u stilstaat. We brengen eerst alles in kaart, zetten onze bewaking ernaast, en pas als dat draait nemen we het beheer over. Uw huidige leverancier hoeft daar niet aan mee te werken.',
        },
        {
          q: 'Zitten we ergens aan vast?',
          a: 'Nee. Na de eerste maand geldt een opzegtermijn van één maand. Uw gegevens en instellingen blijven van u: stopt u, dan draagt u ze compleet over.',
        },
        {
          q: 'Wij zijn maar klein. Zijn we niet te klein voor jullie?',
          a: 'Zeker niet. We werken met bedrijven vanaf ongeveer vijf medewerkers. Juist daar valt vaak het meest te winnen, omdat IT er meestal nog bij iemand "erbij" wordt gedaan.',
        },
        {
          q: 'Waar staan onze gegevens en wie kan erbij?',
          a: 'Binnen de EU, bij Microsoft in Nederland of Ierland. Onze beheerders loggen alleen in met tweestapsverificatie en elke handeling wordt vastgelegd. U krijgt zwart op wit welke gegevens we kunnen zien en waarom.',
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
      mailTitle: 'Uw e-mailprogramma is geopend.',
      mailBody:
        'Uw bericht staat klaar in een concept-e-mail. Verstuur die om het naar ons te sturen. Werkt dat niet? Mail ons dan rechtstreeks op info@hinit.nl.',
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
      legalTitle: 'Juridisch',
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
    ogLocale: 'en_GB',
    meta: {
      title: 'HinIT — IT that just works · Management, security & support',
      description:
        'HinIT keeps your company’s computers, internet and security running. One fixed team, a reply within 15 minutes, a fixed monthly price. Book a free intro call.',
    },
    legal: {
      updatedLabel: 'Last updated',
      updated: '2026-09-09',
      backHome: 'Back to the homepage',
      toc: 'On this page',
      privacy: {
        nav: 'Privacy statement',
        title: 'Privacy statement',
        lead: 'This statement explains what personal data HinIT processes when you visit this website or get in touch, why we do it, and what your rights are.',
        meta: 'What data HinIT processes, why, how long we keep it and what rights you have.',
        sections: [
          {
            h: 'Who is responsible',
            body: [
              'HinIT is the controller for the processing described on this page. You can reach us at info@hinit.nl or +31 6 84018864. We work across the Netherlands and are based in Amsterdam.',
            ],
          },
          {
            h: 'What we process',
            body: ['This site collects nothing in the background. There are exactly three moments where data comes past:'],
            list: [
              'Contact form — your name, email address and the message you type.',
              'Booking a call — your name, email address and the day and time you pick.',
              'Technical logs — our hosting provider records which IP address requested which page and when. That is part of serving a website and happens on every site you visit.',
            ],
            after: [
              'There are no analytics, advertising or tracking scripts on this site, and no profile is built about you. The fonts are served from our own server, so nothing goes to a third party for those either.',
            ],
          },
          {
            h: 'Why, and on what legal basis',
            list: [
              'To answer your question or schedule a call — necessary for a contract or the steps leading up to one, Article 6(1)(b) GDPR.',
              'To deliver the site and prevent abuse — our legitimate interest, Article 6(1)(f) GDPR.',
              'To remember how you want the site to look — functional cookies, see the cookie statement.',
            ],
          },
          {
            h: 'How long we keep it',
            list: [
              'Contact form messages: as long as needed to handle your question, and at most twelve months after that.',
              'Booking details: for as long as we work together. Invoices are kept for seven years, because Dutch tax law requires it.',
              'Technical logs: briefly, typically a few weeks at our hosting provider.',
            ],
          },
          {
            h: 'Who we share it with',
            body: [
              'Only parties we need to do the work: our hosting and email providers. They act solely on our instructions and may not use your data for anything else. We do not sell anything on and we hand nothing to advertising networks.',
              'Your data is processed within the European Economic Area.',
            ],
          },
          {
            h: 'How we secure it',
            body: [
              'Traffic to this site runs over an encrypted connection (https). Access to our email and systems is protected with two-step verification, and only people who need it for their work can reach it.',
            ],
          },
          {
            h: 'Your rights',
            body: ['You have the right to:'],
            list: [
              'see what data we hold about you;',
              'have it corrected or deleted;',
              'have the processing restricted, or object to it;',
              'receive your data in a common file format.',
            ],
            after: [
              'Email info@hinit.nl and we will respond within a month. If you disagree with how we handle it, you can complain to the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).',
            ],
          },
          {
            h: 'Changes',
            body: [
              'If something changes about this site or about how we handle data, we update this statement. The date at the top says when that last happened.',
            ],
          },
        ],
      },
      cookies: {
        nav: 'Cookie statement',
        title: 'Cookie statement',
        lead: 'This site sets two cookies, both to remember how you want the site to look. No analytics, no advertising, no third-party cookies.',
        meta: 'Which cookies HinIT sets, what they are for, and how to refuse or delete them.',
        sections: [
          {
            h: 'What is a cookie?',
            body: [
              'A cookie is a small text file a website leaves on your computer or phone. Next time, the site reads it back. Cookies are often used to follow visitors around; we use them only to remember what you set yourself.',
            ],
          },
          {
            h: 'Which cookies we set',
            table: {
              head: ['Name', 'What for', 'Retention', 'Type'],
              rows: [
                ['hinit_theme', 'Remembers whether you want the site light or dark.', '1 year', 'Functional'],
                ['hinit_lang', 'Remembers whether you read the site in Dutch or English.', '1 year', 'Functional'],
              ],
            },
            after: [
              'Both are first-party cookies: they are set by hinit.nl itself, contain only the word you picked (light or dark, nl or en), and are never sent to another website.',
            ],
          },
          {
            h: 'Why we do not ask for consent',
            body: [
              'Cookies that are purely functional — that only do what you asked for yourself — do not require consent. That is set out in Article 11.7a of the Dutch Telecommunications Act. These two store no personal data, build no profile and share nothing. That is why there is no cookie banner here.',
              'If we ever add something that does follow you, such as statistics or advertising pixels, we will ask for your consent first and update this page.',
            ],
          },
          {
            h: 'Third-party cookies',
            body: [
              'There are none. No analytics, no ad network, no embedded video, map or social button. The fonts come from our own server too, so during your visit your browser talks to nobody but us.',
            ],
          },
          {
            h: 'Refusing or deleting cookies',
            body: [
              'Every browser lets you view, block or clear cookies — usually under Settings, in Privacy. The site keeps working without these two: it will follow your device\u2019s light or dark theme and your browser\u2019s language, it just will not remember your choice until the next visit.',
            ],
          },
          {
            h: 'Questions',
            body: ['Anything unclear? Email info@hinit.nl and we will explain.'],
          },
        ],
      },
    },
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
      mainMenu: 'Main menu',
      toTop: 'HinIT — back to top',
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
        {
          slug: 'it-beheer',
          t: 'IT management',
          d: 'We keep all your computers and systems watched and up to date.',
          detail: {
            tagline: 'We keep your computers and systems running — before anything goes wrong.',
            intro:
              'Your computers, servers and software need looking after. Updates, backups, storage filling up. We keep an eye on all of it and deal with it before it ever bothers you.',
            includes: [
              { t: 'Watched around the clock', d: 'Our monitoring runs 24/7. If a disk fills up or a server starts struggling, we see it first.' },
              { t: 'Updates and patches', d: 'Windows, macOS and your software stay current. We schedule it outside working hours so nobody sits still.' },
              { t: 'Backups that actually work', d: 'A backup every day and a real restore test every month. A backup you never restore is not a backup.' },
              { t: 'One clear overview', d: 'A single report showing what is running, what we fixed and what is coming up.' },
            ],
            outcomes: [
              'Fewer outages, and shorter ones when they do happen',
              'No surprises from full disks or failed updates',
              'Always able to get back to how things were yesterday',
              'A fixed monthly price, not a bill per hour',
            ],
            faq: [
              { q: 'Does this run on our own servers or in the cloud?', a: 'Either works. We support Microsoft 365 and Azure, servers in your own office, or a mix of both.' },
              { q: 'Will we notice the maintenance?', a: 'As little as possible. Updates are scheduled evenings or weekends. If something really has to happen during the day, we agree it with you first.' },
            ],
            meta: 'Maintenance, updates, monitoring and backups for your IT. Fixed monthly price, watched 24/7.',
          },
        },
        {
          slug: 'beveiliging',
          t: 'Security',
          d: 'We protect you from hackers, viruses and fake emails.',
          detail: {
            tagline: 'Protection from hackers, viruses and fake emails — without making work harder.',
            intro:
              'Most break-ins start with one wrong click in an email. We fit the locks properly, stop suspicious traffic, and make sure your people know what to watch out for.',
            includes: [
              { t: 'Fake emails filtered out', d: 'Phishing and dangerous attachments are stopped before they reach the inbox.' },
              { t: 'Two-step verification', d: 'A stolen password on its own is no longer enough to get in. We roll it out without making logging in a chore.' },
              { t: 'Protection on every device', d: 'Laptops, phones and servers get monitoring that spots unusual behaviour and steps in straight away.' },
              { t: 'Keeping your team sharp', d: 'Short, practical guidance and the occasional practice phishing email. No classroom, real effect.' },
            ],
            outcomes: [
              'A much smaller chance of ransomware and invoice fraud',
              'Clarity on who can reach which data',
              'Demonstrably in order for your insurer or client',
              'A plan ready to go for when something does slip through',
            ],
            faq: [
              { q: 'Does logging in get annoying?', a: 'No. On trusted devices and at the office you usually notice nothing. The extra step only appears when something looks off.' },
              { q: 'What do you do if we get hacked anyway?', a: 'We act immediately: devices off the network, work out what was touched, restore from backup. That plan is written in advance, not improvised on the day.' },
            ],
            meta: 'Protection against phishing, ransomware and data breaches. Two-step verification, device monitoring and an incident plan.',
          },
        },
        {
          slug: 'netwerk',
          t: 'Network & devices',
          d: 'Fast, stable internet and devices that simply work.',
          detail: {
            tagline: 'Internet and wifi that always work, and hardware that stays out of the way.',
            intro:
              'Patchy wifi in the meeting room or an internet line that drops costs you half a working day. We build the network properly, measure it afterwards, and keep watching it.',
            includes: [
              { t: 'Wifi that works everywhere', d: 'We survey your building and put access points where they are actually needed — including that one corner that never worked.' },
              { t: 'A connection that keeps going', d: 'A second internet line that takes over automatically when the first one drops.' },
              { t: 'Guests kept separate', d: 'Visitors get their own network, away from your computers and files.' },
              { t: 'Hardware without the hassle', d: 'We choose, order and install it, and track what sits where and when it is due for replacement.' },
            ],
            outcomes: [
              'No more complaints about slow or dropping wifi',
              'Keep working when the internet line fails',
              'Visitors online without risk to your data',
              'Replacements planned instead of sprung on you',
            ],
            faq: [
              { q: 'Do we have to replace everything?', a: 'Usually not. We look at what you have first. Often a better layout or one extra access point already solves it.' },
              { q: 'Do you handle the contract with the provider too?', a: 'Yes. We compare, place the order and see the installation through. You have one point of contact, even when the fault sits with the provider.' },
            ],
            meta: 'Wifi, cabling, internet connections and hardware. Installed, measured and monitored.',
          },
        },
        {
          slug: 'support',
          t: 'Help when stuck',
          d: 'Something broken? One call and we help you right away.',
          detail: {
            tagline: 'Something stuck? You have a real person on the line within 15 minutes.',
            intro:
              'A printer that refuses, a file that vanished, a laptop that will not start. Big or small: you call or email and we pick it up. No phone menu, no ticket left sitting.',
            includes: [
              { t: 'A reply within 15 minutes', d: 'During office hours someone picks up your report within a quarter of an hour.' },
              { t: 'Usually fixed on the spot', d: 'Most of it we solve remotely while you are still on the line.' },
              { t: 'On site when it is needed', d: 'Cannot be done remotely? Then we come to you — in the Randstad usually the same day.' },
              { t: 'Familiar faces', d: 'You get the same people every time. They know your setup, so you never have to explain it from scratch.' },
            ],
            outcomes: [
              'Less downtime when something breaks',
              'No frustration waiting for an answer',
              'Your people can keep working',
              'Recurring problems get solved properly, not patched again and again',
            ],
            faq: [
              { q: 'Can everyone call, or only one contact person?', a: 'Everyone can call. It saves time and stops problems sitting unreported because the contact person happens to be off.' },
              { q: 'Are you reachable outside office hours?', a: 'Our monitoring runs 24/7 and acts at night too. For phone support outside office hours we make separate arrangements.' },
            ],
            meta: 'A helpdesk that replies within 15 minutes. Remote or on-site help, always from the same team.',
          },
        },
        {
          slug: 'automatisering',
          t: 'Work smarter',
          d: 'We take boring, repetitive work off your hands with smart tools.',
          detail: {
            tagline: 'Let the computer do the boring, repetitive work.',
            intro:
              'Retyping the same lists every week, creating folders, forwarding invoices? That can run by itself. We start small, with the work your team loses the most time to.',
            includes: [
              { t: 'First, find where the time goes', d: 'We sit in for a few half-days and look for the manual work that comes back most often.' },
              { t: 'Let it run by itself', d: 'Using tools you already have — Microsoft 365, Power Automate, SharePoint — we make the steps happen on their own.' },
              { t: 'Connect your systems', d: 'Your accounting, calendar and customer system exchange data, so nothing gets typed in twice.' },
              { t: 'Handover and documentation', d: 'You get a short write-up of what runs and why, so it never becomes a black box.' },
            ],
            outcomes: [
              'Hours a week back for your team',
              'Fewer copy-and-paste mistakes',
              'Work that carries on when someone is ill or away',
              'A clearer view of what is actually happening',
            ],
            faq: [
              { q: 'Do we need to buy new software for this?', a: 'Usually not. Microsoft 365 already includes a lot that companies never use. We look at what you have first.' },
              { q: 'What if the process changes later?', a: 'Then we adjust it. We deliberately build in small pieces, so a change never turns into a rebuild.' },
            ],
            meta: 'Automate repetitive work with Microsoft 365 and Power Automate. Hours back each week and fewer mistakes.',
          },
        },
        {
          slug: 'werkplekken',
          t: 'Workplaces',
          d: 'Safe laptops and accounts for your whole team, wherever they work.',
          detail: {
            tagline: 'A new colleague is ready to go within a day — wherever they work.',
            intro:
              'Laptops, accounts, phones and the right permissions. We set it up properly once, so adding or removing someone takes minutes instead of days.',
            includes: [
              { t: 'Laptop ready on day one', d: 'The laptop arrives pre-configured at the new colleague. Log in and start working.' },
              { t: 'One account for everything', d: 'One login for email, files and your other software. Fewer passwords, less hassle.' },
              { t: 'Permissions that make sense', d: 'People see what they need and no more. When someone leaves, it all closes in one action.' },
              { t: 'Just as safe from home', d: 'At the office, at home or on the road, everything works the same and is equally secure.' },
            ],
            outcomes: [
              'New people productive immediately',
              'No forgotten accounts from former staff',
              'Fewer password problems and fewer questions',
              'The same setup everywhere, so it is easier to support',
            ],
            faq: [
              { q: 'Can people use their own laptop?', a: 'They can, with a separate, walled-off work environment. Business data then stays apart from their personal things.' },
              { q: 'How quickly is a new employee ready?', a: 'Give us a few days notice and everything is ready on their first day. The account and permissions are a matter of minutes.' },
            ],
            meta: 'Laptops, accounts and permissions for your whole team. New colleagues ready within a day, as safe at home as at the office.',
          },
        },
      ],
    },
    servicePage: {
      breadcrumb: 'Breadcrumb',
      back: 'All services',
      home: 'Home',
      includes: 'What you get',
      outcomes: 'What it gets you',
      faq: 'Questions about this service',
      ctaTitle: 'Curious what this means for your business?',
      ctaBody:
        'Book a free 30-minute call. We look at your situation together and you hear straight away what is possible.',
      ctaPrimary: 'Book a free call',
      ctaSecondary: 'Send a message',
      other: 'Other services',
      notFoundTitle: 'This page does not exist.',
      notFoundBody: 'We could not find that service. Here is what we do offer.',
      notFoundCta: 'Back to the homepage',
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
      videoNote: 'Online? You get a link for the video call. Nothing to install.',
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
      formHint: 'Pick a day and a time above first.',
      nameLabel: 'Your name',
      emailLabel: 'Your email',
      errors: { name: 'Please enter your name.', email: 'Please enter a valid email address.' },
      successTitle: 'Request sent.',
      successBody:
        'We’ll confirm your appointment by email, usually within one business day, with a link for the video call.',
      mailTitle: 'Your email app is open.',
      mailBody:
        'The request is waiting in a draft email. Send it to lock in the appointment. Nothing happened? Email us directly at info@hinit.nl.',
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
        { v: 24, suffix: '/7', label: 'We keep watch', dec: 0, static: true },
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
          a: 'That is fine. We often work alongside an in-house IT person or your current supplier. We pick up what tends to be left behind — usually security, backups and monitoring. We put who does what on a single page up front, so nobody works at cross purposes.',
        },
        {
          q: 'How fast are you there when something breaks?',
          a: 'During office hours we pick up your report within 15 minutes. Most things we fix remotely straight away. If someone needs to come over, in the Randstad we are usually with you the same day.',
        },
        {
          q: 'What does switching from our current IT provider look like?',
          a: 'Two to four weeks, without you standing still. We map everything first, run our monitoring alongside, and only take over management once that is working. Your current supplier does not need to cooperate for this.',
        },
        {
          q: 'Are we tied into anything?',
          a: 'No. After the first month the notice period is one month. Your data and configuration stay yours: if you leave, you take them with you in full.',
        },
        {
          q: 'We are quite small. Are we too small for you?',
          a: 'Not at all. We work with companies from around five employees up. That is often where the most can be gained, because IT is usually still something someone does "on the side".',
        },
        {
          q: 'Where is our data kept and who can access it?',
          a: 'Within the EU, with Microsoft in the Netherlands or Ireland. Our administrators only log in with two-step verification and every action is logged. You get it in writing which data we can see and why.',
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
      mailTitle: 'Your email app is open.',
      mailBody:
        'Your message is waiting in a draft email. Send it to reach us. Nothing happened? Email us directly at info@hinit.nl.',
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
      legalTitle: 'Legal',
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
