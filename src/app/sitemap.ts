import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://musclehouse.dz';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/catalogue`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/suivi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/panier`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  try {
    const res = await fetch(`${BASE_URL}/api/products`);
    if (res.ok) {
      const products: Array<{ id: string; updatedAt: string }> = await res.json();
      const productRoutes: MetadataRoute.Sitemap = products.map(p => ({
        url: `${BASE_URL}/produit/${p.id}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
      return [...staticRoutes, ...productRoutes];
    }
  } catch {
    // Return static routes if API is unavailable
  }

  return staticRoutes;
}
