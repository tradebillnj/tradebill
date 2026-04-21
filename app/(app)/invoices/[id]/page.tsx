import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, statusBadge } from '@/lib/utils'
import InvoiceActions from '@/app/components/InvoiceActions'
import PrintableInvoice from '@/app/components/PrintableInvoice'
import type { Invoice, Client, Profile } from '@/lib/supabase/types'

type InvoiceWithClient = Invoice & { clients: Partial<Client> | null }

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: rawInvoice } = await supabase
    .from('invoices')
    .select('*, clients(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  const invoice = rawInvoice as InvoiceWithClient | null
  if (!invoice) return notFound()

  const { data: rawProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const profile = rawProfile as Profile | null

  const client = invoice.clients

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/invoices" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{invoice.number}</h1>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge(invoice.status)}`}>{invoice.status}</span>
            </div>
            <p className="text-gray-400 text-sm mt-0.5">
              Due {invoice.due_date ? formatDate(invoice.due_date) : '—'}
              {invoice.paid_at && ` · Paid ${formatDate(invoice.paid_at)}`}
            </p>
          </div>
        </div>
        <InvoiceActions invoice={invoice} />
      </div>

      <PrintableInvoice invoice={invoice} client={client} profile={profile} />
    </div>
  )
}
