import { createFileRoute } from '@tanstack/react-router'
import { getAllPosts } from '../../lib/content'
import PostCard from '../../components/PostCard'

export const Route = createFileRoute('/writing/')({
  component: WritingIndex,
  loader: async () => {
    return await getAllPosts()
  },
})

function WritingIndex() {
  const posts = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 py-12">
      <section className="mb-12 text-center">
        <p className="island-kicker mb-2">Portfolio</p>
        <h1 className="display-title text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Selected Works
        </h1>
      </section>
      
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <PostCard key={post.slug} post={post} index={index} />
        ))}
      </div>
    </main>
  )
}
