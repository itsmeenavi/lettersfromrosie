import React from 'react'
import {
  type SocialAccount,
  type SocialPlatform,
  formatSocialUrl,
} from '../types'

interface OrderStep2ContactProps {
  name: string
  pronouns: string
  email: string
  socialAccounts: SocialAccount[]
  isNameValid: (v: string) => boolean
  isEmailValid: (v: string) => boolean
  isSocialValid: boolean
  onNameChange: (v: string) => void
  onPronounsChange: (v: string) => void
  onEmailChange: (v: string) => void
  onAddSocialAccount: () => void
  onRemoveSocialAccount: (id: string) => void
  onUpdateSocialAccount: (id: string, platform: SocialPlatform, value: string) => void
  errors: Record<string, string>
  onBack: () => void
  onNext: () => void
}

const PLATFORMS: { id: SocialPlatform; label: string; icon: string; placeholder: string }[] = [
  { id: 'instagram', label: 'Instagram', icon: '📷', placeholder: 'e.g. @username or instagram.com/username' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', placeholder: 'e.g. @username or tiktok.com/@username' },
  { id: 'medium', label: 'Medium', icon: '📖', placeholder: 'e.g. @username or medium.com/@username' },
  { id: 'facebook', label: 'Facebook', icon: '📘', placeholder: 'e.g. facebook.com/profile.name' },
  { id: 'twitter', label: 'X / Twitter', icon: '🐦', placeholder: 'e.g. @username or x.com/username' },
  { id: 'other', label: 'Other Link', icon: '🌐', placeholder: 'Paste full profile link...' },
]

export const OrderStep2Contact: React.FC<OrderStep2ContactProps> = ({
  name,
  pronouns,
  email,
  socialAccounts,
  isNameValid,
  isEmailValid,
  isSocialValid,
  onNameChange,
  onPronounsChange,
  onEmailChange,
  onAddSocialAccount,
  onRemoveSocialAccount,
  onUpdateSocialAccount,
  errors,
  onBack,
  onNext,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="display-title text-2xl sm:text-3xl text-[var(--sea-ink)] mb-2">Your Details</h3>
      <p className="text-[var(--sea-ink-soft)] mb-8">Let us know who is ordering this signed copy.</p>

      <div className="space-y-6 mb-10">
        {/* Name + Pronouns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-bold text-[var(--sea-ink)]">
                Your Name <span className="text-red-500">*</span>
              </label>
              {isNameValid(name) && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 animate-in fade-in">
                  ✓ Ready
                </span>
              )}
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl transition-all ${
                errors.name
                  ? 'border-2 border-red-400 bg-red-50/20 focus:border-red-500'
                  : isNameValid(name)
                  ? 'border-2 border-emerald-500/60 bg-emerald-50/10 focus:border-emerald-600'
                  : 'border border-[var(--line)] bg-white/70 focus:border-[var(--lagoon-deep)]'
              } focus:outline-none`}
              placeholder="e.g. Maria Santos"
            />
            {errors.name ? (
              <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {errors.name}
              </p>
            ) : isNameValid(name) ? (
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <span>✓</span> Looks good!
              </p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--sea-ink)] mb-1">
              Pronouns <span className="text-xs font-normal text-[var(--sea-ink-soft)]">(Optional)</span>
            </label>
            <input
              type="text"
              value={pronouns}
              onChange={(e) => onPronounsChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-white/70 focus:outline-none focus:border-[var(--lagoon-deep)]"
              placeholder="e.g. she/her, he/him, they/them"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-bold text-[var(--sea-ink)]">
              Email Address <span className="text-red-500">*</span>
            </label>
            {isEmailValid(email) && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 animate-in fade-in">
                ✓ Valid Email
              </span>
            )}
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl transition-all ${
              errors.email
                ? 'border-2 border-red-400 bg-red-50/20 focus:border-red-500'
                : isEmailValid(email)
                ? 'border-2 border-emerald-500/60 bg-emerald-50/10 focus:border-emerald-600'
                : 'border border-[var(--line)] bg-white/70 focus:border-[var(--lagoon-deep)]'
            } focus:outline-none`}
            placeholder="yourname@gmail.com"
          />
          {errors.email ? (
            <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {errors.email}
            </p>
          ) : isEmailValid(email) ? (
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span>✓</span> Valid email address — order updates will be sent here.
            </p>
          ) : (
            <p className="text-xs text-[var(--sea-ink-soft)] mt-1">
              Please enter an active email address so we can send your order confirmation.
            </p>
          )}
        </div>

        {/* Social Media Link Selection & Multiple Options */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/60 border border-[var(--line)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-bold text-[var(--sea-ink)]">
                Social Media / Profile Link <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-[var(--sea-ink-soft)] mt-0.5">
                Provide your profile link or handle so Rosie can easily reach out and confirm your order.
              </p>
            </div>
            {isSocialValid && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 animate-in fade-in shrink-0">
                ✓ Connected
              </span>
            )}
          </div>

          <div className="space-y-3">
            {socialAccounts.map((account, index) => {
              const currentPlatform = PLATFORMS.find((p) => p.id === account.platform) || PLATFORMS[0]
              const generatedUrl = formatSocialUrl(account.platform, account.value)

              return (
                <div key={account.id} className="p-3.5 rounded-xl bg-white border border-[var(--line)] shadow-xs space-y-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    {/* Platform Selector */}
                    <div className="relative shrink-0 sm:w-44">
                      <select
                        value={account.platform}
                        onChange={(e) =>
                          onUpdateSocialAccount(account.id, e.target.value as SocialPlatform, account.value)
                        }
                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--line)] bg-[#faf8f5] text-xs font-bold text-[var(--sea-ink)] focus:outline-none focus:border-[var(--lagoon-deep)] cursor-pointer"
                      >
                        {PLATFORMS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.icon} {p.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Handle or URL Input */}
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={account.value}
                        onChange={(e) =>
                          onUpdateSocialAccount(account.id, account.platform, e.target.value)
                        }
                        placeholder={currentPlatform.placeholder}
                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--line)] bg-white text-xs text-[var(--sea-ink)] focus:outline-none focus:border-[var(--lagoon-deep)]"
                      />
                    </div>

                    {/* Remove button if more than 1 account */}
                    {socialAccounts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemoveSocialAccount(account.id)}
                        className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors shrink-0 text-sm"
                        title="Remove social link"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Clickable URL Preview */}
                  {generatedUrl && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[var(--lagoon-deep)] pt-1 pl-1">
                      <span className="opacity-70">Direct Link for Rosie:</span>
                      <a
                        href={generatedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline truncate max-w-[280px] sm:max-w-md hover:opacity-80"
                      >
                        {generatedUrl} ↗
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Add Another Link Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onAddSocialAccount}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--lagoon-deep)] hover:text-[var(--sea-ink)] transition-colors py-1 px-3 rounded-full bg-[var(--lagoon)]/10 hover:bg-[var(--lagoon)]/20"
            >
              <span>＋</span>
              <span>Add another social link (optional)</span>
            </button>
          </div>

          {errors.socialLink && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1">
              <span>⚠️</span> {errors.socialLink}
            </p>
          )}
        </div>
      </div>

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
          Continue to Shipping
        </button>
      </div>
    </div>
  )
}
