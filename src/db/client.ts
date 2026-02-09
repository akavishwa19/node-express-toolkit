import mysql, { PoolOptions } from 'mysql2/promise'

const dbConfig: PoolOptions = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

const dbClient = mysql.createPool(dbConfig)

const connectToDb = async (): Promise<void> => {
  try {
    const connection = await dbClient.getConnection()
    console.log('connected to database')
    connection.release()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export { dbClient, connectToDb }
