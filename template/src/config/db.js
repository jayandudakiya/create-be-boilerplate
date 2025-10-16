import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/backend-temp-db'
    );
    console.log(`MongoDB connected successfully! at ${conn.connection.host}`);
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;
