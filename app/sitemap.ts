import { MetadataRoute } from 'next'
import blogPosts from '@/lib/data/blog-posts.json'

const BASE_URL = 'https://www.poddarwealth.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Base static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                                   lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/products`,                     lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/services`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services/life-insurance`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services/health-insurance`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services/child-planning`,      lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/services/retirement`,          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/services/tax-planning`,        lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/services/keyman-insurance`,    lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/services/critical-illness`,    lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/calculators/premium`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/calculators/life-insurance`,            lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/calculators/retirement`,                lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/calculators/surrender-value`,           lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/calculators/maturity`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/calculators/loan`,                      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/become-advisor`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`,                               lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE_URL}/blog`,                                  lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/compare`,                               lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/renew`,                                 lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/claims`,                                lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/faq`,                                   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/privacy-policy`,                        lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/terms`,                                 lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    // Insurance tools & info pages
    { url: `${BASE_URL}/insurance-quiz`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/bima-sugam`,                            lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/lic-help`,                              lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/premium-reminder`,                      lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/lic-bonus`,                             lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/policy-revival`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    // Plan pages
    { url: `${BASE_URL}/plans/nav-jeevan-shree`,                lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Best-plan age pages
    { url: `${BASE_URL}/best-plan/25`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/best-plan/30`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/best-plan/35`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/best-plan/40`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/best-plan/45`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/best-plan/50`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    // Local area service pages
    { url: `${BASE_URL}/services/golghar`,                      lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/services/shahpur`,                      lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/services/padrauna`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/services/deoria`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/services/kushinagar`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Dynamic blog posts
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages]
}

