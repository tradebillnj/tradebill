'use client'

import { useActionState } from 'react'
import type { Profile } from '@/lib/supabase/types'
import { updateProfile } from '@/app/actions/settings'

export default function SettingsForm({ profile, userEmail }: { profile: Profile | null; userEmail: string }) {
  const [state, action, pending] = useActionState(updateProfile, { error: '', success: false })

  return (
    <form action={action} className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Business Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your name</label>
            <input
              name="full_name"
              type="text"
              defaultValue={profile?.full_name ?? ''}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Business name</label>
            <input
              name="business_name"
              type="text"
              defaultValue={profile?.business_name ?? ''}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Smith Plumbing LLC"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Business email</label>
            <input
              name="email"
              type="email"
              defaultValue={profile?.email ?? userEmail}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input
              name="phone"
              type="tel"
              defaultValue={profile?.phone ?? ''}
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
            defaultValue={profile?.address ?? ''}
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
              defaultValue={profile?.city ?? ''}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
            <input
              name="state"
              type="text"
              maxLength={2}
              defaultValue={profile?.state ?? ''}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              placeholder="NJ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP</label>
            <input
              name="zip"
              type="text"
              defaultValue={profile?.zip ?? ''}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {state.error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{state.error}</p>
      )}
      {state.success && (
        <p className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-xl px-4 py-3">Profile saved successfully.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-blue-600 text-white px-8 py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
      >
        {pending ? 'Saving…' : 'Save Profile'}
      </button>
    </form>
  )
}
