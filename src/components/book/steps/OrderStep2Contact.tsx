import React from 'react'

interface OrderStep2ContactProps {
  name: string
  pronouns: string
  email: string
  socialLink: string
  isNameValid: (v: string) => boolean
  isEmailValid: (v: string) => boolean
  isSocialValid: (v: string) => boolean
  onNameChange: (v: string) => void
  onPronounsChange: (v: string) => void
  onEmailChange: (v: string) => void
  onSocialChange: (v: string) => void
  errors: Record<string, string>
  onBack: () => void
  onNext: () => void
}

export const OrderStep2Contact: React.FC<OrderStep2ContactProps> = ({
  name,
  pronouns,
  email,
  socialLink,
  isNameValid,
  isEmailValid,
  isSocialValid,
  onNameChange,
  onPronounsChange,
  onEmailChange,
  onSocialChange,
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

        {/* Social Media Handle */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-bold text-[var(--sea-ink)]">
              Social Media / Account Username <span className="text-red-500">*</span>
            </label>
            {isSocialValid(socialLink) && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 animate-in fade-in">
                ✓ Connected
              </span>
            )}
          </div>
          <input
            type="text"
            value={socialLink}
            onChange={(e) => onSocialChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl transition-all ${
              errors.socialLink
                ? 'border-2 border-red-400 bg-red-50/20 focus:border-red-500'
                : isSocialValid(socialLink)
                ? 'border-2 border-emerald-500/60 bg-emerald-50/10 focus:border-emerald-600'
                : 'border border-[var(--line)] bg-white/70 focus:border-[var(--lagoon-deep)]'
            } focus:outline-none`}
            placeholder="e.g. @yourusername or Instagram profile link"
          />
          {errors.socialLink ? (
            <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {errors.socialLink}
            </p>
          ) : isSocialValid(socialLink) ? (
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span>✓</span> Username saved!
            </p>
          ) : (
            <p className="text-xs text-[var(--sea-ink-soft)] mt-1">
              So Rosie can message you directly on Instagram for confirmation.
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
