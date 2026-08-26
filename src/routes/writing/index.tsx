import { createFileRoute } from '@tanstack/react-router'
import { getAllPosts } from '../../lib/content'
import PostCard from '../../components/PostCard'
import { useState } from 'react'

function parseDate(dateStr: string): number {
  if (!dateStr) return 0;
  
  // Handle relative times like "6d ago", "2h ago"
  if (dateStr.includes('ago')) {
    const num = parseInt(dateStr, 10);
    if (isNaN(num)) return 0;
    const now = new Date();
    if (dateStr.includes('d')) now.setDate(now.getDate() - num);
    else if (dateStr.includes('h')) now.setHours(now.getHours() - num);
    else if (dateStr.includes('m')) now.setMinutes(now.getMinutes() - num);
    return now.getTime();
  }

  // Handle standard dates
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return 0;

  // Medium omits the year for the current year.
  // If the string doesn't have a 4-digit year, JS defaults to 2001. Fix it to current year.
  if (!/\d{4}/.test(dateStr)) {
    parsed.setFullYear(new Date().getFullYear());
  }

  return parsed.getTime();
}

export const Route = createFileRoute('/writing/')({
  component: WritingIndex,
  loader: async () => {
    return await getAllPosts()
  },
})

function WritingIndex() {
  const posts = Route.useLoaderData()
  const [query, setQuery] = useState('')

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(query.toLowerCase())
  ).sort((a, b) => parseDate(b.date) - parseDate(a.date))

  return (
    <main className="page-wrap px-4 py-12">
      <section className="mb-12 text-center">
        <p className="island-kicker mb-2">Portfolio</p>
        <h1 className="display-title text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Selected Works
        </h1>
        
        <div className="mx-auto mt-8 max-w-md">
          <input
            type="text"
            placeholder="Search her writings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="island-shell w-full rounded-full border border-[var(--island-border)] px-6 py-3 text-[var(--sea-ink)] shadow-sm outline-none focus:border-[var(--lagoon-deep)] focus:ring-1 focus:ring-[var(--lagoon-deep)]"
          />
        </div>
      </section>
      
      {filteredPosts.length === 0 ? (
        <div className="text-center text-[var(--sea-ink-soft)] py-12">
          No writings found for "{query}".
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <PostCard key={post.link} post={post} index={index} />
          ))}
        </div>
      )}
    </main>
  )
}
