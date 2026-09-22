# Glamorous Beauty Studio Daria Bojarska

Strona gabinetu kosmetologii estetycznej w Chełmży. Next.js 16 (App Router),
TypeScript, moduły CSS. Rezerwacja prowadzi przez kalendarz, a potwierdza ją
zadatek 50 zł.

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # build produkcyjny
npm run lint
npm run kontrast  # sprawdzenie kontrastu palety wedlug WCAG
npm run zdjecia   # przygotowanie zdjec z assets-source
```

Powstała na bazie szablonu salonu kosmetycznego. Szablon dał układ,
komponenty i mechanikę, reszta jest nowa: paleta, kroje pisma, ikony,
wszystkie teksty, sześć podstron oferty i ścieżka rezerwacji z zadatkiem.

**Zanim cokolwiek opublikujesz, przeczytaj `RAPORT.md`.** Jest tam lista
wszystkiego, co czeka na dane od Pani Darii, i lista rzeczy do ustawienia
w GoHighLevel.

## Gdzie co siedzi

```
assets-source/        oryginały od klientki, nie trafiają do builda
  generated/          prompty do grafik AI
scripts/
  przygotuj-zdjecia.mjs   konwersja oryginalow do WebP
  zastepcze-zdjecia.mjs   rysowanie zdjec zastepczych w palecie marki
  kontrast.mjs            sprawdzenie kontrastu palety
public/images/        zdjecia serwowane na stronie, generowane skryptem
src/
  app/
    marka.css         PALETA, KROJE PISMA, PROPORCJE ZDJECIA
    globals.css       uklad, medalion ikony, ornament, reguly wspolne
    page.tsx          kolejnosc sekcji strony glownej
    zabiegi/[slug]/   szesc podstron filarow oferty
    zadatek/          krok 2 rezerwacji
    rezerwacja-potwierdzona/  krok 3 rezerwacji
    regulamin-rezerwacji/     zasady zadatku, DO WERYFIKACJI PRAWNEJ
    polityka-prywatnosci/     RODO
    cookies/          pliki cookie
    ikony/            arkusz ikon, strona wdrozeniowa
    api/
      kontakt/            formularz pytania
      rezerwacja/         zalozenie wizyty NIEPOTWIERDZONEJ
      platnosc/webhook/   POTWIERDZENIE wizyty po wplacie
  components/
    sekcje/           Hero, Korzysci, Oferta, Portfolio, Opinie, ONas,
                      Proces, Cennik, Kontakt, Faq, CtaKoncowe, Kalendarz
    uklad/            naglowek, stopka, pasek rezerwacji na telefonie
    ui/               przycisk, logotyp, ikony, medalion, ornament,
                      pasek krokow rezerwacji
    dane/             dane strukturalne JSON-LD
  data/               CALA TRESC STRONY
  lib/
    dane.ts           dostep do tresci i typy
    ghl.ts            kalendarz GoHighLevel
    zadatek.ts        kwota, link platnosci, szkic rezerwacji
    szkic-rezerwacji.ts  odczyt szkicu z pamieci przegladarki
```

Treść zmienia się **wyłącznie** w `src/data/`. Komponenty nie mają wpisanych
tekstów na sztywno.

## Marka

Paleta pochodzi z banera marki i siedzi w `src/app/marka.css`. Najpierw
kolory z nazwami z brandbooka (`--c-choc`, `--c-gold`…), pod nimi tokeny
semantyczne, którymi posługują się arkusze. **W komponentach nie ma ani
jednego koloru na sztywno.** Jedyne, co zostało zapisane wprost, to czerń
w maskach `mask-image`, ale to nie kolor, tylko kształt wycięcia.

Po każdej zmianie palety uruchom `npm run kontrast`. Skrypt czyta kolory
prosto z `marka.css` i sprawdza 26 par, które naprawdę występują na stronie.

Kroje pisma: **Playfair Display** na nagłówki, **Jost** na tekst,
**Cormorant Garamond** na logotyp i etykiety wersalikami, **Pinyon Script**
na dwie odręczne wstawki. Wszystkie z paczek `@fontsource`, serwowane
z własnego serwera, z subsetem `latin-ext`, więc polskie ogonki działają bez
odpytywania Google Fonts.

Ikony: `src/components/ui/Ikona.tsx`, siatka 24 na 24, kreska 1,5 piksela.
Na stronie stoją w medalionie, czyli ciemnym krążku ze złotym pierścieniem.
Cały zestaw obejrzysz pod adresem **`/ikony`**, razem z paletą i krojami.

## Rezerwacja i zadatek

Rezerwację potwierdza wpłata 50 zł. Ścieżka ma trzy kroki i widoczny pasek
postępu.

1. Kalendarz zbiera termin, dane i zgody, a trasa `/api/rezerwacja` zakłada
   w GHL wizytę **niepotwierdzoną**.
2. Strona `/zadatek` prowadzi do płatności.
3. Operator płatności woła `/api/platnosc/webhook`, ten sprawdza podpis
   i dopiero wtedy wizyta staje się **potwierdzona**.

**Powrót klientki na stronę z parametrem w adresie niczego nie potwierdza.**
Adres da się wpisać z palca, podpisu webhooka nie. Trasa webhooka liczy HMAC
SHA-256 z surowego ciała żądania, porównuje go porównaniem odpornym na
pomiar czasu, pilnuje idempotencji po identyfikatorze zdarzenia i sprawdza
kwotę. Bez zmiennej `WEBHOOK_PLATNOSCI_SEKRET` trasa jest zamknięta
i odpowiada błędem 503, zamiast wpuszczać kogokolwiek, kto zna adres.

Dopóki `NEXT_PUBLIC_GHL_KALENDARZ_URL` jest puste, działa kalendarz
podglądowy z napisem, że terminy są przykładowe. **Nie usuwaj tego napisu,
dopóki nie podepniesz GHL.** Bez niego klientka może wyjść z przekonaniem,
że ma potwierdzoną rezerwację, której nikt nie potwierdził.

Zmienne środowiskowe: wzór w `.env.example`, opis w `RAPORT.md`.

## Zasady, na których stoi ten układ

- **Jeden ciągły ruch na całej stronie**: ściana opinii. Zatrzymuje się po
  najechaniu i po dotknięciu, przy `prefers-reduced-motion` stoi.
- **Tekst startuje z 17 pikseli** na telefonie i 18 wyżej. Klientki to
  w większości kobiety po czterdziestce, czytelność wygrywa z efektem.
- **Złoto nie jest kolorem małego tekstu na jasnym tle.** Do tego służą
  `--tusz` i `--tusz-2`. Złoto to kreski, ramki, ikony i duże elementy.
- **Obrys pola formularza ma własny token** `--obrys-pola`, ciemniejszy od
  piaskowego. Piaskowy dawał na bieli 1,63 do 1, czyli dla części klientek
  pole po prostu nie istniało.
- **Fokus ma dwa pierścienie**, ciemny i złoty, żeby był widoczny i na
  kremie, i na czekoladzie.
- **Cennik i FAQ stoją na znacznikach `details`**, więc rozwijają się bez
  JavaScriptu i obsługują klawiaturę bez dokładania atrybutów.
- **Znaczniki `{TODO: ...}` nigdy nie trafiają na stronę.** Funkcje
  `czekaNaDane` i `bezZnacznikow` z `lib/dane.ts` albo chowają takie pole,
  albo podstawiają zdanie zastępcze. Dotyczy to też cen i danych
  strukturalnych: odpowiedź z TODO nie idzie do FAQPage.

## Wyniki

Lighthouse, wersja mobilna, build produkcyjny:

| Strona | Wydajność | Dostępność | Dobre praktyki | SEO |
| --- | --- | --- | --- | --- |
| `/` | 96 | 100 | 100 | 100 |
| `/zabiegi/sylwetka` | 94 | 100 | 100 | 100 |

`npm run kontrast`: 26 z 26 par przechodzi próg WCAG AA.

## Wdrożenie

Trasy w `src/app/api` potrzebują serwera, więc strona nie zadziała jako
zestaw plików statycznych. Na Netlify podepnij repozytorium, wtyczka Next.js
uruchomi trasy sama. Ustawienia są w `netlify.toml`.

Zmienne z przedrostkiem `NEXT_PUBLIC_` wchodzą do kodu podczas builda, więc
po ich zmianie trzeba wywołać **Clear cache and deploy site**.
