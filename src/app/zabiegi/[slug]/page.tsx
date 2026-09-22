import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Ikona, Medalion, type NazwaIkony } from '@/components/ui/Ikona'
import { Ornament } from '@/components/ui/Ornament'
import { PrzyciskLink } from '@/components/ui/Przycisk'
import { CtaKoncowe } from '@/components/sekcje/CtaKoncowe'
import {
  adresStrony,
  bezZnacznikow,
  cennik,
  czekaNaDane,
  faq,
  filarPoSlugu,
  salon,
  tresci,
  uslugi,
} from '@/lib/dane'
import { linkRezerwacji } from '@/lib/ghl'
import style from './filar.module.css'

/**
 * Podstrona jednego filaru oferty.
 *
 * Treść jest inna niż na stronie głównej: tam karta mówi, co tu jest,
 * a tutaj każdy zabieg dostaje pełny opis. Powielanie tych samych akapitów
 * w dwóch miejscach szkodzi i klientce, i wyszukiwarce.
 *
 * Adresy biorą się ze slugów w uslugi.json, więc dodanie filaru w danych
 * tworzy podstronę bez dotykania kodu.
 */

export function generateStaticParams() {
  return uslugi.map((usluga) => ({ slug: usluga.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const filar = filarPoSlugu(slug)
  if (!filar) return {}

  const tytul = `${filar.nazwa} | ${salon.adres.miasto} | ${salon.logotyp.nazwa} ${salon.logotyp.podpis}`

  return {
    title: tytul,
    description: `${filar.dlaKogo} ${filar.efekt}`.slice(0, 155),
    alternates: { canonical: `/zabiegi/${filar.slug}` },
    openGraph: {
      type: 'article',
      locale: 'pl_PL',
      siteName: salon.nazwa,
      title: tytul,
      description: filar.efekt,
      url: `${adresStrony}/zabiegi/${filar.slug}`,
      images: [{ url: filar.obraz, alt: filar.alt }],
    },
  }
}

export default async function StronaFilaru({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const filar = filarPoSlugu(slug)

  if (!filar) notFound()

  const kategoria = cennik.find((pozycja) => pozycja.id === filar.kategoriaCennika)
  // Na podstronie zostawiamy tylko te pytania, które są już potwierdzone.
  // Odpowiedź ze znacznikiem TODO nie ma prawa pokazać się klientce.
  const pytania = faq
    .filter((pytanie) => !czekaNaDane(pytanie.odpowiedz))
    .slice(0, 4)

  const inne = uslugi.filter((pozycja) => pozycja.id !== filar.id)

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: filar.nazwa,
    description: filar.efekt,
    serviceType: filar.podtytul,
    url: `${adresStrony}/zabiegi/${filar.slug}`,
    areaServed: { '@type': 'City', name: salon.adres.miasto },
    provider: {
      '@type': 'BeautySalon',
      name: salon.nazwa,
      telephone: salon.telefon,
      address: {
        '@type': 'PostalAddress',
        streetAddress: salon.adres.ulica,
        postalCode: salon.adres.kodPocztowy,
        addressLocality: salon.adres.miasto,
        addressCountry: salon.adres.kraj,
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: filar.nazwa,
      itemListElement: filar.zabiegi.map((zabieg) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: bezZnacznikow(zabieg.nazwa) },
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd).replace(/</g, '\\u003c') }}
      />

      <section className="sekcja sekcja--ciemna sekcja--ozdobna">
        <Ornament polozenie="prawy-gorny" />

        <div className="ramka">
          <nav aria-label="Ścieżka nawigacji" className={style.okruszki}>
            <Link href="/">Strona główna</Link>
            <span aria-hidden="true">/</span>
            <Link href="/#oferta">{tresci.oferta.naglowek}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{filar.nazwa}</span>
          </nav>

          <div className={style.gora}>
            <div className={style.naglowekFilaru}>
              <Medalion nazwa={filar.ikona as NazwaIkony} wielkosc="duzy" />
              <p className={style.podtytul}>{filar.podtytul}</p>
              <h1 className={style.tytul}>{filar.nazwa}</h1>
              <p className={style.dlaKogo}>{filar.dlaKogo}</p>
              <p className={style.efekt}>{filar.efekt}</p>

              <PrzyciskLink href={`/${linkRezerwacji(filar.uslugaGhl)}`}>
                {tresci.oferta.przyciskKarty}
              </PrzyciskLink>
            </div>

            <div className={style.zdjecie}>
              <Image
                src={filar.obraz}
                alt={filar.alt}
                width={800}
                height={800}
                sizes="(max-width: 900px) 100vw, 44vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="sekcja sekcja--krem">
        <div className="ramka">
          <h2>Co wchodzi w skład</h2>

          <ul className={style.zabiegi}>
            {filar.zabiegi.map((zabieg) => (
              <li key={zabieg.nazwa} className={style.zabieg}>
                <h3 className={style.nazwaZabiegu}>{bezZnacznikow(zabieg.nazwa)}</h3>
                <p className={style.opisZabiegu}>{bezZnacznikow(zabieg.opis)}</p>
                <a className={style.linkZabiegu} href={`/${linkRezerwacji(filar.uslugaGhl)}`}>
                  Umów ten zabieg
                  <span className="tylko-czytnik">, {bezZnacznikow(zabieg.nazwa)}</span>
                </a>
              </li>
            ))}
          </ul>

          {kategoria && (
            <div className={style.cennik}>
              <h2 className={style.tytulCennika}>{tresci.cennik.naglowek}</h2>
              {kategoria.dopisek && <p className={style.dopisek}>{kategoria.dopisek}</p>}

              <ul className={style.ceny}>
                {kategoria.pozycje.map((pozycja) => (
                  <li key={pozycja.nazwa}>
                    <span>{pozycja.nazwa}</span>
                    <span className={style.wypelniacz} aria-hidden="true" />
                    <span className={czekaNaDane(pozycja.cena) ? style.cenaBrak : style.cena}>
                      {czekaNaDane(pozycja.cena) ? tresci.cennik.brakCeny : pozycja.cena}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {pytania.length > 0 && (
        <section className="sekcja sekcja--kosc">
          <div className="ramka">
            <p className="nadtytul">{tresci.faq.nadtytul}</p>
            <h2>{tresci.faq.naglowek}</h2>

            <div className={style.faq}>
              {pytania.map((pytanie) => (
                <details key={pytanie.pytanie} className={style.pytanie}>
                  <summary>
                    <span>{pytanie.pytanie}</span>
                    <span className={style.znacznik} aria-hidden="true">
                      <Ikona nazwa="plus" rozmiar={20} />
                    </span>
                  </summary>
                  <p>{pytanie.odpowiedz}</p>
                </details>
              ))}
            </div>

            <h2 className={style.tytulInnych}>Pozostałe obszary</h2>
            <ul className={style.inne}>
              {inne.map((pozycja) => (
                <li key={pozycja.id}>
                  <Link href={`/zabiegi/${pozycja.slug}`}>
                    <Medalion nazwa={pozycja.ikona as NazwaIkony} wielkosc="maly" />
                    <span>
                      <strong>{pozycja.nazwa}</strong>
                      <span className={style.podtytulInnego}>{pozycja.podtytul}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaKoncowe />
    </>
  )
}
