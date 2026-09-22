/**
 * Przygotowanie zdjec do publikacji.
 *
 * Czyta oryginaly z assets-source/ i zapisuje lzejsze wersje WebP do
 * public/images/. Skrypt nie wyswietla zdjec, operuje wylacznie na plikach.
 *
 *   npm run zdjecia
 *
 * Gdzie co polozyc:
 *   assets-source/hero-foto.jpg        zdjecie do sekcji glownej
 *   assets-source/wlascicielka.jpg     zdjecie do sekcji o nas
 *   assets-source/uslugi/<id>.jpg      po jednym na kazda pozycje z uslugi.json
 *   assets-source/portfolio/*.jpg      prace, posortowane alfabetycznie
 *
 * Rozszerzenie moze byc dowolne z jpg, jpeg, png i webp. Brakujacych plikow
 * skrypt nie traktuje jak bledu, tylko wypisuje je na koncu, zebys wiedzial,
 * czego jeszcze nie dostales od klienta.
 *
 * Po kazdym uruchomieniu przepisz wymiary zdjec portfolio do portfolio.json,
 * bo bez nich siatka przeskakuje w trakcie ladowania.
 */
import sharp from 'sharp'
import { mkdir, readdir, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const KORZEN = join(dirname(fileURLToPath(import.meta.url)), '..')
const ZRODLA = join(KORZEN, 'assets-source')
const CEL = join(KORZEN, 'public', 'images')

const JAKOSC = 80
/** Sekcja glowna dostaje wyzsza jakosc, bo to pierwsze, co widzi klientka. */
const JAKOSC_HERO = 90
const SZEROKOSC_DUZA = 1600
const SZEROKOSC_MINIATURY = 800
const ROZSZERZENIA = ['jpg', 'jpeg', 'png', 'webp']

const brakujace = []

async function znajdz(sciezkaBezRozszerzenia) {
  for (const rozszerzenie of ROZSZERZENIA) {
    const kandydat = `${sciezkaBezRozszerzenia}.${rozszerzenie}`
    try {
      await stat(kandydat)
      return kandydat
    } catch {
      // szukamy dalej
    }
  }
  return null
}

async function zapisz(zrodlo, cel, szerokosc, opcje = {}) {
  await mkdir(dirname(cel), { recursive: true })
  let potok = sharp(zrodlo).resize({ width: szerokosc, withoutEnlargement: true })
  if (opcje.wyostrz) potok = potok.sharpen({ sigma: 0.6 })
  const wynik = await potok.webp({ quality: opcje.jakosc ?? JAKOSC }).toFile(cel)
  const nazwa = cel.replace(`${KORZEN}/`, '')
  console.log(
    `  ${nazwa.padEnd(46)} ${String(wynik.width).padStart(4)}x${String(wynik.height).padEnd(4)} ${String(Math.round(wynik.size / 1024)).padStart(4)} kB`,
  )
}

async function pojedyncze(nazwaZrodla, cel, szerokosc, opcje) {
  const zrodlo = await znajdz(join(ZRODLA, nazwaZrodla))
  if (!zrodlo) {
    brakujace.push(`assets-source/${nazwaZrodla}.(${ROZSZERZENIA.join('|')})`)
    return
  }
  await zapisz(zrodlo, cel, szerokosc, opcje)
}

async function hero() {
  console.log('\nSekcja glowna')
  await pojedyncze('hero-foto', join(CEL, 'hero', 'zabieg.webp'), SZEROKOSC_DUZA, {
    jakosc: JAKOSC_HERO,
    wyostrz: true,
  })
  console.log('  pamietaj o --hero-proporcje w src/app/marka.css, musza zgadzac sie z wymiarami powyzej')
}

async function oNas() {
  console.log('\nO nas')
  await pojedyncze('wlascicielka', join(CEL, 'o-nas', 'wlascicielka.webp'), 1000)
}

async function uslugi() {
  console.log('\nOferta')
  const { pozycje } = JSON.parse(
    await (await import('node:fs/promises')).readFile(join(KORZEN, 'src', 'data', 'uslugi.json'), 'utf8'),
  )
  for (const usluga of pozycje) {
    await pojedyncze(
      join('uslugi', usluga.id),
      join(CEL, 'uslugi', `${usluga.id}.webp`),
      SZEROKOSC_MINIATURY,
    )
  }
}

async function portfolio() {
  console.log('\nPortfolio')
  let pliki = []
  try {
    pliki = (await readdir(join(ZRODLA, 'portfolio')))
      .filter((p) => ROZSZERZENIA.some((r) => p.toLowerCase().endsWith(`.${r}`)))
      .sort()
  } catch {
    // katalogu jeszcze nie ma
  }
  if (pliki.length === 0) {
    brakujace.push('assets-source/portfolio/ (najlepiej dwanascie zdjec)')
    return
  }
  for (const [indeks, plik] of pliki.entries()) {
    const nazwa = `portfolio-${String(indeks + 1).padStart(2, '0')}`
    const zrodlo = join(ZRODLA, 'portfolio', plik)
    await zapisz(zrodlo, join(CEL, 'portfolio', `${nazwa}.webp`), SZEROKOSC_DUZA)
    await zapisz(zrodlo, join(CEL, 'portfolio', `${nazwa}-mini.webp`), SZEROKOSC_MINIATURY)
  }
  console.log('  przepisz powyzsze wymiary do src/data/portfolio.json')
}

console.log('Przygotowanie zdjec, jakosc WebP', JAKOSC)
await hero()
await oNas()
await uslugi()
await portfolio()

if (brakujace.length > 0) {
  console.log('\nBrakuje zrodel, zostawiam dotychczasowe pliki w public/images:')
  for (const pozycja of brakujace) console.log('  ', pozycja)
}
console.log('\nGotowe.')
