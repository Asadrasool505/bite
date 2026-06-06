import { MetadataRoute } from 'next';
import { productsData } from "@/data/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://biteinstruments.com';

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/custom-branding',
    '/new-arrivals',
    '/quality',
    '/shipping-policy',
    '/warranty',
    '/pet-nail-cutters',
    '/pet-combs',
    '/curved-scissors',
    '/blenders-thinning-scissors',
    '/pet-straight-scissors',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const productRoutes = productsData.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
