import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://oapp.co.za';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/auth/',
        '/order/',
        '/offline/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
