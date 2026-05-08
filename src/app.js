import express from 'express';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Built-in middleware to parse JSON bodies
app.use(express.json())

// url not found handler
app.use(notFoundHandler)

// global error handler
app.use(errorHandler)

export default app