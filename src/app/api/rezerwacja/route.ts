import { NextResponse } from 'next/server'

/**
 * Założenie wizyty NIEPOTWIERDZONEJ w GoHighLevel.
 *
 * Wizyta powstaje bez potwierdzenia i z wstępnie zablokowanym terminem.
 * Potwierdza ją dopiero webhook płatności, po sprawdzeniu podpisu. Ta trasa
 * nie ma prawa niczego potwierdzić, nawet gdyby przeglądarka o to poprosiła.
 *
 * Adres webhooka siedzi w zmiennej środowiskowej po stronie serwera, więc
 * nie trafia do przeglądarki.
 */

const LIMIT_ZNAKOW = 2000

function tekst(wartosc: unknown): string {
  return typeof wartosc === 'string' ? wartosc.trim().slice(0, LIMIT_ZNAKOW) : ''
}

function zgoda(wartosc: unknown): boolean {
  return wartosc === true || wartosc === 'true' || wartosc === 'on'
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
    return NextResponse.json({ ok: true, id: '' })
  }

  const imie = tekst(dane.imie)
  const telefon = tekst(dane.telefon)
  const usluga = tekst(dane.usluga)
  const termin = tekst(dane.termin)
  const terminIso = tekst(dane.terminIso)

  if (!imie || !telefon || !termin) {
    return NextResponse.json({ blad: 'Brakuje imienia, telefonu albo terminu' }, { status: 400 })
  }

  // Obie zgody są obowiązkowe, więc sprawdzamy je także tutaj. Atrybut
  // required w formularzu chroni klientkę przed pomyłką, nie serwer przed
  // zgłoszeniem wysłanym z pominięciem strony.
  if (!zgoda(dane.zgodaRegulamin) || !zgoda(dane.zgodaDane)) {
    return NextResponse.json({ blad: 'Brakuje wymaganych zgód' }, { status: 400 })
  }

  const webhook = process.env.GHL_WEBHOOK_REZERWACJA_URL ?? process.env.GHL_WEBHOOK_URL

  if (!webhook) {
    console.warn('[rezerwacja] Brak adresu webhooka, zgłoszenie nie poszło dalej')
    return NextResponse.json({ ok: true, przekazane: false, id: '' })
  }

  try {
    const odpowiedz = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imie,
        telefon,
        usluga,
        termin,
        terminIso,
        status: 'niepotwierdzona',
        zgodaMarketing: zgoda(dane.zgodaMarketing),
        zrodlo: 'strona internetowa, kalendarz rezerwacji',
        wyslane: new Date().toISOString(),
      }),
    })

    if (!odpowiedz.ok) {
      console.error('[rezerwacja] GHL odrzucił zgłoszenie, status', odpowiedz.status)
      return NextResponse.json({ blad: 'Nie udało się zapisać rezerwacji' }, { status: 502 })
    }

    // GHL zwraca identyfikator wizyty tylko wtedy, gdy workflow został tak
    // ustawiony. Gdy go nie ma, ścieżka i tak działa, a płatność wiążemy
    // z klientką po numerze telefonu.
    let id = ''
    try {
      const wynik = (await odpowiedz.json()) as Record<string, unknown>
      id = tekst(wynik.id ?? wynik.appointmentId ?? wynik.contactId)
    } catch {
      // Workflow odpowiedział pustką albo tekstem. Nic się nie dzieje.
    }

    return NextResponse.json({ ok: true, przekazane: true, id })
  } catch (powod) {
    console.error('[rezerwacja] Nie udało się połączyć z GHL', powod)
    return NextResponse.json({ blad: 'Nie udało się zapisać rezerwacji' }, { status: 502 })
  }
}
