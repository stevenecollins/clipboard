import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...');

  // Create a demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@clipboards.app' },
    update: {},
    create: {
      email: 'demo@clipboards.app',
      passwordHash: hashedPassword,
      name: 'Demo User',
      emailVerified: true,
    },
  });

  console.log(`👤 Created user: ${user.email}`);

  // Create demo boards with new schema
  const inspirationBoard = await prisma.board.upsert({
    where: { id: 'demo-inspiration-board' },
    update: {},
    create: {
      id: 'demo-inspiration-board',
      userId: user.id,
      name: 'Inspiration',
      description: 'Design inspiration and creative ideas',
      isPrivate: true,
      color: '#FF6B6B',
      position: 0,
    },
  });

  const shoppingBoard = await prisma.board.upsert({
    where: { id: 'demo-shopping-board' },
    update: {},
    create: {
      id: 'demo-shopping-board',
      userId: user.id,
      name: 'Shopping',
      description: 'Products I want to buy',
      isPrivate: true,
      color: '#4ECDC4',
      position: 1,
    },
  });

  const travelBoard = await prisma.board.upsert({
    where: { id: 'demo-travel-board' },
    update: {},
    create: {
      id: 'demo-travel-board',
      userId: user.id,
      name: 'Travel Ideas',
      description: 'Places to visit and travel inspiration',
      isPrivate: false, // Example of a public board
      color: '#45B7D1',
      position: 2,
    },
  });

  console.log(`📋 Created boards: ${inspirationBoard.name}, ${shoppingBoard.name}, ${travelBoard.name}`);

  // Create demo items with new schema
  const demoItems = [
    {
      boardId: inspirationBoard.id,
      title: 'Modern Kitchen Design',
      description: 'Beautiful minimalist kitchen with clean lines and natural materials',
      sourceUrl: 'https://example.com/kitchen-design',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
      imageWidth: 800,
      imageHeight: 600,
      imageFormat: 'jpg',
      position: 0,
    },
    {
      boardId: inspirationBoard.id,
      title: 'Scandinavian Living Room',
      description: 'Cozy living space with natural light and wooden accents',
      sourceUrl: 'https://example.com/scandinavian-design',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
      imageWidth: 800,
      imageHeight: 600,
      imageFormat: 'jpg',
      position: 1,
    },
    {
      boardId: shoppingBoard.id,
      title: 'Wireless Headphones',
      description: 'Premium noise-canceling headphones for work and travel',
      sourceUrl: 'https://example.com/headphones',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      imageWidth: 800,
      imageHeight: 600,
      imageFormat: 'jpg',
      position: 0,
    },
    {
      boardId: shoppingBoard.id,
      title: 'Mechanical Keyboard',
      description: 'Ergonomic mechanical keyboard for coding and productivity',
      sourceUrl: 'https://example.com/keyboard',
      imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a',
      imageWidth: 800,
      imageHeight: 600,
      imageFormat: 'jpg',
      position: 1,
    },
    {
      boardId: travelBoard.id,
      title: 'Santorini, Greece',
      description: 'Beautiful Greek island with stunning sunsets and white architecture',
      sourceUrl: 'https://example.com/santorini-travel',
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff',
      imageWidth: 800,
      imageHeight: 600,
      imageFormat: 'jpg',
      position: 0,
    },
    {
      boardId: travelBoard.id,
      title: 'Tokyo Street Food',
      description: 'Must-try local street food experiences in Tokyo',
      sourceUrl: 'https://example.com/tokyo-food',
      imageUrl: 'https://images.unsplash.com/photo-1554797589-7241bb691973',
      imageWidth: 800,
      imageHeight: 600,
      imageFormat: 'jpg',
      position: 1,
    },
  ];

  for (const itemData of demoItems) {
    await prisma.item.create({
      data: itemData,
    });
  }

  // Create a demo user session
  await prisma.userSession.create({
    data: {
      userId: user.id,
      deviceType: 'web',
      deviceId: 'demo-browser-session',
    },
  });

  console.log(`📦 Created ${demoItems.length} demo items`);
  console.log(`🔗 Created 1 demo user session`);
  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });