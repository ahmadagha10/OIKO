# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains the Next.js App Router routes, layouts, and pages (start at `app/page.tsx`).
- `components/` holds shared UI components; `components.json` tracks component tooling/config.
- `hooks/`, `contexts/`, `lib/`, and `types/` store reusable hooks, React context, utilities, and TypeScript types.
- `public/` contains static assets served as-is.
- Root configs live at `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, and `postcss.config.mjs`.

## Build, Test, and Development Commands
- `npm run dev` starts the local dev server at `http://localhost:3000`.
- `npm run build` creates a production build in `.next/`.
- `npm run start` runs the production server (after `build`).
- `npm run lint` runs ESLint across the codebase.

## Coding Style & Naming Conventions
- Language: TypeScript + React (Next.js). Prefer functional components and hooks.
- Indentation: follow existing file formatting; keep JSX and object literals readable.
- Naming: React components in `PascalCase`, hooks in `useThing` form, utilities in `camelCase`.
- Linting: enforced by ESLint (`eslint.config.mjs`). No formatter config is present, so avoid reformatting unrelated code.

## Testing Guidelines
- No test framework or test directories are currently configured.
- If adding tests, align with Next.js conventions and colocate near the feature (e.g., `app/__tests__/` or `components/__tests__/`), and document the command you add to `package.json`.

## Commit & Pull Request Guidelines
- Git history is minimal and does not establish a commit convention yet.
- Use short, imperative commit messages (e.g., `Add hero banner`, `Fix navbar overflow`).
- PRs should include a clear description, linked issues when applicable, and screenshots/GIFs for UI changes.

## Configuration & Environment Notes
- No `.env` files are present in the repo. If you introduce environment variables, add a `.env.example` and document required keys in `README.md`.
