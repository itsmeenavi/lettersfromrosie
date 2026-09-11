export type ZoomImageInfo = {
  src: string
  alt: string
  title: string
  caption?: string
  aspect?: string
}

export type PackageType = 'standard' | 'personalized'
export type CoverView = 'front' | 'back' | 'wrap'

export type SocialPlatform = 'instagram' | 'tiktok' | 'medium' | 'facebook' | 'twitter' | 'other'

export type SocialAccount = {
  id: string
  platform: SocialPlatform
  value: string
}

export function formatSocialUrl(platform: SocialPlatform, val: string): string {
  const trimmed = val.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  const cleanVal = trimmed.replace(/^@/, '')
  switch (platform) {
    case 'instagram':
      return `https://instagram.com/${cleanVal}`
    case 'tiktok':
      return `https://tiktok.com/@${cleanVal}`
    case 'medium':
      return `https://medium.com/@${cleanVal}`
    case 'facebook':
      return `https://facebook.com/${cleanVal}`
    case 'twitter':
      return `https://x.com/${cleanVal}`
    default:
      return trimmed.includes('.') ? `https://${trimmed}` : trimmed
  }
}
