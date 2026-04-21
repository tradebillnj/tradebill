'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(_prevState: { error: string; success: boolean }, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name: formData.get('full_name')?.toString().trim() || null,
    business_name: formData.get('business_name')?.toString().trim() || null,
    phone: formData.get('phone')?.toString().trim() || null,
    email: formData.get('email')?.toString().trim() || null,
    address: formData.get('address')?.toString().trim() || null,
    city: formData.get('city')?.toString().trim() || null,
    state: formData.get('state')?.toString().trim() || null,
    zip: formData.get('zip')?.toString().trim() || null,
  })

  if (error) return { error: error.message, success: false }

  revalidatePath('/settings')
  revalidatePath('/dashboard')
  return { error: '', success: true }
}
