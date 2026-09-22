// Projekt nie używa Tailwinda, style siedzą w modułach CSS.
//
// Ten plik jest tu po to, żeby PostCSS przestał szukać konfiguracji w
// katalogach wyżej. Bez niego bierze ustawienia z repozytorium nadrzędnego
// i wywala się na wtyczce, której tutaj nie ma.
const konfiguracja = { plugins: {} }

export default konfiguracja
