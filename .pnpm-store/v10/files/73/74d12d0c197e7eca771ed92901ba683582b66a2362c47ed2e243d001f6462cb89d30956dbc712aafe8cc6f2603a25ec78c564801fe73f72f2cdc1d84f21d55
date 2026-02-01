import { ExpoSQLiteDatabase } from "./driver.cjs";
import { MigratorInitFailResponse } from "../migrator.cjs";
import { AnyRelations, EmptyRelations } from "../relations.cjs";

//#region src/expo-sqlite/migrator.d.ts
interface MigrationConfig {
  migrations: Record<string, string>;
}
declare function migrate<TSchema extends Record<string, unknown>, TRelations extends AnyRelations = EmptyRelations>(db: ExpoSQLiteDatabase<TSchema, TRelations>, config: MigrationConfig): Promise<void | MigratorInitFailResponse>;
interface State {
  success: boolean;
  error?: Error;
}
declare const useMigrations: (db: ExpoSQLiteDatabase<any, any>, migrations: {
  journal: {
    entries: {
      idx: number;
      when: number;
      tag: string;
      breakpoints: boolean;
    }[];
  };
  migrations: Record<string, string>;
}) => State;
//#endregion
export { migrate, useMigrations };
//# sourceMappingURL=migrator.d.cts.map