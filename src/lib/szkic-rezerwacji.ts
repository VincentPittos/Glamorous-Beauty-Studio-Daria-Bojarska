'use client'

import { useSyncExternalStore } from 'react'
import { KLUCZ_REZERWACJI, type SzkicRezerwacji } from './zadatek'

/**
 * Odczyt szkicu rezerwacji z pamięci przeglądarki, zrobiony tak, jak React
 * czyta źródła spoza siebie.
 *
 * Kusi, żeby zrobić to prościej, czyli useEffect plus useState. To jednak
 * setState wywołany w efekcie, więc React renderuje stronę dwa razy przy
 * każdym wejściu, a kompilator Reacta słusznie się na to skarży.
 * useSyncExternalStore czyta wprost ze źródła i renderuje raz.
 *
 * Migawka musi zwracać STABILNY obiekt, inaczej każde porównanie wypada
 * negatywnie i React wpada w pętlę renderowania. Dlatego trzymamy zarówno
 * surowy zapis, jak i wynik jego przetworzenia, i przetwarzamy go ponownie
 * dopiero wtedy, gdy zmienił się tekst w pamięci.
 */

let ostatniZapis: string | null = null
let ostatniSzkic: SzkicRezerwacji | null = null
let czytano = false

function surowo(): string | null {
  try {
    return sessionStorage.getItem(KLUCZ_REZERWACJI)
  } catch {
    // Tryb prywatny albo zablokowane dane stron.
    return null
  }
}

function przetworz(zapis: string | null): SzkicRezerwacji | null {
  if (!zapis) return null
  try {
    const dane = JSON.parse(zapis) as Partial<SzkicRezerwacji>
    if (!dane.termin || !dane.imie) return null
    return {
      id: dane.id ?? '',
      imie: dane.imie,
      usluga: dane.usluga ?? '',
      uslugaNazwa: dane.uslugaNazwa ?? '',
      termin: dane.termin,
      terminIso: dane.terminIso ?? '',
    }
  } catch {
    return null
  }
}

function migawka(): SzkicRezerwacji | null {
  const zapis = surowo()
  if (!czytano || zapis !== ostatniZapis) {
    ostatniZapis = zapis
    ostatniSzkic = przetworz(zapis)
    czytano = true
  }
  return ostatniSzkic
}

/** Na serwerze nie ma pamięci przeglądarki, więc nie ma też rezerwacji. */
function migawkaSerwera(): SzkicRezerwacji | null {
  return null
}

/**
 * sessionStorage nie zgłasza zmian we własnej karcie, a zdarzenie storage
 * przychodzi wyłącznie z innych kart. Tutaj wystarczy to w zupełności:
 * szkic zapisuje kalendarz przed przejściem na kolejną stronę, więc na
 * stronie zadatku i potwierdzenia już się nie zmienia.
 */
function subskrybuj(zmiana: () => void): () => void {
  window.addEventListener('storage', zmiana)
  return () => window.removeEventListener('storage', zmiana)
}

/*
  NAZWY PO ANGIELSKU, WYJĄTEK W CAŁYM PROJEKCIE. React rozpoznaje własne
  haki po przedrostku use i pilnuje tego regułą rules-of-hooks. Polska nazwa
  rozbroiłaby sprawdzanie kolejności wywołań, a to najczęstsze źródło
  trudnych do znalezienia błędów w komponentach.
*/
export function useSzkicRezerwacji(): SzkicRezerwacji | null {
  return useSyncExternalStore(subskrybuj, migawka, migawkaSerwera)
}

/**
 * Czy strona jest już nawodniona w przeglądarce.
 *
 * Bez tego ekran zadatku mignąłby komunikatem o braku rezerwacji: podczas
 * nawadniania React bierze migawkę serwera, która zawsze zwraca pustkę.
 */
const brakSubskrypcji = () => () => {}

export function useNawodnienie(): boolean {
  return useSyncExternalStore(
    brakSubskrypcji,
    () => true,
    () => false,
  )
}
