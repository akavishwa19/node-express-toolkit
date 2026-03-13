import { dbClient } from '../client';
import {
  CREATE_MIGRATION_TABLE,
  FETCH_APPLIED_MIGRATIONS,
  UPDATE_MIGRATIONS
} from './sql';
import { RowDataPacket } from 'mysql2';
import { Migrations } from './types';
import { migrationVersions } from './versionTracker';
import logger from '../../utils/logger';
import type { Logger } from 'pino';

const fetchLatestAppliedMigration = async (): Promise<number> => {
  const [rows] = await dbClient.query<RowDataPacket[]>(
    FETCH_APPLIED_MIGRATIONS
  );
  const migrations = rows as Migrations[];
  const latestMigrationVersion =
    migrations.length === 0
      ? 0
      : migrations.sort((a, b) => b.version - a.version)[0]!.version;
  return latestMigrationVersion;
};

const applyMigrations = async (logger: Logger) => {
  const { latestVersion, targetVersion } = await getDiff();
  if (latestVersion === targetVersion) {
    logger.info('database is already up to date');
  }
  for (let idx = latestVersion + 1; idx <= targetVersion; idx++) {
    await applyMigration(migrationVersions[idx - 1]!.sql);
    await updateMigrationsTable(
      migrationVersions[idx - 1]!.version,
      migrationVersions[idx - 1]!.name
    );
  }
};

const updateMigrationsTable = async (version: number, name: string) => {
  logger.info('applying migration: ' + name);
  const values = [version, name];
  await dbClient.query(UPDATE_MIGRATIONS, values);
};

const applyMigration = async (sql: string) => {
  await dbClient.query(sql);
};

const getDiff = async () => {
  const latestVersion = await fetchLatestAppliedMigration();
  const targetVersion =
    migrationVersions[migrationVersions.length - 1]!.version;
  logger.info(
    `comparing current schema version: ${latestVersion} with expected schema version: ${targetVersion}`
  );
  return {
    latestVersion,
    targetVersion
  };
};

const runMigrations = async () => {
  logger.info('starting db schema migration');
  await dbClient.query(CREATE_MIGRATION_TABLE);
  await applyMigrations(logger);
  logger.info('finished db schema migration');
};

export { runMigrations };
