export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">
          &copy; {year} Roselyn Mariano. All rights reserved.
        </p>
        <p className="island-kicker m-0">The Literary Portfolio</p>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-6">
        {['Substack', 'Medium', 'TikTok', 'Pinterest', 'Instagram'].map((platform) => (
          <a
            key={platform}
            href="#"
            className="text-sm font-medium transition hover:text-[var(--sea-ink)] hover:underline"
          >
            {platform}
          </a>
        ))}
      </div>
    </footer>
  )
}
