import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, statusBadge } from '@/lib/utils'
import type { Quote } from '@/lib/supabase/types'

type QuoteWithClientName = Quote & { clients: { name: string } | null }

export default async function QuotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: rawQuotes } = await supabase
    .from('quotes')
    .select('*, clients(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  const quotes = rawQuotes as QuoteWithClientName[] | null

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quotes</h1>
          <p className="text-gray-500 text-sm mt-0.5">{quotes?.length ?? 0} total</p>
        </div>
        <Link
          href="/quotes/new"
          className="flex items-center gap-2 rounded-xl bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Quote
        </Link>
      </div>

      {!quotes || quotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No quotes yet</h2>
          <p className="text-gray-400 text-sm mb-6">Create your first quote to start getting paid faster</p>
          <Link href="/quotes/new" className="rounded-xl bg-blue-600 text-white px-6 py-3 text-sm font-semibold hover:bg-blue-700 transition-colors">
            Create your first quote
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">Quote #</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">Client</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">Date</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">Status</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quotes.map(q => (
                  <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/quotes/${q.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                        {q.number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {(q.clients as { name: string } | null)?.name ?? <span className="text-gray-300 italic">No client</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(q.created_at)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(q.status)}`}>{q.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">{formatCurrency(q.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
