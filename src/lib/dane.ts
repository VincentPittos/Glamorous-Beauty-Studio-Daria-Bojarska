/**
 * Jedno miejsce, przez które komponenty sięgają po treść.
 *
 * Pliki JSON z katalogu src/data można edytować bez dotykania kodu. Typy
 * poniżej pilnują, żeby literówka w nazwie pola wyszła przy budowaniu, a nie
 * dopiero na stronie.
 */
import cennikJson from '@/data/cennik.json'
import faqJson from '@/data/faq.json'
import opinieJson from '@/data/opinie.json'
import portfolioJson from '@/data/portfolio.json'
import salonJson from '@/data/salon.json'
import tresciJson from '@/data/tresci.json'
import uslugiJson from '@/data/uslugi.json'
import type { NazwaIkony } from '@/components/ui/Ikona'

export type Opinia = { autor: string; kiedy: string; tekst: string }

export type PozycjaCennika = { nazwa: string; cena: string }

export type KategoriaCennika = {
  id: string
  nazwa: string
  ikona: string
  dopisek: string | null
  pozycje: PozycjaCennika[]
}

export type Zabieg = { nazwa: string; opis: string }

/** Filar oferty: jeden obszar pracy gabinetu razem z listą zabiegów. */
export type Usluga = {
  id: string
  slug: string
  nazwa: string
  podtytul: string
  dlaKogo: string
  efekt: string
  obraz: string
  alt: string
  ikona: string
  kategoriaCennika: string
  uslugaGhl: string
  zabiegi: Zabieg[]
}

export type ZdjeciePortfolio = {
  id: string
  duze: string
  mini: string
  szerokosc: number
  wysokosc: number
  opis: string
  filar: string
  zrodloNaDysku: string
}

export type Pytanie = { pytanie: string; odpowiedz: string; doPotwierdzenia: boolean }

export type Godzina = { dzien: string; od: string; do: string }

export type Kafel = { ikona: NazwaIkony; tytul: string; tekst: string }

export const tresci = tresciJson
export const salon = salonJson
export const opinie = opinieJson.pozycje as Opinia[]
export const cennik = cennikJson.kategorie as KategoriaCennika[]
export const uslugi = uslugiJson.pozycje as Usluga[]
export const portfolio = portfolioJson.pozycje as ZdjeciePortfolio[]
export const faq = faqJson.pozycje as Pytanie[]
export const korzysci = tresciJson.korzysci.pozycje as Kafel[]
export const kroki = tresciJson.proces.kroki as Kafel[]

/** Godziny otwarcia pokazujemy dopiero wtedy, gdy ktoś je uzupełni. */
export const godziny = salonJson.godziny.pozycje as Godzina[]
export const sąGodziny = godziny.some((g) => g.od !== '' && g.do !== '')

export const adresStrony =
  process.env.NEXT_PUBLIC_ADRES_STRONY ?? 'https://glamorousbeautystudio.pl'

/** Filar po adresie podstrony. Zwraca undefined, gdy adres nie pasuje do niczego. */
export function filarPoSlugu(slug: string): Usluga | undefined {
  return uslugi.find((usluga) => usluga.slug === slug)
}

/**
 * Czy pole jest jeszcze znacznikiem do uzupełnienia.
 *
 * Teksty czekające na dane od Pani Darii mają w sobie {TODO: ...}. Strona
 * nigdy ich nie pokazuje klientce: zamiast nich wchodzi zdanie zastępcze
 * albo pole znika. Dzięki temu niedokończona treść nie trafia na produkcję
 * przez przypadek.
 */
export function czekaNaDane(wartosc: string | null | undefined): boolean {
  return typeof wartosc === 'string' && wartosc.includes('{TODO')
}

/**
 * Ten sam tekst bez znaczników, gdy chcemy pokazać to, co już jest gotowe.
 *
 * Samo wycięcie klamry zostawia po sobie śmieci: podwójne spacje i kropkę
 * wiszącą po kropce, bo znacznik zwykle stoi jako osobne zdanie na końcu
 * akapitu. Dlatego po wycięciu sprzątamy jeszcze spacje przed znakami
 * przestankowymi i powtórzone kropki.
 */
export function bezZnacznikow(wartosc: string): string {
  return wartosc
    .replace(/\{TODO:[^}]*\}/g, '')
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/([.,;:!?])\1+/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()
}
