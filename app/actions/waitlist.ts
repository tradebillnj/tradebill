'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type WaitlistState = { success: boolean; error?: string }

export async function joinWaitlist(
  _prevState: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const email = formData.get('email')?.toString().trim().toLowerCase()

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  try {
    await resend.emails.send({
      from: 'TradeBill Waitlist <waitlist@tradebill.io>',
      to: process.env.OWNER_EMAIL!,
      subject: `New waitlist signup: ${email}`,
      text: `New signup on TradeBill waitlist:\n\n${email}\n\nDate: ${new Date().toLocaleString()}`,
    })

    return { success: true }
  } catch (err) {
    console.error('Waitlist email failed:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
