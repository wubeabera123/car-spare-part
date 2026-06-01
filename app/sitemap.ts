import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/categories`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/brands`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/help`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/shipping`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/returns`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/warranty`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const [products, categories, brands] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({ select: { slug: true } }),
      prisma.brand.findMany({ select: { slug: true } }),
    ]);

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${base}/categories/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
      url: `${base}/brands/${b.slug}`,
      changeFrequency: "weekly",
      priority: 0.5,
    }));

    return [
      ...staticRoutes,
      ...productRoutes,
      ...categoryRoutes,
      ...brandRoutes,
    ];
  } catch {
    // Keep production builds healthy even if DB is temporarily unavailable.
    return staticRoutes;
  }
}
