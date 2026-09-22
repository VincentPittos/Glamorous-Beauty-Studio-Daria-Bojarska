import type { Metadata } from 'next'
import Link from 'next/link'
import { salon } from '@/lib/dane'
import style from '../dokument.module.css'

export const metadata: Metadata = {
  title: `Polityka prywatności | ${salon.nazwa}`,
  description: `Jak gabinet ${salon.nazwa} przetwarza dane osobowe klientek.`,
  robots: { index: false, follow: true },
}

export default function PolitykaPrywatnosci() {
  return (
    <div className={style.strona}>
      <div className="ramka">
        <div className={style.tresc}>
          <h1>Polityka prywatności</h1>

          <p className={style.uwaga}>
            {'{TODO: treść do weryfikacji}'} Dokument wymaga uzupełnienia przed publikacją:
            potrzebna jest pełna nazwa działalności, numer NIP oraz adres poczty elektronicznej,
            pod którym klientki mogą zgłaszać sprawy dotyczące swoich danych. Treść opisuje to,
            jak faktycznie działa ta strona, ale nie jest poradą prawną. Przed publikacją niech
            przejrzy ją ktoś, kto zna przepisy.
          </p>

          <h2>Kto odpowiada za Twoje dane</h2>
          <p>
            Administratorem danych jest {salon.nazwa}, {salon.adres.ulica},{' '}
            {salon.adres.kodPocztowy} {salon.adres.miasto}. Kontakt telefoniczny:{' '}
            {salon.telefonDoWyswietlenia}.
          </p>

          <h2>Jakie dane zbieramy</h2>
          <ul>
            <li>
              Formularz pytania: imię, numer telefonu, wybrany zabieg oraz treść wiadomości, którą
              wpiszesz.
            </li>
            <li>
              Rezerwacja wizyty: dane, które podajesz w kalendarzu rezerwacji, czyli imię, numer
              telefonu, wybrany zabieg i termin, a także zgody, które zaznaczasz przy rezerwacji.
            </li>
            <li>
              Zadatek: informację o tym, że wpłata doszła, razem z jej kwotą i identyfikatorem
              transakcji od operatora płatności. Danych Twojej karty nie widzimy i nie
              przechowujemy.
            </li>
          </ul>

          <h2>Po co nam te dane</h2>
          <p>
            Używamy ich wyłącznie po to, żeby odpowiedzieć na Twoje pytanie, umówić wizytę,
            rozliczyć zadatek, przypomnieć o terminie i przeprowadzić zabieg. Nie wysyłamy reklam
            osobom, które się na to nie zgodziły, i nie sprzedajemy danych nikomu.
          </p>
          <p>
            Zgoda na wiadomości o wolnych terminach i promocjach jest dobrowolna i domyślnie
            odznaczona. Możesz ją wycofać w każdej chwili, a rezerwacja nadal będzie działać tak
            samo.
          </p>

          <h2>Komu je przekazujemy</h2>
          <ul>
            <li>
              GoHighLevel, czyli system, w którym prowadzimy kalendarz wizyt i zgłoszenia z
              formularza.
            </li>
            <li>
              Operator płatności, który przyjmuje zadatek.{' '}
              {'{TODO: nazwa operatora po wyborze bramki płatności}'}
            </li>
            <li>Firma utrzymująca tę stronę na swoich serwerach.</li>
          </ul>
          <p>
            Obie firmy przetwarzają dane na nasze zlecenie i wyłącznie w zakresie potrzebnym do
            działania rezerwacji.
          </p>

          <h2>Jak długo je trzymamy</h2>
          <p>
            Zgłoszenia z formularza trzymamy do czasu załatwienia sprawy, a dane o wizytach i
            wpłaconych zadatkach tak długo, jak wymagają tego przepisy o dokumentacji i
            rozliczeniach.
          </p>

          <h2>Twoje prawa</h2>
          <p>
            Masz prawo wglądu w swoje dane, ich poprawienia, usunięcia, ograniczenia
            przetwarzania, przeniesienia oraz sprzeciwu wobec przetwarzania. Możesz też złożyć
            skargę do Prezesa Urzędu Ochrony Danych Osobowych. Żeby skorzystać z tych praw,
            zadzwoń pod numer {salon.telefonDoWyswietlenia}.
          </p>

          <h2>Pliki cookie</h2>
          <p>
            Sama strona nie zakłada plików cookie do śledzenia ani do statystyk. Pliki zakłada
            osadzony kalendarz rezerwacji i bramka płatności, po to, żeby zapamiętać stan
            rezerwacji, którą właśnie wypełniasz. Jeśli zablokujesz je w przeglądarce, rezerwacja
            może nie działać poprawnie, a wizytę umówisz wtedy telefonicznie. Więcej piszemy na
            stronie <Link href="/cookies">Pliki cookie</Link>.
          </p>

          <h2>Opinie</h2>
          <p>
            Opinie publikowane na stronie pochodzą z wizytówki Google gabinetu. Publikujemy je
            w całości, bez zmian w treści, razem z podpisem autorki, tak jak widnieją w Google.
          </p>

          <Link className={style.wstecz} href="/">
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    </div>
  )
}
