import { adresStrony, bezZnacznikow, czekaNaDane, faq, opinie, salon, tresci, uslugi } from '@/lib/dane'

/**
 * Dane strukturalne gabinetu, oferty i listy pytań.
 *
 * Trzy zasady, na których to stoi:
 *
 *   Ocena i liczba opinii biorą się z tego samego pliku co sekcja opinii,
 *   bo podanie ich w znacznikach bez pokrycia w treści łamie wytyczne Google.
 *
 *   Godziny trafiają do znaczników dopiero wtedy, gdy ktoś je uzupełni.
 *
 *   Do FAQPage idą wyłącznie odpowiedzi już potwierdzone. Odpowiedź ze
 *   znacznikiem TODO nie ma prawa pojawić się ani na stronie, ani w wynikach
 *   wyszukiwania.
 */
const DNI: Record<string, string> = {
  Poniedziałek: 'Monday',
  Wtorek: 'Tuesday',
  Środa: 'Wednesday',
  Czwartek: 'Thursday',
  Piątek: 'Friday',
  Sobota: 'Saturday',
  Niedziela: 'Sunday',
}

export function Schema() {
  const otwarte = salon.godziny.pozycje
    .filter((godzina) => godzina.od && godzina.do)
    .map((godzina) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DNI[godzina.dzien],
      opens: godzina.od,
      closes: godzina.do,
    }))

  // Profile społecznościowe wchodzą tylko wtedy, gdy mamy adresy. Pusty
  // wpis w sameAs jest gorszy niż brak pola.
  const profile = [salon.instagram, salon.facebook].filter((adres) => adres.length > 0)

  const gotowePytania = faq.filter((pozycja) => !czekaNaDane(pozycja.odpowiedz))
  const opinieZTrescia = opinie.filter((opinia) => !czekaNaDane(opinia.autor))

  const salonLd = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: salon.nazwa,
    alternateName: salon.nazwaKrotka,
    description: tresci.meta.opis,
    slogan: salon.haslo,
    url: adresStrony,
    telephone: salon.telefon,
    image: `${adresStrony}/images/hero/zabieg.webp`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: salon.adres.ulica,
      postalCode: salon.adres.kodPocztowy,
      addressLocality: salon.adres.miasto,
      addressCountry: salon.adres.kraj,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: salon.geo.szerokosc,
      longitude: salon.geo.dlugosc,
    },
    areaServed: [
      'Chełmża',
      'Toruń',
      'Kowalewo Pomorskie',
      'Łysomice',
      'Papowo Biskupie',
      'Chełmno',
    ].map((nazwa) => ({ '@type': 'City', name: nazwa })),
    founder: { '@type': 'Person', name: salon.wlascicielka },
    ...(profile.length > 0 ? { sameAs: profile } : {}),
    ...(otwarte.length > 0 ? { openingHoursSpecification: otwarte } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: tresci.oferta.naglowek,
      itemListElement: uslugi.map((usluga) => ({
        '@type': 'OfferCatalog',
        name: usluga.nazwa,
        url: `${adresStrony}/zabiegi/${usluga.slug}`,
        itemListElement: usluga.zabiegi.map((zabieg) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: bezZnacznikow(zabieg.nazwa) },
        })),
      })),
    },
    /* Ocena idzie do znaczników tylko wtedy, gdy jest widoczna na stronie.
       Podanie jej bez pokrycia w treści łamie wytyczne Google. */
    ...(salon.ocena.liczbaOpinii > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: salon.ocena.srednia,
            reviewCount: salon.ocena.liczbaOpinii,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(opinieZTrescia.length > 0
      ? {
          review: opinieZTrescia.map((opinia) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: opinia.autor },
            reviewBody: opinia.tekst,
            reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5, worstRating: 1 },
          })),
        }
      : {}),
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: gotowePytania.map((pozycja) => ({
      '@type': 'Question',
      name: pozycja.pytanie,
      acceptedAnswer: { '@type': 'Answer', text: pozycja.odpowiedz },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(salonLd).replace(/</g, '\\u003c') }}
      />
      {gotowePytania.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, '\\u003c') }}
        />
      )}
    </>
  )
}
