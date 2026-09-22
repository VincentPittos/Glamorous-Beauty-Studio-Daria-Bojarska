import Link from 'next/link'
import { salon } from '@/lib/dane'
import style from './Logo.module.css'

/**
 * Logotyp: sygnet z diamentem i wordmark złożony z tekstu.
 *
 * Tekst w kroju z --kroj-ryte, ze złotym gradientem, zostaje ostry na każdym
 * ekranie, da się go przeczytać czytnikiem i waży zero kilobajtów. Napisy
 * bierze z salon.json, z pola logotyp.
 *
 * UWAGA: diament jest rysowany kreską i jest geometrią zastępczą. Po
 * otrzymaniu logo marki w wektorze podmień zawartość tego komponentu na
 * plik SVG, zostawiając ten sam link i etykietę dla czytników ekranu.
 */
function Sygnet() {
  return (
    <svg
      className={style.sygnet}
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2.8 21 9.4 12 21.2 3 9.4Z" />
      <path d="M3 9.4h18M8.4 9.4 12 2.8l3.6 6.6M8.4 9.4 12 21.2l3.6-11.8" />
    </svg>
  )
}

export function Logo({ jakoLink = true }: { jakoLink?: boolean }) {
  const zawartosc = (
    <>
      <Sygnet />
      <span className={style.nazwisko}>{salon.logotyp.nazwa}</span>
      <span className={style.podpis}>{salon.logotyp.podpis}</span>
    </>
  )

  if (!jakoLink) {
    return <span className={style.logo}>{zawartosc}</span>
  }

  /*
    Bez aria-label. Etykieta zastepowala widoczny napis inna trescia, przez
    co osoba sterujaca glosem mowila "Glamorous" i nic sie nie dzialo, bo
    nazwa dostepna brzmiala inaczej. Teraz nazwa to widoczny tekst plus
    dopisek czytany wylacznie przez czytnik ekranu.
  */
  return (
    <Link href="/" className={style.logo}>
      {zawartosc}
      <span className="tylko-czytnik">, strona główna</span>
    </Link>
  )
}
