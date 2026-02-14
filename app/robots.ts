import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/account/',
          '/admin/',
          '/checkout/',
          '/_next/',
          '/private/',
        ],
      },
    ],
    sitemap: 'https://oikaofit.com/sitemap.xml',
  }
}
