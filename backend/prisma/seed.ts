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

  // Create demo boards
  const inspirationBoard = await prisma.board.upsert({
    where: { id: 'demo-inspiration-board' },
    update: {},
    create: {
      id: 'demo-inspiration-board',
      userId: user.id,
      name: 'Inspiration',
      description: 'Design inspiration and creative ideas',
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
      color: '#4ECDC4',
      position: 1,
    },
  });

  console.log(`📋 Created boards: ${inspirationBoard.name}, ${shoppingBoard.name}`);

  // Create demo items
  const demoItems = [
    {
      boardId: inspirationBoard.id,
      title: 'Modern Kitchen Design',
      sourceUrl: 'https://example.com/kitchen-design',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
      imageWidth: 800,
      imageHeight: 600,
      imageFormat: 'jpg',
      position: 0,
    },
    {
      boardId: shoppingBoard.id,
      title: 'Wireless Headphones',
      sourceUrl: 'https://example.com/headphones',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      imageWidth: 800,
      imageHeight: 600,
      imageFormat: 'jpg',
      position: 0,
    },
  ];

  for (const itemData of demoItems) {
    await prisma.item.create({
      data: itemData,
    });
  }

  console.log(`📦 Created ${demoItems.length} demo items`);
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