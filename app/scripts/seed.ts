
import { PrismaClient } from '@prisma/client';
import { MARKET_CATEGORIES } from '../lib/categories';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  await prisma.quoteItem.deleteMany({});
  await prisma.quote.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.pricelist.deleteMany({});
  await prisma.chatSession.deleteMany({});
  await prisma.category.deleteMany({});

  // Seed categories
  console.log('Seeding categories...');
  for (const category of MARKET_CATEGORIES) {
    await prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
      },
    });
    console.log(`Created category: ${category.name}`);
  }

  // Create pricelists
  console.log('Seeding pricelists...');
  const basicPricelist = await prisma.pricelist.create({
    data: {
      name: 'Basic Equipment',
      price_type: 'retail',
      margin_percentage: 30,
      is_active: true,
    },
  });

  const premiumPricelist = await prisma.pricelist.create({
    data: {
      name: 'Premium Equipment',
      price_type: 'retail',
      margin_percentage: 35,
      is_active: true,
    },
  });

  const professionalPricelist = await prisma.pricelist.create({
    data: {
      name: 'Professional Equipment',
      price_type: 'retail',
      margin_percentage: 40,
      is_active: true,
    },
  });

  // Sample products for each category
  const products = [
    // Home products
    {
      name: 'Samsung 65" 4K QLED TV',
      description: 'High-quality 4K QLED display perfect for home entertainment',
      category_id: 'home',
      pricelist_id: basicPricelist.id,
      cost_price: 800,
      retail_price: 1299,
      markup_percentage: 62,
      content: 'Perfect for living room entertainment, supports HDR10+ and has built-in smart features',
    },
    {
      name: 'Sonos Arc Soundbar',
      description: 'Premium soundbar with Dolby Atmos support',
      category_id: 'home',
      pricelist_id: premiumPricelist.id,
      cost_price: 600,
      retail_price: 899,
      markup_percentage: 50,
      content: 'Immersive sound experience for home theater, works with voice assistants',
    },
    {
      name: 'Apple TV 4K',
      description: 'Streaming device with 4K HDR support',
      category_id: 'home',
      pricelist_id: basicPricelist.id,
      cost_price: 120,
      retail_price: 179,
      markup_percentage: 49,
      content: 'Access to all streaming services, AirPlay support, gaming capabilities',
    },
    {
      name: 'Bose Home Speaker 500',
      description: 'Smart speaker with 360-degree sound',
      category_id: 'home',
      pricelist_id: premiumPricelist.id,
      cost_price: 200,
      retail_price: 299,
      markup_percentage: 50,
      content: 'Voice control, multi-room audio, premium sound quality',
    },

    // Business products
    {
      name: 'Epson PowerLite Projector',
      description: 'Professional projector for presentations',
      category_id: 'business',
      pricelist_id: professionalPricelist.id,
      cost_price: 800,
      retail_price: 1399,
      markup_percentage: 75,
      content: 'High brightness, wireless connectivity, suitable for conference rooms',
    },
    {
      name: 'Logitech Conference Camera',
      description: 'Ultra-HD conference camera with AI features',
      category_id: 'business',
      pricelist_id: professionalPricelist.id,
      cost_price: 600,
      retail_price: 999,
      markup_percentage: 67,
      content: 'Auto-framing, noise reduction, perfect for hybrid meetings',
    },
    {
      name: 'Jabra Conference Speaker',
      description: 'Professional speakerphone for meetings',
      category_id: 'business',
      pricelist_id: professionalPricelist.id,
      cost_price: 300,
      retail_price: 449,
      markup_percentage: 50,
      content: 'Crystal clear audio, echo cancellation, USB and Bluetooth connectivity',
    },
    {
      name: 'LG 86" Interactive Display',
      description: 'Large interactive touchscreen for presentations',
      category_id: 'business',
      pricelist_id: professionalPricelist.id,
      cost_price: 3000,
      retail_price: 4999,
      markup_percentage: 67,
      content: 'Touch-enabled, 4K resolution, wireless screen sharing',
    },

    // Restaurant products
    {
      name: 'Bose FreeSpace Speakers',
      description: 'Ceiling-mounted speakers for ambient music',
      category_id: 'restaurant',
      pricelist_id: basicPricelist.id,
      cost_price: 180,
      retail_price: 279,
      markup_percentage: 55,
      content: 'Weather-resistant, wide coverage, easy installation',
    },
    {
      name: 'Digital Menu Board 43"',
      description: 'Digital display for menu and promotions',
      category_id: 'restaurant',
      pricelist_id: basicPricelist.id,
      cost_price: 400,
      retail_price: 699,
      markup_percentage: 75,
      content: 'Easy content management, bright display, remote updates',
    },
    {
      name: 'Yamaha Commercial Mixer',
      description: 'Professional audio mixer for background music',
      category_id: 'restaurant',
      pricelist_id: premiumPricelist.id,
      cost_price: 250,
      retail_price: 399,
      markup_percentage: 60,
      content: 'Multiple zones, EQ control, reliable performance',
    },
    {
      name: 'Outdoor Patio Speaker System',
      description: 'Weather-resistant speakers for outdoor dining',
      category_id: 'restaurant',
      pricelist_id: premiumPricelist.id,
      cost_price: 320,
      retail_price: 499,
      markup_percentage: 56,
      content: 'IP65 rated, powerful bass, stylish design',
    },

    // Gym products
    {
      name: 'Gym Sound System Package',
      description: 'High-energy sound system for fitness areas',
      category_id: 'gym',
      pricelist_id: professionalPricelist.id,
      cost_price: 1200,
      retail_price: 1999,
      markup_percentage: 67,
      content: 'High-power amplifiers, zone control, motivating sound quality',
    },
    {
      name: 'Cardio TV Display System',
      description: 'Individual TV displays for cardio equipment',
      category_id: 'gym',
      pricelist_id: basicPricelist.id,
      cost_price: 200,
      retail_price: 329,
      markup_percentage: 65,
      content: 'Personal entertainment, multiple channel options, easy mounting',
    },
    {
      name: 'Wireless Microphone System',
      description: 'Professional wireless mic for fitness classes',
      category_id: 'gym',
      pricelist_id: premiumPricelist.id,
      cost_price: 300,
      retail_price: 499,
      markup_percentage: 66,
      content: 'Clear voice projection, sweat-resistant, long battery life',
    },
    {
      name: 'LED Video Wall Display',
      description: 'Large format display for group motivation',
      category_id: 'gym',
      pricelist_id: professionalPricelist.id,
      cost_price: 2500,
      retail_price: 4199,
      markup_percentage: 68,
      content: 'High brightness, energy efficient, customizable content',
    },

    // Worship products
    {
      name: 'Sanctuary Sound System',
      description: 'Professional sound reinforcement for worship',
      category_id: 'worship',
      pricelist_id: professionalPricelist.id,
      cost_price: 2000,
      retail_price: 3499,
      markup_percentage: 75,
      content: 'Clear speech reproduction, music performance, feedback control',
    },
    {
      name: 'Hearing Loop System',
      description: 'Assistive listening system for hearing impaired',
      category_id: 'worship',
      pricelist_id: professionalPricelist.id,
      cost_price: 800,
      retail_price: 1299,
      markup_percentage: 62,
      content: 'ADA compliant, wireless transmission, discrete installation',
    },
    {
      name: 'Projection Screen System',
      description: 'Large motorized screen for lyrics and presentations',
      category_id: 'worship',
      pricelist_id: premiumPricelist.id,
      cost_price: 600,
      retail_price: 999,
      markup_percentage: 67,
      content: 'Remote control, quiet operation, premium viewing surface',
    },
    {
      name: 'Live Streaming Camera Kit',
      description: 'Multi-camera setup for worship streaming',
      category_id: 'worship',
      pricelist_id: professionalPricelist.id,
      cost_price: 1500,
      retail_price: 2499,
      markup_percentage: 67,
      content: 'HD quality, remote control, easy streaming integration',
    },

    // Education products
    {
      name: 'Interactive Whiteboard',
      description: 'Smart board for interactive teaching',
      category_id: 'education',
      pricelist_id: professionalPricelist.id,
      cost_price: 1200,
      retail_price: 1899,
      markup_percentage: 58,
      content: 'Touch-responsive, educational software included, durable design',
    },
    {
      name: 'Classroom Audio System',
      description: 'Sound reinforcement for better learning',
      category_id: 'education',
      pricelist_id: basicPricelist.id,
      cost_price: 400,
      retail_price: 649,
      markup_percentage: 62,
      content: 'Improves student attention, wireless microphone, easy installation',
    },
    {
      name: 'Document Camera',
      description: 'High-resolution document and object camera',
      category_id: 'education',
      pricelist_id: premiumPricelist.id,
      cost_price: 250,
      retail_price: 399,
      markup_percentage: 60,
      content: 'USB connectivity, zoom capability, annotation features',
    },
    {
      name: 'Lecture Capture System',
      description: 'Automated recording system for lectures',
      category_id: 'education',
      pricelist_id: professionalPricelist.id,
      cost_price: 2000,
      retail_price: 3199,
      markup_percentage: 60,
      content: 'Automatic recording, cloud storage, student access portal',
    },

    // Club products
    {
      name: 'DJ Booth Sound System',
      description: 'Professional DJ and entertainment system',
      category_id: 'club',
      pricelist_id: professionalPricelist.id,
      cost_price: 3000,
      retail_price: 4999,
      markup_percentage: 67,
      content: 'High-power output, mixing capabilities, club-grade durability',
    },
    {
      name: 'LED Light Show System',
      description: 'Dynamic lighting for entertainment venues',
      category_id: 'club',
      pricelist_id: professionalPricelist.id,
      cost_price: 1800,
      retail_price: 2999,
      markup_percentage: 67,
      content: 'Color-changing, sound-reactive, DMX control, energy efficient',
    },
    {
      name: 'VIP Booth Audio System',
      description: 'Premium audio for VIP areas',
      category_id: 'club',
      pricelist_id: premiumPricelist.id,
      cost_price: 800,
      retail_price: 1299,
      markup_percentage: 62,
      content: 'Intimate sound experience, volume control, stylish design',
    },
    {
      name: 'Security Camera System',
      description: 'Comprehensive surveillance for venues',
      category_id: 'club',
      pricelist_id: professionalPricelist.id,
      cost_price: 1000,
      retail_price: 1699,
      markup_percentage: 70,
      content: 'Night vision, remote monitoring, high-resolution recording',
    },
  ];

  // Seed products
  console.log('Seeding products...');
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
    console.log(`Created product: ${product.name}`);
  }

  console.log('Database seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
