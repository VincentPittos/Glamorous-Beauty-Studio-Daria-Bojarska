import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'

/**
 * Potwierdzenie rezerwacji po wpłacie zadatku.
 *
 * To jedyne miejsce w całym projekcie, które ma prawo przestawić wizytę na
 * potwierdzoną. Zasady, które o tym decydują:
 *
 *   PODPIS. Liczymy HMAC SHA-256 z surowego ciała żądania i porównujemy go
 *   z nagłówkiem od operatora, porównaniem odpornym na pomiar czasu. Bez
 *   zgodnego podpisu odpowiadamy 401 i nic się nie dzieje. Żaden parametr
 *   z adresu ani żadne pole z ciała nie zastępuje podpisu.
 *
 *   IDEMPOTENCJA. Operatorzy ponawiają webhooki, czasem kilka razy pod rząd.
 *   Każde zdarzenie ma identyfikator i przetwarzamy je dokładnie raz.
 *
 *   KWOTA. Sprawdzamy, czy wpłata to naprawdę zadatek. Zaniżona kwota nie
 *   potwierdza wizyty.
 *
 *   SEKRETY. Wyłącznie w zmiennych środowiskowych, nigdy w kodzie i nigdy
 *   w kodzie wysyłanym do przeglądarki.
 *
 * Trasa czyta surowe ciało żądania, więc nie wolno jej przerobić na
 * zadanie.json() przed policzeniem podpisu. Podpis liczy się z bajtów,
 * które przyszły, a nie z obiektu po przetworzeniu.
 */

export const runtime = 'nodejs'

/** Kwota zadatku w groszach. Trzymana osobno od treści strony, bo to pieniądze. */
const ZADATEK_GROSZE = 5000

const NAGLOWEK_PODPISU = 'x-webhook-podpis'
const NAGLOWEK_PODPISU_STRIPE = 'stripe-signature'

/**
 * Identyfikatory zdarzeń już obsłużonych.
 *
 * UWAGA PRZY WDROŻENIU: pamięć procesu wystarcza przy jednym serwerze i
 * znika przy restarcie. Na Netlify, gdzie trasa może wystartować w kilku
 * instancjach, podmień to na wspólny magazyn: tabelę, Redis albo pole
 * w kontakcie GHL. Bez tego podwójny webhook po restarcie przejdzie drugi
 * raz. Sam w sobie nie zaszkodzi, bo potwierdzenie wizyty jest operacją
 * idempotentną po stronie GHL, ale klientka dostanie dwa SMS-y.
 */
const obsluzone = new Set<string>()
const LIMIT_PAMIECI = 500

function juzObsluzone(id: string): boolean {
  if (obsluzone.has(id)) return true
  obsluzone.add(id)
  if (obsluzone.size > LIMIT_PAMIECI) {
    const najstarszy = obsluzone.values().next().value
    if (najstarszy) obsluzone.delete(najstarszy)
  }
  return false
}

/** Porównanie odporne na pomiar czasu. Różna długość to od razu odmowa. */
function zgodnyPodpis(oczekiwany: string, otrzymany: string): boolean {
  const a = Buffer.from(oczekiwany, 'utf8')
  const b = Buffer.from(otrzymany, 'utf8')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function tekst(wartosc: unknown): string {
  return typeof wartosc === 'string' ? wartosc.trim().slice(0, 500) : ''
}

export async function POST(zadanie: Request) {
  const sekret = process.env.WEBHOOK_PLATNOSCI_SEKRET

  if (!sekret) {
    // Bez sekretu nie da się niczego sprawdzić, więc trasa jest zamknięta.
    // Lepiej, żeby płatności nie potwierdzały się wcale, niż żeby
    // potwierdzał je ktokolwiek, kto zna adres.
    console.error('[platnosc] WEBHOOK_PLATNOSCI_SEKRET nie jest ustawiony, odrzucam zgłoszenie')
    return NextResponse.json({ blad: 'Webhook nie jest skonfigurowany' }, { status: 503 })
  }

  const podpis =
    zadanie.headers.get(NAGLOWEK_PODPISU) ?? zadanie.headers.get(NAGLOWEK_PODPISU_STRIPE) ?? ''

  if (!podpis) {
    return NextResponse.json({ blad: 'Brak podpisu' }, { status: 401 })
  }

  const surowe = await zadanie.text()
  const oczekiwany = createHmac('sha256', sekret).update(surowe, 'utf8').digest('hex')

  if (!zgodnyPodpis(oczekiwany, podpis)) {
    console.warn('[platnosc] Podpis się nie zgadza, odrzucam zgłoszenie')
    return NextResponse.json({ blad: 'Podpis się nie zgadza' }, { status: 401 })
  }

  let zdarzenie: Record<string, unknown>
  try {
    zdarzenie = JSON.parse(surowe) as Record<string, unknown>
  } catch {
    return NextResponse.json({ blad: 'Nieczytelne zgłoszenie' }, { status: 400 })
  }

  const idZdarzenia = tekst(zdarzenie.id ?? zdarzenie.eventId)
  if (!idZdarzenia) {
    return NextResponse.json({ blad: 'Zdarzenie bez identyfikatora' }, { status: 400 })
  }

  // Odpowiadamy sukcesem, żeby operator przestał ponawiać, ale nic nie
  // robimy po raz drugi.
  if (juzObsluzone(idZdarzenia)) {
    return NextResponse.json({ ok: true, powtorka: true })
  }

  const status = tekst(zdarzenie.status ?? zdarzenie.type)
  const oplacone = status === 'succeeded' || status === 'paid' || status === 'completed'

  if (!oplacone) {
    // Płatność odrzucona albo porzucona. Wizyta zostaje niepotwierdzona
    // i zwolni się sama po czasie ustawionym w workflow GHL.
    return NextResponse.json({ ok: true, potwierdzone: false })
  }

  const kwota = Number(zdarzenie.kwota ?? zdarzenie.amount ?? 0)
  if (!Number.isFinite(kwota) || kwota < ZADATEK_GROSZE) {
    console.warn('[platnosc] Kwota niższa od zadatku, nie potwierdzam wizyty')
    return NextResponse.json({ ok: true, potwierdzone: false })
  }

  const webhook = process.env.GHL_WEBHOOK_POTWIERDZENIE_URL

  if (!webhook) {
    console.warn('[platnosc] Brak adresu webhooka potwierdzenia, wizyta została niepotwierdzona')
    return NextResponse.json({ ok: true, potwierdzone: false })
  }

  try {
    const odpowiedz = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idRezerwacji: tekst(zdarzenie.idRezerwacji ?? zdarzenie.metadata),
        idTransakcji: idZdarzenia,
        kwotaGrosze: kwota,
        telefon: tekst(zdarzenie.telefon),
        status: 'potwierdzona',
        tag: 'zadatek-oplacony',
        zaksiegowane: new Date().toISOString(),
      }),
    })

    if (!odpowiedz.ok) {
      // Zdejmujemy zdarzenie z listy obsłużonych, żeby ponowienie od
      // operatora miało szansę dokończyć robotę.
      obsluzone.delete(idZdarzenia)
      console.error('[platnosc] GHL odrzucił potwierdzenie, status', odpowiedz.status)
      return NextResponse.json({ blad: 'Nie udało się potwierdzić wizyty' }, { status: 502 })
    }
  } catch (powod) {
    obsluzone.delete(idZdarzenia)
    console.error('[platnosc] Nie udało się połączyć z GHL', powod)
    return NextResponse.json({ blad: 'Nie udało się potwierdzić wizyty' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, potwierdzone: true })
}
