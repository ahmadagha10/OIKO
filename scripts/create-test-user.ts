import { config } from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';

// Load environment variables
config({ path: '.env.local' });

const testUser = {
  email: 'test@oiko.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User',
  phone: '+966500000000',
  role: 'customer' as const,
  fragmentPoints: 0,
};

const adminUser = {
  email: 'admin@oiko.com',
  password: 'admin123',
  firstName: 'Admin',
  lastName: 'User',
  phone: '+966500000001',
  role: 'admin' as const,
  fragmentPoints: 0,
};

async function createTestUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingTestUser = await User.findOne({ email: testUser.email });
    if (existingTestUser) {
      console.log('⚠️  Test user already exists:', testUser.email);
    } else {
      const createdTestUser = await User.create(testUser);
      console.log('✅ Test user created successfully:');
      console.log('   Email:', testUser.email);
      console.log('   Password:', testUser.password);
      console.log('   ID:', createdTestUser._id);
    }

    // Check if admin user already exists
    const existingAdminUser = await User.findOne({ email: adminUser.email });
    if (existingAdminUser) {
      console.log('⚠️  Admin user already exists:', adminUser.email);
    } else {
      const createdAdminUser = await User.create(adminUser);
      console.log('✅ Admin user created successfully:');
      console.log('   Email:', adminUser.email);
      console.log('   Password:', adminUser.password);
      console.log('   ID:', createdAdminUser._id);
    }

    console.log('\n📋 You can now log in with:');
    console.log('   Test User:');
    console.log('     Email: test@oiko.com');
    console.log('     Password: password123');
    console.log('   Admin User:');
    console.log('     Email: admin@oiko.com');
    console.log('     Password: admin123');

    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    process.exit(1);
  }
}

createTestUsers();
