import { AppError, DbError } from '../utils/error';
import type { ErrorRequestHandler } from 'express';
import logger from '../utils/logger';

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  if (error instanceof DbError) {
    logger.error({ error }, error.message);
    return res.status(error.httpCode).json({
      status: 'error',
      message: error.message
    });
  }

  if (error instanceof AppError) {
    logger.error({ error }, error.message);
    return res.status(error.httpCode).json({
      status: 'error',
      message: error.message
    });
  }

  logger.error({ error }, 'Internal server error');
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};
