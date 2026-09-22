/**
 * Generowanie zdjec zastepczych.
 *
 *   node scripts/zastepcze-zdjecia.mjs
 *
 * Szablon przyszedl z obrazkami, ktore mialy wpisane nazwy uslug poprzedniego
 * salonu. Ten skrypt rysuje je od nowa w palecie Glamorous Beauty Studio
 * i z nazwami wzietymi z src/data/uslugi.json, zeby w repozytorium nie
 * zostal ani jeden slad po szablonie.
 *
 * Uruchamia sie go recznie i tylko wtedy, gdy zmieni sie lista filarow.
 * Po wrzuceniu prawdziwych zdjec do assets-source przestaje byc potrzebny,
 * bo npm run zdjecia nadpisze wszystko, co tu powstalo.
 */
import sharp from 'sharp'
import { mkdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const KORZEN = join(dirname(fileURLToPath(import.meta.url)), '..')
const CEL = join(KORZEN, 'public', 'images')

const CZEKOLADA = '#4a2912'
const BRAZ = '#633b1e'
const ZLOTO = '#c99a3d'
const ZLOTO_JASNE = '#e0ba69'
const MGLA = '#c9a98a'

function ucieczka(tekst) {
  return tekst.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Kadr zastepczy: ciemne tlo, zlota ramka, nazwa i wymiary. */
function plansza(szerokosc, wysokosc, tytul, podpis) {
  const margines = Math.round(Math.min(szerokosc, wysokosc) * 0.055)
  const duza = Math.round(Math.min(szerokosc, wysokosc) * 0.072)
  const mala = Math.round(duza * 0.55)
  const drobna = Math.round(duza * 0.42)
  const srodek = wysokosc / 2

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${szerokosc}" height="${wysokosc}">
  <defs>
    <linearGradient id="tlo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${CZEKOLADA}"/>
      <stop offset="55%" stop-color="${BRAZ}"/>
      <stop offset="100%" stop-color="${CZEKOLADA}"/>
    </linearGradient>
  </defs>
  <rect width="${szerokosc}" height="${wysokosc}" fill="url(#tlo)"/>
  <rect x="${margines}" y="${margines}" width="${szerokosc - margines * 2}" height="${wysokosc - margines * 2}"
        fill="none" stroke="${ZLOTO}" stroke-width="1.5" opacity="0.7"/>
  <text x="50%" y="${srodek - duza * 0.5}" text-anchor="middle" fill="${ZLOTO_JASNE}"
        font-family="Georgia, serif" font-size="${duza}" letter-spacing="${duza * 0.1}">ZDJĘCIE</text>
  <text x="50%" y="${srodek + mala * 1.1}" text-anchor="middle" fill="${MGLA}"
        font-family="Georgia, serif" font-size="${mala}">${ucieczka(tytul)}</text>
  <text x="50%" y="${srodek + mala * 1.1 + drobna * 1.7}" text-anchor="middle" fill="${MGLA}"
        font-family="Georgia, serif" font-size="${drobna}" opacity="0.75">${ucieczka(podpis)}</text>
</svg>`)
}

async function zapisz(sciezka, svg) {
  await mkdir(dirname(sciezka), { recursive: true })
  const wynik = await sharp(svg).webp({ quality: 82 }).toFile(sciezka)
  console.log(`  ${sciezka.replace(`${KORZEN}/`, '').padEnd(46)} ${wynik.width}x${wynik.height}`)
}

const { pozycje: filary } = JSON.parse(
  await readFile(join(KORZEN, 'src', 'data', 'uslugi.json'), 'utf8'),
)
const { pozycje: zdjecia } = JSON.parse(
  await readFile(join(KORZEN, 'src', 'data', 'portfolio.json'), 'utf8'),
)

console.log('Zdjecia zastepcze w palecie marki\n')

console.log('Sekcja glowna i o nas')
await zapisz(join(CEL, 'hero', 'zabieg.webp'), plansza(762, 846, 'sekcja główna', '762 x 846'))
await zapisz(
  join(CEL, 'o-nas', 'wlascicielka.webp'),
  plansza(1000, 1250, 'Daria Bojarska', '1000 x 1250'),
)

console.log('\nFilary oferty')
for (const filar of filary) {
  await zapisz(join(CEL, 'uslugi', `${filar.id}.webp`), plansza(800, 800, filar.nazwa, '800 x 800'))
}

console.log('\nPortfolio')
for (const [indeks, zdjecie] of zdjecia.entries()) {
  const podpis = `efekt ${indeks + 1} z ${zdjecia.length}`
  await zapisz(join(CEL, 'portfolio', `${zdjecie.id}.webp`), plansza(800, 1000, podpis, '800 x 1000'))
  await zapisz(
    join(CEL, 'portfolio', `${zdjecie.id}-mini.webp`),
    plansza(400, 500, podpis, '400 x 500'),
  )
}

console.log('\nGotowe. Po otrzymaniu prawdziwych zdjec uruchom npm run zdjecia.')
