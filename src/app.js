import express from 'express';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';
import venueRouter from './modules/venue/venue.routes.js';
import screenRouter from './modules/screen/screen.routes.js';

const app = express();

// Built-in middleware to parse JSON bodies
app.use(express.json())

// Router
app.use('/api/v1/venues', venueRouter)
app.use('/api/v1/screens', screenRouter)

// url not found handler
app.use(notFoundHandler)

// global error handler
app.use(errorHandler)

export default app