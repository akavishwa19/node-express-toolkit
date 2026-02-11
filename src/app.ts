import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import logger from './utils/logger';
import { Server } from 'http';
import { connectToDb } from './db/client';
import validateEnvs from './utils/validateEnv';

const app = express();

app.use(express.json());
app.use(cors());

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

const startServer = async () => {
  await connectToDb();
  server = app.listen(port, () => {
    logger.info('app listening on http://localhost:' + port);
  });
};

function stopServer(signal: string, code: number) {
  logger.info(`recieved ${signal} , stopping server gracefully`);
  if (server) {
    server.close(() => {
      logger.info('server closed succesfully');
      process.exit(code);
    });
  } else {
    process.exit(code);
  }
}

process.once('SIGINT', () => {
  stopServer('SIGINT', 0);
});

process.once('SIGTERM', () => {
  stopServer('SIGTERM', 0);
});

process.on('uncaughtException', (error) => {
  logger.error({ error }, 'uncaught exception');
  stopServer('UNCAUGHT_EXCEPTION', 1);
});

process.on('unhandledRejection', (error) => {
  logger.error({ error }, 'unhandled rejection');
  stopServer('UNHANDLED_REJECTION', 1);
});

if (process.env.NODE_ENV !== 'test') {
  bootstrapApplication();
}

async function bootstrapApplication() {
  try {
    validateEnvs();
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

export { bootstrapApplication };
