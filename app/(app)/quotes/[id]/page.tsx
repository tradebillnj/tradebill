import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, statusBadge } from '@/lib/utils'
import QuoteActions from '@/app/components/QuoteActions'
import PrintableQuote from '@/app/components/PrintableQuote'
import type { Quote, Client, Profile } from '@/lib/supabase/types'

type QuoteWithClient = Quote & { clients: Partial<Client> | null }

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: rawQuote } = await supabase
    .from('quotes')
    .select('*, clients(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  const quote = rawQuote as QuoteWithClient | null
  if (!quote) return notFound()

  const { data: rawProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const profile = rawProfile as Profile | null

  const client = quote.clients

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/quotes" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{quote.number}</h1>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(quote.status)}`}>{quote.status}</span>
            </div>
            <p className="text-gray-400 text-sm mt-0.5">{formatDate(quote.created_at)}</p>
          </div>
        </div>
        <QuoteActions quote={quote} />
      </div>

      {/* Print view */}
      <PrintableQuote quote={quote} client={client} profile={profile} />
    </div>
  )
}
