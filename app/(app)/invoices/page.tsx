import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, statusBadge } from '@/lib/utils'
import type { Invoice } from '@/lib/supabase/types'

type InvoiceWithClientName = Invoice & { clients: { name: string } | null }

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: rawInvoices } = await supabase
    .from('invoices')
    .select('*, clients(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  const invoices = rawInvoices as InvoiceWithClientName[] | null

  const totalPaid = invoices?.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0) ?? 0
  const totalOutstanding = invoices?.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.total, 0) ?? 0

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-gray-500 text-sm mt-0.5">{invoices?.length ?? 0} total</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <p className="text-sm text-gray-500 mb-1">Paid</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <p className="text-sm text-gray-500 mb-1">Outstanding</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalOutstanding)}</p>
        </div>
      </div>

      {!invoices || invoices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">📄</div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No invoices yet</h2>
          <p className="text-gray-400 text-sm">Create a quote first, then convert it to an invoice when accepted</p>
          <Link href="/quotes/new" className="mt-6 rounded-xl bg-blue-600 text-white px-6 py-3 text-sm font-semibold hover:bg-blue-700 transition-colors">
            Create a quote
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">Invoice #</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">Client</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">Due Date</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">Status</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/invoices/${inv.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                        {inv.number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {(inv.clients as { name: string } | null)?.name ?? <span className="text-gray-300 italic">No client</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {inv.due_date ? formatDate(inv.due_date) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(inv.status)}`}>{inv.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">{formatCurrency(inv.total)}</td>
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
