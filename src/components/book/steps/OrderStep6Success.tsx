import React from 'react'

interface OrderStep6SuccessProps {
  onReset: () => void
}

export const OrderStep6Success: React.FC<OrderStep6SuccessProps> = ({ onReset }) => {
  return (
    <div className="text-center animate-in zoom-in-95 duration-700 py-10">
      <div className="w-20 h-20 rounded-full bg-[var(--lagoon)] text-white flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-[var(--lagoon)]/20">
        ✓
      </div>
      <h3 className="display-title text-3xl sm:text-4xl text-[var(--sea-ink)] mb-4">Thank you for your order!</h3>
      <p className="text-lg text-[var(--sea-ink-soft)] mb-4 max-w-sm mx-auto">
        Your pre-order has been received and your proof of payment was recorded successfully.
      </p>
      <div className="bg-white/70 rounded-2xl p-6 border border-[var(--line)] mb-8 max-w-md mx-auto text-sm text-left space-y-3">
        <p className="text-[var(--sea-ink)]">
          <strong>Next step:</strong> Please send a message on Instagram at{' '}
          <a href="https://www.instagram.com/lettersfromrosie_" target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--lagoon-deep)] hover:underline">@lettersfromrosie_</a>{' '}
          for confirmation.
        </p>
        <p className="text-[var(--sea-ink-soft)]">
          Further details regarding your order dispatch and delivery updates will be shared with you afterwards.
        </p>
        <p className="text-[var(--sea-ink-soft)] italic pt-2 border-t border-[var(--line)]">
          Thank you so much for your support for <em>The Art of Living at Your Own Pace</em>. God bless you always, dear reader! ♡
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-3 rounded-full bg-white/80 border border-[var(--line)] text-[var(--sea-ink)] font-bold hover:bg-white transition-all text-sm shadow-xs"
        >
          ↺ Submit Another Order / Test Again
        </button>
        <button
          type="button"
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 rounded-full bg-[var(--sea-ink)] text-[var(--bg-base)] font-bold hover:opacity-90 transition-all text-sm shadow-md"
        >
          Return Home
        </button>
      </div>
    </div>
  )
}
