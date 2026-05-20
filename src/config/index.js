import 'dotenv/config';

const requiredEnvVariables = [
    'PORT',
    'MONGO_URI',
    'NODE_ENV',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS',
    'EMAIL_FROM',
    'CLIENT_URL'
];

for (const key of requiredEnvVariables) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

export const port = process.env.PORT;
export const mongo_uri = process.env.MONGO_URI;
export const node_env = process.env.NODE_ENV;
export const jwt_secret = process.env.JWT_SECRET;
export const jwt_expires_in = process.env.JWT_EXPIRES_IN;
export const email_host = process.env.EMAIL_HOST;
export const email_port = process.env.EMAIL_PORT;
export const email_user = process.env.EMAIL_USER;
export const email_pass = process.env.EMAIL_PASS;
export const email_from = process.env.EMAIL_FROM;
export const client_url = process.env.CLIENT_URL;