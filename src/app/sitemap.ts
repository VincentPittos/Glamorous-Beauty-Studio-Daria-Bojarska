import type { MetadataRoute } from 'next'
import { adresStrony, uslugi } from '@/lib/dane'

/**
 * Mapa strony.
 *
 * Wchodzi tu strona główna i sześć podstron filarów oferty. Dokumenty
 * prawne i ekrany rezerwacji zostają poza mapą: pierwsze nie mają wartości
 * w wyszukiwarce, drugie nie mają sensu bez rozpoczętej rezerwacji.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const teraz = new Date()

  return [
    { url: adresStrony, lastModified: teraz, changeFrequency: 'monthly', priority: 1 },
    ...uslugi.map((usluga) => ({
      url: `${adresStrony}/zabiegi/${usluga.slug}`,
      lastModified: teraz,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
