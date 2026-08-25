import { ReactNode } from 'react'

export default function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="prose prose-stone prose-lg dark:prose-invert mx-auto text-[var(--sea-ink)]">
      {children}
    </div>
  )
}
