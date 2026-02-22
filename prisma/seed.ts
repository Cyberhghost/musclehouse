import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const wilayas = [
  { id: 1, name: 'Adrar' },
  { id: 2, name: 'Chlef' },
  { id: 3, name: 'Laghouat' },
  { id: 4, name: 'Oum El Bouaghi' },
  { id: 5, name: 'Batna' },
  { id: 6, name: 'Béjaïa' },
  { id: 7, name: 'Biskra' },
  { id: 8, name: 'Béchar' },
  { id: 9, name: 'Blida' },
  { id: 10, name: 'Bouira' },
  { id: 11, name: 'Tamanrasset' },
  { id: 12, name: 'Tébessa' },
  { id: 13, name: 'Tlemcen' },
  { id: 14, name: 'Tiaret' },
  { id: 15, name: 'Tizi Ouzou' },
  { id: 16, name: 'Alger' },
  { id: 17, name: 'Djelfa' },
  { id: 18, name: 'Jijel' },
  { id: 19, name: 'Sétif' },
  { id: 20, name: 'Saïda' },
  { id: 21, name: 'Skikda' },
  { id: 22, name: 'Sidi Bel Abbès' },
  { id: 23, name: 'Annaba' },
  { id: 24, name: 'Guelma' },
  { id: 25, name: 'Constantine' },
  { id: 26, name: 'Médéa' },
  { id: 27, name: 'Mostaganem' },
  { id: 28, name: "M'Sila" },
  { id: 29, name: 'Mascara' },
  { id: 30, name: 'Ouargla' },
  { id: 31, name: 'Oran' },
  { id: 32, name: 'El Bayadh' },
  { id: 33, name: 'Illizi' },
  { id: 34, name: 'Bordj Bou Arréridj' },
  { id: 35, name: 'Boumerdès' },
  { id: 36, name: 'El Tarf' },
  { id: 37, name: 'Tindouf' },
  { id: 38, name: 'Tissemsilt' },
  { id: 39, name: 'El Oued' },
  { id: 40, name: 'Khenchela' },
  { id: 41, name: 'Souk Ahras' },
  { id: 42, name: 'Tipaza' },
  { id: 43, name: 'Mila' },
  { id: 44, name: 'Aïn Defla' },
  { id: 45, name: 'Naâma' },
  { id: 46, name: 'Aïn Témouchent' },
  { id: 47, name: 'Ghardaïa' },
  { id: 48, name: 'Relizane' },
];

async function main() {
  console.log('Seeding database...');

  // Seed shipping fees for all 48 wilayas
  for (const wilaya of wilayas) {
    const amount = wilaya.id === 16 ? new Prisma.Decimal(450) : new Prisma.Decimal(550);
    await prisma.shippingFee.upsert({
      where: { wilayaId: wilaya.id },
      update: { amount },
      create: {
        wilaya: wilaya.name,
        wilayaId: wilaya.id,
        amount,
      },
    });
  }
  console.log('✓ Seeded 48 wilayas with shipping fees');

  // Seed default settings
  await prisma.settings.upsert({
    where: { key: 'freeShippingGlobal' },
    update: { value: 'false' },
    create: { key: 'freeShippingGlobal', value: 'false' },
  });
  console.log('✓ Seeded default settings');

  // Seed sample category
  const category = await prisma.category.upsert({
    where: { id: 'sample-category-proteines' },
    update: {},
    create: {
      id: 'sample-category-proteines',
      name: 'Protéines',
      displayOrder: 1,
      isActive: true,
    },
  });
  console.log('✓ Seeded sample category: Protéines');

  // Seed sample product
  await prisma.product.upsert({
    where: { id: 'sample-product-whey' },
    update: {},
    create: {
      id: 'sample-product-whey',
      name: 'Whey Protein 1kg',
      description: 'Protéine de lactosérum de haute qualité, idéale pour la récupération musculaire.',
      price: new Prisma.Decimal(3500),
      promoPrice: new Prisma.Decimal(2990),
      stock: 50,
      imageUrl: '/images/products/whey-protein.jpg',
      categoryId: category.id,
      displayOrder: 1,
      freeShipping: false,
      isActive: true,
    },
  });
  console.log('✓ Seeded sample product: Whey Protein 1kg');

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
