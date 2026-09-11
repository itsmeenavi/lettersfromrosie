import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { getOrders, updateOrderStatus, type OrderRecord } from '../lib/orders'
import { OrderCard } from '../components/dashboard/OrderCard'
import { MOCK_ORDERS } from '../components/dashboard/mockOrders'

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
  head: () => ({
    meta: [
      { title: 'Orders Dashboard | Letters from Rosie' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  loader: async () => {
    try {
      return await getOrders()
    } catch {
      return [] as OrderRecord[]
    }
  },
})

function DashboardComponent() {
  const initialOrders = Route.useLoaderData()
  const getOrdersFn = useServerFn(getOrders)
  const updateStatusFn = useServerFn(updateOrderStatus)

  // Auth Gate state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [passcode, setPasscode] = useState('')
  const [authError, setAuthError] = useState('')

  // Orders state
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders || [])
  const [showDemo, setShowDemo] = useState<boolean>(initialOrders.length === 0)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [packageFilter, setPackageFilter] = useState<string>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Receipt Modal
  const [receiptModal, setReceiptModal] = useState<{ url: string; title: string } | null>(null)

  // Check saved session auth on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('rosie_dashboard_auth')
      if (auth === 'true') {
        setIsAuthenticated(true)
      }
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple passcode check (default: rosie or rosie2024)
    if (passcode.trim().toLowerCase() === 'rosie' || passcode.trim().toLowerCase() === 'rosie2024') {
      setIsAuthenticated(true)
      sessionStorage.setItem('rosie_dashboard_auth', 'true')
      setAuthError('')
    } else {
      setAuthError('Incorrect passcode. Try "rosie"')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('rosie_dashboard_auth')
    setIsAuthenticated(false)
    setPasscode('')
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const latest = await getOrdersFn()
      setOrders(latest)
      if (latest.length > 0) {
        setShowDemo(false)
      }
    } catch (e) {
      console.warn('Refresh error:', e)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderRecord['status']) => {
    // Update local state immediately for fast feedback
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    )

    // Sync with backend if it's not a demo order
    if (!orderId.startsWith('sample-')) {
      try {
        await updateStatusFn({ data: { id: orderId, status: newStatus } })
      } catch (err) {
        console.error('Failed to update status in database:', err)
      }
    }
  }

  // Active dataset (either live orders or demo preview)
  const activeOrders = useMemo(() => {
    if (showDemo) return MOCK_ORDERS
    return orders
  }, [showDemo, orders])

  // Filtered dataset
  const filteredOrders = useMemo(() => {
    return activeOrders.filter((ord) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        ord.customer_name.toLowerCase().includes(q) ||
        ord.email.toLowerCase().includes(q) ||
        ord.phone.includes(q) ||
        (ord.social_link && ord.social_link.toLowerCase().includes(q)) ||
        ord.address.toLowerCase().includes(q)

      const matchesStatus = statusFilter === 'all' || ord.status === statusFilter
      const matchesPackage = packageFilter === 'all' || ord.package_type === packageFilter

      return matchesSearch && matchesStatus && matchesPackage
    })
  }, [activeOrders, searchQuery, statusFilter, packageFilter])

  // Key stats counters
  const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
  const pendingCount = activeOrders.filter((o) => o.status === 'pending').length
  const personalizedCount = activeOrders.filter((o) => o.package_type === 'personalized').length
  const shippedCount = activeOrders.filter((o) => o.status === 'shipped' || o.status === 'delivered').length

  // ═══════════════════════════════════════════════════════════════
  // 1. PASSCODE LOGIN SCREEN
  // ═══════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <main className="page-wrap min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full island-shell rounded-3xl p-8 sm:p-10 border border-[var(--line)] shadow-xl text-center bg-white/95">
          <div className="w-16 h-16 rounded-full bg-[var(--lagoon)]/15 text-[var(--lagoon-deep)] flex items-center justify-center text-3xl mx-auto mb-4">
            🔒
          </div>
          <h1 className="display-title text-2xl sm:text-3xl font-bold text-[var(--sea-ink)] mb-2">
            Creator Dashboard
          </h1>
          <p className="text-sm text-[var(--sea-ink-soft)] mb-6">
            Welcome back, Rosie! Please enter your passcode to view your book orders.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. rosie)"
                className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-white text-center text-lg tracking-wider focus:outline-none focus:border-[var(--lagoon-deep)] shadow-inner"
                autoFocus
              />
              {authError && (
                <p className="text-xs text-red-500 font-medium mt-2">
                  ⚠️ {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[var(--sea-ink)] text-[var(--bg-base)] font-bold text-base hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              Unlock Dashboard 🌸
            </button>
          </form>

          <p className="text-[11px] text-[var(--sea-ink-soft)] mt-6">
            Default passcode: <span className="font-mono font-bold text-[var(--sea-ink)]">rosie</span>
          </p>
        </div>
      </main>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. MAIN DASHBOARD CONTENT
  // ═══════════════════════════════════════════════════════════════
  return (
    <main className="page-wrap px-4 py-10 lg:py-16">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--line)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--lagoon)]/15 text-[var(--lagoon-deep)] text-xs font-bold uppercase tracking-wider mb-2">
            <span>🌸 Letters from Rosie</span>
          </div>
          <h1 className="display-title text-3xl sm:text-4xl font-bold text-[var(--sea-ink)]">
            Orders Dashboard
          </h1>
          <p className="text-sm text-[var(--sea-ink-soft)] mt-1">
            Track customer deliveries, payment receipts, and postcard messages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Demo / Live Data Toggle */}
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all ${
              showDemo
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-white text-[var(--sea-ink)] border-[var(--line)] hover:bg-gray-100'
            }`}
          >
            {showDemo ? '👁️ Viewing Demo Orders' : '⚡ Viewing Live Orders'}
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-full bg-white border border-[var(--line)] text-[var(--sea-ink)] text-xs font-bold hover:bg-gray-100 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          {/* Lock / Exit */}
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] text-xs font-bold transition-all"
            title="Lock Dashboard"
          >
            🔒 Lock
          </button>
        </div>
      </div>

      {/* Demo Banner (if active) */}
      {showDemo && (
        <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span>
              <strong>Demo Preview Active:</strong> Showing sample pre-orders so you can test Instagram links, receipt zoom, and status changes. Switch to <strong>Live Orders</strong> once readers start submitting!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowDemo(false)}
            className="text-xs font-bold text-amber-800 hover:underline shrink-0"
          >
            Switch to Live Orders →
          </button>
        </div>
      )}

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="p-5 rounded-3xl bg-white border border-[var(--line)] shadow-xs">
          <span className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
            Total Orders
          </span>
          <p className="text-3xl font-bold text-[var(--sea-ink)]">
            {activeOrders.length}
          </p>
          <span className="text-xs text-[var(--sea-ink-soft)] mt-1 block">
            {shippedCount} fulfilled / shipped
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[var(--line)] shadow-xs">
          <span className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
            Gross Sales
          </span>
          <p className="text-3xl font-bold text-[var(--lagoon-deep)]">
            ₱{totalRevenue.toLocaleString()}
          </p>
          <span className="text-xs text-[var(--sea-ink-soft)] mt-1 block">
            Book & shipping revenue
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[var(--line)] shadow-xs">
          <span className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
            Needs Verification
          </span>
          <p className="text-3xl font-bold text-amber-600">
            {pendingCount}
          </p>
          <span className="text-xs text-[var(--sea-ink-soft)] mt-1 block">
            Pending receipt review
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[var(--line)] shadow-xs">
          <span className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider block mb-1">
            Personalized Postcards
          </span>
          <p className="text-3xl font-bold text-[#c13584]">
            {personalizedCount}
          </p>
          <span className="text-xs text-[var(--sea-ink-soft)] mt-1 block">
            Copies to write & personalize
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-[var(--line)] shadow-xs mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sea-ink-soft)]">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, email, phone, or Instagram @username..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[var(--line)] bg-white text-sm focus:outline-none focus:border-[var(--lagoon-deep)]"
            />
          </div>

          {/* Package Filter */}
          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="px-4 py-2.5 rounded-full border border-[var(--line)] bg-white text-xs font-bold text-[var(--sea-ink)] focus:outline-none focus:border-[var(--lagoon-deep)] cursor-pointer"
          >
            <option value="all">All Packages</option>
            <option value="standard">Standard Edition (₱650)</option>
            <option value="personalized">Personalized Edition (₱699)</option>
          </select>
        </div>

        {/* Status Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--line)]">
          <span className="text-xs text-[var(--sea-ink-soft)] mr-2 font-medium">Status:</span>
          {['all', 'pending', 'confirmed', 'packed', 'shipped', 'delivered'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all capitalize ${
                statusFilter === st
                  ? 'bg-[var(--sea-ink)] text-white shadow-xs'
                  : 'bg-white border border-[var(--line)] text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] hover:bg-gray-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Cards Grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onZoomReceipt={(url, title) => setReceiptModal({ url, title })}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl bg-white/60 border border-[var(--line)] p-8">
          <div className="text-4xl mb-3 text-[var(--sea-ink-soft)]">📦</div>
          <h3 className="text-lg font-bold text-[var(--sea-ink)] mb-1">
            No orders found
          </h3>
          <p className="text-xs text-[var(--sea-ink-soft)] max-w-sm mx-auto mb-4">
            {searchQuery || statusFilter !== 'all' || packageFilter !== 'all'
              ? 'Try resetting your search query or filters above.'
              : 'No orders submitted yet. When readers place pre-orders on the book page, they will appear here!'}
          </p>
          {(searchQuery || statusFilter !== 'all' || packageFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
                setPackageFilter('all')
              }}
              className="px-4 py-2 rounded-full bg-[var(--sea-ink)] text-white text-xs font-bold hover:opacity-90 transition-all"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Receipt Lightbox Modal */}
      {receiptModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setReceiptModal(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-3xl p-6 shadow-2xl border border-[var(--line)] flex flex-col items-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-[var(--line)] mb-4">
              <div>
                <h4 className="font-bold text-base text-[var(--sea-ink)]">{receiptModal.title}</h4>
                <p className="text-xs text-[var(--sea-ink-soft)] mt-0.5">Proof of Payment Screenshot</p>
              </div>
              <button
                type="button"
                onClick={() => setReceiptModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[var(--sea-ink)] transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            <div className="w-full flex items-center justify-center overflow-hidden rounded-2xl bg-gray-50 p-2 border border-[var(--line)]">
              <img
                src={receiptModal.url}
                alt={receiptModal.title}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            <div className="mt-4 flex gap-3">
              <a
                href={receiptModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[var(--sea-ink)] text-white text-xs font-bold hover:opacity-90 transition-all"
              >
                Open in Full Tab ↗
              </a>
              <button
                type="button"
                onClick={() => setReceiptModal(null)}
                className="px-4 py-2 rounded-full border border-[var(--line)] text-[var(--sea-ink)] text-xs font-bold hover:bg-gray-100 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
