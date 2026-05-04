/* eslint-disable no-console */
import {
  PrismaClient,
  UserRole,
  ProductCondition,
  PartType,
  SellerStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database…");

  // Admin + sample users
  const adminPw = await bcrypt.hash("admin123!", 10);
  const userPw = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@autoparts.hub" },
    update: {},
    create: {
      email: "admin@autoparts.hub",
      name: "Site Admin",
      passwordHash: adminPw,
      role: UserRole.ADMIN,
    },
  });

  const sellerUser = await prisma.user.upsert({
    where: { email: "seller@autoparts.hub" },
    update: {},
    create: {
      email: "seller@autoparts.hub",
      name: "Demo Seller",
      passwordHash: userPw,
      role: UserRole.SELLER,
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@autoparts.hub" },
    update: {},
    create: {
      email: "customer@autoparts.hub",
      name: "Demo Customer",
      passwordHash: userPw,
      role: UserRole.CUSTOMER,
    },
  });

  // Seller profile
  const seller = await prisma.seller.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: {
      userId: sellerUser.id,
      storeName: "Premier Auto Parts",
      storeSlug: "premier-auto-parts",
      description: "Verified seller of OEM and premium aftermarket parts.",
      status: SellerStatus.APPROVED,
    },
  });

  // Categories
  const categories = await Promise.all(
    [
      ["engine-parts", "Engine Parts"],
      ["brakes", "Brake Parts"],
      ["suspension", "Suspension"],
      ["electrical", "Electrical"],
      ["body-parts", "Body Parts"],
      ["tires-wheels", "Tires & Wheels"],
    ].map(([slug, name]) =>
      prisma.category.upsert({
        where: { slug },
        update: {},
        create: { slug, name },
      }),
    ),
  );

  // Brands
  const brandData = [
    "Bosch",
    "Brembo",
    "Denso",
    "K&N",
    "Michelin",
    "Monroe",
    "NGK",
  ];
  const brands = await Promise.all(
    brandData.map((name) =>
      prisma.brand.upsert({
        where: { slug: name.toLowerCase().replace(/\W+/g, "-") },
        update: {},
        create: {
          name,
          slug: name.toLowerCase().replace(/\W+/g, "-"),
        },
      }),
    ),
  );

  // Vehicle data
  const toyota = await prisma.vehicleMake.upsert({
    where: { slug: "toyota" },
    update: {},
    create: { name: "Toyota", slug: "toyota" },
  });
  await prisma.vehicleModel.upsert({
    where: { makeId_name: { makeId: toyota.id, name: "Camry" } },
    update: {},
    create: {
      makeId: toyota.id,
      name: "Camry",
      yearStart: 2000,
      yearEnd: 2025,
    },
  });

  // Sample products
  const samples = [
    {
      sku: "BSCH-IRD-4PK",
      slug: "bosch-iridium-spark-plugs-set",
      name: "Bosch Iridium Spark Plugs (Set of 4)",
      description:
        "Premium iridium spark plugs for improved ignition and longer service life.",
      price: 42.99,
      compareAtPrice: 59.99,
      stock: 230,
      brand: brands[0],
      category: categories[0],
      partType: PartType.OEM,
      condition: ProductCondition.NEW,
      isFeatured: true,
    },
    {
      sku: "BREM-PAD-FRT-CER",
      slug: "brembo-front-brake-pads-ceramic",
      name: "Brembo Ceramic Front Brake Pads",
      description: "Low-dust ceramic compound for quiet, confident braking.",
      price: 89.5,
      compareAtPrice: 110,
      stock: 64,
      brand: brands[1],
      category: categories[1],
      partType: PartType.OEM,
      condition: ProductCondition.NEW,
      isFeatured: true,
    },
    {
      sku: "KN-AIR-FILT",
      slug: "k-and-n-performance-air-filter",
      name: "K&N Performance Air Filter — Reusable",
      description:
        "Washable, reusable performance air filter for increased airflow.",
      price: 54.0,
      stock: 120,
      brand: brands[3],
      category: categories[0],
      partType: PartType.AFTERMARKET,
      condition: ProductCondition.NEW,
      isFeatured: true,
    },
    {
      sku: "MNR-STRT-FRT",
      slug: "monroe-quick-strut-front-assembly",
      name: "Monroe Quick-Strut Complete Front Assembly",
      description:
        "Complete pre-assembled strut for fast, accurate replacement.",
      price: 219.99,
      compareAtPrice: 279.99,
      stock: 18,
      brand: brands[5],
      category: categories[2],
      partType: PartType.OEM,
      condition: ProductCondition.NEW,
      isFeatured: true,
    },
  ];

  for (const s of samples) {
    await prisma.product.upsert({
      where: { sku: s.sku },
      update: {},
      create: {
        sku: s.sku,
        slug: s.slug,
        name: s.name,
        description: s.description,
        price: s.price,
        compareAtPrice: s.compareAtPrice,
        stock: s.stock,
        partType: s.partType,
        condition: s.condition,
        isFeatured: s.isFeatured,
        rating: 4.7,
        reviewCount: Math.floor(Math.random() * 1000) + 50,
        images: [],
        sellerId: seller.id,
        brandId: s.brand.id,
        categoryId: s.category.id,
      },
    });
  }

  console.log(
    `✅ Seeded admin=${admin.email}, seller=${sellerUser.email}, ${samples.length} products`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
