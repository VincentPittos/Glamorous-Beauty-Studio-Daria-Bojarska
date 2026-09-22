/**
 * Podciecie kroju odrecznego do znakow, ktore naprawde sa na stronie.
 *
 *   npm run kroj
 *
 * Pinyon Script wystepuje w dwoch miejscach: druga linia naglowka w sekcji
 * glownej i podpis pod tekstem o wlascicielce. Razem okolo dwudziestu
 * znakow. Pelne paczki @fontsource wazyly 74 kB, bo niosly caly alfabet
 * lacinski razem z rozszerzonym, i schodzily na telefon nad linia zalamania.
 *
 * UWAGA NA ZRODLO. @fontsource dzieli krój na pliki po zakresach znakow:
 * plik latin ma podstawowe litery, a plik latin-ext wylacznie znaki
 * rozszerzone, czyli u nas samo e z ogonkiem. Podciecie tylko jednego z nich
 * daje font bez wiekszosci liter, ktory na stronie wyglada jak zwykly
 * szeryf z jednym dziwnym znakiem. Dlatego tniemy oba i skladamy je w jeden
 * plik funkcja merge.
 *
 * Napisy skrypt czyta z src/data/tresci.json, wiec po zmianie tekstu
 * wystarczy uruchomic go ponownie.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const KORZEN = join(dirname(fileURLToPath(import.meta.url)), '..')
const PLIKI = join(KORZEN, 'node_modules/@fontsource/pinyon-script/files')
const ZAKRESY = ['latin', 'latin-ext']
const CEL = join(KORZEN, 'public/fonts/pinyon-script-podciety.woff2')

const tresci = JSON.parse(readFileSync(join(KORZEN, 'src/data/tresci.json'), 'utf8'))
const napisy = [tresci.hero.naglowekDrugaLinia, tresci.oNas.podpis]

// Zestaw znakow bez powtorzen. Spacja wchodzi zawsze, bo bez niej wyrazy
// skleilyby sie w jeden ciag.
const znaki = [...new Set([...napisy.join(''), ' '])].sort().join('')

console.log('napisy:', napisy.map((n) => `"${n}"`).join(', '))
console.log('znaki :', znaki, `(${znaki.length})`)

const roboczy = mkdtempSync(join(tmpdir(), 'kroj-'))
const czesci = []

for (const zakres of ZAKRESY) {
  const zrodlo = join(PLIKI, `pinyon-script-${zakres}-400-normal.woff2`)
  const czesc = join(roboczy, `${zakres}.ttf`)
  execFileSync('pyftsubset', [
    zrodlo,
    `--text=${znaki}`,
    '--flavor=woff2',
    '--layout-features=kern,liga,calt',
    `--output-file=${czesc}`,
  ])
  czesci.push(czesc)
}

// Skladamy oba podciete kawalki w jeden plik i dopiero wtedy pakujemy
// do woff2, zeby na stronie byla jedna regula font-face i jedno pobranie.
execFileSync('python3', [
  '-c',
  `
import sys
from fontTools.merge import Merger
from fontTools.ttLib import TTFont
laczny = Merger().merge(sys.argv[1:])
laczny.flavor = 'woff2'
laczny.save(${JSON.stringify(CEL)})
`,
  ...czesci,
])

const przed = ZAKRESY.reduce(
  (suma, z) => suma + statSync(join(PLIKI, `pinyon-script-${z}-400-normal.woff2`)).size,
  0,
)
const po = statSync(CEL).size

// Kontrola: font musi umiec narysowac kazdy znak z obu napisow.
execFileSync('python3', [
  '-c',
  `
from fontTools.ttLib import TTFont
cmap = TTFont(${JSON.stringify(CEL)}).getBestCmap()
brak = sorted(set(${JSON.stringify(znaki)}) - {chr(k) for k in cmap})
if brak:
    raise SystemExit('BRAKUJE GLIFOW: ' + ''.join(brak))
print('kontrola: wszystkie', len(cmap), 'glifow na miejscu')
`,
], { stdio: 'inherit' })

console.log(`${Math.round(przed / 1024)} kB -> ${Math.round(po / 1024)} kB  ${CEL.replace(KORZEN + '/', '')}`)
