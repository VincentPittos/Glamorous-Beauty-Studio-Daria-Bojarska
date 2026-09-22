'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Ikona } from '@/components/ui/Ikona'
import { portfolio, tresci } from '@/lib/dane'
import style from './Portfolio.module.css'

/** Opis zdjęcia albo neutralna alternatywa, dopóki opisów nie ma w pliku. */
function opisZdjecia(indeks: number) {
  const zdjecie = portfolio[indeks]
  if (zdjecie.opis.trim()) return zdjecie.opis
  return tresci.portfolio.altOgolny
    .replace('{nr}', String(indeks + 1))
    .replace('{razem}', String(portfolio.length))
}

/**
 * Podpis pod powiększeniem. Dopóki opisy są puste, wystarczy sam licznik,
 * bo alternatywa tekstowa i tak niesie tę samą informację.
 */
function podpisZdjecia(indeks: number) {
  const opis = portfolio[indeks].opis.trim()
  const licznik = `${indeks + 1} z ${portfolio.length}`
  return opis ? `${opis} (${licznik})` : `Zdjęcie ${licznik}`
}

export function Portfolio() {
  const tresc = tresci.portfolio
  const [otwarte, ustawOtwarte] = useState<number | null>(null)
  const przyciskZamknij = useRef<HTMLButtonElement>(null)
  const ostatniKafel = useRef<HTMLButtonElement | null>(null)
  const dotyk = useRef<number | null>(null)

  const zamknij = useCallback(() => {
    ustawOtwarte(null)
    // Fokus wraca na kafel, z którego klientka weszła w powiększenie.
    ostatniKafel.current?.focus()
  }, [])

  const przesun = useCallback((kierunek: -1 | 1) => {
    ustawOtwarte((biezace) => {
      if (biezace === null) return biezace
      return (biezace + kierunek + portfolio.length) % portfolio.length
    })
  }, [])

  useEffect(() => {
    if (otwarte === null) return
    przyciskZamknij.current?.focus()

    const przyKlawiszu = (zdarzenie: KeyboardEvent) => {
      if (zdarzenie.key === 'Escape') zamknij()
      if (zdarzenie.key === 'ArrowRight') przesun(1)
      if (zdarzenie.key === 'ArrowLeft') przesun(-1)
    }
    const poprzedni = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', przyKlawiszu)
    return () => {
      document.body.style.overflow = poprzedni
      document.removeEventListener('keydown', przyKlawiszu)
    }
  }, [otwarte, zamknij, przesun])

  return (
    <section id="portfolio" className="sekcja sekcja--krem">
      <div className="ramka">
        <p className="nadtytul">{tresc.nadtytul}</p>
        <h2>{tresc.naglowek}</h2>
        <p className={style.wstep}>{tresc.wstep}</p>

        <ul className={style.galeria}>
          {portfolio.map((zdjecie, indeks) => (
            <li
              key={zdjecie.id}
              className={`${style.pozycja} ${indeks === 0 ? style.wiodacy : ''}`}
            >
              <button
                type="button"
                className={style.kafel}
                onClick={(zdarzenie) => {
                  ostatniKafel.current = zdarzenie.currentTarget
                  ustawOtwarte(indeks)
                }}
              >
                <Image
                  src={zdjecie.mini}
                  alt={opisZdjecia(indeks)}
                  width={zdjecie.szerokosc}
                  height={zdjecie.wysokosc}
                  sizes="(max-width: 620px) 50vw, (max-width: 1000px) 34vw, 250px"
                  loading="lazy"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {otwarte !== null && (
        <div
          className={style.naklada}
          role="dialog"
          aria-modal="true"
          aria-label={tresc.naglowek}
          onClick={(zdarzenie) => {
            if (zdarzenie.target === zdarzenie.currentTarget) zamknij()
          }}
          onTouchStart={(zdarzenie) => {
            dotyk.current = zdarzenie.changedTouches[0]?.clientX ?? null
          }}
          onTouchEnd={(zdarzenie) => {
            const start = dotyk.current
            const koniec = zdarzenie.changedTouches[0]?.clientX
            dotyk.current = null
            if (start === null || koniec === undefined) return
            const roznica = koniec - start
            // Próg 48 pikseli, żeby zwykłe stuknięcie nie przewijało zdjęć.
            if (roznica > 48) przesun(-1)
            if (roznica < -48) przesun(1)
          }}
        >
          <button
            type="button"
            className={style.zamknij}
            onClick={zamknij}
            ref={przyciskZamknij}
            aria-label={tresc.zamknij}
          >
            <Ikona nazwa="zamknij" rozmiar={20} />
          </button>

          <div className={style.podglad}>
            <Image
              src={portfolio[otwarte].duze}
              alt={opisZdjecia(otwarte)}
              width={portfolio[otwarte].szerokosc}
              height={portfolio[otwarte].wysokosc}
              sizes="100vw"
              /* Powiekszenie otwiera sie na klikniecie, wiec zdjecie ma sie
                 pojawic natychmiast, a nie czekac na przewijanie. Prop
                 priority jest wycofany od Next.js 16. */
              loading="eager"
              fetchPriority="high"
            />
            <p className={style.podpis}>{podpisZdjecia(otwarte)}</p>

            <div className={style.sterowanie}>
              <button
                type="button"
                className={style.krok}
                onClick={() => przesun(-1)}
                aria-label={tresc.poprzednie}
              >
                <Ikona nazwa="lewo" rozmiar={20} />
              </button>
              <button
                type="button"
                className={style.krok}
                onClick={() => przesun(1)}
                aria-label={tresc.nastepne}
              >
                <Ikona nazwa="prawo" rozmiar={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
