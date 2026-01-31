import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Import Product model
import Product from '../models/Product';

const products = [
  // HOODIES
  {
    name: "Cozy Hoodie",
    price: 199,
    description: "A warm and comfortable hoodie for everyday wear.",
    image: "/images/collections/cozyguyhoodie.png",
    category: "hoodies",
    colors: ["grey", "black"],
    sizes: ["S", "M", "L"],
    stock: 50,
    featured: true,
  },
  {
    name: "Winter Hoodie",
    price: 199,
    description: "A thick hoodie perfect for cold weather.",
    image: "/images/collections/winterhoodie.png",
    category: "hoodies",
    colors: ["white", "beige"],
    sizes: ["S", "M", "L"],
    stock: 45,
    featured: false,
  },
  // T-SHIRTS
  {
    name: "Classic T-Shirt",
    price: 149,
    description: "A classic t-shirt made from soft cotton.",
    image: "/images/collections/guytshirt.png",
    category: "tshirts",
    colors: ["black", "white"],
    sizes: ["S", "M", "L", "XL"],
    stock: 100,
    featured: true,
  },
  {
    name: "Graphic T-Shirt",
    price: 149,
    description: "A trendy t-shirt with a cool graphic design.",
    image: "/images/collections/sasuketshirt.png",
    category: "tshirts",
    colors: ["black", "white"],
    sizes: ["S", "M", "L", "XL"],
    stock: 80,
    featured: false,
  },
  // HATS
  {
    name: "Stylish Hat",
    price: 15.99,
    description: "A stylish hat to complete your outfit.",
    image: "/images/accessories/hats.png",
    category: "hats",
    colors: ["black", "brown"],
    sizes: ["One Size"],
    stock: 60,
    featured: false,
  },
  // SOCKS
  {
    name: "Comfortable Socks",
    price: 9.99,
    description: "Soft and comfortable socks for everyday wear.",
    image: "/images/accessories/socks.png",
    category: "socks",
    colors: ["white", "black", "gray"],
    sizes: ["S", "M", "L"],
    stock: 150,
    featured: false,
  },
  // TOTE BAGS
  {
    name: "Canvas Tote Bag",
    price: 24.99,
    description: "Durable canvas tote bag for shopping or daily use.",
    image: "/images/accessories/totebags.png",
    category: "totebags",
    colors: ["beige", "black"],
    sizes: ["One Size"],
    stock: 40,
    featured: false,
  },
];

async function seedProducts() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Cleared existing products');

    console.log('📦 Seeding products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Seeded ${createdProducts.length} products successfully!`);

    console.log('\n📊 Product Summary:');
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    productsByCategory.forEach((cat) => {
      console.log(`  - ${cat._id}: ${cat.count} products`);
    });

    console.log('\n✨ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedProducts();
