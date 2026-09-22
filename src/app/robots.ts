import type { MetadataRoute } from 'next'
import { adresStrony } from '@/lib/dane'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Ekrany rezerwacji mają sens wyłącznie w trakcie umawiania wizyty,
      // a arkusz ikon jest narzędziem wdrożeniowym, nie treścią dla klientek.
      disallow: ['/zadatek', '/rezerwacja-potwierdzona', '/ikony'],
    },
    sitemap: `${adresStrony}/sitemap.xml`,
  }
}
