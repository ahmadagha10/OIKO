import { config } from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
config({ path: '.env.local' });

async function testConnection() {
  console.log('🔌 Testing MongoDB connection...');
  console.log('📍 MongoDB URI:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@')); // Hide password

  try {
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGODB_URI as string, options);
    console.log('✅ MongoDB connection successful!');
    console.log('📊 Database:', mongoose.connection.db?.databaseName);

    // List collections
    const collections = await mongoose.connection.db!.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name).join(', ') || 'None');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ MongoDB connection failed!');
    console.error('Error:', error.message);

    if (error.message.includes('ETIMEOUT') || error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Troubleshooting steps:');
      console.log('   1. Check if your MongoDB Atlas cluster is running');
      console.log('   2. Whitelist your IP in MongoDB Atlas Network Access');
      console.log('   3. Verify your connection string is correct');
      console.log('   4. Check your internet connection');
    } else if (error.message.includes('Authentication failed')) {
      console.log('\n💡 Authentication issue:');
      console.log('   - Check your database username and password');
      console.log('   - Make sure the user has proper permissions');
    }

    process.exit(1);
  }
}

testConnection();
