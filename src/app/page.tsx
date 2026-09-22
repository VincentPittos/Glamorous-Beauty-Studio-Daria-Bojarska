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
 * Druga sekcja to O nas, czyli twarz i nazwisko od razu po sekcji głównej.
 * W kameralnym gabinecie klientka wybiera konkretną osobę, a nie firmę,
 * więc poznaje ją zanim zobaczy ofertę.
 *
 * Zaraz po ofercie stoi dowód społeczny: najpierw zdjęcia efektów, potem
 * opinie z Google.
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
      <ONas />
      <Korzysci />
      <Oferta />
      <Portfolio />
      <Opinie />
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
