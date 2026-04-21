'use client'

import { useActionState, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Client, LineItem, Quote } from '@/lib/supabase/types'
import { formatCurrency } from '@/lib/utils'
import { createQuote, updateQuote } from '@/app/actions/quotes'

type Props = {
  clients: Client[]
  quote?: Quote
}

function newLineItem(): LineItem {
  return { id: crypto.randomUUID(), description: '', quantity: 1, rate: 0, total: 0 }
}

export default function QuoteBuilder({ clients, quote }: Props) {
  const isEditing = !!quote
  const action = isEditing ? updateQuote : createQuote
  const [state, formAction, pending] = useActionState(action, { error: '' })

  const [items, setItems] = useState<LineItem[]>(
    quote?.line_items?.length ? quote.line_items : [newLineItem()]
  )
  const [taxRate, setTaxRate] = useState(quote?.tax_rate ?? 0)

  const subtotal = items.reduce((sum, i) => sum + i.total, 0)
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount

  const updateItem = useCallback((index: number, field: keyof LineItem, value: string | number) => {
    setItems(prev => {
      const next = [...prev]
      const item = { ...next[index], [field]: value }
      if (field === 'quantity' || field === 'rate') {
        item.total = Number(item.quantity) * Number(item.rate)
      }
      next[index] = item
      return next
    })
  }, [])

  const addItem = () => setItems(prev => [...prev, newLineItem()])

  const removeItem = (index: number) => {
    if (items.length === 1) return
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const router = useRouter()

  return (
    <form action={formAction} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={quote.id} />}
      <input type="hidden" name="line_items" value={JSON.stringify(items)} />

      {/* Client + dates */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Quote Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Client</label>
            <select
              name="client_id"
              defaultValue={quote?.client_id ?? ''}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="">— No client —</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Valid Until</label>
            <input
              type="date"
              name="valid_until"
              defaultValue={quote?.valid_until ?? ''}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tax Rate (%)</label>
            <input
              type="number"
              name="tax_rate"
              min="0"
              max="100"
              step="0.1"
              value={taxRate}
              onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Line Items</h2>
        </div>

        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_100px_120px_120px_40px] gap-3 px-6 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Description</span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Qty</span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Rate</span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Total</span>
          <span />
        </div>

        <div className="divide-y divide-gray-100">
          {items.map((item, i) => (
            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[1fr_100px_120px_120px_40px] gap-3 px-6 py-4 items-center">
              <div>
                <label className="sm:hidden text-xs text-gray-400 mb-1 block">Description</label>
                <input
                  type="text"
                  placeholder="Labor, materials, etc."
                  value={item.description}
                  onChange={e => updateItem(i, 'description', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="sm:hidden text-xs text-gray-400 mb-1 block">Qty</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="1"
                  value={item.quantity}
                  onChange={e => updateItem(i, 'quantity', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="sm:hidden text-xs text-gray-400 mb-1 block">Rate ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={item.rate}
                    onChange={e => updateItem(i, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-gray-200 pl-7 pr-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="sm:text-right">
                <label className="sm:hidden text-xs text-gray-400 mb-1 block">Total</label>
                <span className="text-sm font-semibold text-slate-900">{formatCurrency(item.total)}</span>
              </div>
              <div className="flex sm:justify-center">
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  disabled={items.length === 1}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Remove line"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add line item
          </button>

          {/* Totals */}
          <div className="text-right space-y-1.5 min-w-[200px]">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax ({taxRate}%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-slate-900 border-t border-gray-200 pt-1.5">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Notes / Terms</label>
        <textarea
          name="notes"
          defaultValue={quote?.notes ?? ''}
          rows={3}
          placeholder="Payment terms, warranty info, special conditions…"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {state.error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{state.error}</p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-blue-600 text-white px-8 py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {pending ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Quote'}
        </button>
      </div>
    </form>
  )
}
