import Link from "next/link";

const sections = [
  {
    title: "Weather Channel",
    description:
      "Session-scoped caching via sessionStorage keeps weather data per tab, with middleware-driven swaps to IndexedDB or memory for experiments.",
    href: "/weather",
    accent: "text-sky-200",
  },
  {
    title: "Cart & Catalog",
    description:
      "Persistent catalog caching lives in IndexedDB while classic reducers, thunks, and RTK Query coordinate the cart flows.",
    href: "/cart",
    accent: "text-emerald-200",
  },
  {
    title: "Team Tasks",
    description:
      "Mutations and thunks work together so UI filters stay fast while RTK Query handles optimistic updates and invalidation.",
    href: "/tasks",
    accent: "text-indigo-200",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/50">
        <h1 className="text-4xl font-semibold text-slate-50">Redux Toolkit + RTK Query reference app</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          This demo highlights practical patterns for enterprise-scale state management: storage-aware caching,
          domain-driven folder structure, feature-first slices, middleware coordination, and a TDD-friendly testing
          setup. Explore the pages below to watch queries hydrate from different storage layers and see how plain
          reducers and async thunks complement RTK Query.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-6 transition hover:border-slate-600 hover:bg-slate-900/60"
          >
            <h2 className={`text-xl font-semibold ${section.accent}`}>{section.title}</h2>
            <p className="text-sm text-slate-300">{section.description}</p>
            <span className="text-xs text-slate-400 group-hover:text-slate-200">Dive in →</span>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-200">
        <h2 className="text-lg font-semibold text-slate-100">What to look for</h2>
        <ul className="grid gap-2 text-slate-300">
          <li>
            <strong className="text-slate-100">Storage adapters:</strong> pluggable session, IndexedDB, and memory
            caches demonstrated in <code className="rounded bg-slate-800 px-1">shared/api</code> with middleware to keep
            them coherent.
          </li>
          <li>
            <strong className="text-slate-100">Slices + thunks:</strong> classic reducers handle cart and task UI flows
            while async thunks coordinate RTK Query data fetching.
          </li>
          <li>
            <strong className="text-slate-100">Testing:</strong> vitest, Testing Library, and MSW power unit and
            integration tests covering the store, services, and components.
          </li>
        </ul>
      </section>
    </div>
  );
}
