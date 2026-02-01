import { DrizzleSqliteDODatabase } from "./driver.cjs";
import { MigratorInitFailResponse } from "../migrator.cjs";
import { AnyRelations } from "../relations.cjs";

//#region src/durable-sqlite/migrator.d.ts
interface MigrationConfig$1 {
  migrations: Record<string, string>;
}
declare function migrate<TSchema extends Record<string, unknown>, TRelations extends AnyRelations>(db: DrizzleSqliteDODatabase<TSchema, TRelations>, config: MigrationConfig$1): Promise<void | MigratorInitFailResponse>;
//#endregion
export { migrate };
//# sourceMappingURL=migrator.d.cts.map