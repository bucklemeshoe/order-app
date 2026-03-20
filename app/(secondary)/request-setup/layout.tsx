import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Request Setup | O.App',
  description: 'Request a custom setup for your food business. We handle the entire technical setup so you can start taking orders immediately.',
  openGraph: {
    title: 'Request Setup | O.App',
    description: 'We handle the technical setup so you can start taking orders.',
    images: ['/images/family-sharing-food.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Request Setup | O.App',
    description: 'We handle the technical setup so you can start taking orders.',
    images: ['/images/family-sharing-food.png'],
  }
}

export default function RequestSetupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
