'use client'

import { useEffect, useState } from 'react'
import { Logo } from '@/components/ui/Logo'
import { PrzyciskLink } from '@/components/ui/Przycisk'
import { tresci } from '@/lib/dane'
import { KOTWICA_REZERWACJI } from '@/lib/ghl'
import style from './Naglowek.module.css'

export function Naglowek() {
  const [przewiniety, ustawPrzewiniety] = useState(false)
  const [otwarte, ustawOtwarte] = useState(false)
  const nawigacja = tresci.nawigacja

  useEffect(() => {
    const przyPrzewijaniu = () => ustawPrzewiniety(window.scrollY > 24)
    przyPrzewijaniu()
    window.addEventListener('scroll', przyPrzewijaniu, { passive: true })
    return () => window.removeEventListener('scroll', przyPrzewijaniu)
  }, [])

  // Otwarte menu zasłania stronę, więc blokujemy przewijanie pod spodem
  // i pozwalamy zamknąć je klawiszem Escape.
  useEffect(() => {
    if (!otwarte) return
    const przyKlawiszu = (zdarzenie: KeyboardEvent) => {
      if (zdarzenie.key === 'Escape') ustawOtwarte(false)
    }
    const poprzedni = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', przyKlawiszu)
    return () => {
      document.body.style.overflow = poprzedni
      document.removeEventListener('keydown', przyKlawiszu)
    }
  }, [otwarte])

  return (
    <>
      <header className={`${style.naglowek} ${przewiniety ? style.przewiniety : ''}`}>
        <div className="ramka">
          <div className={style.rzad}>
            <Logo />

            <nav aria-label="Menu główne">
              <ul className={style.menu}>
                {nawigacja.pozycje.map((pozycja) => (
                  <li key={pozycja.cel} className={style.pozycja}>
                    <a href={pozycja.cel}>{pozycja.etykieta}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <PrzyciskLink href={KOTWICA_REZERWACJI} className={style.przyciskNaglowka}>
              {nawigacja.przycisk}
            </PrzyciskLink>

            <button
              type="button"
              className={style.hamburger}
              aria-expanded={otwarte}
              aria-controls="menu-telefon"
              onClick={() => ustawOtwarte((stan) => !stan)}
            >
              <span className={style.kreski} aria-hidden="true" />
              <span className="tylko-czytnik">
                {otwarte ? nawigacja.menuZamknij : nawigacja.menuOtworz}
              </span>
            </button>
          </div>
        </div>
      </header>

      {otwarte && (
        <div className={style.panel} id="menu-telefon">
          <nav aria-label="Menu na telefonie">
            <ul className={style.panelMenu}>
              {nawigacja.pozycje.map((pozycja) => (
                <li key={pozycja.cel}>
                  <a href={pozycja.cel} onClick={() => ustawOtwarte(false)}>
                    {pozycja.etykieta}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Otwarte menu zasłania dolny pasek, więc przycisk rezerwacji
              powtarzamy tutaj. Ma być pod ręką na każdym ekranie. */}
          <PrzyciskLink
            href={KOTWICA_REZERWACJI}
            pelna
            className={style.przyciskPanelu}
            onClick={() => ustawOtwarte(false)}
          >
            {nawigacja.przycisk}
          </PrzyciskLink>
        </div>
      )}
    </>
  )
}
