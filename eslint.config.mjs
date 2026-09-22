// Next.js 16 dostarcza konfiguracje ESLint już w formacie flat, więc
// wczytujemy je wprost, bez warstwy zgodności ze starym .eslintrc.
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const konfiguracja = [
  ...coreWebVitals,
  ...typescript,
  { ignores: ['.next/**', 'node_modules/**', 'out/**', 'next-env.d.ts'] },
]

export default konfiguracja
