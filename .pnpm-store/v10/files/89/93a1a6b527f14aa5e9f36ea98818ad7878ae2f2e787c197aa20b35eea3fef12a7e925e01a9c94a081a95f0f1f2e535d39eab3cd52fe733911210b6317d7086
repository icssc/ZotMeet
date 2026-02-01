import { SQLiteCloudDatabase } from "./driver.cjs";
import { MigrationConfig, MigratorInitFailResponse } from "../migrator.cjs";
import { AnyRelations } from "../relations.cjs";

//#region src/sqlite-cloud/migrator.d.ts
declare function migrate<TSchema extends Record<string, unknown>, TRelations extends AnyRelations>(db: SQLiteCloudDatabase<TSchema, TRelations>, config: MigrationConfig): Promise<void | MigratorInitFailResponse>;
//#endregion
export { migrate };
//# sourceMappingURL=migrator.d.cts.map