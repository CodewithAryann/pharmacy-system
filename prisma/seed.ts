import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const adminPassword = await hashPassword('admin123');
  const pharmPassword = await hashPassword('pharm123');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@pharmacy.com' },
    update: {},
    create: {
      email: 'admin@pharmacy.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });

  const pharmacist = await prisma.user.upsert({
    where: { email: 'pharmacist@pharmacy.com' },
    update: {},
    create: {
      email: 'pharmacist@pharmacy.com',
      password: pharmPassword,
      name: 'Pharmacist User',
      role: 'pharmacist',
    },
  });

  // Create sample products
  const products = [
    {
      productName: 'Dexmethylphenidate 10mg',
      ndc: '42858-0721-01',
      supplierName: 'Jason',
      quantity: 25,
      store: 'Fireside',
      total: 658,
      productGroup: 'STIMULANTS',
      dispensed: 10,
      storage: 5,
      overage: 8,
      return: 2,
    },
    {
      productName: 'Adderral XR 20mg',
      ndc: '42858-0721-02',
      supplierName: 'Manson',
      quantity: 47,
      store: 'Fireside',
      total: 6785,
      productGroup: 'AMPHETAMINE',
      dispensed: 20,
      storage: 10,
      overage: 15,
      return: 2,
    },
    {
      productName: 'Dextro/Amphet ER 15MG',
      ndc: '42858-0721-03',
      supplierName: 'Albert',
      quantity: 98,
      store: 'Fireside',
      total: 679,
      productGroup: 'AMPHETAMINE',
      dispensed: 30,
      storage: 15,
      overage: 20,
      return: 5,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { ndc: product.ndc },
      update: {},
      create: {
        ...product,
        startingInvDate: new Date('2024-06-24'),
        endingInvDate: new Date('2025-08-21'),
      },
    });
  }

  // Create suppliers
  const suppliers = [
    { name: 'Jason Supplies', contactNumber: '123-456-7890' },
    { name: 'Manson Pharma', contactNumber: '234-567-8901' },
    { name: 'Albert Distribution', contactNumber: '345-678-9012' },
  ];

  for (const supplier of suppliers) {
    await prisma.supplier.upsert({
      where: { name: supplier.name },
      update: {},
      create: supplier,
    });
  }

  // Create stores
  const stores = [
    { name: 'Fireside Pharmacy', stockInHand: 100, location: 'Downtown' },
    { name: 'La Quinta Pharmacy', stockInHand: 150, location: 'Uptown' },
  ];

  for (const store of stores) {
    await prisma.store.upsert({
      where: { name: store.name },
      update: {},
      create: store,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Update package.json to include seed script:
// "prisma": {
//   "seed": "ts-node --compiler-options {\"module\":\"commonjs\"} prisma/seed.ts"
// }