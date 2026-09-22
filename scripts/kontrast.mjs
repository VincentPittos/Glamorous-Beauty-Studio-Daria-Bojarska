/**
 * Sprawdzenie kontrastu par tekst na tle wedlug WCAG 2.1.
 *
 *   npm run kontrast
 *
 * Skrypt czyta kolory z src/app/marka.css, wiec nie ma tu drugiej kopii
 * palety, ktora moglaby rozjechac sie ze strona. Rozwiazuje takze tokeny
 * semantyczne wskazujace na kolory marki, czyli zapisy var(--c-choc).
 *
 * Progi: tekst zwykly 4.5, tekst duzy i pogrubiony 3.0, elementy graficzne
 * i obramowania 3.0.
 */
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const KORZEN = join(dirname(fileURLToPath(import.meta.url)), '..')
const PLIK = join(KORZEN, 'src', 'app', 'marka.css')

const arkusz = await readFile(PLIK, 'utf8')

/** Wszystkie deklaracje zmiennych z pliku marki. */
const surowe = new Map()
for (const [, nazwa, wartosc] of arkusz.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
  surowe.set(nazwa, wartosc.trim())
}

/** Rozwiazanie tokenu do zapisu szesnastkowego, takze przez var(). */
function rozwiaz(nazwa, glebokosc = 0) {
  if (glebokosc > 8) return null
  const wartosc = surowe.get(nazwa)
  if (!wartosc) return null
  if (wartosc.startsWith('#')) return wartosc
  const przez = wartosc.match(/^var\((--[a-z0-9-]+)\)$/)
  if (przez) return rozwiaz(przez[1], glebokosc + 1)
  return null
}

function kanaly(hex) {
  const czysty = hex.replace('#', '')
  const pelny =
    czysty.length === 3
      ? czysty
          .split('')
          .map((z) => z + z)
          .join('')
      : czysty
  return [0, 2, 4].map((i) => parseInt(pelny.slice(i, i + 2), 16) / 255)
}

function luminancja(hex) {
  const [r, g, b] = kanaly(hex).map((k) => (k <= 0.03928 ? k / 12.92 : ((k + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function kontrast(a, b) {
  const la = luminancja(a)
  const lb = luminancja(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** Pary, ktore naprawde wystepuja na stronie. */
const PARY = [
  ['Tekst glowny na kremie', '--tusz', '--krem', 4.5],
  ['Tekst glowny na kosci sloniowej', '--tusz', '--ivory', 4.5],
  ['Tekst glowny na bieli', '--tusz', '--biel', 4.5],
  ['Tekst drugorzedny na kremie', '--tusz-2', '--krem', 4.5],
  ['Tekst drugorzedny na kosci sloniowej', '--tusz-2', '--ivory', 4.5],
  ['Tekst drugorzedny na bieli', '--tusz-2', '--biel', 4.5],
  ['Akcent tekstowy na kremie', '--akcent-tekst', '--krem', 4.5],
  ['Akcent tekstowy na kosci sloniowej', '--akcent-tekst', '--ivory', 4.5],
  ['Akcent tekstowy na bieli', '--akcent-tekst', '--biel', 4.5],
  ['Biel na czekoladzie', '--biel', '--atrament', 4.5],
  ['Biel na brazie', '--biel', '--atrament-3', 4.5],
  ['Biel na powierzchni ciemnej', '--biel', '--atrament-2', 4.5],
  ['Jasne zloto na czekoladzie', '--akcent-jasne', '--atrament', 4.5],
  ['Jasne zloto na brazie', '--akcent-jasne', '--atrament-3', 4.5],
  ['Zloto na czekoladzie', '--akcent', '--atrament', 4.5],
  ['Jasne zloto na powierzchni ciemnej', '--akcent-jasne', '--atrament-2', 4.5],
  ['Tekst przycisku glownego', '--biel', '--atrament', 4.5],
  ['Kreski i ikony: karmel na kremie', '--akcent-ciemne', '--krem', 3],
  ['Kreski i ikony: karmel na bieli', '--akcent-ciemne', '--biel', 3],
  ['Pierscien medalionu na czekoladzie', '--akcent-jasne', '--atrament', 3],
  ['Obramowanie pol formularza na bieli', '--obrys-pola', '--biel', 3],
  ['Obramowanie pol formularza na kremie', '--obrys-pola', '--krem', 3],
  ['Fokus, pierscien ciemny na kremie', '--atrament', '--krem', 3],
  ['Fokus, pierscien ciemny na kosci sloniowej', '--atrament', '--ivory', 3],
  ['Fokus, pierscien zloty na ciemnym', '--akcent-jasne', '--atrament', 3],
  ['Komunikat bledu na kremie', '--blad', '--krem', 4.5],
]

let bledy = 0
let ostrzezenia = 0

console.log('\nKontrast palety Glamorous Beauty Studio\n')
console.log('  wynik   prog   para')
console.log('  ' + '-'.repeat(74))

for (const [opis, przod, tyl, prog] of PARY) {
  const a = rozwiaz(przod)
  const b = rozwiaz(tyl)

  if (!a || !b) {
    console.log(`  BRAK           ${opis}  (nie udalo sie rozwiazac ${!a ? przod : tyl})`)
    bledy += 1
    continue
  }

  const wynik = kontrast(a, b)
  const zdany = wynik >= prog
  if (!zdany) bledy += 1
  // Para, ktora przechodzi z zapasem mniejszym niz 0.3, warto miec na oku.
  else if (wynik - prog < 0.3) ostrzezenia += 1

  const znak = zdany ? 'OK ' : 'NIE'
  console.log(
    `  ${wynik.toFixed(2).padStart(5)}  ${prog.toFixed(1)}  ${znak}  ${opis}  ${a} na ${b}`,
  )
}

console.log('')
if (bledy > 0) {
  console.log(`  ${bledy} par ponizej progu. Popraw palete w src/app/marka.css.\n`)
  process.exitCode = 1
} else {
  console.log(`  Wszystkie ${PARY.length} par przechodzi prog WCAG AA.`)
  if (ostrzezenia > 0) console.log(`  ${ostrzezenia} par ma zapas mniejszy niz 0,3.`)
  console.log('')
}
