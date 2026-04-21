'use client'

import type { Invoice, Client, Profile } from '@/lib/supabase/types'
import { formatCurrency, formatDate } from '@/lib/utils'

type Props = {
  invoice: Invoice
  client: Partial<Client> | null
  profile: Profile | null
}

export default function PrintableInvoice({ invoice, client, profile }: Props) {
  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 p-8 print:rounded-none print:border-none">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center print:hidden">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900">{profile?.business_name || 'Your Business'}</span>
            </div>
            {profile?.address && <p className="text-sm text-gray-500">{profile.address}</p>}
            {profile?.city && (
              <p className="text-sm text-gray-500">
                {[profile.city, profile.state, profile.zip].filter(Boolean).join(', ')}
              </p>
            )}
            {profile?.phone && <p className="text-sm text-gray-500">{profile.phone}</p>}
            {profile?.email && <p className="text-sm text-gray-500">{profile.email}</p>}
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-wide mb-2">Invoice</h2>
            <p className="text-sm font-semibold text-gray-600">{invoice.number}</p>
            <p className="text-sm text-gray-400">Date: {formatDate(invoice.created_at)}</p>
            {invoice.due_date && (
              <p className="text-sm text-gray-400">Due: {formatDate(invoice.due_date)}</p>
            )}
            {invoice.status === 'paid' && invoice.paid_at && (
              <p className="text-sm font-semibold text-green-600 mt-1">✓ Paid {formatDate(invoice.paid_at)}</p>
            )}
          </div>
        </div>

        {/* Bill to */}
        {client && (
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Bill To</p>
            <p className="font-semibold text-slate-900">{client.name}</p>
            {client.email && <p className="text-sm text-gray-500">{client.email}</p>}
            {client.phone && <p className="text-sm text-gray-500">{client.phone}</p>}
            {client.address && <p className="text-sm text-gray-500">{client.address}</p>}
            {client.city && (
              <p className="text-sm text-gray-500">
                {[client.city, client.state, client.zip].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        )}

        {/* Line items */}
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-4">Description</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 px-4 w-20">Qty</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 px-4 w-28">Rate</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 w-28">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.line_items.map((item, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 pr-4 text-sm text-gray-800">{item.description || '—'}</td>
                <td className="py-3 px-4 text-sm text-gray-600 text-right">{item.quantity}</td>
                <td className="py-3 px-4 text-sm text-gray-600 text-right">{formatCurrency(item.rate)}</td>
                <td className="py-3 text-sm font-medium text-slate-900 text-right">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.tax_rate > 0 && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax ({invoice.tax_rate}%)</span>
                <span>{formatCurrency(invoice.tax_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-slate-900 border-t-2 border-slate-900 pt-2">
              <span>Total</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t border-gray-100 pt-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Notes / Terms</p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        {/* Payment footer */}
        {invoice.status !== 'paid' && (
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-700 font-medium">
              Please make payment by {invoice.due_date ? formatDate(invoice.due_date) : '30 days'}.
              Thank you for your business!
            </p>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          .no-print, nav, header, aside { display: none !important; }
          body { background: white; }
        }
      `}</style>
    </>
  )
}
