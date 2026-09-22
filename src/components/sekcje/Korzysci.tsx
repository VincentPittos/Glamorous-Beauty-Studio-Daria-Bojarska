import { Medalion } from '@/components/ui/Ikona'
import { korzysci, tresci } from '@/lib/dane'
import style from './Korzysci.module.css'

/**
 * Pasek korzyści pod sekcją główną.
 *
 * Cztery zdania, które odpowiadają na pierwsze pytanie klientki: dlaczego
 * akurat tutaj. Stoi wysoko, zaraz pod hero, bo to jedyne miejsce, w którym
 * czyta jeszcze wszystko.
 */
export function Korzysci() {
  return (
    <section id="korzysci" className="sekcja sekcja--kosc">
      <div className="ramka">
        <h2 className="tylko-czytnik">{tresci.korzysci.naglowek}</h2>

        <ul className={style.siatka}>
          {korzysci.map((kafel) => (
            <li key={kafel.tytul} className={style.kafel}>
              <Medalion nazwa={kafel.ikona} />
              <h3 className={style.tytul}>{kafel.tytul}</h3>
              <p className={style.tekst}>{kafel.tekst}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
