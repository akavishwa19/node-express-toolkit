import { dbClient } from '../db/client';
import { User, UserPayload } from '../types/user';
import { RowDataPacket } from 'mysql2';

export class Users {
  static columns = [
    'id',
    'username',
    'email',
    'age',
    'created_at',
    'updated_at',
    'is_active'
  ];

  static selectColumns(): string {
    return `${this.columns.join(',')}`;
  }

  static rowToUser(row: RowDataPacket): User {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      age: row.age,
      created_at: row.created_at,
      updated_at: row.updated_at,
      is_active: !!row.is_active
    };
  }

  static async insert(id: string, payload: UserPayload): Promise<string> {
    const sql = `insert into users (id,username,email,password,age) values (
             ? , ? , ? , ? , ?
        )`;

    const values = [
      id,
      payload.username,
      payload.email,
      payload.password,
      payload.age
    ];

    await dbClient.query(sql, values);
    return id;
  }

  static async update(id: string, payload: UserPayload): Promise<string> {
    const sql = `update users set username = ? , email = ? , password = ? , age = ?
            where id = ?;
        `;

    const values = [
      payload.username,
      payload.email,
      payload.password,
      payload.age,
      id
    ];

    await dbClient.query(sql, values);
    return id;
  }

  static async delete(id: string): Promise<void> {
    const sql = `delete from users
            where id = ?;
        `;

    const values = [id];
    await dbClient.query(sql, values);
  }

  static async get(id: string): Promise<User | null> {
    const sql = `select ${this.selectColumns()} from users
            where id = ?;
        `;

    const values = [id];
    const [rows] = await dbClient.query<RowDataPacket[]>(sql, values);
    const firstRow = rows[0];

    if (!firstRow) {
      return null;
    }

    return this.rowToUser(firstRow);
  }

  static async list(): Promise<User[]> {
    const sql = `select ${this.selectColumns()} from users;
        `;

    const [rows] = await dbClient.query<RowDataPacket[]>(sql);
    return rows.map((row: RowDataPacket) => this.rowToUser(row));
  }
}
