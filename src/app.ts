import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import logger from './utils/logger';
import { Server } from 'http';
import { connectToDb } from './db/client';
import validateEnvs from './utils/validateEnv';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import router from './routes';
import swaggerRouter from './config/openapi';
import { requestLogger } from './middleware/requestLogger';
import { runMigrations } from './db/migrate';
import { gloabalLimiter } from './middleware/rateLimit';
// import {
//   connectProducer,
//   publishToTopic,
//   disconnectProducer
// } from './kafkaProducer';
// import { connectConsumer ,listenToTopic , disconnectConsumer } from './kafkaConsumer';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(gloabalLimiter);
app.use(requestLogger());

app.get('/healthz', (req: Request, res: Response) => {
  logger.info('incoming request for /healthz');
  res.status(200).send({
    host: req.host,
    method: req.method,
    status: 'healthy',
    code: 200
  });
});

const port = process.env.PORT;
let server: Server | undefined;

function setupRoutes() {
  app.use('/api-docs', swaggerRouter);
  app.use('/api/v1', router);
  app.use(globalErrorHandler);
}

const startServer = async () => {
  validateEnvs();
  setupRoutes();
  await connectToDb();
  await runMigrations();
  // await connectProducer();
  // await connectConsumer();
  // await publishToTopic('test-topic', 'test-message');
  // await listenToTopic('test-topic');
  server = app.listen(port, () => {
    logger.info('app listening on http://localhost:' + port);
  });
};

async function stopServer(signal: string, code: number) {
  logger.info(`recieved ${signal} , stopping server gracefully`);

  try {
    // await disconnectProducer();
    // await disconnectConsumer();
  } catch (error) {
    logger.error({ error }, 'Error disconnecting kafka , force quitting app');
  }

  if (server) {
    server.close(() => {
      logger.info('server closed succesfully');
      process.exit(code);
    });
  } else {
    process.exit(code);
  }
}

process.once('SIGINT', async () => {
  await stopServer('SIGINT', 0);
});

process.once('SIGTERM', async () => {
  await stopServer('SIGTERM', 0);
});

process.on('uncaughtException', async (error) => {
  logger.error({ error }, 'uncaught exception');
  await stopServer('UNCAUGHT_EXCEPTION', 1);
});

process.on('unhandledRejection', async (error) => {
  logger.error({ error }, 'unhandled rejection');
  await stopServer('UNHANDLED_REJECTION', 1);
});

async function bootstrapApplication() {
  try {
    await startServer();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(
        { message: error.message, stack: error.stack },
        'failed to bootstrap application'
      );
    } else {
      logger.error({ error }, 'failed to bootstrap application');
    }
    stopServer('STARTUP_ERROR', 1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  bootstrapApplication();
}

export { bootstrapApplication };
