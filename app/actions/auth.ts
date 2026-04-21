'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(_prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email')?.toString().trim().toLowerCase() ?? ''
  const password = formData.get('password')?.toString() ?? ''

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(_prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email')?.toString().trim().toLowerCase() ?? ''
  const password = formData.get('password')?.toString() ?? ''
  const fullName = formData.get('full_name')?.toString().trim() ?? ''
  const businessName = formData.get('business_name')?.toString().trim() ?? ''

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, business_name: businessName } },
  })

  if (error) return { error: error.message }

  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email,
      full_name: fullName || null,
      business_name: businessName || null,
      subscription_status: 'trial',
    })
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
