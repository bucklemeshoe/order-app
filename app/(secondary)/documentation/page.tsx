import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Documentation | O.App',
  description: 'How O.App Setup Works.',
}

export default function DocumentationPage() {
  return (
    <div className="container mx-auto px-4 max-w-3xl font-[family-name:var(--font-sans)] mb-20">
      <div className="mb-10">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
        </Link>
      </div>
      <div className="mb-12 md:text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-800 text-sm font-semibold mb-6">
          <span className="w-6 h-6 rounded-full bg-brand/15 text-brand flex items-center justify-center text-xs">📚</span> <span>Documentation</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 mb-6 font-[family-name:var(--font-heading)] tracking-tight">
          How O.App Setup Works
        </h1>
        <p className="text-zinc-600 text-lg md:text-xl font-medium max-w-2xl mx-auto block w-full">
          O.App is a fully browser-based ordering system designed to be simple, fast, and easy to manage. 
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 border border-zinc-200 shadow-sm space-y-12">
        <div className="text-xl text-zinc-800 font-medium leading-relaxed pb-8 border-b border-zinc-100">
          When you request a setup, we handle the full technical and operational configuration required to get your business live and ready to take orders.
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900">1. System Setup</h2>
          <p className="text-zinc-600 text-lg">Your ordering system is deployed and configured using modern infrastructure.</p>
          <ul className="space-y-3 mt-4">
            {['Hosting setup', 'Database connection', 'System readiness for real usage'].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-zinc-800 font-medium text-lg">
                <span className="w-2 h-2 rounded-full bg-brand shrink-0 block"></span> {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 border-t border-zinc-100 pt-12">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900">2. Database (Supabase)</h2>
          <p className="text-zinc-600 text-lg">We configure your database to store:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-6">
            {['Products', 'Orders', 'Payments', 'Settings'].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-zinc-800 font-medium text-lg bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                <span className="w-2 h-2 rounded-full bg-brand shrink-0 block"></span> {item}
              </li>
            ))}
          </ul>
          <p className="text-zinc-600 text-lg font-medium">Your database is secure and owned by you.</p>
        </section>

        <section className="space-y-4 border-t border-zinc-100 pt-12">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900">3. Hosting (Vercel)</h2>
          <p className="text-zinc-600 text-lg">Your app is deployed for:</p>
          <ul className="space-y-3 mt-4 mb-6">
            {['Fast performance', 'Reliability', 'Mobile access'].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-zinc-800 font-medium text-lg">
                <span className="w-2 h-2 rounded-full bg-brand shrink-0 block"></span> {item}
              </li>
            ))}
          </ul>
          <p className="text-zinc-600 text-lg font-medium">Accessible via a simple web link.</p>
        </section>

        <section className="space-y-4 border-t border-zinc-100 pt-12">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900">4. Payments</h2>
          <p className="text-zinc-600 text-lg">We configure:</p>
          <ul className="space-y-3 mt-4 mb-6 flex flex-wrap gap-4">
             {['SnapScan', 'Yoco'].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-zinc-800 font-medium text-lg bg-zinc-50 px-6 py-4 rounded-2xl border border-zinc-100">
                 {item}
              </li>
            ))}
          </ul>
          <p className="text-zinc-600 text-lg font-medium">Customers can pay easily, and payments are tracked in your system.</p>
        </section>

        <section className="space-y-4 border-t border-zinc-100 pt-12">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900">5. Fulfilment</h2>
          <p className="text-zinc-600 text-lg">We set up:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {['Delivery (optional)', 'Collection', 'Operating hours', 'Order timing'].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-zinc-800 font-medium text-lg">
                <span className="w-2 h-2 rounded-full bg-brand shrink-0 block"></span> {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 border-t border-zinc-100 pt-12">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900">6. Menu Setup</h2>
          <p className="text-zinc-600 text-lg">We prepare:</p>
          <ul className="space-y-3 mt-4 mb-6">
            {['Categories', 'Initial products', 'Options (variants, extras)'].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-zinc-800 font-medium text-lg">
                <span className="w-2 h-2 rounded-full bg-brand shrink-0 block"></span> {item}
              </li>
            ))}
          </ul>
          <p className="text-zinc-600 text-lg font-medium">You can manage everything after setup.</p>
        </section>

        <section className="space-y-4 border-t border-zinc-100 pt-12">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900">7. Branding</h2>
          <p className="text-zinc-600 text-lg">We apply:</p>
          <ul className="flex flex-wrap gap-3 mt-4">
            {['Business name', 'Logo', 'Basic styling'].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-zinc-800 font-medium text-lg bg-zinc-50 px-6 py-3 rounded-full border border-zinc-100">
                 {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 border-t border-zinc-100 pt-12">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900">8. Admin Access</h2>
          <p className="text-zinc-600 text-lg">You can:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {['Manage orders', 'Update menu', 'Change pricing', 'Control settings'].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-zinc-800 font-medium text-lg">
                <span className="w-2 h-2 rounded-full bg-brand shrink-0 block"></span> {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 border-t border-zinc-100 pt-12">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900">9. Customer Experience</h2>
          <p className="text-zinc-600 text-lg">Customers:</p>
          <ul className="space-y-3 mt-4">
             {['Order via browser', 'No app download', 'Choose delivery or collection', 'Pay easily'].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-zinc-800 font-medium text-lg">
                <span className="w-2 h-2 rounded-full bg-brand shrink-0 block"></span> {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 border-t border-zinc-100 pt-12 pb-4">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900">10. After Setup</h2>
          <ul className="space-y-3 mt-4 p-8 bg-zinc-50 rounded-2xl border border-zinc-100">
             {['System is fully live', 'You manage it independently', 'Support available if needed'].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-zinc-800 font-medium text-lg">
                <span className="w-2 h-2 flex-shrink-0 rounded-full bg-brand block"></span> {item}
              </li>
            ))}
          </ul>
        </section>

      </div>
    </div>
  )
}
