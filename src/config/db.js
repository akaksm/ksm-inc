import mongoose from 'mongoose';
import { mongo_uri } from './index.js';

export const connectDb = async () => {
    try {
        await mongoose.connect(mongo_uri)
        console.log('MongoDB connected.')
    } catch (err) {
        console.error('MongoDB connection failed:', err.message)
        process.exit(1)
    }
}

export default connectDb;