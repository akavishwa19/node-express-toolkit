import pino from 'pino';

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    destination: 1
  }
});

const logger = pino(transport);

export default logger;
