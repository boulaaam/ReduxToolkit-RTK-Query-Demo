# Redux Toolkit + RTK Query Demo

A Next.js 14 + React 18 reference app that showcases advanced Redux Toolkit patterns, RTK Query lifecycles, and storage-backed caching strategies. The project balances feature slices, middleware, and API layers in an enterprise-style structure with comprehensive testing.

## ✨ Highlights

- **Redux Toolkit store** with feature slices for cart, tasks, and preferences.
- **RTK Query endpoints** that demonstrate tag invalidation, optimistic updates, and background refetching.
- **Storage-backed caching** via sessionStorage, IndexedDB (localForage), or in-memory adapters controlled by user preferences.
- **Custom middleware** that reacts to preference changes to clear caches and invalidate queries.
- **Mocked backend** powered by Next.js App Router API routes and MSW for deterministic tests.
- **Testing setup** using Vitest + Testing Library with jsdom, MSW, and strong type safety.

## 🗂️ Project Layout

- `src/app/` – Next.js App Router pages, providers, and API route mocks.
- `src/app/store/` – Store configuration, middleware, and integration tests.
- `src/entities/` – Domain slices, selectors, and models.
- `src/features/` – Feature-specific APIs and UI components (Cart, Tasks, Weather).
- `src/shared/` – Reusable RTK Query helpers and storage adapters.
- `src/test/` – MSW server for Vitest.

## 🚀 Getting Started

1. Install dependencies:
	```powershell
	npm install
	```
2. Start the development server:
	```powershell
	npm run dev
	```
3. Visit [http://localhost:3000](http://localhost:3000) to explore the demo UI.

### Available Scripts

- `npm run dev` – Launch Next.js in development mode.
- `npm run build` – Create a production build.
- `npm run start` – Serve the production build.
- `npm run lint` – Run Next.js linting.
- `npm run test` – Execute the Vitest suite in watchless mode.

## 🧪 Testing & Quality Gates

- Vitest is configured with jsdom, MSW, and Testing Library (`npm run test`).
- Lint with the bundled Next.js ESLint configuration (`npm run lint`).
- Tests rely on `NEXT_PUBLIC_API_BASE_URL`; the Vitest setup file injects `http://localhost/api` by default. Override if your API lives elsewhere.

## 🗄️ Storage Strategies

The weather feature demonstrates dynamic caching strategies:

- **Session storage** for tab-scoped data.
- **Persistent storage** backed by IndexedDB via localForage.
- **In-memory storage** for volatile data.

Switching strategies dispatches middleware that clears persisted caches and invalidates RTK Query tags to prevent stale data.

## 🔌 Mock APIs & Data

- All data flows through App Router API routes under `src/app/api/*`.
- MSW reuses those shapes in tests to avoid network calls and keep scenarios deterministic.

## 🛠️ Troubleshooting

- If tests cannot resolve `/api/...`, set `NEXT_PUBLIC_API_BASE_URL` to an absolute origin (e.g. `http://localhost:3000`) before running `npm run test`.
- IndexedDB persistence uses localForage; in Node-based tests it falls back to an in-memory shim.

Enjoy exploring different Redux Toolkit and RTK Query techniques in a modern Next.js app!
