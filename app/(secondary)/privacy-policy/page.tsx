import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | O App',
  description: 'Privacy Policy for O.App',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="mb-10">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
        </Link>
      </div>
      <div className="space-y-6 text-zinc-600 leading-relaxed text-lg">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6 font-[family-name:var(--font-heading)] tracking-tight">Privacy Policy</h1>
          <p className="mb-8 p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4 font-[family-name:var(--font-heading)] flex items-center gap-2">
            <span className="text-brand">1.</span> Information We Collect
          </h2>
          <p className="mb-4">
            We collect information you provide directly to us when you use our digital storefront, create an account, or communicate with us. This may include your name, email address, phone number, physical address, and payment information.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4 font-[family-name:var(--font-heading)] flex items-center gap-2">
            <span className="text-brand">2.</span> How We Use Your Information
          </h2>
          <p className="mb-4">
            We use the information we collect primarily to provide, maintain, and improve our services. This includes processing transactions, sending technical notices, updates, security alerts, and support and administrative messages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4 font-[family-name:var(--font-heading)] flex items-center gap-2">
            <span className="text-brand">3.</span> Data Security
          </h2>
          <p className="mb-4">
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. However, no internet or email transmission is ever fully secure or error free.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4 font-[family-name:var(--font-heading)] flex items-center gap-2">
            <span className="text-brand">4.</span> Contact Us
          </h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:jared@makefriendly.co.za" className="text-brand hover:underline font-medium">jared@makefriendly.co.za</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
