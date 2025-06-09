import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { errorMiddleware } from './middlewares/error.js';
import userRoutes from './routes/user.route.js';
import jobRoutes from './routes/job.route.js';
import applicationRoutes from './routes/application.route.js';
import subscriptionRoutes from './routes/subscription.route.js';

config({
    path: './data/config.env'
});

const app = express();

// NOTE: If using index.js as your main entry point, configure CORS there and avoid duplicate/conflicting CORS setup here.

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobRoutes);
app.use('/api/v1/application', applicationRoutes);
app.use('/api/v1/subscription', subscriptionRoutes);

// Error handling
app.use(errorMiddleware);

export default app;