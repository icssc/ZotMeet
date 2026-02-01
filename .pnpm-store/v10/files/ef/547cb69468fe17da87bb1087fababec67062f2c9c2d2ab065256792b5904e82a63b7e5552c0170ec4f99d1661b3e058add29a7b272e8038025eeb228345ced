import { SqliteRemoteDatabase } from "./driver.js";
import { MigrationConfig } from "../migrator.js";
import { AnyRelations } from "../relations.js";

//#region src/sqlite-proxy/migrator.d.ts
type ProxyMigrator = (migrationQueries: string[]) => Promise<void>;
declare function migrate<TSchema extends Record<string, unknown>, TRelations extends AnyRelations>(db: SqliteRemoteDatabase<TSchema, TRelations>, callback: ProxyMigrator, config: MigrationConfig): Promise<{
  exitCode: "databaseMigrations";
} | {
  exitCode: "localMigrations";
} | undefined>;
//#endregion
export { ProxyMigrator, migrate };
//# sourceMappingURL=migrator.d.ts.map