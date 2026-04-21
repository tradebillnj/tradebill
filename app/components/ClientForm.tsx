'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import type { Client } from '@/lib/supabase/types'
import { createClientAction, updateClientAction } from '@/app/actions/clients'

export default function ClientForm({ client }: { client?: Client }) {
  const isEditing = !!client
  const action = isEditing ? updateClientAction : createClientAction
  const [state, formAction, pending] = useActionState(action, { error: '' })
  const router = useRouter()

  return (
    <form action={formAction} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={client.id} />}

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Client Information</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Name <span className="text-red-400">*</span></label>
          <input
            name="name"
            type="text"
            required
            defaultValue={client?.name ?? ''}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Smith"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={client?.email ?? ''}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input
              name="phone"
              type="tel"
              defaultValue={client?.phone ?? ''}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(555) 555-5555"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
          <input
            name="address"
            type="text"
            defaultValue={client?.address ?? ''}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123 Main St"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
            <input
              name="city"
              type="text"
              defaultValue={client?.city ?? ''}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Springfield"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
            <input
              name="state"
              type="text"
              maxLength={2}
              defaultValue={client?.state ?? ''}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              placeholder="NJ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP</label>
            <input
              name="zip"
              type="text"
              defaultValue={client?.zip ?? ''}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="07001"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
          <textarea
            name="notes"
            rows={3}
            defaultValue={client?.notes ?? ''}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Any notes about this client…"
          />
        </div>
      </div>

      {state.error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{state.error}</p>
      )}

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
          className="rounded-xl bg-blue-600 text-white px-8 py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {pending ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Client'}
        </button>
      </div>
    </form>
  )
}
