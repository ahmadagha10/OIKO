/**
 * Script to promote a user to admin role
 * Usage: ts-node scripts/make-admin.ts <email>
 */

import mongoose from 'mongoose';
import User from '../models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ahmad:ahmad2013@oiko.afdafvm.mongodb.net/oiko?retryWrites=true&w=majority';

async function makeAdmin(email: string) {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`❌ User not found with email: ${email}`);
      process.exit(1);
    }

    // Check if already admin
    if (user.role === 'admin') {
      console.log(`ℹ️  User ${email} is already an admin`);
      process.exit(0);
    }

    // Update to admin
    user.role = 'admin';
    await user.save();

    console.log(`✅ Successfully promoted ${email} to admin`);
    console.log(`User details:
  - Name: ${user.firstName} ${user.lastName}
  - Email: ${user.email}
  - Role: ${user.role}
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Usage: ts-node scripts/make-admin.ts <email>');
  console.error('Example: ts-node scripts/make-admin.ts admin@example.com');
  process.exit(1);
}

makeAdmin(email);
