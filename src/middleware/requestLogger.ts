import type { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

export const requestLogger = () => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const message = `${req.method} ${req.originalUrl}`;
    logger.info(message);
    next();
  };
};
