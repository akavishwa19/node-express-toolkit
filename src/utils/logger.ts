import pino from 'pino';

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    destination: 1
  }
});

const options =
  process.env.NODE_ENV === 'development' ? { level: 'trace' } : {};

const logger = pino(options, transport);

export default logger;
