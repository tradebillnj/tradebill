# TradeBill — Launch Checklist

You're back! Here's everything that was built while you were gone and exactly what to do next to get live and get your first paying customer.

---

## What Was Built

- **Landing page** with waitlist (already done)
- **Full SaaS app:**
  - Signup / Login (email + password)
  - Dashboard with revenue stats
  - **Quote builder** — add line items, tax, attach clients, print to PDF
  - **Invoice system** — convert accepted quotes, track paid/unpaid
  - **Client management** — add clients with full contact info
  - **Settings** — your business profile (appears on every quote/invoice)
  - **Stripe subscription** — $29/month billing, 14-day free trial
- Build is **clean and production-ready**

---

## Step 1: Create a Supabase Account (free)

1. Go to **supabase.com** → Create a free account
2. Create a new project (pick a region close to your customers — US East if NJ)
3. Wait ~2 min for it to spin up
4. Go to **Settings → API**:
   - Copy **Project URL** → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon public** key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → click **Run**

That creates all your database tables with the right security rules.

---

## Step 2: Create a Resend Account (free)

1. Go to **resend.com** → Create a free account
2. Go to **API Keys** → Create new key → copy it
3. This is your `RESEND_API_KEY`

Note: To send from `waitlist@tradebill.io` you need to verify the domain. For now you can use `onboarding@resend.dev` as the "from" address to test (update `app/actions/waitlist.ts` line 12).

---

## Step 3: Create a Stripe Account

1. Go to **dashboard.stripe.com** → Sign up
2. Complete account setup (business info, bank account for payouts)
3. Go to **Developers → API Keys**:
   - Copy **Secret key** → `STRIPE_SECRET_KEY`
4. **Create your product:**
   - Go to **Products → Add product**
   - Name: "TradeBill Pro"
   - Price: $29.00/month, recurring
5. **Create a Payment Link:**
   - Go to **Payment Links → New**
   - Select TradeBill Pro product
   - Copy the link → `NEXT_PUBLIC_STRIPE_BILLING_LINK`
6. **Enable Customer Portal:**
   - Go to **Billing → Customer portal → Activate**
   - Copy the portal link → `NEXT_PUBLIC_STRIPE_PORTAL_LINK`

---

## Step 4: Add Your Environment Variables

Open `/Users/Saibot/tradebill/.env.local` and fill in every value:

```
RESEND_API_KEY=re_xxxx
OWNER_EMAIL=tradebillnj@gmail.com
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhxx...
STRIPE_SECRET_KEY=sk_live_xx...
STRIPE_WEBHOOK_SECRET=whsec_xx...     (get this in Step 6)
NEXT_PUBLIC_STRIPE_BILLING_LINK=https://buy.stripe.com/xx
NEXT_PUBLIC_STRIPE_PORTAL_LINK=https://billing.stripe.com/p/xx
```

---

## Step 5: Push to GitHub + Deploy to Vercel

**GitHub:**
1. Go to **github.com** → Create a new repository named `tradebill` → keep it private
2. In Terminal, run:
```bash
cd /Users/Saibot/tradebill
git remote add origin https://github.com/YOUR_USERNAME/tradebill.git
git push -u origin main
```

**Vercel:**
1. Go to **vercel.com** → Sign up (use your GitHub account)
2. Click **Add New Project** → import `tradebill` from GitHub
3. Add all environment variables (same as your `.env.local`)
4. Click **Deploy** — takes ~90 seconds
5. Copy your Vercel URL (e.g., `tradebill.vercel.app`)

---

## Step 6: Set Up Stripe Webhook

After deploying to Vercel:
1. Go to **Stripe → Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the **Signing secret** → add as `STRIPE_WEBHOOK_SECRET` in Vercel env vars
5. Redeploy (Vercel → your project → Redeploy)

---

## Step 7: Add Your Custom Domain (tradebill.io)

1. Buy `tradebill.io` on Namecheap, GoDaddy, or Google Domains (~$15/yr)
2. In Vercel → your project → **Settings → Domains** → add `tradebill.io`
3. Update your DNS records as Vercel instructs (takes up to 48h to propagate)
4. Update `app/actions/waitlist.ts` — change `from` to `waitlist@tradebill.io` once DNS is verified in Resend

---

## Step 8: Get Your First 10 Customers

You have a 14-day free trial set up. Here's the fastest path to cash:

**This week:**
1. Sign yourself up at your live URL — fill in your profile (C&S Handyman info)
2. Create a test quote for a fake client — make sure print/PDF works
3. Post in **r/Contractors** and **r/handyman** — "I built a dead-simple quoting app for 1-5 person shops, 14-day free trial, $29/mo after — would love beta feedback"
4. Message 10-20 contractors you know personally — direct ask
5. Post in any local contractor Facebook groups in NJ

**Your pitch:** *"Send professional quotes in 2 minutes instead of 20. No spreadsheets, no invoicing apps with 200 features you'll never use. Just quotes, invoices, and get paid."*

---

## Monthly Revenue Math

| Customers | MRR |
|-----------|-----|
| 10 | $290 |
| 35 | $1,015 |
| 100 | $2,900 |
| 345 | $10,005 |

35 contractors = $1K/month. That's your Phase 1 target.

---

## What's Already Built vs. What's Next

**Built and ready:**
- Landing page + waitlist
- Auth (signup/login)
- Quote builder with line items + tax
- Invoice system (convert from quote, mark paid)
- Print/PDF (browser print)
- Client management
- Settings (your business info on every doc)
- Stripe subscriptions + webhook
- 14-day free trial logic

**Future features (build when customers ask):**
- Email quotes/invoices directly to clients (Resend)
- Client-facing public quote acceptance link
- Job photos/attachments
- Quickbooks/Stripe payment links embedded in invoices
- Team members / employee access

Don't build any of these until 3+ customers ask for the same thing.
