# VISUARK Cinematic Video Portfolio — Design

Date: 2026-11-23

## Intent

Build a static, video-first portfolio for VISUARK that can be opened on a laptop during client meetings and immediately show the agency's real editing work. The work itself is the interface: typography and controls stay minimal, videos carry the experience.

## Goals

- Present every one of the 26 real videos from the nine supplied folders, grouped by the folder's category.
- Make the first five seconds cinematic: full-screen real video, brand headline, two working CTAs.
- Give visitors a reusable player (hero, showreel, cards, modal) with working play, sound, fullscreen, progress, replay, next/previous and keyboard controls.
- Keep playback controlled: only visible previews play, previews are muted, full files load on demand.
- Work on desktop, tablet and mobile with no horizontal page overflow, and respect `prefers-reduced-motion`.

## Non-goals

- No invented clients, stats, testimonials, team members, contact details or social links.
- No backend, database, API, authentication, SSR or paid service.
- No redesign of the VISUARK logo and no deletion or modification of any original media file.

## Anti-goals

- Generic SaaS/agency template with uniform card grids, purple gradients, glassmorphism and decorative noise.
- Dozens of full-resolution videos playing at once.
- Broken or dead buttons, fake links, placeholder projects, stock footage.

## Audit findings (source of truth)

- 9 category folders, 26 videos, 1 PNG (`logo.png`, 1163x422 RGBA). No poster images and no team photographs were supplied.
- Counts: Ai Edits 1, Car Edits 4, Event Edits 2, Industrial Production Edits 1, Influencer Edits 4, Politics Edits 4, Product Edits 1, Promotional Edits 5, Visuark - Recent Work 4.
- 22 files are `.MOV` containing HEVC/H.265 video + AAC audio. HEVC in QuickTime containers is not reliably playable in Chrome/Firefox on Windows/Linux, so it is an unsupported delivery format for a static web portfolio.
- 4 files are `.mp4` containing H.264 + AAC (browser-compatible), all portrait; one `.MOV` is 1920x1080 landscape, all others are portrait (1080x1920 or 720x1280).
- Originals total ~2.07 GB. They stay untouched in place.

## Approaches considered

1. **Serve originals directly with guessed MIME types.** Rejected: 22 HEVC files would silently fail in common browsers, and 2 GB would be streamed on first view.
2. **Copy originals into `public/` and use a JS decoder.** Rejected: heavy dependency, poor battery life, violates "avoid unnecessary dependencies".
3. **Generate H.264 derivatives + posters into `public/assets/videos/`, keep originals in place, drive the UI from a generated manifest.** Chosen: every real project remains represented, playback works in all target browsers, previews stay light, and the original assets are preserved. Original filenames and relative paths are kept in the manifest for traceability.

## Design decisions

- **Brand tokens:** `#299DD5` primary, `#08090B` background, `#101216` surface, `#FFFFFF` text, `#A1A1AA` muted. Single blue accent, no decorative gradients beyond subtle black scrims over video.
- **Type:** system-led editorial stack with heavy uppercase headings, tight tracking, large scale jumps. No external font request, so the site works offline.
- **Layout:** full-bleed video sections inside a 1440px editorial container; asymmetric featured-project layout; editorial category rows; responsive 1/2/3-column galleries.
- **Motion:** Framer Motion reveals and page transitions, CSS marquee for the three showcase rows (pause on hover/drag), Lenis smooth scrolling, magnetic CTAs. All non-essential motion collapses under reduced motion.
- **Player:** two tiers — lightweight muted `preview.mp4` (short, low-resolution, no audio) for cards and marquees; full H.264 `full.mp4` only in showreel and modal. Posters are extracted frames from the real videos.
- **Titles:** derived from the real filename stem only (UUIDs shortened, `copy_`/download noise removed); full original filename and category shown as metadata. No invented project names.
- **Hero:** the landscape Recent Work clip as background; showreel uses a real Recent Work clip. Both are explicitly recorded in the manifest, not hard-coded guesses.
- **Contact:** no contact address, phone, social URLs or team photo exist in the assets; CTAs scroll to the final CTA section instead of linking to invented destinations.

## Files to create

- `scripts/prepare-assets.mjs` or Python equivalent — reads originals, emits derivatives, posters and `src/data/portfolio.js`.
- `src/data/portfolio.js` — generated manifest: categories, real videos, derived paths, durations, dimensions, display titles.
- `src/components/*` — the 14 UI components listed in the project spec, plus small shared primitives.
- `src/hooks/useVideoVisibility.js`, `src/hooks/useHorizontalDrag.js`, `src/hooks/usePrefersReducedMotion.js`.
- `src/styles/globals.css` — tokens, base styles, marquee/keyframes, responsive utilities.
- `src/App.jsx`, `src/main.jsx`, `index.html`, Vite/Tailwind/PostCSS config, `package.json`.
- `scripts/validate-assets.mjs` — verifies every manifest path exists and counts match the source folders.
- This spec and the implementation plan under `docs/superpowers/`.

## Verification

- `npm run validate:assets` — all 26 manifest entries resolve to real generated files; source folder counts unchanged.
- `npm run build` — clean production build.
- Browser check at 1440/1024/768/375px: navigation, filters, marquee pause/drag, hover previews, modal controls, keyboard, fullscreen, no console errors, no horizontal overflow.
