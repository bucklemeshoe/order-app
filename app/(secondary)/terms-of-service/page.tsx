import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | O App',
  description: 'Terms of Service for O.App',
}

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="mb-10">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
        </Link>
      </div>
      <div className="space-y-6 text-zinc-600 leading-relaxed text-lg">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6 font-[family-name:var(--font-heading)] tracking-tight">Terms of Service</h1>
          <p className="mb-8 p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4 font-[family-name:var(--font-heading)] flex items-center gap-2">
            <span className="text-brand">1.</span> Acceptance of Terms
          </h2>
          <p className="mb-4">
            By accessing or using our websites, applications, and other products or services, you agree to be bound by these Terms. If you do not agree to these terms, including the mandatory arbitration provision and class action waiver, do not access or use our Services.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4 font-[family-name:var(--font-heading)] flex items-center gap-2">
            <span className="text-brand">2.</span> Description of Service
          </h2>
          <p className="mb-4">
            O.App provides a digital storefront and ordering system for food businesses. We are not responsible for the quality, safety, legality, or any other aspect of the products or services offered by merchants using our platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4 font-[family-name:var(--font-heading)] flex items-center gap-2">
            <span className="text-brand">3.</span> User Accounts
          </h2>
          <p className="mb-4">
            To use certain features of the Services, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4 font-[family-name:var(--font-heading)] flex items-center gap-2">
            <span className="text-brand">4.</span> Limitation of Liability
          </h2>
          <p className="mb-4">
            In no event will O.App, its directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4 font-[family-name:var(--font-heading)] flex items-center gap-2">
            <span className="text-brand">5.</span> Modifications to the Service and Prices
          </h2>
          <p className="mb-4">
            Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4 font-[family-name:var(--font-heading)] flex items-center gap-2">
            <span className="text-brand">6.</span> Contact
          </h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at: <a href="mailto:jared@makefriendly.co.za" className="text-brand hover:underline font-medium">jared@makefriendly.co.za</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
