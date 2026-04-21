'use client'

import { useState } from 'react'
import { deleteClientAction } from '@/app/actions/clients'

export default function DeleteClientButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this client? Their quotes and invoices will remain.')) return
    setLoading(true)
    await deleteClientAction(id)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-xl border border-red-200 text-red-500 px-4 py-2 text-sm font-medium hover:bg-red-50 disabled:opacity-60 transition-colors"
    >
      Delete
    </button>
  )
}
