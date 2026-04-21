import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import QuoteBuilder from '@/app/components/QuoteBuilder'
import type { Client } from '@/lib/supabase/types'

export default async function NewQuotePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: rawClients } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('name')
  const clients = rawClients as Client[] | null

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/quotes" className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">New Quote</h1>
      </div>
      <QuoteBuilder clients={clients ?? []} />
    </div>
  )
}
