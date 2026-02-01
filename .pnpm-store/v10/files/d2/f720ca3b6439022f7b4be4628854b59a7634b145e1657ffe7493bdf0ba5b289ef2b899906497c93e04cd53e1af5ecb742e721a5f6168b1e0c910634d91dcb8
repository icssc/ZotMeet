import { SQLiteBunDatabase } from "./driver.js";
import { MigrationConfig, MigrationFromJournalConfig, MigrationsJournal, MigratorInitFailResponse } from "../migrator.js";
import { AnyRelations, EmptyRelations } from "../relations.js";

//#region src/bun-sqlite/migrator.d.ts
declare function migrate<TSchema extends Record<string, unknown>, TRelations extends AnyRelations = EmptyRelations>(db: SQLiteBunDatabase<TSchema, TRelations>, config: MigrationConfig): void | MigratorInitFailResponse;
declare function migrate<TSchema extends Record<string, unknown>, TRelations extends AnyRelations = EmptyRelations>(db: SQLiteBunDatabase<TSchema, TRelations>, config: MigrationFromJournalConfig | MigrationsJournal): void;
//#endregion
export { migrate };
//# sourceMappingURL=migrator.d.ts.map