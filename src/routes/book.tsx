import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { submitOrder } from '../lib/orders'

export const Route = createFileRoute('/book')({
  component: BookComponent,
  head: () => ({
    meta: [
      { title: 'The Art of Living at Your Own Pace | Roselyn Mariano' },
      { name: 'description', content: 'A heartfelt collection of reflective essays, original illustrations, and guided journal prompts.' }
    ]
  })
})

function BookComponent() {
  const [step, setStep] = useState(1)
  
  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [shippingMethod, setShippingMethod] = useState('jt_manila')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const submitOrderFn = useServerFn(submitOrder)

  // Pricing Logic (Hardcoded for now)
  const basePrice = 850
  const shippingRates: Record<string, number> = {
    'jt_manila': 85,
    'jt_luzon': 85,
    'jt_visayas': 100,
    'jt_mindanao': 105,
    'lalamove': 0
  }
  const shippingFee = shippingRates[shippingMethod]
  const totalAmount = basePrice + shippingFee

  const handleNext = () => {
    // Simple validation
    if (step === 2 && (!name || !email || !phone || !address)) {
      setErrorMsg("Please fill in all shipping details.")
      return
    }
    setErrorMsg('')
    setStep((s) => Math.min(s + 1, 4))
  }

  const handleBack = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    if (!receiptFile) {
      setErrorMsg("Please upload your payment receipt screenshot.")
      return
    }
    setErrorMsg('')
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('phone', phone)
    formData.append('address', address)
    formData.append('shipping_method', shippingMethod)
    formData.append('total_amount', totalAmount.toString())
    formData.append('receipt', receiptFile)

    try {
      const result = await submitOrderFn(formData)
      if (result.success) {
        setStep(4) // Success!
      } else {
        setErrorMsg(result.error || "Something went wrong.")
      }
    } catch (e: any) {
      setErrorMsg(e.message || "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-wrap px-4 py-16 lg:py-24">
      {/* HEADER */}
      <div className="mb-16 text-center">
        <h1 className="display-title text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--sea-ink)] drop-shadow-sm">
          The Art of Living at Your Own Pace
        </h1>
        <div className="mx-auto mt-8 h-[2px] w-16 bg-[var(--lagoon)] rounded-full"></div>
      </div>

      <section className="mx-auto max-w-6xl flex flex-col lg:flex-row gap-12 lg:gap-20 items-start mb-24">
        
        {/* LEFT: BOOK COVER */}
        <div className="w-full lg:w-5/12 shrink-0">
          <div className="relative group mx-auto max-w-[320px] md:max-w-md lg:max-w-none">
            <div className="absolute inset-0 bg-black/10 blur-xl translate-y-6 translate-x-4 rounded-xl -z-10 transition-transform duration-500 group-hover:translate-y-8 group-hover:translate-x-6"></div>
            <div className="relative rounded-r-3xl rounded-l-md overflow-hidden border border-[var(--line)] border-l-8 border-l-black/10 shadow-[inset_4px_0_10px_rgba(255,255,255,0.2)] bg-[var(--surface-strong)] aspect-[2/3] flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-2 group-hover:-rotate-1">
              <div className="text-center p-6 text-[var(--sea-ink-soft)] absolute z-0 flex flex-col items-center justify-center h-full w-full">
                <span className="font-serif text-2xl font-bold opacity-40 mb-2">The Art of Living</span>
                <span className="text-sm opacity-40">Cover Image Placeholder</span>
              </div>
              <img 
                src="/book-cover.png" 
                alt="The Art of Living at Your Own Pace Cover" 
                className="relative z-10 w-full h-full object-cover object-center"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          </div>
          
          <div className="mt-12 font-serif text-lg leading-relaxed text-[var(--sea-ink-soft)] space-y-6 hidden lg:block">
            <p>
              The world teaches us to measure life by the destinations we reach, but the heart quietly reminds us that the truest parts of living are found in the journey between them.
            </p>
            <p>
              <strong className="font-bold text-[var(--sea-ink)]">The Art of Living at Your Own Pace</strong> is a heartfelt collection of reflective essays, original illustrations, and guided journal prompts that invites you to slow down and embrace life as it unfolds.
            </p>
          </div>
        </div>

        {/* RIGHT: CHECKOUT WIZARD */}
        <div className="w-full lg:w-7/12">
          
          {/* Progress Indicator */}
          {step < 4 && (
            <div className="flex justify-center mb-10 space-x-2">
              {[1, 2, 3].map((num) => (
                <div 
                  key={num} 
                  className={`h-2 rounded-full transition-all duration-300 ${step >= num ? 'bg-[var(--lagoon)] w-12' : 'bg-[var(--line)] w-4'}`}
                />
              ))}
            </div>
          )}

          <div className="island-shell rounded-[2rem] p-8 sm:p-12 border border-[var(--rose-blush)] relative overflow-hidden">
            {/* Soft background glows */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-[var(--lagoon)] opacity-10 blur-3xl pointer-events-none"></div>
            
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm font-semibold border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* STEP 1: ORDER SUMMARY */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="display-title text-3xl text-[var(--sea-ink)] mb-2">Order Summary</h3>
                <p className="text-[var(--sea-ink-soft)] mb-8">Confirm your order details before proceeding to shipping.</p>
                
                <div className="bg-white/50 rounded-2xl p-6 border border-[var(--line)] mb-8">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-[var(--line)]">
                    <div>
                      <h4 className="font-bold text-lg text-[var(--sea-ink)]">The Art of Living at Your Own Pace</h4>
                      <p className="text-sm text-[var(--sea-ink-soft)]">Paperback Edition (x1)</p>
                    </div>
                    <span className="font-bold text-lg text-[var(--sea-ink)]">₱{basePrice}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-xl text-[var(--lagoon-deep)]">
                    <span>Subtotal</span>
                    <span>₱{basePrice}</span>
                  </div>
                </div>

                <button 
                  onClick={handleNext}
                  className="w-full py-4 rounded-full bg-[var(--sea-ink)] text-[var(--bg-base)] font-bold text-lg hover:-translate-y-1 hover:shadow-lg transition-all"
                >
                  Proceed to Shipping
                </button>
              </div>
            )}

            {/* STEP 2: SHIPPING & ADDRESS */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="display-title text-3xl text-[var(--sea-ink)] mb-2">Shipping Details</h3>
                <p className="text-[var(--sea-ink-soft)] mb-8">Where should we send your copy?</p>
                
                <div className="space-y-5 mb-10">
                  <div>
                    <label className="block text-sm font-bold text-[var(--sea-ink)] mb-1">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/60 border border-[var(--line)] focus:outline-none focus:border-[var(--lagoon-deep)]" placeholder="Roselyn Mariano" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-[var(--sea-ink)] mb-1">Email Address</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/60 border border-[var(--line)] focus:outline-none focus:border-[var(--lagoon-deep)]" placeholder="hello@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[var(--sea-ink)] mb-1">Phone Number</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/60 border border-[var(--line)] focus:outline-none focus:border-[var(--lagoon-deep)]" placeholder="0912 345 6789" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--sea-ink)] mb-1">Complete Delivery Address</label>
                    <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-white/60 border border-[var(--line)] focus:outline-none focus:border-[var(--lagoon-deep)] resize-none" placeholder="House/Unit No., Street, Barangay, City, Province, Zip Code" />
                  </div>
                </div>

                <h4 className="font-bold text-[var(--sea-ink)] mb-4 uppercase tracking-widest text-sm">Shipping Preference</h4>
                <div className="space-y-3 mb-10">
                  {[
                    { id: 'jt_manila', label: 'J&T Express (Metro Manila)', desc: '1-2 Days Transit', price: 85 },
                    { id: 'jt_luzon', label: 'J&T Express (Luzon Provincial)', desc: '1-2 Days Transit', price: 85 },
                    { id: 'jt_visayas', label: 'J&T Express (Visayas)', desc: '3-4 Days Transit', price: 100 },
                    { id: 'jt_mindanao', label: 'J&T Express (Mindanao)', desc: '3-4 Days Transit', price: 105 },
                    { id: 'lalamove', label: 'Lalamove / Grab (Same-Day)', desc: 'Buyer books and pays courier directly upon pickup', price: 0 }
                  ].map((option) => (
                    <label key={option.id} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${shippingMethod === option.id ? 'border-[var(--lagoon-deep)] bg-white shadow-sm' : 'border-[var(--line)] bg-white/40 hover:bg-white/60'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === option.id ? 'border-[var(--lagoon-deep)]' : 'border-gray-300'}`}>
                          {shippingMethod === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[var(--lagoon-deep)]" />}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--sea-ink)]">{option.label}</p>
                          <p className="text-xs text-[var(--sea-ink-soft)]">{option.desc}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[var(--sea-ink)]">₱{option.price}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button onClick={handleBack} className="px-6 py-4 rounded-full border border-[var(--line)] text-[var(--sea-ink-soft)] font-bold hover:bg-white/50 transition-all">Back</button>
                  <button onClick={handleNext} className="flex-1 py-4 rounded-full bg-[var(--sea-ink)] text-[var(--bg-base)] font-bold text-lg hover:-translate-y-1 hover:shadow-lg transition-all">Continue to Payment</button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT & VERIFICATION */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="display-title text-3xl text-[var(--sea-ink)] mb-2">Final Step: Payment</h3>
                <p className="text-[var(--sea-ink-soft)] mb-8">Please transfer the total amount to any of the accounts below.</p>
                
                <div className="bg-white/50 rounded-2xl p-6 border border-[var(--line)] mb-8 flex justify-between items-center">
                  <span className="font-bold text-[var(--sea-ink)]">Total Amount Due</span>
                  <span className="font-bold text-3xl text-[var(--lagoon-deep)]">₱{totalAmount.toFixed(2)}</span>
                </div>

                <div className="space-y-6 mb-10">
                  {/* Bank Details */}
                  <div className="p-5 rounded-2xl border border-[var(--line)] bg-white/60">
                    <h4 className="font-bold text-[var(--sea-ink)] mb-4 uppercase tracking-widest text-xs opacity-70">Accepted Payment Channels</h4>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-[var(--line)] pb-3">
                        <span className="font-bold text-[#0052CC]">GCash</span>
                        <div className="text-right">
                          <p className="font-bold text-[var(--sea-ink)]">0912 345 6789</p>
                          <p className="text-xs text-[var(--sea-ink-soft)]">Roselyn M.</p>
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[var(--line)] pb-3">
                        <span className="font-bold text-[#39B54A]">Maya</span>
                        <div className="text-right">
                          <p className="font-bold text-[var(--sea-ink)]">0912 345 6789</p>
                          <p className="text-xs text-[var(--sea-ink-soft)]">Roselyn M.</p>
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[var(--line)] pb-3">
                        <span className="font-bold text-[#EE5B2B]">Maribank</span>
                        <div className="text-right">
                          <p className="font-bold text-[var(--sea-ink)]">1234 5678 9012</p>
                          <p className="text-xs text-[var(--sea-ink-soft)]">Roselyn M.</p>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-[#006A4E]">Landbank</span>
                        <div className="text-right">
                          <p className="font-bold text-[var(--sea-ink)]">9876 5432 1098</p>
                          <p className="text-xs text-[var(--sea-ink-soft)]">Roselyn M.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div>
                    <label className="block text-sm font-bold text-[var(--sea-ink)] mb-2">Upload Proof of Payment</label>
                    <div className="border-2 border-dashed border-[var(--lagoon)] rounded-2xl p-8 text-center bg-white/40 hover:bg-white/60 transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setReceiptFile(e.target.files[0])
                          }
                        }}
                      />
                      <div className="text-[var(--lagoon-deep)] mb-2 text-2xl">↑</div>
                      <p className="font-bold text-[var(--sea-ink)] mb-1">
                        {receiptFile ? receiptFile.name : 'Click or drag to upload receipt'}
                      </p>
                      <p className="text-xs text-[var(--sea-ink-soft)]">JPG or PNG (max 5MB)</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={handleBack} disabled={isSubmitting} className="px-6 py-4 rounded-full border border-[var(--line)] text-[var(--sea-ink-soft)] font-bold hover:bg-white/50 transition-all disabled:opacity-50">Back</button>
                  <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-4 rounded-full bg-[var(--sea-ink)] text-[var(--bg-base)] font-bold text-lg hover:-translate-y-1 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Processing...
                      </>
                    ) : 'Finalize Order'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <div className="text-center animate-in zoom-in-95 duration-700 py-10">
                <div className="w-20 h-20 rounded-full bg-[var(--lagoon)] text-white flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-[var(--lagoon)]/20">
                  ✓
                </div>
                <h3 className="display-title text-4xl text-[var(--sea-ink)] mb-4">Thank you for your order!</h3>
                <p className="text-lg text-[var(--sea-ink-soft)] mb-8 max-w-sm mx-auto">
                  Your order has been received and your payment screenshot was uploaded successfully. I will send you an email once your book is shipped!
                </p>
                <button onClick={() => window.location.href = '/'} className="px-8 py-3 rounded-full border-2 border-[var(--sea-ink)] text-[var(--sea-ink)] font-bold hover:bg-[var(--sea-ink)] hover:text-[var(--bg-base)] transition-colors">
                  Return Home
                </button>
              </div>
            )}
            
          </div>
        </div>
      </section>
    </main>
  )
}
