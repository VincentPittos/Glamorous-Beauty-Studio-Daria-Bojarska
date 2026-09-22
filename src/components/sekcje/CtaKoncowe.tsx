import { Ikona } from '@/components/ui/Ikona'
import { PrzyciskLink } from '@/components/ui/Przycisk'
import { Ornament } from '@/components/ui/Ornament'
import { salon, tresci } from '@/lib/dane'
import { KOTWICA_REZERWACJI } from '@/lib/ghl'
import style from './CtaKoncowe.module.css'

/**
 * Ostatnie wezwanie do działania, na ciemnym tle.
 *
 * Jedno wezwanie na ekran, to samo co w całej stronie. Obok telefon, bo
 * część klientek woli zadzwonić i nie ma powodu tego utrudniać.
 */
export function CtaKoncowe() {
  const cta = tresci.ctaKoncowe

  return (
    <section className="sekcja sekcja--ciemna sekcja--ozdobna">
      <Ornament polozenie="lewy-dolny" />

      <div className="ramka">
        <div className={style.uklad}>
          <h2 className={style.naglowek}>{cta.naglowek}</h2>
          <p className={style.tekst}>{cta.tekst}</p>

          <div className={style.przyciski}>
            <PrzyciskLink href={KOTWICA_REZERWACJI}>{cta.przycisk}</PrzyciskLink>

            <p className={style.telefon}>
              {cta.telefonWstep}{' '}
              <a href={`tel:${salon.telefon.replace(/\s/g, '')}`}>
                <Ikona nazwa="telefon" rozmiar={18} />
                {salon.telefonDoWyswietlenia}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
