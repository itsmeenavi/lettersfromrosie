import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
  head: () => ({
    meta: [
      { title: 'About | Roselyn Mariano' },
      { name: 'description', content: 'About Roselyn Mariano, author and poet.' }
    ]
  })
})

function About() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rise-in rounded-3xl p-8 sm:p-12 mb-12 flex flex-col md:flex-row gap-10 items-start">
        <div className="w-full md:w-1/3 flex-shrink-0">
          <div className="aspect-square w-full max-w-sm rounded-2xl bg-[var(--surface-strong)] shadow-lg overflow-hidden border border-[var(--line)] flex items-center justify-center">
            {/* Placeholder for Author Photo */}
            <span className="text-[var(--sea-ink-soft)] font-serif italic">Photo</span>
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <p className="island-kicker mb-2">About the Author</p>
          <h1 className="display-title mb-6 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl leading-tight">
            Roselyn Mariano
          </h1>
          <div className="prose prose-stone prose-lg dark:prose-invert text-[var(--sea-ink)]">
            <p>
              Roselyn Mariano is an author, essayist, and poet interested in the intersections 
              of memory, architecture, and human connection. She writes about the spaces we inhabit 
              and how they, in turn, inhabit us.
            </p>
            <p>
              Her forthcoming project, <em>Letters from You</em>, is an interactive book exploring 
              the warmth of handwritten correspondence in a digital age.
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            <Link to="/writing" className="font-semibold text-[var(--lagoon-deep)] hover:underline">
              Read Selected Works →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
