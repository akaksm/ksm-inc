import mongoose from 'mongoose';

const dbUrl = process.env.DB_URL;

const configDb = mongoose.connect(dbUrl)

export default configDb