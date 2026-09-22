# Prompty do grafik AI

**Sześć kadrów do filarów oferty jest już na stronie.** Przyszły z Dysku
Google, z podfolderu `Oferta`, i leżą w `assets-source/uslugi/`. Prompty
poniżej zostają jako zapis tego, co było zamawiane, i na wypadek gdyby
któryś kadr trzeba było powtórzyć albo dołożyć nowy filar.

Kadry `proces-01` i `cta-tlo` nadal nie powstały, ale obie sekcje radzą sobie
bez nich: pierwsza stoi na ikonach, druga na ornamencie i gradiencie.

Grafiki miały powstać przez Higgsfield, model Nano Banana Pro. Konto podpięte
do tej sesji ma zero kredytów i plan darmowy, więc tą drogą nic nie zostało
wygenerowane.

## Zasady twarde

- Grafiki AI ilustrują **usługi i klimat**. Nigdy jako „przed i po”, nigdy
  jako efekt zabiegu, nigdy jako Pani Daria. Efekty pokazujemy wyłącznie ze
  zdjęć z Portfolio.
- Przy kadrach z kosmetologiem widać **tylko dłonie i przedramiona
  w rękawiczkach**, bez twarzy, żeby nikt nie pomylił jej z Panią Darią.
- Bez napisów, logotypów i znaków marek na urządzeniach. Urządzenia
  generyczne, białe albo perłowe.
- Modelki: kobiety o urodzie środkowoeuropejskiej, większość w wieku 38 do
  55 lat, jedna do dwóch w wieku 25 do 35. Naturalna skóra z widoczną
  fakturą i porami, naturalne zmarszczki mimiczne u kobiet 45+, bez
  plastikowego wygładzenia, bez przesadnego makijażu.
- Spójność serii: to samo światło, ta sama gradacja kolorów, to samo wnętrze
  gabinetu we wszystkich kadrach.
- Po minimum **3 warianty na kadr**. Odrzuć każdy z nienaturalnymi dłońmi,
  oczami, zębami albo skórą jak z plastiku.
- Eksport do WebP i AVIF, wersje 640, 1024 i 1600 pikseli, `srcset`, lazy
  loading poza sekcją główną. Skrypt `npm run zdjecia` robi WebP sam, resztę
  trzeba dołożyć ręcznie albo zostawić optymalizatorowi Next.js.

## Styl bazowy

Dopisz do **każdego** promptu poniżej:

```
Hyperrealistic editorial beauty photography, shot on full-frame camera, 85mm lens, f/2.0, soft warm diffused window light from the left, natural skin texture with visible pores and fine lines, minimal natural makeup, no retouching look, calm serene expression. Color grading in warm cream, sand, caramel and soft chocolate tones (#F1E1CD, #DFC5A6, #A87550, #4A2912), subtle gold highlights. Interior: bright, minimal, elegant cosmetology studio with cream walls, beige linen towels, warm wood and a few eucalyptus leaves. Shallow depth of field, clean negative space for text. No text, no logos, no watermark, no plastic skin, no oversaturation.
```

## Lista kadrów

Nazwa pliku mówi, gdzie ma trafić po wygenerowaniu.

### `hero-foto` → `assets-source/hero-foto.jpg`

Sekcja główna. Dwie wersje: 4:5 i 16:9.

```
Woman around 45 years old, eyes closed, lightly touching her jawline with fingertips, glowing healthy skin, bare shoulders wrapped in cream towel, profile three quarters, composition similar to a calm beauty campaign, lots of negative space on the right side for headline
```

### `zdrowa-skora` → `assets-source/uslugi/zdrowa-skora.jpg`

Filar 1, proporcje 4:5.

```
Woman about 36 lying on a treatment bed with a beige towel headband, gloved hands of a cosmetologist gently applying a light serum with a soft generic white device, hydrated glowing skin, top-down three quarter angle
```

### `problemy-skorne` → `assets-source/uslugi/problemy-skorne.jpg`

Filar 2, proporcje 4:5.

```
Woman about 29 with realistic mild skin texture and a few subtle blemishes on cheeks, calm and confident, cosmetologist's gloved hands applying a clear peel solution with a fan brush, honest and respectful portrayal, no exaggerated acne
```

### `odmladzanie` → `assets-source/uslugi/odmladzanie.jpg`

Filar 3, proporcje 4:5.

```
Elegant woman about 52 with natural fine lines and radiant firm skin, relaxed on treatment bed, gloved hands performing a gentle face lifting massage along the jawline, sense of rest and renewal
```

### `sylwetka` → `assets-source/uslugi/sylwetka.jpg`

Filar 4, proporcje 4:5. Ten filar obejmuje też drenaż limfatyczny, więc kadr
ma czytać się jako spokojna praca na ciele, a nie jako sam sprzęt.

```
Woman about 40 lying on her side on a treatment bed, body tastefully draped in cream towel, only thigh and hip visible, a generic white vacuum massage (endermology) head gliding on the skin, tasteful, non-sexual, spa-like
```

Wariant zapasowy, pod drenaż limfatyczny:

```
Gloved hands of a cosmetologist performing a slow rhythmic lymphatic drainage massage on a calf and ankle, woman about 44 lying relaxed under a cream towel, only the leg visible, soft warm light, tasteful, non-sexual, spa-like, sense of relief and lightness
```

### `oprawa-oka` → `assets-source/uslugi/oprawa-oka.jpg`

Filar 5, proporcje 4:5.

```
Extreme close-up of closed eye of a woman about 38 with naturally lifted, curled lashes and neatly laminated brows, soft light, visible natural skin texture around the eye, no false lashes
```

### `doradztwo` → `assets-source/uslugi/doradztwo.jpg`

Filar 6, proporcje 4:5.

```
Woman about 48 sitting in a cream armchair, smiling softly, listening during a consultation, cosmetologist visible only from behind or as hands holding a notebook and a skin analysis tablet, warm trustworthy mood
```

### `proces-01`

Sekcja „Jak wygląda wizyta”, proporcje 3:2. Obecnie ta sekcja stoi na
ikonach i tła nie potrzebuje, więc kadr jest opcjonalny.

```
Detail shot of a prepared treatment station: folded beige towels, glass bottles without labels, eucalyptus sprig, soft gold light
```

### `cta-tlo`

Sekcja CTA końcowa, proporcje 16:9. Obecnie ta sekcja ma tło z ornamentem
i gradientem, więc kadr jest opcjonalny.

```
Soft blurred close-up of cream silk fabric with warm light and a leaf shadow, similar mood to a luxury stationery background, very subtle, for dark overlay
```
