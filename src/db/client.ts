import mysql, { PoolOptions } from 'mysql2/promise';
import logger from '../utils/logger';

const dbConfig: PoolOptions = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const dbClient = mysql.createPool(dbConfig);

const connectToDb = async (): Promise<void> => {
  try {
    const connection = await dbClient.getConnection();
    logger.info('connected to database successfully');
    connection.release();
  } catch (error: unknown) {
    logger.error({ error }, 'error connecting to database');
    throw new Error('error connecting to database');
  }
};

export { dbClient, connectToDb };
