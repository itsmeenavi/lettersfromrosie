import fs from 'node:fs/promises'
import path from 'node:path'
import { createServerFn } from '@tanstack/react-start'

export type Post = {
  title: string
  date: string
  link: string
  image?: string
}

const JSON_PATH = path.join(process.cwd(), 'src/rosie_posts_with_images.json')

export const getAllPosts = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const fileContent = await fs.readFile(JSON_PATH, 'utf-8')
    const posts: Post[] = JSON.parse(fileContent)
    return posts
  } catch (e) {
    console.error('Failed to load posts:', e)
    return []
  }
})

