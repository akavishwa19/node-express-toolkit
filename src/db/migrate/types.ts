export interface Migrations {
  version: number;
  name: string;
  created_at: Date;
}

export interface MigrationVersions extends Omit<Migrations, 'created_at'> {
  sql: string;
}
