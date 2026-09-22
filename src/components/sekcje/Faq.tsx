import { Ikona } from '@/components/ui/Ikona'
import { czekaNaDane, faq, tresci } from '@/lib/dane'
import style from './Faq.module.css'

/**
 * Pytania i odpowiedzi.
 *
 * Na stronę idą wyłącznie odpowiedzi gotowe. Te, które czekają na dane od
 * Pani Darii, mają w pliku znacznik TODO i po prostu się nie pokazują.
 * Ta sama zasada obowiązuje w danych strukturalnych, więc FAQPage zgadza
 * się co do pytania z tym, co widać na stronie.
 */
export function Faq() {
  const pytania = faq.filter((pozycja) => !czekaNaDane(pozycja.odpowiedz))

  return (
    <section id="faq" className="sekcja sekcja--kosc">
      <div className="ramka">
        <div className={style.uklad}>
          <div>
            <p className="nadtytul">{tresci.faq.nadtytul}</p>
            <h2>{tresci.faq.naglowek}</h2>
          </div>

          <div className={style.lista}>
            {pytania.map((pozycja) => (
              <details key={pozycja.pytanie} className={style.pozycja}>
                <summary className={style.pytanie}>
                  <span className={style.tekstPytania}>{pozycja.pytanie}</span>
                  <span className={style.znacznik} aria-hidden="true">
                    <Ikona nazwa="plus" rozmiar={20} />
                  </span>
                </summary>
                <p className={style.odpowiedz}>{pozycja.odpowiedz}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
