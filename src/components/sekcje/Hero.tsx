import Image from 'next/image'
import { Ikona } from '@/components/ui/Ikona'
import { PrzyciskLink } from '@/components/ui/Przycisk'
import { tresci } from '@/lib/dane'
import { KOTWICA_REZERWACJI } from '@/lib/ghl'
import style from './Hero.module.css'

export function Hero() {
  const hero = tresci.hero

  return (
    <section className={style.hero}>
      <div className={style.zdjecie}>
        <Image
          src="/images/hero/zabieg.webp"
          alt={hero.altZdjecia}
          width={762}
          height={846}
          sizes="(max-width: 980px) 100vw, 62vw"
          /*
            Od Next.js 16 prop priority jest wycofany na rzecz preload.
            Dokumentacja mowi wprost, zeby preload pominac tam, gdzie jest
            fetchPriority, i zamiast niego uzyc loading z fetchPriority.
            To zdjecie jest elementem LCP tej strony, wiec dostaje oba.
          */
          loading="eager"
          fetchPriority="high"
          /*
            Plik ma 762 piksele szerokosci i zostal przygotowany recznie
            skryptem, w wyzszej jakosci i z wyostrzeniem. Optymalizator
            Next.js podstawial pod niego wariant 589 pikseli, ktory
            przegladarka musiala powiekszac. Serwujemy oryginal.
          */
          unoptimized
        />
      </div>

      <div className="ramka">
        <div className={style.tresc}>
          <p className={style.nadtytul}>{hero.nadtytul}</p>

          <h1 className={style.naglowek}>
            <span className={style.linia1}>{hero.naglowekPierwszaLinia}</span>
            <span className={style.linia2}>{hero.naglowekDrugaLinia}</span>
          </h1>

          <p className={style.akapit}>{hero.akapit}</p>

          <div className={style.przyciski}>
            <PrzyciskLink href={KOTWICA_REZERWACJI}>{hero.przyciskGlowny}</PrzyciskLink>
            <PrzyciskLink href="#oferta" wariant="obrys">
              {hero.przyciskDrugi}
            </PrzyciskLink>
          </div>

          {/*
            Pasek zaufania. Ocena z Google stoi pierwsza, bo to jedyna liczba
            na tej stronie, której klientka nie musi brać na słowo. Gwiazdka
            jest ozdobą przy tekście, więc czytnik ekranu ją pomija.
          */}
          <ul className={style.zaufanie}>
            {hero.zaufanie.map((pozycja, indeks) => (
              <li key={pozycja}>
                {indeks === 0 && (
                  <span className={style.gwiazdka}>
                    <Ikona nazwa="gwiazdka" rozmiar={15} />
                  </span>
                )}
                {pozycja}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
