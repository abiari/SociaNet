import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import { fileURLToPath } from 'url';
import { register } from './controllers/auth.js';
import { config } from './config/config.js';
import logger from './library/Logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

/* Connect to Mongo */
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    StartServer();
  })
  .catch((error: any) =>
    logger.error(`Connection to mongoDB failed: ${error}`)
  );

/* Only start the server if Mongo Connects */
const StartServer = () => {
  app.use((req, res, next) => {
    logger.info(
      `[${req.socket.remoteAddress}] - [${req.method}] - [${req.url}]`
    );
    res.on('finish', () => {
      logger.info(
        `[${req.socket.remoteAddress}] - [${req.method}] - [${req.url}] - Status: [${res.statusCode}]`
      );
    });
    next();
  });
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ limit: '30mb', extended: true }));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET'
      );
      return res.status(200).json({});
    }

    next();
  });

  app.use(helmet());
  app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
  app.use(morgan('common'));
  app.use(cors());
  app.use('/assets', express.static(path.join(__dirname, '/assets')));

  /* FILE STORAGE */
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/assets');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

  const upload = multer({ storage });

  /* ROUTES WITH FILES */
  app.post('/auth/register', upload.single('picture'), register);

  /* ROUTES */
  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);

  /* HealthCheck */
  app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
  });

  /* Error Handling */
  app.use((req, res) => {
    const error = new Error('Not Found');
    logger.error(error);

    res.status(404).json({ message: error.message });
  });

  app.listen(config.server.port, () =>
    logger.info(`Server is running on ${config.server.port}`)
  );
};
