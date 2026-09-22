import type { Metadata } from 'next'
import { tresci } from '@/lib/dane'
import { EkranPotwierdzenia } from './EkranPotwierdzenia'

export const metadata: Metadata = {
  title: tresci.potwierdzenie.tytulStrony,
  description: tresci.potwierdzenie.wstep,
  robots: { index: false, follow: false },
}

export default function StronaPotwierdzenia() {
  return <EkranPotwierdzenia />
}
