import type { Metadata } from 'next'
import { tresci } from '@/lib/dane'
import { EkranZadatku } from './EkranZadatku'

export const metadata: Metadata = {
  title: tresci.zadatek.tytulStrony,
  description: tresci.zadatek.wstep,
  // Strona ma sens wyłącznie w trakcie rezerwacji, więc nie ma czego
  // indeksować ani po co przekazywać dalej mocy linków.
  robots: { index: false, follow: false },
}

export default function StronaZadatku() {
  return <EkranZadatku />
}
