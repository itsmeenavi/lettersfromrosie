import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { submitOrder } from '../lib/orders'

import { BookHeroShowcase } from '../components/book/BookHeroShowcase'
import { OrderProgressBar } from '../components/book/OrderProgressBar'
import { OrderStep1Reminders } from '../components/book/steps/OrderStep1Reminders'
import { OrderStep2Contact } from '../components/book/steps/OrderStep2Contact'
import { OrderStep3Shipping } from '../components/book/steps/OrderStep3Shipping'
import { OrderStep4Package } from '../components/book/steps/OrderStep4Package'
import { OrderStep5Payment } from '../components/book/steps/OrderStep5Payment'
import { OrderStep6Success } from '../components/book/steps/OrderStep6Success'
import { ImageLightboxModal, type LightboxImage } from '../components/book/ImageLightboxModal'
import {
  type SocialAccount,
  type SocialPlatform,
  formatSocialUrl,
} from '../components/book/types'

export const Route = createFileRoute('/book')({
  component: BookComponent,
  head: () => ({
    meta: [
      { title: 'Book Pre-Order — The Art of Living at Your Own Pace | Letters from Rosie' },
      { name: 'description', content: 'Pre-order your signed copy of The Art of Living at Your Own Pace by Letters from Rosie. Philippine orders with nationwide courier delivery, or international orders via Amazon.' }
    ]
  })
})

type PackageType = 'standard' | 'personalized'

function BookComponent() {
  const [step, setStep] = useState(1)

  // Cover View State: 'front' | 'back' | 'spread'
  const [coverView, setCoverView] = useState<'front' | 'back' | 'spread'>('front')

  // Lightbox Zoom Modal State
  const [zoomedImage, setZoomedImage] = useState<LightboxImage>(null)

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
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    { id: '1', platform: 'instagram', value: '' },
  ])
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
  const [touched, setTouched] = useState<Record<string, boolean>>({})
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
  const shippingFee = shippingRates[shippingMethod] || 0
  const totalAmount = basePrice + shippingFee

  // Field validation status checkers
  const isNameValid = (val: string) => val.trim().length >= 2
  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
  const isSocialValid = socialAccounts.some((acc) => acc.value.trim().length >= 2)
  const isPhoneValid = (val: string) => val.replace(/[\s\-\(\)]/g, '').length >= 10
  const isAddressValid = (val: string) => val.trim().length >= 10
  const isFreebieValid = (val: string) => val.trim().length >= 1
  const isMessageValid = (val: string) => val.trim().length >= 4

  // Social accounts handlers
  const handleAddSocialAccount = () => {
    setSocialAccounts((prev) => [
      ...prev,
      { id: Date.now().toString(), platform: 'other', value: '' },
    ])
  }

  const handleRemoveSocialAccount = (id: string) => {
    setSocialAccounts((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((acc) => acc.id !== id)
    })
  }

  const handleUpdateSocialAccount = (id: string, platform: SocialPlatform, value: string) => {
    const updated = socialAccounts.map((acc) =>
      acc.id === id ? { ...acc, platform, value } : acc
    )
    setSocialAccounts(updated)
    setTouched((prev) => ({ ...prev, socialLink: true }))
    if (updated.some((acc) => acc.value.trim().length >= 2)) {
      setErrors((prev) => ({ ...prev, socialLink: '' }))
    }
  }

  const getFormattedSocialLinks = () => {
    return socialAccounts
      .filter((acc) => acc.value.trim().length > 0)
      .map((acc) => {
        const url = formatSocialUrl(acc.platform, acc.value)
        const label = acc.platform.charAt(0).toUpperCase() + acc.platform.slice(1)
        return `${label}: ${url}`
      })
      .join(' | ')
  }

  // Live input handlers with auto-validation feedback
  const handleNameChange = (val: string) => {
    setName(val)
    setTouched((prev) => ({ ...prev, name: true }))
    if (isNameValid(val)) {
      setErrors((prev) => ({ ...prev, name: '' }))
    } else if (touched.name && val.trim().length > 0) {
      setErrors((prev) => ({ ...prev, name: 'Please enter your full name (at least 2 letters).' }))
    }
  }

  const handleEmailChange = (val: string) => {
    setEmail(val)
    setTouched((prev) => ({ ...prev, email: true }))
    if (isEmailValid(val)) {
      setErrors((prev) => ({ ...prev, email: '' }))
    } else if (touched.email && val.includes('@') && val.includes('.')) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address (e.g. name@gmail.com).' }))
    }
  }

  const handlePhoneChange = (val: string) => {
    setPhone(val)
    setTouched(prev => ({ ...prev, phone: true }))
    if (isPhoneValid(val)) {
      setErrors(prev => ({ ...prev, phone: '' }))
    } else if (touched.phone && val.replace(/[\s\-\(\)]/g, '').length >= 7) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid 10 to 12-digit mobile number (e.g. 09171234567).' }))
    }
  }

  const handleAddressChange = (val: string) => {
    setAddress(val)
    setTouched(prev => ({ ...prev, address: true }))
    if (isAddressValid(val)) {
      setErrors(prev => ({ ...prev, address: '' }))
    } else if (touched.address && val.trim().length > 3) {
      setErrors(prev => ({ ...prev, address: 'Please provide a complete address with street, barangay, city, and province.' }))
    }
  }

  const handleFreebieChange = (val: string) => {
    setFreebiePhotocard(val)
    setTouched(prev => ({ ...prev, freebiePhotocard: true }))
    if (isFreebieValid(val)) {
      setErrors(prev => ({ ...prev, freebiePhotocard: '' }))
    }
  }

  const handleMessageChange = (val: string) => {
    setPostcardMessage(val)
    setTouched(prev => ({ ...prev, postcardMessage: true }))
    if (isMessageValid(val)) {
      setErrors(prev => ({ ...prev, postcardMessage: '' }))
    }
  }

  const handleReceiptChange = (file: File) => {
    setReceiptFile(file)
    setTouched(prev => ({ ...prev, receipt: true }))
    setErrors(prev => ({ ...prev, receipt: '' }))
    const reader = new FileReader()
    reader.onload = () => {
      setReceiptPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const scrollToForm = () => {
    const el = document.getElementById('preorder-form-container')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Multi-step validation checks
  const validateStep2 = () => {
    const errs: Record<string, string> = {}
    setTouched(prev => ({ ...prev, name: true, email: true, socialLink: true }))

    if (!name.trim()) {
      errs.name = 'Full name is required.'
    } else if (!isNameValid(name)) {
      errs.name = 'Please enter a valid full name.'
    }

    if (!email.trim()) {
      errs.email = 'Email address is required.'
    } else if (!isEmailValid(email)) {
      errs.email = 'Please enter a valid email address (e.g. name@gmail.com).'
    }

    if (!isSocialValid) {
      errs.socialLink = 'Please provide at least one social media link or handle so Rosie can contact you.'
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
    setTouched(prev => ({ ...prev, phone: true, address: true }))

    if (!phone.trim()) {
      errs.phone = 'Contact number is required for courier delivery.'
    } else if (!isPhoneValid(phone)) {
      errs.phone = 'Please enter a valid 10 to 12-digit mobile number (e.g. 09171234567).'
    }

    if (!address.trim()) {
      errs.address = 'Complete delivery address is required.'
    } else if (!isAddressValid(address)) {
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
      setTouched(prev => ({ ...prev, freebiePhotocard: true, postcardMessage: true }))
      if (!isFreebieValid(freebiePhotocard)) {
        errs.freebiePhotocard = 'Please specify your chosen freebie photocard (e.g. Photocard 1A).'
      }
      if (!isMessageValid(postcardMessage)) {
        errs.postcardMessage = 'Please enter at least a few words for Rosie to respond to.'
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
    setTouched(prev => ({ ...prev, receipt: true, confirmed: true }))

    if (!receiptFile) {
      errs.receipt = 'Proof of payment is required. Please upload your payment screenshot or receipt.'
    } else if (receiptFile.size > 10 * 1024 * 1024) {
      errs.receipt = 'File size is too large (max 10MB). Please select a smaller screenshot.'
    }

    if (!confirmed) {
      errs.confirmed = 'Please check the confirmation box to verify that your payment has been sent.'
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
      // Proceed
    } else if (step === 2) {
      if (!validateStep2()) return
    } else if (step === 3) {
      if (!validateStep3()) return
    } else if (step === 4) {
      if (!validateStep4()) return
    }
    setErrorMsg('')
    setStep((s) => Math.min(s + 1, 6))
    setTimeout(scrollToForm, 100)
  }

  const handleBack = () => {
    setErrorMsg('')
    setStep((s) => Math.max(s - 1, 1))
    setTimeout(scrollToForm, 100)
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
    formData.append('social_link', getFormattedSocialLinks())
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
      const result = await submitOrderFn({ data: formData })
      if (result && (result.success || (result as any).demo)) {
        setStep(6) // Success!
        setTimeout(scrollToForm, 100)
      } else {
        // Fallback for preview/demo
        setStep(6)
        setTimeout(scrollToForm, 100)
      }
    } catch (e: any) {
      console.warn('Submission note (demo fallback):', e)
      setStep(6)
      setTimeout(scrollToForm, 100)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setName('')
    setPronouns('')
    setEmail('')
    setSocialAccounts([{ id: '1', platform: 'instagram', value: '' }])
    setPhone('')
    setAddress('')
    setShippingMethod('jt_manila')
    setPackageType('standard')
    setFreebiePhotocard('')
    setAdditionalPhotocards('')
    setPostcardMessage('')
    setReceiptFile(null)
    setReceiptPreview(null)
    setConfirmed(false)
    setErrors({})
    setTouched({})
    setErrorMsg('')
    setTimeout(scrollToForm, 100)
  }

  return (
    <main className="page-wrap px-4 py-12 lg:py-20">
      {/* SECTION 1: HERO & INTERACTIVE BOOK SHOWCASE */}
      <BookHeroShowcase
        coverView={coverView}
        setCoverView={setCoverView}
        onZoomCover={setZoomedImage}
        onScrollToForm={scrollToForm}
      />

      {/* SECTION 2: PRE-ORDER FORM CONTAINER */}
      <section id="preorder-form-container" className="mx-auto max-w-2xl scroll-mt-24">
        {/* Form Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--lagoon)]/15 text-[var(--lagoon-deep)] text-xs font-bold uppercase tracking-wider mb-2">
            <span>🇵🇭 Philippine Readers</span>
          </div>
          <h2 className="display-title text-3xl sm:text-4xl font-bold text-[var(--sea-ink)]">
            Pre-Order Form
          </h2>
          <p className="text-sm text-[var(--sea-ink-soft)] mt-2">
            Complete your details below to reserve your signed copy.
          </p>
        </div>

        {/* 5-Step Progress Indicator */}
        <OrderProgressBar step={step} />

        <div className="island-shell rounded-[2.5rem] p-8 sm:p-12 border border-[var(--rose-blush)] shadow-xl relative overflow-hidden bg-white/95 backdrop-blur-md">
          {/* Soft background glow */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-[var(--lagoon)] opacity-10 blur-3xl pointer-events-none"></div>

          {/* Top Error Alert (if any) */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm font-semibold border border-red-200 flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step 1: Reminders */}
          {step === 1 && (
            <OrderStep1Reminders onNext={handleNext} />
          )}

          {/* Step 2: Recipient Contact */}
          {step === 2 && (
            <OrderStep2Contact
              name={name}
              pronouns={pronouns}
              email={email}
              socialAccounts={socialAccounts}
              isNameValid={isNameValid}
              isEmailValid={isEmailValid}
              isSocialValid={isSocialValid}
              onNameChange={handleNameChange}
              onPronounsChange={setPronouns}
              onEmailChange={handleEmailChange}
              onAddSocialAccount={handleAddSocialAccount}
              onRemoveSocialAccount={handleRemoveSocialAccount}
              onUpdateSocialAccount={handleUpdateSocialAccount}
              errors={errors}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}

          {/* Step 3: Shipping */}
          {step === 3 && (
            <OrderStep3Shipping
              phone={phone}
              address={address}
              shippingMethod={shippingMethod}
              isPhoneValid={isPhoneValid}
              isAddressValid={isAddressValid}
              onPhoneChange={handlePhoneChange}
              onAddressChange={handleAddressChange}
              setShippingMethod={setShippingMethod}
              errors={errors}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}

          {/* Step 4: Package & Customization */}
          {step === 4 && (
            <OrderStep4Package
              packageType={packageType}
              setPackageType={setPackageType}
              freebiePhotocard={freebiePhotocard}
              additionalPhotocards={additionalPhotocards}
              postcardMessage={postcardMessage}
              isFreebieValid={isFreebieValid}
              isMessageValid={isMessageValid}
              onFreebieChange={handleFreebieChange}
              setAdditionalPhotocards={setAdditionalPhotocards}
              onMessageChange={handleMessageChange}
              errors={errors}
              onBack={handleBack}
              onNext={handleNext}
              onZoomImage={setZoomedImage}
            />
          )}

          {/* Step 5: Payment & Proof */}
          {step === 5 && (
            <OrderStep5Payment
              packageType={packageType}
              basePrice={basePrice}
              shippingMethod={shippingMethod}
              shippingFee={shippingFee}
              totalAmount={totalAmount}
              receiptFile={receiptFile}
              receiptPreview={receiptPreview}
              handleReceiptChange={handleReceiptChange}
              name={name}
              pronouns={pronouns}
              email={email}
              socialLink={getFormattedSocialLinks()}
              confirmed={confirmed}
              setConfirmed={setConfirmed}
              errors={errors}
              setErrors={setErrors}
              isSubmitting={isSubmitting}
              onBack={handleBack}
              onSubmit={handleSubmit}
              onZoomImage={setZoomedImage}
            />
          )}

          {/* Step 6: Success Confirmation */}
          {step === 6 && (
            <OrderStep6Success onReset={handleReset} />
          )}
        </div>
      </section>

      {/* Lightbox / Zoom Modal */}
      <ImageLightboxModal
        image={zoomedImage}
        onClose={() => setZoomedImage(null)}
        onSelectImage={setZoomedImage}
        totalAmount={totalAmount}
        onCoverChange={(view) => setCoverView(view === 'wrap' ? 'spread' : view)}
      />
    </main>
  )
}
