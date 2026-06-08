const BASE = {
  '@context': 'https://schema.org',
  '@type': 'InsuranceAgency',
  name: 'Poddar Wealth Management',
  url: 'https://www.poddarwealth.com',
  telephone: '+919415313434',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'AD Mall Compound, Vijay Chowk',
    addressLocality: 'Gorakhpur',
    addressRegion: 'Uttar Pradesh',
    postalCode: '273001',
    addressCountry: 'IN',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '154',
  },
}

export function getServiceSchema(serviceName: string, serviceUrl: string) {
  return {
    ...BASE,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: serviceName,
      itemListElement: [{
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: serviceName,
          url: serviceUrl,
        },
      }],
    },
  }
}

export function getAreaServiceSchema(serviceName: string, serviceUrl: string, cityName: string) {
  return {
    ...BASE,
    areaServed: { '@type': 'City', name: cityName },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: serviceName,
      itemListElement: [{
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: serviceName,
          url: serviceUrl,
        },
      }],
    },
  }
}
