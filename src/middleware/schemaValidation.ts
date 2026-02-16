import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';
import { ZodSchema } from 'zod';
import logger from '../utils/logger';

export const schemaValidation = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      logger.info(error);
      throw new AppError('Invalid payload for given request', 400);
    }
  };
};
