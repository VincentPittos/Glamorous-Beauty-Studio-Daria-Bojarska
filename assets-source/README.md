# Materiały od klientki

Tu leżą oryginały. Skrypt `npm run zdjecia` czyta je, przerabia na WebP
i zapisuje do `public/images/`. Oryginały nie trafiają do builda, więc mogą
ważyć swoje.

## Co tu już jest

| Plik | Co to jest | Skąd |
| --- | --- | --- |
| `hero-foto.webp` | sekcja główna | wgrane bezpośrednio w rozmowie |
| `wlascicielka.jpg` | sekcja o nas | `O nas - Daria Bojarska.jpg` z Dysku |
| `uslugi/<id>.png`, sześć plików | po jednym na filar oferty | podfolder `Oferta` z Dysku |
| `portfolio/portfolio-01.jpg` do `-12.jpg` | efekty i praca w gabinecie | podfolder `Portfolio` z Dysku |

## Czego jeszcze brakuje

| Plik | Co to jest | Skąd |
| --- | --- | --- |
| `logo.png` | logotyp | `Logo.png` (`1CsE2rjMReywOJqCnJwF1N66f7rFmbphm`) |

Folder na Dysku Google nazywa się **Glamorous Beauty Studio Daria Bojarska**
(`1Ewr1F1DRg4NgRFShA333FNFeexqcmvb9`). Bezpośrednie połączenie do
`drive.google.com` jest w środowisku roboczym zablokowane polityką sieciową,
więc pliki idą przez konektor Dysku, a nie przez `curl`.

Identyfikatory filarów, czyli nazwy plików w `uslugi/`:

```
zdrowa-skora  problemy-skorne  odmladzanie  sylwetka  oprawa-oka  doradztwo
```

## Zdjęcia portfolio

Pliki na Dysku mają nazwy z Facebooka, a skrypt bierze je alfabetycznie,
więc leżą tu przemianowane po kolei, zgodnie z polem `zrodloNaDysku`
w `src/data/portfolio.json`. Kolejność wyświetlania ustala ten plik, nie
nazwy, więc żeby przestawić galerię, przestaw pozycje w `portfolio.json`.

**Nie retuszuj efektów zabiegów.** Żadnego wygładzania skóry, zmiany koloru
ani filtrów upiększających. To jest dowód, a nie ilustracja. Wolno kadrować,
skalować i kompresować, i tyle.

## Logo

Z `Logo.png` trzeba przygotować:

- wersję z przezroczystym tłem,
- wersję jasną na ciemne tło, tekst `#FFFDF7`, diament `#E0BA69`,
- wersję poziomą do nawigacji,
- favicon z samego diamentu: 16, 32, 180 i 512 pikseli,
- jeśli się da, wektor SVG.

Do czasu ich przygotowania logotyp na stronie składa się z tekstu i sygnetu
rysowanego kreską, w `src/components/ui/Logo.tsx`. Diament jest tam
geometrią zastępczą i trzeba go podmienić na ten z pliku marki.

## Po wrzuceniu plików

```bash
npm run zdjecia
```

Skrypt wypisze wymiary każdego pliku. Dwie rzeczy przepisz ręcznie po
dołożeniu nowych zdjęć:

1. proporcje zdjęcia głównego do `--hero-proporcje` w `src/app/marka.css`,
2. wymiary zdjęć portfolio do `src/data/portfolio.json`.

Bez pierwszego zdjęcie w sekcji głównej zostanie przycięte albo rozciągnięte.
Bez drugiego siatka galerii przeskakuje w trakcie ładowania.
