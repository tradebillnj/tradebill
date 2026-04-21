import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/app/components/SettingsForm'
import type { Profile } from '@/lib/supabase/types'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: rawProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const profile = rawProfile as Profile | null

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Your business info appears on every quote and invoice</p>
      </div>

      <SettingsForm profile={profile} userEmail={user.email ?? ''} />

      {/* Billing section */}
      <div id="billing" className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-1">Subscription</h2>
        <p className="text-sm text-gray-400 mb-4">
          Status: <span className="font-medium text-slate-700 capitalize">{profile?.subscription_status ?? 'trial'}</span>
        </p>
        {profile?.subscription_status !== 'active' && (
          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-5">
            <p className="font-semibold text-slate-900 mb-1">Upgrade to TradeBill Pro</p>
            <p className="text-sm text-gray-500 mb-4">$29/month — unlimited quotes, invoices, and clients. Cancel anytime.</p>
            <a
              href={process.env.NEXT_PUBLIC_STRIPE_BILLING_LINK ?? '#'}
              className="inline-block rounded-xl bg-blue-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Subscribe — $29/month
            </a>
          </div>
        )}
        {profile?.subscription_status === 'active' && (
          <a
            href={process.env.NEXT_PUBLIC_STRIPE_PORTAL_LINK ?? '#'}
            className="inline-block rounded-xl border border-gray-300 text-gray-600 px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Manage billing
          </a>
        )}
      </div>
    </div>
  )
}
