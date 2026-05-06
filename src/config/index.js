import dotenv from 'dotenv/config';

const requiredEnvVariables = [
    'PORT',
    'MONGO_URI'
];

for (const key of requiredEnvVariables) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

export const port = process.env.PORT;
export const mongo_uri = process.env.MONGO_URI;