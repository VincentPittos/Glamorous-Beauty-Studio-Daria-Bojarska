'use client'

import Link from 'next/link'
import { Ikona, Medalion } from '@/components/ui/Ikona'
import { PasekKrokow } from '@/components/ui/PasekKrokow'
import { PrzyciskLink } from '@/components/ui/Przycisk'
import { salon, tresci } from '@/lib/dane'
import { KOTWICA_REZERWACJI } from '@/lib/ghl'
import { useNawodnienie, useSzkicRezerwacji } from '@/lib/szkic-rezerwacji'
import { linkPlatnosci, platnoscPodlaczona, zadatekTekstem } from '@/lib/zadatek'
import style from './zadatek.module.css'

/**
 * Krok drugi rezerwacji: zadatek.
 *
 * Wizyta jest już w GHL jako niepotwierdzona, a termin wstępnie zablokowany.
 * Ta strona ma tylko doprowadzić klientkę do płatności i nic nie potwierdza.
 * Potwierdzeniem zajmuje się webhook w /api/platnosc/webhook, po sprawdzeniu
 * podpisu, bo powrót na stronę z parametrem w adresie niczego nie dowodzi.
 *
 * Podsumowanie czytamy z sessionStorage, więc dopiero w przeglądarce.
 * Do tego czasu pokazujemy szkielet, a nie pustą stronę z komunikatem
 * o braku rezerwacji, który mignąłby każdej klientce.
 */
export function EkranZadatku() {
  const tresc = tresci.zadatek
  const wczytane = useNawodnienie()
  const szkic = useSzkicRezerwacji()

  return (
    <section className="sekcja sekcja--krem">
      <div className="ramka">
        <div className={style.uklad}>
          <PasekKrokow aktywny={2} />

          <p className="nadtytul">{tresc.nadtytul}</p>
          <h1 className={style.naglowek}>{tresc.naglowek}</h1>
          <p className={style.wstep}>{tresc.wstep}</p>

          {!wczytane && <div className={style.szkielet} aria-hidden="true" />}

          {wczytane && !szkic && (
            <div className={style.brak}>
              <p>{tresc.brakDanych}</p>
              <PrzyciskLink href={`/${KOTWICA_REZERWACJI}`} wariant="atrament">
                {tresc.powrot}
              </PrzyciskLink>
            </div>
          )}

          {wczytane && szkic && (
            <>
              <div className={style.podsumowanie}>
                <h2 className={style.tytulPodsumowania}>{tresc.podsumowanieTytul}</h2>

                <dl className={style.dane}>
                  <dt>{tresc.etykietaImie}</dt>
                  <dd>{szkic.imie}</dd>

                  {szkic.uslugaNazwa && (
                    <>
                      <dt>{tresc.etykietaUsluga}</dt>
                      <dd>{szkic.uslugaNazwa}</dd>
                    </>
                  )}

                  <dt>{tresc.etykietaTermin}</dt>
                  <dd>{szkic.termin}</dd>

                  <dt>{tresc.etykietaKwota}</dt>
                  <dd className={style.kwota}>{zadatekTekstem}</dd>
                </dl>
              </div>

              {platnoscPodlaczona ? (
                <a className={style.zaplac} href={linkPlatnosci}>
                  {tresc.przycisk}
                </a>
              ) : (
                /* Bez adresu płatności nie udajemy działającego przycisku.
                   Klientka dostaje telefon, a nie ślepy guzik. */
                <p className={style.brakLinku} role="status">
                  {tresc.brakLinku}
                </p>
              )}

              <p className={style.metody}>
                <Medalion nazwa="zadatek" wielkosc="maly" />
                {tresc.metody}
              </p>

              <ul className={style.zapewnienia}>
                <li>
                  <Ikona nazwa="tarcza" rozmiar={19} />
                  {tresc.bezpieczenstwo}
                </li>
                <li>
                  <Ikona nazwa="kalendarz" rozmiar={19} />
                  {tresc.regulamin}{' '}
                  <Link href="/regulamin-rezerwacji">{tresci.kontakt.regulaminLink}</Link>
                </li>
                <li>
                  <Ikona nazwa="telefon" rozmiar={19} />
                  {tresc.pomoc}{' '}
                  <a href={`tel:${salon.telefon.replace(/\s/g, '')}`}>
                    {salon.telefonDoWyswietlenia}
                  </a>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
