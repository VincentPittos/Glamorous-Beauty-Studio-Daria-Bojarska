# Materiały od klientki

Tu leżą oryginały. Skrypt `npm run zdjecia` czyta je, przerabia na WebP
i zapisuje do `public/images/`. Oryginały nie trafiają do builda, więc mogą
ważyć swoje.

## Czego brakuje i skąd to wziąć

Wszystkie pliki leżą na Dysku Google, w folderze **Glamorous Beauty Studio
Daria Bojarska** (`1Ewr1F1DRg4NgRFShA333FNFeexqcmvb9`). Sesja, w której
powstawała ta strona, nie miała dostępu sieciowego do `drive.google.com`,
więc zdjęcia trzeba pobrać ręcznie i położyć tutaj.

| Gdzie położyć | Co to jest | Skąd |
| --- | --- | --- |
| `hero-foto.jpg` | sekcja główna | {TODO: brak w folderze na Dysku, do wybrania z Portfolio albo do wygenerowania, patrz `generated/PROMPTS.md`} |
| `wlascicielka.jpg` | sekcja o nas | `O nas - Daria Bojarska.jpg` (`1tcwFscRLBaL_GQt4x6aJT3ZbsVfnKuIv`) |
| `uslugi/<id>.jpg` | po jednym na filar oferty | `generated/PROMPTS.md`, sześć kadrów |
| `portfolio/portfolio-01.jpg` do `portfolio-12.jpg` | efekty i praca w gabinecie | podfolder `Portfolio` (`1Lj1_LUx0jZ-xSoUmyKlhhdlGyVq2aE83`) |
| `logo.png` | logotyp | `Logo.png` (`1CsE2rjMReywOJqCnJwF1N66f7rFmbphm`) |

Identyfikatory filarów, czyli nazwy plików w `uslugi/`:

```
zdrowa-skora  problemy-skorne  odmladzanie  sylwetka  oprawa-oka  doradztwo
```

## Zdjęcia portfolio

Pliki na Dysku mają nazwy z Facebooka, a skrypt bierze je alfabetycznie.
Przed wrzuceniem **przemianuj je po kolei**, zgodnie z polem `zrodloNaDysku`
w `src/data/portfolio.json`. Pierwsze zdjęcie zajmuje w mozaice dwa pola
w pionie i w poziomie, więc na pozycji `portfolio-01` postaw najmocniejszy
kadr.

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

Skrypt wypisze wymiary każdego pliku. Dwie rzeczy przepisz ręcznie:

1. proporcje zdjęcia głównego do `--hero-proporcje` w `src/app/marka.css`,
2. wymiary zdjęć portfolio do `src/data/portfolio.json`.

Bez pierwszego zdjęcie w sekcji głównej zostanie przycięte albo rozciągnięte.
Bez drugiego siatka galerii przeskakuje w trakcie ładowania.
