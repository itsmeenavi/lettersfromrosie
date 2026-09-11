import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { submitOrder } from '../lib/orders'

export const Route = createFileRoute('/book')({
  component: BookComponent,
  head: () => ({
    meta: [
      { title: 'Book Pre-Order — The Art of Living at Your Own Pace | Letters from Rosie' },
      { name: 'description', content: 'Pre-order your signed copy of The Art of Living at Your Own Pace by Letters from Rosie. Choose between Standard and Personalized editions.' }
    ]
  })
})

type PackageType = 'standard' | 'personalized'

function BookComponent() {
  const [step, setStep] = useState(1)

  // Cover View State: 'front' | 'back' | 'spread'
  const [coverView, setCoverView] = useState<'front' | 'back' | 'spread'>('front')

  // Lightbox Zoom Modal State
  const [zoomedImage, setZoomedImage] = useState<{
    src: string
    title: string
    subtitle?: string
    type?: 'qr' | 'cover' | 'photo'
    activeBank?: 'gcash' | 'maya' | 'mari' | 'land'
  } | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomedImage(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Form State
  const [name, setName] = useState('')
  const [pronouns, setPronouns] = useState('')
  const [email, setEmail] = useState('')
  const [socialLink, setSocialLink] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [shippingMethod, setShippingMethod] = useState('jt_manila')
  const [packageType, setPackageType] = useState<PackageType>('standard')
  const [freebiePhotocard, setFreebiePhotocard] = useState('')
  const [additionalPhotocards, setAdditionalPhotocards] = useState('')
  const [postcardMessage, setPostcardMessage] = useState('')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  // Validation & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const submitOrderFn = useServerFn(submitOrder)

  // Pricing
  const packagePrices: Record<PackageType, number> = {
    standard: 650,
    personalized: 699
  }
  const basePrice = packagePrices[packageType]
  const shippingRates: Record<string, number> = {
    'jt_manila': 85,
    'jt_luzon': 85,
    'jt_visayas': 100,
    'jt_mindanao': 105,
    'lalamove': 0
  }
  const shippingFee = shippingRates[shippingMethod]
  const totalAmount = basePrice + shippingFee

  // Handle receipt selection and create preview
  const handleReceiptChange = (file: File | null) => {
    setReceiptFile(file)
    if (errors.receipt) {
      setErrors((prev) => ({ ...prev, receipt: '' }))
    }
    if (file) {
      const url = URL.createObjectURL(file)
      setReceiptPreview(url)
    } else {
      setReceiptPreview(null)
    }
  }

  // Clear specific field error
  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  // Field validation helpers
  const validateStep2 = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) {
      errs.name = 'Full name is required.'
    } else if (name.trim().length < 2) {
      errs.name = 'Please enter a valid full name.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      errs.email = 'Email address is required.'
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address (e.g. name@gmail.com).'
    }

    if (!socialLink.trim()) {
      errs.socialLink = 'Social media username is required so Rosie can contact you.'
    }

    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      setErrorMsg('Please correct the highlighted fields before proceeding.')
      return false
    }
    setErrorMsg('')
    return true
  }

  const validateStep3 = () => {
    const errs: Record<string, string> = {}
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    const phoneRegex = /^\+?\d{10,14}$/

    if (!phone.trim()) {
      errs.phone = 'Contact number is required for courier delivery.'
    } else if (!phoneRegex.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10 to 12-digit mobile number (e.g. 09171234567).'
    }

    if (!address.trim()) {
      errs.address = 'Delivery address is required.'
    } else if (address.trim().length < 10) {
      errs.address = 'Please provide house/unit no., street, barangay, city, and province.'
    }

    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      setErrorMsg('Please correct the highlighted fields before proceeding.')
      return false
    }
    setErrorMsg('')
    return true
  }

  const validateStep4 = () => {
    const errs: Record<string, string> = {}
    if (packageType === 'personalized') {
      if (!freebiePhotocard.trim()) {
        errs.freebiePhotocard = 'Please specify your chosen freebie photocard (e.g. Photocard 1A).'
      }
      if (!postcardMessage.trim()) {
        errs.postcardMessage = 'Please provide a question, topic, or message for the author.'
      } else if (postcardMessage.trim().length < 4) {
        errs.postcardMessage = 'Please enter at least a few words for your personalized message.'
      }
    }

    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      setErrorMsg('Please fill in the required personalized edition details.')
      return false
    }
    setErrorMsg('')
    return true
  }

  const validateStep5 = () => {
    const errs: Record<string, string> = {}
    if (!receiptFile) {
      errs.receipt = 'Proof of payment is required. Please upload your payment screenshot or receipt.'
    } else if (receiptFile.size > 10 * 1024 * 1024) {
      errs.receipt = 'File size is too large (max 10MB). Please select a smaller screenshot.'
    }

    if (!confirmed) {
      errs.confirmed = 'Please check the confirmation box to confirm that your payment was sent.'
    }

    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      setErrorMsg(errs.receipt || errs.confirmed || 'Please provide proof of payment and check the confirmation box.')
      return false
    }
    setErrorMsg('')
    return true
  }

  const handleNext = () => {
    if (step === 1) {
      // Reminders step — proceed
    } else if (step === 2) {
      if (!validateStep2()) return
    } else if (step === 3) {
      if (!validateStep3()) return
    } else if (step === 4) {
      if (!validateStep4()) return
    }
    setErrorMsg('')
    setErrors({})
    setStep((s) => Math.min(s + 1, 6))
  }

  const handleBack = () => {
    setErrorMsg('')
    setErrors({})
    setStep((s) => Math.max(s - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep5()) {
      return
    }

    setErrorMsg('')
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('pronouns', pronouns)
    formData.append('email', email)
    formData.append('social_link', socialLink)
    formData.append('phone', phone)
    formData.append('address', address)
    formData.append('shipping_method', shippingMethod)
    formData.append('package_type', packageType)
    formData.append('freebie_photocard', freebiePhotocard)
    formData.append('additional_photocards', additionalPhotocards)
    formData.append('postcard_message', postcardMessage)
    formData.append('total_amount', totalAmount.toString())
    formData.append('receipt', receiptFile!)

    try {
      const result = await submitOrderFn(formData)
      if (result.success) {
        setStep(6) // Success!
      } else {
        setErrorMsg(result.error || 'Something went wrong while submitting your order.')
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'An unexpected error occurred.')
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
        <p className="mt-4 text-lg text-[var(--sea-ink-soft)]">by Letters from Rosie (Roselyn Mariano)</p>
        <div className="mx-auto mt-6 h-[2px] w-16 bg-[var(--lagoon)] rounded-full"></div>
      </div>

      <section className="mx-auto max-w-6xl flex flex-col lg:flex-row gap-12 lg:gap-20 items-start mb-24">

        {/* LEFT: BOOK COVER & DESCRIPTION */}
        <div className="w-full lg:w-5/12 shrink-0">
          <div className="mx-auto max-w-[340px] md:max-w-md lg:max-w-none">
            {/* View switcher tabs */}
            <div className="flex items-center justify-center p-1 bg-white/70 backdrop-blur-md rounded-full border border-[var(--line)] max-w-[310px] mx-auto mb-4 shadow-xs">
              <button
                type="button"
                onClick={() => setCoverView('front')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all ${
                  coverView === 'front'
                    ? 'bg-[var(--sea-ink)] text-[var(--bg-base)] shadow-sm'
                    : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'
                }`}
              >
                Front Cover
              </button>
              <button
                type="button"
                onClick={() => setCoverView('back')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all ${
                  coverView === 'back'
                    ? 'bg-[var(--sea-ink)] text-[var(--bg-base)] shadow-sm'
                    : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'
                }`}
              >
                Back Cover
              </button>
              <button
                type="button"
                onClick={() => setCoverView('spread')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all ${
                  coverView === 'spread'
                    ? 'bg-[var(--sea-ink)] text-[var(--bg-base)] shadow-sm'
                    : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'
                }`}
              >
                Full Wrap
              </button>
            </div>

            {/* Book Display Container */}
            <div
              className="relative group cursor-pointer"
              onClick={() => {
                if (coverView === 'front') {
                  setZoomedImage({
                    src: '/bookcover-front.png',
                    title: 'The Art of Living at Your Own Pace — Front Cover',
                    subtitle: 'Original artwork & illustration by Roselyn Mariano',
                    type: 'cover'
                  })
                } else if (coverView === 'back') {
                  setZoomedImage({
                    src: '/bookcover-back.png',
                    title: 'The Art of Living at Your Own Pace — Back Cover',
                    subtitle: 'Back cover blurb & reflection',
                    type: 'cover'
                  })
                } else {
                  setZoomedImage({
                    src: '/bookcover.png',
                    title: 'The Art of Living at Your Own Pace — Full Cover Wrap',
                    subtitle: 'Complete front, spine, and back cover panoramic jacket',
                    type: 'cover'
                  })
                }
              }}
            >
              <div className="absolute inset-0 bg-black/10 blur-xl translate-y-6 translate-x-4 rounded-xl -z-10 transition-transform duration-500 group-hover:translate-y-8 group-hover:translate-x-6"></div>

              {/* Front view */}
              {coverView === 'front' && (
                <div className="relative rounded-r-3xl rounded-l-md overflow-hidden border border-[var(--line)] border-l-8 border-l-black/15 shadow-[inset_6px_0_12px_rgba(0,0,0,0.15)] bg-[var(--surface-strong)] aspect-[530/840] flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1 group-hover:-rotate-1">
                  <img
                    src="/bookcover-front.png"
                    alt="The Art of Living at Your Own Pace Front Cover"
                    className="relative z-10 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20 backdrop-blur-[2px]">
                    <span className="px-4 py-2 rounded-full bg-white/90 text-[var(--sea-ink)] text-xs font-bold shadow-lg flex items-center gap-1.5">
                      🔍 Click to view full size
                    </span>
                  </div>
                </div>
              )}

              {/* Back view */}
              {coverView === 'back' && (
                <div className="relative rounded-l-3xl rounded-r-md overflow-hidden border border-[var(--line)] border-r-8 border-r-black/15 shadow-[inset_-6px_0_12px_rgba(0,0,0,0.15)] bg-[var(--surface-strong)] aspect-[530/840] flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-1">
                  <img
                    src="/bookcover-back.png"
                    alt="The Art of Living at Your Own Pace Back Cover"
                    className="relative z-10 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20 backdrop-blur-[2px]">
                    <span className="px-4 py-2 rounded-full bg-white/90 text-[var(--sea-ink)] text-xs font-bold shadow-lg flex items-center gap-1.5">
                      🔍 Click to view full size
                    </span>
                  </div>
                </div>
              )}

              {/* Full spread view */}
              {coverView === 'spread' && (
                <div className="relative rounded-2xl overflow-hidden border border-[var(--line)] shadow-xl bg-[var(--surface-strong)] aspect-[1144/840] flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1">
                  <img
                    src="/bookcover.png"
                    alt="The Art of Living at Your Own Pace Full Wrap Cover"
                    className="relative z-10 w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20 backdrop-blur-[2px]">
                    <span className="px-4 py-2 rounded-full bg-white/90 text-[var(--sea-ink)] text-xs font-bold shadow-lg flex items-center gap-1.5">
                      🔍 Click to view full size
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Miniature Thumbnails */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <button
                type="button"
                onClick={() => setCoverView('front')}
                className={`relative rounded-xl overflow-hidden border-2 transition-all p-1 bg-white/50 text-left ${
                  coverView === 'front' ? 'border-[var(--lagoon-deep)] ring-2 ring-[var(--lagoon)]/20' : 'border-transparent hover:border-[var(--line)]'
                }`}
              >
                <div className="aspect-[530/840] rounded-lg overflow-hidden bg-gray-100">
                  <img src="/bookcover-front.png" alt="Front preview" className="w-full h-full object-cover" />
                </div>
                <p className="text-[11px] font-bold text-center mt-1 text-[var(--sea-ink)]">Front</p>
              </button>

              <button
                type="button"
                onClick={() => setCoverView('back')}
                className={`relative rounded-xl overflow-hidden border-2 transition-all p-1 bg-white/50 text-left ${
                  coverView === 'back' ? 'border-[var(--lagoon-deep)] ring-2 ring-[var(--lagoon)]/20' : 'border-transparent hover:border-[var(--line)]'
                }`}
              >
                <div className="aspect-[530/840] rounded-lg overflow-hidden bg-gray-100">
                  <img src="/bookcover-back.png" alt="Back preview" className="w-full h-full object-cover" />
                </div>
                <p className="text-[11px] font-bold text-center mt-1 text-[var(--sea-ink)]">Back</p>
              </button>

              <button
                type="button"
                onClick={() => setCoverView('spread')}
                className={`relative rounded-xl overflow-hidden border-2 transition-all p-1 bg-white/50 text-left flex flex-col justify-between ${
                  coverView === 'spread' ? 'border-[var(--lagoon-deep)] ring-2 ring-[var(--lagoon)]/20' : 'border-transparent hover:border-[var(--line)]'
                }`}
              >
                <div className="aspect-[530/840] rounded-lg overflow-hidden bg-gray-100 flex items-center">
                  <img src="/bookcover.png" alt="Full wrap preview" className="w-full h-auto object-cover" />
                </div>
                <p className="text-[11px] font-bold text-center mt-1 text-[var(--sea-ink)]">Full Wrap</p>
              </button>
            </div>

            <p className="text-center text-xs text-[var(--sea-ink-soft)] mt-3">
              ✦ Tap any view to preview front, back, or full panoramic jacket
            </p>
          </div>

          {/* Book Description & Details (From Amazon) */}
          <div className="mt-8 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white/60 border border-[var(--line)] shadow-xs">
              <h3 className="font-serif text-xl font-bold text-[var(--sea-ink)] mb-4 flex items-center gap-2">
                <span>About the Book</span>
              </h3>
              <div className="font-serif text-[15px] leading-relaxed text-[var(--sea-ink-soft)] space-y-4">
                <p>
                  The world teaches us to measure life by the destinations we reach, but the heart quietly reminds us that the truest parts of living are found in the journey between them.
                </p>
                <p>
                  <strong className="font-bold text-[var(--sea-ink)]">The Art of Living at Your Own Pace</strong> is a heartfelt collection of reflective essays, original illustrations, and guided journal prompts that invites you to slow down and embrace life as it unfolds. Featuring beloved writings from Letters from Rosie, along with new reflections written especially for this book, these pages explore healing, self-love, purpose, grief, hope, gratitude, and the quiet beauty of living at your own pace.
                </p>
                <p>
                  Each chapter is paired with thoughtful prompts and journaling space, encouraging you to reflect on your own journey. Whether you're navigating change, waiting for what's next, or simply searching for a little peace, this book is here to remind you that you are not behind. Because life isn't a race to the finish; it's a journey to be lived, one gentle step at a time.
                </p>
              </div>
            </div>

            {/* Book Specifications Card */}
            <div className="p-6 rounded-3xl bg-white/60 border border-[var(--line)] shadow-xs">
              <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--sea-ink)] opacity-70 mb-4">
                Book Specifications
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/70 border border-[var(--line)]">
                  <span className="text-[var(--sea-ink-soft)] block mb-0.5">Print Length</span>
                  <span className="font-bold text-[var(--sea-ink)] text-sm">287 pages</span>
                </div>
                <div className="p-3 rounded-xl bg-white/70 border border-[var(--line)]">
                  <span className="text-[var(--sea-ink-soft)] block mb-0.5">Format</span>
                  <span className="font-bold text-[var(--sea-ink)] text-sm">Paperback</span>
                </div>
                <div className="p-3 rounded-xl bg-white/70 border border-[var(--line)]">
                  <span className="text-[var(--sea-ink-soft)] block mb-0.5">Dimensions</span>
                  <span className="font-bold text-[var(--sea-ink)] text-sm">5.5 × 8.5 in</span>
                </div>
                <div className="p-3 rounded-xl bg-white/70 border border-[var(--line)]">
                  <span className="text-[var(--sea-ink-soft)] block mb-0.5">Language</span>
                  <span className="font-bold text-[var(--sea-ink)] text-sm">English</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <span className="text-[var(--sea-ink-soft)]">
                  ISBN-13: <strong className="text-[var(--sea-ink)]">979-8190816990</strong>
                </span>
                <a
                  href="https://www.amazon.com/Art-Living-Your-Own-Pace/dp/B0HDNRM49T"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[var(--lagoon-deep)] hover:underline"
                >
                  <span>View on Amazon</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: CHECKOUT WIZARD */}
        <div className="w-full lg:w-7/12">

          {/* Progress Indicator (5 Steps) */}
          {step < 6 && (
            <div className="flex items-center justify-center mb-8 gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step >= num ? 'bg-[var(--lagoon)] w-8' : 'bg-[var(--line)] w-3'
                  }`}
                />
              ))}
            </div>
          )}

          <div className="island-shell rounded-[2rem] p-8 sm:p-12 border border-[var(--rose-blush)] relative overflow-hidden">
            {/* Soft background glows */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-[var(--lagoon)] opacity-10 blur-3xl pointer-events-none"></div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm font-semibold border border-red-200 flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ─── STEP 1: IMPORTANT REMINDERS ─── */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="display-title text-2xl sm:text-3xl text-[var(--sea-ink)] mb-2">Book Pre-Order</h3>
                <p className="text-[var(--sea-ink-soft)] mb-6">A few important reminders for dear readers</p>

                <div className="bg-white/50 rounded-2xl p-6 border border-[var(--line)] mb-8 text-sm text-[var(--sea-ink)] leading-relaxed space-y-4">
                  <p className="text-[var(--sea-ink-soft)]">
                    Before placing your order, please take a moment to read these reminders carefully. This helps us process every order smoothly and accurately. Thank you so much for your understanding and cooperation!
                  </p>

                  <ul className="space-y-3 list-none">
                    <li className="flex gap-2">
                      <span className="text-[var(--lagoon)] font-bold shrink-0">•</span>
                      <span><strong>PAYMENT FIRST</strong> — Please complete your full payment before filling out the order form.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[var(--lagoon)] font-bold shrink-0">•</span>
                      <span><strong>FULL PAYMENT ONLY</strong> — We kindly ask for full payment only. Installment payments are not available for book orders.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[var(--lagoon)] font-bold shrink-0">•</span>
                      <span><strong>NO CANCELLATIONS OR REFUNDS</strong> — Once payment has been made, orders can no longer be cancelled, and payments are strictly non-refundable.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[var(--lagoon)] font-bold shrink-0">•</span>
                      <span><strong>PLEASE PROVIDE A VALID EMAIL</strong> — Make sure to enter a correct, active, and working email address. Please double-check your email especially the domain (e.g., gmail.com, yahoo.com), before submitting the form.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[var(--lagoon)] font-bold shrink-0">•</span>
                      <span><strong>DOUBLE-CHECK YOUR DETAILS</strong> — Kindly make sure that all information you provide is complete and accurate. Please review your answers before submitting your order.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[var(--lagoon)] font-bold shrink-0">•</span>
                      <span><strong>USE ONLY THE LISTED PAYMENT CHANNELS</strong> — Please send your payment only through the official payment channels provided in the order form.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[var(--lagoon)] font-bold shrink-0">•</span>
                      <span><strong>FOR BULK ORDERS</strong> — If you are placing a bulk order, please send us a message first before filling out the form so we can assist you properly.</span>
                    </li>
                  </ul>

                  <p className="text-[var(--sea-ink-soft)] italic pt-2 border-t border-[var(--line)]">
                    Thank you for taking the time to read these reminders and for supporting <em>The Art of Living at Your Own Pace</em>. Your order means so much to us. ♡
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-4 rounded-full bg-[var(--sea-ink)] text-[var(--bg-base)] font-bold text-lg hover:-translate-y-1 hover:shadow-lg transition-all"
                >
                  I Understand, Continue
                </button>
              </div>
            )}

            {/* ─── STEP 2: YOUR DETAILS ─── */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="display-title text-2xl sm:text-3xl text-[var(--sea-ink)] mb-2">Your Details</h3>
                <p className="text-[var(--sea-ink-soft)] mb-8">Let us know who's ordering this beautiful book.</p>

                <div className="space-y-5 mb-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-[var(--sea-ink)] mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          clearFieldError('name')
                        }}
                        className={`w-full px-4 py-3 rounded-xl bg-white/60 border ${
                          errors.name ? 'border-red-400 bg-red-50/20' : 'border-[var(--line)]'
                        } focus:outline-none focus:border-[var(--lagoon-deep)]`}
                        placeholder="e.g. Maria Santos"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                          <span>⚠️</span> {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[var(--sea-ink)] mb-1">Pronouns</label>
                      <input
                        type="text"
                        value={pronouns}
                        onChange={(e) => setPronouns(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/60 border border-[var(--line)] focus:outline-none focus:border-[var(--lagoon-deep)]"
                        placeholder="e.g. she/her, he/him, they/them"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[var(--sea-ink)] mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        clearFieldError('email')
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-white/60 border ${
                        errors.email ? 'border-red-400 bg-red-50/20' : 'border-[var(--line)]'
                      } focus:outline-none focus:border-[var(--lagoon-deep)]`}
                      placeholder="yourname@gmail.com"
                    />
                    {errors.email ? (
                      <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                        <span>⚠️</span> {errors.email}
                      </p>
                    ) : (
                      <p className="text-xs text-[var(--sea-ink-soft)] mt-1">
                        Please make sure your email is active so we can send your confirmation.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[var(--sea-ink)] mb-1">
                      Social Media / Account Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={socialLink}
                      onChange={(e) => {
                        setSocialLink(e.target.value)
                        clearFieldError('socialLink')
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-white/60 border ${
                        errors.socialLink ? 'border-red-400 bg-red-50/20' : 'border-[var(--line)]'
                      } focus:outline-none focus:border-[var(--lagoon-deep)]`}
                      placeholder="e.g. @lettersfromrosie_ or Instagram / FB link"
                    />
                    {errors.socialLink ? (
                      <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                        <span>⚠️</span> {errors.socialLink}
                      </p>
                    ) : (
                      <p className="text-xs text-[var(--sea-ink-soft)] mt-1">So Rosie can reach you for order confirmation.</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-4 rounded-full border border-[var(--line)] text-[var(--sea-ink-soft)] font-bold hover:bg-white/50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-4 rounded-full bg-[var(--sea-ink)] text-[var(--bg-base)] font-bold text-lg hover:-translate-y-1 hover:shadow-lg transition-all"
                  >
                    Continue to Shipping
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 3: SHIPPING & ADDRESS ─── */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="display-title text-2xl sm:text-3xl text-[var(--sea-ink)] mb-2">Shipping Details</h3>
                <p className="text-[var(--sea-ink-soft)] mb-8">Where should we deliver your copy?</p>

                <div className="space-y-5 mb-10">
                  <div>
                    <label className="block text-sm font-bold text-[var(--sea-ink)] mb-1">
                      Contact Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        clearFieldError('phone')
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-white/60 border ${
                        errors.phone ? 'border-red-400 bg-red-50/20' : 'border-[var(--line)]'
                      } focus:outline-none focus:border-[var(--lagoon-deep)]`}
                      placeholder="e.g. 0917 123 4567"
                    />
                    {errors.phone ? (
                      <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                        <span>⚠️</span> {errors.phone}
                      </p>
                    ) : (
                      <p className="text-xs text-[var(--sea-ink-soft)] mt-1">For delivery updates and courier contact.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[var(--sea-ink)] mb-1">
                      Complete Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value)
                        clearFieldError('address')
                      }}
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl bg-white/60 border ${
                        errors.address ? 'border-red-400 bg-red-50/20' : 'border-[var(--line)]'
                      } focus:outline-none focus:border-[var(--lagoon-deep)] resize-none`}
                      placeholder="House/Unit No., Street, Barangay, City/Municipality, Province, Zip Code"
                    />
                    {errors.address && (
                      <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                        <span>⚠️</span> {errors.address}
                      </p>
                    )}
                  </div>
                </div>

                <h4 className="font-bold text-[var(--sea-ink)] mb-4 uppercase tracking-widest text-sm">Shipping Preference</h4>
                <div className="space-y-3 mb-10">
                  {[
                    { id: 'jt_manila', label: 'J&T Express (Metro Manila)', desc: '1–2 Days Transit', price: 85 },
                    { id: 'jt_luzon', label: 'J&T Express (Luzon Provincial)', desc: '1–2 Days Transit', price: 85 },
                    { id: 'jt_visayas', label: 'J&T Express (Visayas)', desc: '3–4 Days Transit', price: 100 },
                    { id: 'jt_mindanao', label: 'J&T Express (Mindanao)', desc: '3–4 Days Transit', price: 105 },
                    { id: 'lalamove', label: 'Lalamove / Grab (Same-Day)', desc: 'Buyer books and pays courier directly upon pickup', price: 0 }
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        shippingMethod === option.id ? 'border-[var(--lagoon-deep)] bg-white shadow-sm' : 'border-[var(--line)] bg-white/40 hover:bg-white/60'
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
                          <p className="font-bold text-[var(--sea-ink)]">{option.label}</p>
                          <p className="text-xs text-[var(--sea-ink-soft)]">{option.desc}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[var(--sea-ink)]">{option.price === 0 ? 'Free' : `₱${option.price}`}</span>
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
                    onClick={handleBack}
                    className="px-6 py-4 rounded-full border border-[var(--line)] text-[var(--sea-ink-soft)] font-bold hover:bg-white/50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-4 rounded-full bg-[var(--sea-ink)] text-[var(--bg-base)] font-bold text-lg hover:-translate-y-1 hover:shadow-lg transition-all"
                  >
                    Continue to Package
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 4: PACKAGE SELECTION ─── */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="display-title text-2xl sm:text-3xl text-[var(--sea-ink)] mb-2">Choose Your Package</h3>
                <p className="text-[var(--sea-ink-soft)] mb-8">Select which edition you'd like to pre-order.</p>

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
                          <li className="flex gap-2"><span className="text-[var(--lagoon)]">✦</span> Signed Book</li>
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
                          <li className="flex gap-2"><span className="text-[var(--lagoon)]">✦</span> Signed Book</li>
                          <li className="flex gap-2"><span className="text-[var(--lagoon)]">✦</span> Bookmark</li>
                          <li className="flex gap-2"><span className="text-[var(--lagoon)]">✦</span> Freebie Photocard</li>
                          <li className="flex gap-2"><span className="text-[var(--lagoon)]">✦</span> Personalized Postcard from the author</li>
                        </ul>
                        <div
                          className="relative cursor-pointer group mt-4 overflow-hidden rounded-xl border border-[var(--line)] shadow-sm bg-white"
                          onClick={(e) => {
                            e.preventDefault()
                            setZoomedImage({
                              src: '/personalizededition.jpg',
                              title: 'Personalized Edition Bundle',
                              subtitle: 'Includes Signed Book, Bookmark, Freebie Photocard & Personalized Postcard',
                              type: 'photo'
                            })
                          }}
                        >
                          <img src="/personalizededition.jpg" alt="Personalized Edition Preview" className="w-full group-hover:scale-102 transition-transform duration-300" />
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
                  <div className="space-y-5 mb-8 p-6 rounded-2xl border border-dashed border-[var(--lagoon)] bg-white/30">
                    <h4 className="font-bold text-[var(--sea-ink)] uppercase tracking-widest text-xs opacity-70">Personalized Edition Details</h4>

                    {/* Photocard Reference */}
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-bold text-[var(--sea-ink)] uppercase tracking-widest opacity-70">Available Photocard Designs</p>
                        <span className="text-[11px] text-[var(--lagoon-deep)] font-medium">🔍 Click to zoom</span>
                      </div>
                      <div
                        className="relative cursor-pointer group overflow-hidden rounded-xl border border-[var(--line)] shadow-sm bg-white"
                        onClick={() => setZoomedImage({
                          src: '/photocardreference.png',
                          title: 'Available Photocard Designs',
                          subtitle: 'Select your preferred design for your freebie photocard',
                          type: 'photo'
                        })}
                      >
                        <img src="/photocardreference.png" alt="Available Photocard Designs" className="w-full group-hover:scale-102 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                          <span>🔍 Click to view high-res designs</span>
                        </div>
                      </div>
                    </div>

                    {/* Postcard Sample */}
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-bold text-[var(--sea-ink)] uppercase tracking-widest opacity-70">Postcard Sample</p>
                        <span className="text-[11px] text-[var(--lagoon-deep)] font-medium">🔍 Click to zoom</span>
                      </div>
                      <div
                        className="relative cursor-pointer group overflow-hidden rounded-xl border border-[var(--line)] shadow-sm bg-white"
                        onClick={() => setZoomedImage({
                          src: '/photocardsample.png',
                          title: 'Personalized Postcard Sample',
                          subtitle: 'Sample handwritten note from Rosie',
                          type: 'photo'
                        })}
                      >
                        <img src="/photocardsample.png" alt="Postcard Sample" className="w-full group-hover:scale-102 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                          <span>🔍 Click to view sample up close</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[var(--sea-ink)] mb-1">
                        Freebie Photocard Choice <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={freebiePhotocard}
                        onChange={(e) => {
                          setFreebiePhotocard(e.target.value)
                          clearFieldError('freebiePhotocard')
                        }}
                        className={`w-full px-4 py-3 rounded-xl bg-white/60 border ${
                          errors.freebiePhotocard ? 'border-red-400 bg-red-50/20' : 'border-[var(--line)]'
                        } focus:outline-none focus:border-[var(--lagoon-deep)]`}
                        placeholder="e.g. Photocard 1A"
                      />
                      {errors.freebiePhotocard ? (
                        <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                          <span>⚠️</span> {errors.freebiePhotocard}
                        </p>
                      ) : (
                        <p className="text-xs text-[var(--sea-ink-soft)] mt-1">
                          Type the name of your desired freebie photocard from the designs shown above.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[var(--sea-ink)] mb-1">
                        Additional Photocards (Optional)
                      </label>
                      <input
                        type="text"
                        value={additionalPhotocards}
                        onChange={(e) => setAdditionalPhotocards(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/60 border border-[var(--line)] focus:outline-none focus:border-[var(--lagoon-deep)]"
                        placeholder="e.g. Photocard 1A, Photocard 2B"
                      />
                      <p className="text-xs text-[var(--sea-ink-soft)] mt-1">
                        If you would like to purchase additional photocards aside from the freebie photocard, list them here.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[var(--sea-ink)] mb-1">
                        Personalized Postcard Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={postcardMessage}
                        onChange={(e) => {
                          setPostcardMessage(e.target.value)
                          clearFieldError('postcardMessage')
                        }}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl bg-white/60 border ${
                          errors.postcardMessage ? 'border-red-400 bg-red-50/20' : 'border-[var(--line)]'
                        } focus:outline-none focus:border-[var(--lagoon-deep)] resize-none`}
                        placeholder="Share a question, a feeling, a thought, or anything you would like the writer to respond to..."
                      />
                      {errors.postcardMessage ? (
                        <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                          <span>⚠️</span> {errors.postcardMessage}
                        </p>
                      ) : (
                        <p className="text-xs text-[var(--sea-ink-soft)] mt-1">
                          The author will write a short, personalized message for you. Please note that only general questions or topics will be accepted.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-4 rounded-full border border-[var(--line)] text-[var(--sea-ink-soft)] font-bold hover:bg-white/50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-4 rounded-full bg-[var(--sea-ink)] text-[var(--bg-base)] font-bold text-lg hover:-translate-y-1 hover:shadow-lg transition-all"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 5: PAYMENT & PROOF OF PAYMENT ─── */}
            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="display-title text-2xl sm:text-3xl text-[var(--sea-ink)] mb-2">Payment & Proof</h3>
                <p className="text-[var(--sea-ink-soft)] mb-8">Send your payment to any official channel below and upload your screenshot.</p>

                {/* Total Amount Due Card */}
                <div className="bg-white/50 rounded-2xl p-6 border border-[var(--line)] mb-8">
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

                {/* Payment Channels with QR Codes */}
                <div className="p-5 rounded-2xl border border-[var(--line)] bg-white/60 mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-6">
                    <h4 className="font-bold text-[var(--sea-ink)] uppercase tracking-widest text-xs opacity-70">
                      Official Payment Channels
                    </h4>
                    <span className="text-xs font-semibold text-[var(--lagoon-deep)] flex items-center gap-1">
                      🔍 Tap any QR code to enlarge
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* GCash */}
                    <div
                      onClick={() => setZoomedImage({
                        src: '/gcash.jpg',
                        title: 'GCash Payment QR Code',
                        subtitle: `Scan with GCash app • Total Amount: ₱${totalAmount.toFixed(2)}`,
                        type: 'qr',
                        activeBank: 'gcash'
                      })}
                      className="p-4 rounded-xl border border-[var(--line)] bg-white/90 text-center cursor-pointer hover:border-[#0052CC] hover:shadow-lg transition-all group relative"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-[#0052CC]">GCash</h5>
                        <span className="text-[11px] font-bold text-[#0052CC] bg-blue-50 group-hover:bg-[#0052CC] group-hover:text-white px-2 py-0.5 rounded-full transition-colors">
                          🔍 Tap to Zoom
                        </span>
                      </div>
                      <div className="relative overflow-hidden rounded-lg border border-[var(--line)] shadow-sm bg-white">
                        <img src="/gcash.jpg" alt="GCash QR Code" className="w-full max-w-[200px] mx-auto group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                          <span>🔍 View Large QR</span>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--sea-ink-soft)] mt-2 italic">Transfer fees may apply</p>
                    </div>

                    {/* Maya */}
                    <div
                      onClick={() => setZoomedImage({
                        src: '/maya.jpg',
                        title: 'Maya Payment QR Code',
                        subtitle: `Scan with Maya app • Total Amount: ₱${totalAmount.toFixed(2)}`,
                        type: 'qr',
                        activeBank: 'maya'
                      })}
                      className="p-4 rounded-xl border border-[var(--line)] bg-white/90 text-center cursor-pointer hover:border-[#39B54A] hover:shadow-lg transition-all group relative"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-[#39B54A]">Maya</h5>
                        <span className="text-[11px] font-bold text-[#39B54A] bg-green-50 group-hover:bg-[#39B54A] group-hover:text-white px-2 py-0.5 rounded-full transition-colors">
                          🔍 Tap to Zoom
                        </span>
                      </div>
                      <div className="relative overflow-hidden rounded-lg border border-[var(--line)] shadow-sm bg-white">
                        <img src="/maya.jpg" alt="Maya QR Code" className="w-full max-w-[200px] mx-auto group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                          <span>🔍 View Large QR</span>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--sea-ink-soft)] mt-2 italic">Transfer fees may apply</p>
                    </div>

                    {/* MariBank */}
                    <div
                      onClick={() => setZoomedImage({
                        src: '/mari.jpg',
                        title: 'MariBank Payment QR Code',
                        subtitle: `Scan with MariBank app • Total Amount: ₱${totalAmount.toFixed(2)}`,
                        type: 'qr',
                        activeBank: 'mari'
                      })}
                      className="p-4 rounded-xl border border-[var(--line)] bg-white/90 text-center cursor-pointer hover:border-[#EE5B2B] hover:shadow-lg transition-all group relative"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-[#EE5B2B]">MariBank</h5>
                        <span className="text-[11px] font-bold text-[#EE5B2B] bg-orange-50 group-hover:bg-[#EE5B2B] group-hover:text-white px-2 py-0.5 rounded-full transition-colors">
                          🔍 Tap to Zoom
                        </span>
                      </div>
                      <div className="relative overflow-hidden rounded-lg border border-[var(--line)] shadow-sm bg-white">
                        <img src="/mari.jpg" alt="MariBank QR Code" className="w-full max-w-[200px] mx-auto group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                          <span>🔍 View Large QR</span>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--sea-ink-soft)] mt-2 italic">Transfer fees may apply</p>
                    </div>

                    {/* Landbank */}
                    <div
                      onClick={() => setZoomedImage({
                        src: '/land.jpg',
                        title: 'Landbank Payment QR Code',
                        subtitle: `Scan with Landbank app • Total Amount: ₱${totalAmount.toFixed(2)}`,
                        type: 'qr',
                        activeBank: 'land'
                      })}
                      className="p-4 rounded-xl border border-[var(--line)] bg-white/90 text-center cursor-pointer hover:border-[#006A4E] hover:shadow-lg transition-all group relative"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-[#006A4E]">Landbank</h5>
                        <span className="text-[11px] font-bold text-[#006A4E] bg-emerald-50 group-hover:bg-[#006A4E] group-hover:text-white px-2 py-0.5 rounded-full transition-colors">
                          🔍 Tap to Zoom
                        </span>
                      </div>
                      <div className="relative overflow-hidden rounded-lg border border-[var(--line)] shadow-sm bg-white">
                        <img src="/land.jpg" alt="Landbank QR Code" className="w-full max-w-[200px] mx-auto group-hover:scale-105 transition-transform duration-300" />
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
                    errors.receipt ? 'border-red-400 bg-red-50/20' : 'border-dashed border-[var(--lagoon)] bg-white/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-[var(--sea-ink)]">
                      Proof of Payment <span className="text-red-500">*</span>
                    </label>
                    {receiptFile && (
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        ✓ Screenshot Attached
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--sea-ink-soft)] mb-4">
                    Attach a clear screenshot or photo of your payment transaction/transfer receipt.
                  </p>

                  <div className="relative border border-[var(--line)] rounded-xl p-5 text-center bg-white/80 hover:bg-white transition-colors cursor-pointer">
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
                            {(receiptFile ? receiptFile.size / 1024 : 0).toFixed(1)} KB • Tap or drag to replace
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

                {/* Order Summary */}
                <div className="bg-white/50 rounded-2xl p-6 border border-[var(--line)] mb-8 text-sm space-y-2">
                  <h4 className="font-bold text-[var(--sea-ink)] uppercase tracking-widest text-xs opacity-70 mb-3">Order Summary</h4>
                  <div className="flex justify-between"><span className="text-[var(--sea-ink-soft)]">Name</span><span className="font-semibold text-[var(--sea-ink)]">{name} {pronouns && `(${pronouns})`}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--sea-ink-soft)]">Email</span><span className="font-semibold text-[var(--sea-ink)]">{email}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--sea-ink-soft)]">Social / Account</span><span className="font-semibold text-[var(--sea-ink)]">{socialLink}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--sea-ink-soft)]">Package</span><span className="font-semibold text-[var(--sea-ink)]">{packageType === 'standard' ? 'Standard (₱650)' : 'Personalized (₱699)'}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--sea-ink-soft)]">Shipping</span><span className="font-semibold text-[var(--sea-ink)]">{shippingFee === 0 ? 'Buyer pays courier' : `₱${shippingFee}`}</span></div>
                  <div className="flex justify-between pt-2 border-t border-[var(--line)]"><span className="font-bold text-[var(--sea-ink)]">Total Due</span><span className="font-bold text-lg text-[var(--lagoon-deep)]">₱{totalAmount.toFixed(2)}</span></div>
                </div>

                {/* Confirmation Checkbox */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer mb-8 transition-colors ${
                    errors.confirmed ? 'border-red-400 bg-red-50/30' : 'border-[var(--line)] bg-white/40 hover:bg-white/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => {
                      setConfirmed(e.target.checked)
                      if (errors.confirmed) setErrors((prev) => ({ ...prev, confirmed: '' }))
                    }}
                    className="mt-1 w-5 h-5 accent-[var(--lagoon-deep)] shrink-0"
                  />
                  <span className="text-sm text-[var(--sea-ink)] leading-snug">
                    I confirm that I have sent my full payment of <strong>₱{totalAmount.toFixed(2)}</strong> and have read and understood all the notes and reminders stated above. <span className="text-red-500">*</span>
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
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="px-6 py-4 rounded-full border border-[var(--line)] text-[var(--sea-ink-soft)] font-bold hover:bg-white/50 transition-all disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
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
            )}

            {/* ─── STEP 6: SUCCESS ─── */}
            {step === 6 && (
              <div className="text-center animate-in zoom-in-95 duration-700 py-10">
                <div className="w-20 h-20 rounded-full bg-[var(--lagoon)] text-white flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-[var(--lagoon)]/20">
                  ✓
                </div>
                <h3 className="display-title text-3xl sm:text-4xl text-[var(--sea-ink)] mb-4">Thank you for your order!</h3>
                <p className="text-lg text-[var(--sea-ink-soft)] mb-4 max-w-sm mx-auto">
                  Your order has been received and your proof of payment was uploaded successfully.
                </p>
                <div className="bg-white/50 rounded-2xl p-6 border border-[var(--line)] mb-8 max-w-sm mx-auto text-sm text-left space-y-3">
                  <p className="text-[var(--sea-ink)]">
                    <strong>Next step:</strong> Please send a message on Instagram at{' '}
                    <a href="https://www.instagram.com/lettersfromrosie_" target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--lagoon-deep)] hover:underline">@lettersfromrosie_</a>{' '}
                    for confirmation.
                  </p>
                  <p className="text-[var(--sea-ink-soft)]">
                    Further details regarding your order and payment for shipping will be discussed afterwards.
                  </p>
                  <p className="text-[var(--sea-ink-soft)] italic">
                    Thank you so much for your order and support. God bless you always, dear reader! ♡
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => window.location.href = '/'}
                  className="px-8 py-3 rounded-full border-2 border-[var(--sea-ink)] text-[var(--sea-ink)] font-bold hover:bg-[var(--sea-ink)] hover:text-[var(--bg-base)] transition-colors"
                >
                  Return Home
                </button>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* LIGHTBOX / ZOOM MODAL */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-xl w-full bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-[var(--line)] flex flex-col items-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-start justify-between pb-3 border-b border-[var(--line)] mb-4">
              <div>
                <h4 className="font-bold text-lg text-[var(--sea-ink)]">{zoomedImage.title}</h4>
                {zoomedImage.subtitle && (
                  <p className="text-xs text-[var(--sea-ink-soft)] mt-0.5">{zoomedImage.subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[var(--sea-ink)] transition-colors text-base font-bold shrink-0 ml-3"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Image */}
            <div className="w-full flex items-center justify-center overflow-hidden rounded-2xl bg-[#faf8f5] p-2 sm:p-4 border border-[var(--line)]">
              <img
                src={zoomedImage.src}
                alt={zoomedImage.title}
                className="max-h-[60vh] sm:max-h-[68vh] w-auto max-w-full object-contain rounded-xl shadow-sm"
              />
            </div>

            {/* QR Quick Switcher */}
            {zoomedImage.type === 'qr' && (
              <div className="mt-4 w-full flex flex-col items-center">
                <p className="text-xs text-[var(--sea-ink-soft)] mb-2 font-medium">Switch bank / wallet QR:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { key: 'gcash', name: 'GCash', src: '/gcash.jpg' },
                    { key: 'maya', name: 'Maya', src: '/maya.jpg' },
                    { key: 'mari', name: 'MariBank', src: '/mari.jpg' },
                    { key: 'land', name: 'Landbank', src: '/land.jpg' },
                  ].map((b) => (
                    <button
                      key={b.key}
                      type="button"
                      onClick={() => setZoomedImage({
                        src: b.src,
                        title: `${b.name} Payment QR Code`,
                        subtitle: `Scan with ${b.name} app • Total Amount: ₱${totalAmount.toFixed(2)}`,
                        type: 'qr',
                        activeBank: b.key as any
                      })}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        zoomedImage.src === b.src
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
            {zoomedImage.type === 'cover' && (
              <div className="mt-4 w-full flex flex-col items-center">
                <p className="text-xs text-[var(--sea-ink-soft)] mb-2 font-medium">Switch cover view:</p>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setCoverView('front')
                      setZoomedImage({
                        src: '/bookcover-front.png',
                        title: 'The Art of Living at Your Own Pace — Front Cover',
                        subtitle: 'Original artwork & illustration by Roselyn Mariano',
                        type: 'cover'
                      })
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      zoomedImage.src === '/bookcover-front.png'
                        ? 'bg-[var(--sea-ink)] text-white border-transparent shadow-sm'
                        : 'bg-white border-[var(--line)] text-[var(--sea-ink)] hover:bg-gray-100'
                    }`}
                  >
                    Front Cover
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCoverView('back')
                      setZoomedImage({
                        src: '/bookcover-back.png',
                        title: 'The Art of Living at Your Own Pace — Back Cover',
                        subtitle: 'Back cover blurb & reflection',
                        type: 'cover'
                      })
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      zoomedImage.src === '/bookcover-back.png'
                        ? 'bg-[var(--sea-ink)] text-white border-transparent shadow-sm'
                        : 'bg-white border-[var(--line)] text-[var(--sea-ink)] hover:bg-gray-100'
                    }`}
                  >
                    Back Cover
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCoverView('spread')
                      setZoomedImage({
                        src: '/bookcover.png',
                        title: 'The Art of Living at Your Own Pace — Full Cover Wrap',
                        subtitle: 'Complete front, spine, and back cover panoramic jacket',
                        type: 'cover'
                      })
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      zoomedImage.src === '/bookcover.png'
                        ? 'bg-[var(--sea-ink)] text-white border-transparent shadow-sm'
                        : 'bg-white border-[var(--line)] text-[var(--sea-ink)] hover:bg-gray-100'
                    }`}
                  >
                    Full Wrap
                  </button>
                </div>
              </div>
            )}

            {/* Footer close hint */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="text-xs text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] underline font-medium"
              >
                Click outside or press Esc to close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
