import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type ProductFilters = {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: "NEW" | "USED" | "REFURBISHED";
  partType?: "OEM" | "AFTERMARKET";
  inStock?: boolean;
  sort?: "newest" | "price-asc" | "price-desc" | "rating" | "popular";
  page?: number;
  pageSize?: number;
};

export async function getProducts(filters: ProductFilters = {}) {
  const {
    q, category, brand, minPrice, maxPrice, condition, partType,
    inStock, sort = "newest", page = 1, pageSize = 12,
  } = filters;

  const where: Prisma.ProductWhereInput = { isActive: true };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (category) where.category = { slug: category };
  if (brand) where.brand = { slug: brand };
  if (condition) where.condition = condition;
  if (partType) where.partType = partType;
  if (inStock) where.stock = { gt: 0 };
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc" ? { price: "asc" } :
    sort === "price-desc" ? { price: "desc" } :
    sort === "rating" ? { rating: "desc" } :
    sort === "popular" ? { reviewCount: "desc" } :
    { createdAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where, orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { brand: true, category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items, total, page, pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      seller: { include: { user: { select: { name: true, image: true } } } },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { name: true, image: true } } },
      },
      compatibilities: { include: { model: { include: { make: true } } } },
    },
  });
}

export async function getRelatedProducts(productId: string, categoryId: string) {
  return prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: productId } },
    include: { brand: true },
    take: 4,
    orderBy: { rating: "desc" },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
  });
}

export async function getBrands() {
  return prisma.brand.findMany({ orderBy: { name: "asc" } });
}
