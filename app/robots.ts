import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/lp/'],
      },
    ],
    sitemap: 'https://www.poddarwealth.com/sitemap.xml',
    host: 'https://www.poddarwealth.com',
  }
}
