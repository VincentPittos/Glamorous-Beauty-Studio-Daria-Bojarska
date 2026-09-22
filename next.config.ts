import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Wszystkie zdjecia sa lokalne i wstepnie przeskalowane skryptem
    // scripts/przygotuj-zdjecia.mjs, wiec wystarczy domyslna jakosc.
    formats: ['image/webp'],
  },
}

export default nextConfig
