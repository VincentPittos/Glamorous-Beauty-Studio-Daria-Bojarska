'use client'

import { useEffect, useMemo } from 'react'
import { Ikona, Medalion } from '@/components/ui/Ikona'
import { PasekKrokow } from '@/components/ui/PasekKrokow'
import { PrzyciskLink } from '@/components/ui/Przycisk'
import { salon, tresci } from '@/lib/dane'
import { useNawodnienie, useSzkicRezerwacji } from '@/lib/szkic-rezerwacji'
import { wyczyscSzkic, type SzkicRezerwacji } from '@/lib/zadatek'
import style from './potwierdzenie.module.css'

/**
 * Krok trzeci: rezerwacja potwierdzona.
 *
 * UWAGA. Ten ekran POKAZUJE potwierdzenie, ale go nie WYSTAWIA. Wizytę
 * potwierdza wyłącznie webhook płatności po sprawdzeniu podpisu. Gdyby ktoś
 * wpisał ten adres z palca, zobaczy stronę bez rezerwacji, bo nie ma jej
 * w sessionStorage, a po stronie GHL nic się nie zmieni.
 *
 * Plik .ics składamy w przeglądarce, żeby klientka nie musiała nigdzie
 * przepisywać daty. Godzina idzie w czasie lokalnym z jawną strefą UTC,
 * bo terminy trzymamy w ISO.
 */

/** Zapis czasu w formacie, którego wymaga plik kalendarza. */
function naCzasIcs(iso: string): string {
  return `${iso.replace(/[-:]/g, '').split('.')[0]}Z`
}

function zbudujIcs(szkic: SzkicRezerwacji): string {
  const start = new Date(szkic.terminIso)
  // Bez znajomości czasu trwania zabiegu rezerwujemy w kalendarzu godzinę.
  // Prawdziwe czasy zna GHL i to on wyśle przypomnienie z dokładną długością.
  const koniec = new Date(start.getTime() + 60 * 60 * 1000)
  const tytul = szkic.uslugaNazwa
    ? `${szkic.uslugaNazwa}, ${salon.nazwaKrotka}`
    : `Wizyta w ${salon.nazwaKrotka}`
  const miejsce = `${salon.adres.ulica}, ${salon.adres.kodPocztowy} ${salon.adres.miasto}`

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Glamorous Beauty Studio//Rezerwacja//PL',
    'BEGIN:VEVENT',
    `UID:${szkic.id || szkic.terminIso}@glamorousbeautystudio`,
    `DTSTAMP:${naCzasIcs(new Date().toISOString())}`,
    `DTSTART:${naCzasIcs(szkic.terminIso)}`,
    `DTEND:${naCzasIcs(koniec.toISOString())}`,
    `SUMMARY:${tytul}`,
    `LOCATION:${miejsce}`,
    `DESCRIPTION:Telefon do gabinetu: ${salon.telefonDoWyswietlenia}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function EkranPotwierdzenia() {
  const tresc = tresci.potwierdzenie
  const wczytane = useNawodnienie()
  const szkic = useSzkicRezerwacji()

  // Rezerwacja jest zamknięta, więc szkic nie ma po co dłużej leżeć
  // w przeglądarce razem z imieniem i godziną wizyty. Czyścimy go przy
  // wyjściu ze strony, a nie po wejściu na nią, bo skasowany w trakcie
  // wyglądałby tak, jakby potwierdzenie zniknęło klientce sprzed oczu.
  useEffect(() => wyczyscSzkic, [])

  const plikIcs = useMemo(() => {
    if (!szkic?.terminIso) return ''
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(zbudujIcs(szkic))}`
  }, [szkic])

  return (
    <section className="sekcja sekcja--krem">
      <div className="ramka">
        <div className={style.uklad}>
          <PasekKrokow aktywny={3} />

          <Medalion nazwa="lotos" wielkosc="duzy" />

          <p className="nadtytul">{tresc.nadtytul}</p>
          <h1 className={style.naglowek}>{tresc.naglowek}</h1>
          <p className={style.wstep}>{tresc.wstep}</p>

          {wczytane && szkic && (
            <p className={style.termin}>
              <Ikona nazwa="kalendarz" rozmiar={20} />
              {szkic.termin}
            </p>
          )}

          <div className={style.przyciski}>
            {plikIcs && (
              <a className={style.pobierz} href={plikIcs} download="wizyta.ics">
                {tresc.kalendarzPrzycisk}
              </a>
            )}
            <a
              className={style.mapa}
              href={salon.nawigacja}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tresc.mapaPrzycisk}
            </a>
          </div>

          <div className={style.przygotowanie}>
            <h2 className={style.tytulPrzygotowania}>{tresc.przygotowanieTytul}</h2>
            <ul>
              {tresc.przygotowanie.map((punkt) => (
                <li key={punkt}>{punkt}</li>
              ))}
            </ul>
          </div>

          <PrzyciskLink href="/" wariant="obrys">
            {tresc.powrot}
          </PrzyciskLink>
        </div>
      </div>
    </section>
  )
}
