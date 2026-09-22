import { tresci } from '@/lib/dane'
import style from './PasekKrokow.module.css'

/**
 * Pasek postępu rezerwacji: usługa i termin, zadatek, gotowe.
 *
 * Klientka ma widzieć, ile jeszcze przed nią, zanim poda pierwszą daną.
 * Ścieżka bez widocznego końca jest najczęstszym powodem porzucenia
 * rezerwacji, która wymaga płatności.
 *
 * Dla czytnika ekranu to zwykła lista uporządkowana z opisem stanu przy
 * kroku bieżącym i przy krokach zamkniętych.
 */
export function PasekKrokow({ aktywny }: { aktywny: 1 | 2 | 3 }) {
  const kroki = tresci.kalendarz.kroki

  return (
    <nav aria-label={tresci.kalendarz.krokiEtykieta}>
      <ol className={style.pasek}>
        {kroki.map((nazwa, indeks) => {
          const numer = indeks + 1
          const stan = numer < aktywny ? 'zrobiony' : numer === aktywny ? 'biezacy' : 'przyszly'

          return (
            <li
              key={nazwa}
              className={`${style.krok} ${style[stan]}`}
              aria-current={stan === 'biezacy' ? 'step' : undefined}
            >
              <span className={style.numer} aria-hidden="true">
                {numer}
              </span>
              <span className={style.nazwa}>{nazwa}</span>
              {stan === 'zrobiony' && <span className="tylko-czytnik">, krok zamknięty</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
