# Crypto Dashboard

Ein modernes React-Projekt mit Vite und TypeScript fuer ein leichtgewichtiges Krypto-Dashboard. Die App kommt mit einer klaren Projektstruktur, Linting/Formatting-Setup und Tests, damit du sofort produktiv loslegen kannst.

## Features
- Vite + React 19 + TypeScript
- Saubere Projektstruktur (`components`, `pages`, `features`, `hooks`, `lib`, `styles`)
- ESLint (Flat Config) und Prettier inklusive Sortierung der Imports
- Vitest und Testing Library mit Setup-Datei
- Husky Pre-Commit Hook fuer `npm run lint` und `npm run test`

## Erste Schritte
```bash
npm install
npm run dev
```

## Scripts
- `npm run dev` - Entwicklungsserver starten
- `npm run build` - Produktionsbuild erzeugen
- `npm run preview` - Build lokal ansehen
- `npm run lint` - Linting (keine Warnungen erlaubt)
- `npm run lint:fix` - Linting mit automatischer Fehlerbehebung
- `npm run format` - Prettier Check
- `npm run format:fix` - Prettier Write
- `npm run test` - Tests im CI-Modus
- `npm run test:watch` - Tests im Watch-Modus

## Projektstruktur
```
crypto-dashboard/
  src/
    components/
    features/
      market-data/
        components/
    hooks/
    lib/
    pages/
    styles/
    tests/
  public/
  ...
```

## Qualitaetssicherung
- ESLint, Prettier und Vitest sind konfiguriert.
- Husky Pre-Commit Hook verhindert Commits, wenn Linting oder Tests fehlschlagen.

Viel Spass beim Ausbau des Dashboards!
