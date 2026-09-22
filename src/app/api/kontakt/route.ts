import { NextResponse } from 'next/server'

/**
 * Odbiór pytań z formularza i przekazanie ich do GoHighLevel.
 *
 * Adres webhooka siedzi w zmiennej środowiskowej po stronie serwera, więc
 * nie trafia do przeglądarki. Jeśli nikt go nie ustawił, zgłoszenie i tak
 * zostaje przyjęte, a informacja o braku konfiguracji ląduje w logach, żeby
 * klientka nie zobaczyła błędu, którego nie jest w stanie naprawić.
 */

const LIMIT_ZNAKOW = 2000

function tekst(wartosc: unknown): string {
  return typeof wartosc === 'string' ? wartosc.trim().slice(0, LIMIT_ZNAKOW) : ''
}

export async function POST(zadanie: Request) {
  let dane: Record<string, unknown>
  try {
    dane = await zadanie.json()
  } catch {
    return NextResponse.json({ blad: 'Nieczytelne zgłoszenie' }, { status: 400 })
  }

  // Pole pułapka wypełniają tylko roboty. Udajemy sukces, żeby nie
  // podpowiadać im, co poszło nie tak.
  if (tekst(dane.strona)) {
    return NextResponse.json({ ok: true })
  }

  const imie = tekst(dane.imie)
  const telefon = tekst(dane.telefon)
  const usluga = tekst(dane.usluga)
  const wiadomosc = tekst(dane.wiadomosc)

  if (!imie || !telefon) {
    return NextResponse.json({ blad: 'Brakuje imienia albo telefonu' }, { status: 400 })
  }

  const webhook = process.env.GHL_WEBHOOK_URL

  if (!webhook) {
    console.warn('[kontakt] GHL_WEBHOOK_URL nie jest ustawiony, zgłoszenie nie poszło dalej')
    return NextResponse.json({ ok: true, przekazane: false })
  }

  try {
    const odpowiedz = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imie,
        telefon,
        usluga,
        wiadomosc,
        zrodlo: 'strona internetowa, formularz pytania',
        wyslane: new Date().toISOString(),
      }),
    })

    if (!odpowiedz.ok) {
      console.error('[kontakt] GHL odrzucił zgłoszenie, status', odpowiedz.status)
      return NextResponse.json({ blad: 'Nie udało się przekazać zgłoszenia' }, { status: 502 })
    }
  } catch (powod) {
    console.error('[kontakt] Nie udało się połączyć z GHL', powod)
    return NextResponse.json({ blad: 'Nie udało się przekazać zgłoszenia' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, przekazane: true })
}
