'use client'

import { useState } from 'react'
import type { Invoice } from '@/lib/supabase/types'
import { updateInvoiceStatus, deleteInvoice } from '@/app/actions/invoices'

export default function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const [loading, setLoading] = useState(false)

  async function handleStatus(status: string) {
    setLoading(true)
    await updateInvoiceStatus(invoice.id, status)
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this invoice? This cannot be undone.')) return
    setLoading(true)
    await deleteInvoice(invoice.id)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {invoice.status === 'draft' && (
        <button
          onClick={() => handleStatus('sent')}
          disabled={loading}
          className="rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          Mark as Sent
        </button>
      )}
      {(invoice.status === 'sent' || invoice.status === 'overdue') && (
        <button
          onClick={() => handleStatus('paid')}
          disabled={loading}
          className="rounded-xl bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors"
        >
          Mark as Paid
        </button>
      )}
      {invoice.status === 'sent' && (
        <button
          onClick={() => handleStatus('overdue')}
          disabled={loading}
          className="rounded-xl border border-orange-300 text-orange-600 px-4 py-2 text-sm font-semibold hover:bg-orange-50 disabled:opacity-60 transition-colors"
        >
          Mark Overdue
        </button>
      )}
      <button
        onClick={() => window.print()}
        className="rounded-xl border border-gray-300 text-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        Print / PDF
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded-xl border border-red-200 text-red-500 px-4 py-2 text-sm font-medium hover:bg-red-50 disabled:opacity-60 transition-colors"
      >
        Delete
      </button>
    </div>
  )
}
