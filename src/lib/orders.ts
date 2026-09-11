import { createServerFn } from '@tanstack/react-start'
import { supabase } from './supabase'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY || import.meta.env.VITE_RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export const submitOrder = createServerFn({ method: 'POST' })
  .validator((data: FormData) => data)
  .handler(async ({ data }) => {
    try {
      const name = data.get('name') as string
      const pronouns = data.get('pronouns') as string
      const email = data.get('email') as string
      const socialLink = data.get('social_link') as string
      const phone = data.get('phone') as string
      const address = data.get('address') as string
      const shippingMethod = data.get('shipping_method') as string
      const packageType = data.get('package_type') as string
      const freebiePhotocard = data.get('freebie_photocard') as string
      const additionalPhotocards = data.get('additional_photocards') as string
      const postcardMessage = data.get('postcard_message') as string
      const totalAmount = parseFloat(data.get('total_amount') as string)
      const receiptFile = data.get('receipt') as File | null

      if (!name || !email || !address || !receiptFile) {
        throw new Error("Missing required fields or receipt.")
      }

      // 1. Upload the receipt to Supabase Storage
      const fileExt = receiptFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `receipts/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, receiptFile)

      if (uploadError) {
        console.error("Storage upload error:", uploadError)
        throw new Error("Failed to upload receipt.")
      }

      // 2. Get the public URL for the receipt
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath)

      // 3. Insert the order into the database
      const { error: insertError } = await supabase
        .from('orders')
        .insert([{
          customer_name: name,
          pronouns: pronouns || null,
          email: email,
          social_link: socialLink || null,
          phone: phone,
          address: address,
          shipping_method: shippingMethod,
          package_type: packageType,
          freebie_photocard: freebiePhotocard || null,
          additional_photocards: additionalPhotocards || null,
          postcard_message: postcardMessage || null,
          total_amount: totalAmount,
          receipt_url: publicUrl,
          status: 'pending' // Default status
        }])

      if (insertError) {
        console.error("Database insert error:", insertError)
        throw new Error("Failed to save the order.")
      }

      // 4. Send Email Notification via Resend (if configured)
      if (resend) {
        const notificationEmailsStr = process.env.NOTIFICATION_EMAILS || import.meta.env.VITE_NOTIFICATION_EMAILS
        if (notificationEmailsStr) {
          const emails = notificationEmailsStr.split(',').map(e => e.trim())

          const packageLabel = packageType === 'personalized'
            ? 'Personalized Edition (₱699)'
            : 'Standard Edition (₱650)'

          const personalizedDetails = packageType === 'personalized' ? `
              <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
              <h3 style="margin: 0 0 8px;">Personalized Edition Details</h3>
              <p><strong>Freebie Photocard:</strong> ${freebiePhotocard || 'Not specified'}</p>
              <p><strong>Additional Photocards:</strong> ${additionalPhotocards || 'None'}</p>
              <p><strong>Postcard Message:</strong> ${postcardMessage || 'Not specified'}</p>
            ` : ''

          await resend.emails.send({
            from: 'Orders <onboarding@resend.dev>', // Default resend testing domain
            to: emails,
            subject: `🎉 New Order from ${name}!`,
            html: `
              <h2>New Book Order Received!</h2>
              <p><strong>Customer:</strong> ${name} ${pronouns ? `(${pronouns})` : ''}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Social Media:</strong> ${socialLink}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Package:</strong> ${packageLabel}</p>
              <p><strong>Total Paid:</strong> ₱${totalAmount.toFixed(2)}</p>
              <p><strong>Shipping:</strong> ${shippingMethod}</p>
              <p><strong>Address:</strong><br/>${address.replace(/\n/g, '<br/>')}</p>
              ${personalizedDetails}
              <br/>
              <p><a href="${publicUrl}" target="_blank">View Payment Receipt Screenshot</a></p>
            `
          })
        }
      }

      return { success: true }
    } catch (e: any) {
      console.error('Order submission failed:', e)
      return { success: false, error: e.message }
    }
  })
