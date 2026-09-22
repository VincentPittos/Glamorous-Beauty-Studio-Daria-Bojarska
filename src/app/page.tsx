import { Suspense } from 'react'
import { Schema } from '@/components/dane/Schema'
import { Cennik } from '@/components/sekcje/Cennik'
import { CtaKoncowe } from '@/components/sekcje/CtaKoncowe'
import { Faq } from '@/components/sekcje/Faq'
import { Hero } from '@/components/sekcje/Hero'
import { Kontakt } from '@/components/sekcje/Kontakt'
import { Korzysci } from '@/components/sekcje/Korzysci'
import { ONas } from '@/components/sekcje/ONas'
import { Oferta } from '@/components/sekcje/Oferta'
import { Opinie } from '@/components/sekcje/Opinie'
import { Portfolio } from '@/components/sekcje/Portfolio'
import { Proces } from '@/components/sekcje/Proces'

/**
 * Kolejność sekcji na stronie głównej.
 *
 * Dowód społeczny stoi wysoko, zaraz po ofercie: najpierw zdjęcia efektów,
 * potem opinie z Google. Klientka, która pierwszy raz słyszy o gabinecie,
 * potrzebuje potwierdzenia od kogoś innego niż sam gabinet, zanim przeczyta
 * o właścicielce i zanim zobaczy ceny.
 *
 * Sekcja o zadatku jest częścią opisu wizyty, a nie niespodzianką na końcu
 * ścieżki. Dlatego Proces stoi przed cennikiem i przed rezerwacją.
 *
 * Tła przeplatają się ciemne z jasnymi, żeby dwie sąsiednie sekcje nie
 * zlewały się w jeden pas.
 */
export default function Strona() {
  return (
    <>
      <Schema />
      <Hero />
      <Korzysci />
      <Oferta />
      <Portfolio />
      <Opinie />
      <ONas />
      <Proces />
      <Cennik />
      {/* Sekcja rezerwacji czyta wybraną usługę z adresu, więc dostaje własną
          granicę ładowania. Reszta strony zostaje statyczna. */}
      <Suspense fallback={null}>
        <Kontakt />
      </Suspense>
      <Faq />
      <CtaKoncowe />
    </>
  )
}
