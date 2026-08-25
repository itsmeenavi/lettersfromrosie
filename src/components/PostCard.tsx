import { Link } from '@tanstack/react-router'
import type { Post } from '../lib/content'

export default function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <article
      className="island-shell feature-card rise-in flex flex-col rounded-2xl p-6"
      style={{ animationDelay: `${index * 90 + 80}ms` }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
          {post.category}
        </span>
        <span className="text-xs text-[var(--sea-ink-soft)]">{post.date}</span>
      </div>
      <h3 className="display-title mb-2 text-xl font-bold text-[var(--sea-ink)]">
        {post.title}
      </h3>
      <p className="m-0 flex-grow text-sm leading-relaxed text-[var(--sea-ink-soft)]">{post.desc}</p>
      <Link to={`/writing/${post.slug}`} className="mt-6 inline-flex text-sm font-semibold text-[var(--lagoon-deep)] hover:underline">
        Read piece →
      </Link>
    </article>
  )
}
