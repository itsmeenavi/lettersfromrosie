import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { createServerFn } from '@tanstack/react-start'

export type Post = {
  title: string
  date: string
  category: string
  desc: string
  slug: string
  content: string
}

const CONTENT_DIR = path.join(process.cwd(), 'src/content')

async function readFiles(dir: string, category: string): Promise<Post[]> {
  try {
    const files = await fs.readdir(dir)
    const posts: Post[] = []
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(dir, file)
        const fileContent = await fs.readFile(filePath, 'utf-8')
        const { data, content } = matter(fileContent)
        
        posts.push({
          title: data.title,
          date: data.date,
          category: data.category || category,
          desc: data.desc || '',
          slug: file.replace(/\.md$/, ''),
          content
        })
      }
    }
    return posts
  } catch (e) {
    // Return empty if directory doesn't exist
    return []
  }
}

export const getAllPosts = createServerFn({ method: 'GET' }).handler(async () => {
  const poetry = await readFiles(path.join(CONTENT_DIR, 'poetry'), 'Poetry')
  const essays = await readFiles(path.join(CONTENT_DIR, 'essays'), 'Essay')
  const books = await readFiles(path.join(CONTENT_DIR, 'books'), 'Book')
  
  return [...poetry, ...essays, ...books].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

export const getPostBySlug = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    // This is naive and will load all posts into memory, but it's fine for MVP
    const poetry = await readFiles(path.join(CONTENT_DIR, 'poetry'), 'Poetry')
    const essays = await readFiles(path.join(CONTENT_DIR, 'essays'), 'Essay')
    const books = await readFiles(path.join(CONTENT_DIR, 'books'), 'Book')
    
    const posts = [...poetry, ...essays, ...books]
    const post = posts.find(p => p.slug === slug)
    
    if (!post) throw new Error('Post not found')
    return post
  })
