import WaitlistForm from '@/app/components/WaitlistForm'
import Image from 'next/image'

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Quote in minutes',
    description: 'Build professional quotes with labor and materials line items. Send a PDF to clients in seconds — no more copy-pasting from spreadsheets.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'One-click invoicing',
    description: 'Approved quote becomes an invoice instantly. No re-entering data, no reformatting. Just click and send.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: 'Get paid online',
    description: 'Clients pay directly from the invoice — card or bank transfer. No more chasing checks or waiting for cash.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: 'Track every job',
    description: 'See every job at a glance — quoted, approved, in progress, or paid. Know exactly where your money is at all times.',
  },
]

const painPoints = [
  'Writing quotes from scratch every time',
  'Manually converting quotes into invoices',
  'Chasing clients for payment',
  'Losing track of which jobs are paid',
  'Looking unprofessional with messy paperwork',
]

const stats = [
  { value: '2 min', label: 'Average quote time' },
  { value: '$29', label: 'Per month, all-in' },
  { value: '$0', label: 'Setup fees' },
  { value: '∞', label: 'Quotes & invoices' },
]

const heroBg = {
  background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
}

const darkBg = {
  background: 'linear-gradient(135deg, #0f0c29 0%, #1a1744 60%, #24243e 100%)',
}

function TradeBillLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="40" height="40" rx="10" fill="url(#logo-grad)" />
      <path d="M12 10h16M12 10v20M28 10v20" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 15h8M16 20h8M16 25h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="30" r="7" fill="#22c55e" />
      <path d="M27 30l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TradeBillLogo className="w-9 h-9" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">TradeBill</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#founder" className="hover:text-slate-900 transition-colors">About</a>
          </nav>
          <a href="#waitlist" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm">
            Join Waitlist
          </a>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden px-6 py-24 sm:py-36 text-center"
          style={heroBg}
        >
          {/* Decorative glows — sit above bg, below content */}
          <div
            className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
          />
          {/* Dot grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-blue-200 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Built by a contractor, for contractors · NJ
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6 text-center">
              <span className="block">Quote fast.</span>
              <span
                className="block"
                style={{ background: 'linear-gradient(90deg, #fde047, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                Invoice instantly.
              </span>
              <span className="block">Get paid.</span>
            </h1>

            <p className="text-xl text-blue-200 leading-relaxed mb-10 max-w-2xl text-center">
              The simplest quoting and invoicing tool built for 1–5 person contractor shops.
              No bloat. No $300/month price tags. Just the tools you actually need.
            </p>

            <div className="w-full flex justify-center mb-5" id="waitlist">
              <WaitlistForm />
            </div>
            <p className="text-sm text-blue-300/70">
              Early access launching soon · $29/month · Cancel anytime
            </p>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section style={{ background: '#0f172a' }} className="border-b border-white/5">
          <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                <div className="text-sm text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pain points ── */}
        <section style={{ background: '#0f172a' }} className="py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              If you&apos;re running a small contractor shop, you know the pain
            </h2>
            <p className="text-slate-400 mb-10">Every hour spent on paperwork is an hour you&apos;re not billing.</p>
            <ul className="space-y-3 text-left max-w-xl mx-auto">
              {painPoints.map((point) => (
                <li key={point} className="flex items-center gap-3 rounded-xl px-5 py-3 text-slate-300" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Features</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-3 mb-4">
                Everything you need.{' '}
                <span style={{ background: 'linear-gradient(90deg, #2563eb, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Nothing you don&apos;t.
                </span>
              </h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">
                TradeBill handles the paperwork so you can focus on the work.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <div key={f.title} className="rounded-2xl border border-slate-100 p-8 hover:shadow-xl hover:border-blue-100 transition-all duration-300" style={{ background: '#f8fafc' }}>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-md text-white"
                    style={{ background: i % 2 === 0 ? 'linear-gradient(135deg, #3b82f6, #4f46e5)' : 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Founder ── */}
        <section id="founder" className="relative overflow-hidden py-24 px-6" style={darkBg}>
          {/* Glow */}
          <div
            className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />

          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-sm font-semibold text-blue-400 uppercase tracking-widest">The founder</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
                Built by someone who&apos;s been there
              </h2>
            </div>

            <div
              className="flex flex-col sm:flex-row items-center gap-12 rounded-3xl p-10"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
            >
              {/* Photo */}
              <div className="shrink-0 relative">
                <div className="w-44 h-44 rounded-full overflow-hidden shadow-2xl" style={{ boxShadow: '0 0 0 4px rgba(255,255,255,0.2), 0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                  <Image
                    src="/scott-balcom.jpeg"
                    alt="Scott Balcom — Founder of TradeBill"
                    width={176}
                    height={176}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  Founder
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">Scott Balcom</h3>
                <p className="text-blue-300 font-medium mb-5">Owner, C&S Handyman Service LLC · New Jersey</p>
                <blockquote className="pl-5 mb-5" style={{ borderLeft: '4px solid #3b82f6' }}>
                  <p className="text-slate-200 text-lg leading-relaxed italic">
                    &ldquo;I was running jobs all day, then spending my evenings wrestling with spreadsheets just to send a quote.
                    ServiceTitan was $300 a month and built for companies 10x my size. So I built the tool I actually needed.&rdquo;
                  </p>
                </blockquote>
                <p className="text-slate-400 leading-relaxed">
                  Scott brings a background in corporate finance and an MBA in Data Analytics — paired with real-world
                  experience running a commercial and residential contracting business. TradeBill is the product that
                  bridges both worlds: professional-grade software at a price that makes sense for small shops.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="py-24 px-6 bg-slate-50">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-4">Simple, honest pricing</h2>
            <p className="text-slate-500 mb-10">One plan. Everything included. No surprises.</p>

            <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: 'linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)' }} />
              <div className="flex items-end justify-center gap-1 mb-1">
                <span className="text-6xl font-black text-slate-900">$29</span>
                <span className="text-slate-500 mb-2 text-lg">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-8">per account · cancel anytime</p>
              <ul className="space-y-3 text-left mb-8">
                {[
                  'Unlimited quotes & invoices',
                  'Client management',
                  'Online payment collection',
                  'Job tracking dashboard',
                  'Professional PDF documents',
                  'Email delivery to clients',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                className="block w-full rounded-2xl py-4 text-center text-white font-bold text-lg transition-all shadow-lg"
                style={{ background: 'linear-gradient(90deg, #2563eb, #4f46e5)' }}
              >
                Join the Waitlist — Free
              </a>
            </div>
            <p className="mt-5 text-sm text-slate-400">
              Compare: ServiceTitan $300+/mo · Jobber $149/mo · TradeBill $29/mo
            </p>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="relative overflow-hidden py-28 px-6 text-center" style={heroBg}>
          <div
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(ellipse, #6366f1 0%, transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight text-center">
              Stop leaving money on the table.
            </h2>
            <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto text-center">
              Join the waitlist and be first in line when we launch. Early members get locked-in pricing for life.
            </p>
            <WaitlistForm />
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 text-center" style={{ background: '#0f0c29', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <TradeBillLogo className="w-7 h-7" />
          <span className="font-bold text-white text-lg">TradeBill</span>
        </div>
        <p className="text-slate-500 text-sm">Built for small contractors who want to get paid without the headache.</p>
        <p className="text-slate-600 text-xs mt-3">© {new Date().getFullYear()} TradeBill · New Jersey</p>
      </footer>

    </div>
  )
}
