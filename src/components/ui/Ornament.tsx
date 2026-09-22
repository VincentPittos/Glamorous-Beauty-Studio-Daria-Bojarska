/**
 * Złota gałązka z banera marki, rysowana kreską.
 *
 * Czysta dekoracja: leży pod treścią, nie łapie kursora i jest ukryta przed
 * czytnikami ekranu. Stawiamy ją oszczędnie, najwyżej co drugą sekcję, bo
 * powtórzona wszędzie przestaje być ozdobą, a zaczyna być szumem.
 */
export function Ornament({
  polozenie = 'prawy-gorny',
}: {
  polozenie?: 'prawy-gorny' | 'lewy-dolny'
}) {
  return (
    <svg
      className={`ornament ornament--${polozenie}`}
      viewBox="0 0 160 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* Łodyga */}
      <path d="M8 112C38 100 74 76 100 44c10-12 18-24 24-36" />
      {/* Listki po jednej i po drugiej stronie łodygi */}
      <path d="M40 92c-2-12 4-22 16-26 1 12-5 22-16 26Z" />
      <path d="M46 86c10-7 21-6 28 3-10 6-21 5-28-3Z" />
      <path d="M68 68c-3-12 2-23 13-28 2 12-3 23-13 28Z" />
      <path d="M74 62c11-6 21-3 27 6-11 5-21 3-27-6Z" />
      <path d="M94 44c-4-12 0-23 10-29 3 12-1 23-10 29Z" />
      <path d="M100 38c11-5 21-1 26 9-11 4-21 1-26-9Z" />
      {/* Drobne jagódki przy szczycie */}
      <circle cx="124" cy="14" r="3" />
      <circle cx="133" cy="22" r="2.4" />
      <circle cx="116" cy="24" r="2.2" />
    </svg>
  )
}
