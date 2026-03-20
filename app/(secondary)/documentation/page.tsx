import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

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
        <FileText className="w-16 h-16 md:mx-auto text-zinc-300 mb-8" />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 mb-6 font-[family-name:var(--font-heading)] tracking-tight">
          How O.App Setup Works
        </h1>
        <p className="text-zinc-600 text-lg md:text-xl font-medium max-w-2xl mx-auto block w-full">
          O.App is a fully browser-based ordering system designed to be simple, fast, and easy to manage. 
        </p>
      </div>

      <div className="bg-white rounded-none md:rounded-3xl p-6 px-5 md:p-12 lg:p-16 border-y md:border border-zinc-200 shadow-sm block w-[calc(100%+2rem)] md:w-full -mx-4 md:mx-0">
        <div className="text-xl text-zinc-800 font-medium leading-relaxed pb-8 mb-10 border-b border-zinc-100">
          When you request a setup, we handle the full technical and operational configuration required to get your business live and ready to take orders.
        </div>

        <div className="flex flex-col gap-12 w-full">
          <section className="block w-full">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900 mb-4">1. System Setup</h2>
            <p className="text-zinc-600 text-lg mb-4">Your ordering system is deployed and configured using modern infrastructure.</p>
            <ul className="flex flex-col gap-3">
              {['Hosting setup', 'Database connection', 'System readiness for real usage'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-800 font-medium text-lg">
                  <span className="w-2 h-2 rounded-full bg-brand shrink-0 block"></span> <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="w-full h-px bg-zinc-100"></div>

          <section className="block w-full">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900 mb-4">2. Database (Supabase)</h2>
            <p className="text-zinc-600 text-lg mb-4">We configure your database to store:</p>
            <ul className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
              {['Products', 'Orders', 'Payments', 'Settings'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-800 font-medium text-lg bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex-1 min-w-[140px]">
                  <span className="w-2 h-2 rounded-full bg-brand shrink-0 block"></span> <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-600 text-lg font-medium">Your database is secure and owned by you.</p>
          </section>

          <div className="w-full h-px bg-zinc-100"></div>

          <section className="block w-full">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900 mb-4">3. Hosting (Vercel)</h2>
            <p className="text-zinc-600 text-lg mb-4">Your app is deployed for:</p>
            <ul className="flex flex-col gap-3 mb-6">
              {['Fast performance', 'Reliability', 'Mobile access'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-800 font-medium text-lg">
                  <span className="w-2 h-2 rounded-full bg-brand shrink-0 block"></span> <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-600 text-lg font-medium">Accessible via a simple web link.</p>
          </section>

          <div className="w-full h-px bg-zinc-100"></div>

          <section className="block w-full">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900 mb-4">4. Payments</h2>
            <p className="text-zinc-600 text-lg mb-4">We configure:</p>
            <ul className="flex flex-wrap gap-4 mb-6">
               {['SnapScan', 'Yoco'].map((item, i) => (
                <li key={i} className="flex items-center justify-center text-zinc-800 font-medium text-lg bg-zinc-50 px-6 py-4 rounded-xl border border-zinc-100">
                   {item}
                </li>
              ))}
            </ul>
            <p className="text-zinc-600 text-lg font-medium">Customers can pay easily, and payments are tracked in your system.</p>
          </section>

          <div className="w-full h-px bg-zinc-100"></div>

          <section className="block w-full">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900 mb-4">5. Fulfilment</h2>
            <p className="text-zinc-600 text-lg mb-4">We set up:</p>
            <ul className="flex flex-col gap-3">
              {['Delivery (optional)', 'Collection', 'Operating hours', 'Order timing'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-800 font-medium text-lg">
                  <span className="w-2 h-2 rounded-full bg-brand shrink-0 block"></span> <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="w-full h-px bg-zinc-100"></div>

          <section className="block w-full">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900 mb-4">6. Menu Setup</h2>
            <p className="text-zinc-600 text-lg mb-4">We prepare:</p>
            <ul className="flex flex-col gap-3 mb-6">
              {['Categories', 'Initial products', 'Options (variants, extras)'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-800 font-medium text-lg">
                  <span className="w-2 h-2 rounded-full bg-brand shrink-0 block"></span> <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-600 text-lg font-medium">You can manage everything after setup.</p>
          </section>

          <div className="w-full h-px bg-zinc-100"></div>

          <section className="block w-full">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900 mb-4">7. Branding</h2>
            <p className="text-zinc-600 text-lg mb-4">We apply:</p>
            <ul className="flex flex-wrap gap-3">
              {['Business name', 'Logo', 'Basic styling'].map((item, i) => (
                <li key={i} className="flex items-center justify-center text-zinc-800 font-medium text-lg bg-zinc-50 px-6 py-3 rounded-full border border-zinc-100">
                   {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="w-full h-px bg-zinc-100"></div>

          <section className="block w-full">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900 mb-4">8. Admin Access</h2>
            <p className="text-zinc-600 text-lg mb-4">You can:</p>
            <ul className="flex flex-col gap-3">
              {['Manage orders', 'Update menu', 'Change pricing', 'Control settings'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-800 font-medium text-lg">
                  <span className="w-2 h-2 rounded-full bg-brand shrink-0 block"></span> <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="w-full h-px bg-zinc-100"></div>

          <section className="block w-full">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900 mb-4">9. Customer Experience</h2>
            <p className="text-zinc-600 text-lg mb-4">Customers:</p>
            <ul className="flex flex-col gap-3">
               {['Order via browser', 'No app download', 'Choose delivery or collection', 'Pay easily'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-800 font-medium text-lg">
                  <span className="w-2 h-2 rounded-full bg-brand shrink-0 block"></span> <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="w-full h-px bg-zinc-100"></div>

          <section className="block w-full pb-4">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-zinc-900 mb-4">10. After Setup</h2>
            <ul className="flex flex-col gap-3 p-6 md:p-8 bg-zinc-50 rounded-2xl border border-zinc-100">
               {['System is fully live', 'You manage it independently', 'Support available if needed'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-800 font-medium text-lg">
                  <span className="w-2 h-2 flex-shrink-0 rounded-full bg-brand block"></span> <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

      </div>
    </div>
  )
}
