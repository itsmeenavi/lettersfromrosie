import React from 'react'

interface OrderProgressBarProps {
  step: number
}

const STEP_LABELS = [
  'Reminders',
  'Recipient',
  'Shipping',
  'Edition',
  'Payment',
]

export const OrderProgressBar: React.FC<OrderProgressBarProps> = ({ step }) => {
  if (step >= 6) return null

  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <div className="flex items-center gap-2 mb-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <div
            key={num}
            className={`h-2 rounded-full transition-all duration-300 ${
              step >= num ? 'bg-[var(--lagoon)] w-10' : 'bg-[var(--line)] w-3'
            }`}
          />
        ))}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lagoon-deep)]">
        Step {step} of 5: {STEP_LABELS[step - 1]}
      </p>
    </div>
  )
}
