# Raport wdrożeniowy

Stan na dzień oddania strony. Wszystko, co jest tu opisane jako TODO, blokuje
publikację albo trzeba to potwierdzić, zanim strona zobaczy pierwszą klientkę.

---

## 1. Czego brakuje

### 1.1 Od Pani Darii

| Czego brakuje | Gdzie to wchodzi | Dlaczego to ważne |
| --- | --- | --- |
| **Cennik, 28 pozycji** | `src/data/cennik.json` | Do czasu uzupełnienia w miejscu kwoty stoi zdanie „Cenę ustalamy na konsultacji”. Nic nie jest zmyślone, ale klientka nie ma punktu odniesienia. |
| **Godziny otwarcia** | `src/data/salon.json` | **Wpisane są godziny zastępcze**, pon do pt 9 do 18 i sobota 9 do 14. Widać je w czterech miejscach naraz: stopka, kontakt, dane strukturalne i wolne terminy w kalendarzu. Błędne godziny to realny problem. |
| **Dokładne współrzędne z wizytówki Google** | `src/data/salon.json`, pole `geo` | Teraz jest środek Chełmży. Dane strukturalne wskazują przez to nie ten punkt co trzeba. |
| **E-mail, NIP** | `src/data/salon.json` | Potrzebne w polityce prywatności i regulaminie. |
| **Adresy profili Instagram i Facebook** | `src/data/salon.json` | Sekcja „Obserwuj” w stopce nie pokazuje się wcale, dopóki pola są puste. |
| **Bezpośredni odnośnik do wizytówki Google** | `src/data/salon.json` | Teraz jest wyszukiwanie po nazwie, działa, ale odnośnik wprost jest pewniejszy. |
| **Opinie z Google** | `src/data/opinie.json` | Wpisana jest **jedna** zweryfikowana: „Robiłam laminację brwi. Pełen profesjonalizm, miła atmosfera”, bez imienia autorki. Resztę trzeba przepisać z wizytówki **dosłownie**, razem z literówkami. Publikowanie przerobionych albo zmyślonych opinii konsumenckich jest zakazane. |
| **Doświadczenie, szkolenia, certyfikaty** | `src/data/tresci.json`, `oNas.todo` | Akapit jest przygotowany, ale się nie renderuje, dopóki zawiera znacznik. Warto napisać go razem z Panią Darią i dać jej przeczytać na głos. |
| **Zakres elektrokoagulacji i usuwania włókniaków** | `src/data/uslugi.json` | Czy wymagana jest konsultacja przed zabiegiem. |
| **Drenaż limfatyczny: ręczny czy aparaturowy, jakie partie, ile trwa** | `src/data/uslugi.json` | Opis jest ogólny właśnie dlatego, że tego nie wiemy. |
| **Endermologia: rekomendowana liczba zabiegów w serii** | `src/data/uslugi.json` | |
| **Konsultacja: osobna pozycja w kalendarzu, płatna czy nie, odliczana czy nie** | `src/data/uslugi.json`, FAQ | Wpływa na ustawienie kalendarza w GHL. |
| **Zasady odwołania i przeniesienia wizyty** | `src/data/faq.json`, `/regulamin-rezerwacji` | Propozycja w regulaminie: 48 godzin. Do zatwierdzenia. |
| **Ogólne zalecenia przed wizytą** | `src/data/faq.json` | Na przykład co odstawić przed peelingami i terapiami przebarwień. |
| **Zdjęcia i logo z Dysku Google** | `assets-source/` | Patrz punkt 1.3. |

### 1.2 Ode mnie albo od Ciebie

| Czego brakuje | Gdzie |
| --- | --- |
| Adres kalendarza GoHighLevel | `NEXT_PUBLIC_GHL_KALENDARZ_URL` |
| Trzy adresy webhooków GHL | `GHL_WEBHOOK_URL`, `GHL_WEBHOOK_REZERWACJA_URL`, `GHL_WEBHOOK_POTWIERDZENIE_URL` |
| Link płatności zadatku i sekret webhooka | `NEXT_PUBLIC_LINK_PLATNOSCI_ZADATEK`, `WEBHOOK_PLATNOSCI_SEKRET` |
| Domena produkcyjna | `NEXT_PUBLIC_ADRES_STRONY`, teraz `https://glamorousbeautystudio.pl` |
| Przegląd prawny regulaminu rezerwacji | patrz punkt 5 |
| Wygenerowanie grafik AI | `assets-source/generated/PROMPTS.md` |
| Trwały magazyn idempotencji webhooka | patrz punkt 4.4 |

### 1.3 Czego nie udało się pobrać i dlaczego

Materiały leżą na Dysku Google w folderze **Glamorous Beauty Studio Daria
Bojarska** (`1Ewr1F1DRg4NgRFShA333FNFeexqcmvb9`). Widziałem ich listę, ale
**nie mogłem pobrać plików**: polityka sieciowa tego środowiska blokuje
połączenia do `drive.google.com`. Pliki trzeba pobrać ręcznie i położyć
w `assets-source/`, dokładnie tak, jak opisuje `assets-source/README.md`.

Dotyczy to:

- `Logo.png` (`1CsE2rjMReywOJqCnJwF1N66f7rFmbphm`),
- `O nas - Daria Bojarska.jpg` (`1tcwFscRLBaL_GQt4x6aJT3ZbsVfnKuIv`),
- dwunastu zdjęć z podfolderu `Portfolio` (`1Lj1_LUx0jZ-xSoUmyKlhhdlGyVq2aE83`).

Nazwy plików z Dysku są zmapowane na pozycje w `src/data/portfolio.json`,
w polu `zrodloNaDysku`, więc wiadomo, który plik jest którym zdjęciem.

Grafik AI też nie wygenerowałem: konto Higgsfield podpięte do tej sesji ma
**zero kredytów i plan darmowy**. Komplet promptów, razem ze stylem bazowym
i zasadami twardymi, leży w `assets-source/generated/PROMPTS.md`.

Do czasu dostarczenia prawdziwych zdjęć na stronie stoją kadry zastępcze
narysowane w palecie marki, generowane skryptem
`node scripts/zastepcze-zdjecia.mjs`. Nie przedstawiają nikogo i niczego nie
obiecują. Po wrzuceniu prawdziwych plików wystarczy `npm run zdjecia`.

---

## 2. Kontrast i dostępność

`npm run kontrast` sprawdza 26 par, które naprawdę występują na stronie.
Skrypt czyta kolory prosto z `src/app/marka.css`, więc nie da się ich
rozjechać z tym, co widać.

**Wszystkie 26 par przechodzi próg WCAG AA.** Najciaśniejsze:

| Para | Wynik | Próg |
| --- | --- | --- |
| Karmel na kremie, kreski i ikony | 3,08 | 3,0 |
| Obramowanie pól formularza na kremie | 3,08 | 3,0 |
| Karmel na bieli | 3,88 | 3,0 |
| Jasne złoto na brązie | 5,24 | 4,5 |
| Złoto na czekoladzie | 5,05 | 4,5 |
| Jasne złoto na powierzchni ciemnej | 5,96 | 4,5 |

Trzy rzeczy z palety w briefie musiałem zmienić, bo nie przechodziły:

1. **Fokus w `#E0BA69` na kremowym tle daje 1,44 do 1.** Obwódka znikała
   dokładnie tam, gdzie stoi większość formularzy. Teraz fokus ma **dwa
   pierścienie**: ciemny trzyma kontrast na jasnych sekcjach, złoty na
   ciemnych. Jasne złoto zostało, tak jak w briefie, tylko nie samo.
2. **Obramowanie pól formularza w piaskowym beżu daje na bieli 1,63 do 1.**
   Pole tekstowe to element sterujący, jego krawędź potrzebuje 3 do 1. Jest
   osobny token `--obrys-pola` w karmelu: 3,88 na bieli, 3,08 na kremie.
   Obramowania ozdobne kart zostały piaskowe, bo nie są sterowaniem.
3. **Złoto `#C99A3D` jako mały tekst na powierzchni ciemnych kart daje
   4,28 do 1.** Podtytuły filarów, odnośniki w kartach i podpisy autorek
   opinii chodzą na jasnym złocie: 5,96 do 1.

### Lighthouse, wersja mobilna, build produkcyjny

| Strona | Wydajność | Dostępność | Dobre praktyki | SEO |
| --- | --- | --- | --- | --- |
| `/` | **96** | **100** | **100** | **100** |
| `/zabiegi/sylwetka` | **94** | **100** | **100** | **100** |

Progi z briefu: wydajność 90, dostępność 95, SEO 100. Wszystkie przekroczone.

Po drodze naprawione zgłoszenia z audytu: kontrast złota na kartach, nagłówek
`h4` przeskakujący poziom w kalendarzu oraz logotyp, którego nazwa dostępna
nie zawierała widocznego napisu (osoba sterująca głosem mówiła „Glamorous”
i nic się nie działo).

Sprawdzone także: brak błędów w konsoli i brak poziomego suwaka przy 1440,
768 i 390 pikselach. Karuzela oferty przewija się w poziomie u siebie, tak
jak ma, ale sama strona nie.

---

## 3. Grafiki i gdzie trafiają

| Plik | Sekcja | Skąd |
| --- | --- | --- |
| `public/images/hero/zabieg.webp` | sekcja główna | zastępczy, docelowo `assets-source/hero-foto.jpg` |
| `public/images/o-nas/wlascicielka.webp` | O nas | zastępczy, docelowo `O nas - Daria Bojarska.jpg` z Dysku |
| `public/images/uslugi/zdrowa-skora.webp` | filar 1, karta i podstrona | zastępczy, prompt w `PROMPTS.md` |
| `public/images/uslugi/problemy-skorne.webp` | filar 2 | j.w. |
| `public/images/uslugi/odmladzanie.webp` | filar 3 | j.w. |
| `public/images/uslugi/sylwetka.webp` | filar 4, sylwetka i drenaż | j.w. |
| `public/images/uslugi/oprawa-oka.webp` | filar 5 | j.w. |
| `public/images/uslugi/doradztwo.webp` | filar 6 | j.w. |
| `public/images/portfolio/portfolio-01` do `-12`, duże i mini | Efekty | zastępcze, docelowo podfolder `Portfolio` z Dysku |
| `src/app/icon.svg` | ikona karty przeglądarki | sygnet z diamentem, **geometria zastępcza** |

Logotyp w nagłówku i stopce składa się z tekstu i rysowanego sygnetu.
Po otrzymaniu logo w wektorze trzeba podmienić `src/components/ui/Logo.tsx`
oraz ścieżki diamentu w `icon.svg` i w ikonie `diament`.

**Zdjęcia efektów są dowodem.** Wolno je kadrować, skalować i kompresować.
Żadnego wygładzania skóry, zmiany koloru ani filtrów upiększających.

---

## 4. GoHighLevel, krok po kroku

Opisane tak, żeby dało się to odtworzyć przy następnej klientce.

### 4.1 Usługi i kalendarz

1. **Usługi z czasami.** Osobna usługa na każdy zabieg z `src/data/uslugi.json`,
   razem z czasem trwania. Identyfikatory, które strona wysyła jako
   preselekcję, to pola `uslugaGhl`: `zdrowa-skora`, `problemy-skorne`,
   `odmladzanie`, `sylwetka`, `oprawa-oka`, `doradztwo`.
2. **Kalendarz usług.** Service Calendar albo Service Menu. Ustaw godziny
   pracy, bufory między wizytami i minimalne wyprzedzenie rezerwacji.
3. **Adres widżetu.** Calendars → kalendarz → Share → Embed, bierzesz sam
   adres z atrybutu `src`. Wklejasz do `NEXT_PUBLIC_GHL_KALENDARZ_URL`.
   Od tego momentu kalendarz podglądowy znika sam, bez zmian w kodzie.

### 4.2 Webhooki przychodzące

Trzy workflow z wyzwalaczem **Inbound Webhook**:

| Workflow | Zmienna | Co dostaje |
| --- | --- | --- |
| Pytanie z formularza | `GHL_WEBHOOK_URL` | `imie`, `telefon`, `usluga`, `wiadomosc`, `zrodlo`, `wyslane` |
| Rezerwacja niepotwierdzona | `GHL_WEBHOOK_REZERWACJA_URL` | `imie`, `telefon`, `usluga`, `termin`, `terminIso`, `status: niepotwierdzona`, `zgodaMarketing`, `zrodlo`, `wyslane` |
| Potwierdzenie po wpłacie | `GHL_WEBHOOK_POTWIERDZENIE_URL` | `idRezerwacji`, `idTransakcji`, `kwotaGrosze`, `telefon`, `status: potwierdzona`, `tag: zadatek-oplacony`, `zaksiegowane` |

Workflow rezerwacji powinien odpowiedzieć JSON-em z polem `id`,
`appointmentId` albo `contactId`. Strona zapamięta ten identyfikator
i poda go dalej przy płatności. Bez tego ścieżka nadal działa, tylko wpłatę
wiąże się z klientką po numerze telefonu.

### 4.3 Płatność zadatku

Do sprawdzenia w panelu, zanim cokolwiek podepniesz: **czy kalendarz Pani
Darii obsługuje pobranie płatności przy rezerwacji ze stałą kwotą 50 zł.**
Jeśli tak i jeśli w dostępnych metodach jest **BLIK**, to jest wariant lepszy
(wariant A z ustaleń): jeden krok mniej i mniej rzeczy, które mogą pójść nie
tak. Cała ścieżka `/zadatek` staje się wtedy niepotrzebna, bo widżet GHL
obsługuje płatność u siebie.

Jeśli BLIK nie jest dostępny, zostaje wariant B, ten zbudowany:

1. Utwórz link płatności na 50 zł w GHL Payments albo Stripe Checkout.
   **Kwotę ustaw po stronie operatora, nigdy w adresie.**
2. Włącz **BLIK i Przelewy24**, nie same karty. Dla polskich klientek
   czterdzieści plus BLIK to nie dodatek, tylko warunek.
3. Adres linku wklej do `NEXT_PUBLIC_LINK_PLATNOSCI_ZADATEK`.
4. Sekret, którym operator podpisuje webhooki, wklej do
   `WEBHOOK_PLATNOSCI_SEKRET`.
5. Webhook operatora skieruj na `https://TWOJA-DOMENA/api/platnosc/webhook`.

### 4.4 Bezpieczeństwo płatności

Trasa `/api/platnosc/webhook` to **jedyne miejsce w projekcie, które ma prawo
potwierdzić wizytę**. Pilnuje czterech rzeczy:

- **Podpis.** HMAC SHA-256 z surowego ciała żądania, porównanie odporne na
  pomiar czasu. Bez zgodnego podpisu odpowiedź 401 i nic się nie dzieje.
- **Idempotencja.** Każde zdarzenie obsłużone dokładnie raz, po
  identyfikatorze. Operatorzy ponawiają webhooki, czasem kilka razy pod rząd.
- **Kwota.** Wpłata niższa od zadatku nie potwierdza wizyty.
- **Brak sekretu to zamknięta trasa.** Odpowiedź 503, zamiast wpuszczać
  kogokolwiek, kto zna adres.

**Jedna rzecz do dokończenia przed produkcją.** Lista obsłużonych zdarzeń
leży teraz w pamięci procesu. Wystarcza przy jednym serwerze i znika przy
restarcie. Na Netlify, gdzie trasa może wystartować w kilku instancjach,
podmień ją na wspólny magazyn: tabelę, Redis albo pole w kontakcie GHL.
Miejsce jest opisane komentarzem w pliku. Bez tego podwójny webhook po
restarcie przejdzie drugi raz, co samo w sobie nie zaszkodzi, ale klientka
dostanie dwa SMS-y.

### 4.5 Automatyzacje

Wyzwalaczem ma być **Appointment Status**, nie czas. Przy wyzwalaczu czasowym
klientka dostanie tę samą wiadomość kilka razy.

Do napisania jeszcze pięć wiadomości: potwierdzenie po opłaceniu zadatku,
przypomnienie o nieopłaconym zadatku, anulowanie z braku zadatku,
przypomnienie 24 godziny przed wizytą i podziękowanie po wizycie z prośbą
o opinię w Google. Zasady: zwykła proza, bez myślników, bez wypunktowań,
krótko, z imieniem klientki, podpis „Daria, Glamorous Beauty Studio”. SMS
do 160 znaków tam, gdzie się da. **Sprawdź w panelu, czy bramka SMS radzi
sobie z polskimi znakami**, zanim zrezygnujesz z ogonków.

Do ustalenia dwa czasy: po ilu godzinach idzie przypomnienie o nieopłaconym
zadatku i po ilu termin zwalnia się sam. W regulaminie stoi propozycja
2 godziny i 12 godzin.

---

## 5. Uwaga prawna, przeczytaj zanim opublikujesz regulamin

**Słowo „zadatek” ma w polskim prawie konkretne skutki**, opisane
w art. 394 Kodeksu cywilnego. Przy odstąpieniu z winy klientki zadatek
przepada, a przy odstąpieniu z winy gabinetu wraca **w podwójnej
wysokości**. To coś zupełnie innego niż zaliczka, którą zwraca się
w całości.

Materiały od Pani Darii mówią „zadatek”, więc strona też tak mówi. Trzeba
jednak świadomie ustalić, czy to naprawdę zadatek w rozumieniu przepisu, czy
raczej zaliczka, i te zasady powinien przejrzeć prawnik.

Do tego czasu `/regulamin-rezerwacji` ma na górze wyraźną adnotację
`{TODO: treść do weryfikacji}`, a każdy punkt ze skutkiem finansowym stoi
jako propozycja, nie jako obowiązująca zasada. **Nie zdejmuj tej adnotacji,
dopóki regulamin nie jest zatwierdzony.**

To samo dotyczy polityki prywatności: opisuje, jak faktycznie działa strona,
ale nie jest poradą prawną.

---

## 6. Wdrożenie

1. Ustaw zmienne środowiskowe w panelu hostingu, nigdy w kodzie. Wzór
   w `.env.example`.
2. Podepnij repozytorium do Netlify. Wtyczka Next.js uruchomi trasy z `api`
   sama. Ustawienia są w `netlify.toml`, Node 22.
3. Ustaw `NEXT_PUBLIC_ADRES_STRONY` na docelową domenę. Zasila sitemap,
   robots, dane strukturalne i Open Graph.
4. Zmienne z przedrostkiem `NEXT_PUBLIC_` wchodzą do kodu podczas builda,
   więc po ich zmianie wywołaj **Clear cache and deploy site**.
5. Po wdrożeniu przetestuj płatność w trybie testowym operatora, w czterech
   wariantach: **płatność udana, odrzucona, porzucona i podwójny webhook**.
6. Zgłoś stronę w Google Search Console i sprawdź dane strukturalne
   w Rich Results Test.

### Lista kontrolna przed publikacją

- [ ] Cennik uzupełniony, znaczniki `{TODO: cena}` zniknęły
- [ ] Prawdziwe godziny otwarcia
- [ ] Współrzędne z wizytówki Google
- [ ] E-mail, NIP, profile społecznościowe
- [ ] Opinie przepisane z Google dosłownie
- [ ] Zdjęcia z Dysku wrzucone, `npm run zdjecia` uruchomiony
- [ ] `--hero-proporcje` i wymiary w `portfolio.json` przepisane
- [ ] Logo w wektorze podmienione w `Logo.tsx` i `icon.svg`
- [ ] Regulamin rezerwacji zatwierdzony, adnotacja zdjęta
- [ ] Wszystkie flagi `doPotwierdzenia` w `faq.json` przestawione na `false`
- [ ] Kalendarz GHL podpięty, zdanie o kalendarzu podglądowym zniknęło samo
- [ ] Płatność przetestowana w trybie testowym, cztery warianty
- [ ] Magazyn idempotencji webhooka przeniesiony poza pamięć procesu
- [ ] `npm run build`, `npm run lint` i `npm run kontrast` przechodzą
- [ ] Strona sprawdzona na szerokości telefonu, nie tylko na pulpicie

---

## 7. Czego nie zmieniałem względem szablonu

Układ, komponenty, animacje i mechanika rezerwacji zostały. Zmieniona
została skórka i cała treść. Trzy odstępstwa od szablonu, wszystkie
świadome:

1. **Kolejność sekcji.** Dowód społeczny poszedł w górę: efekty i opinie
   stoją zaraz po ofercie, przed sekcją o właścicielce i przed cennikiem.
   Klientka, która pierwszy raz słyszy o gabinecie, potrzebuje
   potwierdzenia od kogoś innego niż sam gabinet.
2. **Nowe sekcje.** Pasek korzyści pod sekcją główną, „Jak wygląda wizyta”
   przed cennikiem i ciemne wezwanie na końcu strony.
3. **Rezerwacja ma trzy kroki zamiast jednego**, bo doszedł zadatek.
   Informacja o nim stoi **nad kalendarzem**, przed wyborem terminu, a nie
   na końcu ścieżki. Klientka, która dowiaduje się o opłacie dopiero po
   podaniu numeru telefonu, czuje się wciągnięta w coś, na co się nie
   pisała.

Grep po całym projekcie nie znajduje już ani jednego śladu szablonu ani
poprzedniej klientki: nazwisk, nazwy gabinetu, starych kolorów HEX, starych
krojów pisma, starych nazw usług ani starych nazw plików graficznych.
