import React from 'react'
import type { LightboxImage } from '../ImageLightboxModal'

interface OrderStep5PaymentProps {
  packageType: 'standard' | 'personalized'
  basePrice: number
  shippingMethod: string
  shippingFee: number
  totalAmount: number
  receiptFile: File | null
  receiptPreview: string | null
  handleReceiptChange: (file: File) => void
  name: string
  pronouns: string
  email: string
  socialLink: string
  confirmed: boolean
  setConfirmed: (val: boolean) => void
  errors: Record<string, string>
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
  isSubmitting: boolean
  onBack: () => void
  onSubmit: () => void
  onZoomImage: (img: NonNullable<LightboxImage>) => void
}

export const OrderStep5Payment: React.FC<OrderStep5PaymentProps> = ({
  packageType,
  basePrice,
  shippingMethod,
  shippingFee,
  totalAmount,
  receiptFile,
  receiptPreview,
  handleReceiptChange,
  name,
  pronouns,
  email,
  socialLink,
  confirmed,
  setConfirmed,
  errors,
  setErrors,
  isSubmitting,
  onBack,
  onSubmit,
  onZoomImage,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="display-title text-2xl sm:text-3xl text-[var(--sea-ink)] mb-2">Payment & Proof</h3>
      <p className="text-[var(--sea-ink-soft)] mb-8">
        Send your payment to any official Philippine channel below, then attach your screenshot.
      </p>

      {/* Total Due Breakdown */}
      <div className="bg-white/70 rounded-2xl p-6 border border-[var(--line)] mb-8 shadow-xs">
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-[var(--line)]">
          <span className="text-sm text-[var(--sea-ink-soft)]">
            {packageType === 'standard' ? 'Standard Edition' : 'Personalized Edition'}
          </span>
          <span className="font-bold text-[var(--sea-ink)]">₱{basePrice}</span>
        </div>
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-[var(--line)]">
          <span className="text-sm text-[var(--sea-ink-soft)]">
            Shipping ({shippingMethod === 'lalamove' ? 'Buyer pays courier' : 'J&T Express'})
          </span>
          <span className="font-bold text-[var(--sea-ink)]">{shippingFee === 0 ? 'Free' : `₱${shippingFee}`}</span>
        </div>
        <div className="flex justify-between items-center font-bold text-xl text-[var(--lagoon-deep)]">
          <span>Total Amount Due</span>
          <span>₱{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Official Payment Channels with QR Codes */}
      <div className="p-5 rounded-2xl border border-[var(--line)] bg-white/70 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-6">
          <h4 className="font-bold text-[var(--sea-ink)] uppercase tracking-widest text-xs opacity-70">
            Official Payment Channels (Philippines)
          </h4>
          <span className="text-xs font-semibold text-[var(--lagoon-deep)] flex items-center gap-1">
            🔍 Tap any QR code to enlarge
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* GCash */}
          <div
            onClick={() => onZoomImage({
              src: '/images/payments/gcash.jpg',
              title: 'GCash Payment QR Code',
              subtitle: `Scan with GCash app • Total Amount: ₱${totalAmount.toFixed(2)}`,
              type: 'qr',
              activeBank: 'gcash'
            })}
            className="p-4 rounded-xl border border-[var(--line)] bg-white/95 text-center cursor-pointer hover:border-[#0052CC] hover:shadow-lg transition-all group relative"
          >
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-[#0052CC]">GCash</h5>
              <span className="text-[11px] font-bold text-[#0052CC] bg-blue-50 group-hover:bg-[#0052CC] group-hover:text-white px-2 py-0.5 rounded-full transition-colors">
                🔍 Tap to Zoom
              </span>
            </div>
            <div className="relative overflow-hidden rounded-lg border border-[var(--line)] shadow-sm bg-white">
              <img src="/images/payments/gcash.jpg" alt="GCash QR Code" className="w-full max-w-[200px] mx-auto group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                <span>🔍 View Large QR</span>
              </div>
            </div>
            <p className="text-xs text-[var(--sea-ink-soft)] mt-2 italic">Transfer fees may apply</p>
          </div>

          {/* Maya */}
          <div
            onClick={() => onZoomImage({
              src: '/images/payments/maya.jpg',
              title: 'Maya Payment QR Code',
              subtitle: `Scan with Maya app • Total Amount: ₱${totalAmount.toFixed(2)}`,
              type: 'qr',
              activeBank: 'maya'
            })}
            className="p-4 rounded-xl border border-[var(--line)] bg-white/95 text-center cursor-pointer hover:border-[#39B54A] hover:shadow-lg transition-all group relative"
          >
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-[#39B54A]">Maya</h5>
              <span className="text-[11px] font-bold text-[#39B54A] bg-green-50 group-hover:bg-[#39B54A] group-hover:text-white px-2 py-0.5 rounded-full transition-colors">
                🔍 Tap to Zoom
              </span>
            </div>
            <div className="relative overflow-hidden rounded-lg border border-[var(--line)] shadow-sm bg-white">
              <img src="/images/payments/maya.jpg" alt="Maya QR Code" className="w-full max-w-[200px] mx-auto group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                <span>🔍 View Large QR</span>
              </div>
            </div>
            <p className="text-xs text-[var(--sea-ink-soft)] mt-2 italic">Transfer fees may apply</p>
          </div>

          {/* MariBank */}
          <div
            onClick={() => onZoomImage({
              src: '/images/payments/mari.jpg',
              title: 'MariBank Payment QR Code',
              subtitle: `Scan with MariBank app • Total Amount: ₱${totalAmount.toFixed(2)}`,
              type: 'qr',
              activeBank: 'mari'
            })}
            className="p-4 rounded-xl border border-[var(--line)] bg-white/95 text-center cursor-pointer hover:border-[#EE5B2B] hover:shadow-lg transition-all group relative"
          >
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-[#EE5B2B]">MariBank</h5>
              <span className="text-[11px] font-bold text-[#EE5B2B] bg-orange-50 group-hover:bg-[#EE5B2B] group-hover:text-white px-2 py-0.5 rounded-full transition-colors">
                🔍 Tap to Zoom
              </span>
            </div>
            <div className="relative overflow-hidden rounded-lg border border-[var(--line)] shadow-sm bg-white">
              <img src="/images/payments/mari.jpg" alt="MariBank QR Code" className="w-full max-w-[200px] mx-auto group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                <span>🔍 View Large QR</span>
              </div>
            </div>
            <p className="text-xs text-[var(--sea-ink-soft)] mt-2 italic">Transfer fees may apply</p>
          </div>

          {/* Landbank */}
          <div
            onClick={() => onZoomImage({
              src: '/images/payments/land.jpg',
              title: 'Landbank Payment QR Code',
              subtitle: `Scan with Landbank app • Total Amount: ₱${totalAmount.toFixed(2)}`,
              type: 'qr',
              activeBank: 'land'
            })}
            className="p-4 rounded-xl border border-[var(--line)] bg-white/95 text-center cursor-pointer hover:border-[#006A4E] hover:shadow-lg transition-all group relative"
          >
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-[#006A4E]">Landbank</h5>
              <span className="text-[11px] font-bold text-[#006A4E] bg-emerald-50 group-hover:bg-[#006A4E] group-hover:text-white px-2 py-0.5 rounded-full transition-colors">
                🔍 Tap to Zoom
              </span>
            </div>
            <div className="relative overflow-hidden rounded-lg border border-[var(--line)] shadow-sm bg-white">
              <img src="/images/payments/land.jpg" alt="Landbank QR Code" className="w-full max-w-[200px] mx-auto group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                <span>🔍 View Large QR</span>
              </div>
            </div>
            <p className="text-xs text-[var(--sea-ink-soft)] mt-2 italic">Transfer fees may apply</p>
          </div>
        </div>
      </div>

      {/* Proof of Payment Upload Dropzone */}
      <div
        className={`p-6 rounded-2xl border-2 transition-all mb-8 ${
          errors.receipt
            ? 'border-red-400 bg-red-50/20'
            : receiptFile
            ? 'border-emerald-500/60 bg-emerald-50/10'
            : 'border-dashed border-[var(--lagoon)] bg-white/60'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-bold text-[var(--sea-ink)]">
            Proof of Payment <span className="text-red-500">*</span>
          </label>
          {receiptFile && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in">
              ✓ Screenshot Attached
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--sea-ink-soft)] mb-4">
          Please attach a clear screenshot of your completed GCash, Maya, or bank transfer receipt.
        </p>

        <div className="relative border border-[var(--line)] rounded-xl p-5 text-center bg-white hover:bg-white/90 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleReceiptChange(e.target.files[0])
              }
            }}
          />
          {receiptPreview ? (
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <img
                src={receiptPreview}
                alt="Receipt preview"
                className="w-20 h-20 object-cover rounded-lg border border-[var(--line)] shadow-sm"
              />
              <div className="text-left">
                <p className="font-bold text-sm text-[var(--sea-ink)] truncate max-w-[220px]">
                  {receiptFile?.name}
                </p>
                <p className="text-xs text-[var(--sea-ink-soft)]">
                  {(receiptFile ? receiptFile.size / 1024 : 0).toFixed(1)} KB • Tap to replace
                </p>
                <span className="inline-block mt-1 text-xs text-[var(--lagoon-deep)] font-semibold underline">
                  Change screenshot
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-3xl mb-1 text-[var(--lagoon-deep)]">📷</div>
              <p className="font-bold text-sm text-[var(--sea-ink)]">
                Click or drag payment screenshot here
              </p>
              <p className="text-xs text-[var(--sea-ink-soft)] mt-0.5">
                Supports JPG, PNG, WEBP (Max 10MB)
              </p>
            </div>
          )}
        </div>
        {errors.receipt && (
          <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
            <span>⚠️</span> {errors.receipt}
          </p>
        )}
      </div>

      {/* Order Summary Recap */}
      <div className="bg-white/60 rounded-2xl p-6 border border-[var(--line)] mb-8 text-sm space-y-2">
        <h4 className="font-bold text-[var(--sea-ink)] uppercase tracking-widest text-xs opacity-70 mb-3">
          Order Summary
        </h4>
        <div className="flex justify-between"><span className="text-[var(--sea-ink-soft)]">Recipient</span><span className="font-semibold text-[var(--sea-ink)]">{name} {pronouns && `(${pronouns})`}</span></div>
        <div className="flex justify-between"><span className="text-[var(--sea-ink-soft)]">Email</span><span className="font-semibold text-[var(--sea-ink)]">{email}</span></div>
        <div className="flex justify-between"><span className="text-[var(--sea-ink-soft)]">Social / Account</span><span className="font-semibold text-[var(--sea-ink)]">{socialLink}</span></div>
        <div className="flex justify-between"><span className="text-[var(--sea-ink-soft)]">Package</span><span className="font-semibold text-[var(--sea-ink)]">{packageType === 'standard' ? 'Standard Edition (₱650)' : 'Personalized Edition (₱699)'}</span></div>
        <div className="flex justify-between"><span className="text-[var(--sea-ink-soft)]">Shipping</span><span className="font-semibold text-[var(--sea-ink)]">{shippingFee === 0 ? 'Buyer pays courier' : `₱${shippingFee}`}</span></div>
        <div className="flex justify-between pt-2 border-t border-[var(--line)]"><span className="font-bold text-[var(--sea-ink)]">Total Due</span><span className="font-bold text-lg text-[var(--lagoon-deep)]">₱{totalAmount.toFixed(2)}</span></div>
      </div>

      {/* Confirmation Checkbox */}
      <label
        className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer mb-8 transition-colors ${
          errors.confirmed
            ? 'border-2 border-red-400 bg-red-50/30'
            : confirmed
            ? 'border-2 border-emerald-500/60 bg-emerald-50/10'
            : 'border-[var(--line)] bg-white/50 hover:bg-white/70'
        }`}
      >
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => {
            setConfirmed(e.target.checked)
            if (errors.confirmed) setErrors(prev => ({ ...prev, confirmed: '' }))
          }}
          className="mt-1 w-5 h-5 accent-[var(--lagoon-deep)] shrink-0"
        />
        <span className="text-sm text-[var(--sea-ink)] leading-snug">
          I confirm that I have sent my full payment of <strong>₱{totalAmount.toFixed(2)}</strong> and have read and understood all notes and reminders. <span className="text-red-500">*</span>
        </span>
      </label>
      {errors.confirmed && (
        <p className="text-xs text-red-500 font-medium -mt-6 mb-6 flex items-center gap-1">
          <span>⚠️</span> {errors.confirmed}
        </p>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-4 rounded-full border border-[var(--line)] text-[var(--sea-ink-soft)] font-bold hover:bg-white/50 transition-all disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 py-4 rounded-full bg-[var(--sea-ink)] text-[var(--bg-base)] font-bold text-lg hover:-translate-y-1 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 shadow-md"
        >
          {isSubmitting ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Submitting Pre-Order...
            </>
          ) : (
            "I've Sent My Payment — Submit Order"
          )}
        </button>
      </div>
    </div>
  )
}
