# VISUARK Video Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a static, cinematic React portfolio built entirely from the 26 real videos in the supplied folders.

**Architecture:** A build-time asset preparation script converts unsupported HEVC `.MOV` originals into browser-safe H.264 MP4s and posters in `public/`, then emits a generated manifest. React components consume only that manifest; shared hooks control visibility-aware playback, drag interaction and reduced motion. No API or backend is involved.

**Tech Stack:** React + Vite, JavaScript, Tailwind CSS, Framer Motion, Lucide React, Lenis, HTML5 Video API, ffmpeg CLI for asset preparation.

**Spec:** `docs/superpowers/specs/2026-11-23-visuark-video-portfolio-design.md`

## Global Constraints

- Do not modify, move or delete any file in the nine source folders or `logo.png`.
- Do not invent client names, project statistics, testimonials, team members or contact details.
- Use original VISUARK logo unmodified.
- Frontend only; static build; no paid services; no external font/network dependency at runtime.
- All 9 categories and all 26 real videos must be reachable in the UI.
- Respect `prefers-reduced-motion`; never allow horizontal page overflow.
- Brand tokens: `#299DD5`, `#08090B`, `#FFFFFF`, `#A1A1AA`, `#101216`.

## Review Focus

- Unsupported inputs: 22 HEVC `.MOV` files — each must map to a working H.264 derivative; `scripts/validate-assets.mjs` asserts all 26 full/preview/poster paths exist.
- Odd filenames: `@lakshita_garden_hotel - R⤓Download.mp4` and `copy_<UUID>.mov` — manifest assertions check unique ids, escaped URLs and filename-derived titles without invented names.
- Low-power/mobile playback: previews must be muted, low-resolution and paused offscreen — manual browser check with Network panel; only visible previews request media.
- Modal edge cases: last/first video next/previous wrap, Escape closes, arrows navigate, focus returns to trigger, background video pauses — browser keyboard check.
- Offline/static hosting: no absolute paths, no external requests — build output inspected for `http(s)` URLs and all asset paths start with `/assets/`.

---

### Task 1: Scaffold static React app

**Files:** Create `package.json`, `vite.config.js`, `index.html`, `postcss.config.js`, `tailwind.config.js`, `src/main.jsx`, `src/App.jsx`, `src/styles/globals.css`.

**Interfaces:**
- Produces: Vite scripts `dev`, `build`, `preview`, `validate:assets`; Tailwind scanning `index.html` and `src/**/*.{js,jsx}`; global CSS imports in `src/main.jsx`.

- [ ] **Step 1: Write config and shell files with the exact dependency list** (`react`, `react-dom`, `framer-motion`, `lucide-react`, `lenis`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`).
- [ ] **Step 2: Add brand tokens and base CSS** (`--color-brand: #299DD5`, `--color-bg: #08090B`, `--color-surface: #101216`, `--color-muted: #A1A1AA`, reduced-motion media query, `overflow-x: clip` on `body`).
- [ ] **Step 3: Run `npm install` and `npm run build`** and confirm a clean build with a placeholder `App.jsx`.

### Task 2: Prepare real assets and manifest

**Files:** Create `scripts/prepare-assets.py`, `scripts/validate-assets.mjs`, generated `src/data/portfolio.js`, generated `public/assets/**`.

**Interfaces:**
- Produces: `portfolio` object with `logo`, `categories` (`id`, `name`, `number`, `count`, `cover`, `videos`) and `videos` flat array. Each video: `id`, `title`, `category`, `categoryLabel`, `src`, `previewSrc`, `poster`, `originalPath`, `originalName`, `duration`, `width`, `height`, `orientation`, `index`.
- Produces: `npm run validate:assets` exit code 0 only when all 26 generated files exist and source counts are unchanged.

- [ ] **Step 1: Implement the preparation script** using ffprobe for real duration/dimensions and ffmpeg to emit `-full.mp4` (H.264/AAC, faststart, max 1080px), `-preview.mp4` (H.264, no audio, 6s, 360px, faststart) and `-poster.jpg` for each of the 26 videos; copy `logo.png` unchanged to `public/assets/logo/`.
- [ ] **Step 2: Run the script and record a conversion report** listing unsupported HEVC originals and their H.264 derivatives; verify no source file checksum changed.
- [ ] **Step 3: Implement `validate-assets.mjs`** to assert 9 categories, 26 videos, all manifest file paths present, and no duplicate ids.
- [ ] **Step 4: Run `npm run validate:assets`** and confirm PASS.

### Task 3: Shared video hooks and reusable player primitives

**Files:** Create `src/hooks/useVideoVisibility.js`, `src/hooks/useHorizontalDrag.js`, `src/hooks/usePrefersReducedMotion.js`, `src/components/VideoCard.jsx`, `src/components/VideoModal.jsx`.

**Interfaces:**
- Consumes: video objects from Task 2.
- Produces: `VideoCard({ video, onOpen, variant })`; `VideoModal({ videos, index, onClose, onNavigate })`; `useVideoVisibility(ref, { rootMargin })` returning `isVisible`; `useHorizontalDrag(ref)` returning `{ onPointerDown, onPointerMove, onPointerUp, isDragging }`; `usePrefersReducedMotion()` returning boolean.

- [ ] **Step 1: Implement visibility hook** with `IntersectionObserver`, cleanup on unmount, and false initial state.
- [ ] **Step 2: Implement drag hook** supporting mouse and touch pointer events with pointer capture and cleanup.
- [ ] **Step 3: Implement `VideoCard`** with poster, lazy `preload="none"`, muted/loop/playsInline preview, play/pause driven by visibility + hover, error fallback, keyboard activation and real title/category/index labels.
- [ ] **Step 4: Implement `VideoModal`** with full file loaded only on open, play/pause, mute, progress/seek, fullscreen, replay, next/previous wrap, Escape/Arrow key handling, focus management, animation and error state.
- [ ] **Step 5: Verify in browser** one card's preview pauses offscreen and modal keyboard controls work.

### Task 4: Navigation, hero and showreel

**Files:** Create `src/components/Navbar.jsx`, `src/components/Hero.jsx`, `src/components/Showreel.jsx`, `src/components/MagneticButton.jsx`, update `src/App.jsx`.

**Interfaces:**
- Consumes: `portfolio.logo`, hero/showreel picks from `portfolio.videos`, `VideoModal` for showreel fullscreen expansion.
- Produces: anchors `#home`, `#showreel`, `#categories`, `#work`, `#about`; `onOpenShowreel` callback used by hero and navbar.

- [ ] **Step 1: Implement sticky navbar** with transparent-to-dark scroll state, all five links, two CTAs, mobile menu with focus handling and working `href`s.
- [ ] **Step 2: Implement hero** using the landscape Recent Work video (muted/autoplay/loop/playsInline), scrim, exact supplied headline/support text, two CTAs, brand label and scroll indicator.
- [ ] **Step 3: Implement showreel** with a real high-quality video, cinematic frame, title, play/pause, sound, progress, fullscreen and replay; clicking expand opens `VideoModal`.
- [ ] **Step 4: Verify section anchors and both CTAs scroll/play as expected** at desktop and mobile widths.

### Task 5: Category exploration, marquee and featured projects

**Files:** Create `src/components/CategoryShowcase.jsx`, `src/components/HorizontalVideoMarquee.jsx`, `src/components/FeaturedProjects.jsx`, update `src/App.jsx`.

**Interfaces:**
- Consumes: all 9 categories, all videos, drag hook, `VideoCard`/modal opener.
- Produces: `onSelectCategory(categoryId)` callback used by gallery filters; three marquee rows with directions `forward`, `reverse`, `forward`.

- [ ] **Step 1: Implement category showcase** with 9 interactive rows/cards showing real count and representative preview; click scrolls to `#work` and sets the active filter.
- [ ] **Step 2: Implement marquee** with duplicated track for seamless infinite loop, directions left→right/right→left/left→right, pause on hover/focus/drag, pointer/touch drag, reduced-motion static fallback and no blank gaps.
- [ ] **Step 3: Implement featured projects** with one large and three smaller real videos from different categories, editorial asymmetric layout and working open interactions.
- [ ] **Step 4: Verify marquee supports drag and pauses on hover**, and each category click updates the gallery filter.

### Task 6: Galleries, capabilities, about, CTA and footer

**Files:** Create `src/components/VideoGallery.jsx`, `src/components/Capabilities.jsx`, `src/components/About.jsx`, `src/components/ContactCTA.jsx`, `src/components/Footer.jsx`, update `src/App.jsx`.

**Interfaces:**
- Consumes: `activeCategory` state from Task 5, all videos, original logo.
- Produces: complete page with 11 sections and modal integration for gallery cards.

- [ ] **Step 1: Implement gallery** with category filter buttons (All + 9 categories), responsive grid, hover playback, real filenames as metadata, and modal opening with list-scoped next/previous.
- [ ] **Step 2: Implement capabilities** with the exact eight supplied capability names and typography-driven motion only.
- [ ] **Step 3: Implement about** with the exact supplied headline/description and the original logo; no invented team content.
- [ ] **Step 4: Implement final CTA and footer** with exact supplied copy, logo, working navigation, copyright and CTA scroll; no invented contact details or socials.
- [ ] **Step 5: Verify every one of the 9 filters shows the correct real video count** and no dead links remain.

### Task 7: Motion polish, performance and final verification

**Files:** Update `src/App.jsx`, `src/styles/globals.css`; create `PERF.md`.

**Interfaces:**
- Consumes: complete app from Tasks 1–6.

- [ ] **Step 1: Wire Lenis smooth scrolling and Framer Motion reveals/transitions**, gated by `usePrefersReducedMotion`, with all observers/listeners cleaned up.
- [ ] **Step 2: Run `npm run validate:assets && npm run build`** and confirm both pass.
- [ ] **Step 3: Browser-test 1440/1024/768/375px**, keyboard modal navigation, fullscreen, marquee pause/drag, console errors and horizontal overflow; fix critical findings.
- [ ] **Step 4: Record a short verification report** in `PERF.md` including what was measured and what could not be measured locally.
