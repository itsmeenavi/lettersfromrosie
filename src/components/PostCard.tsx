import type { Post } from '../lib/content'

function formatDisplayDate(dateStr: string) {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  // If it already says 'ago' just pass it through
  if (dateStr.includes('ago')) return dateStr

  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays >= 0 && diffDays <= 7) {
    if (diffDays === 0) return 'Today'
    return `${diffDays}d ago`
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]
  const day = date.getDate()
  
  if (date.getFullYear() === now.getFullYear()) {
    return `${month} ${day}`
  }
  
  return `${month} ${day}, ${date.getFullYear()}`
}

export default function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <article
      className="island-shell feature-card rise-in flex flex-col overflow-hidden rounded-2xl"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {post.image && (
        <div className="h-40 w-full overflow-hidden bg-[var(--cloud-pink)]">
          <img src={post.image.replace(/resize:fill:\d+:\d+/, 'resize:fill:600:400')} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex flex-col flex-grow p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
            Medium
          </span>
          <span className="text-xs text-[var(--sea-ink-soft)]">{formatDisplayDate(post.date)}</span>
        </div>
        <h3 className="display-title mb-2 text-xl font-bold text-[var(--sea-ink)]">
          {post.title}
        </h3>
        <p className="m-0 flex-grow text-sm leading-relaxed text-[var(--sea-ink-soft)]"></p>
        <a href={post.link} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex text-sm font-semibold text-[var(--lagoon-deep)] hover:underline">
          Read piece ↗
        </a>
      </div>
    </article>
  )
}

