/**
 * Zestaw ikon liniowych rysowanych na miejscu, bez biblioteki.
 *
 * Wszystkie siedzą na siatce 24 na 24, mają tę samą grubość kreski i
 * zaokrąglone końce, dzięki czemu filary oferty, cennik i stopka wyglądają
 * jak jedna rodzina. Ikona jest dekoracją obok tekstu, więc domyślnie jest
 * ukryta przed czytnikami ekranu. Podaj opis tylko wtedy, gdy ikona niesie
 * treść, której nie ma obok.
 *
 * Styl marki: ikonę osadza się w medalionie, czyli ciemnym krążku ze złotym
 * pierścieniem. Służy do tego komponent Medalion niżej w tym pliku.
 */

export type NazwaIkony =
  | 'skora'
  | 'problemy'
  | 'odmladzanie'
  | 'sylwetka'
  | 'oko'
  | 'doradztwo'
  | 'drenaz'
  | 'lotos'
  | 'kalendarz'
  | 'zadatek'
  | 'tarcza'
  | 'dlon'
  | 'diament'
  | 'telefon'
  | 'lokalizacja'
  | 'zegar'
  | 'instagram'
  | 'facebook'
  | 'gwiazdka'
  | 'lewo'
  | 'prawo'
  | 'zamknij'
  | 'plus'

const KSZTALTY: Record<NazwaIkony, React.ReactNode> = {
  /* Filar 1. Twarz z profilu i iskierki, czyli skóra, która odzyskała blask. */
  skora: (
    <>
      <path d="M15.6 3.6c-3.4-1.3-7 .6-8 4.1-.5 1.7-.2 3 .2 4.2.3 1 .1 1.6-.6 2.3l-.8.8c-.5.5-.3 1.3.4 1.5l1.4.4v1.9a2 2 0 0 0 2 2h3.1" />
      <path d="M13.1 10.6h.01" />
      <path d="M19.4 4.2v2.6M18.1 5.5h2.6" />
      <path d="M18.9 12.4v2M17.9 13.4h2" />
      <path d="M21 16.6v1.8M20.1 17.5h1.8" />
    </>
  ),
  /* Filar 2. Kropla pod lupą, czyli przyglądanie się konkretnemu problemowi. */
  problemy: (
    <>
      <path d="M10.6 2.9c3 3.7 4.6 6.2 4.6 8.4a4.6 4.6 0 0 1-9.2 0c0-2.2 1.6-4.7 4.6-8.4Z" />
      <circle cx="15.4" cy="15.4" r="4.1" />
      <path d="m18.4 18.4 3 3" />
    </>
  ),
  /* Filar 3. Twarz i łuk liftingu, czyli napięcie i owal. */
  odmladzanie: (
    <>
      <path d="M16.2 4.3a7 7 0 0 0-9.1 9.4c.4.9.3 1.5-.3 2.1l-.7.7c-.5.5-.3 1.3.4 1.5l1.3.4v1.7a1.9 1.9 0 0 0 1.9 1.9h2.4" />
      <path d="M17.4 8.9c2.6 2.2 3 6 .9 8.6a6.2 6.2 0 0 1-3.7 2.2" />
      {/* Grot strzałki na szczycie łuku. Bez niego łuk czyta się jak przypadkowa
          kreska obok twarzy, a ma mówić o podnoszeniu owalu. */}
      <path d="m15.2 10.2 2.2-1.3 1.4 2.2" />
    </>
  ),
  /* Filar 4. Linia talii z krzywą modelowania. */
  sylwetka: (
    <>
      <path d="M8.2 2.8c0 3-1.5 4.2-1.5 6.6 0 1.7 1.4 2.4 1.4 4.3 0 2.3-1.4 3.4-1.4 6.1v1.4" />
      <path d="M15.8 2.8c0 3 1.5 4.2 1.5 6.6 0 1.7-1.4 2.4-1.4 4.3 0 2.3 1.4 3.4 1.4 6.1v1.4" />
      <path d="M9.9 11.4c1.4.7 2.8.7 4.2 0" />
    </>
  ),
  /* Filar 5. Oko z rzęsami i łukiem brwi. */
  oko: (
    <>
      <path d="M4.4 8.2c2.3-2.1 4.8-3.1 7.6-3.1s5.3 1 7.6 3.1" />
      <path d="M3.2 14.4c2.9-3.3 5.8-5 8.8-5s5.9 1.7 8.8 5" />
      <path d="M3.2 14.4c2.9 2.6 5.8 3.9 8.8 3.9s5.9-1.3 8.8-3.9" />
      <circle cx="12" cy="14.2" r="2.3" />
      <path d="M5.9 18.3 4.6 20M9.2 19.9l-.4 1.8M14.8 19.9l.4 1.8M18.1 18.3l1.3 1.7" />
    </>
  ),
  /* Filar 6. Postać z sercem, czyli rozmowa i dobór zabiegu. */
  doradztwo: (
    <>
      <circle cx="9.4" cy="6.6" r="3.1" />
      <path d="M3.4 20.6c0-3.3 2.7-6 6-6 1.3 0 2.5.4 3.5 1.1" />
      <path d="M17.6 21.2c-3-1.9-4.4-3.4-4.4-5.2a2.2 2.2 0 0 1 4.4-.7 2.2 2.2 0 0 1 4.4.7c0 1.8-1.4 3.3-4.4 5.2Z" />
    </>
  ),
  /* Drenaż limfatyczny. Fala, która odpływa, i krople nad nią. */
  drenaz: (
    <>
      <path d="M2.8 14.4c1.6-1.6 3.2-1.6 4.8 0s3.2 1.6 4.8 0 3.2-1.6 4.8 0 3.2 1.6 4.8 0" />
      <path d="M2.8 19.2c1.6-1.6 3.2-1.6 4.8 0s3.2 1.6 4.8 0 3.2-1.6 4.8 0 3.2 1.6 4.8 0" />
      <path d="M8.6 2.6c1.7 2.1 2.6 3.5 2.6 4.7a2.6 2.6 0 0 1-5.2 0c0-1.2.9-2.6 2.6-4.7Z" />
      <path d="M16.4 6.2c1.2 1.5 1.8 2.5 1.8 3.4a1.8 1.8 0 0 1-3.6 0c0-.9.6-1.9 1.8-3.4Z" />
    </>
  ),
  /* Kwiat lotosu. Pozostałe usługi i sekcje o spokoju. */
  lotos: (
    <>
      <path d="M12 3.2c1.9 2 2.9 4 2.9 6.1 0 2-1 4-2.9 5.9-1.9-1.9-2.9-3.9-2.9-5.9 0-2.1 1-4.1 2.9-6.1Z" />
      <path d="M12 15.2c-2.4 2.4-5 3.3-7.8 2.8.3-2.9 1.7-5 4.2-6.4" />
      <path d="M12 15.2c2.4 2.4 5 3.3 7.8 2.8-.3-2.9-1.7-5-4.2-6.4" />
    </>
  ),
  kalendarz: (
    <>
      <rect x="3.2" y="5" width="17.6" height="16" rx="2" />
      <path d="M3.2 9.8h17.6M8.2 2.8v4M15.8 2.8v4" />
      <path d="M7.6 13.8h2M11 13.8h2M14.4 13.8h2M7.6 17.2h2M11 17.2h2" />
    </>
  ),
  /* Zadatek. Karta z monetą, bo płaci się kartą, BLIK-iem albo przelewem. */
  zadatek: (
    <>
      <rect x="2.6" y="5.4" width="14.6" height="10.4" rx="2" />
      <path d="M2.6 9h14.6" />
      <path d="M5.6 12.8h3" />
      <circle cx="17.6" cy="16.2" r="4.4" />
      <path d="M17.6 14.2v4M16.4 15.4h2.1a.9.9 0 0 1 0 1.8h-1.8a.9.9 0 0 0 0 1.8h2.1" />
    </>
  ),
  /* Tarcza z sercem. Bezpieczeństwo i sterylność. */
  tarcza: (
    <>
      <path d="M12 2.6 4.6 5.4v6c0 4.3 3 8.2 7.4 9.8 4.4-1.6 7.4-5.5 7.4-9.8v-6Z" />
      <path d="M12 16.2c-2.3-1.5-3.4-2.7-3.4-4.1a1.8 1.8 0 0 1 3.4-.6 1.8 1.8 0 0 1 3.4.6c0 1.4-1.1 2.6-3.4 4.1Z" />
    </>
  ),
  /* Dłoń. Konsultacja, opieka, prowadzenie za rękę. */
  dlon: (
    <>
      <path d="M8.6 12.6V5.4a1.7 1.7 0 0 1 3.4 0v5.6" />
      <path d="M12 10.4V4.2a1.7 1.7 0 0 1 3.4 0v6.6" />
      <path d="M15.4 11.2V6.8a1.7 1.7 0 0 1 3.4 0v8c0 3.5-2.6 6.4-6.1 6.4h-.9c-2 0-3.8-1.1-4.7-2.9l-2.4-4.5a1.7 1.7 0 0 1 2.7-2l1.2 1.4" />
    </>
  ),
  /* Diament z logotypu. Mały ornament przy nagłówkach sekcji.
     UWAGA: geometria zastępcza. Po otrzymaniu logo w wektorze podmień
     ścieżkę na tę z pliku marki, żeby sygnet zgadzał się co do kreski. */
  diament: (
    <>
      <path d="M12 2.8 21 9.4 12 21.2 3 9.4Z" />
      <path d="M3 9.4h18M8.4 9.4 12 2.8l3.6 6.6M8.4 9.4 12 21.2l3.6-11.8" />
    </>
  ),
  telefon: (
    <path d="M6.2 3.5h2.9l1.5 3.7-1.9 1.4a11.5 11.5 0 0 0 5.3 5.3l1.4-1.9 3.7 1.5v2.9a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  lokalizacja: (
    <>
      <path d="M12 21.2s7-5.8 7-11.2a7 7 0 1 0-14 0c0 5.4 7 11.2 7 11.2Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  zegar: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.2V12l3.2 2.1" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14.8 21.5v-8h2.7l.5-3.4h-3.2V7.9c0-1 .3-1.7 1.7-1.7h1.7V3.2a23 23 0 0 0-2.6-.2c-2.6 0-4.4 1.6-4.4 4.5v2.6H8v3.4h3.2v8Z" />
  ),
  gwiazdka: (
    <path
      d="m12 2.9 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.5l6.3-.9Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  lewo: <path d="M15 4.5 7.5 12l7.5 7.5" />,
  prawo: <path d="M9 4.5 16.5 12 9 19.5" />,
  zamknij: <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />,
  plus: <path d="M12 5.5v13M5.5 12h13" />,
}

export function Ikona({
  nazwa,
  rozmiar = 24,
  opis,
}: {
  nazwa: NazwaIkony
  rozmiar?: number
  /** Podaj tylko wtedy, gdy ikona niesie treść, której nie ma obok w tekście. */
  opis?: string
}) {
  return (
    <svg
      width={rozmiar}
      height={rozmiar}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={opis ? 'img' : undefined}
      aria-label={opis}
      aria-hidden={opis ? undefined : true}
      focusable="false"
    >
      {KSZTALTY[nazwa]}
    </svg>
  )
}

/**
 * Ikona w medalionie z banera marki: ciemny krążek, cienki złoty pierścień,
 * w środku kreska w jasnym złocie. Klasy siedzą w globals.css, żeby ten sam
 * medalion dało się postawić także wokół czegoś innego niż ikona.
 */
export function Medalion({
  nazwa,
  wielkosc = 'zwykly',
  opis,
}: {
  nazwa: NazwaIkony
  wielkosc?: 'maly' | 'zwykly' | 'duzy'
  opis?: string
}) {
  const klasa =
    wielkosc === 'zwykly' ? 'medalion' : `medalion medalion--${wielkosc === 'maly' ? 'maly' : 'duzy'}`
  const rozmiar = wielkosc === 'maly' ? 20 : wielkosc === 'duzy' ? 30 : 26

  return (
    <span className={klasa}>
      <Ikona nazwa={nazwa} rozmiar={rozmiar} opis={opis} />
    </span>
  )
}
