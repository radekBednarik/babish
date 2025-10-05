# Kolik času zbývá, než Babiš vypadne?

A tiny, static countdown web app showing time remaining until the next Czech parliamentary elections (target: 3 Oct 2029, local time). Built with Preact, Vite, TypeScript, and Tailwind CSS.

The UI is in Czech and renders a live-updating breakdown: roky, měsíce, dny, hodiny, minuty, sekundy.

- Cíl: 3. 10. 2029, 00:00 (místní čas)
- Jazyk: čeština (`<html lang="cs">`)
- Obrázek: `public/andrej.webp` (Open Graph + Twitter cards)

## Tech Stack

- Preact 10 (with `@preact/preset-vite`)
- Vite 7 (ESM, fast dev/build)
- TypeScript 5 (strict)
- Tailwind CSS 4 via `@tailwindcss/vite`
- ESLint 9 + `typescript-eslint`
- Prettier 3

## Bootstrapping & Credits

- Bootstrapped with Vite’s Preact template.
- Most of the application was created using Opencode.

## Getting Started

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Build for production: `pnpm build`
- Preview production build: `pnpm preview`

## Quality

- Lint all: `pnpm lint`
- Lint one file: `pnpm eslint src/path/to/file.tsx --fix`
- Format: `pnpm format`
- Check formatting (example): `pnpm prettier ./src --check`

## Project Structure

- `src/app.tsx`: App shell and countdown component (diff in years→seconds)
- `src/main.tsx`: App bootstrap + CSS import order
- `src/index.css`: Tailwind entry (`@import "tailwindcss";`)
- `public/andrej.webp`: Open Graph/Twitter preview image
- `vite.config.ts`: Preact + Tailwind plugins

## Configuration Notes

- ESM-only; include file extensions in imports (e.g., `./app.tsx`)
- JSX with `jsx: react-jsx`; `jsxImportSource: preact`
- Strict TypeScript; avoid `any` (prefer `unknown` + narrowing)
- No tests configured (recommended: Vitest + @testing-library/preact)

## Deployment

- Static output in `dist/` after `pnpm build`
- Host on any static provider (Netlify, Vercel, GitHub Pages, etc.)
