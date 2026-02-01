import { LibSQLDatabase } from "./driver-core.cjs";
import "./driver.cjs";
import { MigrationConfig } from "../migrator.cjs";
import { AnyRelations } from "../relations.cjs";

//#region src/libsql/migrator.d.ts
declare function migrate<TSchema extends Record<string, unknown>, TRelations extends AnyRelations>(db: LibSQLDatabase<TSchema, TRelations>, config: MigrationConfig): Promise<{
  exitCode: "databaseMigrations";
} | {
  exitCode: "localMigrations";
} | undefined>;
//#endregion
export { migrate };
//# sourceMappingURL=migrator.d.cts.map