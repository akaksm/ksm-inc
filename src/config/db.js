import mongoose from 'mongoose';
import { mongo_uri } from './index.js';

const connectDb = () => mongoose.connect(mongo_uri,
    console.log(`MongoDB connected.`)
)

export default connectDb;