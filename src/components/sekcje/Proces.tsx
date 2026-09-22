import { Medalion } from '@/components/ui/Ikona'
import { Ornament } from '@/components/ui/Ornament'
import { kroki, tresci } from '@/lib/dane'
import style from './Proces.module.css'

/**
 * Jak wygląda wizyta, krok po kroku.
 *
 * Sekcja stoi przed cennikiem i przed rezerwacją, bo zdejmuje najczęstszy
 * opór: klientka nie wie, co się wydarzy po kliknięciu przycisku. Zadatek
 * jest tu opisany wprost, a nie schowany na końcu ścieżki.
 */
export function Proces() {
  const proces = tresci.proces

  return (
    <section id="jak-wyglada-wizyta" className="sekcja sekcja--krem sekcja--ozdobna">
      <Ornament polozenie="prawy-gorny" />

      <div className="ramka">
        <p className="nadtytul">{proces.nadtytul}</p>
        <h2>{proces.naglowek}</h2>
        <p className={style.wstep}>{proces.wstep}</p>

        <ol className={style.lista}>
          {kroki.map((krok, indeks) => (
            <li key={krok.tytul} className={style.krok}>
              <span className={style.numer} aria-hidden="true">
                {indeks + 1}
              </span>
              <Medalion nazwa={krok.ikona} />
              <h3 className={style.tytul}>{krok.tytul}</h3>
              <p className={style.tekst}>{krok.tekst}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
