import React from 'react'

interface OrderStep1RemindersProps {
  onNext: () => void
}

export const OrderStep1Reminders: React.FC<OrderStep1RemindersProps> = ({ onNext }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="display-title text-2xl sm:text-3xl text-[var(--sea-ink)] mb-2">Important Reminders</h3>
      <p className="text-[var(--sea-ink-soft)] mb-6">Please read these notes before placing your order.</p>

      <div className="bg-white/60 rounded-2xl p-6 border border-[var(--line)] mb-8 text-sm text-[var(--sea-ink)] leading-relaxed space-y-4">
        <p className="text-[var(--sea-ink-soft)]">
          Before placing your order, please take a moment to read these reminders carefully. This helps us process every order smoothly and accurately. Thank you so much for your understanding and cooperation!
        </p>

        <ul className="space-y-3 list-none">
          <li className="flex gap-2.5">
            <span className="text-[var(--lagoon-deep)] font-bold shrink-0">•</span>
            <span><strong>PAYMENT FIRST</strong> — Please complete your full payment before filling out the order form.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-[var(--lagoon-deep)] font-bold shrink-0">•</span>
            <span><strong>FULL PAYMENT ONLY</strong> — We kindly ask for full payment only. Installment payments are not available for book orders.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-[var(--lagoon-deep)] font-bold shrink-0">•</span>
            <span><strong>NO CANCELLATIONS OR REFUNDS</strong> — Once payment has been made, orders can no longer be cancelled, and payments are strictly non-refundable.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-[var(--lagoon-deep)] font-bold shrink-0">•</span>
            <span><strong>PLEASE PROVIDE A VALID EMAIL</strong> — Make sure to enter a correct, active, and working email address. Please double-check your email domain (e.g., gmail.com, yahoo.com) before submitting.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-[var(--lagoon-deep)] font-bold shrink-0">•</span>
            <span><strong>DOUBLE-CHECK YOUR DETAILS</strong> — Kindly make sure that all information you provide is complete and accurate.</span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-[var(--lagoon-deep)] font-bold shrink-0">•</span>
            <span><strong>USE ONLY THE LISTED PAYMENT CHANNELS</strong> — Please send your payment only through the official channels provided in Step 5 (GCash, Maya, MariBank, Landbank).</span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-[var(--lagoon-deep)] font-bold shrink-0">•</span>
            <span><strong>FOR BULK ORDERS</strong> — If you are placing a bulk order, please send us a message first before filling out the form.</span>
          </li>
        </ul>

        <p className="text-[var(--sea-ink-soft)] italic pt-2 border-t border-[var(--line)]">
          Thank you for taking the time to read these reminders and for supporting <em>The Art of Living at Your Own Pace</em>. Your order means so much to us. ♡
        </p>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full py-4 rounded-full bg-[var(--sea-ink)] text-[var(--bg-base)] font-bold text-lg hover:-translate-y-1 hover:shadow-lg transition-all"
      >
        I Understand, Continue to Details
      </button>
    </div>
  )
}
