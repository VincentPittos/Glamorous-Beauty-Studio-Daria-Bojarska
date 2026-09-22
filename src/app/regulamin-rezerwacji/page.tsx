import type { Metadata } from 'next'
import Link from 'next/link'
import { salon } from '@/lib/dane'
import { zadatekTekstem } from '@/lib/zadatek'
import style from '../dokument.module.css'

export const metadata: Metadata = {
  title: `Regulamin rezerwacji | ${salon.nazwa}`,
  description: `Zasady rezerwacji wizyt i zadatku w gabinecie ${salon.nazwa}.`,
  robots: { index: false, follow: true },
}

/**
 * Regulamin rezerwacji.
 *
 * UWAGA PRAWNA, PRZECZYTAJ PRZED PUBLIKACJĄ. Słowo „zadatek” ma w polskim
 * prawie konkretne skutki, opisane w art. 394 Kodeksu cywilnego: przy
 * odstąpieniu z winy klientki zadatek przepada, a przy odstąpieniu z winy
 * gabinetu wraca w podwójnej wysokości. To coś zupełnie innego niż
 * „zaliczka”, którą zwraca się w całości. Pani Daria musi świadomie wybrać,
 * której instytucji używa, a treść poniżej powinien przejrzeć prawnik.
 *
 * Do czasu tego przeglądu każdy punkt z kwotą, terminem albo skutkiem
 * finansowym stoi tu jako propozycja oznaczona znacznikiem TODO.
 */
export default function RegulaminRezerwacji() {
  return (
    <div className={style.strona}>
      <div className="ramka">
        <div className={style.tresc}>
          <h1>Regulamin rezerwacji</h1>

          <p className={style.uwaga}>
            {'{TODO: treść do weryfikacji}'} Punkty oznaczone znacznikiem TODO to propozycje,
            które musi zatwierdzić Pani Daria. Zasady zadatku warto skonsultować z prawnikiem,
            bo w polskim prawie zadatek i zaliczka niosą różne skutki. Do czasu zatwierdzenia ta
            strona nie jest wiążącym regulaminem.
          </p>

          <h2>Jak rezerwujesz wizytę</h2>
          <p>
            Termin wybierasz w kalendarzu na tej stronie. Po wypełnieniu danych termin jest dla
            Ciebie wstępnie zablokowany, a rezerwacja ma status niepotwierdzonej.
          </p>

          <h2>Zadatek</h2>
          <p>
            Rezerwację potwierdza zadatek w wysokości {zadatekTekstem}. Kwota jest w całości
            odliczana od ceny zabiegu, więc w dniu wizyty dopłacasz różnicę.
          </p>
          <p>
            {'{TODO: potwierdzić, czy przy rezerwacji kilku zabiegów w jednym terminie zadatek jest jeden, czy liczony osobno za każdy zabieg.}'}
          </p>
          <p>
            {'{TODO: potwierdzić czas na opłacenie zadatku. Propozycja: przypomnienie po 2 godzinach, automatyczne zwolnienie terminu po 12 godzinach od rezerwacji.}'}
          </p>

          <h2>Odwołanie i przeniesienie wizyty</h2>
          <p>
            {'{TODO: potwierdzić termin bezpłatnego odwołania. Propozycja: jeśli dasz znać najpóźniej 48 godzin przed wizytą, przeniesiemy zadatek na nowy termin.}'}
          </p>
          <p>
            {'{TODO: potwierdzić, ile razy można przenieść ten sam zadatek i co dzieje się przy drugim przeniesieniu.}'}
          </p>

          <h2>Nieobecność na wizycie</h2>
          <p>
            {'{TODO: potwierdzić skutki nieobecności bez odwołania oraz odwołania w ostatniej chwili.}'}
          </p>

          <h2>Odwołanie wizyty przez gabinet</h2>
          <p>
            {'{TODO: potwierdzić zasady na wypadek choroby albo awarii sprzętu po stronie gabinetu. Propozycja: proponujemy najbliższy wolny termin, a jeśli nie pasuje, zwracamy zadatek w całości.}'}
          </p>

          <h2>Spóźnienie</h2>
          <p>
            {'{TODO: potwierdzić, ile minut spóźnienia gabinet jest w stanie nadrobić i co dzieje się powyżej tego czasu.}'}
          </p>

          <h2>Przeciwwskazania</h2>
          <p>
            Przed częścią zabiegów przeprowadzamy wywiad. Jeśli w jego trakcie okaże się, że
            zabieg nie jest dla Ciebie bezpieczny, powiemy o tym wprost i zaproponujemy inne
            rozwiązanie. {'{TODO: potwierdzić, co dzieje się wtedy z zadatkiem.}'}
          </p>

          <h2>Płatność</h2>
          <p>
            Zadatek przyjmuje operator płatności. Gabinet nie widzi i nie przechowuje danych
            Twojej karty. {'{TODO: nazwa operatora i dostępne metody płatności po wyborze bramki.}'}
          </p>

          <h2>Dane osobowe</h2>
          <p>
            Administratorem danych jest {salon.nazwa}, {salon.adres.ulica},{' '}
            {salon.adres.kodPocztowy} {salon.adres.miasto}.{' '}
            {'{TODO: NIP i adres poczty elektronicznej.}'} Szczegóły opisuje{' '}
            <Link href="/polityka-prywatnosci">polityka prywatności</Link>.
          </p>

          <h2>Kontakt</h2>
          <p>
            W sprawach rezerwacji dzwoń pod numer {salon.telefonDoWyswietlenia}. Jeśli cokolwiek
            w tym regulaminie jest niejasne, zapytaj przed wpłatą zadatku, a nie po niej.
          </p>

          <Link className={style.wstecz} href="/">
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    </div>
  )
}
