import { MySqlRemoteDatabase } from "./driver.cjs";
import { MigrationConfig, MigratorInitFailResponse } from "../migrator.cjs";
import { AnyRelations } from "../relations.cjs";

//#region src/mysql-proxy/migrator.d.ts
type ProxyMigrator = (migrationQueries: string[]) => Promise<void>;
declare function migrate<TSchema extends Record<string, unknown>, TRelations extends AnyRelations>(db: MySqlRemoteDatabase<TSchema, TRelations>, callback: ProxyMigrator, config: MigrationConfig): Promise<void | MigratorInitFailResponse>;
//#endregion
export { ProxyMigrator, migrate };
//# sourceMappingURL=migrator.d.cts.map