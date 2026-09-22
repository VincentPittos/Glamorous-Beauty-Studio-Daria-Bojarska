import { Ikona, Medalion, type NazwaIkony } from '@/components/ui/Ikona'
import { PrzyciskLink } from '@/components/ui/Przycisk'
import { cennik, czekaNaDane, tresci } from '@/lib/dane'
import { linkRezerwacji } from '@/lib/ghl'
import style from './Cennik.module.css'

/**
 * Cennik na znacznikach details i summary.
 *
 * Rozwijanie działa bez JavaScriptu, obsługuje klawiaturę i czytniki ekranu
 * bez dokładania atrybutów. Pierwsza kategoria jest otwarta, żeby po wejściu
 * w sekcję od razu było widać ceny, a nie sześć zamkniętych belek.
 *
 * Ceny, których jeszcze nie mamy od Pani Darii, mają w pliku znacznik TODO.
 * Zamiast niego wchodzi zdanie o ustalaniu ceny na konsultacji, bo pokazanie
 * klientce surowego znacznika byłoby gorsze niż brak ceny.
 */
export function Cennik() {
  const tresc = tresci.cennik

  return (
    <section id="cennik" className="sekcja sekcja--kosc">
      <div className="ramka">
        <p className="nadtytul">{tresc.nadtytul}</p>
        <h2>{tresc.naglowek}</h2>
        <p className={style.wstep}>{tresc.wstep}</p>

        <div className={style.lista}>
          {cennik.map((kategoria, indeks) => (
            <details key={kategoria.id} className={style.blok} open={indeks === 0}>
              <summary className={style.naglowekBloku}>
                <Medalion nazwa={kategoria.ikona as NazwaIkony} wielkosc="maly" />
                <h3>{kategoria.nazwa}</h3>
                <span className={style.ile}>
                  {kategoria.pozycje.length}{' '}
                  {kategoria.pozycje.length === 1 ? 'pozycja' : 'pozycje'}
                </span>
                <span className={style.znacznik} aria-hidden="true">
                  <Ikona nazwa="plus" rozmiar={22} />
                </span>
              </summary>

              <div className={style.zawartosc}>
                {kategoria.dopisek && <p className={style.dopisek}>{kategoria.dopisek}</p>}

                <ul className={style.pozycje}>
                  {kategoria.pozycje.map((pozycja) => (
                    <li key={pozycja.nazwa} className={style.pozycja}>
                      <span className={style.nazwa}>{pozycja.nazwa}</span>
                      <span className={style.wypelniacz} aria-hidden="true" />
                      <span
                        className={czekaNaDane(pozycja.cena) ? style.cenaBrak : style.cena}
                      >
                        {czekaNaDane(pozycja.cena) ? tresc.brakCeny : pozycja.cena}
                      </span>
                    </li>
                  ))}
                </ul>

                <PrzyciskLink href={linkRezerwacji(kategoria.id)} wariant="atrament">
                  {tresc.przycisk}
                  <span className="tylko-czytnik">, {kategoria.nazwa}</span>
                </PrzyciskLink>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
