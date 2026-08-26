import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutComponent,
  head: () => ({
    meta: [
      { title: 'About | Roselyn Mariano' },
      { name: 'description', content: 'About Roselyn Mariano, author and poet.' }
    ]
  })
})

function AboutComponent() {
  const socials = [
    { 
      name: 'Instagram', 
      url: 'https://instagram.com/lettersfromrosie_', 
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913a5.885 5.885 0 001.384 2.126A5.868 5.868 0 004.14 23.37c.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558a5.898 5.898 0 002.126-1.384 5.86 5.86 0 001.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913a5.89 5.89 0 00-1.384-2.126A5.847 5.847 0 0019.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.359 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.81 3.81 0 01-.899 1.382 3.744 3.744 0 01-1.38.896c-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421a3.716 3.716 0 01-1.379-.899 3.644 3.644 0 01-.9-1.38c-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.757 6.162 6.162 6.162 3.405 0 6.162-2.757 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
    },
    { 
      name: 'TikTok', 
      url: 'https://tiktok.com/@lynwrites_', 
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
    },
    { 
      name: 'Medium', 
      url: 'https://medium.com/@lynwrites_', 
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2.846 6.887c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403h7.358l5.378 11.795 4.728-11.795h6.633v.403l-1.916 1.837c-.165.126-.247.333-.213.538v13.498c-.034.204.048.411.213.537l1.871 1.837v.403h-9.412v-.403l1.939-1.882c.19-.19.19-.246.19-.537v-10.91l-5.389 13.688h-.728l-6.275-13.688v9.174c-.052.385.076.774.347 1.052l2.521 3.058v.404h-7.148v-.404l2.521-3.058c.27-.279.39-.67.325-1.052v-10.608z"/></svg>
    },
    { 
      name: 'Substack', 
      url: 'https://substack.com/@lynwritess', 
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>
    },
    {
      name: 'Email',
      url: 'https://mail.google.com/mail/?view=cm&fs=1&to=marianoroselyn05@gmail.com',
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
    }
  ]

  return (
    <main className="page-wrap px-4 py-16 lg:py-24">
      {/* HEADER */}
      <div className="mb-16 text-center">
        <h1 className="display-title text-5xl lg:text-7xl font-bold text-[var(--sea-ink)] drop-shadow-sm">
          About Me
        </h1>
        <div className="mx-auto mt-8 h-[2px] w-16 bg-[var(--lagoon)] rounded-full"></div>
      </div>

      {/* FULL BIO - ELEGANT TYPOGRAPHY */}
      <section className="mx-auto max-w-2xl mb-24 text-lg leading-relaxed text-[var(--sea-ink-soft)] font-serif space-y-8">
        <p className="text-xl text-[var(--sea-ink)] font-medium">
          Hi there! I’m Rosie, the voice behind Letters from Rosie, a heartfelt space I started on Medium back in May 2024.
        </p>
        <p>
          I write from the rawest parts of myself — hoping that somewhere, someone might feel less alone because of it. What began as a quiet dream has now blossomed into a beautiful, growing community of thousands — and for that, I’m endlessly grateful.
        </p>
        <p>
          <strong className="font-bold text-[var(--sea-ink)]">The Silent Notes Archive</strong> is a continuation of that dream. I created it as a safe space — a gentle home for those who, like me, have once been trapped in their own thoughts. It’s for the quiet ones, the overthinkers, the souls carrying words they’ve never been able to say out loud. 
        </p>
        <div className="border-l-2 border-[var(--lagoon)] pl-6 my-10 py-2 italic text-[var(--sea-ink)]">
          Inspired by the deeply moving work of Geloy Concepcion, I’m launching #TheSilentNotes with an open heart and a deep hope: that this space becomes a home for your truths, too.
        </div>
        <p>
          To everyone who’s supported me on TikTok, Medium, and beyond — thank you. Your kindness and belief in me gave me the courage to take this leap.
        </p>
        
        {/* SHARE YOUR STORY CARD */}
        <div className="mt-20 island-shell relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
          <div className="relative z-10">
            <h3 className="display-title text-3xl sm:text-4xl text-[var(--sea-ink)] mb-4">A safe space</h3>
            <p className="mb-10 text-[var(--sea-ink-soft)] max-w-md mx-auto">
              If there’s something weighing on your heart — a story, a thought, a silent note of your own — I invite you to share it here.
            </p>
            <a 
              href="https://forms.gle/UsjWuThKQSVK6azk7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[var(--lagoon)] !text-white px-8 py-3.5 font-bold transition-all hover:bg-[var(--lagoon-deep)] hover:scale-105"
            >
              Share Your Story 💌
            </a>
            <p className="mt-8 text-sm italic text-[var(--sea-ink-soft)] opacity-80">
              Only if and when you're ready. Let your story find a home.
            </p>
          </div>
        </div>
      </section>

      {/* STUNNING COLLABORATE SECTION */}
      <section className="mb-24">
        <div className="text-center mb-16">
          <h2 className="font-handwriting text-5xl lg:text-6xl text-[var(--lagoon-deep)] mb-4 drop-shadow-sm">Let's collaborate!</h2>
          <p className="text-xl text-[var(--sea-ink-soft)] font-serif">You can find me in these quiet corners of the internet.</p>
        </div>
        
        <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {socials.map((social, i) => (
            <a 
              key={social.name}
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex flex-col items-center justify-center gap-4 rounded-3xl bg-[var(--surface-strong)] p-6 shadow-sm border border-[var(--line)] transition-all duration-300 hover:-translate-y-3 hover:shadow-xl hover:border-[var(--rose-blush)]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-[var(--sea-ink)] transition-transform duration-300 group-hover:scale-110">{social.icon}</span>
              <span className="font-bold text-[var(--sea-ink)] whitespace-nowrap">{social.name}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
