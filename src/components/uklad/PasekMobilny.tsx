import { Ikona } from '@/components/ui/Ikona'
import { PrzyciskLink } from '@/components/ui/Przycisk'
import { salon, tresci } from '@/lib/dane'
import { KOTWICA_REZERWACJI } from '@/lib/ghl'
import style from './PasekMobilny.module.css'

export function PasekMobilny() {
  return (
    <div className={style.pasek}>
      <PrzyciskLink href={KOTWICA_REZERWACJI} pelna className={style.rezerwacja}>
        {tresci.nawigacja.przycisk}
      </PrzyciskLink>
      <PrzyciskLink
        href={`tel:${salon.telefon.replace(/\s/g, '')}`}
        wariant="obrys"
        className={style.telefon}
      >
        <Ikona nazwa="telefon" rozmiar={22} />
        <span className="tylko-czytnik">
          {tresci.nawigacja.pasekMobilnyZadzwon} {salon.telefonDoWyswietlenia}
        </span>
      </PrzyciskLink>
    </div>
  )
}
