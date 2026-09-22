import type { Metadata } from 'next'
import Link from 'next/link'
import { salon } from '@/lib/dane'
import style from '../dokument.module.css'

export const metadata: Metadata = {
  title: `Pliki cookie | ${salon.nazwa}`,
  description: 'Jakie pliki cookie zakłada ta strona i po co.',
  robots: { index: false, follow: true },
}

export default function Cookies() {
  return (
    <div className={style.strona}>
      <div className="ramka">
        <div className={style.tresc}>
          <h1>Pliki cookie</h1>

          <p>
            Ta strona nie prowadzi statystyk, nie ma na sobie pikseli reklamowych i nie śledzi
            Cię po wyjściu. Pliki cookie zakładają tylko te narzędzia, bez których rezerwacja by
            nie zadziałała.
          </p>

          <h2>Co i po co</h2>
          <ul>
            <li>
              <strong>Kalendarz rezerwacji.</strong> Zapamiętuje stan rezerwacji, którą właśnie
              wypełniasz, żeby wybrany termin nie znikał przy przejściu na kolejny krok.
            </li>
            <li>
              <strong>Bramka płatności.</strong> Pilnuje bezpieczeństwa transakcji w czasie
              wpłaty zadatku.
            </li>
            <li>
              <strong>Pamięć karty przeglądarki.</strong> Podsumowanie rezerwacji trzymamy
              w pamięci sesji Twojej przeglądarki. Znika, kiedy zamkniesz kartę, i nigdy nie
              wychodzi poza Twoje urządzenie.
            </li>
          </ul>

          <h2>Jeśli je zablokujesz</h2>
          <p>
            Strona nadal się wyświetli i przeczytasz wszystko, co na niej jest. Rezerwacja online
            może przestać działać poprawnie. W takim wypadku zadzwoń pod numer{' '}
            {salon.telefonDoWyswietlenia}, umówimy Cię ręcznie.
          </p>

          {/*
            UWAGA DLA WDRAŻAJĄCEGO. Jeśli na stronę wejdzie Google Analytics,
            Meta Pixel albo inne narzędzie analityczne, trzeba dołożyć baner
            zgody, a skrypty wczytywać dopiero po jej wyrażeniu, nigdy przed.
            Wtedy też trzeba przepisać akapit poniżej, bo przestanie być
            prawdziwy. Notatka siedzi w kodzie, a nie w treści, bo klientce
            nic nie mówi.
          */}
          <h2>Narzędzia analityczne</h2>
          <p>
            Dziś nie ma tu żadnego. Gdyby doszło, zobaczysz pytanie o zgodę,
            zanim cokolwiek się wczyta.
          </p>

          <Link className={style.wstecz} href="/">
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    </div>
  )
}
