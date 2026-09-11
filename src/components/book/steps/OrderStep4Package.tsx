import React from 'react'
import type { LightboxImage } from '../ImageLightboxModal'

interface OrderStep4PackageProps {
  packageType: 'standard' | 'personalized'
  setPackageType: (type: 'standard' | 'personalized') => void
  freebiePhotocard: string
  additionalPhotocards: string
  postcardMessage: string
  isFreebieValid: (v: string) => boolean
  isMessageValid: (v: string) => boolean
  onFreebieChange: (v: string) => void
  setAdditionalPhotocards: (v: string) => void
  onMessageChange: (v: string) => void
  errors: Record<string, string>
  onBack: () => void
  onNext: () => void
  onZoomImage: (img: NonNullable<LightboxImage>) => void
}

export const OrderStep4Package: React.FC<OrderStep4PackageProps> = ({
  packageType,
  setPackageType,
  freebiePhotocard,
  additionalPhotocards,
  postcardMessage,
  isFreebieValid,
  isMessageValid,
  onFreebieChange,
  setAdditionalPhotocards,
  onMessageChange,
  errors,
  onBack,
  onNext,
  onZoomImage,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="display-title text-2xl sm:text-3xl text-[var(--sea-ink)] mb-2">Choose Your Package</h3>
      <p className="text-[var(--sea-ink-soft)] mb-8">Select which signed edition you'd like to reserve.</p>

      <div className="space-y-4 mb-8">
        {/* Standard Edition */}
        <label
          className={`block p-6 rounded-2xl border-2 cursor-pointer transition-all ${
            packageType === 'standard' ? 'border-[var(--lagoon-deep)] bg-white shadow-md' : 'border-[var(--line)] bg-white/40 hover:bg-white/60'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                packageType === 'standard' ? 'border-[var(--lagoon-deep)]' : 'border-gray-300'
              }`}
            >
              {packageType === 'standard' && <div className="w-3 h-3 rounded-full bg-[var(--lagoon-deep)]" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-lg text-[var(--sea-ink)]">Standard Edition</h4>
                <span className="font-bold text-xl text-[var(--lagoon-deep)]">₱650</span>
              </div>
              <ul className="text-sm text-[var(--sea-ink-soft)] space-y-1">
                <li className="flex gap-2"><span className="text-[var(--lagoon)]">✦</span> Author Signed Copy</li>
                <li className="flex gap-2"><span className="text-[var(--lagoon)]">✦</span> Official Bookmark</li>
              </ul>
            </div>
          </div>
          <input
            type="radio"
            name="package"
            value="standard"
            checked={packageType === 'standard'}
            onChange={() => setPackageType('standard')}
            className="sr-only"
          />
        </label>

        {/* Personalized Edition */}
        <label
          className={`block p-6 rounded-2xl border-2 cursor-pointer transition-all relative ${
            packageType === 'personalized' ? 'border-[var(--lagoon-deep)] bg-white shadow-md' : 'border-[var(--line)] bg-white/40 hover:bg-white/60'
          }`}
        >
          <div className="absolute -top-3 right-4 px-3 py-0.5 bg-[var(--lagoon)] text-white text-xs font-bold rounded-full shadow-sm">
            ✨ Best Value
          </div>
          <div className="flex items-start gap-4">
            <div
              className={`w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                packageType === 'personalized' ? 'border-[var(--lagoon-deep)]' : 'border-gray-300'
              }`}
            >
              {packageType === 'personalized' && <div className="w-3 h-3 rounded-full bg-[var(--lagoon-deep)]" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-lg text-[var(--sea-ink)]">Personalized Edition</h4>
                <span className="font-bold text-xl text-[var(--lagoon-deep)]">₱699</span>
              </div>
              <ul className="text-sm text-[var(--sea-ink-soft)] space-y-1">
                <li className="flex gap-2"><span className="text-[var(--lagoon)]">✦</span> Author Signed Copy</li>
                <li className="flex gap-2"><span className="text-[var(--lagoon)]">✦</span> Official Bookmark</li>
                <li className="flex gap-2"><span className="text-[var(--lagoon)]">✦</span> Freebie Photocard of your choice</li>
                <li className="flex gap-2"><span className="text-[var(--lagoon)]">✦</span> Handwritten Personalized Postcard from Rosie</li>
              </ul>
              <div
                className="relative cursor-pointer group mt-4 overflow-hidden rounded-xl border border-[var(--line)] shadow-sm bg-white"
                onClick={(e) => {
                  e.preventDefault()
                  onZoomImage({
                    src: '/images/book/personalizededition.jpg',
                    title: 'Personalized Edition Bundle Preview',
                    subtitle: 'Includes Signed Book, Bookmark, Freebie Photocard & Personalized Postcard',
                    type: 'preview'
                  })
                }}
              >
                <img src="/images/book/personalizededition.jpg" alt="Personalized Edition Preview" className="w-full group-hover:scale-102 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                  <span>🔍 Tap to enlarge bundle preview</span>
                </div>
              </div>
            </div>
          </div>
          <input
            type="radio"
            name="package"
            value="personalized"
            checked={packageType === 'personalized'}
            onChange={() => setPackageType('personalized')}
            className="sr-only"
          />
        </label>
      </div>

      {/* Personalized Edition Extras */}
      {packageType === 'personalized' && (
        <div className="space-y-6 mb-8 p-6 sm:p-7 rounded-2xl border border-dashed border-[var(--lagoon)] bg-white/40">
          <h4 className="font-bold text-[var(--sea-ink)] uppercase tracking-widest text-xs opacity-70">
            Personalized Edition Customization
          </h4>

          {/* Photocard Reference */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-bold text-[var(--sea-ink)] uppercase tracking-widest opacity-70">
                Available Photocard Designs
              </p>
              <span className="text-[11px] text-[var(--lagoon-deep)] font-medium">🔍 Tap to zoom</span>
            </div>
            <div
              className="relative cursor-pointer group overflow-hidden rounded-xl border border-[var(--line)] shadow-sm bg-white"
              onClick={() => onZoomImage({
                src: '/images/book/photocardreference.png',
                title: 'Available Photocard Designs',
                subtitle: 'Select your preferred design for your freebie photocard',
                type: 'preview'
              })}
            >
              <img src="/images/book/photocardreference.png" alt="Available Photocard Designs" className="w-full group-hover:scale-102 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                <span>🔍 Click to view high-res photocard designs</span>
              </div>
            </div>
          </div>

          {/* Postcard Sample */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-bold text-[var(--sea-ink)] uppercase tracking-widest opacity-70">
                Photocard Sample
              </p>
              <span className="text-[11px] text-[var(--lagoon-deep)] font-medium">🔍 Tap to zoom</span>
            </div>
            <div
              className="relative cursor-pointer group overflow-hidden rounded-xl border border-[var(--line)] shadow-sm bg-white"
              onClick={() => onZoomImage({
                src: '/images/book/photocardsample.png',
                title: 'Personalized Postcard Sample',
                subtitle: 'Sample handwritten note from Rosie',
                type: 'preview'
              })}
            >
              <img src="/images/book/photocardsample.png" alt="Photocard Sample" className="w-full group-hover:scale-102 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                <span>🔍 Click to view photocard sample up close</span>
              </div>
            </div>
          </div>

          {/* Freebie Photocard Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-bold text-[var(--sea-ink)]">
                Freebie Photocard Choice <span className="text-red-500">*</span>
              </label>
              {isFreebieValid(freebiePhotocard) && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 animate-in fade-in">
                  ✓ Choice noted
                </span>
              )}
            </div>
            <input
              type="text"
              value={freebiePhotocard}
              onChange={(e) => onFreebieChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl transition-all ${
                errors.freebiePhotocard
                  ? 'border-2 border-red-400 bg-red-50/20 focus:border-red-500'
                  : isFreebieValid(freebiePhotocard)
                  ? 'border-2 border-emerald-500/60 bg-emerald-50/10 focus:border-emerald-600'
                  : 'border border-[var(--line)] bg-white/70 focus:border-[var(--lagoon-deep)]'
              } focus:outline-none`}
              placeholder="e.g. Photocard 1A"
            />
            {errors.freebiePhotocard ? (
              <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {errors.freebiePhotocard}
              </p>
            ) : (
              <p className="text-xs text-[var(--sea-ink-soft)] mt-1">
                Type the name or code of your desired photocard from the designs shown above.
              </p>
            )}
          </div>

          {/* Additional Photocards (Optional) */}
          <div>
            <label className="block text-sm font-bold text-[var(--sea-ink)] mb-1">
              Additional Photocards <span className="text-xs font-normal text-[var(--sea-ink-soft)]">(Optional)</span>
            </label>
            <input
              type="text"
              value={additionalPhotocards}
              onChange={(e) => setAdditionalPhotocards(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-white/70 focus:outline-none focus:border-[var(--lagoon-deep)]"
              placeholder="e.g. Photocard 1A, Photocard 2B"
            />
            <p className="text-xs text-[var(--sea-ink-soft)] mt-1">
              If you'd like extra photocards aside from the freebie, list their names here.
            </p>
          </div>

          {/* Postcard Message */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-bold text-[var(--sea-ink)]">
                Personalized Photocard Topic or Question <span className="text-red-500">*</span>
              </label>
              {isMessageValid(postcardMessage) && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 animate-in fade-in">
                  ✓ Message ready
                </span>
              )}
            </div>
            <textarea
              value={postcardMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 rounded-xl transition-all ${
                errors.postcardMessage
                  ? 'border-2 border-red-400 bg-red-50/20 focus:border-red-500'
                  : isMessageValid(postcardMessage)
                  ? 'border-2 border-emerald-500/60 bg-emerald-50/10 focus:border-emerald-600'
                  : 'border border-[var(--line)] bg-white/70 focus:border-[var(--lagoon-deep)]'
              } focus:outline-none resize-none`}
              placeholder="Share a question, a feeling, a thought, or anything you would like Rosie to write to you about..."
            />
            {errors.postcardMessage ? (
              <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {errors.postcardMessage}
              </p>
            ) : (
              <p className="text-xs text-[var(--sea-ink-soft)] mt-1">
                Rosie will write a personal handwritten message on your postcard based on this!
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-4 rounded-full border border-[var(--line)] text-[var(--sea-ink-soft)] font-bold hover:bg-white/50 transition-all"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 py-4 rounded-full bg-[var(--sea-ink)] text-[var(--bg-base)] font-bold text-lg hover:-translate-y-1 hover:shadow-lg transition-all"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  )
}
