import { createFileRoute, Link } from '@tanstack/react-router'
import { getPostBySlug } from '../../lib/content'
import Prose from '../../components/Prose'
import Markdown from 'react-markdown'

export const Route = createFileRoute('/writing/$slug')({
  component: PostDetail,
  loader: async ({ params: { slug } }) => {
    return await getPostBySlug({ data: slug })
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title} | Roselyn Mariano` },
      { name: 'description', content: loaderData?.desc }
    ]
  })
})

function PostDetail() {
  const post = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 py-12 max-w-3xl">
      <Link to="/writing" className="mb-8 inline-flex items-center text-sm font-semibold text-[var(--lagoon-deep)] hover:underline">
        ← Back to writing
      </Link>
      
      <article className="island-shell rise-in rounded-3xl p-8 sm:p-12 mb-12">
        <header className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="text-sm font-semibold text-[var(--sea-ink-soft)] uppercase tracking-widest">{post.category}</span>
            <span className="text-[var(--line)]">•</span>
            <span className="text-sm text-[var(--sea-ink-soft)]">{post.date}</span>
          </div>
          <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)] sm:text-5xl leading-tight mb-4">
            {post.title}
          </h1>
        </header>

        <Prose>
          <Markdown>{post.content}</Markdown>
        </Prose>
      </article>
    </main>
  )
}
