'use client'

import { useState } from 'react'
import { Ikona } from '@/components/ui/Ikona'
import { czekaNaDane, opinie, salon, tresci, type Opinia } from '@/lib/dane'
import style from './Opinie.module.css'

/** Rozkłada opinie na trzy kolumny, zachowując kolejność z pliku. */
function naKolumny(lista: Opinia[], ile: number): Opinia[][] {
  const kolumny: Opinia[][] = Array.from({ length: ile }, () => [])
  lista.forEach((opinia, indeks) => kolumny[indeks % ile].push(opinia))
  return kolumny
}

/*
  Podpis autorki pokazujemy tylko wtedy, gdy naprawdę go mamy. Dopóki
  w pliku stoi znacznik, opinia wisi bez podpisu, i tak ma być: treść jest
  przepisana z Google dosłownie, a imienia po prostu jeszcze nie znamy.
  Dopisanie czegokolwiek w to miejsce byłoby wymyślaniem opinii.
*/
function Podpis({ opinia }: { opinia: Opinia }) {
  if (czekaNaDane(opinia.autor)) return null

  return (
    <p className={style.autor}>
      {opinia.autor}
      {opinia.kiedy && <span className={style.kiedy}>{opinia.kiedy}</span>}
    </p>
  )
}

function Karta({ opinia }: { opinia: Opinia }) {
  return (
    <li className={style.opinia}>
      <p className={style.tekst}>{opinia.tekst}</p>
      <Podpis opinia={opinia} />
    </li>
  )
}

export function Opinie() {
  const tresc = tresci.opinie
  const [zatrzymana, ustawZatrzymana] = useState(false)
  const kolumny = naKolumny(opinie, 3)
  // Kolumna pierwsza i trzecia jadą w górę, środkowa w dół.
  const czasy = [52, 46, 58]

  return (
    <section id="opinie" className="sekcja sekcja--ciemna">
      <div className="ramka">
        <div className={style.gora}>
          <div>
            <p className="nadtytul">{tresc.nadtytul}</p>
            <h2>{tresc.naglowek}</h2>
            <p className={style.wstep}>{tresc.wstep}</p>
            {/* Ocena pokazuje się dopiero wtedy, gdy ktoś wpisał liczbę opinii.
                Inaczej strona chwaliłaby się oceną, której nie ma z czego wyliczyć. */}
            {salon.ocena.liczbaOpinii > 0 && (
            <div className={style.ocena} style={{ marginTop: 16 }}>
              <span className={style.gwiazdki} aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <Ikona key={i} nazwa="gwiazdka" rozmiar={19} />
                ))}
              </span>
              <span className={style.srednia}>
                {salon.ocena.srednia.toLocaleString('pl-PL', { minimumFractionDigits: 1 })}
              </span>
              <span className={style.liczba}>
                na podstawie {salon.ocena.liczbaOpinii} opinii w Google
              </span>
            </div>
            )}
          </div>

          <a
            className={style.link}
            href={salon.opinieGoogle}
            target="_blank"
            rel="noopener noreferrer"
          >
            {tresc.link}
          </a>
        </div>

        <div
          className={`${style.sciana} ${zatrzymana ? style.zatrzymana : ''}`}
          onMouseEnter={() => ustawZatrzymana(true)}
          onMouseLeave={() => ustawZatrzymana(false)}
          // Dotknięcie też zatrzymuje, bo ruchomego tekstu nie da się przeczytać.
          onTouchStart={() => ustawZatrzymana((stan) => !stan)}
        >
          {kolumny.map((kolumna, indeks) => (
            <div key={indeks} className={style.kolumna}>
              <ul
                className={`${style.tasma} ${indeks === 1 ? style.wDol : style.wGore}`}
                style={{ animationDuration: `${czasy[indeks]}s` }}
              >
                {kolumna.map((opinia) => (
                  <Karta key={opinia.autor + opinia.tekst.slice(0, 16)} opinia={opinia} />
                ))}
                {/* Drugi komplet domyka pętlę. Czytniki ekranu go pomijają. */}
                {kolumna.map((opinia) => (
                  <li
                    key={`kopia-${opinia.autor}${opinia.tekst.slice(0, 16)}`}
                    className={`${style.opinia} ${style.duplikat}`}
                    aria-hidden="true"
                  >
                    <p className={style.tekst}>{opinia.tekst}</p>
                    <Podpis opinia={opinia} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className={style.pauza}>{tresc.pauza}</p>
      </div>
    </section>
  )
}
