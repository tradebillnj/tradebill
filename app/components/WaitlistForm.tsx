'use client'

import { useActionState } from 'react'
import { joinWaitlist } from '@/app/actions/waitlist'

const initialState = { success: false, error: '' }

export default function WaitlistForm() {
  const [state, action, pending] = useActionState(joinWaitlist, initialState)

  if (state.success) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-white/15 border border-white/30 backdrop-blur-sm px-6 py-4 text-white font-medium">
        <svg className="w-5 h-5 shrink-0 text-green-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        You&apos;re on the list. We&apos;ll reach out when early access opens.
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        name="email"
        required
        placeholder="your@email.com"
        className="flex-1 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent text-base"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-yellow-400 px-6 py-3 text-slate-900 font-bold text-base hover:bg-yellow-300 active:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors whitespace-nowrap shadow-lg"
      >
        {pending ? 'Joining...' : 'Join Waitlist'}
      </button>
      {state.error && (
        <p className="text-yellow-200 text-sm mt-1">{state.error}</p>
      )}
    </form>
  )
}
