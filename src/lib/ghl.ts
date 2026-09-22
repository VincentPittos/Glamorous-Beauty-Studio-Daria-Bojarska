/**
 * Rezerwacje obsługuje w całości kalendarz usług GoHighLevel.
 *
 * Strona nie liczy czasu trwania zabiegów, nie sprawdza dostępności i nie
 * trzyma terminów. Jej zadaniem jest osadzić widżet i, jeśli widżet to
 * obsługuje, wskazać usługę, którą klientka kliknęła.
 */

export const adresKalendarza = process.env.NEXT_PUBLIC_GHL_KALENDARZ_URL ?? ''

export const kalendarzPodlaczony = adresKalendarza.trim().length > 0

/**
 * Adres widżetu z preselekcją usługi. GHL czyta parametry z zapytania, więc
 * dokładamy je do adresu skopiowanego z panelu. Jeśli dany kalendarz nie
 * rozumie parametru, po prostu go pomija i pokazuje pełne menu usług.
 */
export function adresWidzetu(usluga?: string): string {
  if (!kalendarzPodlaczony) return ''
  try {
    const adres = new URL(adresKalendarza)
    if (usluga) adres.searchParams.set('service', usluga)
    return adres.toString()
  } catch {
    return adresKalendarza
  }
}

/** Kotwica, do której prowadzą wszystkie przyciski rezerwacji na stronie. */
export const KOTWICA_REZERWACJI = '#rezerwacja'

/**
 * Link rezerwacji. Nazwa usługi jedzie w adresie, więc da się ją podać
 * dalej i zachować po odświeżeniu strony. Sekcja kontaktu odczytuje ją
 * i podstawia do widżetu oraz do formularza pytania.
 */
export function linkRezerwacji(usluga?: string): string {
  return usluga
    ? `?usluga=${encodeURIComponent(usluga)}${KOTWICA_REZERWACJI}`
    : KOTWICA_REZERWACJI
}
