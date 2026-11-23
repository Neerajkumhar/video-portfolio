# VISUARK — Cinematic Video Portfolio

A static, video-first portfolio for VISUARK built with React, Vite and Tailwind CSS. It uses only real local footage — no placeholder projects, fake stats or external media services.

## Features

- Fullscreen hero background video from the real archive
- Lightweight hover-to-play previews with one audible preview at a time after the first user interaction
- Nine categories and 26 real edits in a filterable gallery
- Infinite horizontal showcase rows with drag, pause-on-hover and reduced-motion fallbacks
- Focus-managed fullscreen video player with seek, volume, replay, fullscreen and keyboard controls
- Honest contact CTA with share/copy actions because no contact details were supplied
- No backend, API, database, paid service or external font/CDN dependency

## Stack

- React 18
- Vite 6
- Tailwind CSS 3
- Framer Motion
- Lenis
- Lucide React

## Requirements

- Node.js 18+
- npm

## Getting started

```bash
npm install
npm run dev
```

Build and preview locally:

```bash
npm run build
npm run preview
```

## Asset validation

```bash
npm run validate:assets
node --test scripts/validate-assets.test.mjs
```

The validator always checks the committed browser-ready assets in `public/assets/`. If the original source footage folders are present locally, it also checks original paths and source category counts.

## Project structure

```text
public/assets/          Committed H.264 videos, previews and posters
scripts/prepare-assets.py  Generates derivatives and the portfolio manifest
src/components/         UI components
src/data/portfolio.js   Generated manifest: categories, videos, hero, gallery
src/hooks/              Visibility, hover preview and reduced-motion hooks
src/lib/                Asset paths and global preview playback controller
PERF.md                 Performance and acceptance report
```

## Regenerating assets

Original footage is intentionally not committed. To regenerate derivatives, place the original category folders and `logo.png` in the project root, then run:

```bash
python3 scripts/prepare-assets.py
npm run validate:assets
```

This requires `ffmpeg` and `ffprobe`. Original H.265 `.MOV` files are transcoded to browser-compatible H.264 MP4 files while the originals remain untouched.

## Deployment

`npm run build` produces a fully static `dist/` directory. Deploy it to any static host such as Netlify, Vercel, GitHub Pages or Cloudflare Pages. No server configuration is required.

## License

MIT — see [LICENSE](LICENSE).
