import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import style from './Przycisk.module.css'

type Wariant = 'zloty' | 'obrys' | 'atrament'

function klasy(wariant: Wariant, pelna: boolean, dodatkowa?: string) {
  return [style.podstawa, style[wariant], pelna ? style.pelna : '', dodatkowa].filter(Boolean).join(' ')
}

/**
 * Przycisk prowadzący gdzieś na stronie albo poza nią. Teksty przycisków
 * mówią, co się stanie po kliknięciu, więc nie doklejamy do nich strzałek.
 */
export function PrzyciskLink({
  href,
  wariant = 'zloty',
  pelna = false,
  children,
  className,
  ...reszta
}: {
  href: string
  wariant?: Wariant
  pelna?: boolean
  children: ReactNode
} & Omit<ComponentProps<typeof Link>, 'href' | 'children' | 'className'> & { className?: string }) {
  return (
    <Link href={href} className={klasy(wariant, pelna, className)} {...reszta}>
      {children}
    </Link>
  )
}

export function Przycisk({
  wariant = 'zloty',
  pelna = false,
  children,
  className,
  ...reszta
}: {
  wariant?: Wariant
  pelna?: boolean
  children: ReactNode
} & ComponentProps<'button'>) {
  return (
    <button className={klasy(wariant, pelna, className)} {...reszta}>
      {children}
    </button>
  )
}
