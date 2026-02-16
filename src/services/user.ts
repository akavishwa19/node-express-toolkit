import { v4 as uuidv4 } from 'uuid';
import { Users } from '../models/user';
import { User, UserPayload } from '../types/user';
import { AppError, DbError, isDbError } from '../utils/error';

export class UserService {
  static async create(payload: UserPayload): Promise<string> {
    try {
      const id = uuidv4();
      await Users.insert(id, payload);
      return id;
    } catch (error) {
      if (isDbError(error)) {
        throw new DbError(error.code, error.errno, error.sqlMessage, 400);
      }
      throw new AppError('Cant perform operation into DB', 500);
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
    } catch (error) {
      if (isDbError(error)) {
        throw new DbError(error.code, error.errno, error.sqlMessage, 400);
      }
      throw new AppError('Cant perform operation into DB', 500);
    }
  }

  static async get(id: string): Promise<User | null> {
    try {
      const data = await Users.get(id);
      return data;
    } catch (error) {
      if (isDbError(error)) {
        throw new DbError(error.code, error.errno, error.sqlMessage, 400);
      }
      throw new AppError('Cant perform operation into DB', 500);
    }
  }

  static async list(): Promise<User[]> {
    try {
      const data = await Users.list();
      return data;
    } catch (error) {
      if (isDbError(error)) {
        throw new DbError(error.code, error.errno, error.sqlMessage, 400);
      }
      throw new AppError('Cant perform operation into DB', 500);
    }
  }

  static async delete(id: string): Promise<string> {
    const existing = await Users.get(id);
    if (!existing) {
      throw new Error('does not exist');
    }
    try {
      await Users.delete(id);
      return id;
    } catch (error) {
      if (isDbError(error)) {
        throw new DbError(error.code, error.errno, error.sqlMessage, 400);
      }
      throw new AppError('Cant perform operation into DB', 500);
    }
  }
}
