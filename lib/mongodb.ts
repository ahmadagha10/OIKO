import mongoose from 'mongoose';

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // If connecting, wait for it
  if (mongoose.connection.readyState === 2) {
    await new Promise<void>((resolve) => {
      mongoose.connection.once('connected', resolve);
    });
    return mongoose;
  }

  // New connection
  await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
    maxPoolSize: 1,
    serverSelectionTimeoutMS: 5000,
  });

  console.log('✅ MongoDB connected successfully');
  return mongoose;
}

export default connectDB;
