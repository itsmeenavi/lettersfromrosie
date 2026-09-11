import React from 'react'
import type { LightboxImage } from './ImageLightboxModal'

interface BookHeroShowcaseProps {
  coverView: 'front' | 'back' | 'spread'
  setCoverView: (view: 'front' | 'back' | 'spread') => void
  onZoomCover: (img: NonNullable<LightboxImage>) => void
  onScrollToForm: () => void
}

export const BookHeroShowcase: React.FC<BookHeroShowcaseProps> = ({
  coverView,
  setCoverView,
  onZoomCover,
  onScrollToForm,
}) => {
  const handleCoverClick = () => {
    if (coverView === 'front') {
      onZoomCover({
        src: '/images/book/bookcover-front.png',
        title: 'The Art of Living at Your Own Pace — Front Cover',
        subtitle: 'Original artwork & illustration by Roselyn Mariano',
        type: 'cover',
      })
    } else if (coverView === 'back') {
      onZoomCover({
        src: '/images/book/bookcover-back.png',
        title: 'The Art of Living at Your Own Pace — Back Cover',
        subtitle: 'Back cover blurb & gentle reminders',
        type: 'cover',
      })
    } else {
      onZoomCover({
        src: '/images/book/bookcover.png',
        title: 'The Art of Living at Your Own Pace — Full Wrap Spread',
        subtitle: 'Complete panoramic jacket with spine and both covers',
        type: 'cover',
      })
    }
  }

  return (
    <section className="mx-auto max-w-6xl mb-20 lg:mb-28">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[var(--lagoon)]/15 text-[var(--lagoon-deep)] text-xs font-bold uppercase tracking-wider mb-4">
          <span>📖 Official Book Release</span>
        </div>
        <h1 className="display-title text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--sea-ink)] drop-shadow-sm max-w-3xl mx-auto">
          The Art of Living at Your Own Pace
        </h1>
        <p className="mt-3 text-lg text-[var(--sea-ink-soft)]">
          Written and Illustrated by <span className="font-semibold text-[var(--sea-ink)]">Roselyn Mariano (Letters from Rosie)</span>
        </p>
        <div className="mx-auto mt-6 h-[2px] w-16 bg-[var(--lagoon)] rounded-full"></div>
      </div>

      {/* 2-Column Hero: Left = Book Cover Showcase, Right = Description & Audience Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

        {/* LEFT: 3-WAY INTERACTIVE BOOK COVER */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] sm:max-w-sm">
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-center p-1 bg-white/80 backdrop-blur-md rounded-full border border-[var(--line)] mx-auto mb-4 shadow-xs">
              <button
                type="button"
                onClick={() => setCoverView('front')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all ${
                  coverView === 'front'
                    ? 'bg-[var(--sea-ink)] text-[var(--bg-base)] shadow-sm'
                    : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'
                }`}
              >
                Front Cover
              </button>
              <button
                type="button"
                onClick={() => setCoverView('back')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all ${
                  coverView === 'back'
                    ? 'bg-[var(--sea-ink)] text-[var(--bg-base)] shadow-sm'
                    : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'
                }`}
              >
                Back Cover
              </button>
              <button
                type="button"
                onClick={() => setCoverView('spread')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all ${
                  coverView === 'spread'
                    ? 'bg-[var(--sea-ink)] text-[var(--bg-base)] shadow-sm'
                    : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'
                }`}
              >
                Full Wrap
              </button>
            </div>

            {/* Main Cover Display Container */}
            <div
              className="relative group cursor-pointer"
              onClick={handleCoverClick}
            >
              <div className="absolute inset-0 bg-black/10 blur-xl translate-y-6 translate-x-4 rounded-xl -z-10 transition-transform duration-500 group-hover:translate-y-8 group-hover:translate-x-6"></div>

              {/* Front view */}
              {coverView === 'front' && (
                <div className="relative rounded-r-3xl rounded-l-md overflow-hidden border border-[var(--line)] border-l-8 border-l-black/15 shadow-[inset_6px_0_12px_rgba(0,0,0,0.15)] bg-[var(--surface-strong)] aspect-[530/840] flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1 group-hover:-rotate-1">
                  <img
                    src="/images/book/bookcover-front.png"
                    alt="The Art of Living at Your Own Pace Front Cover"
                    className="relative z-10 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20 backdrop-blur-[2px]">
                    <span className="px-4 py-2 rounded-full bg-white/90 text-[var(--sea-ink)] text-xs font-bold shadow-lg flex items-center gap-1.5">
                      🔍 Click to view full size
                    </span>
                  </div>
                </div>
              )}

              {/* Back view */}
              {coverView === 'back' && (
                <div className="relative rounded-l-3xl rounded-r-md overflow-hidden border border-[var(--line)] border-r-8 border-r-black/15 shadow-[inset_-6px_0_12px_rgba(0,0,0,0.15)] bg-[var(--surface-strong)] aspect-[530/840] flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-1">
                  <img
                    src="/images/book/bookcover-back.png"
                    alt="The Art of Living at Your Own Pace Back Cover"
                    className="relative z-10 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20 backdrop-blur-[2px]">
                    <span className="px-4 py-2 rounded-full bg-white/90 text-[var(--sea-ink)] text-xs font-bold shadow-lg flex items-center gap-1.5">
                      🔍 Click to view full size
                    </span>
                  </div>
                </div>
              )}

              {/* Full spread view */}
              {coverView === 'spread' && (
                <div className="relative rounded-2xl overflow-hidden border border-[var(--line)] shadow-xl bg-[var(--surface-strong)] aspect-[1144/840] flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1">
                  <img
                    src="/images/book/bookcover.png"
                    alt="The Art of Living at Your Own Pace Full Wrap Cover"
                    className="relative z-10 w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20 backdrop-blur-[2px]">
                    <span className="px-4 py-2 rounded-full bg-white/90 text-[var(--sea-ink)] text-xs font-bold shadow-lg flex items-center gap-1.5">
                      🔍 Click to view full size
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Miniature Thumbnails */}
            <div className="grid grid-cols-3 gap-2.5 mt-4">
              <button
                type="button"
                onClick={() => setCoverView('front')}
                className={`relative rounded-xl overflow-hidden border-2 transition-all p-1 bg-white/60 text-left ${
                  coverView === 'front' ? 'border-[var(--lagoon-deep)] ring-2 ring-[var(--lagoon)]/20' : 'border-transparent hover:border-[var(--line)]'
                }`}
              >
                <div className="aspect-[530/840] rounded-lg overflow-hidden bg-gray-100">
                  <img src="/images/book/bookcover-front.png" alt="Front preview" className="w-full h-full object-cover" />
                </div>
                <p className="text-[11px] font-bold text-center mt-1 text-[var(--sea-ink)]">Front</p>
              </button>

              <button
                type="button"
                onClick={() => setCoverView('back')}
                className={`relative rounded-xl overflow-hidden border-2 transition-all p-1 bg-white/60 text-left ${
                  coverView === 'back' ? 'border-[var(--lagoon-deep)] ring-2 ring-[var(--lagoon)]/20' : 'border-transparent hover:border-[var(--line)]'
                }`}
              >
                <div className="aspect-[530/840] rounded-lg overflow-hidden bg-gray-100">
                  <img src="/images/book/bookcover-back.png" alt="Back preview" className="w-full h-full object-cover" />
                </div>
                <p className="text-[11px] font-bold text-center mt-1 text-[var(--sea-ink)]">Back</p>
              </button>

              <button
                type="button"
                onClick={() => setCoverView('spread')}
                className={`relative rounded-xl overflow-hidden border-2 transition-all p-1 bg-white/60 text-left flex flex-col justify-between ${
                  coverView === 'spread' ? 'border-[var(--lagoon-deep)] ring-2 ring-[var(--lagoon)]/20' : 'border-transparent hover:border-[var(--line)]'
                }`}
              >
                <div className="aspect-[530/840] rounded-lg overflow-hidden bg-gray-100 flex items-center">
                  <img src="/images/book/bookcover.png" alt="Full wrap preview" className="w-full h-auto object-cover" />
                </div>
                <p className="text-[11px] font-bold text-center mt-1 text-[var(--sea-ink)]">Full Wrap</p>
              </button>
            </div>

            <p className="text-center text-xs text-[var(--sea-ink-soft)] mt-3">
              ✦ Tap any view to preview front, back, or full panoramic jacket
            </p>
          </div>
        </div>

        {/* RIGHT: ABOUT THE BOOK, SPECS, & ORDER ROUTING */}
        <div className="lg:col-span-7 space-y-6">

          {/* Description Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 border border-[var(--line)] shadow-xs">
            <h2 className="font-serif text-2xl font-bold text-[var(--sea-ink)] mb-4">
              About the Book
            </h2>
            <div className="font-serif text-[15px] sm:text-base leading-relaxed text-[var(--sea-ink-soft)] space-y-4">
              <p>
                The world teaches us to measure life by the destinations we reach, but the heart quietly reminds us that the truest parts of living are found in the journey between them.
              </p>
              <p>
                <strong className="font-bold text-[var(--sea-ink)]">The Art of Living at Your Own Pace</strong> is a heartfelt collection of reflective essays, original illustrations, and guided journal prompts that invites you to slow down and embrace life as it unfolds. Featuring beloved writings from Letters from Rosie, along with new reflections written especially for this book, these pages explore healing, self-love, purpose, grief, hope, gratitude, and the quiet beauty of living at your own pace.
              </p>
              <p>
                Each chapter is paired with thoughtful prompts and journaling space, encouraging you to reflect on your own journey. Whether you're navigating change, waiting for what's next, or simply searching for a little peace, this book is here to remind you that you are not behind. Because life isn't a race to the finish; it's a journey to be lived, one gentle step at a time.
              </p>
            </div>

            {/* Book Specifications Grid */}
            <div className="mt-6 pt-6 border-t border-[var(--line)]">
              <h3 className="font-bold text-xs uppercase tracking-widest text-[var(--sea-ink)] opacity-70 mb-3">
                Publication Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[var(--line)]">
                  <span className="text-[var(--sea-ink-soft)] block mb-0.5">Length</span>
                  <span className="font-bold text-[var(--sea-ink)] text-sm">287 pages</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[var(--line)]">
                  <span className="text-[var(--sea-ink-soft)] block mb-0.5">Format</span>
                  <span className="font-bold text-[var(--sea-ink)] text-sm">Paperback</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[var(--line)]">
                  <span className="text-[var(--sea-ink-soft)] block mb-0.5">Dimensions</span>
                  <span className="font-bold text-[var(--sea-ink)] text-sm">5.5 × 8.5 in</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[var(--line)]">
                  <span className="text-[var(--sea-ink-soft)] block mb-0.5">ISBN-13</span>
                  <span className="font-bold text-[var(--sea-ink)] text-xs">979-8190816990</span>
                </div>
              </div>
            </div>
          </div>

          {/* ORDER ROUTING: Clear distinction between Philippine & International */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* 🇵🇭 Philippine Orders Card */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[var(--lagoon-deep)] shadow-md relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🇵🇭</span>
                  <h3 className="font-bold text-lg text-[var(--sea-ink)]">Philippine Readers</h3>
                </div>
                <p className="text-xs text-[var(--sea-ink-soft)] leading-relaxed mb-4">
                  Order directly through our local form below. Includes <strong>author signature</strong>, bookmark, freebie photocard, and optional personalized postcard.
                </p>
                <p className="text-xs font-semibold text-[var(--lagoon-deep)]">
                  ✦ Nationwide shipping via J&T Express or Lalamove
                </p>
              </div>
              <button
                type="button"
                onClick={onScrollToForm}
                className="mt-5 w-full py-3 px-4 rounded-full bg-[var(--sea-ink)] text-[var(--bg-base)] font-bold text-sm hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Pre-Order Form Below</span>
                <span>↓</span>
              </button>
            </div>

            {/* 🌍 International Orders Card (Amazon) */}
            <div className="p-6 rounded-3xl bg-white/70 border border-[var(--line)] shadow-xs flex flex-col justify-between hover:border-[var(--lagoon)] transition-all">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🌍</span>
                  <h3 className="font-bold text-lg text-[var(--sea-ink)]">International Readers</h3>
                </div>
                <p className="text-xs text-[var(--sea-ink-soft)] leading-relaxed mb-4">
                  Living outside the Philippines? Order the paperback edition worldwide on <strong>Amazon</strong> with international shipping directly to your country.
                </p>
                <p className="text-xs text-[var(--sea-ink-soft)]">
                  ✦ Available globally via Amazon's worldwide network
                </p>
              </div>
              <a
                href="https://www.amazon.com/Art-Living-Your-Own-Pace/dp/B0HDNRM49T"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full py-3 px-4 rounded-full border-2 border-[var(--sea-ink)] text-[var(--sea-ink)] font-bold text-sm hover:bg-[var(--sea-ink)] hover:text-white transition-all flex items-center justify-center gap-1.5 text-center"
              >
                <span>Order on Amazon</span>
                <span>↗</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
