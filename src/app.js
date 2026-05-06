import express from 'express';

const app = express();

// Built-in middleware to parse JSON bodies
app.use(express.json())

export default app