import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://oikaofit.com';

  const routes = [
    '',
    '/products',
    '/customize',
    '/cart',
    '/wishlist',
    '/rewards',
    '/shipping',
    '/return',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
    '/size-guide',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const categories = [
    '/products?category=hoodies',
    '/products?category=tshirts',
    '/products?category=accessories',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...routes, ...categories];
}
