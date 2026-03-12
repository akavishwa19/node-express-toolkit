import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';
import { ZodSchema } from 'zod';

export const schemaValidation = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError('Invalid payload', 400);
      }
      throw new AppError('Unknown error occured', 500);
    }
  };
};
