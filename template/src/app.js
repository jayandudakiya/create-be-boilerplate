import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler.js';

// --------------------------------
//   import Routes
// --------------------------------
import routes from './routes/index.js';

// --------------------------------
// Initialize Express app
// --------------------------------
const app = express();

// --------------------------------
// Middlewares
// --------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');

const corsOptions = {
  origin: allowedOrigins || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// --------------------------------
// Routes
// --------------------------------
app.use('/api', routes);

// --------------------------------
// Error handling middleware (always last)
// --------------------------------
app.use(errorHandler);

export default app;
