/**
 * Zadatek 50 zł, który potwierdza rezerwację.
 *
 * ŚCIEŻKA KLIENTKI (wariant B z ustaleń, czyli rezerwacja, płatność,
 * potwierdzenie):
 *
 *   1. Kalendarz na stronie głównej zbiera termin, dane i zgody.
 *   2. Trasa /api/rezerwacja zakłada wizytę w GoHighLevel jako
 *      NIEPOTWIERDZONĄ i zwraca jej identyfikator.
 *   3. Przeglądarka przechodzi na /zadatek, gdzie klientka płaci.
 *   4. Operator płatności woła /api/platnosc/webhook. Dopiero ten webhook,
 *      po sprawdzeniu podpisu, przestawia wizytę na POTWIERDZONĄ.
 *
 * Czego tu nie ma i być nie może: potwierdzania rezerwacji na podstawie
 * tego, że klientka wróciła na stronę z parametrem w adresie. Adres da się
 * wpisać ręcznie, podpisu webhooka nie.
 *
 * Wariant A, czyli natywna płatność w kalendarzu GHL, jest lepszy i jeśli
 * kalendarz Pani Darii ją udźwignie razem z BLIK-iem, wystarczy ustawić
 * NEXT_PUBLIC_GHL_KALENDARZ_URL. Cała ta ścieżka wtedy nie wchodzi w grę,
 * bo widżet GHL obsługuje płatność u siebie.
 */
import { salon } from './dane'

export const KWOTA_ZADATKU = salon.zadatek.kwota
export const WALUTA_ZADATKU = salon.zadatek.waluta

/** Zadatek zapisany tak, jak ma się pokazać w tekście. */
export const zadatekTekstem = `${KWOTA_ZADATKU} ${WALUTA_ZADATKU}`

/**
 * Link do zapłaty zadatku. Link płatności z GoHighLevel albo ze Stripe,
 * z kwotą ustawioną po stronie operatora, żeby nie dało się jej podmienić
 * w adresie.
 */
export const linkPlatnosci = process.env.NEXT_PUBLIC_LINK_PLATNOSCI_ZADATEK ?? ''

export const platnoscPodlaczona = linkPlatnosci.trim().length > 0

/** Klucz, pod którym przeglądarka przenosi podsumowanie na stronę zadatku. */
export const KLUCZ_REZERWACJI = 'gbs-rezerwacja'

export type SzkicRezerwacji = {
  /** Identyfikator wizyty zwrócony przez GHL. Pusty, gdy GHL nie jest podpięty. */
  id: string
  imie: string
  usluga: string
  uslugaNazwa: string
  termin: string
  /** Termin w formacie ISO, potrzebny do pliku .ics na stronie potwierdzenia. */
  terminIso: string
}

/**
 * Podsumowanie rezerwacji trzymamy w sessionStorage, a nie w adresie.
 *
 * W adresie byłoby widoczne w historii przeglądarki i w logach serwera,
 * a to imię i godzina wizyty konkretnej osoby. sessionStorage znika razem
 * z kartą i nie wychodzi poza przeglądarkę klientki.
 *
 * Odczytem zajmuje się hak useSzkicRezerwacji z pliku szkic-rezerwacji.ts,
 * bo komponenty muszą czytać tę pamięć tak, jak React czyta źródła spoza
 * siebie.
 */
export function zapiszSzkic(szkic: SzkicRezerwacji): void {
  try {
    sessionStorage.setItem(KLUCZ_REZERWACJI, JSON.stringify(szkic))
  } catch {
    // Tryb prywatny albo zablokowane dane stron. Strona zadatku pokaże
    // wtedy prośbę o powrót do kalendarza, zamiast się wysypać.
  }
}

export function wyczyscSzkic(): void {
  try {
    sessionStorage.removeItem(KLUCZ_REZERWACJI)
  } catch {
    // Nie ma czego czyścić.
  }
}

export const SCIEZKA_ZADATKU = '/zadatek'
export const SCIEZKA_POTWIERDZENIA = '/rezerwacja-potwierdzona'
