import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, statusBadge } from '@/lib/utils'
import type { Quote, Invoice, Profile } from '@/lib/supabase/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [quotesRes, invoicesRes, profileRes] = await Promise.all([
    supabase.from('quotes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('invoices').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('profiles').select('*').eq('id', user.id).single(),
  ])

  const quotes = (quotesRes.data ?? []) as Quote[]
  const invoices = (invoicesRes.data ?? []) as Invoice[]
  const profile = profileRes.data as Profile | null

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0)
  const outstanding = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, i) => sum + i.total, 0)
  const openQuotes = quotes.filter(q => q.status === 'sent').length

  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / 86400000))
    : null

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Trial banner */}
      {profile?.subscription_status === 'trial' && trialDaysLeft !== null && trialDaysLeft <= 14 && (
        <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 px-5 py-4 flex items-center justify-between gap-4">
          <p className="text-amber-800 text-sm font-medium">
            {trialDaysLeft > 0
              ? `${trialDaysLeft} days left in your free trial.`
              : 'Your trial has ended.'}
            {' '}Subscribe to keep sending quotes and invoices.
          </p>
          <Link href="/settings#billing" className="shrink-0 rounded-lg bg-amber-500 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-600 transition-colors">
            Subscribe — $29/mo
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good {getGreeting()}, {profile?.full_name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Here&apos;s what&apos;s happening with your business</p>
        </div>
        <Link
          href="/quotes/new"
          className="hidden sm:flex items-center gap-2 rounded-xl bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Quote
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} color="green" icon="💰" />
        <StatCard label="Outstanding" value={formatCurrency(outstanding)} color="amber" icon="📋" />
        <StatCard label="Open Quotes" value={String(openQuotes)} color="blue" icon="📝" />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent quotes */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-slate-900">Recent Quotes</h2>
            <Link href="/quotes" className="text-blue-600 text-sm font-medium hover:underline">View all</Link>
          </div>
          {quotes.length === 0 ? (
            <EmptyState
              message="No quotes yet"
              action={{ label: 'Create your first quote', href: '/quotes/new' }}
            />
          ) : (
            <ul className="divide-y divide-gray-100">
              {quotes.map(q => (
                <li key={q.id}>
                  <Link href={`/quotes/${q.id}`} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{q.number}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(q.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(q.status)}`}>{q.status}</span>
                      <span className="text-sm font-semibold text-slate-900">{formatCurrency(q.total)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent invoices */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-slate-900">Recent Invoices</h2>
            <Link href="/invoices" className="text-blue-600 text-sm font-medium hover:underline">View all</Link>
          </div>
          {invoices.length === 0 ? (
            <EmptyState message="No invoices yet" hint="Convert an accepted quote to an invoice" />
          ) : (
            <ul className="divide-y divide-gray-100">
              {invoices.map(inv => (
                <li key={inv.id}>
                  <Link href={`/invoices/${inv.id}`} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{inv.number}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{inv.due_date ? `Due ${formatDate(inv.due_date)}` : formatDate(inv.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(inv.status)}`}>{inv.status}</span>
                      <span className="text-sm font-semibold text-slate-900">{formatCurrency(inv.total)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'New Quote', href: '/quotes/new', icon: '📝' },
          { label: 'Add Client', href: '/clients', icon: '👤' },
          { label: 'View Invoices', href: '/invoices', icon: '📄' },
          { label: 'Settings', href: '/settings', icon: '⚙️' },
        ].map(a => (
          <Link
            key={a.href}
            href={a.href}
            className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-5 hover:bg-gray-50 hover:border-gray-300 transition-colors text-center"
          >
            <span className="text-2xl">{a.icon}</span>
            <span className="text-sm font-medium text-slate-700">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value, color, icon }: { label: string; value: string; color: 'green' | 'amber' | 'blue'; icon: string }) {
  const colors = {
    green: 'bg-green-50 border-green-100',
    amber: 'bg-amber-50 border-amber-100',
    blue: 'bg-blue-50 border-blue-100',
  }
  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{icon}</span>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

function EmptyState({ message, action, hint }: { message: string; action?: { label: string; href: string }; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <p className="text-gray-400 text-sm">{message}</p>
      {hint && <p className="text-gray-400 text-xs mt-1">{hint}</p>}
      {action && (
        <Link href={action.href} className="mt-3 text-blue-600 text-sm font-medium hover:underline">
          {action.label}
        </Link>
      )}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
