import express, { Express } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app: Express = express();

// CORS configuration
const corsOptions = {
  origin: config.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

export default app;
