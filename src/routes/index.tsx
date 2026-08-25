import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="page-wrap px-4 pb-12 pt-14 sm:pt-20">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-12 sm:px-12 sm:py-20 text-center">
        <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,var(--hero-a),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,var(--hero-b),transparent_66%)]" />
        <p className="island-kicker mb-4 mx-auto">Roselyn Mariano</p>
        <h1 className="display-title mx-auto mb-6 max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
          Exploring the world through words, ink, and parchment.
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg leading-relaxed">
          Welcome to my digital home. Here you will find a collection of my published books, essays, and poetry, crafted with care and intention.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/writing"
            className="rounded-full border border-[rgba(181,88,110,0.3)] bg-[rgba(212,137,158,0.14)] px-6 py-3 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(212,137,158,0.24)]"
          >
            Read my work
          </Link>
          <Link
            to="/about"
            className="rounded-full border border-[rgba(58,35,41,0.16)] bg-white/50 dark:bg-black/20 px-6 py-3 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(58,35,41,0.3)]"
          >
            About me
          </Link>
        </div>
      </section>

      <section className="mt-12 sm:mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="display-title text-2xl font-bold text-[var(--sea-ink)]">Featured Writing</h2>
          <Link to="/writing" className="text-sm font-semibold text-[var(--lagoon-deep)] hover:underline">View all →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'First Light at the Harbor',
              category: 'Poetry',
              desc: 'A reflection on morning stillness and the quiet boats waiting for the tide.',
              date: 'October 2023',
              slug: 'first-light'
            },
            {
              title: 'The Architecture of Memory',
              category: 'Essay',
              desc: 'How physical spaces hold onto the echoes of our past experiences.',
              date: 'January 2024',
              slug: 'architecture-of-memory'
            },
            {
              title: 'Letters from You',
              category: 'Book',
              desc: 'An interactive literary journey connecting readers across the globe.',
              date: 'Forthcoming',
              slug: 'letters-from-you'
            },
          ].map((item, index) => (
            <article
              key={item.title}
              className="island-shell feature-card rise-in flex flex-col rounded-2xl p-6"
              style={{ animationDelay: `${index * 90 + 80}ms` }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
                  {item.category}
                </span>
                <span className="text-xs text-[var(--sea-ink-soft)]">{item.date}</span>
              </div>
              <h3 className="display-title mb-2 text-xl font-bold text-[var(--sea-ink)]">
                {item.title}
              </h3>
              <p className="m-0 flex-grow text-sm leading-relaxed text-[var(--sea-ink-soft)]">{item.desc}</p>
              <Link to={`/writing/${item.slug}`} className="mt-6 inline-flex text-sm font-semibold text-[var(--lagoon-deep)] hover:underline">
                Read piece →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
