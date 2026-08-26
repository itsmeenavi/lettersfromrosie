import { createFileRoute, Link } from '@tanstack/react-router'
import { getAllPosts } from '../lib/content'
import PostCard from '../components/PostCard'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: async () => {
    return await getAllPosts()
  }
})

function RouteComponent() {
  const allPosts = Route.useLoaderData()
  
  // Sort posts to get the 3 most recent
  const recentPosts = [...allPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <main className="page-wrap px-4 py-16 lg:py-24">
      {/* HERO SECTION */}
      <section className="mb-24 flex flex-col items-center justify-center text-center">
        <div className="mb-8 overflow-hidden rounded-full border-4 border-[var(--cloud-pink)] shadow-[0_10px_30px_rgba(90,40,60,0.1)] h-40 w-40 bg-[var(--surface-strong)] flex items-center justify-center">
          <img 
            src="/rosie3.jpg" 
            alt="Rosie" 
            className="h-full w-full object-cover" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <span className="font-handwriting text-7xl text-[var(--sea-ink-soft)] opacity-40 hidden">R</span>
        </div>
        <div className="mx-auto max-w-2xl text-lg leading-relaxed text-[var(--sea-ink-soft)]">
          <p>
            I’m the voice behind Letters from Rosie, a heartfelt space I started on Medium back in May 2024. I write from the rawest parts of myself — hoping that somewhere, someone might feel less alone because of it. What began as a quiet dream has now blossomed into a beautiful, growing community of thousands — and for that, I’m endlessly grateful.
          </p>
        </div>
      </section>

      {/* RECENT WRITINGS */}
      <section className="mb-32">
        <div className="mb-12 text-center">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[var(--lagoon-deep)]">Latest Thoughts</span>
          <h2 className="display-title text-4xl lg:text-5xl font-bold text-[var(--sea-ink)]">Recent Writings</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post, i) => (
            <PostCard key={post.link} post={post} index={i} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/writing" className="inline-flex items-center justify-center rounded-full bg-[var(--sea-ink)] px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-[var(--sea-ink-soft)] shadow-md hover:shadow-xl">
            View the Full Archive
          </Link>
        </div>
      </section>

      {/* SILENT NOTES BRIDGE */}
      <section className="mx-auto max-w-4xl pb-16">
        <a 
          href="https://lovefrommetoyou.my.canva.site/letters-from-rosie-archives" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative flex flex-col overflow-hidden rounded-3xl bg-[var(--surface-strong)] p-12 text-center shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(90,40,60,0.12)] border border-[var(--line)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--cloud-pink)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-60"></div>
          <div className="relative z-10">
            <span className="mb-4 block font-handwriting text-3xl text-[var(--lagoon-deep)]">Project 2</span>
            <h2 className="display-title mb-6 text-4xl lg:text-5xl font-bold text-[var(--sea-ink)] group-hover:text-[var(--lagoon-deep)] transition-colors">
              The Silent Notes Archive
            </h2>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-[var(--sea-ink-soft)]">
              A safe space — a gentle home for those who, like me, have once been trapped in their own thoughts. It’s for the quiet ones, the overthinkers, the souls carrying words they’ve never been able to say out loud.
            </p>
            <div className="mt-10 inline-flex items-center justify-center border-b-2 border-transparent pb-1 font-bold text-[var(--sea-ink)] group-hover:border-[var(--sea-ink)] transition-colors">
              Explore the Archive ↗
            </div>
          </div>
        </a>
      </section>
    </main>
  )
}
