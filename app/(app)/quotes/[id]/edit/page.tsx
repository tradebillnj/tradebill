import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import QuoteBuilder from '@/app/components/QuoteBuilder'
import type { Quote, Client } from '@/lib/supabase/types'

export default async function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [quotesRes, clientsRes] = await Promise.all([
    supabase.from('quotes').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('clients').select('*').eq('user_id', user.id).order('name'),
  ])
  const quote = quotesRes.data as Quote | null
  const clients = clientsRes.data as Client[] | null

  if (!quote) return notFound()
  if (quote.status !== 'draft') {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Only draft quotes can be edited.</p>
        <Link href={`/quotes/${id}`} className="mt-4 inline-block text-blue-600 hover:underline text-sm">← Back to quote</Link>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href={`/quotes/${id}`} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit {quote.number}</h1>
      </div>
      <QuoteBuilder clients={clients ?? []} quote={quote} />
    </div>
  )
}
