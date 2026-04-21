'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { generateNumber } from '@/lib/utils'

export async function convertQuoteToInvoice(quoteId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: quote } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quoteId)
    .eq('user_id', user.id)
    .single()

  if (!quote) return null

  const { count } = await supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
  const number = generateNumber('INV', count ?? 0)

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 30)

  const { data, error } = await supabase.from('invoices').insert({
    user_id: user.id,
    client_id: quote.client_id,
    quote_id: quoteId,
    number,
    status: 'draft',
    line_items: quote.line_items,
    notes: quote.notes,
    due_date: dueDate.toISOString().split('T')[0],
    subtotal: quote.subtotal,
    tax_rate: quote.tax_rate,
    tax_amount: quote.tax_amount,
    total: quote.total,
  }).select().single()

  if (error) return null

  revalidatePath('/invoices')
  revalidatePath(`/quotes/${quoteId}`)
  return data.id
}

export async function updateInvoiceStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: any = { status, updated_at: new Date().toISOString() }
  if (status === 'paid') updates.paid_at = new Date().toISOString()

  await supabase.from('invoices').update(updates).eq('id', id).eq('user_id', user.id)

  revalidatePath(`/invoices/${id}`)
  revalidatePath('/invoices')
  revalidatePath('/dashboard')
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('invoices').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/invoices')
  redirect('/invoices')
}
