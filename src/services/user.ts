import { v4 as uuidv4 } from 'uuid';
import { Users } from '../models/user';
import { User, UserPayload } from '../types/user';
import { AppError } from '../utils/error';

export class UserService {
  static async create(payload: UserPayload): Promise<string> {
    try {
      const id = uuidv4();
      await Users.insert(id, payload);
      return id;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      }
      throw new AppError('Unknown error occured', 500);
    }
  }

  static async update(id: string, payload: UserPayload): Promise<string> {
    const existing = await Users.get(id);
    if (!existing) {
      throw new AppError('User with provided id doesnt exist', 404);
    }
    try {
      await Users.update(id, payload);
      return id;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      }
      throw new AppError('Unknown error occured', 500);
    }
  }

  static async get(id: string): Promise<User> {
    try {
      const data = await Users.get(id);
      if (!data) {
        throw new AppError('User does not exist', 404);
      }
      return data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error; // Re-throw AppError as-is (preserves 404, etc.)
      }
      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      }
      throw new AppError('Unknown error occured', 500);
    }
  }

  static async list(): Promise<User[]> {
    try {
      const data = await Users.list();
      return data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      }
      throw new AppError('Unknown error occured', 500);
    }
  }

  static async delete(id: string): Promise<string> {
    const existing = await Users.get(id);
    if (!existing) {
      throw new AppError('User does not exist', 404);
    }
    try {
      await Users.delete(id);
      return id;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      }
      throw new AppError('Unknown error occured', 500);
    }
  }
}
