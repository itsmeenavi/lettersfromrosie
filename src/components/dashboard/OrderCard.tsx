import React, { useState } from 'react'
import type { OrderRecord } from '../../lib/orders'

interface OrderCardProps {
  order: OrderRecord
  onStatusChange: (id: string, newStatus: OrderRecord['status']) => void
  onZoomReceipt: (url: string, title: string) => void
}

interface ParsedSocialLink {
  label: string
  url: string
  icon: string
  pillClass: string
}

function parseSocialLinks(raw: string | null | undefined): ParsedSocialLink[] {
  if (!raw || !raw.trim()) return []

  const parts = raw.split('|').map((p) => p.trim()).filter(Boolean)
  const results: ParsedSocialLink[] = []

  for (const part of parts) {
    let platformLabel = ''
    let url = ''

    if (part.includes(': http')) {
      const splitIdx = part.indexOf(': ')
      platformLabel = part.slice(0, splitIdx).trim()
      url = part.slice(splitIdx + 2).trim()
    } else if (/^https?:\/\//i.test(part)) {
      url = part
    } else if (part.startsWith('@')) {
      platformLabel = 'Instagram'
      url = `https://instagram.com/${part.replace(/^@/, '')}`
    } else {
      url = part.includes('.') ? `https://${part}` : `https://instagram.com/${part}`
    }

    const lower = (platformLabel || url).toLowerCase()
    let icon = '🌐'
    let pillClass = 'bg-gray-100 hover:bg-gray-200 text-[var(--sea-ink)] border-gray-200'
    let displayLabel = platformLabel || 'Profile Link'

    if (lower.includes('instagram') || lower.includes('ig')) {
      icon = '📷'
      pillClass = 'bg-gradient-to-r from-[#833ab4]/10 via-[#fd1d1d]/10 to-[#fcb045]/10 hover:from-[#833ab4]/20 hover:via-[#fd1d1d]/20 hover:to-[#fcb045]/20 text-[#c13584] border-[#c13584]/25'
      displayLabel = displayLabel || 'Instagram'
    } else if (lower.includes('tiktok')) {
      icon = '🎵'
      pillClass = 'bg-black/5 hover:bg-black/10 text-gray-900 border-black/20'
      displayLabel = displayLabel || 'TikTok'
    } else if (lower.includes('medium')) {
      icon = '📖'
      pillClass = 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
      displayLabel = displayLabel || 'Medium'
    } else if (lower.includes('facebook') || lower.includes('fb.com')) {
      icon = '📘'
      pillClass = 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
      displayLabel = displayLabel || 'Facebook'
    } else if (lower.includes('twitter') || lower.includes('x.com')) {
      icon = '🐦'
      pillClass = 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
      displayLabel = displayLabel || 'X / Twitter'
    }

    results.push({
      label: displayLabel,
      url,
      icon,
      pillClass,
    })
  }

  return results
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onStatusChange,
  onZoomReceipt,
}) => {
  const [copied, setCopied] = useState(false)
  const socialLinks = parseSocialLinks(order.social_link)

  const handleCopyAddress = () => {
    const text = `Recipient: ${order.customer_name}\nContact: ${order.phone}\nAddress: ${order.address}\nPackage: ${order.package_type === 'personalized' ? 'Personalized Edition' : 'Standard Edition'}\nShipping: ${order.shipping_method}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusBadgeColor = (st: OrderRecord['status']) => {
    switch (st) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'packed':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'delivered':
        return 'bg-gray-100 text-gray-700 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const formatShippingName = (method: string) => {
    switch (method) {
      case 'jt_manila':
        return 'J&T Express (Metro Manila)'
      case 'jt_luzon':
        return 'J&T Express (Luzon)'
      case 'jt_visayas':
        return 'J&T Express (Visayas)'
      case 'jt_mindanao':
        return 'J&T Express (Mindanao)'
      case 'lalamove':
        return 'Lalamove / Grab (Buyer books)'
      default:
        return method
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[var(--line)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[var(--line)] mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-[var(--sea-ink)]">
                {order.customer_name}
              </h3>
              {order.pronouns && (
                <span className="text-xs text-[var(--sea-ink-soft)] font-medium">
                  ({order.pronouns})
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--sea-ink-soft)] mt-0.5">
              {new Date(order.created_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${getStatusBadgeColor(order.status)}`}>
              {order.status}
            </span>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value as OrderRecord['status'])}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-[var(--line)] bg-white text-[var(--sea-ink)] focus:outline-none focus:border-[var(--lagoon-deep)] cursor-pointer"
            >
              <option value="pending">Mark Pending</option>
              <option value="confirmed">Mark Confirmed</option>
              <option value="packed">Mark Packed</option>
              <option value="shipped">Mark Shipped</option>
              <option value="delivered">Mark Delivered</option>
            </select>
          </div>
        </div>

        {/* Quick Contact & Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          {socialLinks.length > 0 ? (
            socialLinks.map((s, idx) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${s.pillClass}`}
                title={`Open ${s.label}: ${s.url}`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
                <span className="text-[10px] opacity-70">↗</span>
              </a>
            ))
          ) : (
            <span className="text-xs text-[var(--sea-ink-soft)] font-medium">
              {order.social_link || 'No social handle provided'}
            </span>
          )}

          <a
            href={`tel:${order.phone}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[var(--sea-ink)] text-xs font-semibold transition-colors"
          >
            <span>📞</span>
            <span>{order.phone}</span>
          </a>

          <a
            href={`mailto:${order.email}?subject=The Art of Living at Your Own Pace — Book Pre-Order Update`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[var(--sea-ink)] text-xs font-semibold transition-colors"
          >
            <span>✉️</span>
            <span>{order.email}</span>
          </a>
        </div>

        {/* Package & Pricing Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-[#faf8f5] border border-[var(--line)]">
            <span className="text-[11px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
              Book Edition
            </span>
            <p className="font-bold text-sm text-[var(--sea-ink)]">
              {order.package_type === 'personalized' ? '✨ Personalized Edition' : '📖 Standard Edition'}
            </p>
            <p className="text-xs text-[var(--sea-ink-soft)] mt-0.5">
              {order.package_type === 'personalized' ? 'Signed copy + Bookmark + Photocard + Postcard' : 'Signed copy + Bookmark'}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#faf8f5] border border-[var(--line)] flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
                Total Amount Paid
              </span>
              <p className="font-bold text-lg text-[var(--lagoon-deep)]">
                ₱{order.total_amount.toFixed(2)}
              </p>
            </div>
            <p className="text-[11px] text-[var(--sea-ink-soft)]">
              {formatShippingName(order.shipping_method)}
            </p>
          </div>
        </div>

        {/* Personalized Details (if personalized edition) */}
        {order.package_type === 'personalized' && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-50/40 border border-dashed border-amber-300 space-y-3">
            <h4 className="font-bold text-xs text-amber-900 uppercase tracking-widest flex items-center gap-1.5">
              <span>💌</span>
              <span>Personalized Postcard Details</span>
            </h4>

            {order.freebie_photocard && (
              <div className="text-xs">
                <span className="text-[var(--sea-ink-soft)] font-medium">Freebie Photocard: </span>
                <span className="font-bold text-[var(--sea-ink)]">{order.freebie_photocard}</span>
              </div>
            )}

            {order.additional_photocards && (
              <div className="text-xs">
                <span className="text-[var(--sea-ink-soft)] font-medium">Additional Photocards: </span>
                <span className="font-semibold text-[var(--sea-ink)]">{order.additional_photocards}</span>
              </div>
            )}

            {order.postcard_message && (
              <div className="pt-2 border-t border-amber-200/60">
                <span className="text-[11px] text-[var(--sea-ink-soft)] block mb-1 font-semibold uppercase tracking-wider">
                  Reader's Topic / Message to Rosie:
                </span>
                <p className="font-serif italic text-sm text-[var(--sea-ink)] leading-relaxed bg-white/70 p-3 rounded-xl border border-amber-200/50">
                  “{order.postcard_message}”
                </p>
              </div>
            )}
          </div>
        )}

        {/* Delivery Address & Copy Shortcut */}
        <div className="mb-5 p-4 rounded-2xl bg-[#faf8f5] border border-[var(--line)]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider">
              Delivery Address
            </span>
            <button
              type="button"
              onClick={handleCopyAddress}
              className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
                copied
                  ? 'bg-emerald-600 text-white border-transparent'
                  : 'bg-white border-[var(--line)] text-[var(--sea-ink)] hover:bg-black/5'
              }`}
            >
              {copied ? '✓ Copied!' : '📋 Copy Address'}
            </button>
          </div>
          <p className="text-xs sm:text-sm text-[var(--sea-ink)] leading-relaxed">
            {order.address}
          </p>
        </div>
      </div>

      {/* Proof of Payment Thumbnail */}
      <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {order.receipt_url && order.receipt_url !== 'demo_receipt_preview' ? (
            <button
              type="button"
              onClick={() => onZoomReceipt(order.receipt_url!, `${order.customer_name}'s Payment Receipt`)}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-[var(--line)] bg-gray-100 shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <img
                  src={order.receipt_url}
                  alt="Receipt thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-[var(--lagoon-deep)] group-hover:underline block">
                  View Payment Screenshot 🔍
                </span>
                <span className="text-[11px] text-[var(--sea-ink-soft)]">
                  Verify reference number
                </span>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-[var(--sea-ink-soft)]">
              <span>🧾</span>
              <span>Receipt pending / demo preview</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
