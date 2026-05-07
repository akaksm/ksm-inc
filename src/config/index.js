import 'dotenv/config';
import AppError from '../utils/AppError.js';

const requiredEnvVariables = [
    'PORT',
    'MONGO_URI',
    'NODE_ENV'
];

for (const key of requiredEnvVariables) {
    if (!process.env[key]) {
        throw new AppError(`Missing required environment variable: ${key}`);
    }
}

export const port = process.env.PORT;
export const mongo_uri = process.env.MONGO_URI;
export const node_env = process.env.NODE_ENV;