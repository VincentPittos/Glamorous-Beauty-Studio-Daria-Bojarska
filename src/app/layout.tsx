import type { Metadata, Viewport } from 'next'

// Kroje serwujemy z własnego serwera. Każdy plik wagi zawiera podzbiór
// podstawowy i rozszerzony razem z zakresami znaków, więc polskie ogonki
// działają, a przeglądarka pobiera tylko to, czego naprawdę użyje.
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/600.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/jost/400.css'
import '@fontsource/jost/500.css'
import '@fontsource/jost/600.css'
/* Krój odręczny nie wchodzi paczką. Jest podcięty do dwóch napisów, które
   są na stronie, i wczytuje go własna reguła font-face w globals.css. */

import './globals.css'
import { Naglowek } from '@/components/uklad/Naglowek'
import { PasekMobilny } from '@/components/uklad/PasekMobilny'
import { Stopka } from '@/components/uklad/Stopka'
import { adresStrony, salon, tresci } from '@/lib/dane'

export const metadata: Metadata = {
  metadataBase: new URL(adresStrony),
  title: tresci.meta.tytul,
  description: tresci.meta.opis,
  keywords: tresci.meta.slowa.split(', '),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: salon.nazwa,
    title: tresci.meta.tytul,
    description: tresci.meta.opis,
    url: adresStrony,
    images: [{ url: '/images/hero/zabieg.webp', width: 1190, height: 1322, alt: tresci.hero.altZdjecia }],
  },
  twitter: {
    card: 'summary_large_image',
    title: tresci.meta.tytul,
    description: tresci.meta.opis,
    images: ['/images/hero/zabieg.webp'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  // Ta sama wartość co --atrament w marka.css, czyli ciemna czekolada
  // z banera marki. Nie da się jej wziąć ze zmiennej CSS, bo pasek adresu
  // przeglądarki dostaje ją zanim wczyta się arkusz.
  themeColor: '#4a2912',
}

export default function Uklad({ children }: { children: React.ReactNode }) {
  return (
    // Atrybut każe Next.js przywracać natychmiastowe przewijanie przy zmianie
    // trasy, mimo że w arkuszu włączyliśmy płynne przewijanie do kotwic.
    <html lang="pl" data-scroll-behavior="smooth">
      <body>
        <a className="pomin" href="#tresc">
          Przejdź do treści
        </a>
        <Naglowek />
        <main id="tresc">{children}</main>
        <Stopka />
        <PasekMobilny />
      </body>
    </html>
  )
}
