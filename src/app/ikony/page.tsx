import type { Metadata } from 'next'
import { Ikona, Medalion, type NazwaIkony } from '@/components/ui/Ikona'
import { Ornament } from '@/components/ui/Ornament'
import style from './ikony.module.css'

export const metadata: Metadata = {
  title: 'Arkusz ikon',
  description: 'Podgląd zestawu ikon marki. Strona wdrożeniowa, nie dla klientek.',
  robots: { index: false, follow: false },
}

/**
 * Arkusz ikon do przeglądu.
 *
 * Wszystkie ikony na jednej stronie, w medalionie i bez niego, na jasnym
 * i na ciemnym tle. Służy do sprawdzenia, czy kreski mają ten sam ciężar
 * i czy nic nie wypada z siatki 24 na 24. Nie jest linkowana z nawigacji
 * i jest wyłączona z indeksowania.
 */
const ZESTAWY: { tytul: string; opis: string; ikony: NazwaIkony[] }[] = [
  {
    tytul: 'Filary oferty',
    opis: 'Po jednej na każdy z sześciu obszarów pracy gabinetu.',
    ikony: ['skora', 'problemy', 'odmladzanie', 'sylwetka', 'oko', 'doradztwo'],
  },
  {
    tytul: 'Rezerwacja i zaufanie',
    opis: 'Kalendarz, zadatek, bezpieczeństwo, konsultacja, opinie.',
    ikony: ['kalendarz', 'zadatek', 'tarcza', 'dlon', 'gwiazdka'],
  },
  {
    tytul: 'Pozostałe',
    opis: 'Drenaż, lotos, sygnet marki oraz dane kontaktowe.',
    ikony: ['drenaz', 'lotos', 'diament', 'telefon', 'lokalizacja', 'zegar'],
  },
  {
    tytul: 'Interfejs',
    opis: 'Sterowanie karuzelą, rozwijanie list, zamykanie powiększeń, social media.',
    ikony: ['lewo', 'prawo', 'plus', 'zamknij', 'instagram', 'facebook'],
  },
]

export default function ArkuszIkon() {
  return (
    <>
      <section className="sekcja sekcja--krem sekcja--ozdobna">
        <Ornament polozenie="prawy-gorny" />

        <div className="ramka">
          <p className="nadtytul">Materiał wdrożeniowy</p>
          <h1 className={style.tytul}>Arkusz ikon</h1>
          <p className={style.wstep}>
            Siatka 24 na 24, kreska 1,5 piksela, zaokrąglone końce. Ikony na stronie stoją
            w medalionie: ciemny krążek ze złotym pierścieniem, prosto z banera marki.
          </p>

          {ZESTAWY.map((zestaw) => (
            <div key={zestaw.tytul} className={style.zestaw}>
              <h2>{zestaw.tytul}</h2>
              <p className={style.opisZestawu}>{zestaw.opis}</p>

              <ul className={style.siatka}>
                {zestaw.ikony.map((nazwa) => (
                  <li key={nazwa} className={style.pole}>
                    <Medalion nazwa={nazwa} />
                    <span className={style.goly}>
                      <Ikona nazwa={nazwa} rozmiar={26} />
                    </span>
                    <code>{nazwa}</code>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="sekcja sekcja--ciemna">
        <div className="ramka">
          <h2 className={style.naCiemnym}>Ten sam zestaw na ciemnym tle</h2>
          <ul className={style.siatka}>
            {ZESTAWY.flatMap((zestaw) => zestaw.ikony).map((nazwa) => (
              <li key={nazwa} className={`${style.pole} ${style.poleCiemne}`}>
                <Medalion nazwa={nazwa} />
                <code>{nazwa}</code>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sekcja sekcja--kosc">
        <div className="ramka">
          <h2>Paleta</h2>
          <ul className={style.paleta}>
            {[
              ['--c-choc', '#4A2912', 'Ciemna czekolada'],
              ['--c-brown', '#633B1E', 'Głęboki brąz'],
              ['--c-caramel', '#A87550', 'Karmelowy brąz'],
              ['--c-beige-warm', '#C99B75', 'Ciepły beż'],
              ['--c-gold', '#C99A3D', 'Klasyczne złoto'],
              ['--c-gold-light', '#E0BA69', 'Jasne złoto'],
              ['--c-sand', '#DFC5A6', 'Piaskowy beż'],
              ['--c-cream', '#F1E1CD', 'Kremowe tło'],
              ['--c-ivory', '#FAF3E8', 'Ciepła kość słoniowa'],
              ['--c-white-warm', '#FFFDF7', 'Ciepła biel'],
            ].map(([token, hex, nazwa]) => (
              <li key={token}>
                <span className={style.probka} style={{ background: hex }} aria-hidden="true" />
                <strong>{nazwa}</strong>
                <code>{token}</code>
                <code>{hex}</code>
              </li>
            ))}
          </ul>

          <h2 className={style.tytulKrojow}>Kroje pisma</h2>
          <p className={style.proba} style={{ fontFamily: 'var(--kroj-naglowek)' }}>
            Playfair Display. Zażółć gęślą jaźń. Piękno zaczyna się od Ciebie.
          </p>
          <p className={style.proba} style={{ fontFamily: 'var(--kroj-ryte)' }}>
            Cormorant Garamond. ZAŻÓŁĆ GĘŚLĄ JAŹŃ.
          </p>
          <p className={style.proba} style={{ fontFamily: 'var(--kroj-tekst)' }}>
            Jost. Zażółć gęślą jaźń. Drenaż limfatyczny, Chełmża, ul. Broniewskiego 28.
          </p>
          <p className="odrecznie">Piękno zaczyna się od Ciebie</p>
        </div>
      </section>
    </>
  )
}
