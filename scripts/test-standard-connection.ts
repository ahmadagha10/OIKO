import { config } from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
config({ path: '.env.local' });

async function testStandardConnection() {
  console.log('🔌 Testing with standard MongoDB connection string...');

  // Standard connection string (not SRV) - bypasses TXT record lookup
  const standardUri = 'mongodb://ahmad:ahmad2013@ac-belzjcj-shard-00-00.afdafvm.mongodb.net:27017,ac-belzjcj-shard-00-01.afdafvm.mongodb.net:27017,ac-belzjcj-shard-00-02.afdafvm.mongodb.net:27017/oiko?replicaSet=atlas-10wqrd-shard-0&ssl=true&authSource=admin';

  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(standardUri, options);
    console.log('✅ MongoDB connection successful!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name).join(', ') || 'None');

    await mongoose.connection.close();
    console.log('\n✅ Standard connection works!');
    console.log('💡 The issue is with TXT record lookup for mongodb+srv://');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testStandardConnection();
