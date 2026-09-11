import React from 'react'

interface OrderStep3ShippingProps {
  phone: string
  address: string
  shippingMethod: string
  isPhoneValid: (v: string) => boolean
  isAddressValid: (v: string) => boolean
  onPhoneChange: (v: string) => void
  onAddressChange: (v: string) => void
  setShippingMethod: (v: string) => void
  errors: Record<string, string>
  onBack: () => void
  onNext: () => void
}

export const OrderStep3Shipping: React.FC<OrderStep3ShippingProps> = ({
  phone,
  address,
  shippingMethod,
  isPhoneValid,
  isAddressValid,
  onPhoneChange,
  onAddressChange,
  setShippingMethod,
  errors,
  onBack,
  onNext,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="display-title text-2xl sm:text-3xl text-[var(--sea-ink)] mb-2">Shipping Details</h3>
      <p className="text-[var(--sea-ink-soft)] mb-8">Where in the Philippines should we deliver your book?</p>

      <div className="space-y-6 mb-10">
        {/* Mobile Phone */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-bold text-[var(--sea-ink)]">
              Contact Mobile Number <span className="text-red-500">*</span>
            </label>
            {isPhoneValid(phone) && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 animate-in fade-in">
                ✓ Valid Number
              </span>
            )}
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl transition-all ${
              errors.phone
                ? 'border-2 border-red-400 bg-red-50/20 focus:border-red-500'
                : isPhoneValid(phone)
                ? 'border-2 border-emerald-500/60 bg-emerald-50/10 focus:border-emerald-600'
                : 'border border-[var(--line)] bg-white/70 focus:border-[var(--lagoon-deep)]'
            } focus:outline-none`}
            placeholder="e.g. 0917 123 4567"
          />
          {errors.phone ? (
            <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {errors.phone}
            </p>
          ) : isPhoneValid(phone) ? (
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span>✓</span> Valid contact number for courier delivery updates.
            </p>
          ) : (
            <p className="text-xs text-[var(--sea-ink-soft)] mt-1">
              For courier delivery SMS and call notifications.
            </p>
          )}
        </div>

        {/* Complete Address */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-bold text-[var(--sea-ink)]">
              Complete Delivery Address <span className="text-red-500">*</span>
            </label>
            {isAddressValid(address) && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 animate-in fade-in">
                ✓ Address Ready
              </span>
            )}
          </div>
          <textarea
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 rounded-xl transition-all ${
              errors.address
                ? 'border-2 border-red-400 bg-red-50/20 focus:border-red-500'
                : isAddressValid(address)
                ? 'border-2 border-emerald-500/60 bg-emerald-50/10 focus:border-emerald-600'
                : 'border border-[var(--line)] bg-white/70 focus:border-[var(--lagoon-deep)]'
            } focus:outline-none resize-none`}
            placeholder="House/Unit No., Building, Street, Barangay, City/Municipality, Province, Zip Code"
          />
          {errors.address ? (
            <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {errors.address}
            </p>
          ) : isAddressValid(address) ? (
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span>✓</span> Delivery address complete.
            </p>
          ) : (
            <p className="text-xs text-[var(--sea-ink-soft)] mt-1">
              Please include house number, street, barangay, and city for smooth courier transit.
            </p>
          )}
        </div>
      </div>

      {/* Shipping Method Options */}
      <h4 className="font-bold text-[var(--sea-ink)] mb-4 uppercase tracking-widest text-sm">
        Shipping Preference
      </h4>
      <div className="space-y-3 mb-10">
        {[
          { id: 'jt_manila', label: 'J&T Express (Metro Manila)', desc: '1–2 Days Transit', price: 85 },
          { id: 'jt_luzon', label: 'J&T Express (Luzon Provincial)', desc: '1–2 Days Transit', price: 85 },
          { id: 'jt_visayas', label: 'J&T Express (Visayas)', desc: '3–4 Days Transit', price: 100 },
          { id: 'jt_mindanao', label: 'J&T Express (Mindanao)', desc: '3–4 Days Transit', price: 105 },
          { id: 'lalamove', label: 'Lalamove / Grab (Same-Day Metro Manila)', desc: 'Buyer books and pays courier directly upon pickup', price: 0 }
        ].map((option) => (
          <label
            key={option.id}
            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
              shippingMethod === option.id
                ? 'border-[var(--lagoon-deep)] bg-white shadow-sm ring-1 ring-[var(--lagoon)]/30'
                : 'border-[var(--line)] bg-white/50 hover:bg-white/70'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  shippingMethod === option.id ? 'border-[var(--lagoon-deep)]' : 'border-gray-300'
                }`}
              >
                {shippingMethod === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[var(--lagoon-deep)]" />}
              </div>
              <div>
                <p className="font-bold text-[var(--sea-ink)] text-sm sm:text-base">{option.label}</p>
                <p className="text-xs text-[var(--sea-ink-soft)]">{option.desc}</p>
              </div>
            </div>
            <span className="font-bold text-[var(--sea-ink)] text-sm sm:text-base">
              {option.price === 0 ? 'Buyer pays' : `₱${option.price}`}
            </span>
            <input
              type="radio"
              name="shipping"
              value={option.id}
              checked={shippingMethod === option.id}
              onChange={() => setShippingMethod(option.id)}
              className="sr-only"
            />
          </label>
        ))}
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
          Continue to Package
        </button>
      </div>
    </div>
  )
}
