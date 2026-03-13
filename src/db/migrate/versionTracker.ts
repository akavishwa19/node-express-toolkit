import {
  ADD_PHONENUMBER_FOR_USERS,
  CREATE_TABLE_USERS,
  REMOVE_PHONENUMBER_FOR_USERS
} from './sql';
import { MigrationVersions } from './types';

export const migrationVersions: MigrationVersions[] = [
  {
    version: 1,
    name: 'create users table',
    sql: CREATE_TABLE_USERS
  },
  {
    version: 2,
    name: 'add phone number for users',
    sql: ADD_PHONENUMBER_FOR_USERS
  },
  {
    version: 3,
    name: 'remove phone number for users',
    sql: REMOVE_PHONENUMBER_FOR_USERS
  }
];
