import Link from 'next/link'
import { Fragment } from 'react'
import { Ikona } from '@/components/ui/Ikona'
import { Logo } from '@/components/ui/Logo'
import { godziny, salon, sąGodziny, tresci } from '@/lib/dane'
import style from './Stopka.module.css'

export function Stopka() {
  const stopka = tresci.stopka

  return (
    <footer className={style.stopka}>
      <div className="ramka">
        <div className={style.siatka}>
          <div>
            <Logo />
            <p className={style.opis}>{stopka.opis}</p>
          </div>

          <div>
            <h2 className={style.tytul}>{stopka.kontakt}</h2>
            <ul className={style.lista}>
              <li>
                <a href={`tel:${salon.telefon.replace(/\s/g, '')}`}>
                  <Ikona nazwa="telefon" rozmiar={18} />
                  {salon.telefonDoWyswietlenia}
                </a>
              </li>
              <li>
                <a href={salon.nawigacja} target="_blank" rel="noopener noreferrer">
                  <Ikona nazwa="lokalizacja" rozmiar={18} />
                  <span>
                    {salon.adres.ulica}
                    <br />
                    {salon.adres.kodPocztowy} {salon.adres.miasto}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={style.tytul}>{stopka.godziny}</h2>
            {sąGodziny ? (
              /* Lista definicji w siatce, żeby dni i godziny stały w dwóch
                 równych kolumnach. Przy zwykłej liście najdłuższa nazwa dnia
                 łamała wiersz i ten jeden rząd wypadał z rytmu. */
              <dl className={style.godziny}>
                {godziny.map((godzina) => (
                  <Fragment key={godzina.dzien}>
                    <dt className={style.dzien}>{godzina.dzien}</dt>
                    <dd className={style.zakres}>
                      {godzina.od && godzina.do
                        ? `${godzina.od} do ${godzina.do}`
                        : tresci.kontakt.zamkniete}
                    </dd>
                  </Fragment>
                ))}
              </dl>
            ) : (
              <p className={style.lista}>{tresci.kontakt.godzinyBrak}</p>
            )}
          </div>

          <div>
            {/* Profile pokazujemy dopiero wtedy, gdy mamy adresy. Odnośnik
                prowadzący donikąd jest gorszy niż jego brak. */}
            {(salon.instagram || salon.facebook) && (
              <>
                <h2 className={style.tytul}>{stopka.obserwuj}</h2>
                <ul className={style.lista}>
                  {salon.instagram && (
                    <li>
                      <a href={salon.instagram} target="_blank" rel="noopener noreferrer">
                        <Ikona nazwa="instagram" rozmiar={18} />
                        Instagram
                      </a>
                    </li>
                  )}
                  {salon.facebook && (
                    <li>
                      <a href={salon.facebook} target="_blank" rel="noopener noreferrer">
                        <Ikona nazwa="facebook" rozmiar={18} />
                        Facebook
                      </a>
                    </li>
                  )}
                </ul>
              </>
            )}

            <h2 className={style.tytul}>{stopka.dokumenty}</h2>
            <ul className={style.lista}>
              <li>
                <Link href="/regulamin-rezerwacji">{tresci.kontakt.regulaminLink}</Link>
              </li>
              <li>
                <Link href="/polityka-prywatnosci">{tresci.kontakt.politykaLink}</Link>
              </li>
              <li>
                <Link href="/cookies">Pliki cookie</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={style.dol}>
          <span>
            © {new Date().getFullYear()} {salon.nazwa}. {stopka.prawa}
          </span>
          <span>{stopka.ciasteczka}</span>
        </div>
      </div>
    </footer>
  )
}
