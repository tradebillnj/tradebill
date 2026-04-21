'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { LineItem } from '@/lib/supabase/types'
import { generateNumber } from '@/lib/utils'

export async function createQuote(_prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { count } = await supabase.from('quotes').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
  const number = generateNumber('Q', count ?? 0)

  const rawItems = formData.get('line_items')?.toString()
  const lineItems: LineItem[] = rawItems ? JSON.parse(rawItems) : []
  const taxRate = parseFloat(formData.get('tax_rate')?.toString() ?? '0') || 0
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount

  const clientId = formData.get('client_id')?.toString() || null
  const notes = formData.get('notes')?.toString().trim() || null
  const validUntil = formData.get('valid_until')?.toString() || null

  const { data, error } = await supabase.from('quotes').insert({
    user_id: user.id,
    client_id: clientId,
    number,
    status: 'draft',
    line_items: lineItems,
    notes,
    valid_until: validUntil,
    subtotal,
    tax_rate: taxRate,
    tax_amount: taxAmount,
    total,
  }).select().single()

  if (error) return { error: error.message }

  revalidatePath('/quotes')
  redirect(`/quotes/${data.id}`)
}

export async function updateQuote(_prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const id = formData.get('id')?.toString()
  if (!id) return { error: 'Missing quote ID' }

  const rawItems = formData.get('line_items')?.toString()
  const lineItems: LineItem[] = rawItems ? JSON.parse(rawItems) : []
  const taxRate = parseFloat(formData.get('tax_rate')?.toString() ?? '0') || 0
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount

  const { error } = await supabase.from('quotes').update({
    client_id: formData.get('client_id')?.toString() || null,
    line_items: lineItems,
    notes: formData.get('notes')?.toString().trim() || null,
    valid_until: formData.get('valid_until')?.toString() || null,
    tax_rate: taxRate,
    subtotal,
    tax_amount: taxAmount,
    total,
    updated_at: new Date().toISOString(),
  }).eq('id', id).eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath(`/quotes/${id}`)
  redirect(`/quotes/${id}`)
}

export async function updateQuoteStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('quotes').update({ status: status as 'draft' | 'sent' | 'accepted' | 'declined' | 'expired', updated_at: new Date().toISOString() })
    .eq('id', id).eq('user_id', user.id)

  revalidatePath(`/quotes/${id}`)
  revalidatePath('/quotes')
}

export async function deleteQuote(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('quotes').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/quotes')
  redirect('/quotes')
}
