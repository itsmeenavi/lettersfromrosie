import { createServerFn } from '@tanstack/react-start'
import { supabase } from './supabase'

export type Post = {
  title: string
  date: string
  link: string
  image?: string
}

export const getAllPosts = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('title, date, link, image')

    if (error) {
      console.error('Supabase error:', error)
      return []
    }

    return (posts || []) as Post[]
  } catch (e) {
    console.error('Failed to load posts from Supabase:', e)
    return []
  }
})

