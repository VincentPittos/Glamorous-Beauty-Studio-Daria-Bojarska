import Image from 'next/image'
import { PrzyciskLink } from '@/components/ui/Przycisk'
import { Ornament } from '@/components/ui/Ornament'
import { czekaNaDane, tresci } from '@/lib/dane'
import { KOTWICA_REZERWACJI } from '@/lib/ghl'
import style from './ONas.module.css'

export function ONas() {
  const oNas = tresci.oNas

  return (
    <section id="o-nas" className="sekcja sekcja--kosc sekcja--ozdobna">
      <Ornament polozenie="lewy-dolny" />

      <div className="ramka">
        <div className={style.siatka}>
          <div className={style.ramkaZdjecia}>
            <Image
              src="/images/o-nas/wlascicielka.webp"
              alt={oNas.altZdjecia}
              width={1000}
              height={1250}
              sizes="(max-width: 860px) 90vw, 420px"
              className={style.zdjecie}
            />
          </div>

          <div className={style.tekst}>
            <p className="nadtytul">{oNas.nadtytul}</p>
            <h2 className={style.naglowek}>{oNas.naglowek}</h2>
            {oNas.akapity.map((akapit) => (
              <p key={akapit.slice(0, 32)}>{akapit}</p>
            ))}

            {/* Podpis odręczny, jedyny taki na stronie poza sekcją główną.
                Imię i nazwisko stoi też w treści sekcji, więc nikt nie traci
                informacji, jeśli nie rozczyta tego kroju. */}
            <p className={`odrecznie ${style.podpis}`} aria-hidden="true">
              {oNas.podpis}
            </p>

            {/* Akapit o doświadczeniu czeka na dane od Pani Darii. Do tego
                czasu nie renderujemy go wcale, zamiast pokazywać znacznik. */}
            {!czekaNaDane(oNas.todo) && <p>{oNas.todo}</p>}

            <PrzyciskLink href={KOTWICA_REZERWACJI} wariant="atrament" className={style.przycisk}>
              {oNas.przycisk}
            </PrzyciskLink>
          </div>
        </div>
      </div>
    </section>
  )
}
