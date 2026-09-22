'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Ikona, Medalion, type NazwaIkony } from '@/components/ui/Ikona'
import { PrzyciskLink } from '@/components/ui/Przycisk'
import { bezZnacznikow, czekaNaDane, tresci, uslugi } from '@/lib/dane'
import { linkRezerwacji } from '@/lib/ghl'
import style from './Oferta.module.css'

export function Oferta() {
  const oferta = tresci.oferta
  const tor = useRef<HTMLUListElement>(null)
  const [naPoczatku, ustawNaPoczatku] = useState(true)
  const [naKoncu, ustawNaKoncu] = useState(false)

  const sprawdzPolozenie = useCallback(() => {
    const element = tor.current
    if (!element) return
    const zapas = 4
    ustawNaPoczatku(element.scrollLeft <= zapas)
    ustawNaKoncu(element.scrollLeft + element.clientWidth >= element.scrollWidth - zapas)
  }, [])

  useEffect(() => {
    sprawdzPolozenie()
    const element = tor.current
    if (!element) return
    element.addEventListener('scroll', sprawdzPolozenie, { passive: true })
    window.addEventListener('resize', sprawdzPolozenie)
    return () => {
      element.removeEventListener('scroll', sprawdzPolozenie)
      window.removeEventListener('resize', sprawdzPolozenie)
    }
  }, [sprawdzPolozenie])

  /** Przesuwa tor o szerokość jednej karty w podanym kierunku. */
  const przesun = (kierunek: -1 | 1) => {
    const element = tor.current
    if (!element) return
    const karta = element.querySelector('li')
    const krok = karta ? karta.getBoundingClientRect().width + 20 : element.clientWidth * 0.8
    element.scrollBy({ left: krok * kierunek, behavior: 'smooth' })
  }

  return (
    <section id="oferta" className="sekcja sekcja--ciemna">
      <div className="ramka">
        <div className={style.gora}>
          <div>
            <p className="nadtytul">{oferta.nadtytul}</p>
            <h2>{oferta.naglowek}</h2>
            <p className={style.wstep}>{oferta.wstep}</p>
          </div>

          <div className={style.strzalki}>
            <button
              type="button"
              className={style.strzalka}
              onClick={() => przesun(-1)}
              disabled={naPoczatku}
              aria-label={oferta.poprzednia}
            >
              <Ikona nazwa="lewo" rozmiar={20} />
            </button>
            <button
              type="button"
              className={style.strzalka}
              onClick={() => przesun(1)}
              disabled={naKoncu}
              aria-label={oferta.nastepna}
            >
              <Ikona nazwa="prawo" rozmiar={20} />
            </button>
          </div>
        </div>

        <ul
          className={style.tor}
          ref={tor}
          // Tor jest polem przewijanym, więc dostaje fokus i obsługę strzałek.
          // Bez własnej roli, żeby lista pozostała listą dla czytników ekranu.
          tabIndex={0}
          aria-label={oferta.naglowek}
          onKeyDown={(zdarzenie) => {
            if (zdarzenie.key === 'ArrowRight') {
              zdarzenie.preventDefault()
              przesun(1)
            }
            if (zdarzenie.key === 'ArrowLeft') {
              zdarzenie.preventDefault()
              przesun(-1)
            }
          }}
        >
          {uslugi.map((usluga) => (
            <li key={usluga.id} className={style.karta}>
              <div className={style.obrazek}>
                <Image
                  src={usluga.obraz}
                  alt={usluga.alt}
                  width={800}
                  height={800}
                  sizes="(max-width: 720px) 80vw, 33vw"
                  /*
                    Wszystkie karty ładują się leniwie. W szablonie pierwsze
                    trzy wchodziły od razu, bo oferta stała zaraz pod sekcją
                    główną. Teraz jest czwartą sekcją, więc żadna z nich nie
                    mieści się na pierwszym ekranie, a trzy zdjęcia po
                    kilkadziesiąt kilobajtów zabierały pasmo zdjęciu, które
                    naprawdę widać.
                  */
                  loading="lazy"
                />
              </div>

              <div className={style.trescKarty}>
                <div className={style.tytulKarty}>
                  <Medalion nazwa={usluga.ikona as NazwaIkony} wielkosc="maly" />
                  <h3>{usluga.nazwa}</h3>
                </div>
                <p className={style.podtytul}>{usluga.podtytul}</p>

                <p className={style.dlaKogo}>
                  <span className={style.etykietaDlaKogo}>{oferta.etykietaDlaKogo}</span>
                  {usluga.dlaKogo}
                </p>

                {/* Lista zabiegów bez opisów, bo pełne opisy czekają na
                    podstronie filaru. Karta ma powiedzieć, co tu jest,
                    a nie zastąpić podstronę. */}
                <ul className={style.zabiegi}>
                  {usluga.zabiegi.map((zabieg) => (
                    <li key={zabieg.nazwa}>
                      {czekaNaDane(zabieg.nazwa) ? bezZnacznikow(zabieg.nazwa) : zabieg.nazwa}
                    </li>
                  ))}
                </ul>

                <div className={style.akcje}>
                  <a className={style.link} href={linkRezerwacji(usluga.uslugaGhl)}>
                    {oferta.przyciskKarty}
                    <span className="tylko-czytnik">, {usluga.nazwa}</span>
                  </a>
                  <Link className={style.linkPodstrony} href={`/zabiegi/${usluga.slug}`}>
                    {oferta.przyciskPodstrony}
                    <span className="tylko-czytnik">, {usluga.nazwa}</span>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className={style.dopisek}>
          <p>{oferta.dopisek}</p>
          <PrzyciskLink href={linkRezerwacji('doradztwo')} wariant="obrys">
            {oferta.przyciskDopisku}
          </PrzyciskLink>
        </div>
      </div>
    </section>
  )
}
