import { entityKind } from "../entity.js";
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import { AnyRelations, EmptyRelations } from "../relations.js";
import { DatabasePromise } from "@tursodatabase/database-common";

//#region src/tursodatabase/driver-core.d.ts
type TursoDatabaseRunResult = Awaited<ReturnType<ReturnType<DatabasePromise['prepare']>['run']>>;
declare class TursoDatabaseDatabase<TSchema extends Record<string, unknown> = Record<string, never>, TRelations extends AnyRelations = EmptyRelations> extends BaseSQLiteDatabase<'async', TursoDatabaseRunResult, TSchema, TRelations> {
  static readonly [entityKind]: string;
}
//#endregion
export { TursoDatabaseDatabase, TursoDatabaseRunResult };
//# sourceMappingURL=driver-core.d.ts.map