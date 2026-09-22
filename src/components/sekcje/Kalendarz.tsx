'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { Ikona } from '@/components/ui/Ikona'
import { Przycisk } from '@/components/ui/Przycisk'
import { godziny, tresci, uslugi } from '@/lib/dane'
import { SCIEZKA_ZADATKU, zadatekTekstem, zapiszSzkic } from '@/lib/zadatek'
import style from './Kalendarz.module.css'

/**
 * Kalendarz podglądowy.
 *
 * Pokazuje, jak rezerwacja będzie działać, zanim podepniemy kalendarz usług
 * GoHighLevel. Wolne godziny bierze z prawdziwych godzin otwarcia salonu,
 * a zajęte terminy wylicza z daty, więc przy każdym wejściu wyglądają tak
 * samo i nie skaczą po odświeżeniu strony.
 *
 * Zgłoszenie zakłada w GHL wizytę NIEPOTWIERDZONĄ, a klientka idzie dalej na
 * stronę zadatku. Rezerwację potwierdza dopiero wpłata, obsłużona webhookiem
 * po stronie serwera. Nic tutaj nie udaje potwierdzonej rezerwacji.
 *
 * Gdy w środowisku pojawi się NEXT_PUBLIC_GHL_KALENDARZ_URL, sekcja kontaktu
 * przestaje używać tego komponentu i osadza natywny widżet GHL.
 */

const NAZWY_DNI = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']
const ILE_MIESIECY_DO_PRZODU = 3
/** Ile godzin przed wizytą można ją jeszcze zarezerwować. */
const WYPRZEDZENIE_H = 2

type Stan = 'wybor' | 'wysylanie' | 'blad'

function bezCzasu(data: Date) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate())
}

function tenSamDzien(a: Date, b: Date) {
  return bezCzasu(a).getTime() === bezCzasu(b).getTime()
}

/** Godziny otwarcia dla dnia tygodnia. Tablica w danych zaczyna się od poniedziałku. */
function godzinyDnia(data: Date) {
  return godziny[(data.getDay() + 6) % 7]
}

/** Pełne godziny od otwarcia do godziny przed zamknięciem. */
function slotyDnia(data: Date): string[] {
  const zakres = godzinyDnia(data)
  if (!zakres?.od || !zakres?.do) return []
  const otwarcie = Number(zakres.od.slice(0, 2))
  const zamkniecie = Number(zakres.do.slice(0, 2))
  const lista: string[] = []
  for (let h = otwarcie; h <= zamkniecie - 1; h += 1) {
    lista.push(`${String(h).padStart(2, '0')}:00`)
  }
  return lista
}

/**
 * Które terminy udają zajęte. Wynik zależy wyłącznie od daty i godziny, więc
 * kalendarz wygląda tak samo przy każdym wejściu.
 */
function zajety(data: Date, godzina: string): boolean {
  const klucz = `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}-${godzina}`
  let suma = 7
  for (let i = 0; i < klucz.length; i += 1) {
    suma = (suma * 31 + klucz.charCodeAt(i)) >>> 0
  }
  return suma % 100 < 38
}

function zWielkiej(tekst: string) {
  return tekst.charAt(0).toUpperCase() + tekst.slice(1)
}

export function Kalendarz({ wybranaUsluga }: { wybranaUsluga: string }) {
  const tresc = tresci.kalendarz
  const tresciKontakt = tresci.kontakt
  const idFormularza = useId()
  const korzen = useRef<HTMLDivElement>(null)

  // Komponent jest ładowany wyłącznie w przeglądarce, więc dzisiejszą datę
  // można odczytać od razu. Gdyby liczyć ją podczas budowania strony,
  // kalendarz pokazywałby dzień sprzed wdrożenia.
  const [dzis] = useState(() => new Date())
  const [miesiac, ustawMiesiac] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  )
  const [dzien, ustawDzien] = useState<Date | null>(null)
  const [godzina, ustawGodzine] = useState<string | null>(null)
  const [stan, ustawStan] = useState<Stan>('wybor')
  const router = useRouter()

  const formatMiesiaca = useMemo(
    () => new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric' }),
    [],
  )
  const formatDnia = useMemo(
    () => new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }),
    [],
  )

  const pierwszy = new Date(miesiac.getFullYear(), miesiac.getMonth(), 1)
  const przesuniecie = (pierwszy.getDay() + 6) % 7
  const ileDni = new Date(miesiac.getFullYear(), miesiac.getMonth() + 1, 0).getDate()
  const ostatniDozwolony = new Date(dzis.getFullYear(), dzis.getMonth() + ILE_MIESIECY_DO_PRZODU, 0)

  const wstecz = new Date(miesiac.getFullYear(), miesiac.getMonth() - 1, 1)
  const naprzod = new Date(miesiac.getFullYear(), miesiac.getMonth() + 1, 1)
  const mozeWstecz = wstecz >= new Date(dzis.getFullYear(), dzis.getMonth(), 1)
  const mozeNaprzod = naprzod <= ostatniDozwolony

  /** Czy o tej porze da się jeszcze umówić wizytę na dziś. */
  function zaPozno(data: Date, slot: string) {
    if (!tenSamDzien(data, dzis)) return false
    const granica = dzis.getHours() + WYPRZEDZENIE_H
    return Number(slot.slice(0, 2)) <= granica
  }

  function wybierzDzien(data: Date) {
    ustawDzien(data)
    ustawGodzine(null)
    ustawStan('wybor')
  }

  async function rezerwuj(zdarzenie: FormEvent<HTMLFormElement>) {
    zdarzenie.preventDefault()
    if (!dzien || !godzina) return
    const formularz = zdarzenie.currentTarget
    const pola = Object.fromEntries(new FormData(formularz)) as Record<string, string>
    const opisTerminu = `${formatDnia.format(dzien)}, godzina ${godzina}`

    // Termin w formacie ISO, z godziną wklejoną z wybranego slotu. Potrzebny
    // później do pliku .ics na stronie potwierdzenia.
    const start = new Date(dzien)
    start.setHours(Number(godzina.slice(0, 2)), Number(godzina.slice(3, 5)), 0, 0)

    const wybranyFilar = uslugi.find((usluga) => usluga.id === pola.usluga)

    ustawStan('wysylanie')
    try {
      const odpowiedz = await fetch('/api/rezerwacja', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pola,
          termin: opisTerminu,
          terminIso: start.toISOString(),
          zgodaRegulamin: pola.zgodaRegulamin === 'on',
          zgodaDane: pola.zgodaDane === 'on',
          zgodaMarketing: pola.zgodaMarketing === 'on',
        }),
      })
      if (!odpowiedz.ok) throw new Error('Serwer odrzucił zgłoszenie')

      const wynik = (await odpowiedz.json()) as { id?: string }

      // Podsumowanie idzie do sessionStorage, a nie do adresu, bo w adresie
      // zostałoby w historii przeglądarki i w logach serwera.
      zapiszSzkic({
        id: wynik.id ?? '',
        imie: pola.imie ?? '',
        usluga: pola.usluga ?? '',
        uslugaNazwa: wybranyFilar?.nazwa ?? '',
        termin: zWielkiej(opisTerminu),
        terminIso: start.toISOString(),
      })

      router.push(SCIEZKA_ZADATKU)
    } catch {
      ustawStan('blad')
    }
  }

  const sloty = dzien ? slotyDnia(dzien) : []
  const zdanieOZadatku = `Na następnym kroku wpłacisz zadatek ${zadatekTekstem}, który odliczymy od ceny zabiegu.`

  return (
    <div ref={korzen}>
      {/*
        O zadatku mówimy PRZED wyborem terminu, a nie na końcu ścieżki.
        Klientka, która dowiaduje się o opłacie dopiero po podaniu numeru
        telefonu, czuje się wciągnięta w coś, na co się nie pisała.
      */}
      <p className={style.oZadatku}>
        <span className={style.znakZadatku}>
          <Ikona nazwa="zadatek" rozmiar={20} />
        </span>
        {tresc.oZadatku}
      </p>

      <p className={style.podglad}>{tresc.podglad}</p>

      <div className={style.uklad}>
        <div>
          <div className={style.nawigacja}>
            <button
              type="button"
              className={style.strzalka}
              onClick={() => ustawMiesiac(wstecz)}
              disabled={!mozeWstecz}
              aria-label={tresc.poprzedniMiesiac}
            >
              <Ikona nazwa="lewo" rozmiar={18} />
            </button>
            <span className={style.miesiac} aria-live="polite">
              {zWielkiej(formatMiesiaca.format(miesiac))}
            </span>
            <button
              type="button"
              className={style.strzalka}
              onClick={() => ustawMiesiac(naprzod)}
              disabled={!mozeNaprzod}
              aria-label={tresc.nastepnyMiesiac}
            >
              <Ikona nazwa="prawo" rozmiar={18} />
            </button>
          </div>

          <div className={style.naglowkiDni} aria-hidden="true">
            {NAZWY_DNI.map((nazwa) => (
              <span key={nazwa} className={style.naglowekDnia}>
                {nazwa}
              </span>
            ))}
          </div>

          <div className={style.siatka} role="group" aria-label={tresc.naglowek}>
            {Array.from({ length: przesuniecie }, (_, i) => (
              <span key={`pusty-${i}`} className={`${style.dzien} ${style.pusty}`} aria-hidden="true" />
            ))}

            {Array.from({ length: ileDni }, (_, i) => {
              const data = new Date(miesiac.getFullYear(), miesiac.getMonth(), i + 1)
              const przeszlosc = bezCzasu(data) < bezCzasu(dzis)
              const zaDaleko = bezCzasu(data) > bezCzasu(ostatniDozwolony)
              const wolneSloty = slotyDnia(data).filter((s) => !zajety(data, s) && !zaPozno(data, s))
              const nieczynne = wolneSloty.length === 0
              const wybrany = dzien !== null && tenSamDzien(data, dzien)

              return (
                <button
                  key={data.toISOString()}
                  type="button"
                  className={[
                    style.dzien,
                    tenSamDzien(data, dzis) ? style.dzisiaj : '',
                    wybrany ? style.wybrany : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  disabled={przeszlosc || zaDaleko || nieczynne}
                  aria-pressed={wybrany}
                  aria-label={formatDnia.format(data)}
                  onClick={() => wybierzDzien(data)}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          {/* Poziom trzeci, nie czwarty. Nad kalendarzem stoi h2 sekcji
              rezerwacji, wiec h4 przeskakiwaloby poziom i czytnik ekranu
              zglosilby dziure w konspekcie strony. */}
          <h3 className={style.tytulKolumny}>{tresc.wolneGodziny}</h3>

          {!dzien && <p className={style.podpowiedz}>{tresc.wybierzDzien}</p>}

          {dzien && (
            <>
              <p className={style.dataKolumny}>
                {zWielkiej(formatDnia.format(dzien))}
                {tenSamDzien(dzien, dzis) ? `, ${tresc.dzisiaj}` : ''}
              </p>

              {sloty.length === 0 ? (
                <p className={style.podpowiedz}>{tresc.brakGodzin}</p>
              ) : (
                <ul className={style.godziny}>
                  {sloty.map((slot) => {
                    const niedostepny = zajety(dzien, slot) || zaPozno(dzien, slot)
                    return (
                      <li key={slot}>
                        <button
                          type="button"
                          className={`${style.godzina} ${godzina === slot ? style.godzinaWybrana : ''}`}
                          disabled={niedostepny}
                          aria-pressed={godzina === slot}
                          aria-label={niedostepny ? `${slot}, ${tresc.zajete}` : slot}
                          onClick={() => ustawGodzine(slot)}
                        >
                          {slot}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      {dzien && godzina && (
        <form className={style.formularz} onSubmit={rezerwuj}>
          <p className={style.wybraneTermin}>
            <span className={style.etykietaTerminu}>{tresc.wybranyTermin}</span>
            <span>
              {zWielkiej(formatDnia.format(dzien))}, {godzina}
            </span>
            <button type="button" className={style.zmien} onClick={() => ustawGodzine(null)}>
              {tresc.zmienTermin}
            </button>
          </p>

          <div className={style.pola}>
            <div className={style.pole}>
              <label className={style.etykieta} htmlFor={`${idFormularza}-imie`}>
                {tresciKontakt.poleImie}
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
                {tresciKontakt.poleTelefon}
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
                {tresciKontakt.poleUsluga}
              </label>
              <select
                className={style.wybor}
                id={`${idFormularza}-usluga`}
                name="usluga"
                defaultValue={wybranaUsluga}
              >
                <option value="">{tresciKontakt.polePusteUsluga}</option>
                {uslugi.map((usluga) => (
                  <option key={usluga.id} value={usluga.id}>
                    {usluga.nazwa}
                  </option>
                ))}
              </select>
            </div>
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

          {/*
            Dwie zgody obowiązkowe i jedna dobrowolna, domyślnie odznaczona.
            Serwer sprawdza obie obowiązkowe jeszcze raz, bo atrybut required
            chroni klientkę przed pomyłką, a nie serwer przed zgłoszeniem
            wysłanym z pominięciem strony.
          */}
          <div className={style.zgody}>
            <label className={style.zgodaPole}>
              <input type="checkbox" name="zgodaRegulamin" required />
              <span>
                {tresc.zgodaRegulamin}{' '}
                <Link href="/regulamin-rezerwacji">{tresciKontakt.regulaminLink}</Link>
              </span>
            </label>

            <label className={style.zgodaPole}>
              <input type="checkbox" name="zgodaDane" required />
              <span>
                {tresc.zgodaDane}{' '}
                <Link href="/polityka-prywatnosci">{tresciKontakt.politykaLink}</Link>
              </span>
            </label>

            <label className={style.zgodaPole}>
              <input type="checkbox" name="zgodaMarketing" />
              <span>{tresc.zgodaMarketing}</span>
            </label>
          </div>

          <Przycisk type="submit" disabled={stan === 'wysylanie'}>
            {stan === 'wysylanie' ? tresc.przyciskWysylanie : tresc.przyciskRezerwuj}
          </Przycisk>

          <p className={style.zgoda}>{zdanieOZadatku}</p>

          <p aria-live="polite" role="status">
            {stan === 'blad' && <span className={style.komunikat}>{tresc.blad}</span>}
          </p>
        </form>
      )}
    </div>
  )
}
