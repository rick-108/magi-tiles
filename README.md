# Magic Tiles (Magi-Tiles)

Magic Tiles - a rhythm piano game built with React + TypeScript and Vite. This repository contains the client-side game prepared for publishing to casual web portals such as CrazyGames.

## Features

- Canvas-based rhythm gameplay (4 lanes)
- Procedural Endless mode + curated classical song levels
- Dynamic audio layering (audioSynth)
- Local persistent stats (localStorage)
- Multilanguage UI (en/ar/fr)

## Quick start

Requirements:
- Node.js 18+ or Bun
- npm or yarn (or bun)

Install dependencies:

```bash
npm install
# or
# yarn
# bun install
```

Run development server (open http://localhost:3000):

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Preparing for CrazyGames

CrazyGames expects a static HTML + assets package. To prepare:

1. Run `npm run build` to produce the `dist/` folder.
2. Verify `index.html` in `dist/` references your built bundle and that no server-only dependencies (Express, Dotenv) are bundled in the client code.
3. Supply required store assets (thumbnail, icon) and a short description. CrazyGames has a publisher portal for uploading the ZIP of the built folder.

Notes:
- Keep bundle size under platform limits; dynamic import of heavy modules (audio engine or samples) is recommended.
- Add a Reduced Motion option in Settings to comply with accessibility and platform guidelines.

## Repo hygiene & contributing

- Run type-checks locally: `npm run lint` (this runs `tsc --noEmit`)
- Submit PRs against `main`. Branch name pattern: `feat/<short-desc>` or `fix/<short-desc>`.

## License

MIT — see LICENSE file.
