import React from 'react'

export type LightboxImage = {
  src: string
  title: string
  subtitle?: string
  type?: 'qr' | 'cover' | 'preview'
  activeBank?: 'gcash' | 'maya' | 'mari' | 'land'
} | null

interface ImageLightboxModalProps {
  image: LightboxImage
  onClose: () => void
  onSelectImage: (img: NonNullable<LightboxImage>) => void
  totalAmount?: number
  onCoverChange?: (view: 'front' | 'back' | 'wrap') => void
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  image,
  onClose,
  onSelectImage,
  totalAmount = 650,
  onCoverChange
}) => {
  if (!image) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-xl w-full bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-[var(--line)] flex flex-col items-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="w-full flex items-start justify-between pb-3 border-b border-[var(--line)] mb-4">
          <div>
            <h4 className="font-bold text-lg text-[var(--sea-ink)]">{image.title}</h4>
            {image.subtitle && (
              <p className="text-xs text-[var(--sea-ink-soft)] mt-0.5">{image.subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[var(--sea-ink)] transition-colors text-base font-bold shrink-0 ml-3"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Image */}
        <div className="w-full flex items-center justify-center overflow-hidden rounded-2xl bg-[#faf8f5] p-2 sm:p-4 border border-[var(--line)]">
          <img
            src={image.src}
            alt={image.title}
            className="max-h-[60vh] sm:max-h-[68vh] w-auto max-w-full object-contain rounded-xl shadow-sm"
          />
        </div>

        {/* QR Quick Switcher */}
        {image.type === 'qr' && (
          <div className="mt-4 w-full flex flex-col items-center">
            <p className="text-xs text-[var(--sea-ink-soft)] mb-2 font-medium">Switch bank / wallet QR:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { key: 'gcash', name: 'GCash', src: '/images/payments/gcash.jpg' },
                { key: 'maya', name: 'Maya', src: '/images/payments/maya.jpg' },
                { key: 'mari', name: 'MariBank', src: '/images/payments/mari.jpg' },
                { key: 'land', name: 'Landbank', src: '/images/payments/land.jpg' },
              ].map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => onSelectImage({
                    src: b.src,
                    title: `${b.name} Payment QR Code`,
                    subtitle: `Scan with ${b.name} app • Total Amount: ₱${totalAmount.toFixed(2)}`,
                    type: 'qr',
                    activeBank: b.key as any
                  })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    image.src === b.src
                      ? 'bg-[var(--sea-ink)] text-white border-transparent shadow-sm'
                      : 'bg-white border-[var(--line)] text-[var(--sea-ink)] hover:bg-gray-100'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cover Quick Switcher */}
        {image.type === 'cover' && (
          <div className="mt-4 w-full flex flex-col items-center">
            <p className="text-xs text-[var(--sea-ink-soft)] mb-2 font-medium">Switch cover view:</p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  onCoverChange?.('front')
                  onSelectImage({
                    src: '/images/book/bookcover-front.png',
                    title: 'The Art of Living at Your Own Pace — Front Cover',
                    subtitle: 'Original artwork & illustration by Roselyn Mariano',
                    type: 'cover'
                  })
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  image.src === '/images/book/bookcover-front.png'
                    ? 'bg-[var(--sea-ink)] text-white border-transparent shadow-sm'
                    : 'bg-white border-[var(--line)] text-[var(--sea-ink)] hover:bg-gray-100'
                }`}
              >
                Front Cover
              </button>
              <button
                type="button"
                onClick={() => {
                  onCoverChange?.('back')
                  onSelectImage({
                    src: '/images/book/bookcover-back.png',
                    title: 'The Art of Living at Your Own Pace — Back Cover',
                    subtitle: 'Back cover blurb & reflection',
                    type: 'cover'
                  })
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  image.src === '/images/book/bookcover-back.png'
                    ? 'bg-[var(--sea-ink)] text-white border-transparent shadow-sm'
                    : 'bg-white border-[var(--line)] text-[var(--sea-ink)] hover:bg-gray-100'
                }`}
              >
                Back Cover
              </button>
              <button
                type="button"
                onClick={() => {
                  onCoverChange?.('wrap')
                  onSelectImage({
                    src: '/images/book/bookcover.png',
                    title: 'The Art of Living at Your Own Pace — Full Cover Wrap',
                    subtitle: 'Complete front, spine, and back cover panoramic jacket',
                    type: 'cover'
                  })
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  image.src === '/images/book/bookcover.png'
                    ? 'bg-[var(--sea-ink)] text-white border-transparent shadow-sm'
                    : 'bg-white border-[var(--line)] text-[var(--sea-ink)] hover:bg-gray-100'
                }`}
              >
                Full Wrap
              </button>
            </div>
          </div>
        )}

        {/* Footer Close Hint */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] underline font-medium"
          >
            Click outside or press Esc to close
          </button>
        </div>
      </div>
    </div>
  )
}
