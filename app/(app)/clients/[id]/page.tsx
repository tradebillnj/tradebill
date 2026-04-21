import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, statusBadge } from '@/lib/utils'
import DeleteClientButton from '@/app/components/DeleteClientButton'
import type { Client, Quote, Invoice } from '@/lib/supabase/types'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: rawClient } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  const clientData = rawClient as Client | null
  if (!clientData) return notFound()

  const [quotesRes, invoicesRes] = await Promise.all([
    supabase.from('quotes').select('*').eq('client_id', id).eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('invoices').select('*').eq('client_id', id).eq('user_id', user.id).order('created_at', { ascending: false }),
  ])
  const quotes = quotesRes.data as Quote[] | null
  const invoices = invoicesRes.data as Invoice[] | null

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/clients" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-xl">
              {clientData.name[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{clientData.name}</h1>
              {clientData.city && (
                <p className="text-gray-400 text-sm">{[clientData.city, clientData.state].filter(Boolean).join(', ')}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/clients/${id}/edit`}
            className="rounded-xl border border-gray-300 text-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>
          <DeleteClientButton id={id} />
        </div>
      </div>

      {/* Client info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Contact Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {clientData.email && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Email</p>
              <p className="text-sm text-slate-900">{clientData.email}</p>
            </div>
          )}
          {clientData.phone && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Phone</p>
              <p className="text-sm text-slate-900">{clientData.phone}</p>
            </div>
          )}
          {clientData.address && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Address</p>
              <p className="text-sm text-slate-900">{clientData.address}</p>
              {clientData.city && (
                <p className="text-sm text-slate-900">{[clientData.city, clientData.state, clientData.zip].filter(Boolean).join(', ')}</p>
              )}
            </div>
          )}
          {clientData.notes && (
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-400 mb-1">Notes</p>
              <p className="text-sm text-slate-900 whitespace-pre-wrap">{clientData.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quotes */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-slate-900">Quotes</h2>
          <Link href={`/quotes/new`} className="text-blue-600 text-sm font-medium hover:underline">New quote</Link>
        </div>
        {!quotes?.length ? (
          <p className="text-gray-400 text-sm text-center py-8">No quotes for this client</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {quotes.map(q => (
              <li key={q.id}>
                <Link href={`/quotes/${q.id}`} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{q.number}</p>
                    <p className="text-xs text-gray-400">{formatDate(q.created_at)}</p>
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

      {/* Invoices */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-slate-900">Invoices</h2>
        </div>
        {!invoices?.length ? (
          <p className="text-gray-400 text-sm text-center py-8">No invoices for this client</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {invoices.map(inv => (
              <li key={inv.id}>
                <Link href={`/invoices/${inv.id}`} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{inv.number}</p>
                    <p className="text-xs text-gray-400">{inv.due_date ? `Due ${formatDate(inv.due_date)}` : formatDate(inv.created_at)}</p>
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
  )
}
