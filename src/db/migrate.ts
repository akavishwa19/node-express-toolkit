import { dbClient } from './client'

const CURRENT_SCHEMA_VERSION = 1

const CREATE_TABLE_USERS = `
create table if not exists users(
    id varchar(36) primary key,
    username varchar(50) unique,
    email varchar(100) unique,
    password varchar(100),
    age int,
    created_at timestamp default current_timestamp,
    updated_at timestamp on update current_timestamp default null,
    is_active boolean default true
);
`

const onSchemaInit = async () => {
  await dbClient.query(CREATE_TABLE_USERS)
}

const onSchemaMigration = async (schemaVersion: number) => {
  if (schemaVersion > CURRENT_SCHEMA_VERSION) {
    await dbClient.query(CREATE_TABLE_USERS)
  }
}

export { onSchemaInit, onSchemaMigration }
