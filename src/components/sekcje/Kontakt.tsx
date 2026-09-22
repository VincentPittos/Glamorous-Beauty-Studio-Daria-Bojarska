'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import Script from 'next/script'
import { useSearchParams } from 'next/navigation'
import { useId, useState, type FormEvent } from 'react'
import { Ikona } from '@/components/ui/Ikona'
import { PasekKrokow } from '@/components/ui/PasekKrokow'
import { Przycisk } from '@/components/ui/Przycisk'
import { godziny, salon, tresci, uslugi } from '@/lib/dane'
import { adresWidzetu, kalendarzPodlaczony } from '@/lib/ghl'
import style from './Kontakt.module.css'

/**
 * Kalendarz podglądowy liczy dzisiejszą datę, więc nie ma sensu renderować
 * go podczas budowania strony. Ładujemy go wyłącznie w przeglądarce, dzięki
 * czemu data zawsze jest aktualna i nie ma rozjazdu przy hydracji.
 */
const Kalendarz = dynamic(() => import('./Kalendarz').then((m) => m.Kalendarz), {
  ssr: false,
  loading: () => <div className={style.szkieletKalendarza} aria-hidden="true" />,
})

type Stan = 'spoczynek' | 'wysylanie' | 'wyslane' | 'blad'

/**
 * Rezerwacja, dane kontaktowe i formularz pytania na jednym ekranie.
 *
 * Dopóki nie ma adresu widżetu GHL, rezerwację obsługuje własny kalendarz
 * podglądowy. Po ustawieniu NEXT_PUBLIC_GHL_KALENDARZ_URL jego miejsce
 * zajmuje natywny widżet GHL i to on przejmuje czasy zabiegów oraz
 * sprawdzanie dostępności.
 */
export function Kontakt() {
  const tresc = tresci.kontakt
  const wybrana = useSearchParams().get('usluga') ?? ''
  const [stan, ustawStan] = useState<Stan>('spoczynek')
  const idFormularza = useId()

  async function wyslij(zdarzenie: FormEvent<HTMLFormElement>) {
    zdarzenie.preventDefault()
    const formularz = zdarzenie.currentTarget
    const dane = Object.fromEntries(new FormData(formularz))
    ustawStan('wysylanie')
    try {
      const odpowiedz = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dane, zrodlo: 'formularz pytania' }),
      })
      if (!odpowiedz.ok) throw new Error('Serwer odrzucił zgłoszenie')
      formularz.reset()
      ustawStan('wyslane')
    } catch {
      ustawStan('blad')
    }
  }

  return (
    <section id="kontakt" className="sekcja sekcja--krem">
      <div className="ramka">
        <p className="nadtytul">{tresc.nadtytul}</p>
        <h2 id="rezerwacja">{tresc.naglowek}</h2>
        <p className={style.wstep}>{tresc.wstep}</p>

        <PasekKrokow aktywny={1} />

        <div className={style.panelRezerwacji}>
          {kalendarzPodlaczony ? (
            <>
              <iframe
                className={style.kalendarzGhl}
                src={adresWidzetu(wybrana || undefined)}
                title="Kalendarz rezerwacji"
                scrolling="no"
              />
              {/* Skrypt GoHighLevel dopasowuje wysokość ramki do zawartości. */}
              <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
            </>
          ) : (
            <Kalendarz wybranaUsluga={wybrana} />
          )}
        </div>

        <div className={style.uklad}>
          <div className={style.panel}>
            <ul className={style.dane}>
              <li>
                <span className={style.ikona}>
                  <Ikona nazwa="lokalizacja" rozmiar={21} />
                </span>
                <span>
                  {salon.adres.ulica}
                  <br />
                  {salon.adres.kodPocztowy} {salon.adres.miasto}
                  <br />
                  <a href={salon.nawigacja} target="_blank" rel="noopener noreferrer">
                    {tresc.nawigacja}
                  </a>
                </span>
              </li>
              <li>
                <span className={style.ikona}>
                  <Ikona nazwa="telefon" rozmiar={21} />
                </span>
                <a href={`tel:${salon.telefon.replace(/\s/g, '')}`}>{salon.telefonDoWyswietlenia}</a>
              </li>
            </ul>

            <h3 className={style.tytulPanelu}>{tresc.godzinyTytul}</h3>
            <ul className={style.godziny}>
              {godziny.map((godzina) => (
                <li key={godzina.dzien} className={style.godzina}>
                  <span>{godzina.dzien}</span>
                  <span className={godzina.od ? undefined : style.zamkniete}>
                    {godzina.od && godzina.do ? `${godzina.od} do ${godzina.do}` : tresc.zamkniete}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={style.panel}>
            <h3 className={style.tytulPanelu}>{tresc.naglowekFormularza}</h3>
            <p className={style.opisPanelu}>{tresc.wstepFormularza}</p>

            <form className={style.formularz} onSubmit={wyslij}>
              <div className={style.pole}>
                <label className={style.etykieta} htmlFor={`${idFormularza}-imie`}>
                  {tresc.poleImie}
                </label>
                <input
                  className={style.wejscie}
                  id={`${idFormularza}-imie`}
                  name="imie"
                  type="text"
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className={style.pole}>
                <label className={style.etykieta} htmlFor={`${idFormularza}-telefon`}>
                  {tresc.poleTelefon}
                </label>
                <input
                  className={style.wejscie}
                  id={`${idFormularza}-telefon`}
                  name="telefon"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className={style.pole}>
                <label className={style.etykieta} htmlFor={`${idFormularza}-usluga`}>
                  {tresc.poleUsluga}
                </label>
                <select
                  className={style.wybor}
                  id={`${idFormularza}-usluga`}
                  name="usluga"
                  defaultValue={wybrana}
                >
                  <option value="">{tresc.polePusteUsluga}</option>
                  {uslugi.map((usluga) => (
                    <option key={usluga.id} value={usluga.id}>
                      {usluga.nazwa}
                    </option>
                  ))}
                </select>
              </div>

              <div className={style.pole}>
                <label className={style.etykieta} htmlFor={`${idFormularza}-wiadomosc`}>
                  {tresc.poleWiadomosc}
                </label>
                <textarea
                  className={style.obszar}
                  id={`${idFormularza}-wiadomosc`}
                  name="wiadomosc"
                  rows={4}
                />
              </div>

              <div className={style.pulapka} aria-hidden="true">
                <label htmlFor={`${idFormularza}-strona`}>Zostaw to pole puste</label>
                <input
                  id={`${idFormularza}-strona`}
                  name="strona"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <Przycisk type="submit" wariant="atrament" disabled={stan === 'wysylanie'}>
                {stan === 'wysylanie' ? tresc.przyciskWysylanie : tresc.przyciskFormularza}
              </Przycisk>

              <p className={style.zgoda}>
                {tresc.zgoda} <Link href="/polityka-prywatnosci">{tresc.politykaLink}</Link>
              </p>

              <p aria-live="polite" role="status">
                {stan === 'wyslane' && <span className={style.komunikat}>{tresc.potwierdzenie}</span>}
                {stan === 'blad' && (
                  <span className={`${style.komunikat} ${style.komunikatBlad}`}>{tresc.blad}</span>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
