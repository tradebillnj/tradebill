'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createClientAction(_prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const name = formData.get('name')?.toString().trim()
  if (!name) return { error: 'Client name is required' }

  const { data, error } = await supabase.from('clients').insert({
    user_id: user.id,
    name,
    email: formData.get('email')?.toString().trim() || null,
    phone: formData.get('phone')?.toString().trim() || null,
    address: formData.get('address')?.toString().trim() || null,
    city: formData.get('city')?.toString().trim() || null,
    state: formData.get('state')?.toString().trim() || null,
    zip: formData.get('zip')?.toString().trim() || null,
    notes: formData.get('notes')?.toString().trim() || null,
  }).select().single()

  if (error) return { error: error.message }

  revalidatePath('/clients')
  redirect(`/clients/${data.id}`)
}

export async function updateClientAction(_prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const id = formData.get('id')?.toString()
  if (!id) return { error: 'Missing client ID' }

  const name = formData.get('name')?.toString().trim()
  if (!name) return { error: 'Client name is required' }

  const { error } = await supabase.from('clients').update({
    name,
    email: formData.get('email')?.toString().trim() || null,
    phone: formData.get('phone')?.toString().trim() || null,
    address: formData.get('address')?.toString().trim() || null,
    city: formData.get('city')?.toString().trim() || null,
    state: formData.get('state')?.toString().trim() || null,
    zip: formData.get('zip')?.toString().trim() || null,
    notes: formData.get('notes')?.toString().trim() || null,
  }).eq('id', id).eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath(`/clients/${id}`)
  revalidatePath('/clients')
  redirect(`/clients/${id}`)
}

export async function deleteClientAction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('clients').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/clients')
  redirect('/clients')
}
