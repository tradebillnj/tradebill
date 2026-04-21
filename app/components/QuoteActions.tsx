'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Quote } from '@/lib/supabase/types'
import { updateQuoteStatus, deleteQuote } from '@/app/actions/quotes'
import { convertQuoteToInvoice } from '@/app/actions/invoices'

export default function QuoteActions({ quote }: { quote: Quote }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleStatus(status: string) {
    setLoading(true)
    await updateQuoteStatus(quote.id, status)
    setLoading(false)
  }

  async function handleConvert() {
    setLoading(true)
    const invoiceId = await convertQuoteToInvoice(quote.id)
    setLoading(false)
    if (invoiceId) router.push(`/invoices/${invoiceId}`)
  }

  async function handleDelete() {
    if (!confirm('Delete this quote? This cannot be undone.')) return
    setLoading(true)
    await deleteQuote(quote.id)
  }

  async function handlePrint() {
    window.print()
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {quote.status === 'draft' && (
        <button
          onClick={() => handleStatus('sent')}
          disabled={loading}
          className="rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          Mark as Sent
        </button>
      )}
      {quote.status === 'sent' && (
        <>
          <button
            onClick={() => handleStatus('accepted')}
            disabled={loading}
            className="rounded-xl bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors"
          >
            Mark Accepted
          </button>
          <button
            onClick={() => handleStatus('declined')}
            disabled={loading}
            className="rounded-xl border border-red-300 text-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-50 disabled:opacity-60 transition-colors"
          >
            Mark Declined
          </button>
        </>
      )}
      {quote.status === 'accepted' && (
        <button
          onClick={handleConvert}
          disabled={loading}
          className="rounded-xl bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors"
        >
          {loading ? 'Converting…' : 'Convert to Invoice'}
        </button>
      )}
      <button
        onClick={handlePrint}
        className="rounded-xl border border-gray-300 text-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        Print / PDF
      </button>
      {(quote.status === 'draft') && (
        <button
          onClick={() => router.push(`/quotes/${quote.id}/edit`)}
          className="rounded-xl border border-gray-300 text-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Edit
        </button>
      )}
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
