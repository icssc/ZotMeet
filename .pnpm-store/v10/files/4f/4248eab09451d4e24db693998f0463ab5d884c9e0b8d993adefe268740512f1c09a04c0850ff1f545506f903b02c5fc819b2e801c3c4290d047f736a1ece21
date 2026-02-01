import { SingleStoreRemoteDatabase } from "./driver.cjs";
import { MigrationConfig } from "../migrator.cjs";
import { AnyRelations } from "../relations.cjs";

//#region src/singlestore-proxy/migrator.d.ts
type ProxyMigrator = (migrationQueries: string[]) => Promise<void>;
declare function migrate<TSchema extends Record<string, unknown>, TRelations extends AnyRelations>(db: SingleStoreRemoteDatabase<TSchema, TRelations>, callback: ProxyMigrator, config: MigrationConfig): Promise<{
  exitCode: "databaseMigrations";
} | {
  exitCode: "localMigrations";
} | undefined>;
//#endregion
export { ProxyMigrator, migrate };
//# sourceMappingURL=migrator.d.cts.map